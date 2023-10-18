import { Usuario } from '@prisma/client';
import PrismaSingleton from './dbmanager.js';
import bcryptjs from 'bcryptjs';
import SaltNotFoundError from '../excepciones/RepoErrors.js';

const prisma = PrismaSingleton.getInstance();

//Crear usuario
async function crearUsuario(user: Usuario) {

  let newUser = {
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
  }

  const salt = await prisma.salt.findFirst();
  
  if (!salt) throw new SaltNotFoundError();
  const pass = await bcryptjs.hash(user.contrasena, salt.salt);

  await prisma.usuario.create({
    data: {...newUser, contrasena: pass}
  });
  
}