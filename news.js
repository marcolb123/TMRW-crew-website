/* News rendering uses text nodes: event data never becomes executable markup. */
(function () {
  'use strict';
  const status = document.getElementById('news-status');
  const container = document.getElementById('event-sections');
  if (!container) return;
  const { element, renderEvent } = TMRWEvents;
  function render(events) {
    const groups = TMRWEvents.group(events);
    groups.upcoming = [...events].reverse().filter(event => groups.upcoming.includes(event) || groups.unconfirmed.includes(event));
    const fragment = document.createDocumentFragment();
    const sections = [
      ['upcoming', 'performances', 'Upcoming Events', 'No upcoming events are listed.'],
      ['regular', 'regular-classes', 'Regular Classes', 'No regular classes are listed.'],
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
      } else section.append(element('p', 'news-empty-state', empty));
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
