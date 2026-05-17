'use strict';

/* ════════════════════════════════════════
   MATRIX RAIN
════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, cols, drops;
  const chars = '01アイウエオカキクケコサシスセソ∑∆∏√∞≠≈';

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols = Math.floor(W / 20);
    drops = Array(cols).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#3fb950';
    ctx.font = '12px Space Mono, monospace';
    drops.forEach((y, i) => {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * 20, y * 20);
      if (y * 20 > H && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 65);
})();


/* ════════════════════════════════════════
   TYPEWRITER
════════════════════════════════════════ */
(function () {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const words = ['decisions.', 'strategies.', 'dashboards.', 'insights.', 'stories.'];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(type, 2000); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? 55 : 100);
  }
  setTimeout(type, 1400);
})();


/* ════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


/* ════════════════════════════════════════
   SKILL BARS
════════════════════════════════════════ */
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar').forEach((bar, i) => {
        setTimeout(() => { bar.style.width = bar.dataset.width + '%'; }, i * 130);
      });
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.25 });
const skillsSec = document.querySelector('#skills');
if (skillsSec) barObs.observe(skillsSec);


/* ════════════════════════════════════════
   COUNTER ANIMATION
════════════════════════════════════════ */
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.skill-stat-num[data-target]').forEach(el => {
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const step = Math.ceil(target / 40);
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = cur + suffix;
        if (cur >= target) clearInterval(t);
      }, 32);
    });
    counterObs.unobserve(e.target);
  });
}, { threshold: 0.4 });
const statSec = document.querySelector('.skills-highlight');
if (statSec) counterObs.observe(statSec);


/* ════════════════════════════════════════
   NAVBAR SCROLL
════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.style.height = '52px';
    navbar.style.borderBottomColor = 'rgba(88,166,255,0.1)';
  } else {
    navbar.style.height = '64px';
    navbar.style.borderBottomColor = 'rgba(255,255,255,0.07)';
  }
});

// Active nav highlight
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const secObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.style.color = '');
      const a = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (a) a.style.color = '#58a6ff';
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => secObs.observe(s));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});


/* ════════════════════════════════════════
   CV PANEL
════════════════════════════════════════ */
const cvBtn       = document.getElementById('cvBtn');
const cvChevron   = document.getElementById('cvChevron');
const cvOverlay   = document.getElementById('cvOverlay');
const cvBackdrop  = document.getElementById('cvBackdrop');
const cvPanelClose= document.getElementById('cvPanelClose');
let cvOpen = false;

function openCV() {
  cvOpen = true;
  cvOverlay.classList.add('open');
  cvChevron.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCV() {
  cvOpen = false;
  cvOverlay.classList.remove('open');
  cvChevron.classList.remove('open');
  document.body.style.overflow = '';
}

cvBtn.addEventListener('click', () => cvOpen ? closeCV() : openCV());
cvBackdrop.addEventListener('click', closeCV);
cvPanelClose.addEventListener('click', closeCV);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && cvOpen) closeCV(); });


/* ════════════════════════════════════════
   CHATBOT — WORKING API CALL
════════════════════════════════════════ */
const chatFab      = document.getElementById('chatFab');
const chatWindow   = document.getElementById('chatWindow');
const chatClose    = document.getElementById('chatClose');
const chatInput    = document.getElementById('chatInput');
const chatSend     = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');
const fabBadge     = document.getElementById('fabBadge');
let chatIsOpen = false;
let conversationHistory = [];

