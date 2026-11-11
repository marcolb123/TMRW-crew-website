(function () {
  'use strict';
  const container = document.getElementById('archive-events');
  const status = document.getElementById('archive-status');
  const filter = document.getElementById('archive-category');
  let events = [];
  function render() {
    const selected = events.filter(event => filter.value === 'all' || event.category === filter.value);
    container.replaceChildren(...selected.map(event => TMRWEvents.renderEvent(event, true)));
    status.textContent = selected.length ? `${selected.length} archived event${selected.length === 1 ? '' : 's'}.` : 'No confirmed dated or completed events are available in this category yet. Listings with uncertain dates remain on News.';
  }
  fetch('data/events.json')
    .then(response => {
      if (!response.ok) throw new Error('Unable to load archive.');
      return response.json();
    })
    .then(data => {
      events = TMRWEvents.group(TMRWEvents.validate(data)).past;
      filter.disabled = false;
      filter.addEventListener('change', render);
      render();
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    })
    .catch(error => {
      console.error('Archive could not load:', error);
      status.textContent = 'The archive could not be loaded. Please reload or contact us for details.';
    });
})();
