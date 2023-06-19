# Dockerfile

# Global args, set before the first FROM, shared by all stages
ARG NODE_ENV="production"
ARG NODE_DIGEST="sha256:1a9a71ea86aad332aa7740316d4111ee1bd4e890df47d3b5eff3e5bded3b3d10"

################################################################################
# Build stage 1 - `yarn build`

FROM node@${NODE_DIGEST} as builder
# Import our shared args
ARG NODE_ENV

# Cache node_modules for as long as possible
COPY package.json yarn.lock tsconfig.json start.sh /app/
WORKDIR /app/
RUN yarn install --frozen-lockfile --production=false --no-progress
# Copy over the server source code
COPY src/ /app/src/
COPY migrations/ /app/migrations/

# Finally run the build script
RUN yarn run build

################################################################################
# Build stage 2 - COPY the relevant things (multiple steps)

FROM node@${NODE_DIGEST} as clean
# Import our shared args
ARG NODE_ENV

# Copy over selectively just the tings we need, try and avoid the rest
COPY --from=builder /app/package.json /app/yarn.lock /app/start.sh /app/
COPY --from=builder /app/dist/ /app/dist/
COPY --from=builder /app/src/discord/boticon.png /app/dist/discord/boticon.png
COPY --from=builder /app/migrations/ /app/migrations/

################################################################################
# Build stage FINAL - COPY everything, once, and then do a clean `yarn install`

FROM node@${NODE_DIGEST}
# Import our shared args
ARG NODE_ENV

EXPOSE 3000
WORKDIR /app/
# Copy everything from stage 2, it's already been filtered
COPY --from=clean /app/ /app/

# Install yarn ASAP because it's the slowest
RUN yarn install --frozen-lockfile --production=true --no-progress
RUN chmod -R 0555 .
RUN mkdir /app/uploads
RUN chown node /app/uploads
# You might want to disable GRAPHILE_TURBO if you have issues
ENV GRAPHILE_TURBO=1
ENV NODE_ENV=$NODE_ENV
USER node
CMD ./start.sh db 5432 yarn start
