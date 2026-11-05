<!-- Slide "Reproduction: JSON-LD breakout": a static scheme of public/demos/jsonld.html (and -fixed):
     the HTML the server sent, the DOM Chrome parsed from it, and what the user sees.
     The DOM is what Chrome built for the demo pages; the toggle switches between the two pages. -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { jsonLdDescription, jsonLdScriptText, jsonLdSource } from '~/utils/jsonld-scheme'
import { t } from '~/utils/i18n'

const mode = ref<'plain' | 'escaped'>('plain')
const escaped = computed(() => mode.value === 'escaped')
const source = computed(() => jsonLdSource(escaped.value))
const scriptText = computed(() => jsonLdScriptText(escaped.value))
const description = computed(() => jsonLdDescription(escaped.value))
const tail = (text: string, n = 28) => text.length > n ? `…${text.slice(-n)}` : text

const tags = {
  stop: t({ ja: 'ここでスクリプト終了', en: 'script ends here' }),
  payload: t({ ja: 'ペイロード', en: 'payload' }),
  noise: t({ ja: 'ノイズ', en: 'noise' }),
  ignored: t({ ja: '無視される', en: 'ignored' }),
  safe: t({ ja: 'テキストのまま', en: 'stays text' }),
  cut: t({ ja: '途中で切れたJSON', en: 'JSON cut off' }),
  intact: t({ ja: 'JSONは無傷', en: 'JSON intact' }),
  dead: t({ ja: '読み込み失敗 → onerror実行', en: 'fails → onerror runs' }),
  text: t({ ja: 'ただのテキスト', en: 'just text' }),
  empty: t({ ja: '空：JSONを読めない', en: 'empty: JSON unreadable' }),
}
</script>

<template>
  <div class="scheme">
    <SegmentedSwitch v-model="mode" :options="[{ value: 'plain', label: 'JSON.stringify' }, { value: 'escaped', label: t({ ja: '+ < をエスケープ', en: '+ escape <' }) }]" />
    <div class="panes">
      <section>
        <h4>1. {{ t({ ja: 'サーバーが送ったHTML', en: 'HTML from the server' }) }}</h4>
        <pre class="pane src"><template v-for="(p, i) in source" :key="i"><span v-if="p.kind" :class="p.kind" :data-tag="tags[p.kind]">{{ p.text }}</span><template v-else>{{ p.text }}</template></template></pre>
      </section>
      <lucide-arrow-right class="arrow" />
      <section>
        <h4>2. {{ t({ ja: 'ブラウザが組み立てたDOM', en: 'DOM the browser built' }) }}</h4>
        <ul class="pane dom">
          <li><span class="el">&lt;h1&gt;</span> Desk lamp</li>
          <li>
            <span class="el">&lt;script&gt;</span>
            <span :class="escaped ? 'safe' : 'stop'" :data-tag="escaped ? tags.intact : tags.cut">{{ tail(scriptText) }}</span>
          </li>
          <template v-if="!escaped">
            <li><span class="payload" :data-tag="tags.dead">&lt;img src="x" onerror="steal()"&gt;</span></li>
            <li><span class="el">#text</span> <span class="noise" :data-tag="tags.noise">"}</span></li>
          </template>
          <li><span class="el">&lt;p&gt;</span> $39</li>
          <li>
            <span class="el">&lt;p id="desc"&gt;</span>
            <span v-if="description" class="safe" :data-tag="tags.text">{{ description }}</span>
            <span v-else class="missing" :data-tag="tags.empty" />
          </li>
        </ul>
      </section>
      <lucide-arrow-right class="arrow" />
      <section>
        <h4>3. {{ t({ ja: 'ユーザーに見える画面', en: 'What the user sees' }) }}</h4>
        <div class="pane view">
          <div class="title">Desk lamp</div>
          <div v-if="!escaped" class="leftovers">
            <span class="payload" :data-tag="tags.dead"><lucide-image-off /></span>
            <span class="noise" :data-tag="tags.noise">"}</span>
          </div>
          <div>$39</div>
          <div v-if="description" class="desc"><span class="safe" :data-tag="tags.text">{{ description }}</span></div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.scheme { display: flex; flex-direction: column; align-items: center; gap: 0.6rem; }
.panes { display: grid; grid-template-columns: 1.3fr auto 1fr auto 0.75fr; align-items: stretch; gap: 0.4rem; width: 100%; height: 14.5rem; }
.arrow { align-self: center; color: var(--comment); }
section { display: flex; flex-direction: column; min-width: 0; }
h4 { margin: 0 0 0.3rem; font-size: 0.7rem; font-weight: 600; color: var(--comment); }
.pane { flex: 1; margin: 0; padding: 0.45rem 0.55rem; border: 1px solid var(--border); border-radius: 0.4rem; background: var(--panel); overflow: hidden; }
.src { font: 0.72rem/1.6 var(--slidev-code-font-family, monospace); white-space: pre-wrap; word-break: break-all; color: var(--foreground); }
.dom { list-style: none; font: 0.72rem/1.45 var(--slidev-code-font-family, monospace); }
.dom li { margin: 0.25rem 0; word-break: break-all; }
.el { color: var(--pink); }
.view { display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; }
.view .title { font-weight: bold; font-size: 1rem; }
.desc { font: 0.65rem/1.5 var(--slidev-code-font-family, monospace); word-break: break-all; }
.leftovers { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
/* highlights: outline + a label, so the meaning isn't carried by colour alone */
[data-tag] { border-radius: 2px; padding: 0 2px; }
[data-tag]::after { content: attr(data-tag); margin-left: 4px; padding: 0 3px; border-radius: 2px; font: 600 0.6rem/1.4 sans-serif; vertical-align: middle; color: var(--background); }
.stop { outline: 1.5px solid var(--red); color: var(--red); }
.stop::after { background: var(--red); }
.payload { outline: 1.5px dashed var(--orange); color: var(--orange); }
.payload::after { background: var(--orange); }
.noise { outline: 1.5px dashed var(--red); color: var(--red); }
.noise::after { background: var(--red); }
.ignored { opacity: 0.5; text-decoration: line-through; }
.ignored::after { background: var(--comment); }
.safe { outline: 1.5px solid var(--green); color: var(--green); }
.safe::after { background: var(--green); }
.missing { outline: 1.5px dashed var(--comment); color: var(--comment); }
.missing::after { margin-left: 0; background: var(--comment); }
</style>
