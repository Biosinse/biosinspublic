const root=document.querySelector('.ecology-a1');
if(root){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const pause=root.querySelector('[data-a1-pause]');
 const setPaused=value=>{root.classList.toggle('motion-paused',value);pause.setAttribute('aria-pressed',String(value));pause.textContent=value?'Resume animations':'Pause animations';};
 const applyMotionPreference=()=>{pause.disabled=reduced.matches;setPaused(reduced.matches);if(reduced.matches)pause.textContent='Reduced motion';};
 applyMotionPreference();
 pause.addEventListener('click',()=>setPaused(!root.classList.contains('motion-paused')));
 reduced.addEventListener('change',applyMotionPreference);
 const sections=[...root.querySelectorAll('article>section[id]')];
 const links=[...root.querySelectorAll('a[href^="#"]')].filter(a=>sections.some(s=>'#'+s.id===a.hash));
 const details=root.querySelector('.a1-mobile-contents');
 root.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');
  if(!link)return;
  const target=document.getElementById(decodeURIComponent(link.hash.slice(1)));
  if(target){target.classList.add('in-view');details.open=false;}
 });
 if('IntersectionObserver'in window){
  root.classList.add('motion-ready');
  const reveal=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('in-view');reveal.unobserve(entry.target);}},{threshold:.01,rootMargin:'0px 0px -15px 0px'});
  root.querySelectorAll('.reveal-on-scroll').forEach(section=>reveal.observe(section));
 }
 let queued=false;
 function update(){
  queued=false;
  const toolbarHeight=root.querySelector('.a1-toolbar').getBoundingClientRect().height;
  root.style.setProperty('--a1-toolbar-height',toolbarHeight+'px');
  const offset=toolbarHeight+25;
  let current=sections[0]?.id;
  for(const section of sections)if(section.getBoundingClientRect().top<=offset)current=section.id;
  for(const a of links){if(a.hash==='#'+current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}
  const article=root.querySelector('article');
  const box=article.getBoundingClientRect();
  const value=Math.max(0,Math.min(100,(innerHeight-box.top)/Math.max(1,box.height)*100));
  root.querySelector('[data-a1-progress]').style.width=value+'%';
 }
 const requestUpdate=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};
 addEventListener('scroll',requestUpdate,{passive:true});addEventListener('resize',requestUpdate);update();
 const dialog=root.querySelector('#a1-figure-dialog');
 let trigger,previousOverflow='';
 root.querySelectorAll('[data-a1-figure]').forEach(button=>button.addEventListener('click',()=>{
  trigger=button;
  const image=dialog.querySelector('[data-a1-dialog-image]');
  image.src=button.dataset.a1Figure;image.alt=button.querySelector('img').alt;
  dialog.querySelector('[data-a1-dialog-caption]').textContent=button.dataset.caption;
  dialog.querySelector('h2').textContent=button.dataset.caption.split('.')[0];
  previousOverflow=document.documentElement.style.overflow;
  document.documentElement.style.overflow='hidden';
  dialog.showModal();
 }));
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.documentElement.style.overflow=previousOverflow;trigger?.focus({preventScroll:true});});
 root.querySelectorAll('[data-a1-choice]').forEach(button=>button.addEventListener('click',()=>{
  const group=button.closest('[data-a1-answer]');
  group.querySelectorAll('[data-a1-choice]').forEach(choice=>choice.setAttribute('aria-pressed',String(choice===button)));
  const correct=button.dataset.a1Choice===group.dataset.a1Answer;
  const feedback=group.querySelector('[data-a1-feedback]');
  feedback.textContent=(correct?'Correct. ':'The main level is '+group.dataset.a1Answer+'. ')+feedback.dataset.reason;
 }));
}
