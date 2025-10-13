// Video Modal Functions
function openVideo(fileId) {
  const modal = document.getElementById("videoModal");
  const frame = document.getElementById("videoFrame");
  frame.src = `https://drive.google.com/file/d/${fileId}/preview`;
  modal.style.display = "block";
}

function closeVideo() {
  const modal = document.getElementById("videoModal");
  const frame = document.getElementById("videoFrame");
  frame.src = "";
  modal.style.display = "none";
}

// Slideshow logic
const photos = [
  "media/header.png",
  "tmrw crew/crew photo.jpg",
  "media/elevate 2.png",
  "media/shok spinning.png",
  "media/needle 1.png"
];
let currentSlide = 0;

function showSlide(index) {
  const img = document.getElementById('slideshow-image');
  const dots = document.getElementById('slideshow-dots');
  if (index < 0) currentSlide = photos.length - 1;
  else if (index >= photos.length) currentSlide = 0;
  else currentSlide = index;
  img.src = photos[currentSlide];

  // Dots
  if (dots) {
    dots.innerHTML = '';
    for (let i = 0; i < photos.length; i++) {
      const dot = document.createElement('span');
      dot.style.display = 'inline-block';
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.margin = '0 4px';
      dot.style.borderRadius = '50%';
      dot.style.background = i === currentSlide ? '#333' : '#bbb';
      dot.style.cursor = 'pointer';
      dot.onclick = () => showSlide(i);
      dots.appendChild(dot);
    }
  }
}

function changeSlide(n) {
  showSlide(currentSlide + n);
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

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize slideshow if elements exist
  const slideshowImage = document.getElementById('slideshow-image');
  if (slideshowImage) {
    showSlide(0);
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
