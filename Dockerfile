# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
WORKDIR /temp/dev
COPY ./front-end/package.json ./front-end/bun.lock /temp/dev/
RUN bun install --frozen-lockfile --production


FROM base AS builder
COPY --from=install /temp/dev/node_modules node_modules
COPY ./front-end/package.json ./front-end/bun.lock /usr/src/app/
COPY ./front-end/next.config.ts .
COPY ./front-end/postcss.config.mjs .
COPY ./front-end/.env .
COPY ./front-end/src .
ENV NODE_ENV=production
RUN bun run build

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start", "-H","0.0.0.0" ]
