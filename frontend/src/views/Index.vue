<script setup lang="ts">
import { Locale } from "@/core/i18n/I18n.ts";
import InputGroup from "@/frontend/src/components/InputGroup.vue";
import { origin } from "@/frontend/src/composables/origin.ts";
import { useI18n } from "@/frontend/src/composables/useI18n";
import de from "@/frontend/src/views/translations/de.ts";
import en from "@/frontend/src/views/translations/en.ts";

const { t } = useI18n([
  [Locale.EnglishGB, en],
  [Locale.German, de],
]);

function signIn(): Promise<Response> {
  return fetch(`${origin}/auth/user`, {
    credentials: "include",
    mode: "cors",
  });
}
</script>

<template>
  <div class="index">
    <InputGroup :label="t('inputLabel')" type="text" />
  </div>
</template>
