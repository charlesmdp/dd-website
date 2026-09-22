(()=>{'use strict';
const root=document.querySelector('[data-framer-root]');
const sizes=['framer-1mmbk9o','framer-1g5988e','framer-1m3kwrs','framer-2otryb','framer-olvzre'];
function size(){if(!root)return;root.classList.remove(...sizes);root.classList.add(sizes[innerWidth>=1440?0:innerWidth>=1080?1:innerWidth>=810?2:innerWidth>=580?3:4]);}
size();addEventListener('resize',size,{passive:true});
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduced){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('home-entered');observer.unobserve(entry.target);}},{threshold:.05});document.querySelectorAll('[data-framer-root]>[id]:not(#hero)').forEach(e=>observer.observe(e));}
document.querySelectorAll('a[href]').forEach(a=>{const raw=a.getAttribute('href');if(raw?.startsWith('https://www.bigdigitaldownload.com'))a.setAttribute('href',raw.replace('https://www.bigdigitaldownload.com','')||'/');});
})();
(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const label=document.querySelector('#hero .framer-2vgzwx p');if(!label)return;const words=['Digital Products','Ebooks','Templates','License Keys','Music & Videos'];let current=0;setInterval(()=>{if(document.hidden)return;label.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-7px)'}],{duration:200,fill:'forwards'}).finished.then(()=>{label.textContent=words[++current%words.length];label.animate([{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:240,fill:'forwards'})});},3200);})();
