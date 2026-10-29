// Slidev disables its keyboard shortcuts (arrows, space, a presentation clicker) while a <button>,
// <a>, <input> or <textarea> has focus. After a *mouse* click, hand focus back so the presenter can
// keep navigating. Keyboard activation (event.detail === 0) keeps focus for keyboard users.
export function releaseFocus(event: MouseEvent) {
  if (event.detail > 0)
    (event.currentTarget as HTMLElement | null)?.blur()
}
