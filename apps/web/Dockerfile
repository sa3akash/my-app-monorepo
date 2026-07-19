# --- STAGE 1: Build base ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy root configurations for lockfile and workspaces mapping
COPY package.json package-lock.json ./

# Copy package.json files for all workspaces to leverage Docker cache
# (Replace with your actual monorepo workspace subdirectories)
COPY apps/my-web-app/package.json ./apps/my-web-app/
COPY packages/shared-lib/package.json ./packages/shared-lib/

# Install dependencies strictly for the target application workspace
# This hoists shared modules correctly while pulling only what is required
RUN npm ci --workspace=my-web-app --include=dev

# Copy the rest of the monorepo source files
COPY . .

# Run the build step for your targeted workspace application
RUN npm run build --workspace=my-web-app


# --- STAGE 2: Runner ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy root configs for runtime dependency safety
COPY package.json package-lock.json ./

# Copy required package files into runtime container
COPY apps/my-web-app/package.json ./apps/my-web-app/
COPY packages/shared-lib/package.json ./packages/shared-lib/

# Install only production dependencies for the target workspace
RUN npm ci --workspace=my-web-app --omit=dev

# Copy build artifacts from the builder stage
COPY --from=builder /app/apps/my-web-app/dist ./apps/my-web-app/dist

EXPOSE 3000

# Execute the application through npm workspaces CLI command
CMD ["npm", "run", "start", "--workspace=my-web-app"]
