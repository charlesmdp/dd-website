import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const state=mkdtempSync(join(tmpdir(),'bdd-d1-test-'));
const wrangler=resolve('node_modules/.bin/wrangler');
const base='http://127.0.0.1:8790';
const env={...process.env,WRANGLER_SEND_METRICS:'false',WRANGLER_LOG_PATH:join(state,'wrangler.log')};
const articles=JSON.parse(readFileSync('content/blog-manifest.json','utf8'));
let server, output='';
function cli(args) {
 const result=spawnSync(wrangler,args,{encoding:'utf8',env});
 assert.equal(result.status,0,result.stdout+result.stderr);
}
function execute(sql) {
 const file=join(state,'test.sql');writeFileSync(file,sql);
 cli(['d1','execute','DB','--local','--config','wrangler.local.jsonc','--persist-to',state,'--file',file]);
}
before(async()=>{
 cli(['d1','migrations','apply','DB','--local','--config','wrangler.local.jsonc','--persist-to',state]);
 server=spawn(wrangler,['pages','dev','dist','--d1','DB=00000000-0000-0000-0000-000000000001','--compatibility-date','2026-09-22','--port','8790','--persist-to',state],{env,stdio:['ignore','pipe','pipe']});
 server.stdout.on('data',data=>output+=data);server.stderr.on('data',data=>output+=data);
 for(let i=0;i<100;i++) {
  try { const r=await fetch(base+'/api/health');if(r.ok)return; } catch {}
  await new Promise(r=>setTimeout(r,200));
 }
 throw new Error('Local worker did not start: '+output);
});
after(async()=>{
 if(server&&server.exitCode===null){server.kill('SIGTERM');await new Promise(r=>server.once('exit',r));}
 rmSync(state,{recursive:true,force:true});
});

test('40 published articles are rendered as HTML by the real Pages/D1 runtime',async()=>{
 const health=await (await fetch(base+'/api/health')).json();assert.equal(health.publishedArticles,40);
 for(const a of articles){
  const r=await fetch(base+'/blog/'+encodeURIComponent(a.slug));assert.equal(r.status,200,a.slug);
  const html=await r.text();assert.ok(html.includes('<h1>'),a.slug);assert.ok(html.includes('application/ld+json'),a.slug);
  assert.ok(html.includes('rel="canonical"'),a.slug);assert.ok(html.includes('id="sources"'),a.slug);
 }
});
test('live D1 edits update HTML, metadata, index and plain text without rebuilding',async()=>{
 const slug=articles[0].slug;
 execute(`UPDATE posts SET title='D1 live edit <proof>',body_html='<p>Live body from D1.</p>',body_markdown='Live body from D1.' WHERE slug='${slug}';`);
 const page=await (await fetch(base+'/blog/'+slug)).text();
 assert.ok(page.includes('<h1>D1 live edit &lt;proof&gt;</h1>'));
 assert.ok(page.includes('Live body from D1.'));assert.ok(page.includes('D1 live edit \\u003cproof'));
 const index=await (await fetch(base+'/blog')).text();assert.ok(index.includes('D1 live edit &lt;proof&gt;'));
 const md=await fetch(base+'/blog/'+slug+'.md');assert.match(md.headers.get('Content-Type'),/markdown/);assert.ok((await md.text()).includes('Live body from D1.'));
});
test('draft content is not served via HTML, markdown, static aliases, sitemap or AI text',async()=>{
 const slug=articles[0].slug;
 execute(`UPDATE posts SET status='draft' WHERE slug='${slug}';`);
 for(const suffix of ['', '.md','/','/index.html'])assert.equal((await fetch(base+'/blog/'+slug+suffix)).status,404,suffix);
 for(const path of ['/blog','/sitemap.xml','/llms.txt','/llms-full.txt'])assert.ok(!(await (await fetch(base+path)).text()).includes(slug),path);
});
test('published new content appears in sitemap and canonical redirects preserve old URLs',async()=>{
 execute("INSERT INTO posts SELECT 'test-d1-new-guide','A new guide',description,category_slug,body_html,body_markdown,cover_path,author,updated_at,reading_minutes,toc_json,'published',101 FROM posts LIMIT 1; INSERT INTO redirects VALUES('/blog/old-guide','/blog/test-d1-new-guide',301);");
 const xml=await (await fetch(base+'/sitemap.xml')).text();assert.ok(xml.includes('/blog/test-d1-new-guide'));
 const redirect=await fetch(base+'/blog/old-guide',{redirect:'manual'});assert.equal(redirect.status,301);assert.equal(redirect.headers.get('Location'),base+'/blog/test-d1-new-guide');
 assert.equal((await fetch(base+'/blog/test-d1-new-guide/')).status,200);
});
test('preview noindex, correct errors and static marketing delivery',async()=>{
 for(const path of ['/','/features','/big-digital-downloads-vs-pdf-pendora']){
  const r=await fetch(base+path,{redirect:'manual'});assert.equal(r.status,200,path);
  const text=await r.text();assert.ok(/<meta(?=[^>]*name="robots")(?=[^>]*content="noindex, nofollow")[^>]*>/.test(text),path+" preview robots");assert.equal(r.headers.get('X-Robots-Tag'),'noindex, nofollow');
 }
 assert.equal((await fetch(base+'/blog/no-such-guide')).status,404);
 assert.equal((await fetch(base+'/no-such-page')).status,404);
 assert.equal((await fetch(base+'/blog/%27%20OR%201%3D1--')).status,404);
 assert.equal((await fetch(base+'/blog',{method:'POST'})).status,405);
});
test('editor updates HTML, markdown, sources and publication state together',async()=>{
 const sample=JSON.parse(readFileSync('content/article-example.json','utf8'));
 sample.title="A creator's new <guide>";
 const file=join(state,'article.json');writeFileSync(file,JSON.stringify(sample));
 const save=()=>{
  const r=spawnSync(resolve('.venv/bin/python'),['scripts/save_article.py',file,'--persist-to',state],{encoding:'utf8',env});
  assert.equal(r.status,0,r.stdout+r.stderr);
 };
 save();assert.equal((await fetch(base+'/blog/'+sample.slug)).status,404);
 sample.status='published';writeFileSync(file,JSON.stringify(sample));save();
 const r=await fetch(base+'/blog/'+sample.slug);assert.equal(r.status,200);
 const html=await r.text();assert.ok(html.includes('A creator&#39;s new &lt;guide&gt;'));assert.ok(html.includes('id="section-1"'));
 const md=await (await fetch(base+'/blog/'+sample.slug+'.md')).text();assert.ok(md.includes('## Prepare your product'));assert.ok(md.includes('Shopify: digital products'));
});
test('missing binding is explicit in health; database failures return a temporary error',async()=>{
 globalThis.HTMLRewriter=class {on(){return this}transform(result){return result}};
 const worker=(await import('../dist/_worker.js')).default;
 const assets={fetch:async()=>new Response('Static initial preview')};
 const missing=await worker.fetch(new Request(base+'/api/health'),{ASSETS:assets});assert.equal(missing.status,503);assert.equal((await missing.json()).database,'not_bound');
 const staticPreview=await worker.fetch(new Request(base+'/blog'),{ASSETS:assets});assert.equal(await staticPreview.text(),'Static initial preview');
 // HTML transformation is exercised by the real worker tests above; Node has no HTMLRewriter.
 globalThis.HTMLRewriter=class {on(){return this}transform(result){return result}};
 const broken=await worker.fetch(new Request(base+'/blog'),{ASSETS:assets,DB:{prepare(){throw new Error('test outage')}}});assert.equal(broken.status,503);assert.equal(broken.headers.get('Retry-After'),'60');assert.ok((await broken.text()).includes('The journal will be back shortly'));
});

test('canonical marketing paths are 200 and slash aliases redirect once',async()=>{
 const pages=JSON.parse(readFileSync('content/page-manifest.json','utf8'));
 for(const path of Object.keys(pages).filter(p=>!p.startsWith('/blog/')&&p!=='/')){
  const canonical=await fetch(base+path,{redirect:'manual'});assert.equal(canonical.status,200,path);
  const alias=await fetch(base+path+'/',{redirect:'manual'});assert.equal(alias.status,301,path);assert.equal(alias.headers.get('location'),base+path);
 }
 const home=await (await fetch(base)).text();assert.equal((home.match(/<h1[ >]/g)||[]).length,1);assert.ok(Buffer.byteLength(home)<700000);assert.ok(home.includes('5.0/5 from 862 Shopify reviews'));assert.ok(home.includes('id="live-support"'));
});
test('article reading layout has an inline contents panel and illustrated content',async()=>{
 const r=await fetch(base+'/blog/'+articles[19].slug);const html=await r.text();
 assert.ok(html.includes('<details class="article-toc">'));assert.ok(!html.includes('<aside class="site-toc">'));assert.ok(html.includes('class="article-figure"'));assert.ok(html.includes('class="article-example"'));
});

test('production is indexable, previews are not, and the apex redirects to www',async()=>{
 const {Miniflare,convertV4MiniflareOptions}=await import('miniflare');
 const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:readFileSync('dist/_worker.js','utf8'),compatibilityDate:'2026-09-22',serviceBindings:{ASSETS:async request=>new Response(readFileSync(join(resolve('dist'),new URL(request.url).pathname)),{headers:{'Content-Type':'application/octet-stream'}})}}));
 try {
  for(const [host,robots] of [['www.bigdigitaldownload.com','index, follow, max-image-preview:large'],['dd-website-cl5.pages.dev','noindex, nofollow']]){
   const r=await mf.dispatchFetch('https://'+host+'/features');assert.equal(r.status,200);
   const html=await r.text();assert.ok(html.includes('content="'+robots+'"'),host);assert.ok(html.includes('https://www.bigdigitaldownload.com/features'));
  }
  const apex=await mf.dispatchFetch('https://bigdigitaldownload.com/features?ref=test',{redirect:'manual'});
  assert.equal(apex.status,301);assert.equal(apex.headers.get('location'),'https://www.bigdigitaldownload.com/features?ref=test');
 } finally {await mf.dispose()}
});
