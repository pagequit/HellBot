# HellBot

## Setup

### [Deno](https://deno.com/)

Install deno:\
https://docs.deno.com/runtime/manual/getting_started/installation

Verify deno version

```sh
deno --version

# deno 1.39.1
# v8 12.0.267.8
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
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
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
        "--inspect-wait",
        "--allow-read",
        "--allow-env",
        "--allow-net=discord.com,gateway.discord.gg"
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

## Docs

### Deno

- https://docs.deno.com/runtime/manual
- https://deno.land/api@v1.39.1
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