import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {ecologyRoot,ecologySections,ecologyNotes,ecologyA1,ecologyA2} from '../data/ecology.mjs';
import {catalog} from '../data/catalog.mjs';
import {concepts} from '../js/concepts.mjs';
import {sanitiseLearning,searchCatalog} from '../js/model.mjs';

test('Ecology has the agreed 12-section, 63-note teaching outline and honest availability',()=>{
 assert.equal(ecologySections.length,12);
 assert.deepEqual(ecologySections.map(s=>s.notes.length),[5,4,8,6,6,3,8,3,4,6,3,7]);
 assert.equal(ecologyNotes.length,63);
 assert.equal(new Set(ecologyNotes.map(n=>n.url)).size,63);
 assert.deepEqual(ecologyNotes.filter(n=>n.available).map(n=>n.id),['A1','A2','A3']);
 assert.equal(concepts['ecology-levels-of-organisation'].url,ecologyA1.url);
});

test('Ecology search and learning data stay in the correct exam and concept',()=>{
 assert.deepEqual(searchCatalog(catalog,{query:'ecology',mode:'exams',scope:'csir-net'}).map(n=>n.id),['csir-ecology-a1','csir-ecology-a2','csir-ecology-a3']);
 assert.equal(searchCatalog(catalog,{query:'ecology',mode:'academics'}).length,0);
 assert.equal(searchCatalog(catalog,{query:'ecology',mode:'exams',scope:'upessc'}).length,0);
 const id='ecology-levels-of-organisation';
 assert.deepEqual(sanitiseLearning({bookmarks:[id,id,'__proto__','not-a-note'],completed:[id],recent:id}),{version:1,bookmarks:[id],completed:[id],recent:id});
});

test('A1 retains complete theory and local figures without unsafe Meta runtime or remote fonts',async()=>{
 const html=await readFile(new URL('../dist/.'+ecologyA1.url+'index.html',import.meta.url),'utf8');
 const sectionNumbers=[...html.matchAll(/data-source-section="(\d+)"/g)].map(m=>Number(m[1])).sort((a,b)=>a-b);
 assert.deepEqual(sectionNumbers,Array.from({length:17},(_,i)=>i+1));
 for(const concept of ['association','hypothesis','prediction','age structure','Species richness','Species composition','interbreeding','chemosynthetic','emergent','Aggregate']){
  assert.ok(html.toLowerCase().includes(concept.toLowerCase()),'Missing important concept: '+concept);
 }
 assert.equal((html.match(/<header class="site-header"/g)||[]).length,1);
 assert.equal((html.match(/<footer class="site-footer"/g)||[]).length,1);
 assert.equal((html.match(/<main\b/g)||[]).length,1);
 assert.equal((html.match(/data-a1-figure=/g)||[]).length,6);
 assert.equal((html.match(/data-a1-answer=/g)||[]).length,3);
 assert.match(html,new RegExp('href="'+ecologyA2.url+'"'));
 assert.doesNotMatch(html,/single genetic unit|3-SECOND IDENTIFICATION|Most studies are snapshots|React Artifact|fonts\.googleapis|data:image\/| style=| onclick=/i);
 assert.doesNotMatch(html,/<script(?![^>]*\bsrc=)[^>]*>/);
 assert.match(html,/<dialog id="a1-figure-dialog"/);
 assert.match(html,/data-bookmark="ecology-levels-of-organisation"/);
 assert.match(html,/data-complete="ecology-levels-of-organisation"/);
 const css=await readFile(new URL('../css/ecology-meta.css',import.meta.url),'utf8');
 for(const animation of ['bubbleRise','shimmer','dashMove','heatFloat','rotateSlow','a1DotPulse'])assert.ok(css.includes(animation));
});

test('Unfinished note pages are navigable but are not presented as readable search results',async()=>{
 const root=await readFile(new URL('../dist/.'+ecologyRoot+'index.html',import.meta.url),'utf8');
 assert.equal((root.match(/class="ecology-outline-section"/g)||[]).length,12);
 for(const note of ecologyNotes)assert.ok(root.includes('href="'+note.url+'"'));
 for(const note of ecologyNotes.filter(n=>!n.available)){
  const page=await readFile(new URL('../dist/.'+note.url+'index.html',import.meta.url),'utf8');
  assert.match(page,/<meta name="robots" content="noindex, follow">/);
  assert.match(page,/Reading page in preparation/);
  assert.ok(!catalog.some(item=>item.url===note.url));
 }
});
