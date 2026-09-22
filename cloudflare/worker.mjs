// CONFIG is injected at build time. No credentials are part of this bundle.
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const jsonLD = value => JSON.stringify(value).replace(/</g, '\\u003c');
const cover = post => /^\/assets\/[a-zA-Z0-9_./-]+$/.test(post.cover_path) ? post.cover_path : '/assets/editorial/features-digital-commerce.webp';
const date = value => new Date(value+'T00:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
const articlePath = post => '/blog/'+encodeURIComponent(post.slug);
const postColumns = 'p.slug,p.title,p.description,p.cover_path,p.author,p.updated_at,p.reading_minutes,p.sort_order,c.name AS category';
const catalogueSQL = `SELECT ${postColumns} FROM posts p JOIN categories c ON c.slug=p.category_slug WHERE p.status='published' ORDER BY p.sort_order,p.updated_at DESC`;
const response = (body,status=200,type='text/html; charset=utf-8') => new Response(body,{status,headers:{'Content-Type':type}});

function documentHTML(path,title,description,body,post=null) {
  const url=CONFIG.base+path;
  const structured=post ? {'@context':'https://schema.org','@type':'BlogPosting',headline:post.title,description:post.description,dateModified:post.updated_at,author:{'@type':'Organization',name:post.author,url:CONFIG.base+'/ai'},publisher:{'@type':'Organization',name:'BIG Digital Downloads',url:CONFIG.base},mainEntityOfPage:url,image:CONFIG.base+cover(post)} : {'@context':'https://schema.org','@type':'Blog',name:title,url};
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${esc(url)}"><meta name="robots" content="index,follow,max-image-preview:large"><meta property="og:type" content="${post?'article':'website'}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(url)}">${post?`<meta property="og:image" content="${CONFIG.base+esc(cover(post))}">`:''}<meta name="twitter:card" content="${post?'summary_large_image':'summary'}"><link rel="icon" href="/assets/media/3aed8c41fe6de0b62874.png"><link rel="stylesheet" href="/assets/site.css?v=${CONFIG.version}"><link rel="stylesheet" href="/assets/design.css?v=${CONFIG.version}"><link rel="preload" href="/assets/media/adbcb664c8982395afde.woff2" as="font" type="font/woff2" crossorigin><script type="application/ld+json">${jsonLD(structured)}</script><script type="application/ld+json">${jsonLD({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:CONFIG.base+'/'},{'@type':'ListItem',position:2,name:'The BIG journal',item:CONFIG.base+'/blog'},...(post?[{'@type':'ListItem',position:3,name:post.title,item:url}]:[])]})}</script></head><body>${CONFIG.header}<main id="content">${body}</main>${CONFIG.footer}<script defer src="/assets/site.js?v=${CONFIG.version}"></script></body></html>`;
}
function card(p) {
 return `<a class="site-blog-card" data-search="${esc((p.title+' '+p.description).toLowerCase())}" data-category="${esc(p.category)}" href="${articlePath(p)}"><img src="${esc(cover(p))}" width="1536" height="1024" alt="" loading="lazy" decoding="async"><div class="text"><small>${esc(p.category)} · ${p.reading_minutes} min read</small><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><span class="read">Read the guide →</span></div></a>`;
}
function section(kicker,title,body) {
 return `<section class="site-section soft"><div class="site-wrap"><span class="site-kicker">${esc(kicker)}</span><h2>${esc(title)}</h2>${body}</div></section>`;
}
function blogIndex(posts) {
 const featured=posts.find(p=>p.sort_order===20)||posts[0];
 const secondary=[posts.find(p=>p.sort_order===19),posts.find(p=>p.sort_order===34)].filter(p=>p&&p!==featured);
 const hero=featured?`<div class="journal-feature-layout"><a class="journal-feature" href="${articlePath(featured)}"><img src="${esc(cover(featured))}" alt="" width="1536" height="1024" fetchpriority="high"><div><small>The starting point · ${featured.reading_minutes} min read</small><h2>${esc(featured.title)}</h2><span>Let’s get you selling →</span></div></a><div class="journal-side-stories">${secondary.map(p=>`<a class="journal-side-story" href="${articlePath(p)}"><img src="${esc(cover(p))}" width="1536" height="1024" alt=""><div><small>${esc(p.category)}</small><h3>${esc(p.title)}</h3><span>${p.reading_minutes} min read →</span></div></a>`).join('')}</div></div>`:'';
 const categories=[...new Set(posts.map(p=>p.category))].sort();
 const body=`<section class="journal-masthead"><div class="site-wrap"><div class="journal-title"><div><span class="site-kicker">Ideas. Insights. Your next big thing.</span><h1>The BIG <em>journal.</em></h1></div><p>Make something great.<br>Build a business around it.</p></div>${hero}</div></section>`+section(`${posts.length} guides. Plenty of possibilities.`,'A little knowledge goes a long way.',`<div class="site-search"><input id="article-search" type="search" placeholder="Search ebooks, templates, delivery…" aria-label="Search articles"><select id="article-category" aria-label="Filter articles by topic"><option value="">All topics</option>${categories.map(c=>`<option>${esc(c)}</option>`).join('')}</select></div><p id="search-status" class="site-note" aria-live="polite">${posts.length} articles</p><div class="site-grid">${posts.map(card).join('')}</div><p id="search-empty" class="site-empty" ${posts.length?'hidden':''}>No matching guide yet. Try another keyword or topic.</p>`);
 return documentHTML('/blog','Shopify Digital Product Guides & Ideas | BIG Journal','Practical guides to selling ebooks, templates, software, music and other digital products on Shopify. Learn delivery, protection, pricing and growth.',body);
}
function sourcesHTML(post,sources) {
 return `<h2 id="sources">Sources & review</h2><p>Updated ${esc(date(post.updated_at))} by ${esc(post.author)}. Product capabilities and prices can change; check the official source before choosing a subscription. Examples are illustrative, not customer results or income guarantees.</p><ul>${sources.map(s=>`<li><a href="${esc(s.url)}" rel="noopener">${esc(s.label)}</a></li>`).join('')}</ul>`;
}
function articleHTML(post,sources,related) {
 const toc=JSON.parse(post.toc_json);
 const body=`<div class="reading-progress" aria-hidden="true"></div><header class="article-hero"><div class="site-wrap"><div class="site-breadcrumb"><a href="/">Home</a> / <a href="/blog">The BIG journal</a> / ${esc(post.category)}</div><div class="article-heading-grid"><div><span class="site-kicker">${esc(post.category)}</span><h1>${esc(post.title)}</h1><div class="article-byline"><img src="/assets/media/3aed8c41fe6de0b62874.png" width="40" height="40" alt=""><div><strong>${esc(post.author)}</strong><span>${esc(date(post.updated_at))} · ${post.reading_minutes} min read</span></div></div></div><img class="article-cover" src="${esc(cover(post))}" width="1536" height="1024" alt="" fetchpriority="high"></div></div></header><div class="site-wrap article-content-wrap"><div class="site-editorial"><article class="site-prose"><details class="article-toc"><summary><span>In this guide</span><span class="toc-label">Jump to a section +</span></summary><nav aria-label="Article contents">${toc.map(([id,title])=>`<a href="#${esc(id)}">${esc(title)}</a>`).join('')}<a href="#sources">Sources & review</a></nav></details>${post.body_html}${sourcesHTML(post,sources)}<p class="article-plain"><a href="${articlePath(post)}.md">Read this guide as plain text →</a></p></article></div></div>`+(related.length?section('Keep learning','A useful next read.',`<div class="site-grid">${related.map(card).join('')}</div>`):'')+CONFIG.cta;
 return documentHTML(articlePath(post),post.title+' | BIG',post.description,body,post);
}
function markdown(post,sources) {
 return `# ${post.title}\n\nSource: ${CONFIG.base+articlePath(post)}\n\nUpdated: ${post.updated_at}\n\n${post.body_markdown}\n\n## Sources\n\n${sources.map(s=>`- [${s.label}](${s.url})`).join('\n')}\n`;
}
async function missing(request,env) {
 const asset=await env.ASSETS.fetch(new Request(new URL('/404.html',request.url),request));
 return new Response(asset.body,{status:404,headers:asset.headers});
}
async function staticPage(request,env,path) {
 const file=CONFIG.staticFiles[path];
 if(!file)return env.ASSETS.fetch(request);
 const asset=await env.ASSETS.fetch(new Request(new URL(file,request.url),request));
 const headers=new Headers(asset.headers);headers.set('Content-Type','text/html; charset=utf-8');
 return new Response(asset.body,{status:asset.status,headers});
}
async function route(request,env) {
 const url=new URL(request.url), path=url.pathname;
 if (!['GET','HEAD'].includes(request.method)) return response('Method not allowed',405,'text/plain; charset=utf-8');
 if(url.hostname==='bigdigitaldownload.com')return Response.redirect('https://www.bigdigitaldownload.com'+path+url.search,301);
 if(path.startsWith('/_html/'))return missing(request,env);
 if(path==='/robots.txt')return response('User-agent: *\nAllow: /\n'+(url.hostname===new URL(CONFIG.base).hostname?'\nSitemap: '+CONFIG.base+'/sitemap.xml\n':''),200,'text/plain; charset=utf-8');
 const clean=path.replace(/\/index\.html$/,'').replace(/\/$/,'')||'/';
 if(path!==clean && CONFIG.pages[clean])return Response.redirect(new URL(clean+url.search,url.origin),301);
 if (path==='/api/health') {
  if (!env.DB) return response(JSON.stringify({ok:false,database:'not_bound'}),503,'application/json');
  const row=await env.DB.prepare("SELECT COUNT(*) AS count FROM posts WHERE status='published'").first();
  return response(JSON.stringify({ok:true,database:'ready',publishedArticles:row.count}),200,'application/json');
 }
 // The initial static library remains reviewable before the Pages DB binding is added.
 if (!env.DB) return staticPage(request,env,path);
 if (path.startsWith('/blog/')) {
  const redirect=await env.DB.prepare('SELECT target_path,status_code FROM redirects WHERE source_path=?').bind(path).first();
  if (redirect && /^\/(?!\/)/.test(redirect.target_path) && !/[\\\r\n]/.test(redirect.target_path)) return Response.redirect(new URL(redirect.target_path,url.origin),redirect.status_code);
 }
 if (path==='/blog/' || path==='/blog/index.html') return Response.redirect(new URL('/blog',url.origin),301);
 if (path==='/blog') return response(blogIndex((await env.DB.prepare(catalogueSQL).all()).results));
 if (path.startsWith('/blog/')) {
  let decoded;
  try { decoded=decodeURIComponent(path.slice(6)); } catch { return missing(request,env); }
  const suffix=decoded.endsWith('/index.html')?'/index.html':decoded.endsWith('/')?'/':decoded.endsWith('.md')?'.md':'';
  const slug=suffix?decoded.slice(0,-suffix.length):decoded;
  if (!/^[a-z0-9().-]{1,180}$/.test(slug)) return missing(request,env);
  const match=[path,slug,suffix];
  const post=await env.DB.prepare(`SELECT ${postColumns},p.body_html,p.body_markdown,p.toc_json,p.category_slug FROM posts p JOIN categories c ON c.slug=p.category_slug WHERE p.slug=? AND p.status='published'`).bind(match[1]).first();
  if (!post) return missing(request,env);
  if (match[2] && match[2]!=='.md') return Response.redirect(new URL(articlePath(post),url.origin),301);
  const sources=(await env.DB.prepare('SELECT label,url FROM post_sources WHERE post_slug=? ORDER BY position').bind(post.slug).all()).results;
  if (match[2]==='.md') return response(markdown(post,sources),200,'text/markdown; charset=utf-8');
  const related=(await env.DB.prepare(`SELECT ${postColumns} FROM posts p JOIN categories c ON c.slug=p.category_slug WHERE p.status='published' AND p.category_slug=? AND p.slug!=? ORDER BY p.sort_order LIMIT 3`).bind(post.category_slug,post.slug).all()).results;
  return response(articleHTML(post,sources,related));
 }
 if (path==='/sitemap.xml') {
  const posts=(await env.DB.prepare("SELECT slug,updated_at FROM posts WHERE status='published' ORDER BY slug").all()).results;
  return response('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+Object.keys(CONFIG.pages).map(p=>`<url><loc>${esc(CONFIG.base+p)}</loc></url>`).join('')+posts.map(p=>`<url><loc>${esc(CONFIG.base+articlePath(p))}</loc><lastmod>${esc(p.updated_at)}</lastmod></url>`).join('')+'</urlset>',200,'application/xml; charset=utf-8');
 }
 if (path==='/llms-txt') return Response.redirect(new URL('/llms.txt',url.origin),301);
 if (path==='/llms.txt'||path==='/llms-full.txt') {
  const posts=(await env.DB.prepare(catalogueSQL).all()).results;
  let body=CONFIG.shortAI+'## Pages\n\n'+Object.entries(CONFIG.pages).map(([p,d])=>`- [${d.title}](${CONFIG.base+p})`).join('\n')+'\n\n## Journal\n\n'+posts.map(p=>`- [${p.title}](${CONFIG.base+articlePath(p)}.md)`).join('\n');
  if (path==='/llms-full.txt') {
   const full=(await env.DB.prepare("SELECT slug,title,body_markdown FROM posts WHERE status='published' ORDER BY sort_order").all()).results;
   body+='\n\n'+CONFIG.fullStaticText+'\n\n'+full.map(p=>`# ${p.title}\n\nSource: ${CONFIG.base+articlePath(p)}\n\n${p.body_markdown}`).join('\n\n');
  }
  return response(body,200,'text/plain; charset=utf-8');
 }
 return staticPage(request,env,path);
}
export default {
 async fetch(request,env) {
  let result;
  try { result=await route(request,env); }
  catch(error) {
   console.error('Content service failed:',error.name);
   result=response(documentHTML('/blog','The journal will be back shortly | BIG','Our journal is temporarily unavailable.',section('A short pause','The journal will be back shortly.','<p>We couldn’t load this page. Please try again in a moment.</p><a class="site-button" href="/">Back to BIG →</a>')),503);
   result.headers.set('Retry-After','60');
  }
  const headers=new Headers(result.headers);
  headers.set('X-Content-Type-Options','nosniff');
  headers.set('Referrer-Policy','strict-origin-when-cross-origin');
  headers.set('X-Frame-Options','SAMEORIGIN');
  const url=new URL(request.url);
  const isPreview=url.hostname!==new URL(CONFIG.base).hostname;
  const robots=isPreview?'noindex, nofollow':result.status>=400?'noindex, follow':'index, follow, max-image-preview:large';
  if (isPreview || result.status>=400 || url.pathname.endsWith('.md') || url.pathname.startsWith('/llms') || url.pathname==='/api/health') headers.set('X-Robots-Tag',isPreview?'noindex, nofollow':'noindex, follow');
  if((result.headers.get('Content-Type')||'').includes('text/html')) {
    result=new HTMLRewriter().on('meta[name="robots"]',{element(el){el.setAttribute('content',robots);}}).transform(result);
    headers.delete('Content-Length');headers.delete('ETag');
  }
  if (url.pathname.startsWith('/blog') || url.pathname==='/sitemap.xml' || url.pathname.startsWith('/llms') || url.pathname==='/api/health') headers.set('Cache-Control','no-cache');
  return new Response(request.method==='HEAD'?null:result.body,{status:result.status,statusText:result.statusText,headers});
 }
};
