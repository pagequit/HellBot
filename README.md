# HellBot

## Setup

### [Bun](https://bun.sh/)

HellBot is build with Bun. So you need to install Bun in order to run HellBot.

## Development

### [Visual Studio Code](https://code.visualstudio.com/)

`.vscode/settings.json`

```json
{
  "bun.runtime": "~/.bun/bin/bun",
  "bun.debugTerminal.enabled": true,
  "bun.debugTerminal.stopOnEntry": false,
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "editor.quickSuggestions": {
    "strings": "on"
  }
}
```

`.vscode/launch.json`

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "bun",
      "request": "launch",
      "name": "Debug Bun",
      "program": "./main.ts",
      "args": [],
      "cwd": "${workspaceFolder}",
      "env": {},
      "strictEnv": false,
      "watchMode": false,
      "stopOnEntry": false,
      "noDebug": false,
      "runtime": "bun",
      "runtimeArgs": []
    },
    {
      "type": "bun",
      "request": "attach",
      "name": "Attach to Bun",
      "url": "ws://localhost:6499/"
    }
  ]
}
```

## Run

```sh
bun run main.ts
```

## Docker

```sh
docker build --pull -t hellbot .
```

```sh
docker run -it --init -p 1993:1993 hellbot
```

## Docs

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

### Bun

- https://bun.sh/docs

### Docker

- https://docs.docker.com/
