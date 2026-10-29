<!-- Browser-window frame around an iframe (external demo site or a page in public/).
     <DemoEmbed src="https://example.com/demo" />
     <DemoEmbed :tabs="[{ label: 'SPA', src: '/demos/spa.html' }, { label: 'MPA', src: 'https://…' }]" />
     Paths starting with "/" are resolved against the deploy base, so public/ pages work on GitHub Pages.
     `scale` shrinks the page so a desktop-width site fits; `height` is the visible frame height in px.
     Needs network for external sites: keep a local fallback or screenshot for the talk. -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { t } from '~/utils/i18n'
import { releaseFocus } from '~/utils/release-focus'

const props = withDefaults(defineProps<{
  src?: string
  tabs?: { label: string, src: string }[]
  scale?: number
  height?: number
}>(), { scale: 0.75, height: 320 })

const list = computed(() => props.tabs?.length ? props.tabs : props.src ? [{ label: props.src, src: props.src }] : [])
if (!list.value.length)
  console.warn('[DemoEmbed] needs `src` or a non-empty `tabs`')
const active = ref(0)
watch(list, () => { active.value = 0 })

// "/page.html" → base path; "//cdn…" (protocol-relative) and full URLs are left alone
const resolve = (src: string) => /^\/(?!\/)/.test(src) ? import.meta.env.BASE_URL + src.slice(1) : src
const iframeStyle = computed(() => ({
  width: `${100 / props.scale}%`,
  height: `${props.height / props.scale}px`,
  transform: `scale(${props.scale})`,
}))

function openTab() {
  window.open(resolve(list.value[active.value].src), '_blank', 'noopener')
}
</script>

<template>
  <div v-if="list.length" class="frame">
    <div v-if="list.length > 1" class="tabstrip">
      <button v-for="(tab, i) in list" :key="i" class="tab" :class="{ active: i === active }" @click="active = i; releaseFocus($event)">
        <logos-chrome />
        <span>{{ tab.label }}</span>
      </button>
    </div>
    <div class="bar">
      <div class="url">{{ list[active].src }}</div>
      <button class="open" @click="openTab(); releaseFocus($event)">{{ t({ ja: '新しいタブで開く', en: 'Open in new tab' }) }}</button>
    </div>
    <div class="body" :style="{ height: `${height}px` }">
      <iframe
        v-for="(tab, i) in list" v-show="i === active" :key="i"
        :src="resolve(tab.src)" :title="tab.label" :style="iframeStyle"
        loading="lazy" referrerpolicy="no-referrer"
      />
    </div>
  </div>
</template>

<style scoped>
.frame {
  width: 100%; overflow: hidden;
  border: 1px solid var(--border); border-radius: 0.6rem;
  background: var(--panel); box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
}
.tabstrip { display: flex; gap: 2px; padding: 6px 6px 0; background: color-mix(in srgb, var(--panel) 60%, black); }
.tab {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border: 0; border-radius: 6px 6px 0 0;
  background: transparent; color: var(--comment); font-size: 12px; white-space: nowrap; cursor: pointer;
}
.tab svg { width: 13px; height: 13px; }
.tab.active { background: color-mix(in srgb, var(--panel) 80%, black); color: var(--foreground); }
.bar { display: flex; align-items: center; gap: 8px; padding: 6px 10px; background: color-mix(in srgb, var(--panel) 80%, black); border-bottom: 1px solid var(--border); }
.url {
  flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
  padding: 5px 8px; border-radius: 5px; background: var(--panel);
  font: 12px/1 var(--slidev-code-font-family, monospace); color: var(--comment);
}
.open {
  padding: 4px 10px; border: 0; border-radius: 5px;
  background: var(--border); color: var(--foreground); font-size: 12px; font-weight: 600; cursor: pointer;
}
.open:hover { background: var(--comment); }
.body { position: relative; width: 100%; overflow: hidden; }
.body iframe { position: absolute; top: 0; left: 0; display: block; border: 0; background: white; transform-origin: top left; }
</style>
