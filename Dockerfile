# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:latest AS base
WORKDIR /usr/src/app

COPY ./front-end/package.json ./front-end/bun.lock /usr/src/app/
RUN bun install --frozen-lockfile
COPY ./front-end/tsconfig.json .
COPY ./front-end/next.config.ts .
COPY ./front-end/postcss.config.mjs .
COPY ./front-end/.env .
COPY ./front-end/src ./src
ENV NODE_ENV=production
RUN bun run build

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start", "-H","0.0.0.0" ]
