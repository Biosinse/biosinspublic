import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const gitBlobSha=(content)=>{const data=Buffer.from(content,'utf8');return createHash('sha1').update('blob '+data.length+'\0').update(data).digest('hex');};
import {calculateQ10,attenuatedLight,hydrogenActivityRatio} from '../js/ecology-a2-model.mjs';
import {ecologyA2} from '../data/ecology.mjs';
import {catalog} from '../data/catalog.mjs';
import {sanitiseLearning,searchCatalog} from '../js/model.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('A2 calculations preserve units, direction and valid domains',()=>{
 near(calculateQ10(4,15,10,25),2.5);
 near(calculateQ10(10,25,4,15),2.5);
 near(calculateQ10(4,15,25,35),2.5);
 assert.throws(()=>calculateQ10(4,15,10,15),RangeError);
 assert.throws(()=>calculateQ10(0,15,10,25),RangeError);
 assert.throws(()=>calculateQ10(4,NaN,10,25),RangeError);
 near(attenuatedLight(1000,.4,5).irradiance,135.3352832366127);
 near(attenuatedLight(1000,.4,0).irradiance,1000);
 near(attenuatedLight(1000,0,50).percent,100);
 near(attenuatedLight(0,.4,5).irradiance,0);
 assert.throws(()=>attenuatedLight(1000,-.4,5),RangeError);
 assert.throws(()=>attenuatedLight(1000,.4,-5),RangeError);
 near(hydrogenActivityRatio(6,8),100);
 near(hydrogenActivityRatio(8,6),.01);
 near(hydrogenActivityRatio(7,7),1);
 assert.throws(()=>hydrogenActivityRatio(Infinity,7),RangeError);
});
test('A2 is a distinct searchable and bookmarkable CSIR Ecology concept',()=>{
 assert.equal(searchCatalog(catalog,{query:'Q10',mode:'exams',scope:'csir-net'})[0].url,ecologyA2.url);
 assert.equal(searchCatalog(catalog,{query:'Q10',mode:'academics'}).length,0);
 const id='ecology-physical-environment';
 assert.deepEqual(sanitiseLearning({bookmarks:[id,id,'invalid'],completed:[id],recent:id}),{version:1,bookmarks:[id],completed:[id],recent:id});
});
test('A2 includes the complete manuscript structure, accessible controls and correct figures',async()=>{
 const html=await readFile(new URL('../dist/.'+ecologyA2.url+'index.html',import.meta.url),'utf8');
 assert.deepEqual([...html.matchAll(/data-source-section="(\d+)"/g)].map(m=>Number(m[1])),Array.from({length:12},(_,i)=>i+1));
 assert.equal((html.match(/<header class="site-header"/g)||[]).length,1);
 assert.equal((html.match(/<footer class="site-footer"/g)||[]).length,1);
 assert.equal((html.match(/data-a2-figure=/g)||[]).length,12);
 assert.equal((html.match(/data-a2-calculator=/g)||[]).length,3);
 assert.equal((html.match(/id="a2-ref-\d+"/g)||[]).length,35);
 assert.match(html,/<section id="oxygen"/);
 assert.match(html,/<th scope="col">Low salinity<\/th><th scope="col">High salinity<\/th>/);
 assert.match(html,/<meta name="color-scheme" content="light dark">/);
 assert.match(html,/<dialog id="a2-figure-dialog" aria-labelledby=/);
 assert.match(html,/data-bookmark="ecology-physical-environment"/);
 for(const concept of ['thermoneutral','photoperiod','attenuation','Arrhenius','plasmolysis','sodicity','alkalinity','nitrification','critical depth','aerenchyma','pressure','water potential','factorial'])assert.ok(html.toLowerCase().includes(concept.toLowerCase()),concept);
 assert.doesNotMatch(html,/data:image\/|fonts\.googleapis|React Artifact| style=| onclick=/i);
 assert.doesNotMatch(html,/<script(?![^>]*\bsrc=)[^>]*>/);
 // These A1 content, styles and interactions must remain byte-for-byte unchanged.
 const reviewedFiles={
  'components/ecology-a1.html':'e7776a101ab56fdcb8c4f93e23c94150335cc2ca',
  'css/ecology.css':'95a1429d2c2e0ea7c088ad38bccdb8e8d54ea13a',
  'css/ecology-meta.css':'efe45d073c19a72ae463f2130ebcd86009a2f47a',
  'js/ecology-note.js':'88dc0ce8f2e137fdb52066adb652d3cb836fff20'
 };
 for(const [file,expectedSha] of Object.entries(reviewedFiles)){
  const current=await readFile(new URL('../'+file,import.meta.url),'utf8');
  assert.equal(gitBlobSha(current),expectedSha,'Reviewed source changed: '+file);
 }
});
function luminance(hex){const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
test('A2 light and dark palettes keep reading text and all seven factor labels legible',async()=>{
 const css=await readFile(new URL('../css/ecology-a2.css',import.meta.url),'utf8');
 const blocks=[css.match(/\.ecology-a2-page\{([^}]+)\}/)[1],css.match(/\.ecology-a2-page\[data-a2-theme=dark\]\{([^}]+)\}/)[1]];
 for(const block of blocks){
  const palette=Object.fromEntries([...block.matchAll(/--a2-([\w-]+):(#(?:[a-f\d]{6}|[a-f\d]{3}));/gi)].map(([,k,v])=>[k,v.length===4?'#'+[...v.slice(1)].map(c=>c+c).join(''):v]));
  for(const ink of ['ink','text','muted','thermal','light','water','soil','salinity','ph','oxygen','error'])for(const surface of ['bg','panel','soft'])assert.ok(contrast(palette[ink],palette[surface])>=4.5,`${ink} on ${surface}: ${contrast(palette[ink],palette[surface])}`);
 }
});
