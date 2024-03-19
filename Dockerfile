FROM oven/bun:1 as base
WORKDIR /usr/src/app
ADD . .
RUN cd /usr/src/app && bun install --production
USER root 
EXPOSE 1993/tcp
ENTRYPOINT [ "bun", "run", "./main.ts" ]
