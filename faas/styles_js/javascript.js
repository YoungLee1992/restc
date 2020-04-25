! function (e) {
  "object" == typeof exports && "object" == typeof module ? e(require("../../lib/codemirror")) : "function" == typeof define && define.amd ? define(["../../lib/codemirror"], e) : e(CodeMirror)
}(function (e) {
  "use strict";

  function t(e, t, r) {
    return /^(?:operator|sof|keyword c|case|new|[\[{}\(,;:]|=>)$/.test(t.lastType) || "quasi" == t.lastType && /\{\s*$/.test(e.string.slice(0, e.pos - (r || 0)))
  }
  e.defineMode("javascript", function (r, n) {
    function a(e) {
      for (var t, r = !1, n = !1; null != (t = e.next());) {
        if (!r) {
          if ("/" == t && !n) return;
          "[" == t ? n = !0 : n && "]" == t && (n = !1)
        }
        r = !r && "\\" == t
      }
    }

    function i(e, t, r) {
      return je = e, Me = r, t
    }

    function o(e, r) {
      var n = e.next();
      if ('"' == n || "'" == n) return r.tokenize = c(n), r.tokenize(e, r);
      if ("." == n && e.match(/^\d+(?:[eE][+\-]?\d+)?/)) return i("number", "number");
      if ("." == n && e.match("..")) return i("spread", "meta");
      if (/[\[\]{}\(\),;\:\.]/.test(n)) return i(n);
      if ("=" == n && e.eat(">")) return i("=>", "operator");
      if ("0" == n && e.eat(/x/i)) return e.eatWhile(/[\da-f]/i), i("number", "number");
      if ("0" == n && e.eat(/o/i)) return e.eatWhile(/[0-7]/i), i("number", "number");
      if ("0" == n && e.eat(/b/i)) return e.eatWhile(/[01]/i), i("number", "number");
      if (/\d/.test(n)) return e.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/), i("number", "number");
      if ("/" == n) return e.eat("*") ? (r.tokenize = u, u(e, r)) : e.eat("/") ? (e.skipToEnd(), i("comment", "comment")) : t(e, r, 1) ? (a(e), e.match(/^\b(([gimyu])(?![gimyu]*\2))+\b/), i("regexp", "string-2")) : (e.eatWhile(qe), i("operator", "operator", e.current()));
      if ("`" == n) return r.tokenize = l, l(e, r);
      if ("#" == n) return e.skipToEnd(), i("error", "error");
      if (qe.test(n)) return e.eatWhile(qe), i("operator", "operator", e.current());
      if (Te.test(n)) {
        e.eatWhile(Te);
        var o = e.current(),
          f = $e.propertyIsEnumerable(o) && $e[o];
        return f && "." != r.lastType ? i(f.type, f.style, o) : i("variable", "variable", o)
      }
    }

    function c(e) {
      return function (t, r) {
        var n, a = !1;
        if (Ie && "@" == t.peek() && t.match(Ce)) return r.tokenize = o, i("jsonld-keyword", "meta");
        for (; null != (n = t.next()) && (n != e || a);) a = !a && "\\" == n;
        return a || (r.tokenize = o), i("string", "string")
      }
    }

    function u(e, t) {
      for (var r, n = !1; r = e.next();) {
        if ("/" == r && n) {
          t.tokenize = o;
          break
        }
        n = "*" == r
      }
      return i("comment", "comment")
    }

    function l(e, t) {
      for (var r, n = !1; null != (r = e.next());) {
        if (!n && ("`" == r || "$" == r && e.eat("{"))) {
          t.tokenize = o;
          break
        }
        n = !n && "\\" == r
      }
      return i("quasi", "string-2", e.current())
    }

    function f(e, t) {
      t.fatArrowAt && (t.fatArrowAt = null);
      var r = e.string.indexOf("=>", e.start);
      if (!(r < 0)) {
        for (var n = 0, a = !1, i = r - 1; i >= 0; --i) {
          var o = e.string.charAt(i),
            c = We.indexOf(o);
          if (c >= 0 && c < 3) {
            if (!n) {
              ++i;
              break
            }
            if (0 == --n) {
              "(" == o && (a = !0);
              break
            }
          } else if (c >= 3 && c < 6) ++n;
          else if (Te.test(o)) a = !0;
          else {
            if (/["'\/]/.test(o)) return;
            if (a && !n) {
              ++i;
              break
            }
          }
        }
        a && !n && (t.fatArrowAt = i)
      }
    }

    function s(e, t, r, n, a, i) {
      this.indented = e, this.column = t, this.type = r, this.prev = a, this.info = i, null != n && (this.align = n)
    }

    function d(e, t) {
      for (var r = e.localVars; r; r = r.next)
        if (r.name == t) return !0;
      for (var n = e.context; n; n = n.prev)
        for (var r = n.vars; r; r = r.next)
          if (r.name == t) return !0
    }

    function p(e, t, r, n, a) {
      var i = e.cc;
      for (Pe.state = e, Pe.stream = a, Pe.marked = null, Pe.cc = i, Pe.style = t, e.lexical.hasOwnProperty("align") || (e.lexical.align = !0);;) {
        var o = i.length ? i.pop() : ze ? j : g;
        if (o(r, n)) {
          for (; i.length && i[i.length - 1].lex;) i.pop()();
          return Pe.marked ? Pe.marked : "variable" == r && d(e, n) ? "variable-2" : t
        }
      }
    }

    function m() {
      for (var e = arguments.length - 1; e >= 0; e--) Pe.cc.push(arguments[e])
    }

    function v() {
      return m.apply(null, arguments), !0
    }

    function y(e) {
      function t(t) {
        for (var r = t; r; r = r.next)
          if (r.name == e) return !0;
        return !1
      }
      var r = Pe.state;
      if (Pe.marked = "def", r.context) {
        if (t(r.localVars)) return;
        r.localVars = {
          name: e,
          next: r.localVars
        }
      } else {
        if (t(r.globalVars)) return;
        n.globalVars && (r.globalVars = {
          name: e,
          next: r.globalVars
        })
      }
    }

    function k() {
      Pe.state.context = {
        prev: Pe.state.context,
        vars: Pe.state.localVars
      }, Pe.state.localVars = Se
    }

    function b() {
      Pe.state.localVars = Pe.state.context.vars, Pe.state.context = Pe.state.context.prev
    }

    function x(e, t) {
      var r = function () {
        var r = Pe.state,
          n = r.indented;
        if ("stat" == r.lexical.type) n = r.lexical.indented;
        else
          for (var a = r.lexical; a && ")" == a.type && a.align; a = a.prev) n = a.indented;
        r.lexical = new s(n, Pe.stream.column(), e, null, r.lexical, t)
      };
      return r.lex = !0, r
    }

    function h() {
      var e = Pe.state;
      e.lexical.prev && (")" == e.lexical.type && (e.indented = e.lexical.indented), e.lexical = e.lexical.prev)
    }

    function w(e) {
      function t(r) {
        return r == e ? v() : ";" == e ? m() : v(t)
      }
      return t
    }

    function g(e, t) {
      return "var" == e ? v(x("vardef", t.length), _, w(";"), h) : "keyword a" == e ? v(x("form"), V, g, h) : "keyword b" == e ? v(x("form"), g, h) : "{" == e ? v(x("}"), J, h) : ";" == e ? v() : "if" == e ? ("else" == Pe.state.lexical.info && Pe.state.cc[Pe.state.cc.length - 1] == h && Pe.state.cc.pop()(), v(x("form"), V, g, h, ae)) : "function" == e ? v(fe) : "for" == e ? v(x("form"), ie, g, h) : "variable" == e ? v(x("stat"), N) : "switch" == e ? v(x("form"), V, x("}", "switch"), w("{"), J, h, h) : "case" == e ? v(j, w(":")) : "default" == e ? v(w(":")) : "catch" == e ? v(x("form"), k, w("("), se, w(")"), g, h, b) : "class" == e ? v(x("form"), de, h) : "export" == e ? v(x("stat"), ye, h) : "import" == e ? v(x("stat"), ke, h) : "module" == e ? v(x("form"), ee, x("}"), w("{"), J, h, h) : "type" == e ? v(Q, w("operator"), Q, w(";")) : "async" == e ? v(g) : m(x("stat"), j, w(";"), h)
    }

    function j(e) {
      return E(e, !1)
    }

    function M(e) {
      return E(e, !0)
    }

    function V(e) {
      return "(" != e ? m() : v(x(")"), j, w(")"), h)
    }

    function E(e, t) {
      if (Pe.state.fatArrowAt == Pe.stream.start) {
        var r = t ? W : C;
        if ("(" == e) return v(k, x(")"), F(ee, ")"), h, w("=>"), r, b);
        if ("variable" == e) return m(k, ee, w("=>"), r, b)
      }
      var n = t ? T : A;
      return Oe.hasOwnProperty(e) ? v(n) : "function" == e ? v(fe, n) : "keyword c" == e || "async" == e ? v(t ? z : I) : "(" == e ? v(x(")"), I, w(")"), h, n) : "operator" == e || "spread" == e ? v(t ? M : j) : "[" == e ? v(x("]"), we, h, n) : "{" == e ? G(H, "}", null, n) : "quasi" == e ? m($, n) : "new" == e ? v(O(t)) : v()
    }

    function I(e) {
      return e.match(/[;\}\)\],]/) ? m() : m(j)
    }

    function z(e) {
      return e.match(/[;\}\)\],]/) ? m() : m(M)
    }

    function A(e, t) {
      return "," == e ? v(j) : T(e, t, !1)
    }

    function T(e, t, r) {
      var n = 0 == r ? A : T,
        a = 0 == r ? j : M;
      return "=>" == e ? v(k, r ? W : C, b) : "operator" == e ? /\+\+|--/.test(t) ? v(n) : "?" == t ? v(j, w(":"), a) : v(a) : "quasi" == e ? m($, n) : ";" != e ? "(" == e ? G(M, ")", "call", n) : "." == e ? v(B, n) : "[" == e ? v(x("]"), I, w("]"), h, n) : void 0 : void 0
    }

    function $(e, t) {
      return "quasi" != e ? m() : "${" != t.slice(t.length - 2) ? v($) : v(j, q)
    }

    function q(e) {
      if ("}" == e) return Pe.marked = "string-2", Pe.state.tokenize = l, v($)
    }

    function C(e) {
      return f(Pe.stream, Pe.state), m("{" == e ? g : j)
    }

    function W(e) {
      return f(Pe.stream, Pe.state), m("{" == e ? g : M)
    }

    function O(e) {
      return function (t) {
        return "." == t ? v(e ? S : P) : m(e ? M : j)
      }
    }

    function P(e, t) {
      if ("target" == t) return Pe.marked = "keyword", v(A)
    }

    function S(e, t) {
      if ("target" == t) return Pe.marked = "keyword", v(T)
    }

    function N(e) {
      return ":" == e ? v(h, g) : m(A, w(";"), h)
    }

    function B(e) {
      if ("variable" == e) return Pe.marked = "property", v()
    }

    function H(e, t) {
      return "async" == e ? (Pe.marked = "property", v(H)) : "variable" == e || "keyword" == Pe.style ? (Pe.marked = "property", v("get" == t || "set" == t ? U : D)) : "number" == e || "string" == e ? (Pe.marked = Ie ? "property" : Pe.style + " property", v(D)) : "jsonld-keyword" == e ? v(D) : "modifier" == e ? v(H) : "[" == e ? v(j, w("]"), D) : "spread" == e ? v(j) : ":" == e ? m(D) : void 0
    }

    function U(e) {
      return "variable" != e ? m(D) : (Pe.marked = "property", v(fe))
    }

    function D(e) {
      return ":" == e ? v(M) : "(" == e ? m(fe) : void 0
    }

    function F(e, t) {
      function r(n, a) {
        if ("," == n) {
          var i = Pe.state.lexical;
          return "call" == i.info && (i.pos = (i.pos || 0) + 1), v(function (r, n) {
            return r == t || n == t ? m() : m(e)
          }, r)
        }
        return n == t || a == t ? v() : v(w(t))
      }
      return function (n, a) {
        return n == t || a == t ? v() : m(e, r)
      }
    }

    function G(e, t, r) {
      for (var n = 3; n < arguments.length; n++) Pe.cc.push(arguments[n]);
      return v(x(t, r), F(e, t), h)
    }

    function J(e) {
      return "}" == e ? v() : m(g, J)
    }

    function K(e, t) {
      if (Ae) {
        if (":" == e) return v(Q);
        if ("?" == t) return v(K)
      }
    }

    function L(e, t) {
      if ("=" == t) return v(M)
    }

    function Q(e) {
      return "variable" == e ? (Pe.marked = "variable-3", v(Z)) : "{" == e ? v(F(X, "}")) : "(" == e ? v(F(Y, ")"), R) : void 0
    }

    function R(e) {
      if ("=>" == e) return v(Q)
    }

    function X(e) {
      return "variable" == e || "keyword" == Pe.style ? (Pe.marked = "property", v(X)) : ":" == e ? v(Q) : void 0
    }

    function Y(e) {
      return "variable" == e ? v(Y) : ":" == e ? v(Q) : void 0
    }

    function Z(e, t) {
      return "<" == t ? v(F(Q, ">"), Z) : "[" == e ? v(w("]"), Z) : void 0
    }

    function _() {
      return m(ee, K, re, ne)
    }

    function ee(e, t) {
      return "modifier" == e ? v(ee) : "variable" == e ? (y(t), v()) : "spread" == e ? v(ee) : "[" == e ? G(ee, "]") : "{" == e ? G(te, "}") : void 0
    }

    function te(e, t) {
      return "variable" != e || Pe.stream.match(/^\s*:/, !1) ? ("variable" == e && (Pe.marked = "property"), "spread" == e ? v(ee) : "}" == e ? m() : v(w(":"), ee, re)) : (y(t), v(re))
    }

    function re(e, t) {
      if ("=" == t) return v(M)
    }

    function ne(e) {
      if ("," == e) return v(_)
    }

    function ae(e, t) {
      if ("keyword b" == e && "else" == t) return v(x("form", "else"), g, h)
    }

    function ie(e) {
      if ("(" == e) return v(x(")"), oe, w(")"), h)
    }

    function oe(e) {
      return "var" == e ? v(_, w(";"), ue) : ";" == e ? v(ue) : "variable" == e ? v(ce) : m(j, w(";"), ue)
    }

    function ce(e, t) {
      return "in" == t || "of" == t ? (Pe.marked = "keyword", v(j)) : v(A, ue)
    }

    function ue(e, t) {
      return ";" == e ? v(le) : "in" == t || "of" == t ? (Pe.marked = "keyword", v(j)) : m(j, w(";"), le)
    }

    function le(e) {
      ")" != e && v(j)
    }

    function fe(e, t) {
      return "*" == t ? (Pe.marked = "keyword", v(fe)) : "variable" == e ? (y(t), v(fe)) : "(" == e ? v(k, x(")"), F(se, ")"), h, K, g, b) : void 0
    }

    function se(e) {
      return "spread" == e ? v(se) : m(ee, K, L)
    }

    function de(e, t) {
      if ("variable" == e) return y(t), v(pe)
    }

    function pe(e, t) {
      return "extends" == t ? v(Ae ? Q : j, pe) : "{" == e ? v(x("}"), me, h) : void 0
    }

    function me(e, t) {
      return "variable" == e || "keyword" == Pe.style ? ("static" == t || "get" == t || "set" == t || Ae && ("public" == t || "private" == t || "protected" == t)) && Pe.stream.match(/^\s+[\w$\xa1-\uffff]/, !1) ? (Pe.marked = "keyword", v(me)) : (Pe.marked = "property", v(Ae ? ve : fe, me)) : "*" == t ? (Pe.marked = "keyword", v(me)) : ";" == e ? v(me) : "}" == e ? v() : void 0
    }

    function ve(e) {
      return ":" == e ? v(Q) : m(fe)
    }

    function ye(e, t) {
      return "*" == t ? (Pe.marked = "keyword", v(he, w(";"))) : "default" == t ? (Pe.marked = "keyword", v(j, w(";"))) : m(g)
    }

    function ke(e) {
      return "string" == e ? v() : m(be, he)
    }

    function be(e, t) {
      return "{" == e ? G(be, "}") : ("variable" == e && y(t), "*" == t && (Pe.marked = "keyword"), v(xe))
    }

    function xe(e, t) {
      if ("as" == t) return Pe.marked = "keyword", v(be)
    }

    function he(e, t) {
      if ("from" == t) return Pe.marked = "keyword", v(j)
    }

    function we(e) {
      return "]" == e ? v() : m(F(M, "]"))
    }

    function ge(e, t) {
      return "operator" == e.lastType || "," == e.lastType || qe.test(t.charAt(0)) || /[,.]/.test(t.charAt(0))
    }
    var je, Me, Ve = r.indentUnit,
      Ee = n.statementIndent,
      Ie = n.jsonld,
      ze = n.json || Ie,
      Ae = n.typescript,
      Te = n.wordCharacters || /[\w$\xa1-\uffff]/,
      $e = function () {
        function e(e) {
          return {
            type: e,
            style: "keyword"
          }
        }
        var t = e("keyword a"),
          r = e("keyword b"),
          n = e("keyword c"),
          a = e("operator"),
          i = {
            type: "atom",
            style: "atom"
          },
          o = {
            if: e("if"),
            while: t,
            with: t,
            else: r,
            do: r,
            try: r,
            finally: r,
            return: n,
            break: n,
            continue: n,
            new: e("new"),
            delete: n,
            throw: n,
            debugger: n,
            var: e("var"),
            const: e("var"),
            let: e("var"),
            function: e("function"),
            catch: e("catch"),
            for: e("for"),
            switch: e("switch"),
            case: e("case"),
            default: e("default"),
            in: a,
            typeof: a,
            instanceof: a,
            true: i,
            false: i,
            null: i,
            undefined: i,
            NaN: i,
            Infinity: i,
            this: e("this"),
            class: e("class"),
            super: e("atom"),
            yield: n,
            export: e("export"),
            import: e("import"),
            extends: n,
            await: n,
            async: e("async")
          };
        if (Ae) {
          var c = {
              type: "variable",
              style: "variable-3"
            },
            u = {
              interface: e("class"),
              implements: n,
              namespace: n,
              module: e("module"),
              enum: e("module"),
              type: e("type"),
              public: e("modifier"),
              private: e("modifier"),
              protected: e("modifier"),
              abstract: e("modifier"),
              as: a,
              string: c,
              number: c,
              boolean: c,
              any: c
            };
          for (var l in u) o[l] = u[l]
        }
        return o
      }(),
      qe = /[+\-*&%=<>!?|~^]/,
      Ce = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/,
      We = "([{}])",
      Oe = {
        atom: !0,
        number: !0,
        variable: !0,
        string: !0,
        regexp: !0,
        this: !0,
        "jsonld-keyword": !0
      },
      Pe = {
        state: null,
        column: null,
        marked: null,
        cc: null
      },
      Se = {
        name: "this",
        next: {
          name: "arguments"
        }
      };
    return h.lex = !0, {
      startState: function (e) {
        var t = {
          tokenize: o,
          lastType: "sof",
          cc: [],
          lexical: new s((e || 0) - Ve, 0, "block", !1),
          localVars: n.localVars,
          context: n.localVars && {
            vars: n.localVars
          },
          indented: e || 0
        };
        return n.globalVars && "object" == typeof n.globalVars && (t.globalVars = n.globalVars), t
      },
      token: function (e, t) {
        if (e.sol() && (t.lexical.hasOwnProperty("align") || (t.lexical.align = !1), t.indented = e.indentation(), f(e, t)), t.tokenize != u && e.eatSpace()) return null;
        var r = t.tokenize(e, t);
        return "comment" == je ? r : (t.lastType = "operator" != je || "++" != Me && "--" != Me ? je : "incdec", p(t, r, je, Me, e))
      },
      indent: function (t, r) {
        if (t.tokenize == u) return e.Pass;
        if (t.tokenize != o) return 0;
        var a, i = r && r.charAt(0),
          c = t.lexical;
        if (!/^\s*else\b/.test(r))
          for (var l = t.cc.length - 1; l >= 0; --l) {
            var f = t.cc[l];
            if (f == h) c = c.prev;
            else if (f != ae) break
          }
        for (;
          ("stat" == c.type || "form" == c.type) && ("}" == i || (a = t.cc[t.cc.length - 1]) && (a == A || a == T) && !/^[,\.=+\-*:?[\(]/.test(r));) c = c.prev;
        Ee && ")" == c.type && "stat" == c.prev.type && (c = c.prev);
        var s = c.type,
          d = i == s;
        return "vardef" == s ? c.indented + ("operator" == t.lastType || "," == t.lastType ? c.info + 1 : 0) : "form" == s && "{" == i ? c.indented : "form" == s ? c.indented + Ve : "stat" == s ? c.indented + (ge(t, r) ? Ee || Ve : 0) : "switch" != c.info || d || 0 == n.doubleIndentSwitch ? c.align ? c.column + (d ? 0 : 1) : c.indented + (d ? 0 : Ve) : c.indented + (/^(?:case|default)\b/.test(r) ? Ve : 2 * Ve)
      },
      electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
      blockCommentStart: ze ? null : "/*",
      blockCommentEnd: ze ? null : "*/",
      lineComment: ze ? null : "//",
      fold: "brace",
      closeBrackets: "()[]{}''\"\"``",
      helperType: ze ? "json" : "javascript",
      jsonldMode: Ie,
      jsonMode: ze,
      expressionAllowed: t,
      skipExpression: function (e) {
        var t = e.cc[e.cc.length - 1];
        t != j && t != M || e.cc.pop()
      }
    }
  }), e.registerHelper("wordChars", "javascript", /[\w$]/), e.defineMIME("text/javascript", "javascript"), e.defineMIME("text/ecmascript", "javascript"), e.defineMIME("application/javascript", "javascript"), e.defineMIME("application/x-javascript", "javascript"), e.defineMIME("application/ecmascript", "javascript"), e.defineMIME("application/json", {
    name: "javascript",
    json: !0
  }), e.defineMIME("application/x-json", {
    name: "javascript",
    json: !0
  }), e.defineMIME("application/ld+json", {
    name: "javascript",
    jsonld: !0
  }), e.defineMIME("text/typescript", {
    name: "javascript",
    typescript: !0
  }), e.defineMIME("application/typescript", {
    name: "javascript",
    typescript: !0
  })
});