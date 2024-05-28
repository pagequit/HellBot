FROM oven/bun:1 as base
ARG VITE_SERVER_ORIGIN
ENV VITE_SERVER_ORIGIN=${VITE_SERVER_ORIGIN}
WORKDIR /usr/src/app
COPY . .
RUN cd /usr/src/app
RUN bun install
RUN bun run build
USER root 
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "main.ts" ]
