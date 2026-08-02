/* 个人简历网页 · 轻量交互脚本 */

(function () {
  'use strict';

  /* ---------- 当前年份与版本日期自动填充 ---------- */
  var now = new Date();
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = now.getFullYear();

  var revEl = document.getElementById('rev-date');
  if (revEl) {
    var y = now.getFullYear();
    var m = String(now.getMonth() + 1).padStart(2, '0');
    revEl.textContent = y + '.' + m;
  }

  /* ---------- 滚动进入视口渐显动画 ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    // 不支持 IntersectionObserver 时直接全部显示
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- 目录导航：滚动时高亮当前分区 ---------- */
  var tocLinks = Array.prototype.slice.call(document.querySelectorAll('.toc a'));
  if (tocLinks.length) {
    var sections = tocLinks
      .map(function (link) {
        var hash = link.getAttribute('href');
        return hash ? document.querySelector(hash) : null;
      })
      .filter(Boolean);

    var setActive = function (id) {
      tocLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    };

    if ('IntersectionObserver' in window) {
      var navObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) setActive(entry.target.id);
          });
        },
        // 分区进入视口上部时切换高亮
        { rootMargin: '-20% 0px -70% 0px' }
      );
      sections.forEach(function (s) { navObserver.observe(s); });
    } else {
      window.addEventListener('scroll', function () {
        var pos = window.scrollY + 120;
        var current = sections[0].id;
        sections.forEach(function (s) {
          if (s.offsetTop <= pos) current = s.id;
        });
        setActive(current);
      }, { passive: true });
    }
  }
})();
