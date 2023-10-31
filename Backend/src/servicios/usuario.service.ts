import { Salt, Usuario } from "@prisma/client";
import { UsuarioRepository } from "../persistencia/repositorios/usuario.repo.js";
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import { InvalidValueError, NotFoundError } from "../excepciones/RepoErrors.js";
import { SaltRepository } from "../persistencia/repositorios/salt.repo.js";
import jwt from 'jsonwebtoken';
import { TokenInvalido } from "../excepciones/TokenError.js";
import { CursoRepository } from "../persistencia/repositorios/curso.repo.js";

const usuarioRepository = UsuarioRepository.getInstance();
const saltRepository = SaltRepository.getInstance();
const cursoRepository = CursoRepository.getInstance();

/*
    Obtener un usuario por id (opcionalmente con sus cursos)
*/
async function getUsuarioById(idUsuario: string, withCursos: boolean) {

    if (withCursos) {
        const usuario = await usuarioRepository.getUsuarioByIdWithCursos(idUsuario);
        if(!usuario) throw new NotFoundError('Usuario')
        return usuario;
    }

    const usuario = await usuarioRepository.getUsuarioById(idUsuario);
    if(!usuario) throw new NotFoundError('Usuario')
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

    // retorno el usuario creado (aunque no haya terminado de guardar el salt)
    return newUser;

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
        nombre: usuario.nombre,
        correo: usuario.correo,
        cursosAlumno: usuario.cursosAlumno,
        cursosDocente: usuario.cursosDocente,
        grupos: usuario.grupos
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

/**
 * 
 */
async function getParticipantes(idCurso: string, nombre: string, limit: number, offset: number){
    
    //paginado
    if(!!limit || !!offset){
        const users = await usuarioRepository.getUsuariosFromCursoByNombrePaginated(idCurso, nombre, limit, offset);
        return users;
    }
    
    const users = await usuarioRepository.getUsuariosFromCursoByNombre(idCurso, nombre);
    return users;
}

/**
 * Agregar participante a un curso. Retorna void.
 */
async function addParticipanteToCurso(idCurso: string, idUser: string){
    
    const curso = await cursoRepository.addUsuario(idCurso, idUser);
    
    if(!curso) throw new NotFoundError("Curso o User");

}

export default { getUsuarioById, createUsuario, login, verifyJWT, getParticipantes, addParticipanteToCurso };
