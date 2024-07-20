<script setup lang="ts">
import TextareaGroup from "@/frontend/src/components/TextareaGroup.vue";

const system = `You are a function calling AI model.
You are provided with function signatures within <tools></tools> XML tags.
You may call one or more functions to assist with the user query.
Don't make assumptions about what values to plug into functions.
Here are the available tools:
<tools>
{
  "type": "function",
  "function": {
    "name": "set_timer",
    "description": "Set a timer in minutes to remind you on a certain subject.",
    "parameters": {
      "type": "object",
      "properties": {
        "minutes": {
          "type": "number",
          "description": "Minutes to wait before the timer is up."
        },
        "subject": {
          "type": "string",
          "description": "Subject of the timer."
        }
      }
    },
    "required": ["minutes", "subject"]
  }
}
</tools>
Use the following pydantic model json schema for each tool call you will make:
{
  "properties": {
    "arguments": {
      "title": "Arguments",
      "type": "object"
    },
    "name": {
      "title": "Name",
      "type": "string"
    }
  },
  "required": ["arguments", "name"],
  "title": "FunctionCall",
  "type": "object"
}
For each function call return a json object with function name and arguments within <tool_call></tool_call> XML tags as follows:
<tool_call>
{"arguments": <args-dict>, "name": <function-name>}
</tool_call>`;
</script>

<template>
  <div class="commands">
    <TextareaGroup label="Commands" v-model="system" />
  </div>
</template>

<style>
.commands {
  margin: var(--sp-3);
}
</style>
