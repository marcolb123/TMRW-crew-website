(function () {
  'use strict';
  const { element, safeUrl } = TMRWEvents;
  const status = document.getElementById('media-status');
  const container = document.getElementById('media-sections');
  const dialog = document.getElementById('videoModal');
  const player = document.getElementById('video-player');
  let items = [];
  dialog.addEventListener('close', () => player.replaceChildren());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  function play(item) {
    const src = TMRWMedia.embedUrl(item);
    if (!src) return;
    const frame = element('iframe');
    frame.src = src;
    frame.title = item.title;
    frame.allow = 'fullscreen; autoplay; encrypted-media; picture-in-picture';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    document.getElementById('video-title').textContent = item.title;
    player.replaceChildren(frame);
    dialog.showModal();
  }
  function card(item) {
    const article = element('article', 'media-card');
    const image = item.thumbnail && safeUrl(item.thumbnail) ? element('img') : null;
    if (image) {
      image.src = item.thumbnail;
      if (item.width && item.height) { image.width = item.width; image.height = item.height; }
      image.alt = ''; // The adjacent title labels the same content.
      image.loading = 'lazy';
      image.decoding = 'async';
    }
    const link = element('a');
    link.href = item.url;
    if (image) link.append(image);
    link.append(element('h3', '', item.title));
    article.append(link);
    if (TMRWMedia.embedUrl(item)) {
      const button = element('button', 'tickets-btn', `Play ${item.title}`);
      button.addEventListener('click', () => play(item));
      article.append(button);
    }
    return article;
  }
  function photography(photos) {
    const wrapper = element('div', 'photo-slideshow');
    wrapper.setAttribute('aria-label', 'Crew photography slideshow');
    const image = element('img');
    image.id = 'slideshow-image';
    image.loading = 'lazy';
    image.decoding = 'async';
    const fullSize = element('a');
    fullSize.append(image);
    const caption = element('p');
    caption.setAttribute('aria-live', 'polite');
    const controls = element('div', 'photo-controls');
    const previous = element('button', '', 'Previous photo');
    previous.id = 'prevBtn';
    const next = element('button', '', 'Next photo');
    next.id = 'nextBtn';
    const dots = element('div', 'slideshow-dots');
    const buttons = [];
    let current = 0;
    function show(index) {
      current = (index + photos.length) % photos.length;
      image.src = photos[current].thumbnail || photos[current].url;
      fullSize.href = photos[current].url;
      fullSize.setAttribute('aria-label', `Open original ${photos[current].title}`);
      if (photos[current].width && photos[current].height) { image.width = photos[current].width; image.height = photos[current].height; }
      image.alt = photos[current].title;
      caption.textContent = `${photos[current].title} (${current + 1} of ${photos.length})`;
      buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
    }
    photos.forEach((photo, index) => {
      const button = element('button', 'slideshow-dot');
      button.setAttribute('aria-label', `Show ${photo.title}`);
      button.addEventListener('click', () => show(index));
      buttons.push(button);
      dots.append(button);
    });
    previous.addEventListener('click', () => show(current - 1));
    next.addEventListener('click', () => show(current + 1));
    previous.disabled = next.disabled = photos.length < 2;
    controls.append(previous, next);
    wrapper.append(fullSize, caption, controls, dots);
    show(0);
    return wrapper;
  }
  function render() {
    const fragment = document.createDocumentFragment();
    const sections = [
      ['videos', 'Videos', item => item.type === 'video'],
      ['photos', 'Photos', item => item.type === 'photo']
    ];
    for (const [id, title, matches] of sections) {
      const section = element('section');
      section.id = id;
      const heading = element('h2', 'section-title', title);
      heading.id = `${id}-heading`;
      section.setAttribute('aria-labelledby', heading.id);
      section.append(heading);
      const records = items.filter(matches);
      if (!records.length) section.append(element('p', '', 'No media listed yet.'));
      else if (id === 'photos') section.append(photography(records));
      else {
        const grid = element('div', 'media-grid');
        grid.append(...records.map(card));
        section.append(grid);
      }
      fragment.append(section);
    }
    container.replaceChildren(fragment);
    status.textContent = '';
  }
  fetch('data/media.json').then(response => {
    if (!response.ok) throw new Error('Unable to load media.');
    return response.json();
  }).then(data => {
    items = TMRWMedia.validate(data);
    if (items.some(item => !safeUrl(item.url) || (item.thumbnail && !safeUrl(item.thumbnail)))) throw new Error('Unsupported media URL.');
    render();
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  }).catch(error => {
    console.error('Media could not load:', error);
    status.textContent = 'Media could not be loaded. Please reload or visit TMRW Crew on Instagram.';
  });
})();
