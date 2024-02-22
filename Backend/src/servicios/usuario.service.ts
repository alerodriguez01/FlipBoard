import { Salt, Usuario } from "@prisma/client";
import { UsuarioRepository } from "../persistencia/repositorios/usuario.repo.js";
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import { SaltRepository } from "../persistencia/repositorios/salt.repo.js";
import jwt from 'jsonwebtoken';
import { TokenInvalido } from "../excepciones/TokenError.js";
import { CursoRepository } from "../persistencia/repositorios/curso.repo.js";
import { NotAuthorizedError } from "../excepciones/ServiceErrors.js";

const usuarioRepository = UsuarioRepository.getInstance();
const saltRepository = SaltRepository.getInstance();
const cursoRepository = CursoRepository.getInstance();

/*
    Obtener un usuario por id (opcionalmente con sus cursos)
*/
async function getUsuarioById(idUsuario: string, withCursos: boolean) {

    if (withCursos) {
        const usuario = await usuarioRepository.getUsuarioByIdWithCursos(idUsuario);
        if (!usuario) throw new NotFoundError('Usuario')
        return usuario;
    }

    const usuario = await usuarioRepository.getUsuarioById(idUsuario);
    if (!usuario) throw new NotFoundError('Usuario')
    return usuario;

}

/*
    Crear un usuario
*/
async function createUsuario(user: Usuario) {

    // check if mail is valid
    if (!validator.default.isEmail(user.correo))
        throw new InvalidValueError('Usuario', 'Correo');

    /**
     * Criterios password:
     *  - 8 caracteres minimo
     *  - 1 mayuscula
     *  - 1 numero
     */
    const pwd = user.contrasena;
    if (pwd.length < 8 || pwd.toLowerCase() === pwd || !pwd.match(/\d/))
        throw new InvalidValueError('Usuario', 'Contrasenia');

    // name is only letters and spaces
    if (!user.nombre.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/))
        throw new InvalidValueError('Usuario', 'Nombre o apellido');

    const salt = await bcryptjs.genSalt(15);
    const newUser = await usuarioRepository.createUsuario({
        ...user,
        contrasena: await bcryptjs.hash(user.contrasena, salt)
    });

    // newUser == null: no se pudo crear. Error con algun tipo de dato (el correo ya existe, violacion unique - PrismaClientKnownRequestError -)
    if (!newUser) throw new InvalidValueError('Usuario', 'Correo');

    // asincronico (esto es, una vez que se haya guardado el usuario, se inicia el guardado del salt, pero se continua con el return)
    const userSalt = {
        salt: salt,
        usuarioId: newUser.id
    } as Salt;
    saltRepository.createSalt(userSalt)

    // Generar JWT con la salt del usuario (en el payload no guardo el hash de la contrasena)
    const token = generateJWT(newUser);

    // retorno el usuario creado (aunque no haya terminado de guardar el salt)
    return { ...newUser, token };

}

/*
    Actualizar un usuario
*/
async function updateUsuario(token: string, idUsuario: string, nombre?: string, contrasena?: string, superUser?: boolean, correo?: string) {

    // decode token and get the if is superuser and its id
    let isSuperUser = false
    let superUserId = '';
    try {
        const payload = verifyJWT(token);
        isSuperUser = payload.superUser || false;
        superUserId = payload.id;
    } catch (error) {
        throw new NotAuthorizedError();
    }

    // if the user is not superuser and try to update another user
    if (!isSuperUser && superUserId !== idUsuario) throw new NotAuthorizedError();

    const user = await usuarioRepository.getUsuarioById(idUsuario);
    if (!user) throw new NotFoundError('Usuario');

    // name is only letters and spaces
    if (nombre && !nombre.match(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/))
        throw new InvalidValueError('Usuario', 'Nombre o apellido');

    if(correo && (!validator.default.isEmail(correo) || correo.startsWith('google|')))
        throw new InvalidValueError('Usuario', 'Correo');

    if (contrasena) {
        /**
         * Criterios password:
         *  - 8 caracteres minimo
         *  - 1 mayuscula
         *  - 1 numero
         */
        if (contrasena.length < 8 || contrasena.toLowerCase() === contrasena || !contrasena.match(/\d/))
            throw new InvalidValueError('Usuario', 'Contrasenia');
    }

    // hash password
    if (contrasena) {
        const salt = await saltRepository.getSaltByUsuarioId(idUsuario);
        if (!salt) throw new NotFoundError("Salt");

        contrasena = await bcryptjs.hash(contrasena, salt.salt);
    }

    return await usuarioRepository.updateUsuario(idUsuario, nombre, contrasena, superUser, correo);
}

