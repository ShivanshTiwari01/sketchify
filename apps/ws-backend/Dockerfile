FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
RUN npm install -g turbo
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
COPY --from=installer /app/apps/ws-backend/node_modules ./apps/ws-backend/node_modules
COPY --from=installer /app/packages ./packages
COPY --from=pruner /app/out/full/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm turbo build --filter=ws-backend

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/ws-backend/dist ./apps/ws-backend/dist
COPY --from=builder /app/apps/ws-backend/package.json ./apps/ws-backend/package.json
COPY --from=builder /app/apps/ws-backend/node_modules ./apps/ws-backend/node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

WORKDIR /app/apps/ws-backend
EXPOSE 4002
CMD ["node", "dist/index.js"]
