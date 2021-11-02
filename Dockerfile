FROM node:17

WORKDIR /app
COPY package.json .
ADD . /app
RUN yarn install