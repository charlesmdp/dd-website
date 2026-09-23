/* Original island loader, revision 2. The original artwork and interactions, mounted without rehydrating the page. */
const hosts = [...document.querySelectorAll('[data-original-island]')];
let runtime;
function loadRuntime() {
  return runtime ||= Promise.all([
    import('./runtime-v3/original-components.mjs'),
    import('./runtime-v3/react.NIwe9ncM.mjs'),
  ]).then(([components, react]) => { react.n(); return {components, react}; });
}
const defaults = {
  Branding:{variant:'qPaZllgYP'}, Languages:{variant:'gopDKWNC_'},
  Speed:{variant:'oSqs_zKgk'}, Counter:{variant:'VFTEXj90e'}, Analytics:{variant:'IgwduN72V'},
  Dots:{animSpeed:90,gap:4,primaryColor:'rgb(249, 96, 43)',probability:4,radius:0,secondaryColor:'rgb(255, 255, 255)',shapeType:'Square',size:2},
};
async function mount(host) {
  if(host.dataset.islandReady) return;
  host.dataset.islandReady='loading';
  try {
    const {components,react} = await loadRuntime();
    const name=host.dataset.originalIsland;
    const root=react.r(host);
    const render=()=>root.render(react.u(components[name],{
      width:'100%',height:'100%',style:{width:'100%',...(name==='Steps'||name==='Branding'||name==='Languages'?{}:{height:'100%'})},
      ...(['Person','Border'].includes(name)?{style:{}}:{}),
      ...defaults[name],...(name==='Steps'?{variant:innerWidth<1080?'QcvFfXAMa':'mCKda7jN9'}:{}),
    }));
    render();
    host.dataset.islandReady='true';
    if(name==='Steps') {
      const accessibleSteps=()=>{host.querySelectorAll('p').forEach(p=>{if(p.textContent==='Upload your Digital Files')p.textContent='Create your digital product';if(p.textContent==='Automatically halt downloads sent to deceitful orders within Shopify.')p.textContent='This is simply done by uploading files on the app';});host.querySelectorAll('.framer-XjE9a,.framer-W70uZ,.framer-dP6zB').forEach(card=>{
        if(card.getAttribute('role')==='button')return;
        card.setAttribute('role','button');card.tabIndex=0;
        card.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();card.click();}});
      });};
      new MutationObserver(accessibleSteps).observe(host,{childList:true,subtree:true});
      accessibleSteps();
      let compact=innerWidth<1080;
      addEventListener('resize',()=>{if(compact!==(innerWidth<1080)){compact=innerWidth<1080;render();}},{passive:true});
    }
  } catch(error) {
    delete host.dataset.islandReady;
    console.error('Original homepage demo could not load:',error);
  }
}
const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){observer.unobserve(entry.target);mount(entry.target);}},{rootMargin:'650px'});
hosts.forEach(host=>observer.observe(host));
