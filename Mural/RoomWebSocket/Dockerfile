# FROM node:12-alpine

# WORKDIR /excalidraw-room

# COPY package.json yarn.lock ./
# RUN yarn

# COPY tsconfig.json ./
# COPY src ./src
# RUN yarn build

# EXPOSE 80
# CMD ["yarn", "start"]
FROM node:18-alpine as base
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .

FROM base as dev
CMD [ "yarn", "start:dev" ]

FROM base as prod
RUN yarn build
CMD ["yarn", "start"]