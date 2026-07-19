# use the official Bun image
FROM oven/bun:1-alpine AS base
WORKDIR /usr/src/app

# --- INSTALL DEV DEPENDENCIES ---
FROM base AS install
# Copy the workspace configuration and the correct lockfile (using wildcard for bun.lockb or bun.lock)
COPY package.json bun.lock turbo.json ./
COPY services/auth-service/package.json ./services/auth-service/
COPY packages/protos/package.json ./packages/protos/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/

# Install everything including devDependencies
RUN bun install --frozen-lockfile

# --- INSTALL PRODUCTION DEPENDENCIES ---
FROM base AS install-prod
COPY package.json bun.lock turbo.json ./
COPY services/auth-service/package.json ./services/auth-service/
COPY packages/protos/package.json ./packages/protos/
COPY packages/eslint-config/ ./packages/eslint-config/
COPY packages/typescript-config/ ./packages/typescript-config/
# Install only production dependencies
RUN bun install --frozen-lockfile --production

# --- BUILD STAGE ---
FROM base AS prerelease
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY --from=install /usr/src/app/services/auth-service/node_modules ./services/auth-service/node_modules
COPY --from=install /usr/src/app/packages/protos/node_modules ./packages/protos/node_modules

# Copy actual source code
COPY ./services/auth-service ./services/auth-service
COPY ./packages/protos ./packages/protos

ENV NODE_ENV=production
RUN bun run build

# --- FINAL RELEASE ---
FROM base AS release
COPY --from=install-prod /usr/src/app/node_modules ./node_modules
COPY --from=install-prod /usr/src/app/services/auth-service/node_modules ./services/auth-service/node_modules
COPY --from=install-prod /usr/src/app/packages/protos/node_modules ./packages/protos/node_modules

COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/services/auth-service/package.json ./services/auth-service/
COPY --from=prerelease /usr/src/app/packages/protos/ ./packages/protos/
COPY --from=prerelease /usr/src/app/services/auth-service/dist ./services/auth-service/dist

USER bun
EXPOSE 6001/tcp
ENTRYPOINT [ "bun", "run", "services/auth-service/dist/index.js" ]