(function () {
  'use strict';
  const container = document.getElementById('archive-events');
  const status = document.getElementById('archive-status');
  fetch('data/events.json')
    .then(response => {
      if (!response.ok) throw new Error('Unable to load archive.');
      return response.json();
    })
    .then(data => {
      const events = TMRWEvents.group(TMRWEvents.validate(data)).past;
      container.replaceChildren(...events.map(event => TMRWEvents.renderEvent(event, true)));
      status.textContent = events.length ? '' : 'No archived events are listed yet.';
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) target.scrollIntoView();
    })
    .catch(error => {
      console.error('Archive could not load:', error);
      status.textContent = 'The archive could not be loaded. Please reload or contact us for details.';
    });
})();
