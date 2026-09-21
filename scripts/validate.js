// Validates data/updates.js against the taxonomy in index.html and regenerates data/updates.json.
// Run: node scripts/validate.js
const fs = require('fs'); const vm = require('vm'); const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'data/updates.js'), 'utf8'), ctx);
const D = ctx.window.AUTODESK_UPDATES;
if (!Array.isArray(D)) { console.error('data/updates.js must set window.AUTODESK_UPDATES to an array'); process.exit(1); }
const roleIds = [...html.matchAll(/\{id:'([a-z0-9-]+)', label:'[^']+', group:'/g)].map(m => m[1]);
const outIds = [...html.matchAll(/\{id:'([a-z-]+)', label:'[^']+'\}/g)].map(m => m[1]).filter(x => !['aec','dm','me'].includes(x));
const statIds = ['released','announced','preview','coming','strategic'];
const acts = ['Explore','Enable','Pilot','Discuss with Autodesk','Share with BIM team','Share with IT','Evaluate workflow','Watch demo','Read release notes'];
const errs = []; const ids = new Set();
for (const u of D) {
  if (!u.id || !u.title) { errs.push('entry without id/title'); continue; }
  if (ids.has(u.id)) errs.push(`duplicate id ${u.id}`); ids.add(u.id);
  if (!u.industries?.length) errs.push(`${u.id}: no industries`);
  for (const i of u.industries || []) if (!['aec','dm','me'].includes(i)) errs.push(`${u.id}: unknown industry ${i}`);
  for (const r of [...(u.personas?.primary || []), ...(u.personas?.secondary || [])]) if (!roleIds.includes(r)) errs.push(`${u.id}: unknown role ${r}`);
  for (const o of u.businessOutcomes || []) if (!outIds.includes(o)) errs.push(`${u.id}: unknown outcome ${o}`);
  if (!statIds.includes(u.releaseStatus)) errs.push(`${u.id}: unknown releaseStatus ${u.releaseStatus}`);
  if (!acts.includes(u.recommendedAction)) errs.push(`${u.id}: unknown recommendedAction ${u.recommendedAction}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(u.releaseDate || '')) errs.push(`${u.id}: releaseDate must be YYYY-MM-DD`);
  if (!/^https:\/\/([a-z0-9-]+\.)*autodesk\.com\//.test(u.sourceUrl || '')) errs.push(`${u.id}: sourceUrl should be an official autodesk.com URL`);
  for (const k of ['summary','whatsNew','whyItMatters']) if (!u[k] || u[k].length < 40) errs.push(`${u.id}: ${k} is missing or too short`);
  if (u.customerSafe !== true) errs.push(`${u.id}: customerSafe is not true (entry will be hidden)`);
}
console.log(`${D.length} updates · ${D.filter(u => u.featured).length} featured · ${D.filter(u => u.ai).length} AI`);
if (errs.length) { console.error(errs.join('\n')); process.exit(1); }
fs.writeFileSync(path.join(root, 'data/updates.json'), JSON.stringify(D, null, 2));
console.log('OK — data/updates.json regenerated');
