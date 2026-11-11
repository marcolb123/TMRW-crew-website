const { test } = require('node:test');
const assert = require('node:assert/strict');
const events = require('../events.js');
const media = require('../media.js');

test('minimal CMS event saves work without optional lists, dates, or booleans', () => {
  const source = {events:[{id:'cms-event',title:'Editor test',category:'workshop'}]};
  const records = events.validate(source);
  assert.equal(records[0].recurring,false);
  assert.equal(records[0].date,null);
  assert.deepEqual(records[0].links,[]);
  assert.deepEqual(records[0].gallery,[]);
  assert.equal(events.group(records).unconfirmed.length,1);
  assert.equal(source.events[0].links,undefined,'normalisation must not change stored content');
});
test('empty dates/statuses and optional cover alt text survive editor round trips', () => {
  const record=events.validate({events:[{id:'cms-event',title:'Editor test',category:'class',date:'',endDate:'',status:'',cover:{src:'uploads/example.webp'}}]})[0];
  assert.equal(record.date,null);
  assert.equal(record.cover.alt,'Editor test');
  assert.equal(record.status,undefined);
});
test('removing the final list entry can leave an empty JSON object', () => {
  assert.deepEqual(events.validate({}),[]);
  assert.deepEqual(media.validate({}),[]);
  assert.throws(()=>events.validate({typo:[]}));
  assert.throws(()=>media.validate({media:'invalid'}));
});
test('a photo needs only an uploaded image and no separate original URL', () => {
  const item=media.validate({media:[{id:'cms-photo',title:'Editor photo',type:'photo',provider:'local',thumbnail:'uploads/example.webp'}]})[0];
  assert.equal(item.url,'uploads/example.webp');
  assert.equal(item.featured,false);
});
test('invalid dates, malformed optional fields and duplicate IDs still fail', () => {
  const item={id:'cms-event',title:'Editor test',category:'workshop'};
  assert.throws(()=>events.validate({events:[{...item,date:'2026-02-30'}]}));
  assert.throws(()=>events.validate({events:[{...item,date:false}]}));
  assert.throws(()=>events.validate({events:[{...item,links:'wrong'}]}));
  assert.throws(()=>events.validate({events:[item,item]}));
  assert.throws(()=>media.validate({media:[{id:'cms-video',title:'Video',type:'video',provider:'youtube'}]}));
});
