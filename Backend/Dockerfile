FROM node:18.18-alpine as base

# Create app directory
WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY nodemon.json ./
COPY src ./src
COPY database ./database
COPY lib ./lib
COPY temp_csv ./temp_csv

RUN npm install
COPY .env ./
RUN npx prisma generate --schema=./database/prisma/schema.prisma

FROM base as dev
CMD [ "npm", "run", "dev-docker" ]
# Uso "dev-docker" porque: https://github.com/remy/nodemon#application-isnt-restarting
# In some networked environments (such as a container running nodemon reading across a mounted drive), you will need to use the legacyWatch: true which enables Chokidar's polling.

# https://stackoverflow.com/questions/58645778/cannot-get-nodemon-ts-node-dev-working-on-dockerized-mean-stack

FROM base as prod
RUN npm run build
CMD [ "npm", "run", "start" ]