/*
    Eliminar un usuario
*/
async function deleteUsuario(token: string, idUsuario: string) {

    // decode token and get the if is superuser and its id
    let isSuperUser = false
    try {
        const payload = verifyJWT(token);
        isSuperUser = payload.superUser || false;
    } catch (error) {
        throw new NotAuthorizedError();
    }

    // if the superuser is not superuser
    if (!isSuperUser) throw new NotAuthorizedError();

    return await usuarioRepository.deleteUsuario(idUsuario);
}

/*
    login de usuario
*/
type UsuarioWithJWT = Usuario & {
    token: string
}

async function login(correo: string, contrasena: string): Promise<UsuarioWithJWT> {

    // check if mail is valid
    if (!validator.default.isEmail(correo))
        throw new InvalidValueError('Usuario', 'Correo');

    /**
     * Criterios password:
     *  - 8 caracteres minimo
     *  - 1 mayuscula
     *  - 1 numero
     */
    if (contrasena.length < 8 || contrasena.toLowerCase() === contrasena || !contrasena.match(/\d/))
        throw new InvalidValueError('Usuario', 'Contrasenia');

    const usuario = await usuarioRepository.getUsuarioByCorreo(correo);

    if (!usuario) throw new InvalidValueError('Usuario', 'Correo o contrasena');

    const salt = await saltRepository.getSaltByUsuarioId(usuario.id);

    if (!salt) throw new InvalidValueError('Usuario', 'Correo o contrasena');

    const hash = await bcryptjs.hash(contrasena, salt.salt);

    if (usuario.contrasena !== hash) throw new InvalidValueError('Usuario', 'Correo o contrasena');

    // Generar JWT con la salt del usuario (en el payload no guardo el hash de la contrasena)
    const token = generateJWT(usuario);

    return { ...usuario, token };

}


// Funciones extras

function generateJWT(usuario: Usuario): string {

    // Generar JWT (en el payload no guardo el hash de la contrasena)
    const payload = {
        id: usuario.id,
        superUser: usuario.superUser,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY || "", { expiresIn: '48h' });

    return token;
}

function verifyJWT(token: string): Usuario {

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || "") as Usuario; // no contiene la contrasena hasheada
        return payload;

    } catch (error) {
        throw new TokenInvalido();
    }

}

function generateResetJWT(usuario: Usuario): string {
    return jwt.sign({ id: usuario.id }, process.env.JWT_SECRET_KEY || "", { expiresIn: '15m' });
}

async function loginProvider(provider: string, nombre: string, correo: string) {
    const usuario = await usuarioRepository.loginProvider(provider, nombre, correo);
    // Generar JWT con la salt del usuario (en el payload no guardo el hash de la contrasena)
    const token = generateJWT(usuario);
    return { ...usuario, token };
}

/**
 * 
 */
async function getParticipantes(idCurso: string, nombre: string, limit: number, offset: number) {

    //paginado
    if (!!limit || !!offset) {
        const users = await usuarioRepository.getUsuariosFromCursoByNombrePaginated(idCurso, nombre, limit, offset);
        return users;
    }

    const users = await usuarioRepository.getUsuariosFromCursoByNombre(idCurso, nombre);
    return users;
}

