import { Curso } from "@prisma/client";
import service from "../servicios/curso.service.js";
import { Request, Response } from "express";
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import validator from "validator";
import nodemailer from 'nodemailer';


/*
    Obtener curso por id
*/
async function getCursoById(req: Request, res: Response) {

    const idCurso = req.params.idCurso;
    try {
        const curso = await service.getCursoById(idCurso);
        return res.status(200).json(curso);

    } catch (error) {
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
        if (error instanceof InvalidValueError) return res.status(400).json({ error: error.message });
    }
}

/*
    Guardar curso
*/
async function saveCurso(req: Request, res: Response) {

    const cursoBody = req.body;

    // Verifico que las claves obligatiorias esten
    if (!cursoBody.nombre || !cursoBody.emailContacto || !cursoBody.docentes || cursoBody.docentes.length == 0) return res.status(400).json("Faltan datos obligatorios");

    const curso = {
        nombre: cursoBody.nombre,
        tema: cursoBody.tema, // si no existe tema, guarda undefined
        sitioWeb: cursoBody.sitioWeb, // si no existe sitio web, guarda undefined
        descripcion: cursoBody.descripcion, // si no existe descripcion, guarda undefined
        emailContacto: cursoBody.emailContacto,
        docentes: cursoBody.docentes // si no existe docentes, guarda undefined
    }

    try {
        const cursoSaved = await service.createCurso(curso as Curso);
        return res.status(201).json(cursoSaved);
    } catch (error) {
        if (error instanceof NotFoundError) return res.status(404).json(error.message); // No existe el docente
        if (error instanceof InvalidValueError) return res.status(400).json(error.message); // email invalido
    }


}

/*
    Obtener todos los cursos
*/
async function getCursos(req: Request, res: Response) {
    const cursos = await service.getCursos();
    return res.status(200).json(cursos);
}

// demas metodos 

async function sendEmailToUsers(req: Request, res: Response) {

    const { emails, token, idCurso, nombre } = req.body;
    
    if (!emails || !token || !idCurso || !nombre) return res.status(400).json({error: 'Datos incompletos o incorrectos'});

    const correos = emails.filter((correo: string) => validator.default.isEmail(correo));

    try {

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
            to: correos,
            subject: `FlipBoard: Invitación a curso ${nombre}`,
            html: `<p>Haga click <a href="http://${process.env.FRONTEND_URL}/api/cursos/${idCurso}?token=${token}">aquí</a> para unirse al curso: ${nombre}.</p>`
        }

        transporter.sendMail(mail, (error, body) => {
            if (error) return res.status(400).json({ error: error.message });
            return res.status(204).send();
        });


    } catch (error) {
        console.log(error)
        return res.status(400).json({error: 'Hubo un problema al enviar los correos'});
    }

}

async function deleteCursoById(req: Request, res: Response) {

    const idCurso = req.params.idCurso;
    const docente = req.query.docente;

    if (!docente) return res.status(400).json({ error: "Faltan datos obligatorios" });

    try {
        await service.deleteCursoById(idCurso, docente as string);
        return res.status(204).send();
    } catch (error) {
        if (error instanceof InvalidValueError) return res.status(400).json(error.message); // el docente no es docente del curso
        if (error instanceof NotFoundError) return res.status(404).json({ error: error.message });
    }
}

export default { getCursoById, saveCurso, getCursos, sendEmailToUsers, deleteCursoById };