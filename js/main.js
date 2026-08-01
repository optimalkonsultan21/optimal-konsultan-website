/**
 * OPTIMAL KONSULTAN - INTERACTIVE SCRIPT
 * Tax Calculators, WhatsApp Automation, Quiz Assessment, Accordions, & Search
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTaxCalculator();
  initProblemSolutionFilter();
  initArticles();
  initTestimonialFilter();
  initFaqAccordion();
  initFaqSearch();
  initTaxQuiz();
  initConsultationModal();
  initWhatsAppWidget();
});

/* ==========================================================================
   DYNAMIC ARTICLES SYSTEM
   ========================================================================== */
async function initArticles() {
  const container = document.getElementById('articlesGridContainer');
  if (!container) return;

  try {
    const res = await fetch('content/articles.json?v=' + Date.now());
    const data = await res.json();
    
    if (data && data.articles && data.articles.length) {
      window.loadedArticles = data.articles;
      container.innerHTML = data.articles.map(art => `
        <article class="article-card">
          <div class="article-img-wrapper">
            <img src="${art.image || 'assets/hero_tax_consultant.jpg'}" alt="${art.title}">
            <span class="article-cat-badge">${art.category || 'Panduan Pajak'}</span>
          </div>
          <div class="article-body">
            <div class="article-meta">
              <span><i class="far fa-calendar-alt"></i> ${art.date}</span>
              <span><i class="far fa-clock"></i> ${art.readTime || '5 min'}</span>
            </div>
            <h3 class="article-title">${art.title}</h3>
            <p class="article-summary">${art.summary}</p>
            <button class="article-read-btn" onclick="openArticleModal('${art.id}')">
              Baca Selengkapnya <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </article>
      `).join('');
    }
  } catch (e) {
    console.error('Error loading articles:', e);
  }
}

window.openArticleModal = function(articleId) {
  if (!window.loadedArticles) return;
  const art = window.loadedArticles.find(a => a.id === articleId);
  if (!art) return;

  const modal = document.getElementById('articleReaderModal');
  const body = document.getElementById('articleReaderBody');

  if (modal && body) {
    body.innerHTML = `
      <div class="badge-tag orange" style="margin-bottom: 0.5rem;">${art.category}</div>
      <h2 style="font-size: 1.75rem; color: var(--neutral-dark); margin-bottom: 0.75rem;">${art.title}</h2>
      <div style="font-size: 0.85rem; color: var(--neutral-muted); margin-bottom: 1.5rem; display: flex; gap: 1.5rem;">
        <span><i class="far fa-user"></i> Penulis: <strong>${art.author}</strong></span>
        <span><i class="far fa-calendar-alt"></i> ${art.date}</span>
      </div>
      <img src="${art.image || 'assets/hero_tax_consultant.jpg'}" style="width: 100%; max-height: 320px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
      <div style="font-size: 1rem; line-height: 1.8; color: var(--neutral-body); white-space: pre-line;">
        ${art.content}
      </div>
      <div style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--neutral-border); text-align: center;">
        <button class="btn btn-primary-wa" onclick="openWaWithArticle('${art.title}')">
          <i class="fab fa-whatsapp"></i> Konsultasikan Topik Ini Bersama Mas Andri
        </button>
      </div>
    `;
    modal.classList.add('active');
  }
};

window.openWaWithArticle = function(title) {
  const msg = `Halo Mas Andri, saya membaca artikel "${title}" di website Optimal Konsultan.%0AIngin konsultasi lebih lanjut terkait bisnis saya. Terima kasih!`;
  window.open(`https://wa.me/628123400008?text=${msg}`, '_blank');
};

/* ==========================================================================
   1. NAVBAR & MOBILE NAVIGATION
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.1)';
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
      navbar.style.boxShadow = 'none';
      navbar.style.background = 'rgba(255, 255, 255, 0.92)';
    }
  });

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('active')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }
}

/* ==========================================================================
   2. INTERACTIVE UMKM & PTKP TAX CALCULATOR
   ========================================================================== */
