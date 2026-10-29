<!-- Browser support row. A version string = supported since; omitted = not supported (dimmed).
     <BrowserSupport chrome="111" safari="18" firefox="144" baseline="2025" as-of="2026.07" />
     <BrowserSupport chrome="126" safari="18.2" as-of="2026.07" />   ← Firefox shown as unsupported
     Support data goes stale: always set `as-of`. -->
<script setup lang="ts">
import { computed } from 'vue'
import LogosChrome from '~icons/logos/chrome'
import LogosSafari from '~icons/logos/safari'
import LogosFirefox from '~icons/logos/firefox'
import { t } from '~/utils/i18n'

const props = defineProps<{
  chrome?: string
  safari?: string
  firefox?: string
  baseline?: string
  asOf?: string
}>()

const cells = computed(() => [
  { name: 'Chrome', icon: LogosChrome, version: props.chrome },
  { name: 'Safari', icon: LogosSafari, version: props.safari },
  { name: 'Firefox', icon: LogosFirefox, version: props.firefox },
])
</script>

<template>
  <div class="support">
    <div v-for="c in cells" :key="c.name" class="cell" :class="{ off: !c.version }" :title="c.name">
      <component :is="c.icon" />
      <span class="ver">{{ c.version ? `${c.version}+` : t({ ja: '未対応', en: 'no' }) }}</span>
    </div>
    <span v-if="baseline" class="baseline">Baseline {{ baseline }}</span>
    <span v-if="asOf" class="as-of">{{ t({ ja: `${asOf}時点`, en: `as of ${asOf}` }) }}</span>
  </div>
</template>

<style scoped>
.support { display: inline-flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
.cell {
  display: flex; align-items: center; gap: 0.35rem;
  padding: 0.3rem 0.55rem; border-radius: 0.45rem;
  background: var(--panel); border: 1px solid var(--border);
}
.cell svg { width: 1.1rem; height: 1.1rem; }
.cell.off { opacity: 0.4; }
.ver { font-family: var(--slidev-code-font-family, monospace); font-size: 0.72rem; color: var(--comment); }
.baseline {
  font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 999px;
  background: var(--green); color: var(--background);
}
.as-of { font-size: 0.7rem; color: var(--comment); }
</style>
