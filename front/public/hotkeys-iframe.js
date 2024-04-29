/* eslint-disable */
!(function (e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = t())
    : 'function' == typeof define && define.amd
    ? define(t)
    : ((e = e || self).hotkeysJs = t());
})(this, function () {
  'use strict';
  function e(t) {
    return (e =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function (e) {
            return typeof e;
          }
        : function (e) {
            return e &&
              'function' == typeof Symbol &&
              e.constructor === Symbol &&
              e !== Symbol.prototype
              ? 'symbol'
              : typeof e;
          })(t);
  }
  var t =
    'undefined' != typeof navigator &&
    navigator.userAgent.toLowerCase().indexOf('firefox') > 0;
  function n(e, t, n) {
    e.addEventListener
      ? e.addEventListener(t, n, !1)
      : e.attachEvent &&
        e.attachEvent('on'.concat(t), function () {
          n(window.event);
        });
  }
  function o(e, t) {
    for (var n = t.slice(0, t.length - 1), o = 0; o < n.length; o++)
      n[o] = e[n[o].toLowerCase()];
    return n;
  }
  function r(e) {
    'string' != typeof e && (e = '');
    for (
      var t = (e = e.replace(/\s/g, '')).split(','), n = t.lastIndexOf('');
      n >= 0;

    )
      (t[n - 1] += ','), t.splice(n, 1), (n = t.lastIndexOf(''));
    return t;
  }
  for (
    var i = {
        backspace: 8,
        tab: 9,
        clear: 12,
        enter: 13,
        return: 13,
        esc: 27,
        escape: 27,
        space: 32,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        del: 46,
        delete: 46,
        ins: 45,
        insert: 45,
        home: 36,
        end: 35,
        pageup: 33,
        pagedown: 34,
        capslock: 20,
        '⇪': 20,
        ',': 188,
        '.': 190,
        '/': 191,
        '`': 192,
        '-': t ? 173 : 189,
        '=': t ? 61 : 187,
        ';': t ? 59 : 186,
        "'": 222,
        '[': 219,
        ']': 221,
        '\\': 220,
      },
      f = {
        '⇧': 16,
        shift: 16,
        '⌥': 18,
        alt: 18,
        option: 18,
        '⌃': 17,
        ctrl: 17,
        control: 17,
        '⌘': 91,
        cmd: 91,
        command: 91,
      },
      c = {
        16: 'shiftKey',
        18: 'altKey',
        17: 'ctrlKey',
        91: 'metaKey',
        shiftKey: 16,
        ctrlKey: 17,
        altKey: 18,
        metaKey: 91,
      },
      a = { 16: !1, 18: !1, 17: !1, 91: !1 },
      l = {},
      s = 1;
    s < 20;
    s++
  )
    i['f'.concat(s)] = 111 + s;
  var p = [],
    y = 'all',
    u = [],
    d = function (e) {
      return (
        i[e.toLowerCase()] ||
        f[e.toLowerCase()] ||
        e.toUpperCase().charCodeAt(0)
      );
    };
  function h(e) {
    y = e || 'all';
  }
  function v() {
    return y || 'all';
  }
  var g = function (e) {
    var t = e.key,
      n = e.scope,
      i = e.method,
      c = e.splitKey,
      a = void 0 === c ? '+' : c;
    r(t).forEach(function (e) {
      var t = e.split(a),
        r = t.length,
        c = t[r - 1],
        s = '*' === c ? '*' : d(c);
      if (l[s]) {
        n || (n = v());
        var p = r > 1 ? o(f, t) : [];
        l[s] = l[s].map(function (e) {
          return (!i || e.method === i) &&
            e.scope === n &&
            (function (e, t) {
              for (
                var n = e.length >= t.length ? e : t,
                  o = e.length >= t.length ? t : e,
                  r = !0,
                  i = 0;
                i < n.length;
                i++
              )
                -1 === o.indexOf(n[i]) && (r = !1);
              return r;
            })(e.mods, p)
            ? {}
            : e;
        });
      }
    });
  };
  function w(e, t, n) {
    var o;
    if (t.scope === n || 'all' === t.scope) {
      for (var r in ((o = t.mods.length > 0), a))
        Object.prototype.hasOwnProperty.call(a, r) &&
          ((!a[r] && t.mods.indexOf(+r) > -1) ||
            (a[r] && -1 === t.mods.indexOf(+r))) &&
          (o = !1);
      ((0 !== t.mods.length || a[16] || a[18] || a[17] || a[91]) &&
        !o &&
        '*' !== t.shortcut) ||
        (!1 === t.method(e, t) &&
          (e.preventDefault ? e.preventDefault() : (e.returnValue = !1),
          e.stopPropagation && e.stopPropagation(),
          e.cancelBubble && (e.cancelBubble = !0)));
    }
  }
  function k(e) {
    var t = l['*'],
      n = e.keyCode || e.which || e.charCode;
    if (m.filter.call(this, e)) {
      if (
        ((93 !== n && 224 !== n) || (n = 91),
        -1 === p.indexOf(n) && 229 !== n && p.push(n),
        ['ctrlKey', 'altKey', 'shiftKey', 'metaKey'].forEach(function (t) {
          var n = c[t];
          e[t] && -1 === p.indexOf(n)
            ? p.push(n)
            : !e[t] && p.indexOf(n) > -1 && p.splice(p.indexOf(n), 1);
        }),
        n in a)
      ) {
        for (var o in ((a[n] = !0), f)) f[o] === n && (m[o] = !0);
        if (!t) return;
      }
      for (var r in a)
        Object.prototype.hasOwnProperty.call(a, r) && (a[r] = e[c[r]]);
      var i = v();
      if (t)
        for (var s = 0; s < t.length; s++)
          t[s].scope === i &&
            (('keydown' === e.type && t[s].keydown) ||
              ('keyup' === e.type && t[s].keyup)) &&
            w(e, t[s], i);
      if (n in l)
        for (var y = 0; y < l[n].length; y++)
          if (
            (('keydown' === e.type && l[n][y].keydown) ||
              ('keyup' === e.type && l[n][y].keyup)) &&
            l[n][y].key
          ) {
            for (
              var u = l[n][y],
                h = u.splitKey,
                g = u.key.split(h),
                k = [],
                b = 0;
              b < g.length;
              b++
            )
              k.push(d(g[b]));
            k.sort().join('') === p.sort().join('') && w(e, u, i);
          }
    }
  }
  function m(e, t, i) {
    p = [];
    var c = r(e),
      s = [],
      y = 'all',
      h = document,
      v = 0,
      g = !1,
      w = !0,
      b = '+';
    for (
      void 0 === i && 'function' == typeof t && (i = t),
        '[object Object]' === Object.prototype.toString.call(t) &&
          (t.scope && (y = t.scope),
          t.element && (h = t.element),
          t.keyup && (g = t.keyup),
          void 0 !== t.keydown && (w = t.keydown),
          'string' == typeof t.splitKey && (b = t.splitKey)),
        'string' == typeof t && (y = t);
      v < c.length;
      v++
    )
      (s = []),
        (e = c[v].split(b)).length > 1 && (s = o(f, e)),
        (e = '*' === (e = e[e.length - 1]) ? '*' : d(e)) in l || (l[e] = []),
        l[e].push({
          keyup: g,
          keydown: w,
          scope: y,
          mods: s,
          shortcut: c[v],
          method: i,
          key: c[v],
          splitKey: b,
        });
    void 0 !== h &&
      !(function (e) {
        return u.indexOf(e) > -1;
      })(h) &&
      window &&
      (u.push(h),
      n(h, 'keydown', function (e) {
        k(e);
      }),
      n(window, 'focus', function () {
        p = [];
      }),
      n(h, 'keyup', function (e) {
        k(e),
          (function (e) {
            var t = e.keyCode || e.which || e.charCode,
              n = p.indexOf(t);
            if (
              (n >= 0 && p.splice(n, 1),
              e.key && 'meta' === e.key.toLowerCase() && p.splice(0, p.length),
              (93 !== t && 224 !== t) || (t = 91),
              t in a)
            )
              for (var o in ((a[t] = !1), f)) f[o] === t && (m[o] = !1);
          })(e);
      }));
  }
  var b = {
    setScope: h,
    getScope: v,
    deleteScope: function (e, t) {
      var n, o;
      for (var r in (e || (e = v()), l))
        if (Object.prototype.hasOwnProperty.call(l, r))
          for (n = l[r], o = 0; o < n.length; )
            n[o].scope === e ? n.splice(o, 1) : o++;
      v() === e && h(t || 'all');
    },
    getPressedKeyCodes: function () {
      return p.slice(0);
    },
    isPressed: function (e) {
      return 'string' == typeof e && (e = d(e)), -1 !== p.indexOf(e);
    },
    filter: function (e) {
      var t = e.target || e.srcElement,
        n = t.tagName,
        o = !0;
      return (
        (!t.isContentEditable &&
          (('INPUT' !== n && 'TEXTAREA' !== n) || t.readOnly)) ||
          (o = !1),
        o
      );
    },
    unbind: function (t) {
      if (t) {
        if (Array.isArray(t))
          t.forEach(function (e) {
            e.key && g(e);
          });
        else if ('object' === e(t)) t.key && g(t);
        else if ('string' == typeof t) {
          for (
            var n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), r = 1;
            r < n;
            r++
          )
            o[r - 1] = arguments[r];
          var i = o[0],
            f = o[1];
          'function' == typeof i && ((f = i), (i = '')),
            g({ key: t, scope: i, method: f, splitKey: '+' });
        }
      } else
        Object.keys(l).forEach(function (e) {
          return delete l[e];
        });
    },
  };
  for (var O in b) Object.prototype.hasOwnProperty.call(b, O) && (m[O] = b[O]);
  if ('undefined' != typeof window) {
    var K = window.hotkeys;
    (m.noConflict = function (e) {
      return e && window.hotkeys === m && (window.hotkeys = K), m;
    }),
      (window.hotkeys = m);
  }
  return m;
});

// above is the hotkeys.js library code
// CTFNote code starts here:

hotkeys('ctrl+k, command+k', function (event) {
  event.stopImmediatePropagation();
  event.preventDefault();

  parent.postMessage('showSearchDialog', '*');
});

hotkeys('ctrl+s, command+s', function (event) {
  event.stopImmediatePropagation();
  event.preventDefault();

  parent.postMessage('solveTask', '*');
});

// Hotkeys for HedgeDoc CodeMirror editor
editor.setOption('extraKeys', {
  'Ctrl-K': () => {
    parent.postMessage('showSearchDialog', '*');
    return false;
  },
  'Cmd-K': () => {
    parent.postMessage('showSearchDialog', '*');
    return false;
  },
  'Ctrl-S': () => {
    parent.postMessage('solveTask', '*');
    return false;
  },
  'Cmd-S': () => {
    parent.postMessage('solveTask', '*');
    return false;
  },
});
