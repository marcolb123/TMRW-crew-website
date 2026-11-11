/* Shared event data rules; dates are calendar days in Europe/London. */
(function (root) {
  'use strict';
  const categories = ['performance', 'battle', 'workshop', 'class', 'announcement'];
  function isDate(value) {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  }
  function today(now = new Date()) {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
    const get = type => parts.find(part => part.type === type).value;
    return `${get('year')}-${get('month')}-${get('day')}`;
  }
  function validate(data) {
    if (!data || !Array.isArray(data.events)) throw new Error('Expected an events array.');
    const ids = new Set();
    for (const event of data.events) {
      if (!event || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(event.id) || ids.has(event.id) ||
          typeof event.title !== 'string' || !event.title.trim() || !categories.includes(event.category) ||
          typeof event.recurring !== 'boolean') throw new Error('Invalid event identity or category.');
      ids.add(event.id);
      if (event.status != null && !['scheduled', 'completed', 'cancelled'].includes(event.status)) throw new Error('Invalid status.');
      for (const field of ['date', 'endDate']) {
        if (event[field] != null && !isDate(event[field])) throw new Error(`Invalid ${field}: ${event.id}`);
      }
      if (event.endDate && (!event.date || event.endDate < event.date)) throw new Error('Invalid date range.');
      for (const field of ['schedule', 'description', 'gallery', 'youtube', 'instagram', 'participants']) {
        if (!Array.isArray(event[field]) || !event[field].every(item => typeof item === 'string')) throw new Error(`Invalid ${field}.`);
      }
      if (!Array.isArray(event.links) || !event.links.every(link => link && typeof link.label === 'string' && typeof link.url === 'string')) throw new Error('Invalid links.');
      if (event.cover && (typeof event.cover.src !== 'string' || typeof event.cover.alt !== 'string')) throw new Error('Invalid cover.');
    }
    return data.events;
  }
  function group(events, day = today()) {
    const groups = { upcoming: [], past: [], regular: [], announcements: [], unconfirmed: [] };
    for (const event of events) {
      let key;
      if (event.status === 'completed') key = 'past';
      else if (event.category === 'announcement') key = 'announcements';
      else if (event.recurring) key = event.endDate && event.endDate < day ? 'past' : 'regular';
      else if (!event.date) key = 'unconfirmed';
      else key = (event.endDate || event.date) < day ? 'past' : 'upcoming';
      groups[key].push(event);
    }
    groups.upcoming.sort((a, b) => a.date.localeCompare(b.date));
    groups.past.sort((a, b) => (b.endDate || b.date || '').localeCompare(a.endDate || a.date || ''));
    return groups;
  }
  function safeUrl(value) {
    try {
      const url = new URL(value, 'https://tmrwcrew.com/');
      return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
    } catch { return null; }
  }
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function renderEvent(event, details = false) {
    const card = element('article', 'news-card');
    card.id = `event-${event.id}`;
    const titleId = `${card.id}-title`;
    card.setAttribute('aria-labelledby', titleId);
    if (event.cover && safeUrl(event.cover.src)) {
      const media = element('div', 'card-media');
      const image = element('img', 'news-image');
      image.src = event.cover.src;
      image.alt = event.cover.alt;
      if (event.cover.width && event.cover.height) { image.width = event.cover.width; image.height = event.cover.height; }
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
      if (!safeUrl(link.url)) continue;
      const anchor = element('a', 'tickets-btn', link.label);
      anchor.href = link.url;
      controls.append(anchor);
    }
    if (event.status) body.append(element('p', 'news-date', event.status[0].toUpperCase() + event.status.slice(1)));
    if (details) {
      if (event.participants.length) body.append(element('p', '', `Participants / collaborators: ${event.participants.join(', ')}`));
      if (event.gallery.length) {
        const gallery = element('div', 'event-gallery');
        event.gallery.forEach((src, index) => {
          if (!safeUrl(src)) return;
          const link = element('a');
          link.href = src;
          const image = element('img');
          image.src = src;
          image.alt = `${event.title} — photo ${index + 1}`;
          image.loading = 'lazy';
          image.decoding = 'async';
          link.append(image);
          gallery.append(link);
        });
        body.append(gallery);
      }
      for (const [field, label] of [['youtube', 'YouTube'], ['instagram', 'Instagram']]) {
        event[field].forEach((url, index) => {
          if (!safeUrl(url)) return;
          const link = element('a', 'tickets-btn', `${label} ${index + 1}`);
          link.href = url;
          controls.append(link);
        });
      }
    }
    body.append(controls);
    card.append(body);
    return card;
  }
  const api = { validate, group, today, safeUrl, renderEvent, element };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TMRWEvents = api;
})(typeof window === 'undefined' ? globalThis : window);
