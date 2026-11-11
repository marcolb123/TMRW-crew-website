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
  function thumbnailUrl(item) {
    if (item.thumbnail) return item.thumbnail;
    if (item.provider !== 'youtube') return null;
    const embed = embedUrl(item);
    if (!embed) return null;
    const id = embed.split('/').pop();
    return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }
  function validate(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Expected a media object.');
    const records = data.media === undefined && Object.keys(data).length === 0 ? [] : data.media;
    if (!Array.isArray(records)) throw new Error('Expected media array.');
    const media = records.map(item => {
      if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error('Invalid media.');
      const normalized = { featured: false, ...item };
      if (normalized.category === '') delete normalized.category;
      if (normalized.type === 'photo' && !normalized.url) normalized.url = normalized.thumbnail;
      return normalized;
    });
    const ids = new Set();
    for (const item of media) {
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
      if (item.published != null && typeof item.published !== 'boolean') throw new Error('Invalid published flag.');
      ids.add(item.id);
    }
    return media;
  }
  const api = { validate, embedUrl, thumbnailUrl };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.TMRWMedia = api;
})(typeof window === 'undefined' ? globalThis : window);
