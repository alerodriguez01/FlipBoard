# FROM node:12-alpine

# WORKDIR /excalidraw-room

# COPY package.json yarn.lock ./
# RUN yarn

# COPY tsconfig.json ./
# COPY src ./src
# RUN yarn build

# EXPOSE 80
# CMD ["yarn", "start"]
FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
CMD [ "yarn", "start:dev" ]