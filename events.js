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
      if (event.category === 'announcement') key = 'announcements';
      else if (event.recurring) key = event.endDate && event.endDate < day ? 'past' : 'regular';
      else if (!event.date) key = 'unconfirmed';
      else key = (event.endDate || event.date) < day ? 'past' : 'upcoming';
      groups[key].push(event);
    }
    groups.upcoming.sort((a, b) => a.date.localeCompare(b.date));
    groups.past.sort((a, b) => (b.endDate || b.date).localeCompare(a.endDate || a.date));
    return groups;
  }
  function safeUrl(value) {
    try {
      const url = new URL(value, 'https://tmrwcrew.com/');
      return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
    } catch { return null; }
  }
  const api = { validate, group, today, safeUrl };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TMRWEvents = api;
})(typeof window === 'undefined' ? globalThis : window);
