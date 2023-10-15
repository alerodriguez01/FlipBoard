# FlipBoard Infraestructure
Contenedores requeridos para levantar el backend, frontend y la base de datos de FlipBoard.

> Fuente para usar prisma con docker: https://www.youtube.com/watch?v=mj5MxsEiHe8


## Inicialización

Shortcut:
```bash
cd ../Backend && npm install && cd ../Frontend && npm install && cd ../docker && docker-compose up -d
```

1. Instalar las dependencias de cada proyecto (backend y frontend):
```bash
cd ../Backend && npm install && cd ../Frontend && npm install && cd ../docker
```

2. Buildear y correr los contenedores desde `./docker`:
```bash
docker-compose up -d
```

3. Cargar la base de datos en Mongo desde `./Backend`:
```bash
npx prisma db push --schema=./database/prisma/schema.prisma
```