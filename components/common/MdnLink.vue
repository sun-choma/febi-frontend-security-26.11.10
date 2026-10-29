<!-- Label + MDN icon link, usually as the subtitle under a slide title.
     <MdnLink path="Web/CSS/Reference/At-rules/@layer">カスケードレイヤー</MdnLink>
     The locale follows the deck language (/ja/ or /en-US/); pass `href` for an exact MDN URL.
     Use the canonical path from the final en-US URL (e.g. Web/CSS/Reference/At-rules/@layer):
     legacy paths only redirect when a translation exists, otherwise /ja/ returns 404. -->
<script setup lang="ts">
import { computed } from 'vue'
import { mdnLocale } from '~/utils/i18n'

const props = defineProps<{ path?: string, href?: string }>()
if (!props.path && !props.href)
  console.warn('[MdnLink] needs `path` or `href`')
const url = computed(() => props.href ?? `https://developer.mozilla.org/${mdnLocale}/docs/${props.path}`)
</script>

<template>
  <div class="mdn-link">
    <span><slot /></span>
    <a :href="url" target="_blank" title="MDN"><simple-icons-mdnwebdocs /></a>
  </div>
</template>

<style scoped>
.mdn-link { display: flex; align-items: center; gap: 0.5rem; }
.mdn-link a { display: flex; }  /* colour comes from the theme's link cyan */
.mdn-link svg { width: 1rem; height: 1rem; }
</style>
