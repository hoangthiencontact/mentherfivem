/* ============================================================
   CYBERSEC PORTFOLIO — script.js
   ============================================================ */

/* ── 1. PARTICLES BACKGROUND ──────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT   = 80;
  const SPEED   = 0.3;
  const COLOR   = '#00f5d4';
  const CONNECT = 140; // max px distance to draw lines

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function Particle() {
    this.x  = rand(0, W);
    this.y  = rand(0, H);
    this.vx = rand(-SPEED, SPEED);
    this.vy = rand(-SPEED, SPEED);
    this.r  = rand(1, 2.5);
    this.alpha = rand(0.3, 0.8);
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = COLOR;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = COLOR;
          ctx.globalAlpha = (1 - dist / CONNECT) * 0.18;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  resize();
  createParticles();
  draw();
})();


/* ── 2. NAVBAR: SCROLL EFFECT & ACTIVE LINK ──────────────── */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Scrolled class
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
    toggleBackToTop();
    triggerSkillBars();
  }, { passive: true });

  // Active link on scroll
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

  // Smooth scroll on click
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile menu
        document.getElementById('nav-menu').classList.remove('open');
        document.getElementById('hamburger').classList.remove('open');
      }
    });
  });
})();


/* ── 3. HAMBURGER MENU ────────────────────────────────────── */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  // Close on outside click
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

  let pIdx = 0;
  let cIdx = 0;
  let deleting = false;
  const TYPING_SPEED   = 80;
  const DELETING_SPEED = 40;
  const PAUSE_END      = 1800;
  const PAUSE_START    = 300;

  function type() {
    const current = phrases[pIdx];

    if (deleting) {
      el.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(type, PAUSE_START);
        return;
      }
      setTimeout(type, DELETING_SPEED);
    } else {
      el.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(type, PAUSE_END);
        return;
      }
      setTimeout(type, TYPING_SPEED);
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

  const sectionTop = skillsSection.getBoundingClientRect().top;
  if (sectionTop < window.innerHeight * 0.8) {
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
      const w = bar.getAttribute('data-width') || '0';
      bar.style.width = w + '%';
    });
    skillsAnimated = true;
  }
}


/* ── 6. BACK TO TOP BUTTON ────────────────────────────────── */
function toggleBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  if (window.scrollY > 400) {
    btn.classList.add('visible');
  } else {
    btn.classList.remove('visible');
  }
}

document.getElementById('back-to-top')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ── 7. AOS INIT ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 700,
    easing: 'ease-out-quart',
    once: true,
    offset: 60,
  });
});


/* ── 8. CONTACT FORM VALIDATION ──────────────────────────── */
(function initForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  const nameInput = form.querySelector('#name');
  const emailInput= form.querySelector('#email');
  const msgInput  = form.querySelector('#message');

  const nameErr = document.getElementById('name-error');
  const emailErr= document.getElementById('email-error');
  const msgErr  = document.getElementById('message-error');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setError(input, errEl, msg) {
    input.classList.add('invalid');
    input.classList.remove('valid');
    if (errEl) errEl.textContent = msg;
    return false;
  }

  function clearError(input, errEl) {
    input.classList.remove('invalid');
    if (errEl) errEl.textContent = '';
  }

  // Live validation on blur
  nameInput.addEventListener('blur', () => {
    if (!nameInput.value.trim()) {
      setError(nameInput, nameErr, '// Name is required');
    } else if (nameInput.value.trim().length < 2) {
      setError(nameInput, nameErr, '// Name must be at least 2 characters');
    } else {
      clearError(nameInput, nameErr);
    }
  });

  emailInput.addEventListener('blur', () => {
    if (!emailInput.value.trim()) {
      setError(emailInput, emailErr, '// Email is required');
    } else if (!validateEmail(emailInput.value.trim())) {
      setError(emailInput, emailErr, '// Invalid email format');
    } else {
      clearError(emailInput, emailErr);
    }
  });

  msgInput.addEventListener('blur', () => {
    if (!msgInput.value.trim()) {
      setError(msgInput, msgErr, '// Message is required');
    } else if (msgInput.value.trim().length < 10) {
      setError(msgInput, msgErr, '// Message must be at least 10 characters');
    } else {
      clearError(msgInput, msgErr);
    }
  });

  // Submit
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setError(nameInput, nameErr, '// Name is required');
      valid = false;
    } else {
      clearError(nameInput, nameErr);
    }

    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      setError(emailInput, emailErr, '// Valid email is required');
      valid = false;
    } else {
      clearError(emailInput, emailErr);
    }

    if (!msgInput.value.trim() || msgInput.value.trim().length < 10) {
      setError(msgInput, msgErr, '// Message must be at least 10 characters');
      valid = false;
    } else {
      clearError(msgInput, msgErr);
    }

    if (!valid) return;

    // Simulate sending — loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('visible');
    }, 1400);
  });
})();
 
