;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon--" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M265.5 64h493L558.31 960H368.58l156.86-747.82H265.5V64z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon--1" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M591.26 420q166.55 0 166.57 177.32v185.36Q757.83 960 591.26 960H432.74q-166.58 0-166.57-177.32V241.32Q266.17 64 432.74 64h145.09q166.54 0 166.57 177.32v64.48H572.45v-68.51a27 27 0 0 0-7.39-18.81 23.65 23.65 0 0 0-18.13-8.06h-87.32a23.59 23.59 0 0 0-18.13 8.06 26.92 26.92 0 0 0-7.39 18.81v200.16q36.27-17.44 90-17.47h67.16z m0 347.92V612.08a27 27 0 0 0-7.39-18.81 23.66 23.66 0 0 0-18.13-8.06H459.61a23.59 23.59 0 0 0-18.13 8.06 26.92 26.92 0 0 0-7.39 18.81V767.9a26.88 26.88 0 0 0 7.39 18.81 23.59 23.59 0 0 0 18.13 8.06h106.13a23.66 23.66 0 0 0 18.13-8.06 27 27 0 0 0 7.39-18.81z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon--2" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M437.88 209.93v156.83a27.46 27.46 0 0 0 7.41 19.09 23.55 23.55 0 0 0 18.19 8.15h128q167.07 0 167.1 180v206q0 180-167.1 180H441.92q-167.11 0-167.1-180v-65.48h179.24v69.55a27.49 27.49 0 0 0 7.41 19.09 23.57 23.57 0 0 0 18.19 8.18h79.5a23.62 23.62 0 0 0 18.19-8.18 27.57 27.57 0 0 0 7.41-19.09v-195a27.61 27.61 0 0 0-7.4-19.07 23.62 23.62 0 0 0-18.19-8.18H432.5q-167.12 0-167.1-180V64h458.17v145.93H437.88z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon--3" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M413.51 276q0-41 28.72-69.77T512 177.54q41 0 69.76 28.73T610.49 276q0 41-28.73 69.77T512 374.52q-41 0-69.77-28.73T413.51 276z m0 471.94q0-41 28.72-69.77T512 649.48q41 0 69.76 28.73T610.49 748q0 41-28.73 69.77T512 846.46q-41 0-69.77-28.73T413.51 748z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon--4" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M590.13 64H758.5v896H590.13V606.86h-157.6q-167 0-167-182.8V64h167v351.75a28.16 28.16 0 0 0 7.41 19.39 23.39 23.39 0 0 0 18.18 8.31h106.41a23.45 23.45 0 0 0 18.19-8.31 28.27 28.27 0 0 0 7.41-19.39V64z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon--5" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M694.69 501.92q63.12 44.33 63.14 151.8v129Q757.83 960 591.25 960H432.74q-166.58 0-166.57-177.32v-71.2h167.92v79.26a26.9 26.9 0 0 0 7.39 18.81 23.6 23.6 0 0 0 18.13 8.06h106.12a23.68 23.68 0 0 0 18.14-8.06 27 27 0 0 0 7.39-18.81V605.36a27 27 0 0 0-7.39-18.8 23.68 23.68 0 0 0-18.14-8.06H427.37V433.41h130.3a23.66 23.66 0 0 0 18.13-8.06 27 27 0 0 0 7.39-18.8V237.29a27 27 0 0 0-7.39-18.81 23.66 23.66 0 0 0-18.13-8.06h-90a23.61 23.61 0 0 0-18.14 8.06 27 27 0 0 0-7.39 18.81v86H274.23v-81.97Q274.23 64 440.8 64h142.4q166.55 0 166.57 177.32v115.52q0 104.79-55.08 145.08z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon--6" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M606.67 771.66V64H418.33v1.37H265.5v188.34h152.83v517.95H265.5V960h493V771.66H606.67z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon--7" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M451.31 657.24v145.93h294.58V960H276.75V642.24q0-180 169.11-180H555a24 24 0 0 0 18.37-8.24 27.4 27.4 0 0 0 7.5-19.09v-195a27.44 27.44 0 0 0-7.5-19.09 24 24 0 0 0-18.37-8.17h-80.5a24 24 0 0 0-18.41 8.18 27.36 27.36 0 0 0-7.5 19.09v69.55H267.2V244q0-180 169.11-180h151.38q169.09 0 169.11 180v205.95q0 180-169.11 180H477.22a24 24 0 0 0-18.41 8.18 27.34 27.34 0 0 0-7.5 19.11z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon--8" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M499.92 604h-67.18q-166.57 0-166.57-177.3V241.32Q266.17 64 432.74 64h158.52q166.55 0 166.57 177.32v541.36Q757.83 960 591.26 960H446.18q-166.59 0-166.57-177.32V718.2h171.94v68.51a26.87 26.87 0 0 0 7.39 18.8 23.59 23.59 0 0 0 18.13 8.06h87.32a23.65 23.65 0 0 0 18.13-8.06 27 27 0 0 0 7.39-18.8V586.55Q553.65 604 499.92 604z m-67.18-347.91v155.83a26.91 26.91 0 0 0 7.39 18.8 23.61 23.61 0 0 0 18.14 8.06h106.12a23.65 23.65 0 0 0 18.13-8.06 27 27 0 0 0 7.39-18.8V256.09a27 27 0 0 0-7.39-18.8 23.65 23.65 0 0 0-18.13-8.06H458.27a23.61 23.61 0 0 0-18.14 8.06 27 27 0 0 0-7.39 18.8z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon--9" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M694.69 501.92q63.12 44.33 63.14 151.8v129Q757.83 960 591.26 960H432.75q-166.59 0-166.57-177.32v-129q0-107.46 63.14-151.8-55.11-40.3-55.07-145.08V241.32Q274.24 64 440.8 64h142.4q166.55 0 166.57 177.32v115.52q0 104.79-55.08 145.08zM591.26 786.71V608a27 27 0 0 0-7.39-18.81 23.68 23.68 0 0 0-18.14-8.06H459.61a23.62 23.62 0 0 0-18.14 8.06 27 27 0 0 0-7.38 18.81v178.71a26.9 26.9 0 0 0 7.38 18.8 23.62 23.62 0 0 0 18.14 8.06h106.12a23.68 23.68 0 0 0 18.14-8.06 27 27 0 0 0 7.39-18.8zM442.14 241.32V405.2a26.92 26.92 0 0 0 7.39 18.8 23.61 23.61 0 0 0 18.14 8.06h90a23.67 23.67 0 0 0 18.14-8.06 27 27 0 0 0 7.39-18.81V241.32a27 27 0 0 0-7.39-18.8 23.67 23.67 0 0 0-18.14-8.06h-90a23.61 23.61 0 0 0-18.14 8.06 27 27 0 0 0-7.39 18.8z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon--10" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M758.49 241.32v541.36q0 177.27-166.55 177.32H432.06q-166.61 0-166.55-177.32V241.32Q265.51 64 432.06 64h159.88q166.53 0 166.55 177.32zM575.82 804.16V218.47a26.94 26.94 0 0 0-7.38-18.8 23.65 23.65 0 0 0-18.15-8.09h-76.58a23.57 23.57 0 0 0-18.15 8.09 26.94 26.94 0 0 0-7.38 18.8v585.69a26.94 26.94 0 0 0 7.38 18.8 23.7 23.7 0 0 0 18.15 8h76.58a23.79 23.79 0 0 0 18.15-8 26.94 26.94 0 0 0 7.38-18.8z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)