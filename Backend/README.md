# FlipBoard
Plataforma Tecnológica para el Aprendizaje basada en Aula Invertida.

---

### Ejecutar proyecto

> Requisitos: tener instalado [Node.js](https://nodejs.org/es/download) y tener cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas/database).

1. Instalar dependencias:

```bash
npm install
```

2. Modificar `.env` con la url de [MongoDB Atlas](https://www.mongodb.com/atlas/database).

> Se usa Atlas porque: "the MongoDB database connector uses transactions to support nested writes. Transactions require a replica set deployment. The easiest way to deploy a replica set is with Atlas. It's free to get started."; es bastante rebuscado configurar un replica set local.

3. Generar los tipos y métodos del modelo de datos definido en `database/prisma/schema.prisma`:

> Este comando hay que ejecutarlo cada vez que se modifique el modelo de datos.

```bash
npx prisma generate --schema=./database/prisma/schema.prisma
```

4. Iniciar el servidor:

```bash
npm run dev
```

---

### Ejecutar proyecto con docker

**Una vez levantado los contenedores** de la base de datos y el backend,

1. Pushear el schema (para crear las colecciones e indices que contienen claves @unique)

> Comando necesario si se borra la base de datos *flipboard*.
    
```bash
docker exec api npx prisma db push --schema=./database/prisma/schema.prisma
```

2. Generar los tipos y métodos del modelo de datos definido en `database/prisma/schema.prisma`:

> Este comando hay que ejecutarlo cada vez que se modifique el modelo de datos.

Desde `./Backend`:

```bash
npx prisma generate --schema=./database/prisma/schema.prisma
```

