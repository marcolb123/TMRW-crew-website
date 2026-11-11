/* News rendering uses text nodes: event data never becomes executable markup. */
(function () {
  'use strict';
  const status = document.getElementById('news-status');
  const container = document.getElementById('event-sections');
  if (!container) return;
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function renderEvent(event) {
    const card = element('article', 'news-card');
    card.id = `event-${event.id}`;
    const titleId = `${card.id}-title`;
    card.setAttribute('aria-labelledby', titleId);
    if (event.cover && TMRWEvents.safeUrl(event.cover.src)) {
      const media = element('div', 'card-media');
      const image = element('img', 'news-image');
      image.src = event.cover.src;
      image.alt = event.cover.alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      media.append(image);
      card.append(media);
    }
    const body = element('div', 'card-body');
    const heading = element('h3', 'news-title', event.title);
    heading.id = titleId;
    body.append(heading);
    if (event.date) {
      const date = element('time', 'news-date', event.date + (event.endDate ? ` – ${event.endDate}` : ''));
      date.dateTime = event.date;
      body.append(date);
    }
    if (event.location) body.append(element('p', 'news-date', event.location));
    for (const line of event.schedule) body.append(element('p', 'news-date', line));
    for (const field of ['dateNote', 'scheduleNote']) {
      if (event[field]) body.append(element('p', 'event-note', event[field]));
    }
    for (const paragraph of event.description) body.append(element('p', 'news-excerpt', paragraph));
    const controls = element('div', 'card-controls');
    for (const link of event.links) {
      if (!TMRWEvents.safeUrl(link.url)) continue;
      const anchor = element('a', 'tickets-btn', link.label);
      anchor.href = link.url;
      controls.append(anchor);
    }
    body.append(controls);
    card.append(body);
    return card;
  }
  function render(events) {
    const groups = TMRWEvents.group(events);
    const fragment = document.createDocumentFragment();
    const sections = [
      ['upcoming', 'performances', 'Upcoming Events', 'No upcoming dated events are listed.'],
      ['regular', 'regular-classes', 'Regular Classes', 'No regular classes are listed.'],
      ['unconfirmed', 'popup-classes', 'Dates to Confirm', 'No events awaiting dates.'],
      ['announcements', 'announcements', 'Crew Announcements', 'No announcements are listed.'],
      ['past', 'past-events', 'Past Events', 'No past dated events are listed.']
    ];
    for (const [key, id, title, empty] of sections) {
      const section = element('section', 'news-section');
      section.id = id;
      const heading = element('h2', 'section-title', title);
      heading.id = `${id}-heading`;
      section.setAttribute('aria-labelledby', heading.id);
      section.append(heading);
      if (groups[key].length) {
        const grid = element('div', 'news-grid');
        groups[key].forEach(event => grid.append(renderEvent(event)));
        section.append(grid);
      } else section.append(element('p', '', empty));
      fragment.append(section);
    }
    container.replaceChildren(fragment);
    status.textContent = '';
    // Resolve existing section/event deep links after asynchronous rendering.
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView();
  }
  fetch('data/events.json')
    .then(response => {
      if (!response.ok) throw new Error('Unable to load events.');
      return response.json();
    })
    .then(data => render(TMRWEvents.validate(data)))
    .catch(error => {
      console.error('News could not load:', error);
      status.textContent = 'Event listings could not be loaded. Please reload the page or contact us for details.';
      const link = element('a', '', 'Contact TMRW Crew');
      link.href = 'contacts.html';
      status.append(' ', link);
    });
})();
