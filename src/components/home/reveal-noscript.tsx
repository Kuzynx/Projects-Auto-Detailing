/**
 * Without JavaScript, `motion` never runs, so elements server-rendered at opacity 0 by
 * `Reveal`/`RevealItem` would stay hidden. This overrides their inline styles. Render once per page.
 */
export function RevealNoScript() {
  return (
    <noscript>
      <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
    </noscript>
  );
}
