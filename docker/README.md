# FlipBoard Infraestructure
Contenedores requeridos para desplegar la plataforma.

## Desarrollo
Para levantar todos los contenedores de la plataforma en modo *dev*, ejecutar el [compose.yaml](compose.yaml):
```bash
docker-compose up -d
```
> Nota: esto instalará las dependencias dentro de cada contenendor. En caso de instalar una nueva dependencia, debe eliminarse la imagen del respectivo contenedor y *buildearlo* nuevamente, dado que el volumen montado NO incluye las dependencias descargadas.

> Para que el IDE reconozca las dependencias, es necesario instalarlas manualmente, ejecutando `npm install` dentro de [Backend](../Backend) y [Frontend](../Frontend), y `yarn` dentro de [Excalidraw](../Mural/Excalidraw) y [RoomWebSocket](../Mural/RoomWebSocket).

El *hot reload* está habilitado en todos los contenedores.


## Producción
Las instrucciones para desplegar la plataforma en producción se encuentran en el directorio [production](./production).
