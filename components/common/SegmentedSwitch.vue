<!-- Segmented control with a sliding thumb (a group of aria-pressed buttons); drive demo variants with it.
     <SegmentedSwitch v-model="mode" :options="[{ value: 'bad', label: 'Before' }, { value: 'good', label: 'After' }]" /> -->
<script setup lang="ts" generic="T extends string | number">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { releaseFocus } from '~/utils/release-focus'

const props = defineProps<{
  options: { value: T, label: string }[]
  ariaLabel?: string
}>()
const model = defineModel<T>({ required: true })

const root = ref<HTMLElement>()
const buttons = ref<HTMLButtonElement[]>([])
const thumb = ref({ left: '0px', width: '0px' })
const ready = ref(false) // no slide-in from 0 width on first measurement

function updateThumb() {
  const btn = buttons.value[props.options.findIndex(o => o.value === model.value)]
  if (!btn?.offsetWidth)
    return
  thumb.value = { left: `${btn.offsetLeft}px`, width: `${btn.offsetWidth}px` }
  if (!ready.value)
    requestAnimationFrame(() => { ready.value = true })
}

watch(model, () => nextTick(updateThumb))

// ResizeObserver, not window resize: Slidev mounts slides while hidden (offsetWidth 0),
// so the thumb must re-measure when this slide actually becomes visible.
let ro: ResizeObserver | undefined
onMounted(() => {
  ro = new ResizeObserver(updateThumb)
  ro.observe(root.value!)
})
onUnmounted(() => ro?.disconnect())
</script>

<template>
  <div ref="root" class="segmented" role="group" :aria-label="ariaLabel">
    <div class="thumb" :class="{ ready }" :style="thumb" aria-hidden="true" />
    <button
      v-for="(opt, i) in options" :key="String(opt.value)"
      :ref="el => { if (el) buttons[i] = el as HTMLButtonElement }"
      class="segment" :class="{ active: opt.value === model }"
      :aria-pressed="opt.value === model"
      @click="model = opt.value; releaseFocus($event)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped>
.segmented {
  position: relative; display: inline-flex; gap: 0.125rem;
  padding: 0.25rem; border-radius: 999px; background: var(--border);
}
.thumb {
  position: absolute; top: 0.25rem; bottom: 0.25rem; z-index: 0;
  border-radius: 999px; background: var(--purple);
  box-shadow: 0 2px 6px color-mix(in srgb, var(--purple) 30%, transparent);
}
.thumb.ready { transition: left 300ms cubic-bezier(0.4, 0, 0.2, 1), width 300ms cubic-bezier(0.4, 0, 0.2, 1); }
.segment {
  position: relative; z-index: 1;
  padding: 0.5rem 1.25rem; border: none; border-radius: 999px;
  background: transparent; color: var(--foreground);
  font-size: 0.9375rem; font-weight: 500; cursor: pointer;
  transition: color 200ms ease;
}
.segment.active { color: var(--background); font-weight: 600; }
.segment:not(.active):hover { color: var(--pink); }
.segment:focus-visible { outline: 2px solid var(--pink); outline-offset: 2px; }
</style>
