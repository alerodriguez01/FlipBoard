/*
* Archivo de prueba para verificar la conexión con la base de datos.
* Ejecutar: 
*   npx prisma generate --schema=./src/prisma/initial_test/schematest.prisma
*   npm run testprisma
* Deberia crear un usuario y un post en la base de datos y mostrar en consola
* el usuario creado (con el post embebido).
*/

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    await prisma.user.create({
      data: {
        name: 'Rich',
        email: 'hello@prisma.com',
        posts: {
          create: {
            title: 'My first post',
            body: 'Lots of really interesting stuff',
            slug: 'my-first-post',
          },
        },
      },
    })
  
    const allUsers = await prisma.user.findMany({
      include: {
        posts: true,
      },
    })
    console.dir(allUsers, { depth: null })



  }

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })