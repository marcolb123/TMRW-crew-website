/* Data validation and supported video URLs, shared with dependency-free tests. */
(function (root) {
  'use strict';
  function embedUrl(item) {
    try {
      const url = new URL(item.url);
      if (url.protocol !== 'https:') return null;
      if (item.provider === 'google-drive' && url.hostname === 'drive.google.com') {
        const match = url.pathname.match(/^\/file\/d\/([\w-]+)\/(?:view|preview)$/);
        return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
      }
      if (item.provider === 'youtube') {
        let id;
        if (url.hostname === 'youtu.be') id = url.pathname.slice(1);
        else if (['youtube.com', 'www.youtube.com'].includes(url.hostname)) {
          id = url.pathname === '/watch' ? url.searchParams.get('v') : url.pathname.match(/^\/(?:shorts|embed)\/([\w-]+)$/)?.[1];
        }
        return /^[\w-]{11}$/.test(id || '') ? `https://www.youtube-nocookie.com/embed/${id}` : null;
      }
    } catch { /* Unsupported URLs remain ordinary links. */ }
    return null;
  }
  function validate(data) {
    if (!data || !Array.isArray(data.media)) throw new Error('Expected media array.');
    const ids = new Set();
    for (const item of data.media) {
      if (!item || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) || ids.has(item.id) ||
          typeof item.title !== 'string' || !item.title.trim() ||
          !['photo', 'video'].includes(item.type) || typeof item.featured !== 'boolean' ||
          !['local', 'google-drive', 'youtube', 'instagram'].includes(item.provider) ||
          typeof item.url !== 'string' || !item.url ||
          (item.thumbnail != null && typeof item.thumbnail !== 'string') ||
          (item.eventId != null && typeof item.eventId !== 'string') ||
          (item.category != null && !['performance', 'battle', 'workshop'].includes(item.category))) throw new Error('Invalid media record.');
      if ((item.type === 'photo') !== (item.provider === 'local')) throw new Error('Invalid format/provider combination.');
      if (['google-drive', 'youtube'].includes(item.provider) && !embedUrl(item)) throw new Error('Invalid video URL.');
      if (item.provider === 'instagram') {
        const url = new URL(item.url);
        if (url.protocol !== 'https:' || !['instagram.com', 'www.instagram.com'].includes(url.hostname)) throw new Error('Invalid Instagram URL.');
      }
      ids.add(item.id);
    }
    return data.media;
  }
  const api = { validate, embedUrl };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TMRWMedia = api;
})(typeof window === 'undefined' ? globalThis : window);
