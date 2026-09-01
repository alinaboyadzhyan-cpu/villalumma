// ============================ Nav ============================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > 40);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', open);
});

document.querySelectorAll('[data-nav]').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// ===================== Floor plan level switcher =====================
const levelBtns = document.querySelectorAll('.level-btn');
const panels = document.querySelectorAll('.plan-panel');

levelBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const level = btn.dataset.level;

    levelBtns.forEach(b => b.setAttribute('aria-selected', b === btn));
    panels.forEach(p => p.classList.toggle('active', p.dataset.panel === level));
  });
});

// ============================ Gallery filter ============================
const gTabs = document.querySelectorAll('.g-tab');
const gItems = document.querySelectorAll('.g-item');

gTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    gTabs.forEach(t => t.setAttribute('aria-pressed', t === tab));
    const filter = tab.dataset.filter;
    gItems.forEach(item => {
      const show = filter === 'all' || item.dataset.cat === filter;
      item.classList.toggle('hide', !show);
    });
  });
});

// ============================ Gallery lightbox ============================
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbClose = document.getElementById('lbClose');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');

let lbItems = [];
let lbIndex = 0;

function visibleGalleryItems() {
  return Array.from(gItems).filter(el => !el.classList.contains('hide'));
}

function updateLightbox() {
  const item = lbItems[lbIndex];
  const img = item.querySelector('img');
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lbCaption.textContent = item.dataset.label || item.dataset.planLabel || img.alt;
}

function openLightboxFrom(pool, item) {
  lbItems = pool;
  lbIndex = pool.indexOf(item);
  if (lbIndex < 0) lbIndex = 0;
  updateLightbox();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function openLightbox(item) {
  openLightboxFrom(visibleGalleryItems(), item);
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function showNext() {
  lbIndex = (lbIndex + 1) % lbItems.length;
  updateLightbox();
}

function showPrev() {
  lbIndex = (lbIndex - 1 + lbItems.length) % lbItems.length;
  updateLightbox();
}

gItems.forEach(item => {
  item.addEventListener('click', () => openLightbox(item));
});

// Floor plan images share the same lightbox — clicking any level's plan
// opens it full-size and readable, and prev/next flips between levels.
const planPanels = Array.from(document.querySelectorAll('.plan-panel'));
planPanels.forEach(panel => {
  const planImg = panel.querySelector('img.zoomable-plan');
  if (planImg) {
    planImg.addEventListener('click', () => openLightboxFrom(planPanels, panel));
  }
});

lbClose.addEventListener('click', closeLightbox);
lbNext.addEventListener('click', showNext);
lbPrev.addEventListener('click', showPrev);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
});

// ============================ Audience toggle ============================
const audienceField = document.getElementById('audienceField');
document.querySelectorAll('.aud-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.aud-btn').forEach(b => b.setAttribute('aria-pressed', b === btn));
    if (audienceField) {
      audienceField.value = btn.dataset.aud === 'agent' ? 'Agent' : 'Buyer';
    }
  });
});

// ============================ Enquiry form (Formspree) ============================
const form = document.getElementById('enquiryForm');
const formMsg = document.getElementById('formMsg');
const formMsgError = document.getElementById('formMsgError');
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formMsg.classList.remove('show');
  formMsgError.classList.remove('show');
  submitBtn.setAttribute('disabled', 'true');
  submitBtn.textContent = 'Sending…';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      formMsg.classList.add('show');
      form.reset();
      // Restore the audience toggle to its default state after reset.
      document.querySelectorAll('.aud-btn').forEach(b => b.setAttribute('aria-pressed', b.dataset.aud === 'buyer'));
      if (audienceField) audienceField.value = 'Buyer';
    } else {
      formMsgError.classList.add('show');
      submitBtn.removeAttribute('disabled');
      submitBtn.textContent = 'Send Enquiry';
    }
  } catch (err) {
    formMsgError.classList.add('show');
    submitBtn.removeAttribute('disabled');
    submitBtn.textContent = 'Send Enquiry';
  }
});

// ============================ Scroll reveal ============================
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -5% 0px' });
  revealEls.forEach(el => io.observe(el));

  // Safety net: fast/native momentum scrolling on some mobile browsers can
  // outrun the observer. Anything left un-revealed after a couple of
  // seconds of inactivity gets shown anyway, so content can never get
  // permanently stuck invisible.
  let revealTimer;
  const forceRevealStragglers = () => {
    document.querySelectorAll('.reveal:not(.in)').forEach(el => el.classList.add('in'));
  };
  window.addEventListener('scroll', () => {
    clearTimeout(revealTimer);
    revealTimer = setTimeout(forceRevealStragglers, 1200);
  }, { passive: true });
  setTimeout(forceRevealStragglers, 4000);
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// ============================ Footer year ============================
document.getElementById('year').textContent = new Date().getFullYear();
