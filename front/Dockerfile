FROM node:24-alpine AS build-deps

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
FROM nginx:stable-alpine@sha256:9e596d26590907ed433eb53c83c4016038025d4e004b15922786ba85c8957264

RUN mkdir -p /logs

COPY --from=build-deps /usr/src/app/dist/spa /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
