import {run} from './engine.mjs';

const el=(tag,text,cls)=>{
  const node=document.createElement(tag);
  if(text!=null)node.textContent=text;
  if(cls)node.className=cls;
  return node;
};
function librarySearch() {
  const search=document.querySelector('.ws-search input');
  if(!search)return;
  const groups=[...document.querySelectorAll('.ws-category')];
  const empty=document.querySelector('.ws-empty');
  search.addEventListener('input',()=>{
    const words=search.value.toLowerCase().trim().split(/\s+/);
    let count=0;
    for(const group of groups) {
      let matches=0;
      for(const card of group.querySelectorAll('.ws-card')) {
        const content=(group.querySelector('h2').textContent+' '+card.textContent+' '+card.pathname.replaceAll('-',' ')).toLowerCase();
        const visible=words.every(word=>content.includes(word));card.hidden=!visible;
        if(visible)matches++;
      }
      group.hidden=!matches;count+=matches;
    }
    empty.hidden=count>0;
  });
}
const defaultFaq=[
  ['What paper size is included?','The printable planner includes A4 and US Letter PDF files.'],
  ['How do I print the planner?','Open the PDF in your reader, select the matching paper size and print at actual size.']
];
function faqEditor(form,changed) {
  const list=form.querySelector('.ws-qa-list');
  if(!list)return;
  const add=form.querySelector('[data-add-faq]');let serial=0;
  function sync(){add.disabled=list.children.length>=10;for(const button of list.querySelectorAll('.ws-remove'))button.disabled=list.children.length===1;}
  function row(question='',answer=''){
    const item=el('div',null,'ws-qa-item');const id=++serial;
    for(const [key,title,value] of [['q','Question',question],['a','Answer',answer]]) {
      const field=el('div',null,'ws-field'),label=el('label',title),input=el(key==='q'?'input':'textarea');
      input.id='faq-'+key+'-'+id;input.maxLength=key==='q'?180:1200;input.required=true;input.value=value;input.dataset.part=key;
      if(key==='a')input.rows=2;
      label.htmlFor=input.id;field.append(label,input);item.append(field);
    }
    const remove=el('button','Remove this question','ws-remove');remove.type='button';
    remove.addEventListener('click',()=>{item.remove();sync();changed();list.querySelector('input').focus();});
    item.append(remove);list.append(item);sync();return item;
  }
  const reset=()=>{list.replaceChildren();for(const entry of defaultFaq)row(...entry);};
  add.addEventListener('click',()=>{if(list.children.length<10){row().querySelector('input').focus();changed();}});
  reset();return reset;
}
function renderOutput(out,data,url) {
  const card=el('div',null,'ws-live');card.append(el('h3',data.headline),el('p',data.detail));
  if(data.image){const img=el('img');img.src=url;img.alt='Generated preview — '+data.headline;card.append(img);}
  if(data.snippet){const [address,title,desc]=data.snippet,box=el('div',null,'ws-snippet');box.append(el('small',address),el('b',title),el('p',desc));card.append(box);}
  if(data.rows){const dl=el('dl');for(const [label,value] of data.rows){const row=el('div');row.append(el('dt',label),el('dd',value));dl.append(row);}card.append(dl);}
  if(data.lines)card.append(el('pre',data.lines.join('\n')));
  if(data.entries)for(const entry of data.entries){const details=el('details');details.append(el('summary',entry.q),el('p',entry.a));card.append(details);}
  out.replaceChildren(card);
}
function workspace(form) {
  const key=form.dataset.tool,work=form.closest('.ws-work');
  const status=form.querySelector('.ws-status'),out=work.querySelector('.ws-output'),actions=work.querySelector('.ws-actions');
  const save=actions.querySelector('a'),copy=actions.querySelector('button'),example=form.querySelector('[data-example]'),submit=form.querySelector('[type=submit]');
  const input=form.elements.file,selection=form.querySelector('.ws-selection');
  const placeholder=out.firstElementChild.cloneNode(true);
  let selected=[],url=null,text='',revision=0;
  function clear() {
    revision++;if(url){URL.revokeObjectURL(url);url=null;}
    out.replaceChildren(placeholder.cloneNode(true));actions.hidden=true;save.removeAttribute('href');
    text='';status.textContent='';delete status.dataset.error;copy.textContent='Copy';work.removeAttribute('aria-busy');
    example.disabled=submit.disabled=false;
  }
  function failure(error) {status.dataset.error='';status.textContent=error?.message||'The tool could not complete this request. Check the inputs and try again.';}
  const resetFaq=faqEditor(form,clear);
  function chooseFiles(files){
    selected=[...files];
    if(selection)selection.textContent=selected.length?selected.length===1?selected[0].name:selected.length+' files · '+selected.slice(0,3).map(f=>f.name).join(', '):'';
  }
  if(input){
    input.addEventListener('change',()=>{clear();chooseFiles(input.files);});
    const zone=input.closest('.ws-upload');
    for(const type of ['dragover','dragenter'])zone.addEventListener(type,e=>{e.preventDefault();zone.classList.add('ws-drag');});
    for(const type of ['dragleave','drop'])zone.addEventListener(type,e=>{e.preventDefault();zone.classList.remove('ws-drag');});
    zone.addEventListener('drop',e=>{
      clear();
      if(!input.multiple && e.dataTransfer.files.length>1){chooseFiles([]);failure(Error('Choose one file at a time.'));return;}
      chooseFiles(e.dataTransfer.files);
    });
  }
  function ranges(){for(const range of form.querySelectorAll('input[type=range]'))range.nextElementSibling.value=range.value+'%';}
  form.addEventListener('input',e=>{if(e.target!==input){clear();ranges();}});
  async function process(){
    if(!form.reportValidity())return;
    clear();const current=revision;
    submit.disabled=example.disabled=true;work.setAttribute('aria-busy','true');status.textContent='Working on your device…';
    try {
      const values=Object.fromEntries(new FormData(form));
      if(resetFaq)values.entries=[...form.querySelectorAll('.ws-qa-item')].map(row=>({q:row.querySelector('input').value.trim(),a:row.querySelector('textarea').value.trim()}));
      const data=await run(key,values,selected);
      if(current!==revision)return;
      const blob=data.blob||new Blob([data.text],{type:(data.mime||'text/plain')+';charset=utf-8'});
      url=URL.createObjectURL(blob);text=data.text||'';
      save.href=url;save.download=data.filename;save.textContent='Download '+(data.filename.split('.').pop()||'file').toUpperCase();
      copy.hidden=!text;actions.hidden=false;renderOutput(out,data,url);status.textContent='Your result is ready.';
      if(matchMedia('(max-width:680px)').matches){
        const panel=work.querySelector('.ws-result');panel.focus({preventScroll:true});panel.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
      }
    } catch(error){if(current===revision)failure(error);}
    finally{if(current===revision){submit.disabled=example.disabled=false;work.removeAttribute('aria-busy');}}
  }
  form.addEventListener('submit',e=>{e.preventDefault();process();});
  example.addEventListener('click',async()=>{
    clear();const current=revision;form.reset();resetFaq?.();ranges();chooseFiles([]);
    example.disabled=submit.disabled=true;status.textContent='Preparing the example…';
    try {
      if(input){const {sampleFiles}=await import('./files.mjs');const files=await sampleFiles(key);if(current!==revision)return;chooseFiles(files);}
      if(current===revision)await process();
    } catch(error){if(current===revision){failure(error);submit.disabled=example.disabled=false;}}
  });
  copy.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(text);copy.textContent='Copied ✓';}
    catch{status.textContent='Copy is unavailable in this browser. Use Download to save the result.';}
  });
  window.addEventListener('pagehide',e=>{if(!e.persisted && url)URL.revokeObjectURL(url);});
}
librarySearch();
const form=document.querySelector('#ws-form');
if(form)workspace(form);
