<script setup>
import { Locale } from "@/core/mod";
import { inputGroup } from "@/frontend/src/components/InputGroup.vue";
import { useI18n } from "@/frontend/src/composables/useI18n";
import de from "@/frontend/src/translations/de.ts";
import en from "@/frontend/src/translations/en.ts";

const { t } = useI18n([
  [Locale.EnglishGB, en],
  [Locale.German, de],
]);
</script>

<template>
  <div class="index">
    <InputGroup :label="t('inputLabel')" type="text" />
  </div>
</template>
