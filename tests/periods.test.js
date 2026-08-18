const assert = require('node:assert/strict');

const pad = (n) => String(n).padStart(2, '0');
function validDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s || '')) return false;
  const [y, m, d] = s.split('-').map(Number);
  const x = new Date(y, m - 1, d);
  return Number.isFinite(x.getTime()) && x.getFullYear() === y && x.getMonth() === m - 1 && x.getDate() === d;
}
function parseDate(s) { if (!validDate(s)) return null; const [y,m,d]=s.split('-').map(Number); return new Date(y,m-1,d); }
function dateString(d) { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function startOfWeek(s) { const d=parseDate(s),x=new Date(d); x.setDate(x.getDate()-((x.getDay()+6)%7)); return dateString(x); }
function endOfWeek(s) { const x=parseDate(startOfWeek(s)); x.setDate(x.getDate()+6); return dateString(x); }
function monthBounds(s) { const d=parseDate(s); return [dateString(new Date(d.getFullYear(),d.getMonth(),1)),dateString(new Date(d.getFullYear(),d.getMonth()+1,0))]; }
function inRange(date, from, to) { return validDate(date) && validDate(from) && validDate(to) && from <= to && date >= from && date <= to; }

assert.equal(validDate('2026-08-18'), true);
assert.equal(validDate('2026-02-31'), false);
assert.equal(startOfWeek('2026-08-18'), '2026-08-17');
assert.equal(endOfWeek('2026-08-18'), '2026-08-23');
assert.deepEqual(monthBounds('2026-02-10'), ['2026-02-01','2026-02-28']);
assert.equal(inRange('2026-05-01','2026-03-15','2026-08-18'), true);
assert.equal(inRange('2026-03-14','2026-03-15','2026-08-18'), false);
assert.equal(inRange('2026-05-01','2026-08-18','2026-03-15'), false);

console.log('period/date tests passed');
