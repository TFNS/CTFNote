FROM node:16-alpine AS build-deps

RUN mkdir -p /usr/src/app
COPY package.json quasar.conf.js .eslintrc.js .eslintignore tsconfig.json .postcssrc.js yarn.lock babel.config.js quasar.extensions.json /usr/src/app/
RUN cd /usr/src/app && yarn install

COPY src /usr/src/app/src
COPY public /usr/src/app/public

WORKDIR /usr/src/app

RUN yarn build

# _--------_
FROM nginx:1.21.6-alpine

RUN mkdir -p /logs

COPY --from=build-deps /usr/src/app/dist/spa /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
