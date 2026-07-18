# Base Stage
FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /home/node/app

################################################################################

FROM base AS builder

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm dlx prisma generate

COPY . .
RUN pnpm dlx tsc

################################################################################

FROM base AS runner

ENV NODE_ENV=production

COPY --from=builder /home/node/app/node_modules ./node_modules
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/package.json ./package.json

RUN chown -R node:node /home/node/app
USER node

EXPOSE 3001

CMD [ "node", "dist/server.js" ]