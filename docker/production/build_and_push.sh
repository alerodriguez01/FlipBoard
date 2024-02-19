# This scripts builds all the images and pushes them to the docker hub

# IT IS NECESSARY TO BE IN THIS DIRECTORY (docker/production) TO RUN THE SCRIPT

export FLIPBOARD_VERSION=1.1.1

# 1. build images
docker build -t docker-nextjs --platform linux/amd64 ../../Frontend --target prod
docker build -t docker-api --platform linux/amd64 ../../Backend --target prod
docker build -t docker-mural-excalidraw --platform linux/amd64 --file ../../Mural/Excalidraw/Dockerfile.prod ../../Mural/Excalidraw/
docker build -t docker-mural-room-web-socket --platform linux/amd64 ../../Mural/RoomWebSocket

docker build -t docker-mongo-db --platform linux/amd64 ../mongodb_rs

docker build -t docker-nginx --platform linux/amd64 ../nginx

# 2. Create tags
docker tag docker-nextjs alnrodriguez/flipboard-frontend:$FLIPBOARD_VERSION
docker tag docker-api alnrodriguez/flipboard-backend:$FLIPBOARD_VERSION
docker tag docker-mural-excalidraw alnrodriguez/flipboard-mural-excalidraw:$FLIPBOARD_VERSION
docker tag docker-mural-room-web-socket alnrodriguez/flipboard-mural-room-web-socket:$FLIPBOARD_VERSION

docker tag docker-mongo-db alnrodriguez/flipboard-mongo-db:$FLIPBOARD_VERSION

docker tag docker-nginx alnrodriguez/flipboard-nginx:$FLIPBOARD_VERSION

# 3. Push to hub
docker push alnrodriguez/flipboard-frontend:$FLIPBOARD_VERSION
docker push alnrodriguez/flipboard-backend:$FLIPBOARD_VERSION
docker push alnrodriguez/flipboard-mural-excalidraw:$FLIPBOARD_VERSION
docker push alnrodriguez/flipboard-mural-room-web-socket:$FLIPBOARD_VERSION

docker push alnrodriguez/flipboard-mongo-db:$FLIPBOARD_VERSION

docker push alnrodriguez/flipboard-nginx:$FLIPBOARD_VERSION