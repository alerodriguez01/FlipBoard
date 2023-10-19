import { UsuarioRepository } from "../persistencia/repositorios/usuario.repo.js";

const usuarioRepository = UsuarioRepository.getInstance();

async function getUsuarioById(idUsuario: string) {

    const usuario = await usuarioRepository.getUsuarioById(idUsuario);

    return usuario;
    
}

export default { getUsuarioById };