// ===== TASK 1: 3D Coverflow Carousel =====
(function() {
  const slides    = Array.from(document.querySelectorAll('.cflow-slide'));
  const dotsWrap  = document.getElementById('cfDots');
  const total     = slides.length;
  let active      = 2; // start on slide index 2 (BookMyShow) matching screenshot

  // Build dots
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'cflow-dot' + (i === active ? ' active' : '');
    d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });

  function applyTransforms() {
    slides.forEach((slide, i) => {
      let diff = i - active;
      // shortest circular distance
      if (diff > total / 2) {
        diff -= total;
      }
      if (diff < -total / 2) {
        diff += total;
      }
      let tx, tz, ry, opacity, zIndex, scale;

      if (diff === 0) {
        // Active — front and center
        tx = 0; tz = 0; ry = 0; opacity = 1; zIndex = 3; scale = 1;
        slide.style.boxShadow = '0 20px 60px rgba(0,0,0,.22)';
        slide.style.cursor = 'default';
      } else if (Math.abs(diff) === 1) {
        // Adjacent — angled sides matching screenshot
        const sign = diff > 0 ? 1 : -1;
        tx  = sign * 97;          // horizontal offset (% of track width)
        tz  = -244;               // push back in Z
        ry  = sign * 30.5;        // rotate Y
        opacity = 0.85;
        zIndex  = 2;
        scale   = 0.92;
        slide.style.boxShadow = '0 8px 24px rgba(0,0,0,.12)';
        slide.style.cursor = 'pointer';
      } else {
        // Far slides — deeply recessed
        const sign = diff > 0 ? 1 : -1;
        tx  = sign * 195;
        tz  = -488;
        ry  = sign * 61;
        opacity = 0.5;
        zIndex  = 1;
        scale   = 0.78;
        slide.style.boxShadow = 'none';
        slide.style.cursor = 'pointer';
      }

      slide.style.transform =
        `translate3d(${tx}%, 0, ${tz}px) rotateY(${ry}deg) scale(${scale})`;
      slide.style.opacity = opacity;
      slide.style.zIndex  = zIndex;
    });

    // Update dots
    dotsWrap.querySelectorAll('.cflow-dot').forEach((d, i) => {
      d.classList.toggle('active', i === active);
    });
  }

  function goTo(index) {
    active = ((index % total) + total) % total;
    applyTransforms();
  }

  document.getElementById('cfPrev').addEventListener('click', () => goTo(active - 1));
  document.getElementById('cfNext').addEventListener('click', () => goTo(active + 1));

  // Click on side slides to navigate to them
  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => { if (i !== active) goTo(i); });
  });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(active - 1);
    if (e.key === 'ArrowRight') goTo(active + 1);
  });

  // Touch / swipe
  let touchStartX = 0;
  const track = document.getElementById('cfTrack');
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(active + (dx < 0 ? 1 : -1));
  });

  // Init
  applyTransforms();
})();

// ===== TASK 2: Carousel & Chapters =====
const COMMON_CHAPTERS = [
  { time: '0:00', title: 'Introduction', desc: 'Overview of the video' },
  { time: '1:20', title: 'Main Concepts', desc: 'Key topics explained' },
  { time: '3:15', title: 'Deep Dive', desc: 'Detailed discussion' },
  { time: '6:40', title: 'Examples', desc: 'Practical examples and demos' },
  { time: '9:50', title: 'Advanced Topics', desc: 'Additional insights' },
  { time: '12:00', title: 'Summary', desc: 'Final recap and conclusions' }
];

const VIDEOS = [
  {
    id: 'RJTCAL1DRro',
    title: 'AI Tools Every Developer Should Know in 2024',
    duration: '12:45',
    chapters: COMMON_CHAPTERS
  },
  {
    id: 'xmmxkmVSiq0',
    title: 'React 19 – Everything New You Need to Know',
    duration: '18:30',
    chapters: COMMON_CHAPTERS
  },
  {
    id: 'xmmxkmVSiq0',
    title: 'Full-Stack MERN App – Build & Deploy',
    duration: '1:02:10',
    chapters: COMMON_CHAPTERS
  }
];

let activeVideo = 0;

function buildCarousel() {
  const strip = document.getElementById('carouselStrip');
  strip.innerHTML = '';
  VIDEOS.forEach((v, i) => {
    const card = document.createElement('div');
    card.className = 'thumb-card' + (i === 0 ? ' active' : '');
    card.innerHTML = `
      <div class="thumb-img">
        <img src="https://img.youtube.com/vi/${v.id}/mqdefault.jpg" alt="${v.title}" loading="lazy" />
      </div>
      <div class="thumb-info">
        <div class="thumb-title">${v.title}</div>
        <div class="thumb-duration">⏱ ${v.duration}</div>
      </div>`;
    card.addEventListener('click', () => switchVideo(i));
    strip.appendChild(card);
  });
}

