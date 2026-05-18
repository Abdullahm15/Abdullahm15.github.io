'use strict';

/* ═══════════════════════════════════════════════
   MATRIX RAIN
═══════════════════════════════════════════════ */
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const CHARS = '01アイウエカキクコサシスタチツ∑∆∏√∞≠';
  const COL_W = 20;
  let W, H, cols, drops;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols  = Math.floor(W / COL_W);
    drops = new Array(cols).fill(0);
  }

  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.055)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#3fb950';
    ctx.font = `12px 'Space Mono', monospace`;
    drops.forEach((y, i) => {
      const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
      ctx.fillText(ch, i * COL_W, y * COL_W);
      if (y * COL_W > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  setInterval(draw, 65);
})();


/* ═══════════════════════════════════════════════
   TYPEWRITER
═══════════════════════════════════════════════ */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const WORDS = ['decisions.', 'strategies.', 'dashboards.', 'insights.', 'stories.'];
  let wordIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const word = WORDS[wordIdx];
    if (!deleting) {
      el.textContent = word.slice(0, ++charIdx);
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(tick, 2000);
        return;
      }
    } else {
      el.textContent = word.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % WORDS.length;
      }
    }
    setTimeout(tick, deleting ? 55 : 105);
  }

  setTimeout(tick, 1400);
})();


/* ═══════════════════════════════════════════════
   NAVBAR — scroll shrink + active link
═══════════════════════════════════════════════ */
(function initNavbar() {
  const nav   = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');

  // Scroll shrink
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Active section highlight
  const sections = [...document.querySelectorAll('section[id]')];
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (a) a.classList.add('active');
    });
  }, { threshold: 0.45 });
  sections.forEach(s => io.observe(s));

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();


/* ═══════════════════════════════════════════════
   MOBILE HAMBURGER MENU
═══════════════════════════════════════════════ */
(function initMobileNav() {
  const btn      = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const backdrop = document.getElementById('navBackdrop');
  if (!btn) return;

  function openMenu() {
    btn.classList.add('open');
    navLinks.classList.add('open');
    backdrop.classList.add('visible');
    btn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    btn.classList.remove('open');
    navLinks.classList.remove('open');
    backdrop.classList.remove('visible');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () =>
    btn.classList.contains('open') ? closeMenu() : openMenu()
  );
  backdrop.addEventListener('click', closeMenu);

  // Close on nav link click
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && btn.classList.contains('open')) closeMenu();
  });
})();


/* ═══════════════════════════════════════════════
   SCROLL REVEAL
═══════════════════════════════════════════════ */
(function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();


/* ═══════════════════════════════════════════════
   SKILL BARS
═══════════════════════════════════════════════ */
(function initSkillBars() {
  const section = document.getElementById('skills');
  if (!section) return;

  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    section.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
      setTimeout(() => {
        bar.style.width = (bar.dataset.width || 0) + '%';
      }, i * 120);
    });
    io.unobserve(section);
  }, { threshold: 0.2 });

  io.observe(section);
})();


/* ═══════════════════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════════════════ */
(function initCounters() {
  const els = document.querySelectorAll('.stat-num[data-target]');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    els.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 45));
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur + suffix;
        if (cur >= target) clearInterval(t);
      }, 30);
    });
    io.unobserve(entries[0].target);
  }, { threshold: 0.5 });

  io.observe(els[0].closest('.stat-grid') || els[0]);
})();


