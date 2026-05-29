FROM node:24-alpine AS base
RUN npm install -g turbo pnpm
WORKDIR /app

FROM base AS pruner
COPY . .
RUN turbo prune ws-backend --docker

FROM base AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=installer /app/node_modules ./node_modules
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo build --filter=ws-backend

FROM node:24-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/ws-backend/dist ./dist
COPY --from=builder /app/apps/ws-backend/package.json ./package.json
COPY --from=builder /app/apps/ws-backend/node_modules ./node_modules
EXPOSE 4002
CMD ["node", "dist/index.js"]