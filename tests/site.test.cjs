const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const pages = ['index.html','team.html','News.html','Portfolio.html','contacts.html','archive.html'];
const read = name => fs.readFileSync(path.join(root,name),'utf8').replace(/<!--[\s\S]*?-->/g,'');
function localTarget(url) {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(url)) return null;
  return decodeURIComponent(url.split(/[?#]/)[0].replace(/&amp;/g,'&'));
}
test('all published pages have working local assets, scripts and navigation links', () => {
  for (const page of pages) {
    const source = read(page);
    for (const match of source.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const target = localTarget(match[1]);
      if (target) assert.ok(fs.existsSync(path.join(root,target)),`${page}: missing ${target}`);
    }
    const scripts = [...source.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(new Set(scripts).size,scripts.length,`${page}: duplicate script`);
    assert.equal((source.match(/<h1\b/g)||[]).length,1,`${page}: expected one main heading`);
    assert.ok(source.includes('class="skip-link"'),`${page}: missing skip link`);
    const nav=source.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/)[1];
    assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m=>m[1]),['index.html','team.html','News.html','Portfolio.html','archive.html','contacts.html']);
    assert.equal((nav.match(/aria-current="page"/g)||[]).length,1,`${page}: active navigation`);
    assert.ok(new RegExp(`href="${page.replace('.','\\.')}"[^>]*aria-current="page"`).test(nav));
    assert.ok(!source.includes('YOUR_BING_VERIFICATION_CODE'));
  }
});
test('all stylesheet asset paths exist', () => {
  for (const match of read('tmrw.css').matchAll(/url\(['"]?([^'")]+)['"]?\)/g)) {
    const target=localTarget(match[1]);
    if(target) assert.ok(fs.existsSync(path.join(root,target)),`Missing CSS asset ${target}`);
  }
});
test('optional intrinsic dimensions are positive integers when supplied', () => {
  const covers=require('../data/events.json').events?.map(event=>event.cover).filter(Boolean) || [];
  const thumbnails=require('../data/media.json').media || [];
  for(const image of [...covers,...thumbnails]) {
    for(const key of ['width','height']) {
      if (image[key] != null) assert.ok(Number.isInteger(image[key])&&image[key]>0);
    }
  }
});
