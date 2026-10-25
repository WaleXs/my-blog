/* 拾光 · 交互脚本
   只做两件事：深浅色切换（记忆在 localStorage）、文章页阅读进度条。
   没有框架、没有依赖，删掉也不影响阅读。 */
(function () {
  "use strict";

  var root = document.documentElement;
  var STORAGE_KEY = "shiguang-theme";

  function prefersDark() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  function currentTheme() {
    return root.getAttribute("data-theme") || (prefersDark() ? "dark" : "light");
  }

  var toggle = document.querySelector(".theme-toggle");

  function paint(theme) {
    root.setAttribute("data-theme", theme);
    if (!toggle) return;
    var isDark = theme === "dark";
    toggle.textContent = isDark ? "☀" : "☾";
    toggle.setAttribute("aria-label", isDark ? "切换到浅色模式" : "切换到深色模式");
    toggle.setAttribute("title", isDark ? "切换到浅色模式" : "切换到深色模式");
  }

  paint(currentTheme());

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      paint(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* 隐私模式下写不进去，忽略即可 */
      }
    });
  }

  /* 阅读进度条：仅在页面存在 .progress 元素时启用 */
  var bar = document.querySelector(".progress");
  if (bar) {
    var ticking = false;

    var update = function () {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - window.innerHeight;
      var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      bar.style.width = Math.min(100, Math.max(0, ratio * 100)) + "%";
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );

    window.addEventListener("resize", update, { passive: true });
    update();
  }

  /* 图片点击放大：正文图片和封面图都可以点开看大图。
     想「小图预览、点开看原图」，在 <img> 上加 data-full="原图地址" 即可。 */
  var zoomables = document.querySelectorAll(".prose img, .cover img");

  if (zoomables.length) {
    var box = null;
    var lastFocus = null;

    var build = function () {
      box = document.createElement("div");
      box.className = "lightbox";
      box.hidden = true;
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-modal", "true");
      box.setAttribute("aria-label", "图片预览");
      box.innerHTML =
        '<button class="lightbox-close" type="button" aria-label="关闭预览">×</button>' +
        "<figure><img alt=\"\"><figcaption></figcaption></figure>";
      document.body.appendChild(box);

      box.addEventListener("click", function (e) {
        if (e.target === box || e.target.closest(".lightbox-close")) {
          closeBox();
        }
      });
    };

    var openBox = function (img) {
      if (!box) build();
      var big = box.querySelector("img");
      var cap = box.querySelector("figcaption");
      var figure = img.closest("figure");
      var source = figure && figure.querySelector("figcaption");

      big.src = img.getAttribute("data-full") || img.currentSrc || img.src;
      big.alt = img.alt || "";
      cap.textContent = source ? source.textContent : "";
      cap.hidden = !source;

      lastFocus = document.activeElement;
      box.hidden = false;
      document.body.style.overflow = "hidden";
      window.requestAnimationFrame(function () {
        box.classList.add("is-open");
      });
      box.querySelector(".lightbox-close").focus();
    };

    var closeBox = function () {
      if (!box || box.hidden) return;
      box.classList.remove("is-open");
      document.body.style.overflow = "";
      window.setTimeout(function () {
        box.hidden = true;
      }, 180);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && box && !box.hidden) closeBox();
    });

    Array.prototype.forEach.call(zoomables, function (img) {
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", "放大图片" + (img.alt ? "：" + img.alt : ""));

      img.addEventListener("click", function () {
        openBox(img);
      });

      img.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openBox(img);
        }
      });
    });
  }
})();
