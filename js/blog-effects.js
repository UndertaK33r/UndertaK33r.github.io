/**
 * Blog Effects — GSAP Animations for Butterfly Theme
 * Colorful, rich visual effects for the blog listing page.
 * Loads GSAP from CDN and applies staggered entrances,
 * hover effects, gradient borders, and scroll-triggered reveals.
 */
(function () {
  'use strict';

  // --- Load GSAP from CDN ---
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function init() {
    // Only run on pages with #recent-posts (the blog listing)
    var container = document.getElementById('recent-posts');
    if (!container) return;

    // Ensure GSAP is loaded
    if (typeof gsap === 'undefined') {
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js')
        .then(function () {
          return loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js');
        })
        .then(function () {
          runAnimations();
        })
        .catch(function () {
          console.warn('[BlogEffects] Failed to load GSAP');
        });
    } else {
      runAnimations();
    }
  }

  function runAnimations() {
    try {
      var cards = document.querySelectorAll('.recent-post-item');
      if (!cards.length) return;

      var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // --- 1. Staggered card entrance ---
      tl.fromTo(
        cards,
        {
          y: 60,
          opacity: 0,
          scale: 0.97,
          rotation: gsap.utils.random(-1.2, 1.2, 0.1, true),
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          stagger: 0.1,
          clearProps: 'rotation',
        },
        0
      );

      // --- 2. Cover image entrance (slightly delayed) ---
      cards.forEach(function (card) {
        var cover = card.querySelector('.post-bg');
        if (cover) {
          tl.fromTo(
            cover,
            { scale: 1.1, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: 'power2.out' },
            '-=0.4'
          );
        }
      });

      // --- 3. Cover image hover zoom ---
      cards.forEach(function (card) {
        var cover = card.querySelector('.post-bg');
        if (!cover) return;

        card.addEventListener('mouseenter', function () {
          gsap.to(cover, { scale: 1.12, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
        });
        card.addEventListener('mouseleave', function () {
          gsap.to(cover, { scale: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
        });
      });

      // --- 4. Card hover shadow & lift ---
      cards.forEach(function (card) {
        card.addEventListener('mouseenter', function () {
          gsap.to(card, {
            y: -4,
            boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });
        card.addEventListener('mouseleave', function () {
          gsap.to(card, {
            y: 0,
            boxShadow: '0 3px 8px 6px rgba(7,17,27,0.05)',
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        });
      });

      // --- 5. Category tag color cycling ---
      var categoryLinks = document.querySelectorAll('.article-meta__categories');
      var colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#a66cff'];
      categoryLinks.forEach(function (link) {
        gsap.to(link, {
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

      // --- 6. Title hover underline animation ---
      var titles = document.querySelectorAll('.article-title');
      titles.forEach(function (title) {
        var underline = document.createElement('span');
        underline.className = 'article-title-underline';
        underline.style.cssText =
          'position:absolute;bottom:-2px;left:50%;width:0;height:2px;' +
          'background:linear-gradient(90deg,#ff6b6b,#ffd93d,#6bcb77,#4d96ff,#a66cff);' +
          'border-radius:2px;transform:translateX(-50%);pointer-events:none;';
        title.style.position = 'relative';
        title.appendChild(underline);

        title.addEventListener('mouseenter', function () {
          gsap.to(underline, { width: '80%', duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        });
        title.addEventListener('mouseleave', function () {
          gsap.to(underline, { width: '0%', duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        });
      });

      // --- 7. Scroll-triggered reveal (if ScrollTrigger available) ---
      if (typeof ScrollTrigger !== 'undefined') {
        cards.forEach(function (card) {
          gsap.fromTo(
            card,
            { boxShadow: '0 0 0 rgba(132,204,22,0)' },
            {
              boxShadow: '0 0 20px rgba(132,204,22,0.15)',
              duration: 1,
              ease: 'power1.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          );
        });
      }

      // --- 8. Subtle floating bg particles (colorful dots) ---
      var particlesContainer = document.createElement('div');
      particlesContainer.className = 'blog-effects-particles';
      particlesContainer.style.cssText =
        'position:fixed;top:0;left:0;width:100%;height:100%;' +
        'pointer-events:none;z-index:-1;overflow:hidden;';
      document.body.appendChild(particlesContainer);

      var particleColors = ['#ff6b6b66', '#ffd93d66', '#6bcb7766', '#4d96ff66', '#a66cff66', '#84cc1666'];
      for (var i = 0; i < 15; i++) {
        var dot = document.createElement('div');
        var size = gsap.utils.random(6, 20, 2);
        dot.style.cssText =
          'position:absolute;border-radius:50%;' +
          'width:' + size + 'px;height:' + size + 'px;' +
          'background:' + particleColors[i % particleColors.length] + ';' +
          'left:' + gsap.utils.random(0, 100) + '%;' +
          'top:' + gsap.utils.random(0, 100) + '%;' +
          'opacity:0;';
        particlesContainer.appendChild(dot);

        gsap.to(dot, {
          opacity: gsap.utils.random(0.15, 0.4),
          y: gsap.utils.random(-60, -20),
          x: gsap.utils.random(-20, 20),
          duration: gsap.utils.random(6, 12),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: gsap.utils.random(0, 5),
        });
      }

      console.log('[BlogEffects] Animations initialized on', cards.length, 'cards');
    } catch (e) {
      console.warn('[BlogEffects] Error:', e.message);
    }
  }

  // --- Initialize on DOM ready ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // --- Re-init for PJAX / page navigation ---
  document.addEventListener('pjax:complete', init);
})();
