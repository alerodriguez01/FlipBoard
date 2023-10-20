import { Salt, Usuario } from "@prisma/client";
import { UsuarioRepository } from "../persistencia/repositorios/usuario.repo.js";
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import { InvalidValueError } from "../excepciones/RepoErrors.js";
import { SaltRepository } from "../persistencia/repositorios/salt.repo.js";

const usuarioRepository = UsuarioRepository.getInstance();
const saltRepository = SaltRepository.getInstance();

/*
    Obtener un usuario por id (opcionalmente con sus cursos)
*/
async function getUsuarioById(idUsuario: string, withCursos: boolean) {

    if (withCursos) {
        const usuario = await usuarioRepository.getUsuarioByIdWithCursos(idUsuario);
        return usuario;
    }

    const usuario = await usuarioRepository.getUsuarioById(idUsuario);
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
async function login(correo: string, contrasena: string) {

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

    return usuario;

}

export default { getUsuarioById, createUsuario, login };