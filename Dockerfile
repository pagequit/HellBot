# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base
WORKDIR /usr/src/app
COPY node_modules /usr/src/app/node_modules
ADD . .
USER root 
# USER bun 
EXPOSE 1993/tcp
ENTRYPOINT [ "bun", "run", "./main.ts" ]
