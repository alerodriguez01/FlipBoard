FROM node:18-alpine as base
WORKDIR /app
COPY . .
RUN npm install

FROM base as dev
CMD [ "npm", "run", "dev" ] 

FROM base as prod
RUN npm run build
CMD [ "npm", "run", "start" ]