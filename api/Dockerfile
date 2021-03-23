FROM node:14.5.0-alpine3.10

RUN mkdir -p /usr/src/app && \
    apk add openssh-client g++ make python

WORKDIR /usr/src/app

COPY tsconfig.json package.json yarn.lock /usr/src/app/
RUN yarn install

COPY ormconfig.ts /usr/src/app/ormconfig.ts

RUN npx tsc --esModuleInterop ormconfig.ts && rm -f ormconfig.ts && ls -lA

COPY src /usr/src/app/src

RUN yarn build && \
    rm -rf /usr/src/app/src

EXPOSE 31337

RUN ls -la /usr/src/app/dist/entity

#CMD yarn sync 
#&& 
CMD npx typeorm schema:sync && NODE_ENV=prod node dist/index.js

