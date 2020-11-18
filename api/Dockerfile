FROM node:14.5.0-alpine3.10

RUN mkdir -p /usr/src/app && \
    apk add openssh-client

WORKDIR /usr/src/app

COPY tsconfig.json package.json yarn.lock /usr/src/app/
RUN yarn install

COPY ormconfig.docker.json /usr/src/app/ormconfig.json
COPY src /usr/src/app/src

RUN yarn build && \
    cp -rf /usr/src/app/src/logo /usr/src/app/dist/logo && \
    rm -rf /usr/src/app/src

EXPOSE 31337

CMD yarn sync && NODE_ENV=prod node /usr/src/app/dist/index.js