/**
 * Agregar participante a un curso. Retorna void.
 */
async function addParticipanteToCurso(idCurso: string, idUser: string) {

    // buscar si ya pertenece al curso
    const user = await usuarioRepository.getUsuarioById(idUser);
    if (!user) throw new NotFoundError("Usuario");
    if (user.cursosAlumno.includes(idCurso) || user.cursosDocente.includes(idCurso)) return;

    const curso = await cursoRepository.addUsuario(idCurso, idUser);

    if (!curso) throw new NotFoundError("Curso o User");

}

async function updateUsuarioPassword(idUser: string, password: string, token: string) {

    //check if token is valid
    const user = verifyJWT(token);
    if (user.id !== idUser)
        throw new TokenInvalido();

    /**
     * Criterios password:
     *  - 8 caracteres minimo
     *  - 1 mayuscula
     *  - 1 numero
     */
    if (password.length < 8 || password.toLowerCase() === password || !password.match(/\d/))
        throw new InvalidValueError('Usuario', 'Contrasenia');

    //hash password
    const salt = await saltRepository.getSaltByUsuarioId(idUser);
    if (!salt) throw new NotFoundError("Salt");

    const hash = await bcryptjs.hash(password, salt.salt);

    return await usuarioRepository.updateUsuarioPassword(idUser, hash);
}

async function getUsuarioByCorreo(correo: string) {

    // check if mail is valid
    if (!validator.default.isEmail(correo))
        throw new InvalidValueError('Usuario', 'Correo');

    const user = await usuarioRepository.getUsuarioByCorreo(correo);
    if (!user) throw new NotFoundError("Usuario");
    return user;
}

async function deleteAlumnoFromCurso(token: string, idCurso: string, idAlumno: string) {

    // decode token and get the if is superuser and its id
    let isSuperUser = false
    let superUserId = '';
    try {
        const payload = verifyJWT(token);
        isSuperUser = payload.superUser || false;
        superUserId = payload.id;
    } catch (error) {
        throw new NotAuthorizedError();
    }

    // get the Curso
    let curso = await cursoRepository.getCursoById(idCurso);
    if (!curso) throw new NotFoundError("Curso");

    // Verificar que el docente sea superuser o el docente del curso
    if(!isSuperUser)
        if(!curso.docentes.includes(superUserId)) throw new NotAuthorizedError();

    curso = await cursoRepository.deleteAlumnoFromCurso(idCurso, idAlumno);
    return curso;
}

async function getEstadoCorreos(correos: string[]): Promise<{ provider: boolean, correo: string, registered: boolean }[]> {

    const usuarios = await Promise.all(correos.map(async (correo) => {

        const usuario = await usuarioRepository.getUsuarioByCorreo(correo);
        const usuarioProvider = await usuarioRepository.getUsuarioByCorreo(`google|${correo}`);

        return { registered: !!usuario || !!usuarioProvider, provider: !!usuarioProvider, correo }
    }));


    return usuarios;
}

async function getAllUsuarios(token: string, nombre: string, limit: number, offset: number) {

    let isSuperUser = false
    let superUserId = '';
    
    try {
        const payload = verifyJWT(token);
        isSuperUser = payload.superUser || false;
        superUserId = payload.id;
    } catch (error) {
        throw new NotAuthorizedError();
    }

    if (!isSuperUser) throw new NotAuthorizedError();

    const users = await usuarioRepository.getUsuariosPaginated(nombre, limit, offset);

    return users ?? { count: 0, result: [] };
}


export default {
    getUsuarioById, createUsuario, login, verifyJWT, getParticipantes, addParticipanteToCurso, generateResetJWT,
    updateUsuarioPassword, getUsuarioByCorreo, loginProvider, deleteAlumnoFromCurso, getEstadoCorreos, updateUsuario, deleteUsuario,
    getAllUsuarios
};
