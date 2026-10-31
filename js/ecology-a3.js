import {resourceResponse,factorialContrast} from './ecology-a3-model.mjs';
const root=document.querySelector('.ecology-a3');
if(root){
 const systemTheme=matchMedia('(prefers-color-scheme: dark)');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const themeButton=root.querySelector('[data-a3-theme-toggle]');
 const pause=root.querySelector('[data-a3-pause]');
 const key='biosins.a3.theme';
 let savedTheme;
 try{const saved=localStorage.getItem(key);if(saved==='light'||saved==='dark')savedTheme=saved;}catch{}
 function applyTheme(theme){
  document.body.dataset.a3Theme=theme;
  const next=theme==='dark'?'light':'dark';
  themeButton.textContent=next==='dark'?'Dark mode':'Light mode';
  themeButton.setAttribute('aria-label','Switch to '+next+' mode');
 }
 applyTheme(savedTheme||(systemTheme.matches?'dark':'light'));
 themeButton.addEventListener('click',()=>{
  savedTheme=document.body.dataset.a3Theme==='dark'?'light':'dark';
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
 const toolbar=root.querySelector('.a3-toolbar');
 const article=root.querySelector('article');
 const sections=[...article.querySelectorAll(':scope>section[id]')];
 const links=[...root.querySelectorAll('a[href^="#"]')].filter(a=>sections.some(s=>'#'+s.id===a.hash));
 const details=root.querySelector('.a3-mobile-contents');
 root.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');
  if(!link)return;
  const target=document.getElementById(link.hash.slice(1));
  if(target){target.closest('.a3-chapter')?.classList.add('in-view');details.open=false;}
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
  root.style.setProperty('--a3-toolbar-height',height+'px');
  let current=sections[0]?.id;
  for(const section of sections)if(section.getBoundingClientRect().top<=height+35)current=section.id;
  for(const a of links){if(a.hash==='#'+current)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');}
  const box=article.getBoundingClientRect();
  const progress=Math.max(0,Math.min(100,(height-box.top)/Math.max(1,box.height-innerHeight+height)*100));
  root.querySelector('[data-a3-progress]').style.width=progress+'%';
 }
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(update);}};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
 if('ResizeObserver'in window)new ResizeObserver(schedule).observe(toolbar);
 update();
 const dialog=root.querySelector('#a3-figure-dialog');
 let trigger,previousOverflow='';
 root.querySelectorAll('[data-a3-figure]').forEach(button=>button.addEventListener('click',()=>{
  const figure=document.getElementById(button.dataset.a3Figure);
  figure.closest('.a3-chapter')?.classList.add('in-view');
  const copy=figure.querySelector('.a3-visual-body').cloneNode(true);
  dialog.className=[...figure.closest('section').classList].find(name=>name.startsWith('a3-tone-'))||'';
  // A zoomed SVG must not duplicate gradient or accessible-label IDs.
  const ids=new Map([...copy.querySelectorAll('[id]')].map(el=>[el.id,'a3-dialog-'+el.id]));
  for(const el of copy.querySelectorAll('*')){
   if(ids.has(el.id))el.id=ids.get(el.id);
   for(const name of ['aria-labelledby','aria-describedby'])if(el.hasAttribute(name))el.setAttribute(name,el.getAttribute(name).split(' ').map(id=>ids.get(id)||id).join(' '));
   for(const name of ['fill','stroke','href'])if(el.hasAttribute(name)){
    let value=el.getAttribute(name);for(const [oldId,newId]of ids)value=value.replaceAll('#'+oldId,'#'+newId);el.setAttribute(name,value);
   }
  }
  dialog.querySelector('[data-a3-dialog-content]').replaceChildren(...copy.childNodes);
  dialog.querySelector('h2').textContent=figure.querySelector('h3').textContent;
  dialog.querySelector('[data-a3-dialog-caption]').textContent=figure.querySelector('figcaption').textContent;
  trigger=button;previousOverflow=document.documentElement.style.overflow;
  document.documentElement.style.overflow='hidden';dialog.showModal();
 }));
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.documentElement.style.overflow=previousOverflow;trigger?.focus({preventScroll:true});});
 const format=value=>value!==0&&(Math.abs(value)<.001||Math.abs(value)>=1e7)?value.toExponential(3):Number(value.toPrecision(5)).toLocaleString('en',{maximumFractionDigits:5});
 const setText=(scope,selector,text)=>{scope.querySelector(selector).textContent=text;};
 function redrawResource(maxRate,half,resource,loss,result){
  const figure=root.querySelector('#a3-visual-resource-model');
  const xmax=Math.max(half*5,resource*1.2,(result.breakEven||0)*1.2);
  const ymax=Math.max(maxRate,loss*1.1)*1.1;
  if(!Number.isFinite(xmax)||!Number.isFinite(ymax)||xmax===0||ymax===0)throw new RangeError('Use values within a comparable numerical range to draw this model.');
  const x=value=>65+470*(value/xmax),y=value=>205-160*(value/ymax);
  const points=Array.from({length:51},(_,i)=>{const r=i*xmax/50;return [x(r),y(resourceResponse(maxRate,half,r,loss).gross)];});
  figure.querySelector('[data-resource-path]').setAttribute('d',points.map(([px,py],i)=>(i?'L':'M')+px.toFixed(3)+' '+py.toFixed(3)).join(' '));
  figure.querySelector('[data-resource-loss]').setAttribute('d',`M65 ${y(loss)}H535`);
  const label=figure.querySelector('[data-resource-loss-label]');label.setAttribute('y',String(y(loss)-10));label.textContent='Loss rate m = '+format(loss);
  const point=figure.querySelector('[data-resource-point]');point.setAttribute('cx',String(x(resource)));point.setAttribute('cy',String(y(result.gross)));
  const pointLabel=figure.querySelector('[data-resource-value-label]');pointLabel.setAttribute('x',String(Math.min(x(resource)+12,410)));pointLabel.setAttribute('y',String(Math.max(45,y(result.gross)-10)));pointLabel.textContent='μ('+format(resource)+') = '+format(result.gross);
  const star=figure.querySelector('[data-resource-star]');star.setAttribute('visibility',result.breakEven===null?'hidden':'visible');
  if(result.breakEven!==null){star.setAttribute('cx',String(x(result.breakEven)));star.setAttribute('cy',String(y(loss)));}
  setText(figure,'[data-resource-xmax]',format(xmax));setText(figure,'[data-resource-ymax]',format(ymax));
  setText(figure,'[data-resource-star-label]',result.breakEven===null?'No finite break-even resource level':'R* ≈ '+format(result.breakEven));
  setText(figure,'desc','Resource model with maximum rate '+format(maxRate)+', half-saturation '+format(half)+', resource '+format(resource)+' and loss '+format(loss)+'. Gross growth '+format(result.gross)+', net growth '+format(result.net)+'. '+(result.breakEven===null?'No finite resource level produces positive net growth.':'Break-even resource concentration '+format(result.breakEven)+'.'));
 }
 function redrawFactorial(values,result){
  const [y00,y10,y01,y11]=values;
  const figure=root.querySelector('#a3-visual-factorial-model');
  const low=Math.min(0,...values,result.expected),high=Math.max(0,...values,result.expected);
  const span=high-low||1,min=low<0?low-.1*span:0,max=high+.1*span;
  const y=value=>220-170*((value-min)/(max-min));
  const path=(a,b)=>`M130 ${y(a)}L480 ${y(b)}`;
  figure.querySelector('[data-factor-line0]').setAttribute('d',path(y00,y10));
  figure.querySelector('[data-factor-line1]').setAttribute('d',path(y01,y11));
  figure.querySelector('[data-factor-null]').setAttribute('d',path(y01,result.expected));
  for(const [selector,points]of [['[data-factor-points0]',[y00,y10]],['[data-factor-points1]',[y01,y11]]]){
   figure.querySelectorAll(selector+' circle').forEach((point,i)=>point.setAttribute('cy',String(y(points[i]))));
  }
  setText(figure,'[data-factor-ymin]',format(min));setText(figure,'[data-factor-ymax]',format(max));
  setText(figure,'desc','Treatment means Y00 '+format(y00)+', Y10 '+format(y10)+', Y01 '+format(y01)+', Y11 '+format(y11)+'. Additive prediction '+format(result.expected)+'; interaction contrast '+format(result.contrast)+'. No significance test is performed.');
 }
 for(const form of root.querySelectorAll('[data-a3-calculator]'))form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const value=name=>Number(form.elements.namedItem(name).value),out=form.querySelector('output');
  try{
   if(form.dataset.a3Calculator==='resource'){
    const args=['maxRate','half','resource','loss'].map(value),result=resourceResponse(...args);
    redrawResource(...args,result);
    out.textContent='Gross growth μ = '+format(result.gross)+' day⁻¹; net growth = '+format(result.net)+' day⁻¹. '+(result.breakEven===null?'No finite resource level produces positive net growth for these parameters.':'R* = '+format(result.breakEven)+' mg L⁻¹.');
   }else{
    const args=['y00','y10','y01','y11'].map(value),result=factorialContrast(...args);
    redrawFactorial(args,result);
    out.textContent='Additive prediction = '+format(result.expected)+'; observed combined response = '+format(args[3])+'; contrast I = '+format(result.contrast)+' units. Effect of A with B at reference = '+format(result.aAtB0)+'; with B applied = '+format(result.aAtB1)+'. '+(result.multiplicativeExpected===null?'A proportional null is unsuitable for these baseline values.':'Under the proportional null, expected response = '+format(result.multiplicativeExpected)+' and observed minus expected = '+format(result.multiplicativeDeviation)+'.');
   }
  }catch(error){out.textContent=error.message;}
 });
}
