/* R0492 (TECH-51): the splash's byte bar. See index.html. */
/* global document, window, PerformanceObserver */
(function () {
  var EXPECTED = 600000;
  var bar = document.getElementById('splash-bar');
  var label = bar && bar.previousElementSibling;
  if (!bar || !window.PerformanceObserver) return;
  var got = 0;
  var seen = {};
  try {
    new PerformanceObserver(function (list) {
      list.getEntries().forEach(function (e) {
        if (
          seen[e.name] ||
          (e.initiatorType !== 'script' && e.initiatorType !== 'link' && e.initiatorType !== 'css')
        )
          return;
        seen[e.name] = 1;
        got += e.encodedBodySize || e.transferSize || 0;
      });
      bar.value = Math.max(3, Math.min(95, Math.round((got / EXPECTED) * 100)));
      if (label) label.textContent = 'Planting the Grove… ' + Math.round(got / 1024) + ' kB';
    }).observe({ type: 'resource', buffered: true });
  } catch {
    /* no observer: the bar just stays put */
  }
})();
