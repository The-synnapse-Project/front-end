# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

COPY ./front-end .

ENV NODE_ENV=production
RUN bun install --frozen-lockfile
RUN bun run build

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start", "-H","0.0.0.0" ]
