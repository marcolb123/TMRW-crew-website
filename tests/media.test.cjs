const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { validate, embedUrl } = require('../media.js');
const data = require('../data/media.json');
test('all original portfolio media have valid records and local files', () => {
  assert.equal(validate(data).length, 8);
  assert.equal(data.media.filter(item => item.type === 'photo').length, 5);
  for (const item of data.media) assert.ok(fs.existsSync(path.join(__dirname, '..', item.thumbnail)));
});
test('only expected video hosts and video IDs can be embedded', () => {
  assert.ok(embedUrl(data.media[0]).startsWith('https://drive.google.com/file/d/'));
  for (const url of ['https://youtu.be/abcdefghijk', 'https://www.youtube.com/watch?v=abcdefghijk', 'https://youtube.com/shorts/abcdefghijk']) {
    assert.equal(embedUrl({provider:'youtube',url}),'https://www.youtube-nocookie.com/embed/abcdefghijk');
  }
  for (const url of ['https://evil.example/watch?v=abcdefghijk','javascript:alert(1)','https://youtube.com/watch?v=short']) assert.equal(embedUrl({provider:'youtube',url}),null);
  assert.equal(embedUrl({provider:'google-drive',url:'https://evil.example/file/d/test/view'}),null);
});
test('duplicate identities and invalid provider/URL combinations fail validation', () => {
  assert.throws(()=>validate({media:[data.media[0],data.media[0]]}));
  assert.throws(()=>validate({media:[{...data.media[0],provider:'instagram',url:'https://evil.example'}]}));
  assert.throws(()=>validate({media:[{...data.media[0],provider:'local'}]}));
});
