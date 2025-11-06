// Central site JS for small interactions (video modal + slideshow)
// This file replaces inline scripts previously in `Portfolio.html`.

function openVideo(fileId) {
  const modal = document.getElementById('videoModal');
  const frame = document.getElementById('videoFrame');
  if (!modal || !frame) return;
  frame.src = `https://drive.google.com/file/d/${fileId}/preview`;
  modal.style.display = 'block';
}

function closeVideo() {
  const modal = document.getElementById('videoModal');
  const frame = document.getElementById('videoFrame');
  if (!modal || !frame) return;
  frame.src = '';
  modal.style.display = 'none';
}

// Slideshow data and functions
const _tmrw_photos = [
  'media/header.png',
  'tmrw crew/crew photo.jpg',
  'media/elevate 2.png',
  'media/shok spinning.png',
  'media/needle 1.png'
];
let _tmrw_currentSlide = 0;

// Workshop slideshow data (point to your events folder images here)
const _tmrw_workshop_photos = [
  'events/2. Page 2.png',
  'events/3. Shok Page 3.png',
  'events/4. WAAKING page 4.png',
  'events/9. OSC & LEI.png',
  'events/6. HIP HOP Nevil.png',
  'events/7. REGGAETON Leila.png'
];
let _tmrw_currentWorkshopSlide = 0;

function _tmrw_showSlide(index) {
  const img = document.getElementById('slideshow-image');
  const dots = document.getElementById('slideshow-dots');
  if (!img) return;
  if (index < 0) _tmrw_currentSlide = _tmrw_photos.length - 1;
  else if (index >= _tmrw_photos.length) _tmrw_currentSlide = 0;
  else _tmrw_currentSlide = index;
  img.src = _tmrw_photos[_tmrw_currentSlide];

  if (dots) {
    dots.innerHTML = '';
    for (let i = 0; i < _tmrw_photos.length; i++) {
      const dot = document.createElement('span');
      dot.style.display = 'inline-block';
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.margin = '0 4px';
      dot.style.borderRadius = '50%';
      dot.style.background = i === _tmrw_currentSlide ? '#333' : '#bbb';
      dot.style.cursor = 'pointer';
      dot.onclick = () => _tmrw_showSlide(i);
      dots.appendChild(dot);
    }
  }
}

function _tmrw_changeSlide(n) {
  _tmrw_showSlide(_tmrw_currentSlide + n);
}

// Workshop slideshow functions
function _tmrw_showWorkshopSlide(index) {
  const img = document.getElementById('workshop-slideshow-image');
  const dots = document.getElementById('workshop-slideshow-dots');
  if (!img) return;
  if (index < 0) _tmrw_currentWorkshopSlide = _tmrw_workshop_photos.length - 1;
  else if (index >= _tmrw_workshop_photos.length) _tmrw_currentWorkshopSlide = 0;
  else _tmrw_currentWorkshopSlide = index;
  img.src = _tmrw_workshop_photos[_tmrw_currentWorkshopSlide];

  if (dots) {
    dots.innerHTML = '';
    for (let i = 0; i < _tmrw_workshop_photos.length; i++) {
      const dot = document.createElement('span');
      dot.style.display = 'inline-block';
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.margin = '0 4px';
      dot.style.borderRadius = '50%';
      dot.style.background = i === _tmrw_currentWorkshopSlide ? '#333' : '#bbb';
      dot.style.cursor = 'pointer';
      dot.onclick = () => _tmrw_showWorkshopSlide(i);
      dots.appendChild(dot);
    }
  }
}

function _tmrw_changeWorkshopSlide(n) {
  _tmrw_showWorkshopSlide(_tmrw_currentWorkshopSlide + n);
}

// Back to Top Button
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Show/hide back to top button based on scroll position
function toggleBackToTopButton() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }
}

// Wire up event listeners on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  // Video anchors: <a data-fileid="..."> inside .video-thumbnail-container
  const anchors = document.querySelectorAll('.video-thumbnail-container a[data-fileid]');
  anchors.forEach(a => {
    a.addEventListener('click', function (ev) {
      ev.preventDefault();
      const id = a.getAttribute('data-fileid');
      if (id) openVideo(id);
    });
  });

  // Close button for video modal
  const closeBtn = document.querySelector('.video-frame .close');
  if (closeBtn) closeBtn.addEventListener('click', closeVideo);

  // Prev/next slideshow buttons (if present) – they call changeSlide via window-scoped names for inline attributes
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  if (prevBtn) prevBtn.addEventListener('click', function (ev) { ev.preventDefault(); _tmrw_changeSlide(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function (ev) { ev.preventDefault(); _tmrw_changeSlide(1); });

  // Initialize slideshow
  _tmrw_showSlide(0);
  
  // Initialize workshop slideshow if present
  if (document.getElementById('workshop-slideshow-image')) {
    _tmrw_showWorkshopSlide(0);
  }

  // Add scroll event listener for back to top button
  window.addEventListener('scroll', toggleBackToTopButton);

  // Add smooth scrolling for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
});

// Export names for possible inline usage (not required but safe)
window.openVideo = openVideo;
window.closeVideo = closeVideo;
window.changeSlide = _tmrw_changeSlide;
window.changeWorkshopSlide = _tmrw_changeWorkshopSlide;
window.scrollToTop = scrollToTop;

(function () {
  const backBtn = document.getElementById('backToTopBtn');

  // Smooth scroll to top
  window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle visibility of back-to-top button
  function onScroll() {
    if (!backBtn) return;
    backBtn.style.display = (window.scrollY > 300) ? 'flex' : 'none';
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // run once on load
  onScroll();
})();