// preloader.js
(function () {
  'use strict';

  var SESSION_KEY = 'jm-preloader-shown';

  var overlay     = document.getElementById('preloader');
  var canvas      = document.getElementById('preloader-canvas');
  var bar         = document.getElementById('preloaderBar');
  var subText     = document.querySelector('.preloader-sub');
  var bugImg      = document.getElementById('preloader-bug');

  // ── Only run once per session ─────────────────────────────
  if (!overlay || !canvas) return;
  if (sessionStorage.getItem(SESSION_KEY)) {
    overlay.style.display = 'none';
    return;
  }

  // Block scroll while preloader runs
  document.body.classList.add('preloader-active');

  var ctx = canvas.getContext('2d');
  var W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // ── Status messages cycle ─────────────────────────────────
  var messages = [
    'Initialising QA environment…',
    'Loading test framework…',
    'Spinning up Selenium…',
    'Hunting for bugs…',
    'Running sanity checks…',
    'All systems go ✓'
  ];
  var msgIndex = 0;

  function cycleMessage() {
    if (!subText || msgIndex >= messages.length) return;
    subText.style.opacity = '0';
    setTimeout(function () {
      subText.textContent = messages[msgIndex++];
      subText.style.transition = 'opacity 0.4s ease';
      subText.style.opacity = '1';
    }, 300);
  }

  // ── Progress bar ──────────────────────────────────────────
  var progress = 0;
  function setProgress(pct) {
    progress = Math.min(pct, 100);
    if (bar) bar.style.width = progress + '%';
  }

  // ── Particle trail system ─────────────────────────────────
  var particles = [];

  function spawnParticles(x, y, color) {
    for (var i = 0; i < 3; i++) {
      particles.push({
        x: x, y: y,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        life: 1,
        size: 2 + Math.random() * 3,
        color: color || '#00e5a0'
      });
    }
  }

  function drawParticles() {
    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle   = p.color;
      ctx.globalAlpha = p.life * 0.7;
      ctx.fill();
      p.x    += p.vx;
      p.y    += p.vy;
      p.life -= 0.03;
    });
    particles = particles.filter(function (p) { return p.life > 0; });
    ctx.globalAlpha = 1;
  }

  // ── Main animation ────────────────────────────────────────
  var DURATION = 3800; // total preloader duration ms
  var start    = null;
  var rafId    = null;

  // Bug path: enters from left, arcs across, gets caught centre-right
  function getBugPos(t) {
    // t: 0 → 1
    // Phase 1 (0→0.6): bug flies in from off-screen left, arcs upward
    // Phase 2 (0.6→0.85): bug darts around chaotically
    // Phase 3 (0.85→1): bug slows and gets caught in net
    var x, y;
    if (t < 0.6) {
      var p  = t / 0.6;
      var ep = p * p * (3 - 2 * p); // smoothstep
      x = lerp(-60, W * 0.62, ep);
      y = lerp(H * 0.5, H * 0.38, Math.sin(p * Math.PI) * 0.6 + 0.2);
    } else if (t < 0.85) {
      var p2  = (t - 0.6) / 0.25;
      var cx  = W * 0.62;
      var cy  = H * 0.38;
      var dart = (1 - p2) * 55;
      x = cx + Math.sin(p2 * Math.PI * 5.5) * dart;
      y = cy + Math.cos(p2 * Math.PI * 4.2) * dart * 0.7;
    } else {
      var p3 = (t - 0.85) / 0.15;
      var ep3 = p3 * p3;
      var jitter = (1 - p3) * 8;
      x = lerp(W * 0.62, W * 0.6,  ep3) + (Math.random() - 0.5) * jitter;
      y = lerp(H * 0.38, H * 0.385, ep3) + (Math.random() - 0.5) * jitter;
    }
    return { x: x, y: y };
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function drawNet(cx, cy, alpha, scale) {
    var s = (scale || 1) * 44;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#a78bfa';
    ctx.shadowColor = '#a78bfa';
    ctx.shadowBlur  = 12;
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, s, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth   = 1;
    ctx.globalAlpha = alpha * 0.4;
    for (var i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * s * 0.5, cy - s);
      ctx.lineTo(cx + i * s * 0.5, cy + s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - s, cy + i * s * 0.5);
      ctx.lineTo(cx + s, cy + i * s * 0.5);
      ctx.stroke();
    }
    // Net handle
    ctx.globalAlpha = alpha;
    ctx.lineWidth   = 3;
    ctx.beginPath();
    ctx.moveTo(cx + s * 0.7, cy + s * 0.7);
    ctx.lineTo(cx + s * 1.9, cy + s * 1.9);
    ctx.stroke();
    ctx.restore();
  }

  function tick(now) {
    if (!start) start = now;
    var elapsed = now - start;
    var t       = Math.min(elapsed / DURATION, 1);

    ctx.clearRect(0, 0, W, H);

    // Progress bar follows t
    setProgress(t * 100);

    // Cycle status messages
    var targetMsg = Math.floor(t * (messages.length - 1));
    if (targetMsg > msgIndex - 1) cycleMessage();

    // Bug position
    var pos   = getBugPos(t);
    var color = 'hsl(' + ((t * 180) % 360) + ', 90%, 60%)';

    // Spawn trail
    spawnParticles(pos.x, pos.y, color);
    drawParticles();

    // Draw net when bug is being caught (t > 0.75)
    if (t > 0.75) {
      var netAlpha = Math.min((t - 0.75) / 0.15, 1);
      var netScale = lerp(1.4, 1, Math.min((t - 0.75) / 0.25, 1));
      drawNet(W * 0.6, H * 0.385, netAlpha, netScale);
    }

    // Draw bug icon
    if (bugImg && bugImg.complete) {
      var caught     = t > 0.85;
      var bugSize    = 42;
      var angle      = caught ? 0 : Math.sin(t * Math.PI * 12) * 18;
      var pulse      = (Math.sin(t * Math.PI * 18) + 1) / 2;
      var haloR      = bugSize * 0.9;
      var haloColor  = caught ? '#a78bfa' : (pulse > 0.5 ? '#ff2200' : '#ffaa00');

      ctx.save();
      ctx.translate(pos.x, pos.y);
      ctx.rotate(angle * Math.PI / 180);

      // Dark backdrop
      var grad = ctx.createRadialGradient(0, 0, 2, 0, 0, haloR * 2);
      grad.addColorStop(0,   'rgba(0,0,0,0.75)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.4)');
      grad.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(0, 0, haloR * 2, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Warning ring
      var haloAlpha = caught ? 0.4 : 0.45 + pulse * 0.45;
      ctx.globalAlpha = haloAlpha;
      ctx.shadowColor = haloColor;
      ctx.shadowBlur  = 24 + pulse * 20;
      ctx.strokeStyle = haloColor;
      ctx.lineWidth   = 2 + pulse * 2;
      ctx.beginPath();
      ctx.arc(0, 0, haloR * (1 + pulse * 0.18), 0, Math.PI * 2);
      ctx.stroke();

      // Bug image
      ctx.globalAlpha = 1;
      ctx.shadowColor = haloColor;
      ctx.shadowBlur  = 12 + pulse * 14;
      ctx.drawImage(bugImg, -bugSize / 2, -bugSize / 2, bugSize, bugSize);

      ctx.restore();
    }

    // "NICE CATCH!" label when caught
    if (t > 0.88) {
      var labelAlpha = Math.min((t - 0.88) / 0.08, 1) * Math.max(1 - (t - 0.95) * 6, 0);
      if (labelAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = labelAlpha;
        ctx.font        = '700 15px sans-serif';
        ctx.fillStyle   = '#4ade80';
        ctx.textAlign   = 'center';
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur  = 12;
        ctx.fillText('NICE CATCH!', W * 0.6, H * 0.385 - 58);
        ctx.restore();
      }
    }

    if (t < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      // Animation complete — dismiss
      setProgress(100);
      cycleMessage();
      setTimeout(dismiss, 400);
    }
  }

  // ── Dismiss ───────────────────────────────────────────────
  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, '1');
    overlay.classList.add('fade-out');
    document.body.classList.remove('preloader-active');
    setTimeout(function () {
      overlay.style.display = 'none';
      // Hide the static bug img (it's been rendered on canvas)
      if (bugImg) bugImg.style.opacity = '1';
    }, 650);
  }

  // ── Allow skip on click/tap ───────────────────────────────
  overlay.addEventListener('click', function () {
    if (rafId) cancelAnimationFrame(rafId);
    dismiss();
  });

  // ── Kick off ──────────────────────────────────────────────
  // Hide the static floating bug while canvas renders it
  if (bugImg) bugImg.style.opacity = '0';

  document.addEventListener('DOMContentLoaded', function () {
    // Small delay so fonts load before animation starts
    setTimeout(function () {
      rafId = requestAnimationFrame(tick);
    }, 120);
  });

})();