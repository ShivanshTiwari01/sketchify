FROM node:24-alpine AS base
RUN npm install -g turbo pnpm
WORKDIR /app

FROM base AS pruner
COPY . .
RUN turbo prune frontend --docker

FROM base AS installer
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/frontend/node_modules ./apps/frontend/node_modules
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo build --filter=frontend

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/frontend/.next/standalone ./
COPY --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
EXPOSE 4003
CMD ["node", "apps/frontend/server.js"]
