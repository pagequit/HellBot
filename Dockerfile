# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base
USER root
COPY . .
RUN bun install --frozen-lockfile --production
EXPOSE 1993/tcp
ENTRYPOINT [ "bun", "run", "./main.ts" ]
