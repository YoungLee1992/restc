! function (e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
  "use strict";

  function t(t, i) {
    function r() {
      t.display.wrapper.offsetHeight ? (o(t, i), t.display.lastWrapHeight != t.display.wrapper.clientHeight && t.refresh()) : i.timeout = setTimeout(r, i.delay)
    }
    i.timeout = setTimeout(r, i.delay), i.hurry = function () {
      clearTimeout(i.timeout), i.timeout = setTimeout(r, 50)
    }, e.on(window, "mouseup", i.hurry), e.on(window, "keyup", i.hurry)
  }

  function o(t, o) {
    clearTimeout(o.timeout), e.off(window, "mouseup", o.hurry), e.off(window, "keyup", o.hurry)
  }
  e.defineOption("autoRefresh", !1, function (e, i) {
    e.state.autoRefresh && (o(e, e.state.autoRefresh), e.state.autoRefresh = null), i && 0 == e.display.wrapper.offsetHeight && t(e, e.state.autoRefresh = {
      delay: i.delay || 250
    })
  })
});