const CV_SYSTEM_PROMPT = `You are a friendly AI assistant embedded in Abdullah Mohamed's portfolio website. 
Your ONLY job is to answer questions about Abdullah based on his CV below.
Keep answers concise (under 120 words) unless asked for more detail.
Be professional, warm, and helpful. Format responses clearly.

=== ABDULLAH MOHAMED'S CV ===

NAME: Abdullah Muhammed Abdullah
LOCATION: Cairo, Egypt
PHONE: +20 112 281 1623
EMAIL: abdallahmuhammedd71@gmail.com
LINKEDIN: linkedin.com/in/abdullah-mohammedd
GITHUB: github.com/Abdullahm15

SUMMARY:
Data-oriented Information Systems graduate with hands-on experience in data analysis, KPI reporting, performance tracking, and business intelligence reporting. Currently working as a Planning and Performance Specialist at MNT-Halan. Seeking a data analyst, BI analyst, or performance analyst role.

EXPERIENCE:
- Planning and Performance Specialist at MNT-Halan, Cairo, Egypt — August 2024 to Present
  * Collects, cleans, and analyzes operational datasets to measure KPIs
  * Designs and maintains performance dashboards for department heads
  * Develops quarterly strategic plans and resource allocation models
  * Conducts benchmarking research against industry standards
  * Supports cross-functional project coordination
  * Standardizes data collection templates, reducing manual effort

EDUCATION:
- B.A. Business Information Systems, Misr University for Science and Technology (MUST)
- Graduated: June 2024
- GPA: 3.17 / 4.00 — Grade: B+
- Coursework: Database Systems, Business Analytics, Management Information Systems, Operations Research, Statistical Analysis

TECHNICAL SKILLS:
- Excel: Power Query, PivotTables, VLOOKUP, XLOOKUP, Dynamic Arrays, Data Validation
- Power BI: Data Modeling, DAX, Interactive Dashboards, Report Design
- SQL: Querying, Filtering, Aggregation, Joins, Subqueries
- Python: Pandas, NumPy (data cleaning & exploration)
- Tableau, KPI Design, BI Reporting, Data Cleaning & Transformation

SOFT SKILLS:
- Analytical Thinking, Attention to Detail, Clear Communication, Time Management, Team Collaboration, Growth Mindset

PROJECTS:
1. Sales Performance Dashboard (Power BI + DAX + Excel)
   - End-to-end BI dashboard with star-schema data model
   - KPI cards, slicers, automated refresh
   - Found 22% revenue concentration in one segment → exec reallocation brief

2. KPI Reporting Automation (Excel + Power Query)
   - Automated monthly KPI tracker with traffic-light indicators
   - ~60% reduction in reporting prep time

3. Customer Segmentation Analysis (SQL + Power BI)
   - RFM segmentation on 500+ customers using percentile SQL logic
   - Treemap & scatter chart in Power BI, mock marketing brief produced

CERTIFICATIONS:
- Google Data Analytics Professional Certificate (Coursera)
- IBM Data Analyst Professional Certificate (Coursera)
- Microsoft SQL Server (Coursera)
- Deloitte Data Analytics Virtual Experience (Forage)

LANGUAGES: Arabic (Native), English (Professional Working Proficiency)
AVAILABILITY: Open to opportunities — actively seeking Data Analyst, BI Analyst, or Performance Analyst roles`;

function toggleChat() {
  chatIsOpen = !chatIsOpen;
  chatWindow.classList.toggle('open', chatIsOpen);
  if (chatIsOpen) {
    if (fabBadge) fabBadge.style.display = 'none';
    setTimeout(() => chatInput.focus(), 300);
  }
}

chatFab.addEventListener('click', toggleChat);
chatClose.addEventListener('click', toggleChat);

function appendMsg(text, role) {
  const wrap = document.createElement('div');
  wrap.className = `chat-msg ${role}`;
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.textContent = text;
  wrap.appendChild(bubble);
  chatMessages.appendChild(wrap);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'chat-msg bot';
  wrap.id = 'typingIndicator';
  wrap.innerHTML = `<div class="chat-typing"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  chatMessages.appendChild(wrap);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

function hideSuggestions() {
  const s = document.getElementById('chatSuggestions');
  if (s) s.style.display = 'none';
}

async function sendMessage(text) {
  text = text.trim();
  if (!text) return;

  hideSuggestions();
  appendMsg(text, 'user');
  chatInput.value = '';
  chatSend.disabled = true;
  showTyping();

  conversationHistory.push({ role: 'user', content: text });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-dangerous-direct-browser-calls': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: CV_SYSTEM_PROMPT,
        messages: conversationHistory
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data?.content?.[0]?.text || "I couldn't retrieve a response. Please try again!";

    conversationHistory.push({ role: 'assistant', content: reply });
    removeTyping();
    appendMsg(reply, 'bot');

  } catch (err) {
    console.error('Chat error:', err);
    removeTyping();
    appendMsg("Sorry, I ran into an issue. Please try again in a moment!", 'bot');
  }

  chatSend.disabled = false;
  chatInput.focus();
}

chatSend.addEventListener('click', () => sendMessage(chatInput.value));
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage(chatInput.value);
  }
});

window.sendSuggestion = function (btn) {
  sendMessage(btn.textContent);
};
