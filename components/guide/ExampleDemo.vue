<!-- Reference demo: an animated canvas with two variants. Copy it as a starting point for your own demo.
     Shows: runs only while its slide is active, time-based motion, crisp canvas under Slidev's scaling,
     deck-language UI text, theme colours, focus handed back after mouse clicks, full cleanup. -->
<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useIsSlideActive, useSlideContext } from '@slidev/client'
import { t } from '~/utils/i18n'

const W = 320 // CSS size of the canvas; the slide column decides this
const H = 200

const mode = ref<'linear' | 'ease'>('linear')
const canvas = ref<HTMLCanvasElement>()
const isActive = useIsSlideActive()
const { $scale } = useSlideContext()

let raf = 0
let last = 0
let x = 0 // position integrated over real time, so a slow frame skips ahead instead of slowing down

function frame(now: number) {
  const dt = last ? (now - last) / 1000 : 0
  last = now
  x = (x + dt * 120) % W // 120 px per second, whatever the frame rate
  draw()
  raf = requestAnimationFrame(frame)
}

function draw() {
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) return
  const css = getComputedStyle(canvas.value!)
  ctx.clearRect(0, 0, W, H)
  const p = x / W
  const px = mode.value === 'ease' ? W * (1 - (1 - p) ** 3) : x
  ctx.fillStyle = css.getPropertyValue('--purple')
  ctx.beginPath()
  ctx.arc(px, H / 2, 16, 0, Math.PI * 2)
  ctx.fill()
}

// Backing store = CSS size × devicePixelRatio × Slidev's slide scale, so it stays sharp when scaled
function resize() {
  const c = canvas.value
  if (!c) return
  const k = window.devicePixelRatio * $scale.value
  c.width = W * k
  c.height = H * k
  c.getContext('2d')!.setTransform(k, 0, 0, k, 0, 0)
  draw()
}

function start() { if (!raf) { last = 0; raf = requestAnimationFrame(frame) } }
function stop() { cancelAnimationFrame(raf); raf = 0 }

// Slides are mounted while hidden: animate only while this slide is the active one
watch(isActive, active => active ? start() : stop())
watch($scale, resize)
onMounted(() => { resize(); if (isActive.value) start() })
onUnmounted(stop)
</script>

<template>
  <div class="demo">
    <canvas ref="canvas" :style="{ width: `${W}px`, height: `${H}px` }" />
    <SegmentedSwitch v-model="mode" :options="[{ value: 'linear', label: 'linear' }, { value: 'ease', label: 'ease-out' }]" />
    <div class="hint">{{ t({ ja: '切り替えて動きを比べます', en: 'Switch to compare the motion' }) }}</div>
  </div>
</template>

<style scoped>
.demo { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; }
canvas { background: var(--panel); border: 1px solid var(--border); border-radius: 0.5rem; }
.hint { font-size: 0.75rem; color: var(--comment); }
</style>
