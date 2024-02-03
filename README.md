# HellBot

## Setup

### [Deno](https://deno.com/)

Install deno:\
https://docs.deno.com/runtime/manual/getting_started/installation

Verify deno version

```sh
deno --version

# deno 1.40.3
# v8 12.1.285.6
# typescript 5.3.3
```

Cache dependencies (optional):

```sh
deno cache main.ts
```

## Development

### [Visual Studio Code](https://code.visualstudio.com/)

Install the
[Deno Extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
and set up the following files:

`.vscode/launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "request": "launch",
      "name": "Launch Program",
      "type": "node",
      "program": "${workspaceFolder}/main.ts",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "PATH/TO/DENO/BIN",
      "runtimeArgs": [
        "run",
        "--unstable-cron",
        "--unstable-kv",
        "--inspect-wait",
        "--allow-read",
        "--allow-env",
        "--allow-net"
      ],
      "attachSimplePort": 9229
    }
  ]
}
```

`.vscode/settings.json`

```json
{
  "deno.enable": true,
  "deno.lint": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "denoland.vscode-deno"
}
```

## Run

```sh
deno task run
```

Ignore the `Warning: Not implemented: ClientRequest.options.createConnection`
message.

## Docker

https://hub.docker.com/r/denoland/deno

```sh
docker build -t hellbot . && docker run -it --init -p 1993:1993 hellbot
```

## Docs

### Deno

- https://docs.deno.com/runtime/manual
- https://deno.land/api@v1.40.2
- https://deno.land/std@0.210.0

### Typescript

- https://www.typescriptlang.org/docs/
- https://www.typescriptlang.org/docs/handbook/intro.html

### Visual Studio Code

- https://code.visualstudio.com/docs

### Discord

- https://discordjs.guide/#before-you-begin
- https://discord.com/developers/docs/intro
- https://discord.com/developers/docs/getting-started
- https://old.discordjs.dev/#/docs/discord.js/14.14.1/general/welcome
- https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks

### Docker

- https://docs.docker.com/