function switchVideo(index) {
  activeVideo = index;
  const v = VIDEOS[index];

  console.log("Selected video:", v.id);

  const iframe = document.getElementById('mainPlayer');

iframe.src = '';

setTimeout(() => {
  iframe.src =
    `https://www.youtube.com/embed/${v.id}?autoplay=1&enablejsapi=1`;
}, 100);
    // Update thumbnails
  document.querySelectorAll('.thumb-card').forEach((c, i) => {
    c.classList.toggle('active', i === index);
  });
  // Render chapters
  renderChapters(v.chapters);
}

function renderChapters(chapters) {
  const panel = document.getElementById('chaptersPanel');
  panel.innerHTML = '<h4>📑 Chapters</h4>';
  chapters.forEach((ch, i) => {
    const item = document.createElement('div');
    item.className = 'chapter-item' + (i === 0 ? ' active' : '');
    item.innerHTML = `
      <span class="chapter-time">${ch.time}</span>
      <div>
        <div class="chapter-title">${ch.title}</div>
        <div class="chapter-desc">${ch.desc}</div>
      </div>`;
    item.addEventListener('click', () => {
      document.querySelectorAll('.chapter-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
    });
    panel.appendChild(item);
  });
}

function generateChapters() {

 const codeEl =
 document.getElementById('chapterCode');

 const result =
 document.getElementById('chapterResult');

 const sample = `

0:00 Introduction
1:20 Overview
3:15 Main Topic
6:40 Deep Dive
9:50 Examples
12:00 Summary

`;

 codeEl.textContent = sample;

 result.classList.add('show');
}

function copyChapters() {
  const text = document.getElementById('chapterCode').textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.querySelector('.copy-btn');
    btn.textContent = '✓ Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
  });
}

// ===== TASK 3: Lead Form =====
const FORM_DELAY_SECONDS = 6;
let leadFormShown = false;
let playerStarted = false;
let watchSeconds = 0;
let watchInterval = null;
let timerStarted = false;

// YouTube IFrame API
function onYouTubeIframeAPIReady() {
  // Player for Task 3
  window.leadYTPlayer = new YT.Player('leadPlayer', {
    events: {
      onStateChange: onLeadPlayerStateChange
    }
  });
}

function onLeadPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    if (!timerStarted) {
      timerStarted = true;
      startLeadTimer();
    }
    if (watchInterval) clearInterval(watchInterval);
    watchInterval = setInterval(() => { watchSeconds++; }, 1000);
  } else {
    if (watchInterval) clearInterval(watchInterval);
  }
}

function startLeadTimer() {
  const bar = document.getElementById('timerBar');
  const start = Date.now();
  const duration = FORM_DELAY_SECONDS * 1000;

  const tick = setInterval(() => {
    const elapsed = Date.now() - start;
    const pct = Math.min((elapsed / duration) * 100, 100);
    bar.style.width = pct + '%';

    if (elapsed >= duration && !leadFormShown) {
      clearInterval(tick);
      showLeadForm();
    }
  }, 100);
}

function showLeadForm() {
  if (leadFormShown) return;
  leadFormShown = true;
  document.getElementById('leadOverlay').classList.add('visible');
  document.getElementById('leadTimerNote').textContent = `You've watched ${watchSeconds}s – you're engaged! 🎉`;
}

function closeLead() {
  document.getElementById('leadOverlay').classList.remove('visible');
}

function submitLead() {
  const name = document.getElementById('leadName').value.trim();
  const email = document.getElementById('leadEmail').value.trim();
  if (!name || !email) { alert('Please fill in your name and email.'); return; }

  // Show success
  document.getElementById('leadFormContent').style.display = 'none';
  document.getElementById('leadSuccessContent').style.display = 'block';
  document.getElementById('leadClose').style.display = 'none';

  setTimeout(() => {
    closeLead();
    // Resume close button for future use
    document.getElementById('leadClose').style.display = '';
  }, 3000);
}

// Load YT API
(function loadYTAPI() {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
})();

// Init
buildCarousel();
renderChapters(VIDEOS[0].chapters);

const strip = document.getElementById('carouselStrip');

document.getElementById('videoPrev').addEventListener('click', () => {

  activeVideo--;

  if (activeVideo < 0) {
    activeVideo = VIDEOS.length - 1;
  }

  switchVideo(activeVideo);

});

document.getElementById('videoNext').addEventListener('click', () => {

  activeVideo++;

  if (activeVideo >= VIDEOS.length) {
    activeVideo = 0;
  }

  switchVideo(activeVideo);

});

// Nav active on scroll
window.addEventListener('scroll', () => {
  const sections = ['task1','task2','task3'];
  let current = 'task1';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 80) current = id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// YT API callback must be global
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
