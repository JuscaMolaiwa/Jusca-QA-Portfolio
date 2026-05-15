// bug.js
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const stickyBugHunterLink = document.getElementById('stickyBugHunterLink');
  const stickyBugIcon       = document.getElementById('stickyBugIcon');
  const hiddenBugHunterLink = document.getElementById('hiddenBugHunterLink');
  const hiddenBugIcon       = document.getElementById('hiddenBugIcon');

  // ── Inject canvas ──────────────────────────────────────────
  if (!document.getElementById('bug-trail-canvas')) {
    const canvas = document.createElement('canvas');
    canvas.id = 'bug-trail-canvas';
    canvas.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:9999',
      'pointer-events:none', 'width:100%', 'height:100%'
    ].join(';');
    document.body.appendChild(canvas);
  }

  // ── Inject styles ──────────────────────────────────────────
  if (!document.getElementById('bug-fx-styles')) {
    const s = document.createElement('style');
    s.id = 'bug-fx-styles';
    s.textContent = `
      @keyframes bfxShake {
        0%,100% { transform:translate(0,0) rotate(0deg); }
        10%  { transform:translate(-10px, 5px) rotate(-1.5deg); }
        20%  { transform:translate(10px,-5px)  rotate(1.5deg);  }
        30%  { transform:translate(-8px, 8px)  rotate(-1deg);   }
        40%  { transform:translate(8px,-8px)   rotate(1deg);    }
        50%  { transform:translate(-5px, 5px)  rotate(-0.5deg); }
        60%  { transform:translate(5px,-5px)   rotate(0.5deg);  }
        70%  { transform:translate(-3px, 3px)  rotate(0deg);    }
        80%  { transform:translate(3px,-3px)   rotate(0deg);    }
        90%  { transform:translate(-1px, 1px)  rotate(0deg);    }
      }
      @keyframes bfxGlitch {
        0%   { clip-path:inset(0 0 95% 0);  transform:translate(-5px); }
        15%  { clip-path:inset(30% 0 60% 0); transform:translate(5px);  }
        30%  { clip-path:inset(60% 0 30% 0); transform:translate(-3px); }
        45%  { clip-path:inset(10% 0 85% 0); transform:translate(4px);  }
        60%  { clip-path:inset(80% 0 10% 0); transform:translate(-4px); }
        75%  { clip-path:inset(45% 0 45% 0); transform:translate(3px);  }
        90%  { clip-path:inset(20% 0 75% 0); transform:translate(-2px); }
        100% { clip-path:inset(0 0 95% 0);   transform:translate(0);    }
      }
      @keyframes bfxFadeIn { from{opacity:0} to{opacity:1} }
      @keyframes bfxIconSpin {
        0%   { transform:rotate(0deg)   scale(1);   }
        25%  { transform:rotate(15deg)  scale(1.1); }
        75%  { transform:rotate(-15deg) scale(1.1); }
        100% { transform:rotate(0deg)   scale(1);   }
      }
      .body-bug-shaking { animation: bfxShake 0.55s ease; }
      #bug-escape-overlay {
        position:fixed; inset:0; z-index:99999;
        background:rgba(0,0,0,0.93);
        display:flex; align-items:center; justify-content:center;
        animation:bfxFadeIn 0.3s ease;
        cursor:pointer; font-family:monospace; transition:opacity 0.4s;
      }
      #bug-escape-overlay::before {
        content:''; position:absolute; inset:0; pointer-events:none;
        background:repeating-linear-gradient(
          0deg, transparent, transparent 2px,
          rgba(255,0,0,0.04) 2px, rgba(255,0,0,0.04) 4px
        );
      }
      .bfx-wrap  { text-align:center; padding:2rem; position:relative; }
      .bfx-icon  { display:block; font-size:72px; margin-bottom:1.25rem; animation:bfxIconSpin 0.4s ease infinite; }
      .bfx-title {
        position:relative; font-size:26px; font-weight:700;
        color:#ff4444; letter-spacing:5px; text-transform:uppercase;
        text-shadow:0 0 24px rgba(255,68,68,0.9); margin-bottom:0.75rem;
      }
      .bfx-title::before {
        content:attr(data-text); position:absolute; inset:0;
        color:#00ffff; opacity:0.6; animation:bfxGlitch 1.8s infinite;
      }
      .bfx-title::after {
        content:attr(data-text); position:absolute; inset:0;
        color:#ff00ff; opacity:0.45; animation:bfxGlitch 1.8s infinite 0.09s;
      }
      .bfx-sub  { font-size:14px; color:#ff9999; margin-bottom:1.25rem; animation:bfxFadeIn 0.5s ease 0.3s both; }
      .bfx-code {
        font-size:12px; color:#ff6666; text-align:left;
        background:rgba(255,0,0,0.08); border:1px solid rgba(255,0,0,0.25);
        border-radius:6px; padding:0.9rem 1.4rem;
        max-width:400px; margin:0 auto 1.5rem;
        line-height:2; animation:bfxFadeIn 0.5s ease 0.5s both;
      }
      .bfx-hint { font-size:12px; color:#555; animation:bfxFadeIn 0.5s ease 1.2s both; }
    `;
    document.head.appendChild(s);
  }

  // ── animateBugIcon ─────────────────────────────────────────
  function animateBugIcon(bugIcon) {
    if (!bugIcon) return;
    if (bugIcon.dataset.running === 'true') return;
    bugIcon.dataset.running = 'true';
    setTimeout(function () {
      const canvas = document.getElementById('bug-trail-canvas');
      launchRocketTrail(bugIcon, canvas, function (userCaughtIt) {
        bugIcon.dataset.running = 'false';
        if (!userCaughtIt) breakPage();
      });
    }, 2500);
  }

  // ── launchRocketTrail ──────────────────────────────────────
  function launchRocketTrail(bugIcon, canvas, onDone) {
    const ctx = canvas.getContext('2d');
    const W   = canvas.width  = window.innerWidth;
    const H   = canvas.height = window.innerHeight;

    const rect    = bugIcon.getBoundingClientRect();
    const originX = rect.left + rect.width  / 2;
    const originY = rect.top  + rect.height / 2;

    // Draw the bug 1.6× its natural size so it's clearly visible
    const BUG_W  = rect.width  * 1.0;
    const BUG_H  = rect.height * 1.0;
    const HALO_R = Math.max(BUG_W, BUG_H) * 0.40;

    bugIcon.style.opacity = '0';
    canvas.style.pointerEvents = 'auto';
    canvas.style.cursor        = 'crosshair';

    const DURATION  = 10000;
    const FLY_END   = 0.85;
    const CATCH_END = 0.93;
    const start     = performance.now();

    let trails      = [];
    let missFlashes = [];
    let currentBugX = originX;
    let currentBugY = originY;
    let userCaught  = false;
    let catchTime   = null;
    let catchAtX    = 0;
    let catchAtY    = 0;
    let done        = false;

    function easeInOut(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function getColor(t)   { return `hsl(${(t * 200) % 360}, 90%, 60%)`; }

    const catchX = W - 120;
    const catchY = originY + 10;

    function cleanup() {
      canvas.removeEventListener('click', onCanvasClick);
      canvas.style.pointerEvents = 'none';
      canvas.style.cursor        = '';
    }

    function onCanvasClick(e) {
      if (userCaught || done) return;
      const dist = Math.hypot(e.clientX - currentBugX, e.clientY - currentBugY);
      if (dist < 85) {
        userCaught = true;
        catchTime  = performance.now();
        catchAtX   = currentBugX;
        catchAtY   = currentBugY;
      } else {
        const msgs = ['too slow!', 'missed!', 'try again!', 'almost...'];
        missFlashes.push({
          x: e.clientX, y: e.clientY, life: 1,
          text: msgs[Math.floor(Math.random() * msgs.length)],
        });
      }
    }
    canvas.addEventListener('click', onCanvasClick);

    function drawNet(nx, ny, size, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#a78bfa';
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.arc(nx, ny, size, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth   = 1;
      ctx.globalAlpha = alpha * 0.45;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(nx + i * size * 0.5, ny - size);
        ctx.lineTo(nx + i * size * 0.5, ny + size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(nx - size, ny + i * size * 0.5);
        ctx.lineTo(nx + size, ny + i * size * 0.5);
        ctx.stroke();
      }
      ctx.globalAlpha = alpha;
      ctx.lineWidth   = 3;
      ctx.beginPath();
      ctx.moveTo(nx + size * 0.7, ny + size * 0.7);
      ctx.lineTo(nx + size * 1.9, ny + size * 2.0);
      ctx.stroke();
      ctx.restore();
    }

    // ── drawBug: dark backdrop + pulsing warning-light halo ──
    function drawBug(bx, by, bAngle, raw, caught, cAlpha) {
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(bAngle * Math.PI / 180);

      // Warning-light strobe: fast sin oscillation (~8 cycles/sec feel)
      // raw goes 0→1 over 9.5s so raw*Math.PI*22 ≈ 22 half-cycles = ~11 flashes
      const pulse      = (Math.sin(raw * Math.PI * 22) + 1) / 2;  // 0→1, rapidly
      const haloAlpha  = caught ? 0.3 : 0.4 + pulse * 0.5;         // dim when caught
      const haloScale  = 1 + pulse * 0.2;                           // breathes in/out
      const haloColor  = caught
        ? '#a78bfa'
        : (pulse > 0.5 ? '#ff2200' : '#ffaa00');  // red ↔ orange flash

      // 1. Dark radial backdrop — blacks out the bg behind the bug
      //    so it's always readable against any page content
      const grad = ctx.createRadialGradient(0, 0, HALO_R * 0.05, 0, 0, HALO_R * 2.2);
      grad.addColorStop(0,    'rgba(0,0,0,0.82)');
      grad.addColorStop(0.45, 'rgba(0,0,0,0.55)');
      grad.addColorStop(0.75, 'rgba(0,0,0,0.22)');
      grad.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.globalAlpha = cAlpha;
      ctx.beginPath();
      ctx.arc(0, 0, HALO_R * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // 2. Outer warning ring — pulses in/out like a hazard light
      ctx.globalAlpha = haloAlpha * cAlpha;
      ctx.shadowColor = haloColor;
      ctx.shadowBlur  = 30 + pulse * 28;
      ctx.strokeStyle = haloColor;
      ctx.lineWidth   = 2.5 + pulse * 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, HALO_R * haloScale, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Inner ring for depth
      ctx.globalAlpha = haloAlpha * 0.4 * cAlpha;
      ctx.shadowBlur  = 10;
      ctx.lineWidth   = 1;
      ctx.beginPath();
      ctx.arc(0, 0, HALO_R * haloScale * 0.6, 0, Math.PI * 2);
      ctx.stroke();

      // 4. The bug icon
      ctx.shadowColor = haloColor;
      ctx.shadowBlur  = 16 + pulse * 20;
      ctx.globalAlpha = cAlpha;
      ctx.drawImage(bugIcon, -BUG_W / 2, -BUG_H / 2, BUG_W, BUG_H);

      ctx.restore();
    }

    function tick(now) {
      if (done) return;
      const raw = Math.min((now - start) / DURATION, 1);

      let bugX, bugY, angle;
      let netAlpha = 0, netX = 0, netY = 0;
      let labelAlpha = 0, canvasAlpha = 1;
      let caught = false;

      if (userCaught) {
        caught = true;
        const t = (now - catchTime) / 1000;
        const jitter = Math.max(0.6 - t, 0) * 14;
        bugX  = catchAtX + (Math.random() - 0.5) * jitter;
        bugY  = catchAtY + (Math.random() - 0.5) * jitter;
        angle = (Math.random() - 0.5) * 35 * Math.max(1 - t * 2, 0);
        netAlpha    = Math.min(t * 6, 1);
        netX        = lerp(catchAtX + 130, catchAtX + 38, Math.min(t * 4, 1));
        netY        = lerp(catchAtY - 70,  catchAtY + 8,  Math.min(t * 4, 1));
        labelAlpha  = Math.min((t - 0.25) * 4, 1) * Math.max(1 - (t - 0.85) * 3, 0);
        canvasAlpha = t > 1.3 ? Math.max(1 - (t - 1.3) * 2, 0) : 1;
        if (t > 2.1) {
          done = true; cleanup();
          ctx.clearRect(0, 0, W, H);
          bugIcon.style.opacity = '';
          onDone(true); return;
        }

      } else if (raw < FLY_END) {
        const phase = easeInOut(raw);
        const baseX = originX + Math.sin(phase * Math.PI * 0.6) * (W * 0.08);
        const baseY = originY + Math.sin(phase * Math.PI)       * (H * 0.82);
        const ret      = Math.max((raw - 0.5) / (FLY_END - 0.5), 0);
        const veerEase = ret * ret;
        bugX = lerp(baseX, catchX, veerEase * 0.6);
        bugY = lerp(baseY, catchY, veerEase * 0.6);
        const dx = Math.cos(phase * Math.PI * 0.6) * (W * 0.08) * 0.01;
        const dy = Math.cos(phase * Math.PI)       * (H * 0.82) * 0.01;
        angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        for (let i = 0; i < 4; i++) {
          trails.push({
            x: bugX, y: bugY,
            vx: (Math.random() - 0.5) * 2.5,
            vy: (Math.random() - 0.5) * 2.5,
            life: 1, color: getColor(raw + i * 0.1),
            size: 2.5 + Math.random() * 3,
          });
        }

      } else if (raw < CATCH_END) {
        caught = true;
        const p      = (raw - FLY_END) / (CATCH_END - FLY_END);
        const jitter = (1 - p) * 11;
        bugX  = catchX + (Math.random() - 0.5) * jitter * 2;
        bugY  = catchY + (Math.random() - 0.5) * jitter;
        angle = (Math.random() - 0.5) * 40 * (1 - p);
        netAlpha = Math.min(p * 5, 1);
        netX = lerp(W + 60,      catchX + 38, Math.min(p * 3.5, 1));
        netY = lerp(catchY - 50, catchY + 8,  Math.min(p * 3.5, 1));

      } else {
        caught = true;
        const p  = (raw - CATCH_END) / (1 - CATCH_END);
        bugX = catchX; bugY = catchY; angle = 0;
        netAlpha    = Math.max(1 - p * 2, 0);
        netX        = catchX + 38; netY = catchY + 8;
        labelAlpha  = Math.min(p * 3, 1) * Math.max(1 - (p - 0.6) * 4, 0);
        canvasAlpha = Math.max(1 - p * 1.5, 0);
      }

      currentBugX = bugX;
      currentBugY = bugY;

      ctx.clearRect(0, 0, W, H);

      // Hint text — also pulses like a warning
      if (!userCaught && raw < 0.75) {
        ctx.save();
        let hintAlpha = 1;
        if (raw > 0.6) hintAlpha = 1 - ((raw - 0.6) / 0.15);
        const hp = (Math.sin(raw * Math.PI * 14) + 1) / 2;
        ctx.globalAlpha = hintAlpha;
        ctx.font        = `600 ${12 + hp * 2}px sans-serif`;
        ctx.fillStyle   = hp > 0.5 ? '#ff3300' : '#ffaa00';
        ctx.textAlign   = 'center';
        ctx.shadowColor = '#ff4400';
        ctx.shadowBlur  = 8 + hp * 12;
        ctx.fillText('CLICK THE MOVING BUG TO CATCH IT!', W / 2, H / 1.5);
        ctx.restore();
      }

      ctx.save();
      ctx.globalAlpha = canvasAlpha;

      // Trail
      for (let p of trails) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle   = p.color;
        ctx.globalAlpha = p.life * 0.75 * canvasAlpha;
        ctx.fill();
        p.x += p.vx; p.y += p.vy; p.life -= 0.024;
      }
      trails = trails.filter(p => p.life > 0);
      ctx.globalAlpha = canvasAlpha;

      if (userCaught && netAlpha > 0) drawNet(netX, netY, 36, netAlpha * canvasAlpha);

      // Bug with warning-light halo
      drawBug(bugX, bugY, angle, raw, caught, canvasAlpha);

      if (labelAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = labelAlpha;
        ctx.font        = '600 15px sans-serif';
        ctx.fillStyle   = userCaught ? '#4ade80' : '#a78bfa';
        ctx.textAlign   = 'center';
        ctx.shadowColor = userCaught ? '#4ade80' : '#a78bfa';
        ctx.shadowBlur  = 10;
        ctx.fillText(userCaught ? 'NICE CATCH!' : "IT'S A BUG!", bugX, bugY - 52);
        ctx.restore();
      }

      missFlashes.forEach(function (f) {
        ctx.save();
        ctx.globalAlpha = f.life * 0.9;
        ctx.font        = '700 13px sans-serif';
        ctx.fillStyle   = '#f87171';
        ctx.textAlign   = 'center';
        ctx.shadowColor = '#f87171';
        ctx.shadowBlur  = 6;
        ctx.fillText(f.text, f.x, f.y - (1 - f.life) * 28);
        ctx.restore();
        f.life -= 0.04;
      });
      missFlashes = missFlashes.filter(f => f.life > 0);

      ctx.restore();

      if (!userCaught && raw >= 1) {
        done = true; cleanup();
        ctx.clearRect(0, 0, W, H);
        onDone(false); return;
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  // ── breakPage ──────────────────────────────────────────────
  function breakPage() {
    document.body.classList.add('body-bug-shaking');
    setTimeout(() => document.body.classList.remove('body-bug-shaking'), 600);
    const ov = document.createElement('div');
    ov.id = 'bug-escape-overlay';
    ov.innerHTML = `
      <div class="bfx-wrap">
        <span class="bfx-icon">🐞</span>
        <div class="bfx-title" data-text="CRITICAL BUG ESCAPED">CRITICAL BUG ESCAPED</div>
        <div class="bfx-sub">Production is down. Everything is on fire.</div>
        <div class="bfx-code">
          ✗ UnhandledBugException: null ref at runtime<br>
          ✗ TypeError: cannot read properties of undefined<br>
          ✗ FATAL: system stability compromised<br>
          ✗ STATUS 500 — Internal Server Error
        </div>
        <div class="bfx-hint">click anywhere to restore… maybe.</div>
      </div>`;
    document.body.appendChild(ov);
    function dismiss() {
      ov.style.opacity = '0';
      setTimeout(() => ov.remove(), 420);
    }
    ov.addEventListener('click', dismiss);
    setTimeout(dismiss, 10000);
  }

  // ── Triggers ───────────────────────────────────────────────
  function getVisibleBugIcon() {
    if (stickyBugIcon && stickyBugIcon.offsetParent !== null) return stickyBugIcon;
    if (hiddenBugIcon && hiddenBugIcon.offsetParent !== null) return hiddenBugIcon;
    return stickyBugIcon;
  }

  function triggerIfHome() {
    if (window.location.hash === '#Home' || window.location.hash === '') {
      const icon = getVisibleBugIcon();
      if (icon) icon.style.opacity = '';
      animateBugIcon(icon);
    }
  }

  if (stickyBugHunterLink && stickyBugIcon) {
    stickyBugHunterLink.addEventListener('click', function (e) {
      e.preventDefault();
      stickyBugIcon.style.opacity = '';
      animateBugIcon(stickyBugIcon);
      const home = document.getElementById('Home');
      if (home) home.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (hiddenBugHunterLink && hiddenBugIcon) {
    hiddenBugHunterLink.addEventListener('click', function () {
      hiddenBugIcon.style.opacity = '';
      animateBugIcon(hiddenBugIcon);
    });
  }

  document.querySelectorAll('a[href="#Home"]').forEach(function (link) {
    if (link === stickyBugHunterLink || link === hiddenBugHunterLink) return;
    link.addEventListener('click', function () {
      const icon = getVisibleBugIcon();
      if (icon) icon.style.opacity = '';
      animateBugIcon(icon);
    });
  });

  triggerIfHome();
  window.addEventListener('hashchange', triggerIfHome);

  const homeSection = document.getElementById('Home');
  if (homeSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const icon = getVisibleBugIcon();
          if (icon) icon.style.opacity = '';
          animateBugIcon(icon);
        }
      });
    }, { threshold: 0.4 });
    observer.observe(homeSection);
  }

});