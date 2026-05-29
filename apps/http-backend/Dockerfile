FROM node:24-alpine AS base
RUN npm install -g turbo pnpm
WORKDIR /app

# Prune to only what http-backend needs
FROM base AS pruner
COPY . .
RUN turbo prune http-backend --docker

# Install deps from pruned lockfile
FROM base AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/http-backend/node_modules ./apps/http-backend/node_modules
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo build --filter=http-backend

# Final lean runtime image
FROM node:24-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/http-backend/dist ./dist
COPY --from=builder /app/apps/http-backend/package.json ./package.json
COPY --from=builder /app/apps/http-backend/node_modules ./node_modules
EXPOSE 4001
CMD ["node", "dist/index.js"]