FROM oven/bun:1 as base
WORKDIR /usr/src/app
ADD . .
RUN cd /usr/src/app
RUN bun install --production
RUN bun run build
USER root 
EXPOSE 8088/tcp
ENTRYPOINT [ "bun", "run", "main.ts" ]
