import { Request, Response } from "express";
import service from "../servicios/usuario.service.js";
import cursoService from "../servicios/curso.service.js";
import { Curso, Usuario } from "@prisma/client";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import { TokenInvalido } from "../excepciones/TokenError.js";
import validator from "validator";
import nodemailer from 'nodemailer';
import { templateHtml } from "../../lib/utils.js";
import usuarioService from "../servicios/usuario.service.js";
import { NotAuthorizedError } from "../excepciones/ServiceErrors.js";

/*
    Obtener usuario por id (opcionalmente con sus cursos)
*/
async function getUsuarioById(req: Request, res: Response) {

    try {
        const usuario = await service.getUsuarioById(req.params.idUsuario, req.query.cursos === 'true');
        res.status(200).json(usuario);

    } catch (error) {
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
        if (error instanceof InvalidValueError) return res.status(400).json({ error: error.message });
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }
}

/*
    Crear un usuario
*/
async function createUsuario(req: Request, res: Response) {

    const usuarioBody = req.body;

    if (!usuarioBody.nombre || !usuarioBody.correo || !usuarioBody.contrasena)
        return res.status(400).json({ error: "Faltan datos obligatorios" })

    const user = {
        nombre: usuarioBody.nombre,
        correo: usuarioBody.correo,
        contrasena: usuarioBody.contrasena
    }

    try {
        const newUser = await service.createUsuario(user as Usuario);
        // Guardo el JWT en la cookie (2 dias de duracion)
        res.cookie('token', newUser.token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 48 });
        return res.status(201).json(newUser);
    } catch (err) {
        if (err instanceof InvalidValueError) return res.status(400).json({ error: err.message });
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }
}

/*
    Actualizar un usuario
 */
async function updateUsuario(req: Request, res: Response) {

    const idUsuario = req.params.idUsuario;
    const { nombre, contrasena, superUser } = req.body;

    // si no hay nada para actualizar
    if (!nombre && !contrasena && superUser === undefined) return res.status(400).json({ error: 'El body no contiene los campos necesarios' });

    // get token from header
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Token expirado o no valido' });

    // update the user
    try {
        const userUpdated = await service.updateUsuario(token, idUsuario, nombre, contrasena, superUser);
        return res.status(201).json(userUpdated);
    } catch (error) {
        if (error instanceof InvalidValueError) return res.status(400).json({ error: error.message });
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
        if (error instanceof NotAuthorizedError) return res.status(401).json({ error: error.message });
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }

}

/*
    Eliminar un usuario
*/
async function deleteUsuario(req: Request, res: Response) {

    const idUsuario = req.params.idUsuario;

    // get token from header
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Token expirado o no valido' });

    // delete the user
    try {
        await service.deleteUsuario(token, idUsuario);
        return res.status(204).send();
    } catch (error) {
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
        if (error instanceof InvalidValueError) return res.status(400).json({ error: error.message });
        if (error instanceof NotAuthorizedError) return res.status(401).json({ error: error.message });
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }

}

/*
    Buscar participantes de un curso
*/
async function getParticipantes(req: Request, res: Response) {

    // offset is number && limit not number -> default limit
    // offset is number && limit is number-> ok
    // offset not number && limit is number -> offset=0
    let limit = req.query.limit ? parseInt(req.query.limit as string) || 0 : 0  // !isNaN(parseInt(req.params.limit)) ? parseInt(req.params.limit) : 0;
    let offset = req.query.offset ? parseInt(req.query.offset as string) || 0 : 0 // !isNaN(parseInt(req.params.offset)) ? parseInt(req.params.offset) : 0;

    if (limit < 0) limit = 0;
    if (offset < 0) offset = 0;

    const nombre = req.query.nombre ? req.query.nombre.toString() : '';


    try {
        const users = await service.getParticipantes(req.params.idCurso, nombre, limit, offset);
        res.status(200).json(users);
    } catch (error) {
        if (error instanceof InvalidValueError) res.status(400).json({ error: error.message });
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }

}

async function addParticipante(req: Request, res: Response) {

    const userBody = req.body;

    if (!userBody.id) return res.status(400).json({ error: "Faltan datos obligatorios" });

    try {
        await service.addParticipanteToCurso(req.params.idCurso, userBody.id);
        return res.status(204).send();
    } catch (error) {
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }

}

