/* ─────────────────────────────────────────────────────────────────────────
   deck-bridge.js — puente de teclado entre una lámina y el contenedor.

   Cada lámina es un documento aparte. Cuando el foco está adentro —porque
   tocaste un botón, un campo o el canvas— el contenedor no recibe las teclas
   y la navegación principal se pierde. Este archivo reenvía SOLO las teclas
   de navegación al contenedor por postMessage, que funciona también con
   file://.

   Si la lámina se abre sola (doble clic), no hace absolutamente nada.
   ───────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  if (window.parent === window) return;      /* abierta suelta: sin contenedor */
  if (window.__deckBridge) return;
  window.__deckBridge = true;

  var NAV = {
    ArrowRight: 'next', ArrowDown: 'next', PageDown: 'next', n: 'next',
    ArrowLeft:  'prev', ArrowUp:   'prev', PageUp:   'prev', p: 'prev',
    Home: 'first',
    End:  'last',
    ' ':  'hud'
  };

  /* Escribiendo, las flechas y el espacio son del cursor, no del deck. */
  function isTyping(el) {
    if (!el) return false;
    if (el.isContentEditable) return true;
    var tag = (el.tagName || '').toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select';
  }

  document.addEventListener('keydown', function (e) {
    if (e.defaultPrevented) return;              /* la lámina ya lo usó */
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.isComposing) return;

    var dir = NAV[e.key];
    if (!dir) return;                            /* q/e/w/s/a/d son del demo */
    if (isTyping(e.target)) return;

    e.preventDefault();                          /* no scrollea ni activa botones */
    window.parent.postMessage({ type: 'deck:nav', dir: dir }, '*');
  }, false);
})();
