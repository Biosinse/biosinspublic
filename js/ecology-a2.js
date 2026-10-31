import {calculateQ10,attenuatedLight,hydrogenActivityRatio} from './ecology-a2-model.mjs';
const root=document.querySelector('.ecology-a2');
if(root){
 const systemTheme=matchMedia('(prefers-color-scheme: dark)');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const themeButton=root.querySelector('[data-a2-theme-toggle]');
 const pause=root.querySelector('[data-a2-pause]');
 const key='biosins.a2.theme';
 let savedTheme;
 try{const saved=localStorage.getItem(key);if(saved==='light'||saved==='dark')savedTheme=saved;}catch{}
 function applyTheme(theme){
  document.body.dataset.a2Theme=theme;
  const next=theme==='dark'?'light':'dark';
  themeButton.textContent=next==='dark'?'Dark mode':'Light mode';
  themeButton.setAttribute('aria-label','Switch to '+next+' mode');
 }
 applyTheme(savedTheme||(systemTheme.matches?'dark':'light'));
 themeButton.addEventListener('click',()=>{
  savedTheme=document.body.dataset.a2Theme==='dark'?'light':'dark';
  applyTheme(savedTheme);try{localStorage.setItem(key,savedTheme);}catch{}
 });
 systemTheme.addEventListener('change',()=>{if(!savedTheme)applyTheme(systemTheme.matches?'dark':'light');});
 const setPaused=value=>{
  root.classList.toggle('motion-paused',value);pause.setAttribute('aria-pressed',String(value));
  pause.textContent=value?'Resume animations':'Pause animations';
 };
 const motionPreference=()=>{pause.disabled=reduced.matches;setPaused(reduced.matches);if(reduced.matches)pause.textContent='Reduced motion';};
 motionPreference();reduced.addEventListener('change',motionPreference);
 pause.addEventListener('click',()=>setPaused(!root.classList.contains('motion-paused')));
 const toolbar=root.querySelector('.a2-toolbar');
 const article=root.querySelector('article');
 const sections=[...article.querySelectorAll(':scope>section[id]')];
 const links=[...root.querySelectorAll('a[href^="#"]')].filter(a=>sections.some(s=>'#'+s.id===a.hash));
 const details=root.querySelector('.a2-mobile-contents');
 root.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');
  if(!link)return;
  const target=document.getElementById(link.hash.slice(1));
  if(target){target.closest('.a2-chapter')?.classList.add('in-view');details.open=false;}
 });
 if('IntersectionObserver'in window){
  root.classList.add('motion-ready');
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}
  },{threshold:0,rootMargin:'100px 0px 100px 0px'});
  sections.forEach(s=>observer.observe(s));
 }
 let queued=false;
 function update(){
  queued=false;
  const height=toolbar.getBoundingClientRect().height;
  root.style.setProperty('--a2-toolbar-height',height+'px');
  let current=sections[0]?.id;
  for(const section of sections)if(section.getBoundingClientRect().top<=height+35)current=section.id;
  for(const a of links){if(a.hash==='#'+current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}
  const box=article.getBoundingClientRect();
  const progress=Math.max(0,Math.min(100,(height-box.top)/Math.max(1,box.height-innerHeight+height)*100));
  root.querySelector('[data-a2-progress]').style.width=progress+'%';
 }
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
 if('ResizeObserver'in window)new ResizeObserver(schedule).observe(toolbar);
 update();
 const dialog=root.querySelector('#a2-figure-dialog');
 let trigger,previousOverflow='';
 root.querySelectorAll('[data-a2-figure]').forEach(button=>button.addEventListener('click',()=>{
  const figure=document.getElementById(button.dataset.a2Figure);
  const copy=figure.querySelector('.a2-visual-body').cloneNode(true);
  dialog.className=[...figure.closest('section').classList].find(name=>name.startsWith('a2-tone-'))||'';
  // A zoomed SVG must not duplicate gradient or accessible-label IDs.
  const ids=new Map([...copy.querySelectorAll('[id]')].map(el=>[el.id,'a2-dialog-'+el.id]));
  for(const el of copy.querySelectorAll('*')){
   if(ids.has(el.id))el.id=ids.get(el.id);
   for(const name of ['aria-labelledby','aria-describedby'])if(el.hasAttribute(name))el.setAttribute(name,el.getAttribute(name).split(' ').map(id=>ids.get(id)||id).join(' '));
   for(const name of ['fill','stroke','href'])if(el.hasAttribute(name)){
    let value=el.getAttribute(name);for(const [oldId,newId]of ids)value=value.replaceAll('#'+oldId,'#'+newId);el.setAttribute(name,value);
   }
  }
  dialog.querySelector('[data-a2-dialog-content]').replaceChildren(...copy.childNodes);
  dialog.querySelector('h2').textContent=figure.querySelector('h3').textContent;
  dialog.querySelector('[data-a2-dialog-caption]').textContent=figure.querySelector('figcaption').textContent;
  trigger=button;previousOverflow=document.documentElement.style.overflow;
  document.documentElement.style.overflow='hidden';dialog.showModal();
 }));
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.documentElement.style.overflow=previousOverflow;trigger?.focus({preventScroll:true});});
 const format=value=>value!==0&&(Math.abs(value)<.001||Math.abs(value)>=1e7)?value.toExponential(3):Number(value.toPrecision(5)).toLocaleString('en',{maximumFractionDigits:5});
 for(const form of root.querySelectorAll('[data-a2-calculator]'))form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const value=name=>Number(form.elements.namedItem(name).value);
  const out=form.querySelector('output');
  try{
   if(form.dataset.a2Calculator==='q10')out.textContent='Q₁₀ = '+format(calculateQ10(value('r1'),value('t1'),value('r2'),value('t2')))+' for these rates and this temperature interval.';
   if(form.dataset.a2Calculator==='light'){
    const result=attenuatedLight(value('i0'),value('k'),value('z'));
    out.textContent='At '+format(value('z'))+' m: '+format(result.irradiance)+' µmol m⁻² s⁻¹, or '+format(result.percent)+'% of surface light.';
   }
   if(form.dataset.a2Calculator==='ph')out.textContent='Sample A has '+format(hydrogenActivityRatio(value('a'),value('b')))+' times the hydrogen-ion activity of sample B.';
  }catch(error){out.textContent=error.message;}
 });
}
