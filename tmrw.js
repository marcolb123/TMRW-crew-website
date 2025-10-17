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
});

// Export names for possible inline usage (not required but safe)
window.openVideo = openVideo;
window.closeVideo = closeVideo;
window.changeSlide = _tmrw_changeSlide;
