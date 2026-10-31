import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {searchCatalog,sanitiseLearning,frapValues} from '../js/model.mjs';
import {catalog} from '../data/catalog.mjs';
const root=new URL('../dist/',import.meta.url);
async function allFiles(directory){const entries=await readdir(directory,{withFileTypes:true});return (await Promise.all(entries.map(async e=>e.isDirectory()?allFiles(new URL(e.name+'/',directory)):[new URL(e.name,directory)]))).flat();}
test('intent and depth filters never leak results between pillars',()=>{
 assert.deepEqual(searchCatalog(catalog,{query:'FRAP',mode:'academics'}).map(i=>i.id),['membrane-academic']);
 assert.deepEqual(searchCatalog(catalog,{query:'membrane',mode:'exams',scope:'upessc'}).map(i=>i.id),['membrane-exam']);
 assert.equal(searchCatalog(catalog,{query:'membrane',mode:'academics',scope:'foundation'}).length,0);
 assert.equal(searchCatalog(catalog,{query:'no-such-topic',mode:'explore'}).length,0);
});
test('mobile fraction uses the post-bleach baseline, with bounded values',()=>{
 const result=frapValues(70,3);assert.equal(result.plateau,76);assert.equal((result.plateau-result.after)/(result.before-result.after),.7);
 assert.equal(frapValues(100,3).plateau,100);assert.equal(frapValues(20,3).plateau,36);assert.equal(frapValues(-100,3).plateau,20);
});
test('untrusted saved data cannot add arbitrary concept IDs or duplicate progress',()=>{
 const value=sanitiseLearning({bookmarks:['cell-membrane','<script>','cell-membrane'],completed:'yes',recent:'https://attacker.invalid'});
 assert.deepEqual(value,{version:1,bookmarks:['cell-membrane'],completed:[],recent:null});
});
test('all generated pages have working local links, assets and fragment targets',async()=>{
 const files=await allFiles(root);const html=new Map();
 for(const f of files)if(f.pathname.endsWith('.html'))html.set(f.pathname,await readFile(f,'utf8'));
 assert.ok(html.size>=20);
 const failures=[];
 for(const [filename,content] of html){
  assert.match(content,/<html lang="en">/);assert.match(content,/<meta name="viewport"/);assert.match(content,/<main id="main"/);
  assert.equal((content.match(/<h1[\s>]/g)||[]).length,1,filename+' must have one H1');
  for(const m of content.matchAll(/(?:href|src)="([^"]+)"/g)){
   const raw=m[1];if(!raw.startsWith('/')&&!raw.startsWith('#'))continue;
   const url=new URL(raw,'https://test.invalid'+filename.split('/dist')[1]);
   let target=path.join(root.pathname,decodeURIComponent(url.pathname));
   if(url.pathname.endsWith('/'))target=path.join(target,'index.html');
   try{await stat(target);}catch{failures.push(filename+' → '+raw);continue;}
   if(url.hash&&target.endsWith('.html')){const dest=html.get(target)||await readFile(target,'utf8');if(!dest.includes('id="'+decodeURIComponent(url.hash.slice(1))+'"'))failures.push(filename+' → missing anchor '+raw);}
  }
 }
 assert.deepEqual(failures,[]);
});
test('academic homepage keeps exam-only support areas within the exam pathway',async()=>{
 const homepage=await readFile(new URL('index.html',root),'utf8');
 assert.doesNotMatch(homepage,/Static GK|Teaching Aptitude|UPESSC/);
 const examPage=await readFile(new URL('exams/index.html',root),'utf8');
 assert.match(examPage,/Static GK/);assert.match(examPage,/UPESSC/);
});
test('public sitemap exposes readable reference pages and excludes unfinished or personal views',async()=>{
 const sitemap=await readFile(new URL('sitemap.xml',root),'utf8');
 const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>new URL(match[1]));
 assert.ok(urls.some(url=>url.pathname===catalog[0].url));
 assert.ok(!urls.some(url=>['/search/','/saved/','/academics/foundation/','/exams/neet-ug/'].includes(url.pathname)));
 for(const url of urls){const html=await readFile(new URL('.'+url.pathname+'index.html',root),'utf8');assert.match(html,/<meta name="robots" content="index, follow">/);}
 const emptyPathway=await readFile(new URL('academics/foundation/index.html',root),'utf8');assert.match(emptyPathway,/<meta name="robots" content="noindex, follow">/);
});
