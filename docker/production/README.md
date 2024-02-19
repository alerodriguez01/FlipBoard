# Files for production

- The [build_and_push.sh](build_and_push.sh) script builds the Docker images and pushes them to Docker hub.

- The [compose-without-nginx.yaml](compose-without-nginx.yaml) file is a docker-compose file that can be used to deploy the application without a reverse proxy. For example, to run with the *vscode ports* option.

- The [compose.yaml](compose.yaml) file is a docker-compose file that is used to deploy the application with a reverse proxy on a server.