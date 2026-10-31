import {concepts} from './concepts.mjs';
export const validModes = ['academics','exams','explore'];
export function searchCatalog(items,{query='',mode='academics',scope=''}={}){
  const tokens=String(query).toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu)||[];
  return items.filter(item=>item.available&&item.mode===mode&&(!scope||item.scope===scope)).map(item=>{
    const haystack=[item.title,item.subtitle,item.scopeLabel,...(item.keywords||[])].join(' ').toLocaleLowerCase();
    const matches=tokens.every(token=>haystack.includes(token));
    const score=tokens.reduce((n,t)=>n+(item.title.toLocaleLowerCase().includes(t)?3:haystack.includes(t)?1:0),0);
    return {item,matches,score};
  }).filter(result=>result.matches).sort((a,b)=>b.score-a.score).map(result=>result.item);
}
export function sanitiseLearning(value){
  const known=id=>typeof id==='string'&&Object.hasOwn(concepts,id);
  const onlyConcepts=items=>Array.isArray(items)?[...new Set(items.filter(known))]:[];
  return {version:1,bookmarks:onlyConcepts(value?.bookmarks),completed:onlyConcepts(value?.completed),recent:known(value?.recent)?value.recent:null};
}
export function toggleConcept(list,id){return list.includes(id)?list.filter(x=>x!==id):[...list,id];}
export function frapValues(mobile=70,stage=0){
  const fraction=Math.min(100,Math.max(0,Number(mobile)))/100;
  const before=100,after=20,plateau=after+fraction*(before-after);
  const recovery=after+(plateau-after)*.6;
  const values=[before,after,recovery,plateau];
  return {before,after,plateau,recovery,mobile:fraction,fluorescence:values[Math.min(3,Math.max(0,stage))]};
}