/* ═══════════════════════════════════════════════
   CV MODAL
   — opens centered on screen, drops from nav area
═══════════════════════════════════════════════ */
(function initCVModal() {
  const btn      = document.getElementById('cvBtn');
  const overlay  = document.getElementById('cvOverlay');
  const chevron  = document.getElementById('cvChevron');
  const closeBtn = document.getElementById('cvClose');
  if (!btn || !overlay) return;

  function openCV() {
    overlay.removeAttribute('hidden');
    // Small rAF so the hidden removal is painted before transitions fire
    requestAnimationFrame(() => {
      btn.setAttribute('aria-expanded', 'true');
      chevron.classList.add('rotated');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeCV() {
    btn.setAttribute('aria-expanded', 'false');
    chevron.classList.remove('rotated');
    document.body.style.overflow = '';
    // Wait for fade-out then hide
    overlay.addEventListener('transitionend', () => {
      if (!btn.matches('[aria-expanded="true"]')) overlay.setAttribute('hidden', '');
    }, { once: true });
    // Fallback
    setTimeout(() => overlay.setAttribute('hidden', ''), 400);
  }

  btn.addEventListener('click', () => {
    if (btn.getAttribute('aria-expanded') === 'true') closeCV();
    else openCV();
  });

  closeBtn.addEventListener('click', closeCV);

  // Click backdrop to close
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeCV();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') closeCV();
  });
})();


/* ═══════════════════════════════════════════════
   CHATBOT
═══════════════════════════════════════════════ */
(function initChatbot() {
  /* ── DOM refs ── */
  const fab       = document.getElementById('chatFab');
  const win       = document.getElementById('chatWindow');
  const closeBtn  = document.getElementById('chatClose');
  const form      = document.getElementById('chatForm');
  const input     = document.getElementById('chatInput');
  const sendBtn   = document.getElementById('chatSend');
  const msgArea   = document.getElementById('chatMessages');
  const badge     = document.getElementById('chatBadge');
  const quickBtns = document.getElementById('chatQuickBtns');
  if (!fab || !win) return;

  /* ── State ── */
  let isOpen   = false;
  let isBusy   = false;
  let history  = [];   // [{role, content}]

  /* ── CV context fed to Claude ── */
  const SYSTEM = `You are a friendly, concise AI assistant embedded in Abdullah Mohamed's portfolio website.
Only answer questions about Abdullah based on the CV below. Keep replies under 130 words unless the user asks for detail.
Be professional, warm, and helpful.

=== CV ===
Name: Abdullah Muhammed Abdullah
Location: Cairo, Egypt | Phone: +20 112 281 1623
Email: abdallahmuhammedd7a@gmail.com
LinkedIn: linkedin.com/in/abdullah-mohammedd | GitHub: github.com/Abdullahm15

SUMMARY
Data-oriented Information Systems graduate with hands-on experience in data analysis, KPI reporting, performance tracking, and BI reporting. Currently Planning and Performance Specialist at MNT-Halan. Seeking Data Analyst / BI Analyst / Performance Analyst roles.

EXPERIENCE
Planning and Performance Specialist — MNT-Halan, Cairo | Aug 2024–Present
• Collect, clean, analyze operational datasets to measure KPIs and identify trends
• Design and maintain performance dashboards for department heads
• Develop quarterly strategic plans and resource allocation models
• Conduct benchmarking research against industry standards
• Standardize data collection templates, reducing manual reporting effort

EDUCATION
B.Sc. Information Systems — Misr University for Science and Technology (MUST)
Graduated: June 2024 | GPA: 3.17/4.00 | Grade: B+
Coursework: Database Systems, Business Analytics, MIS, Operations Research, Statistical Analysis

SKILLS
• Excel: Power Query, PivotTables, VLOOKUP, XLOOKUP, Dynamic Arrays, Data Validation
• Power BI: Data Modeling, DAX, Interactive Dashboards, Report Design
• SQL: Querying, Filtering, Aggregation, Joins, Subqueries
• Python: Pandas, NumPy (data cleaning & exploration)
• Tableau, KPI Design, BI Reporting, Data Cleaning & Transformation
• Soft skills: Analytical Thinking, Attention to Detail, Communication, Time Management

PROJECTS
1. Sales Performance Dashboard (Power BI + DAX + Excel)
   — Star-schema model, KPI cards, automated refresh
   — Found 22% revenue concentration → exec reallocation brief

2. KPI Reporting Automation (Excel + Power Query)
   — Automated monthly tracker with traffic-light indicators
   — ~60% reduction in reporting prep time

3. Customer Segmentation (SQL + Power BI)
   — RFM scoring for 500+ customers via percentile SQL logic
   — Treemap & scatter chart, mock marketing brief

CERTIFICATIONS
• Google Data Analytics Professional Certificate (Coursera)
• IBM Data Analyst Professional Certificate (Coursera)
• Microsoft SQL Server (Coursera)
• Deloitte Data Analytics Virtual Experience (Forage)

LANGUAGES: Arabic (Native), English (Professional)
AVAILABILITY: Open to opportunities — actively looking`;

  /* ── Toggle ── */
  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      win.removeAttribute('hidden');
      requestAnimationFrame(() => win.classList.add('open'));
      fab.setAttribute('aria-expanded', 'true');
      if (badge) badge.style.display = 'none';
      input.focus();
    } else {
      win.classList.remove('open');
      fab.setAttribute('aria-expanded', 'false');
      setTimeout(() => win.setAttribute('hidden', ''), 300);
    }
  }

  fab.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) toggleChat();
  });

  /* ── Render helpers ── */
  function appendMsg(text, role) {
    // Remove quick-buttons after first user message
    if (role === 'user' && quickBtns) quickBtns.style.display = 'none';

    const row    = document.createElement('div');
    row.className = `chat-msg chat-msg-${role}`;
    const bubble  = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    row.appendChild(bubble);
    msgArea.appendChild(row);
    msgArea.scrollTop = msgArea.scrollHeight;
    return bubble;
  }

  function showTyping() {
    const row  = document.createElement('div');
    row.className = 'chat-msg chat-msg-bot';
    row.id = 'typingRow';
    row.innerHTML = `<div class="chat-typing">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
    msgArea.appendChild(row);
    msgArea.scrollTop = msgArea.scrollHeight;
  }

  function removeTyping() {
    const row = document.getElementById('typingRow');
    if (row) row.remove();
  }

  function setBusy(state) {
    isBusy = state;
    sendBtn.disabled   = state;
    input.disabled     = state;
    sendBtn.style.opacity = state ? '0.45' : '1';
  }

  /* ── Send message ── */
  async function sendMessage(text) {
    text = text.trim();
    if (!text || isBusy) return;

    input.value = '';
    appendMsg(text, 'user');
    setBusy(true);
    showTyping();

    history.push({ role: 'user', content: text });

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'anthropic-dangerous-direct-browser-calls': 'true'
        },
        body: JSON.stringify({
          model:      'claude-sonnet-4-20250514',
          max_tokens: 512,
          system:     SYSTEM,
          messages:   history
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `HTTP ${res.status}`);
      }

      const data  = await res.json();
      const reply = data?.content?.[0]?.text;

      if (!reply) throw new Error('Empty response from API');

      history.push({ role: 'assistant', content: reply });
      removeTyping();
      appendMsg(reply, 'bot');

    } catch (err) {
      console.error('[Chatbot error]', err);
      removeTyping();
      appendMsg(`Sorry, I couldn't connect right now. Please try again in a moment! 🙏`, 'bot');
      // Remove failed user message from history so next retry is clean
      history.pop();
    } finally {
      setBusy(false);
      input.focus();
    }
  }

  /* ── Events ── */
  form.addEventListener('submit', e => {
    e.preventDefault();
    sendMessage(input.value);
  });

  // Quick buttons
  if (quickBtns) {
    quickBtns.querySelectorAll('.chat-quick-btn').forEach(btn => {
      btn.addEventListener('click', () => sendMessage(btn.dataset.msg));
    });
  }

  // Expose global (legacy inline handlers fallback)
  window.sendSuggestion = text => sendMessage(text);
})();
