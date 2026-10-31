import test from 'node:test';
import assert from 'node:assert/strict';
import {apRoot,upesscRoot,zoologyRoot,zoologyUnits,zoologySyllabusUnits,notesCount,unitUrl,sectionUrl,noteUrl} from '../data/upessc.mjs';
import {makeUpesscPages} from '../components/upessc.mjs';
test('approved subsection counts and names remain unchanged',()=>{
 assert.equal(zoologySyllabusUnits.length,10);
 assert.deepEqual(zoologyUnits.map(u=>u.number),['02','06']);
 assert.deepEqual(zoologyUnits.map(u=>u.sections.length),[5,9]);
 assert.deepEqual(zoologyUnits.map(notesCount),[35,76]);
 assert.deepEqual(zoologyUnits[1].sections.map(s=>s.notes.length),[8,8,7,8,6,10,5,8,16]);
 assert.equal(zoologyUnits[0].sections[0].notes[0].title,'Membrane Models');
 assert.equal(zoologyUnits[1].sections[8].notes[15].title,'Stress and strain');
});
test('assistant professor subject cards, Zoology and UPESSC navigation',()=>{
 const pages=makeUpesscPages();
 const paths=pages.map(p=>p.path);
 assert.equal(new Set(paths).size,paths.length);
 assert.ok(paths.includes(apRoot));
 assert.ok(paths.includes(zoologyRoot));
 assert.ok(paths.includes(upesscRoot));
 assert.ok(paths.includes(unitUrl(zoologyUnits[1])));
 assert.ok(!paths.includes(unitUrl(zoologyUnits[0])));
 assert.ok(!paths.some(p=>p.includes('unit-02-cell-biology/')));
 const up=pages.find(p=>p.path===upesscRoot);
 assert.match(up.content,/Existing Cell Biology content/);
 assert.match(up.content,/Animal Physiology/);
});
test('each Unit 06 note has its own independent URL, with honest availability',()=>{
 const pages=makeUpesscPages(),unit=zoologyUnits[1];
 for(const section of unit.sections){
  assert.ok(pages.some(p=>p.path===sectionUrl(unit,section)));
  for(const note of section.notes){
   const p=pages.find(p=>p.path===noteUrl(unit,section,note));
   assert.ok(p,note.code);
   assert.equal(p.indexable,false);
   assert.match(p.content,/Outline prepared/);
  }
 }
});
