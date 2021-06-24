FROM node:14.5.0-alpine3.10

# specify production for possible optimizations
ENV NODE_ENV production

RUN mkdir -p /usr/src/app && \
    apk add openssh-client g++ make python

WORKDIR /usr/src/app

COPY tsconfig.json package.json yarn.lock /usr/src/app/
RUN yarn install --production

COPY ormconfig.docker.json /usr/src/app/ormconfig.json
COPY src /usr/src/app/src

RUN yarn build && \
   rm -rf /usr/src/app/src

EXPOSE 31337

CMD yarn sync && NODE_ENV=prod node /usr/src/app/dist/index.js
