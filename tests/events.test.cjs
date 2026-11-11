const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { validate, group, today, safeUrl } = require('../events.js');
const data = JSON.parse(fs.readFileSync(require('node:path').join(__dirname, '../data/events.json'), 'utf8'));
const base = { title:'Test event', category:'performance', recurring:false, schedule:[], description:[], links:[], gallery:[], youtube:[], instagram:[], participants:[] };
const event = (id, overrides = {}) => ({ ...base, id, date: '2026-11-11', recurring: false, archived: false, ...overrides });
test('current event records validate and reference existing local cover images', () => {
  for (const e of validate(data)) {
    for (const src of [e.cover?.src, ...e.gallery]) {
      if (src && !/^(?:https?:)?\/\//.test(src)) assert.ok(fs.existsSync(require('node:path').join(__dirname, '..', decodeURIComponent(src))),src);
    }
  }
});
test('date boundaries and ranges show newest additions first', () => {
  const result = group([event('future', { date: '2026-12-01' }), event('today'), event('range', {date: '2026-11-01', endDate: '2026-11-11'}), event('old', {date:'2026-11-10'})], '2026-11-11');
  assert.deepEqual(result.upcoming.map(e => e.id), ['range', 'today', 'future']);
  assert.deepEqual(result.past.map(e => e.id), ['old']);
});
test('unknown dates, recurring classes, expired classes and announcements stay distinct', () => {
  const result = group([event('unknown', {date:null}), event('regular', {date:null, recurring:true}), event('expired', {recurring:true, endDate:'2026-11-10', date:'2026-01-01'}), event('notice', {category:'announcement'})], '2026-11-11');
  for (const [key, id] of [['unconfirmed','unknown'],['regular','regular'],['past','expired'],['announcements','notice']]) assert.equal(result[key][0].id,id);
});
test('reject impossible dates, reversed ranges and duplicate records', () => {
  for (const records of [[event('bad',{date:'2026-02-30'})],[event('bad',{endDate:'2026-01-01'})],[event('same'),event('same')]]) assert.throws(()=>validate({events:records}));
});
test('London midnight and daylight saving determine the calendar day', () => {
  assert.equal(today(new Date('2026-07-01T23:30:00Z')), '2026-07-02');
  assert.equal(today(new Date('2026-11-11T23:30:00Z')), '2026-11-11');
});
test('unsafe URL protocols are rejected', () => {
  assert.equal(safeUrl('javascript:alert(1)'),null);
  assert.equal(safeUrl('data:text/html,test'),null);
  assert.ok(safeUrl('contacts.html'));
});
test('explicit completion can archive an event whose date is unknown', () => {
  const result = group([event('completed', {date:null, status:'completed'})], '2026-11-11');
  assert.equal(result.past[0].id,'completed');
  assert.throws(()=>validate({events:[event('bad-status', {status:'invented'})]}));
});

test('manually archived records show newest additions first without inventing dates', () => {
  const records = [event('later', {date:'2026-12-01', archived:true}), event('unknown', {date:null, archived:true}), event('older', {date:'2025-01-01', archived:true})];
  assert.deepEqual(group(records, '2026-11-11').past.map(item=>item.id), ['older', 'unknown', 'later']);
  assert.throws(()=>validate({events:[event('bad-archive', {archived:'yes'})]}));
});
test('unpublished events remain stored but are excluded from public sections', () => {
  const records = validate({events:[event('draft', {published:false}),event('live')]});
  assert.equal(records.length,2);
  assert.deepEqual(group(records, '2026-11-11').upcoming.map(item=>item.id), ['live']);
  assert.throws(()=>validate({events:[event('bad',{published:'yes'})]}));
});

test('newly appended events appear first without changing stored record order', () => {
  const records=[event('first',{date:'2026-12-01'}),event('newest',{date:'2026-11-12'})];
  assert.equal(group(records,'2026-11-11').upcoming[0].id,'newest');
  assert.deepEqual(records.map(item=>item.id),['first','newest']);
});
