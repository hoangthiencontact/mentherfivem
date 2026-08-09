/* ============================================================
   CYBERSEC PORTFOLIO — script.js (OPTIMIZED)
   ============================================================ */

/* ── 1. OPTIMIZED PARTICLES BACKGROUND ─────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT   = window.innerWidth < 768 ? 40 : 70; // Giảm hạt trên mobile
  const SPEED   = 0.3;
  const COLOR   = '#00f5d4';
  const CONNECT = 130;
  const CONNECT_SQ = CONNECT * CONNECT; // Dùng khoảng cách bình phương để tránh Math.sqrt

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * SPEED * 2;
    this.vy = (Math.random() - 0.5) * SPEED * 2;
    this.r  = Math.random() * 1.5 + 1;
    this.alpha = Math.random() * 0.5 + 0.3;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // 1. Cập nhật vị trí & Vẽ điểm
    ctx.fillStyle = COLOR;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Tối ưu vẽ dây nối (Batch Drawing)
    ctx.strokeStyle = COLOR;
    ctx.lineWidth = 0.6;

    for (let i = 0; i < COUNT; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < COUNT; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < CONNECT_SQ) {
          ctx.globalAlpha = (1 - Math.sqrt(distSq) / CONNECT) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resize();
      createParticles();
    }, 200);
  });

  resize();
  createParticles();
  draw();
})();


/* ── 2. NAVBAR SCROLL & ACTIVE LINK ───────────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
    updateActiveLink();
    toggleBackToTop();
    triggerSkillBars();
  }, { passive: true });

  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('nav-menu')?.classList.remove('open');
        document.getElementById('hamburger')?.classList.remove('open');
      }
    });
  });
})();


/* ── 3. HAMBURGER MENU ────────────────────────────────────── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
    }
  });
})();


/* ── 4. TYPING ANIMATION ──────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    'Cybersecurity Student',
    'Ethical Hacker',
    'SOC Analyst Enthusiast',
    'CTF Competitor',
    'Digital Forensics Learner',
    'Security Researcher',
  ];

  let pIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const current = phrases[pIdx];
    if (deleting) {
      el.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(type, 300);
        return;
      }
      setTimeout(type, 40);
    } else {
      el.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 80);
    }
  }

  setTimeout(type, 800);
})();


/* ── 5. SKILL BARS ANIMATION ──────────────────────────────── */
let skillsAnimated = false;
function triggerSkillBars() {
  if (skillsAnimated) return;
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  if (skillsSection.getBoundingClientRect().top < window.innerHeight * 0.8) {
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
      bar.style.width = (bar.getAttribute('data-width') || '0') + '%';
    });
    skillsAnimated = true;
  }
}


/* ── 6. BACK TO TOP BUTTON ────────────────────────────────── */
function toggleBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.classList.toggle('visible', window.scrollY > 400);
}

document.getElementById('back-to-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ── 7. AOS & REVEAL INIT ─────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, easing: 'ease-out-quart', once: true, offset: 60 });
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-aos]').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.7s, transform 0.7s';
      observer.observe(el);
    });
  }
});


/* ── 8. FOOTER YEAR & GLITCH ─────────────────────────────── */
(function initMisc() {
  const yr = document.getElementById('current-year');
  if (yr) yr.textContent = new Date().getFullYear();

  const frame = document.querySelector('.avatar-frame');
  frame?.addEventListener('mouseenter', () => {
    frame.classList.add('glitching');
    setTimeout(() => frame.classList.remove('glitching'), 600);
  });
})();