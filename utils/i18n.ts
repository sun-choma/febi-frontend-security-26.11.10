// Deck language for shared components, read from the headmatter of the deck being run:
//   htmlAttrs:
//     lang: ja        (slides.md)   /   lang: en   (slides.en.md)
// so slides.md and slides.en.md get the right UI strings and doc links with no per-use props.
import { configs } from '@slidev/client'

export const deckLang: string = configs.htmlAttrs?.lang ?? 'ja'
export const isJa = deckLang.startsWith('ja')

/** Pick a UI string for the deck language. Any non-Japanese deck falls back to English. */
export function t<T>(strings: { ja: T, en: T }): T {
  return isJa ? strings.ja : strings.en
}

/** MDN locale segment matching the deck: /ja/ for Japanese decks, /en-US/ otherwise. */
export const mdnLocale = isJa ? 'ja' : 'en-US'