(function initCertificateFolder() {
  const folderButton = document.getElementById('open-cert-folder');
  const folderInput  = document.getElementById('cert-folder-input');
  const folderPanel  = document.getElementById('cert-folder-contents');
  const folderGrid   = document.getElementById('cert-folder-grid');
  if (!folderButton || !folderInput || !folderPanel || !folderGrid) return;
 
  folderButton.addEventListener('click', () => {
    folderInput.click();
  });
 
  folderInput.addEventListener('change', () => {
    const files = Array.from(folderInput.files || []).filter(file => file.type.startsWith('image/'));
    folderGrid.innerHTML = '';
 
    if (files.length === 0) {
      folderGrid.innerHTML = '<p class="cert-folder-empty">No image files were selected. Please choose a folder containing your certificate images.</p>';
      folderPanel.classList.add('visible');
      return;
    }
 
    files.forEach(file => {
      const item = document.createElement('div');
      item.className = 'cert-folder-item';
 
      const thumb = document.createElement('img');
      thumb.className = 'cert-folder-thumb';
      thumb.alt = file.name;
      thumb.src = URL.createObjectURL(file);
      thumb.addEventListener('load', () => URL.revokeObjectURL(thumb.src));
 
      const name = document.createElement('span');
      name.className = 'cert-folder-name';
      name.textContent = file.name;
 
      item.appendChild(thumb);
      item.appendChild(name);
      folderGrid.appendChild(item);
    });
 
    folderPanel.classList.add('visible');
  });
})();
 
/* ── 9. FOOTER YEAR ───────────────────────────────────────── */
(function setYear() {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
})();


/* ── 10. GLITCH EFFECT ON AVATAR HOVER ───────────────────── */
(function initGlitch() {
  const frame = document.querySelector('.avatar-frame');
  if (!frame) return;

  frame.addEventListener('mouseenter', () => {
    frame.classList.add('glitching');
    setTimeout(() => frame.classList.remove('glitching'), 600);
  });
})();


/* ── 11. CURSOR TRAIL EFFECT (subtle) ─────────────────────── */
(function initCursorTrail() {
  // Only on desktop
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const dots = [];
  const NUM  = 6;

  for (let i = 0; i < NUM; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      width: ${6 - i}px;
      height: ${6 - i}px;
      border-radius: 50%;
      background: rgba(0, 245, 212, ${0.5 - i * 0.07});
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.1s;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(dot);
    dots.push({ el: dot, x: 0, y: 0 });
  }

  let mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animateTrail() {
    let prevX = mx, prevY = my;
    dots.forEach((d, i) => {
      const lag = 1 - i * 0.12;
      d.x += (prevX - d.x) * (0.25 - i * 0.03);
      d.y += (prevY - d.y) * (0.25 - i * 0.03);
      d.el.style.left = d.x + 'px';
      d.el.style.top  = d.y + 'px';
      prevX = d.x;
      prevY = d.y;
    });
    requestAnimationFrame(animateTrail);
  }

  animateTrail();
})();


/* ── 12. SECTION REVEAL (fallback if AOS not loaded) ──────── */
(function initFallbackReveal() {
  if (typeof AOS !== 'undefined') return; // AOS handles it

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
})();



/* ============================================================
   DEVTOOLS PROTECTION (CHẶN BẮT PHÁT HIỆN DEVTOOLS)
   ============================================================ */
(function protectDevTools() {
  // 1. Chặn chuột phải (Context Menu)
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  // 2. Chặn các phím tắt mở DevTools
  document.addEventListener('keydown', function (e) {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (Chrome, Firefox, Edge)
    // Cmd+Option+I, Cmd+Option+J, Cmd+Option+C (macOS)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && 
        (e.key === 'I' || e.key === 'i' || 
         e.key === 'J' || e.key === 'j' || 
         e.key === 'C' || e.key === 'c')) {
      e.preventDefault();
      return false;
    }

    // Ctrl+U / Cmd+U (Xem nguồn trang - View Source)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
      return false;
    }

    // Ctrl+S / Cmd+S (Lưu trang web)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
      e.preventDefault();
      return false;
    }
  });
}());

/* ============================================================
   DEVTOOLS PROTECTION (CHẶN TẤT CẢ PHƯƠNG THỨC MỞ DEVTOOLS)
   ============================================================ */
(function protectDevTools() {
  // 1. Chặn chuột phải
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  // 2. Chặn các phím tắt mở DevTools & View Source
  document.addEventListener('keydown', function (e) {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) {
      e.preventDefault();
      return false;
    }

    // Ctrl+Shift+I / J / C / K (DevTools & Console)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && 
        ['I', 'i', 'J', 'j', 'C', 'c', 'K', 'k'].includes(e.key)) {
      e.preventDefault();
      return false;
    }

    // Ctrl+U (View Source), Ctrl+S (Save Page)
    if ((e.ctrlKey || e.metaKey) && ['U', 'u', 'S', 's'].includes(e.key)) {
      e.preventDefault();
      return false;
    }
  });
}());