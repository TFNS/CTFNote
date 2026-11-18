FROM node:24.22.3-alpine AS build-deps

RUN apk add --no-cache python3 make g++
RUN mkdir -p /usr/src/app
COPY package.json quasar.conf.js .eslintrc.js .eslintignore tsconfig.json .postcssrc.js .yarnrc.yml yarn.lock babel.config.js quasar.extensions.json /usr/src/app/
COPY .yarn /usr/src/app/.yarn/
RUN cd /usr/src/app && yarn install

COPY src /usr/src/app/src
COPY public /usr/src/app/public

WORKDIR /usr/src/app

RUN yarn build

# _--------_
FROM nginx:1.30.7-alpine@sha256:bef154735288bc38d99fac41ae63730684bcc661503673a04a0f9bc526ba8598

RUN mkdir -p /logs

COPY --from=build-deps /usr/src/app/dist/spa /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
