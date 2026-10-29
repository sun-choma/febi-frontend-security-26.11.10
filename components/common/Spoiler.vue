<!-- Click-to-reveal panel, independent of Slidev click steps (the presenter can skip it).
     <Spoiler>…markdown / code…</Spoiler>, or override text: <Spoiler label="…" hint="…">
     Content must be optional extra detail, never essential. It is shown open in PDF export / print. -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useNav } from '@slidev/client'
import { t } from '~/utils/i18n'
import { releaseFocus } from '~/utils/release-focus'

defineProps<{ label?: string, hint?: string }>()
const { isPrintMode } = useNav()
const toggled = ref(false)
const shown = computed(() => toggled.value || isPrintMode.value)
</script>

<template>
  <div class="spoiler">
    <button class="sp-btn" :class="{ open: shown }" :aria-expanded="shown" @click="toggled = !toggled; releaseFocus($event)">
      <lucide-chevron-right class="chev" />
      {{ label ?? t({ ja: '種明かし', en: 'The catch' }) }}
      <span v-if="!shown" class="hint">{{ hint ?? t({ ja: 'クリックで表示', en: 'click to reveal' }) }}</span>
    </button>
    <div v-show="shown" class="sp-content"><slot /></div>
  </div>
</template>

<style scoped>
.spoiler { background: var(--panel); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; }
.sp-btn {
  width: 100%; text-align: left; background: var(--background); color: var(--foreground); border: none;
  padding: 0.65rem 0.9rem; font-size: 0.9rem; font-weight: 600; cursor: pointer;
  display: flex; align-items: center; gap: 0.5rem;
}
.sp-btn.open { border-bottom: 1px solid var(--border); }
.chev { flex: 0 0 auto; color: var(--purple); transition: rotate 0.2s ease; }
.sp-btn.open .chev { rotate: 90deg; }
.hint { color: var(--comment); font-weight: 400; font-size: 0.82rem; }
.sp-content { padding: 0.85rem 1rem; }
</style>
