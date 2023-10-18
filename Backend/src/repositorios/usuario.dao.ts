import { Usuario } from '@prisma/client';
import PrismaSingleton from './dbmanager.js';
import bcryptjs from 'bcryptjs';
import { NotFoundError } from '../excepciones/RepoErrors.js';

const prisma = PrismaSingleton.getInstance();

//Crear usuario
async function createUser(user: Usuario) {

  let newUser = {
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
  }

  const salt = await prisma.salt.findFirst();
  
  if (!salt) throw new NotFoundError("Salt");
  const pass = await bcryptjs.hash(user.contrasena, salt.salt);

  const userCreated = await prisma.usuario.create({
    data: {...newUser, contrasena: pass}
  });
  
  return userCreated;

}

export { createUser };