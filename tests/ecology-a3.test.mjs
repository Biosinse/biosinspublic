import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const gitBlobSha=(content)=>{const data=Buffer.from(content,'utf8');return createHash('sha1').update('blob '+data.length+'\0').update(data).digest('hex');};
import {resourceResponse,factorialContrast} from '../js/ecology-a3-model.mjs';
import {ecologyA3} from '../data/ecology.mjs';
import {catalog} from '../data/catalog.mjs';
import {sanitiseLearning,searchCatalog} from '../js/model.mjs';
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
test('A3 resource model distinguishes saturation, net growth and finite break-even',()=>{
 const result=resourceResponse(.8,2,6,.2);
 near(result.gross,.6);near(result.net,.4);near(result.breakEven,2/3);
 near(resourceResponse(.8,2,2,0).gross,.4);
 assert.deepEqual(resourceResponse(.8,2,0,.2),{gross:0,net:-.2,breakEven:2/3});
 near(resourceResponse(1,4,1,.2).net,0);
 assert.equal(resourceResponse(.2,2,5,.2).breakEven,null);
 assert.equal(resourceResponse(.1,2,5,.2).breakEven,null);
 assert.equal(resourceResponse(.8,2,5,0).breakEven,0);
 for(const args of [[0,2,6,.2],[.8,0,6,.2],[.8,2,-1,.2],[.8,2,6,-.2],[.8,NaN,6,.2]])assert.throws(()=>resourceResponse(...args),RangeError);
});
test('A3 factorial comparisons keep additive and proportional null models distinct',()=>{
 const result=factorialContrast(100,90,80,50);
 assert.equal(result.expected,70);assert.equal(result.contrast,-20);
 assert.equal(result.aAtB0,-10);assert.equal(result.aAtB1,-30);
 assert.equal(result.multiplicativeExpected,72);assert.equal(result.multiplicativeDeviation,-22);
 const proportional=factorialContrast(100,80,80,64);
 assert.equal(proportional.contrast,4);assert.equal(proportional.multiplicativeDeviation,0);
 assert.equal(factorialContrast(0,10,20,30).contrast,0);
 assert.equal(factorialContrast(0,10,20,30).multiplicativeExpected,null);
 assert.equal(factorialContrast(-1,2,3,4).multiplicativeExpected,null);
 assert.equal(factorialContrast(100,80,90,50).contrast,result.contrast);
 assert.equal(factorialContrast(110,100,90,60).contrast,result.contrast);
 assert.throws(()=>factorialContrast(100,NaN,80,50),RangeError);
 assert.throws(()=>factorialContrast(1e308,1e308,1e308,1e308),RangeError);
});
test('A3 has an independent CSIR search and device-local learning identity',()=>{
 assert.equal(searchCatalog(catalog,{query:'apparent competition',mode:'exams',scope:'csir-net'})[0].url,ecologyA3.url);
 assert.equal(searchCatalog(catalog,{query:'Monod',mode:'academics'}).length,0);
 const id='ecology-factors-organism-responses';
 assert.deepEqual(sanitiseLearning({bookmarks:[id,id],completed:[id],recent:id}),{version:1,bookmarks:[id],completed:[id],recent:id});
});
test('A3 retains complete structure, reviewed figures, references and adjacent-note navigation',async()=>{
 const html=await readFile(new URL('../dist/.'+ecologyA3.url+'index.html',import.meta.url),'utf8');
 assert.deepEqual([...html.matchAll(/data-source-section="(\d+)"/g)].map(m=>Number(m[1])),Array.from({length:15},(_,i)=>i+1));
 assert.equal((html.match(/id="a3-ref-\d+"/g)||[]).length,22);
 assert.equal((html.match(/data-a3-figure=/g)||[]).length,10);
 assert.equal((html.match(/data-a3-calculator=/g)||[]).length,2);
 assert.equal((html.match(/<img /g)||[]).length,5);
 assert.equal((html.match(/<header class="site-header"/g)||[]).length,1);
 assert.equal((html.match(/<footer class="site-footer"/g)||[]).length,1);
 assert.match(html,/<meta name="color-scheme" content="light dark">/);
 assert.match(html,/data-bookmark="ecology-factors-organism-responses"/);
 assert.match(html,/data-complete="ecology-factors-organism-responses"/);
 assert.match(html,/<dialog id="a3-figure-dialog"/);
 assert.match(html,/Next \/ A4 · In preparation/);
 assert.doesNotMatch(html,/data:image\/|React Artifact|fonts\.googleapis| style=| onclick=/i);
 assert.doesNotMatch(html,/<script(?![^>]*\bsrc=)[^>]*>/);
 assert.doesNotMatch(html,/\[\d+,\s*\d+\]/);
 for(const word of ['quiescence','diapause','pseudoreplication','reciprocal transplant','common-garden','apparent competition','complementary','cross-tolerance','reaction norm','nonadditivity','R*','difference-in-differences'])assert.ok(html.toLowerCase().includes(word.toLowerCase()),word);
 const reviewedFiles={
  'components/ecology-a1.html':'e7776a101ab56fdcb8c4f93e23c94150335cc2ca',
  'css/ecology-a2.css':'7bb3a7f89212c7fbf57971bbbc243d55c76b53c3',
  'js/ecology-a2.js':'5e4ab4b51b640fc3a0e9710c3d941912',
  'components/ecology-a2.html':'3c1d13020a0f24df5b54410d31245874501d4850'
 };
 for(const [file,expectedSha] of Object.entries(reviewedFiles)){
  const current=await readFile(new URL('../'+file,import.meta.url),'utf8');
  assert.equal(gitBlobSha(current),expectedSha,'Reviewed source changed: '+file);
 }
 const a2=await readFile(new URL('../components/ecology-a2.html',import.meta.url),'utf8');
 assert.ok(a2.includes('Next / A3'));
});
function lum(hex){const c=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];}
test('A3 reading palettes and figure labels maintain contrast in both themes',async()=>{
 const css=await readFile(new URL('../css/ecology-a3.css',import.meta.url),'utf8');
 for(const block of [css.match(/\.ecology-a3-page\{([^}]+)\}/)[1],css.match(/\.ecology-a3-page\[data-a3-theme=dark\]\{([^}]+)\}/)[1]]){
  const p=Object.fromEntries([...block.matchAll(/--a3-([\w-]+):(#(?:[a-f\d]{6}|[a-f\d]{3}));/gi)].map(([,k,v])=>[k,v.length===4?'#'+[...v.slice(1)].map(c=>c+c).join(''):v]));
  for(const ink of ['ink','text','muted','emerald','cyan','blue','amber','teal','violet','orange','error'])for(const surface of ['bg','panel','soft']){
   const a=lum(p[ink]),b=lum(p[surface]),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
   assert.ok(ratio>=4.5,`${ink} on ${surface}: ${ratio}`);
  }
 }
});
