import { Usuario } from "@prisma/client";
import { UsuarioRepository } from "../persistencia/repositorios/usuario.repo.js";
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import { InvalidValueError } from "../excepciones/RepoErrors.js";
import { SaltRepository } from "../persistencia/repositorios/salt.repo.js";
import { UsuarioPrismaDAO } from "../persistencia/prisma/dao/usuario.dao.js";

const usuarioRepository = UsuarioRepository.getInstance();

async function getUsuarioById(idUsuario: string) {

    const usuario = await usuarioRepository.getUsuarioById(idUsuario);

    return usuario;
    
}

async function createUsuario(user: Usuario) {
    
    // check if mail is valid + check uniqueness
    if (!validator.default.isEmail(user.correo))
        throw new InvalidValueError('Usuario', 'Correo');

    /**
     * Criterios password:
     *  - 8 caracteres minimo
     *  - 1 mayuscula
     *  - 1 numero
     */
    const pwd = user.contrasena;
    if (pwd.length<8 || pwd.toLowerCase() === pwd || !pwd.match(/\d/))
        throw new InvalidValueError('Usuario', 'Contrasenia');

    const salt = await bcryptjs.genSalt(15);
    const newUser = await UsuarioPrismaDAO.getInstance().createUsuario({
        ...user, 
        contrasena: await bcryptjs.hash(user.contrasena, salt)
    });
    
    SaltRepository.getInstance().createSalt({id: "1", salt: salt, usuarioId: newUser.id})

    return newUser;
}

export default { getUsuarioById, createUsuario };