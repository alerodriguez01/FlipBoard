# FlipBoard Infraestructure
Contenedores requeridos para levantar el backend, frontend y la base de datos de FlipBoard.

> Fuente para usar prisma con docker: https://www.youtube.com/watch?v=mj5MxsEiHe8

## Inicialización
1. Asegurarse que en el archivo `.env` se encuentre la siguiente variable:
``` bash
DATABASE_URL = "mongodb://admin:root@localhost:27017/flipboard?authSource=admin"
```
> Tiene que ser exactamente esa URL.

2. Buildear y correr los contenedores desde `./docker`:
```bash
docker-compose up -d
```

3. Cargar la base de datos en Mongo desde `./Backend`:
```bash
npx prisma db push --schema=./src/prisma/schema.prisma
```