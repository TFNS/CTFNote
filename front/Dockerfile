FROM node:latest AS build-deps

RUN mkdir -p /usr/src/app
COPY package.json quasar.conf.js .postcssrc.js yarn.lock babel.config.js /usr/src/app/
RUN cd /usr/src/app && yarn install

COPY src /usr/src/app/src
COPY public /usr/src/app/public

WORKDIR /usr/src/app

RUN yarn build && \
    mkdir -p /usr/share/nginx/html && \
    cp -rf /usr/src/app/dist/spa/* /usr/share/nginx/html

# _--------_
FROM nginx:alpine

RUN mkdir -p /logs

COPY --from=build-deps /usr/src/app/dist/spa /usr/share/nginx/html

ARG API_HOST
ARG PAD_HOST

COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN sed -i "s/{{API\_HOST}}/${API_HOST}/g"  /etc/nginx/conf.d/default.conf 
RUN sed -i "s/{{PAD\_HOST}}/${PAD_HOST}/g"  /etc/nginx/conf.d/default.conf 
