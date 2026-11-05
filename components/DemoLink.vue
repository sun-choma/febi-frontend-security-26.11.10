<!-- Pill link to a demo page in public/ that also works under the deck's base path (/<repo>/ on GitHub Pages) -->
<script setup lang="ts">
const props = defineProps<{ href: string }>()
const url = `${import.meta.env.BASE_URL}${props.href.replace(/^\//, '')}`
</script>

<template>
  <a class="pill" :href="url" target="_blank"><lucide-external-link /><slot /></a>
</template>
