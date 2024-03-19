# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base
WORKDIR /usr/src/app
RUN cd /usr/src/app && bun install --frozen-lockfile --production
ADD . .
USER root 
EXPOSE 1993/tcp
ENTRYPOINT [ "bun", "run", "./main.ts" ]
