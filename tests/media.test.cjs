const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { validate, embedUrl } = require('../media.js');
const data = require('../data/media.json');
const base = { id:'test-video', title:'Test video', type:'video', provider:'google-drive', url:'https://drive.google.com/file/d/test/view', featured:false };
test('current media records validate and reference existing local images', () => {
  for (const item of validate(data)) {
    for (const src of [item.thumbnail, ...(item.type === 'photo' ? [item.url] : [])]) {
      if (src && !/^https?:\/\//.test(src)) assert.ok(fs.existsSync(path.join(__dirname, '..', src)),src);
    }
  }
});
test('only expected video hosts and video IDs can be embedded', () => {
  assert.ok(embedUrl(base).startsWith('https://drive.google.com/file/d/'));
  for (const url of ['https://youtu.be/abcdefghijk', 'https://www.youtube.com/watch?v=abcdefghijk', 'https://youtube.com/shorts/abcdefghijk']) {
    assert.equal(embedUrl({provider:'youtube',url}),'https://www.youtube-nocookie.com/embed/abcdefghijk');
  }
  for (const url of ['https://evil.example/watch?v=abcdefghijk','javascript:alert(1)','https://youtube.com/watch?v=short']) assert.equal(embedUrl({provider:'youtube',url}),null);
  assert.equal(embedUrl({provider:'google-drive',url:'https://evil.example/file/d/test/view'}),null);
});
test('duplicate identities and invalid provider/URL combinations fail validation', () => {
  assert.throws(()=>validate({media:[base,base]}));
  assert.throws(()=>validate({media:[{...base,provider:'instagram',url:'https://evil.example'}]}));
  assert.throws(()=>validate({media:[{...base,provider:'local'}]}));
});
