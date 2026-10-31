import {pageIntro,escape} from './ui.mjs';
import {apRoot,zoologyRoot,upesscRoot,apSubjects,zoologySyllabusUnits,zoologyUnits,unitUrl,sectionUrl,noteUrl,notesCount} from '../data/upessc.mjs';
const baseCrumbs=[['Competitive Exams','/exams/'],['Assistant Professor',apRoot]];
const subjectUrl=s=>apRoot+s.slug+'/';
function contextIntro(eyebrow,title,description,crumbs){return pageIntro({eyebrow,title,description,crumbs});}
function subjectTag(s){return s.status==='organised'?'SUBJECT PATHWAY READY':'SUBJECT AREA · PLANNED';}
export function assistantProfessorLanding(){
return `<div class="container up-portal">${contextIntro('Competitive Exams / Assistant Professor','Choose your<br><em>subject.</em>','Select a biological-sciences subject. Zoology has an UPESSC syllabus pathway; other subject collections are being organised.',[...baseCrumbs.slice(0,1),['Assistant Professor']])}
<div class="up-subject-grid">${apSubjects.map((s,i)=>`<a class="up-subject-card ${s.status==='organised'?'up-featured':'up-muted'}" href="${subjectUrl(s)}"><span class="up-mini">${String(i+1).padStart(2,'0')} / ${subjectTag(s)}</span><h2>${escape(s.name)}</h2><p>${escape(s.detail)}</p><span class="up-card-footer">${s.status==='organised'?'Explore Zoology →':'View subject status →'}</span></a>`).join('')}</div>
<p class="up-disclaimer">The subject cards are BioSins learning pathways, not an assertion that each is separately examined by UPESSC. Biotechnology, Microbiology and Biochemistry are included for future Biology-related exam coverage.</p></div>`;
}
export function assistantSubjectLanding(subject){
if(subject.slug==='zoology')return `<div class="container up-portal">${contextIntro('Assistant Professor / Zoology','Zoology.<br><em>Choose an exam.</em>','Our Zoology preparation is organised by examining authority, keeping exam-specific syllabus units separate from the academic notes library.',[...baseCrumbs,['Zoology']])}<a class="up-exam-card" href="${upesscRoot}"><span class="up-mini">UPESSC / UPHESC · SUBJECT CODE 72</span><h2>Uttar Pradesh Assistant Professor — Zoology</h2><p>Browse the Zoology syllabus. Existing Cell Biology pages are preserved; Animal Physiology has its own newly organised sections.</p><span class="up-card-footer">Explore UPESSC units →</span></a></div>`;
return `<div class="container up-portal">${contextIntro('Assistant Professor / '+subject.name,escape(subject.name)+'.','This Biology subject pathway is reserved for future syllabus-specific notes.',[...baseCrumbs,[subject.name]])}<div class="up-guidance"><strong>Subject directory in preparation.</strong><p>${escape(subject.detail)}. No syllabus or notes are claimed as ready yet.</p></div><a class="up-simple-link" href="${apRoot}">← All Assistant Professor subjects</a></div>`;
}
export function zoologyUpesscLanding(){
const have=new Map(zoologyUnits.map(u=>[u.number,u]));
return `<div class="container up-portal">${contextIntro('UPESSC / Zoology · Code 72','Explore the<br><em>Zoology syllabus.</em>','Ten syllabus units. BioSins has structured Unit 02 Cell Biology (35 standalone Word notes) and Unit 06 Animal Physiology (76 approved note slots).', [...baseCrumbs,['Zoology',zoologyRoot],['UPESSC']])}
<div class="up-stats"><div><strong>10</strong><span>Syllabus units</span></div><div><strong>2</strong><span>Organised directories</span></div><div><strong>111</strong><span>Dedicated note slots</span></div></div>
<div class="up-unit-grid">${zoologySyllabusUnits.map(item=>{const u=have.get(item.number);const href=item.number==='02'?'/exams/upessc/zoology/cell-membrane/':u?unitUrl(u):upesscRoot+'unit-'+item.number+'/';const label=item.number==='02'?'Existing Cell Biology content · preserve current pages':u?u.sections.length+' sections · '+notesCount(u)+' notes':item.number==='03'?'Notes in preparation':'Unit outline pending';return `<a href="${href}" class="up-unit-card ${u?'up-unit-ready':'up-unit-planned'}"><span class="up-mini">UNIT ${item.number}</span><h2>${escape(u?.title||item.title)}</h2><p>${label}</p><span class="up-card-footer">${item.number==='02'?'Open existing Cell Biology page →':u?'Browse sections →':'View syllabus status →'}</span></a>`}).join('')}</div>
<div class="up-guidance up-end-guidance"><strong>Content status</strong><p>The prepared Cell Biology content is kept at its existing site location without creating duplicate placeholder pages. Unit 06 is an approved teaching plan, not 76 finished lessons. The counts above represent separate slots, not published notes.</p></div></div>`;
}
export function unorganisedUnitLanding(item){
return `<div class="container up-portal">${contextIntro('UPESSC Zoology / Unit '+item.number,escape(item.title)+'.','This unit is listed in the supplied commission syllabus. The BioSins section and subsection directory has not yet been approved for this unit.',[...baseCrumbs,['Zoology',zoologyRoot],['UPESSC',upesscRoot],['Unit '+item.number]])}<div class="up-guidance"><strong>${item.number==='03'?'Notes have been prepared separately; website mapping remains pending.':'Teaching subdivisions in preparation.'}</strong><p>We will add standalone notes without changing approved codes or combining topics arbitrarily.</p></div><a class="up-simple-link" href="${upesscRoot}">← Back to all Zoology units</a></div>`;
}
function noteRow(unit,section,note){return `<a href="${noteUrl(unit,section,note)}" class="up-note-row"><span class="up-note-code">${note.code}</span><span class="up-note-title">${escape(note.title)}</span><span class="up-note-state">${unit.number==='02'?'Word source prepared':'Outline approved'}</span><span class="up-chevron" aria-hidden="true">→</span></a>`;}
export function zoologyUnitLanding(unit){
return `<div class="container up-portal">${contextIntro('UPESSC / Zoology / Unit '+unit.number,escape(unit.title)+'.',unit.sections.length+' sections and '+notesCount(unit)+' dedicated subsection pages. Each has its own code and URL.',[...baseCrumbs,['Zoology',zoologyRoot],['UPESSC',upesscRoot],['Unit '+unit.number]])}
<div class="up-guidance"><strong>${unit.number==='02'?'35 illustrated Word notes already prepared':'76 standalone subsections approved'}</strong><p>${unit.number==='02'?'The original documents are preserved separately; page conversion and illustration transfer to the website are not complete.':'The separate teaching note slots are ready for content and figures. These are not yet 76 written lessons.'}</p></div>
<nav aria-label="Jump to section" class="up-jump">${unit.sections.map(s=>`<a href="#section-${s.letter}">${s.letter} · ${escape(s.title)}</a>`).join('')}</nav>
<div class="up-sections">${unit.sections.map(s=>`<section id="section-${s.letter}" class="up-section"><div class="up-section-head"><div><span class="up-mini">SECTION ${s.letter} · ${s.notes.length} NOTES</span><h2><a href="${sectionUrl(unit,s)}">${escape(s.title)}</a></h2></div><a href="${sectionUrl(unit,s)}" class="up-small-action">Open section →</a></div><div class="up-note-list">${s.notes.map(n=>noteRow(unit,s,n)).join('')}</div></section>`).join('')}</div></div>`;
}
export function zoologySectionLanding(unit,section){
return `<div class="container up-portal">${contextIntro('Zoology / Unit '+unit.number+' / Section '+section.letter,escape(section.title)+'.',section.notes.length+' standalone subsections. Each link opens its own dedicated note page.',[...baseCrumbs,['Zoology',zoologyRoot],['UPESSC',upesscRoot],['Unit '+unit.number,unitUrl(unit)],['Section '+section.letter]])}
<div class="up-note-list up-standalone-list">${section.notes.map(n=>noteRow(unit,section,n)).join('')}</div><a class="up-simple-link" href="${unitUrl(unit)}">← Back to Unit ${unit.number}</a></div>`;
}
export function zoologyNoteSlot(unit,section,note){
const i=section.notes.findIndex(n=>n.code===note.code),prev=section.notes[i-1],next=section.notes[i+1];
return `<div class="container up-portal up-single-note">${contextIntro('Zoology / Unit '+unit.number+' / '+note.code,escape(note.title)+'.',unit.number==='02'?'Source document prepared · HTML integration pending':'Approved learning scope · full note in preparation',[...baseCrumbs,['Zoology',zoologyRoot],['UPESSC',upesscRoot],['Unit '+unit.number,unitUrl(unit)],['Section '+section.letter,sectionUrl(unit,section)],[note.code]])}
<div class="up-note-article"><span class="up-note-label">Standalone note ${note.code} · Section ${section.letter}</span>
${note.scope?`<h2>Approved coverage</h2><p>${escape(note.scope)}</p>`:''}
<div class="up-guidance"><strong>${unit.number==='02'?'Original Word document prepared':'Outline prepared — lesson not yet written'}</strong><p>${unit.number==='02'?'We are retaining the complete original teaching document with its illustrations, diagrams and tables. The website import has not been completed; this is a navigation page, not a shortened replacement for those notes.':'This slot is reserved for the full original BioSins teaching note. Its explanatory content, images and interactions will be added later.'}</p></div></div>
<nav class="up-note-adjacent" aria-label="Previous and next notes">${prev?`<a href="${noteUrl(unit,section,prev)}">← ${prev.code} · ${escape(prev.title)}</a>`:`<a href="${sectionUrl(unit,section)}">← Section ${section.letter}</a>`}${next?`<a href="${noteUrl(unit,section,next)}">${next.code} · ${escape(next.title)} →</a>`:`<a href="${unitUrl(unit)}">Unit overview →</a>`}</nav></div>`;
}
export function makeUpesscPages(){
const pages=[];
function add(path,title,description,content,indexable=false){pages.push({path,title,description,pillar:'exams',content,indexable,styles:['/css/upessc.css']});}
add(apRoot,'Assistant Professor — Biology Subjects','Choose an Assistant Professor subject, syllabus and notes.',assistantProfessorLanding(),true);
for(const s of apSubjects)add(subjectUrl(s),'Assistant Professor — '+s.name,s.detail,assistantSubjectLanding(s),s.status==='organised');
add(upesscRoot,'UPESSC Assistant Professor Zoology','Ten UPESSC Zoology syllabus units with BioSins note directories.',zoologyUpesscLanding(),true);
for(const item of zoologySyllabusUnits){
const u=zoologyUnits.find(v=>v.number===item.number);
if(!u){add(upesscRoot+'unit-'+item.number+'/','UPESSC Zoology Unit '+item.number+' — '+item.title,'Unit preparation status.',unorganisedUnitLanding(item));continue;}
if(u.number==='02')continue; // Existing Cell Biology pages must remain untouched and not be re-created.
add(unitUrl(u),'Unit '+u.number+' — '+u.title,u.sections.length+' sections and '+notesCount(u)+' note slots.',zoologyUnitLanding(u),true);
for(const section of u.sections){
add(sectionUrl(u,section),'Unit '+u.number+' '+section.letter+' — '+section.title,section.notes.length+' dedicated notes.',zoologySectionLanding(u,section));
for(const note of section.notes)add(noteUrl(u,section,note),note.code+' — '+note.title,'Individual BioSins note slot, awaiting full website integration.',zoologyNoteSlot(u,section,note));
}
}
return pages;
}
