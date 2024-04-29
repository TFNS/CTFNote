FROM node:18.19.1-alpine AS build-deps

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
FROM nginx@sha256:5ba534070ae1e5e83d52141b11ddced689b476c0001e7205f50979dc0cbdde3d

RUN mkdir -p /logs

COPY --from=build-deps /usr/src/app/dist/spa /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