// Actualizar la contraseña de un usuario
async function updateUsuarioPassword(req: Request, res: Response) {

    const token = req.body.token;
    const newPass = req.body.contrasena;

    if (!token || !newPass)
        return res.status(400).json({ error: "Faltan datos obligatorios" });

    try {
        let userUpdated = await service.updateUsuarioPassword(req.params.idUsuario, newPass, token);
        return res.status(200).json(userUpdated);
    } catch (error) {
        if (error instanceof TokenInvalido) return res.status(401).send();
        if (error instanceof InvalidValueError) return res.status(400).json({ error: error.message });
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }

}

async function deleteAlumnoFromCurso(req: Request, res: Response) {

    const idAlumno = req.params.idAlumno;
    const idCurso = req.params.idCurso;

    // get token from header
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Token expirado o no valido' });

    try {
        await service.deleteAlumnoFromCurso(token, idCurso, idAlumno);
        return res.status(204).send();
    } catch (error) {
        if (error instanceof InvalidValueError) return res.status(400).json({ error: error.message }); // el docente no es docente del curso o ids invalidos
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
        if (error instanceof NotAuthorizedError) return res.status(401).json({ error: error.message });
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }
}

async function addOrSendInvitationToUsers(req: Request, res: Response) {

    const { emails, token, enviarInvitacionSiExiste } = req.body;
    const idCurso = req.params.idCurso;

    if (!emails || !token) return res.status(400).json({ error: 'Datos incompletos o incorrectos' });

    const correos = emails.filter((correo: string) => validator.default.isEmail(correo));

    let correosAEnviar = correos;

    try {

        // si no se quiere enviar la invitacion a aquellos que ya estan registrados
        if (!enviarInvitacionSiExiste) {

            const estadoCorreos = await service.getEstadoCorreos(correos);

            // obtener los usuarios que no estan registrados
            correosAEnviar = estadoCorreos.filter((obj) => !obj.registered).map((obj) => obj.correo);

            if (estadoCorreos.length > 0) {

                // anadir los que estan registrados
                const correosRegistrados = estadoCorreos.filter((obj) => obj.registered).map((obj) => `google|${obj.correo}`);
                await cursoService.addParticipantesToCurso(idCurso, correosRegistrados);
            }
        }

        if (correosAEnviar.length === 0) return res.status(204).send();

        const curso = await cursoService.getCursoById(idCurso);

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_USERNAME,
                clientId: process.env.OAUTH_CLIENTID,
                clientSecret: process.env.OAUTH_CLIENT_SECRET,
                refreshToken: process.env.OAUTH_REFRESH_TOKEN
            }
        });

        let mail = {
            from: process.env.MAIL_USERNAME,
            to: correosAEnviar,
            subject: `FlipBoard: Invitación a curso ${curso.nombre}`,
            html: templateHtml(`Para unirte al curso '${curso.nombre}', hace click <a href="${process.env.FRONTEND_URL}/api/cursos/${idCurso}?token=${token}">en este enlace</a>.`)
        }

        transporter.sendMail(mail, (error, body) => {
            if (error) return res.status(400).json({ error: error.message });
            return res.status(204).send();
        });


    } catch (error) {
        console.log(error)
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
        if (error instanceof InvalidValueError) return res.status(400).json({ error: error.message }); // ids invalidos
        return res.status(500).json({ error: 'Hubo un problema al enviar los correos o añadir los alumnos' });
    }

}

async function getAllUsuarios(req: Request, res: Response) {
    
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Token expirado o no valido' });

    let limit = req.query.limit ? parseInt(req.query.limit as string) || 0 : 0
    let offset = req.query.offset ? parseInt(req.query.offset as string) || 0 : 0
    const nombre = req.query.nombre ? req.query.nombre.toString() : '';

    if (limit < 0) limit = 0;
    if (offset < 0) offset = 0;

    try {
        const users = await service.getAllUsuarios(token, nombre, limit, offset);
        return res.status(200).json(users);
    } catch (error) {
        if (error instanceof NotAuthorizedError) return res.status(401).json({ error: error.message });
        return res.status(500).json({ error: "Ocurrio un problema inesperado" });
    }
}

export default { getUsuarioById, createUsuario, getParticipantes, addParticipante,
     updateUsuarioPassword, deleteAlumnoFromCurso, addOrSendInvitationToUsers, 
     updateUsuario, deleteUsuario, getAllUsuarios };
