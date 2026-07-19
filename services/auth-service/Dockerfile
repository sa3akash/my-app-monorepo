# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1-alpine AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
COPY services/auth-service/package.json ./services/auth-service/
COPY packages/protos/package.json ./packages/protos/

RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=install /temp/dev/services/auth-service ./services/auth-service
COPY --from=install /temp/dev/packages/protos ./packages/protos

COPY . .

# [optional] tests & build
ENV NODE_ENV=production
RUN bun test
RUN bun run build

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/services/auth-service/package.json ./services/auth-service/
COPY --from=prerelease /usr/src/app/packages/protos/package.json ./packages/protos/
COPY --from=prerelease /usr/src/app/dist ./dist
COPY --from=prerelease /usr/src/app/services/auth-service/dist ./services/auth-service/dist

# run the app
USER bun
EXPOSE 6001/tcp
ENTRYPOINT [ "bun", "run", "dist/index.js" ]