function initTaxCalculator() {
  const omsetRange = document.getElementById('omsetRange');
  const omsetNumber = document.getElementById('omsetNumber');
  const entityType = document.getElementById('entityType');
  const resultTaxVal = document.getElementById('resultTaxVal');
  const resultSavingsVal = document.getElementById('resultSavingsVal');
  const resultNote = document.getElementById('resultNote');

  if (!omsetRange || !omsetNumber) return;

  function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  }

  function calculateTax() {
    let monthlyOmset = parseFloat(omsetRange.value) || 0;
    let annualOmset = monthlyOmset * 12;
    let type = entityType.value; // 'op' (Orang Pribadi) or 'badan' (PT/CV)
    let taxAnnual = 0;
    let normalTaxNoScheme = annualOmset * 0.22; // Regular corporate / non-final rate comparison

    if (type === 'op') {
      // Rule PP 55/2022: Omset up to 500 Million/year is TAX FREE (0%)
      if (annualOmset <= 500000000) {
        taxAnnual = 0;
        if (resultNote) {
          resultNote.innerHTML = '🎉 <strong>Bebas Pajak!</strong> Sesuai PP 55/2022, Omset Orang Pribadi s/d Rp 500 Juta/Tahun Tarif 0%.';
        }
      } else {
        const taxableAnnual = annualOmset - 500000000;
        taxAnnual = taxableAnnual * 0.005;
        if (resultNote) {
          resultNote.innerHTML = `💡 Anda hanya bayar 0.5% dari sisa omset di atas Rp 500 Juta (Omset kena pajak: ${formatRupiah(taxableAnnual)}/thn).`;
        }
      }
    } else {
      // PT / CV / Badan - 0.5% from gross revenue
      taxAnnual = annualOmset * 0.005;
      if (resultNote) {
        resultNote.innerHTML = '🏢 Tarif PPh Final UMKM Badan (PT/CV) 0.5% dari Omset Bruto.';
      }
    }

    let taxMonthly = taxAnnual / 12;
    let savings = Math.max(0, normalTaxNoScheme - taxAnnual);

    if (resultTaxVal) {
      resultTaxVal.textContent = formatRupiah(taxMonthly) + ' / bulan';
    }
    if (resultSavingsVal) {
      resultSavingsVal.textContent = formatRupiah(savings) + ' / tahun';
    }
  }

  // Event Listeners
  omsetRange.addEventListener('input', (e) => {
    omsetNumber.value = e.target.value;
    calculateTax();
  });

  omsetNumber.addEventListener('input', (e) => {
    let val = parseFloat(e.target.value) || 0;
    if (val > 500000000) val = 500000000;
    omsetRange.value = val;
    calculateTax();
  });

  entityType.addEventListener('change', calculateTax);

  // Initial Run
  calculateTax();
}

/* ==========================================================================
   3. PROBLEM & SOLUTION TOGGLE / CARDS FILTER
   ========================================================================== */
function initProblemSolutionFilter() {
  const toggleBtns = document.querySelectorAll('.ps-toggle-btn');
  const cards = document.querySelectorAll('.ps-card');

  if (!toggleBtns.length) return;

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all') {
          card.style.display = 'flex';
        } else if (filter === 'problem' && card.classList.contains('problem-type')) {
          card.style.display = 'flex';
        } else if (filter === 'solusi' && card.classList.contains('solusi-type')) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. TESTIMONIALS FILTER
   ========================================================================== */
function initTestimonialFilter() {
  const filterBtns = document.querySelectorAll('.testi-filter-btn');
  const testiCards = document.querySelectorAll('.testi-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.category;

      testiCards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. FAQ ACCORDION & SEARCH FILTER
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other active items for clean accordions
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });

      item.classList.toggle('active', !isActive);
    });
  });
}

