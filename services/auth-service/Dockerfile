# use the official Bun image
FROM oven/bun:1-alpine AS base
WORKDIR /usr/src/app

# --- BUILD STAGE ---
# We bring in all source files here so Bun has full visibility into 
# the monorepo workspaces, allowing --frozen-lockfile to succeed perfectly.
FROM base AS builder
COPY . .

# Run a clean install matching your local lockfile exactly
RUN bun install --frozen-lockfile

# Set environment and build the auth-service
ENV NODE_ENV=production
RUN cd services/auth-service && bun run build

# --- PRODUCTION DEPENDENCIES CLEANING ---
# Instead of doing a separate, broken multi-stage prod install, 
# we prune the devDependencies out right here.
RUN bun install --production

# --- FINAL RELEASE ---
FROM base AS release

# Copy over the pruned node_modules from the builder
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/services/auth-service/node_modules ./services/auth-service/node_modules
COPY --from=builder /usr/src/app/packages/protos/node_modules ./packages/protos/node_modules

# Copy over the package files and the built code
COPY --from=builder /usr/src/app/package.json .
COPY --from=builder /usr/src/app/services/auth-service/package.json ./services/auth-service/
COPY --from=builder /usr/src/app/packages/protos/ ./packages/protos/
COPY --from=builder /usr/src/app/services/auth-service/dist ./services/auth-service/dist

USER bun
EXPOSE 6001/tcp
ENTRYPOINT [ "bun", "run", "services/auth-service/dist/index.js" ]