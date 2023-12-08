FROM node:18 AS build

WORKDIR /opt/node_app

COPY package.json yarn.lock ./
RUN yarn --ignore-optional --network-timeout 600000

ARG NODE_ENV=production
# para que no se quede sin memoria
ENV NODE_OPTIONS=--max_old_space_size=8192 

COPY . .
RUN yarn build:app:docker

FROM nginx:1.21-alpine

COPY --from=build /opt/node_app/build /usr/share/nginx/html

HEALTHCHECK CMD wget -q -O /dev/null http://localhost || exit 1

# FROM node:18-alpine as base
# WORKDIR /app
# COPY package.json yarn.lock ./
# RUN yarn
# COPY . .

# FROM base as dev
# CMD [ "yarn", "start" ]

# FROM base as prod
# CMD [ "yarn", "start:production" ]