function initFaqSearch() {
  const searchInput = document.getElementById('faqSearchInput');
  const faqItems = document.querySelectorAll('.faq-item');

  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    faqItems.forEach(item => {
      const qText = item.querySelector('.faq-question').textContent.toLowerCase();
      const aText = item.querySelector('.faq-answer').textContent.toLowerCase();

      if (qText.includes(query) || aText.includes(query)) {
        item.style.display = 'block';
        if (query.length > 2) {
          item.classList.add('active');
        }
      } else {
        item.style.display = 'none';
        item.classList.remove('active');
      }
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE TAX HEALTH QUIZ
   ========================================================================== */
let currentQuizStep = 1;
const quizData = {};

function initTaxQuiz() {
  const optionCards = document.querySelectorAll('.quiz-option-card');
  const nextBtn = document.getElementById('quizNextBtn');
  const prevBtn = document.getElementById('quizPrevBtn');
  const progressFill = document.getElementById('quizProgressFill');

  if (!optionCards.length) return;

  optionCards.forEach(card => {
    card.addEventListener('click', () => {
      const step = card.closest('.quiz-step').dataset.step;
      const val = card.dataset.value;
      const key = card.dataset.key;

      // Unselect siblings
      card.closest('.quiz-options-grid').querySelectorAll('.quiz-option-card').forEach(c => {
        c.classList.remove('selected');
      });

      card.classList.add('selected');
      quizData[key] = val;

      if (nextBtn) nextBtn.disabled = false;
    });
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentQuizStep < 4) {
        document.querySelector(`.quiz-step[data-step="${currentQuizStep}"]`).classList.remove('active');
        currentQuizStep++;
        document.querySelector(`.quiz-step[data-step="${currentQuizStep}"]`).classList.add('active');

        // Update progress
        if (progressFill) progressFill.style.width = `${currentQuizStep * 25}%`;

        if (prevBtn) prevBtn.style.display = 'inline-flex';
        nextBtn.disabled = true;

        if (currentQuizStep === 4) {
          renderQuizResult();
        }
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentQuizStep > 1) {
        document.querySelector(`.quiz-step[data-step="${currentQuizStep}"]`).classList.remove('active');
        currentQuizStep--;
        document.querySelector(`.quiz-step[data-step="${currentQuizStep}"]`).classList.add('active');

        if (progressFill) progressFill.style.width = `${currentQuizStep * 25}%`;
        if (currentQuizStep === 1) prevBtn.style.display = 'none';
        nextBtn.disabled = false;
        nextBtn.style.display = 'inline-flex';
      }
    });
  }
}

function renderQuizResult() {
  const resultBox = document.getElementById('quizResultBox');
  const nextBtn = document.getElementById('quizNextBtn');
  const prevBtn = document.getElementById('quizPrevBtn');

  if (nextBtn) nextBtn.style.display = 'none';
  if (prevBtn) prevBtn.style.display = 'none';

  let recommendation = "";
  if (quizData.omset === 'gt_500m' || quizData.entity === 'pt_cv') {
    recommendation = "⭐ **Rekomendasi Optimal**: Usaha Anda cocok menggunakan **Paket Pajak UMKM Bulanan**. Kami Bantu Kelola e-Faktur, PPh Final 0.5%, & Pelaporan SPT Tanpa Denda!";
  } else {
    recommendation = "💡 **Rekomendasi Optimal**: Anda berhak memanfaatkan **Bebas Pajak s/d 500 Juta/thn (PP 55/2022)**. Cukup Lapor **SPT Tahunan Orang Pribadi** tepat waktu!";
  }

  if (resultBox) {
    resultBox.innerHTML = `
      <div style="text-align: center; padding: 1rem 0;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎉</div>
        <h3 style="font-size: 1.5rem; color: var(--neutral-dark); margin-bottom: 1rem;">Hasil Analisis Kesehatan Pajak Usaha Anda</h3>
        <div style="background: var(--secondary-teal-light); padding: 1.25rem; border-radius: var(--radius-md); text-align: left; margin-bottom: 1.5rem; border: 1px solid rgba(0, 168, 150, 0.2); color: var(--secondary-teal-dark);">
          ${recommendation}
        </div>
        <button class="btn btn-primary-wa" style="width: 100%;" onclick="openWaWithQuizData()">
          <i class="fab fa-whatsapp">
          Klaim Konsultasi Gratis Berdasarkan Hasil Quiz
        </button>
      </div>
    `;
  }
}

window.openWaWithQuizData = function() {
  const message = `Halo Optimal Konsultan, saya telah mengisi Quiz Kesehatan Pajak.%0A` +
    `- Status Usaha: ${quizData.entity || 'Belum PT/CV'}%0A` +
    `- Omset Bulanan: ${quizData.omset || 'Dalam pengembangan'}%0A` +
    `- Kendala Utama: ${quizData.kendala || 'Ingin paham pajak'}%0A` +
    `Mohon dibantu sesi konsultasi gratis 1-on-1 ya! Terima kasih.`;
  
  window.open(`https://wa.me/628123400008?text=${message}`, '_blank');
};

/* ==========================================================================
   7. CONSULTATION MODAL & WHATSAPP GENERATOR
   ========================================================================== */
function initConsultationModal() {
  const modalOverlay = document.getElementById('consultModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const modalForm = document.getElementById('modalConsultForm');

  window.openConsultModal = function(serviceName = '') {
    if (modalOverlay) {
      modalOverlay.classList.add('active');
      if (serviceName && document.getElementById('modalServiceInput')) {
        document.getElementById('modalServiceInput').value = serviceName;
      }
    }
  };

  if (closeBtn && modalOverlay) {
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nama = document.getElementById('modalNama').value;
      const usaha = document.getElementById('modalUsaha').value;
      const layanan = document.getElementById('modalServiceInput').value;
      const catatan = document.getElementById('modalCatatan').value;

      const waMsg = `Halo Optimal Konsultan,%0A` +
        `Saya *${nama}* dari *${usaha}*.%0A` +
        `Tertarik konsultasi gratis untuk layanan: *${layanan}*.%0A` +
        `Detail/Catatan: ${catatan || 'Mohon info langkah awal.'}%0A` +
        `Terima kasih!`;

      window.open(`https://wa.me/628123400008?text=${waMsg}`, '_blank');
      modalOverlay.classList.remove('active');
    });
  }
}

/* ==========================================================================
   8. FLOATING WHATSAPP CHAT WIDGET
   ========================================================================== */
function initWhatsAppWidget() {
  const waBtn = document.getElementById('waFloatBtn');
  
  if (waBtn) {
    waBtn.addEventListener('click', () => {
      const defaultText = encodeURIComponent('Halo Optimal Konsultan, saya ingin tanya-tanya tentang konsul pajak UMKM / PT / SPT Tahunan gratis 1 sesi.');
      window.open(`https://wa.me/628123400008?text=${defaultText}`, '_blank');
    });
  }
}
