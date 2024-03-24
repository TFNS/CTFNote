# Dockerfile

# Global args, set before the first FROM, shared by all stages
ARG NODE_ENV="production"
ARG NODE_IMAGE="18.19.1-alpine"

################################################################################
# Build stage 1 - `yarn build`

FROM node:${NODE_IMAGE} as builder
# Import our shared args
ARG NODE_ENV

# Cache node_modules for as long as possible
COPY package.json yarn.lock tsconfig.json start.sh .yarnrc.yml /app/
COPY .yarn /app/.yarn/
WORKDIR /app/
RUN yarn install --frozen-lockfile
# Copy over the server source code
COPY src/ /app/src/
COPY migrations/ /app/migrations/

# Finally run the build script
RUN yarn run build

################################################################################
# Build stage 2 - COPY the relevant things (multiple steps)

FROM node:${NODE_IMAGE} as clean
# Import our shared args
ARG NODE_ENV
ARG DB_HOST
ARG DB_PORT

# Copy over selectively just the tings we need, try and avoid the rest
COPY --from=builder /app/package.json /app/yarn.lock /app/.yarnrc.yml /app/start.sh /app/
COPY --from=builder /app/.yarn/ /app/.yarn/
COPY --from=builder /app/dist/ /app/dist/
COPY --from=builder /app/src/discord/boticon.png /app/dist/discord/boticon.png
COPY --from=builder /app/migrations/ /app/migrations/

################################################################################
# Build stage FINAL - COPY everything, once, and then do a clean `yarn install`

FROM node:${NODE_IMAGE}
# Import our shared args
ARG NODE_ENV

EXPOSE 3000
WORKDIR /app/
# Copy everything from stage 2, it's already been filtered
COPY --from=clean /app/ /app/

# Install yarn ASAP because it's the slowest
RUN yarn install --frozen-lockfile
RUN chmod -R 0555 .
RUN mkdir /app/uploads
RUN chown node /app/uploads
# You might want to disable GRAPHILE_TURBO if you have issues
ENV GRAPHILE_TURBO=1
ENV NODE_ENV=$NODE_ENV
USER node
CMD ./start.sh ${DB_HOST} ${DB_PORT} yarn start
