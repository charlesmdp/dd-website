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

/* Restore the real controls behind the homepage demonstrations. */
(()=>{'use strict';
const custom=document.querySelector('#use-cases');
// Native keyboard activation for the retained original visual controls.
custom?.querySelectorAll('[role=button]').forEach(control=>control.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();control.click();}}));
const brand=document.querySelector('[data-brand-demo]');
brand?.querySelectorAll('[data-brand-color]').forEach(button=>button.addEventListener('click',()=>{brand.style.setProperty('--demo-brand',button.dataset.brandColor);brand.querySelectorAll('[data-brand-color]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
custom?.querySelectorAll('[data-demo-logo]').forEach(button=>button.addEventListener('click',()=>{const target=custom.querySelector('[data-logo-preview]');const mark=document.createElement('span');mark.className='demo-logo-mark';const artwork=button.querySelector('svg').cloneNode(true);artwork.setAttribute('aria-hidden','true');mark.append(artwork);target.replaceChildren(mark);custom.querySelectorAll('[data-demo-logo]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
let alternateCopy=false;custom?.querySelector('[data-demo-copy]')?.addEventListener('click',event=>{alternateCopy=!alternateCopy;custom.querySelector('.framer-mt4494 p').textContent=alternateCopy?'A little something, just for you.':'Hey John 👋🏻';custom.querySelector('.framer-lskbd1 p').textContent=alternateCopy?'Your next adventure starts here. Enjoy your new digital collection!':'Thank you for purchasing from our store! Download your purchased files below.';event.currentTarget.setAttribute('aria-pressed',String(alternateCopy));});
const translations={en:['Download your Purchased Files','Dear { name }','🎉 Thank you for purchasing from our store!'],fr:['Téléchargez vos fichiers','Bonjour { name }','🎉 Merci pour votre achat dans notre boutique !'],zh:['下载您购买的文件','亲爱的 { name }','🎉 感谢您在我们的商店购买！']};
function language(lang){custom.querySelectorAll('[data-demo-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.demoLanguage===lang)));['.framer-j486z8 p','.framer-w6x8lp p','.framer-nhz5h4 p'].forEach((selector,i)=>{const p=custom.querySelector(selector);p.textContent=translations[lang][i];p.lang=lang;});}
custom?.querySelectorAll('[data-demo-language]').forEach(button=>button.addEventListener('click',()=>language(button.dataset.demoLanguage)));
custom?.querySelector('[data-cycle-language]')?.addEventListener('click',()=>{const keys=['en','zh','fr'];const active=custom.querySelector('[data-demo-language][aria-pressed=true]').dataset.demoLanguage;language(keys[(keys.indexOf(active)+1)%keys.length]);});
custom?.querySelector('[data-demo-sender]')?.addEventListener('click',event=>{const button=event.currentTarget,active=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(active));custom.querySelector('[data-sender-demo]').dataset.active=String(active);custom.querySelector('.framer-12pxh1y p').textContent=active?'hello@yourdomain.com':'john@example.com';custom.querySelector('.framer-16t42je p').textContent=active?'team@yourdomain.com':'john@example.com';button.querySelector('.framer-bmpz29 p').textContent=active?'Your brand. Your sender.':'Get your Domain Email';});
})();
