FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /home/node/app

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies and generate Prisma client
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm dlx prisma generate

COPY . .

EXPOSE 3001

CMD [ "pnpm", "dev" ]