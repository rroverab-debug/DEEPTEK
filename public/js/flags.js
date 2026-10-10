// Runs before first paint. Marks the page as JS-enabled and, unless the
// visitor prefers reduced motion, allows entrance animations to start hidden.
// If the animation bundle has not started within 3s, reveal everything.
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  root.classList.add('motion-ok');
  setTimeout(function () {
    if (!root.classList.contains('motion-ready')) root.classList.add('motion-failed');
  }, 3000);
})();
