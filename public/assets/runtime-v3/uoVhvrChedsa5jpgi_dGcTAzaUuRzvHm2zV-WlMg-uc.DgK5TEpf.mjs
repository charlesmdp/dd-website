import{t as e}from"./rolldown-runtime.Dh6celcD.mjs";import{J as t,W as n,x as r}from"./framer.CydEdgn4.mjs";async function i(e,t,n){let r=d[e],i=r?await r(t,n):void 0,a={bodyEnd:[],bodyStart:[],headEnd:[],headStart:[]};for(let t of l){if(t.pageIds&&!t.pageIds.has(e))continue;let n=t.code(i);n&&a[t.placement].push({...t,code:n})}return a}var a,o,s,c,l,u,d,f,p;e((()=>{t(),a=e=>typeof e==`string`?e.replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`):``,o=e=>{let t=JSON.stringify(e);return typeof t==`string`?t.replace(/<\/(script|style)/gi,`<\\/$1`):t},s=e=>typeof e==`string`?e:String(e),c=e=>typeof e==`object`&&e&&typeof e.src==`string`?e.src:typeof e==`string`?e:void 0,l=[{code:e=>`<!-- Reading Progress Bar -->\r
<style>\r
#reading-progress {\r
  position: fixed;\r
  top: 0;\r
  left: 0;\r
  width: 0%;\r
  height: 4px;\r
  background: #E8600A;\r
  z-index: 9999;\r
  transition: width 0.1s ease-out;\r
}\r
</style>\r
\r
<div id="reading-progress"></div>\r
\r
<script>\r
window.addEventListener("scroll", () => {\r
  const scrollTop = window.scrollY;\r
  const docHeight = document.body.scrollHeight - window.innerHeight;\r
  const progress = (scrollTop / docHeight) * 100;\r
  document.getElementById("reading-progress").style.width = progress + "%";\r
});\r
<\/script>`,id:`PzRxBNXXz`,loadMode:`once`,name:`Reading Progress Bar`,pageIds:new Set([`laHrDjJ5i`]),placement:`bodyEnd`},{code:e=>{let t=e?.oUrnuHZfq??``,n=e?.gTEiY8mCm??``,r=e?.aanAcPPI1,i=e?.Oq3rJECoL,l=e?.updatedAt,u=e?.MNDPyEtDT??``;return`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": ${t===void 0?`{{oUrnuHZfq | json}}`:s(o(a(t)))},
  "description": ${n===void 0?`{{gTEiY8mCm | json}}`:s(o(a(n)))},
  "image": ${r===void 0?`{{aanAcPPI1 | json}}`:s(o(a(c(r))))},
  "datePublished": ${i===void 0?`{{Oq3rJECoL | json}}`:s(o(a(i)))},
  "dateModified": ${l===void 0?`{{updatedAt | json}}`:s(o(a(l)))},
  "inLanguage": "en",
  "author": {
    "@type": "Organization",
    "name": "Big Digital Downloads",
    "url": "https://www.bigdigitaldownload.com"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Big Digital Downloads",
    "url": "https://www.bigdigitaldownload.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.bigdigitaldownload.com/favicon.ico"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.bigdigitaldownload.com/blog/${u===void 0?`{{MNDPyEtDT}}`:s(a(u))}"
  }
}
<\/script>`},id:`Ot_jedtSR`,loadMode:`once`,name:`Article Schema Markup`,pageIds:new Set([`laHrDjJ5i`]),placement:`headStart`},{code:e=>(e?.oUrnuHZfq,e?.gTEiY8mCm,e?.aanAcPPI1,e?.Oq3rJECoL,e?.updatedAt,e?.MNDPyEtDT,`<script>\r
document.addEventListener("DOMContentLoaded", function () {\r
  // Find the FAQ section heading (H2 that contains "FAQ")\r
  var headings = document.querySelectorAll("h2");\r
  var faqHeading = null;\r
 \r
  for (var i = 0; i < headings.length; i++) {\r
    if (headings[i].textContent.toLowerCase().includes("faq")) {\r
      faqHeading = headings[i];\r
      break;\r
    }\r
  }\r
 \r
  if (!faqHeading) return;\r
 \r
  // Collect all H3s after the FAQ H2 until the next H2 or end of content\r
  var faqItems = [];\r
  var sibling = faqHeading.nextElementSibling;\r
 \r
  var currentQuestion = null;\r
  var currentAnswer = [];\r
 \r
  while (sibling && sibling.tagName !== "H2") {\r
    if (sibling.tagName === "H3") {\r
      // Save previous Q&A pair\r
      if (currentQuestion) {\r
        faqItems.push({\r
          "@type": "Question",\r
          "name": currentQuestion,\r
          "acceptedAnswer": {\r
            "@type": "Answer",\r
            "text": currentAnswer.join(" ").trim()\r
          }\r
        });\r
      }\r
      currentQuestion = sibling.textContent.trim();\r
      currentAnswer = [];\r
    } else if (currentQuestion && sibling.textContent.trim()) {\r
      currentAnswer.push(sibling.textContent.trim());\r
    }\r
    sibling = sibling.nextElementSibling;\r
  }\r
 \r
  // Save the last Q&A pair\r
  if (currentQuestion) {\r
    faqItems.push({\r
      "@type": "Question",\r
      "name": currentQuestion,\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": currentAnswer.join(" ").trim()\r
      }\r
    });\r
  }\r
 \r
  // Only inject schema if we found FAQ items\r
  if (faqItems.length === 0) return;\r
 \r
  var schema = {\r
    "@context": "https://schema.org",\r
    "@type": "FAQPage",\r
    "mainEntity": faqItems\r
  };\r
 \r
  var script = document.createElement("script");\r
  script.type = "application/ld+json";\r
  script.textContent = JSON.stringify(schema);\r
  document.head.appendChild(script);\r
});\r
<\/script>`),id:`Nvp7i64L6`,loadMode:`once`,name:`FAQ Schema Generator`,pageIds:new Set([`laHrDjJ5i`]),placement:`bodyEnd`},{code:e=>{let t=e?.oUrnuHZfq??``;e?.gTEiY8mCm,e?.aanAcPPI1,e?.Oq3rJECoL,e?.updatedAt;let n=e?.MNDPyEtDT??``;return`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.bigdigitaldownload.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://www.bigdigitaldownload.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": ${t===void 0?`{{oUrnuHZfq | json}}`:s(o(a(t)))},
      "item": "https://www.bigdigitaldownload.com/blog/${n===void 0?`{{MNDPyEtDT}}`:s(a(n))}"
    }
  ]
}
<\/script>`},id:`nghFGpbO2`,loadMode:`once`,name:`Breadcrumb Schema Markup`,pageIds:new Set([`laHrDjJ5i`]),placement:`headStart`},{code:e=>(e?.oUrnuHZfq,e?.gTEiY8mCm,e?.aanAcPPI1,e?.Oq3rJECoL,e?.updatedAt,e?.MNDPyEtDT,`<script>\r
(function(){\r
  var slug = window.location.pathname;\r
  if(slug.indexOf("digital-product-ideas") === -1) return;\r
 \r
  var css = document.createElement("style");\r
  css.textContent = '.rc-wrap{max-width:680px;margin:32px auto;background:#fff;border-radius:14px;border:1px solid #e5e7eb;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;box-shadow:0 2px 12px rgba(0,0,0,0.06)}'+\r
  '.rc-head{padding:22px 24px 0;text-align:center}'+\r
  '.rc-badge{display:inline-flex;align-items:center;gap:6px;background:#FFF3EC;color:#E8600A;font-size:11px;font-weight:600;padding:5px 12px;border-radius:20px;margin-bottom:12px;letter-spacing:.03em;text-transform:uppercase}'+\r
  '.rc-title{font-size:20px;font-weight:700;color:#1a1a1a;margin:0 0 6px;line-height:1.3}'+\r
  '.rc-sub{font-size:13px;color:#6b7280;margin:0 0 20px;line-height:1.5}'+\r
  '.rc-div{height:1px;background:#e5e7eb;margin:0 24px}'+\r
  '.rc-sliders{padding:20px 24px}'+\r
  '.rc-slider-group{margin-bottom:20px}'+\r
  '.rc-slider-group:last-child{margin-bottom:0}'+\r
  '.rc-slider-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px}'+\r
  '.rc-slider-label{font-size:13px;font-weight:500;color:#1a1a1a}'+\r
  '.rc-slider-val{font-size:16px;font-weight:600;color:#1a1a1a;font-variant-numeric:tabular-nums}'+\r
  '.rc-track{position:relative;height:5px;background:#e5e7eb;border-radius:3px}'+\r
  '.rc-fill{position:absolute;left:0;top:0;height:100%;background:#E8600A;border-radius:3px;pointer-events:none;transition:width 0.1s}'+\r
  '.rc-input{position:absolute;top:-9px;left:0;width:100%;height:22px;-webkit-appearance:none;appearance:none;background:transparent;cursor:pointer;margin:0}'+\r
  '.rc-input::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#fff;border:3px solid #E8600A;box-shadow:0 1px 4px rgba(0,0,0,.15);cursor:pointer}'+\r
  '.rc-input::-moz-range-thumb{width:20px;height:20px;border-radius:50%;background:#fff;border:3px solid #E8600A;box-shadow:0 1px 4px rgba(0,0,0,.15);cursor:pointer}'+\r
  '.rc-input:focus{outline:none}'+\r
  '.rc-range{display:flex;justify-content:space-between;margin-top:5px;font-size:10px;color:#9ca3af}'+\r
  '.rc-results{padding:20px 24px}'+\r
  '.rc-results-label{font-size:10px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;margin-bottom:12px}'+\r
  '.rc-cards{display:flex;flex-wrap:wrap;gap:10px}'+\r
  '.rc-card{flex:1 1 45%;min-width:130px;padding:16px 14px;border-radius:10px;text-align:center;background:#fff;border:1px solid #e5e7eb}'+\r
  '.rc-card-hl{background:#E8600A !important;border:none !important}'+\r
  '.rc-card-val{font-size:22px;font-weight:700;color:#1a1a1a;font-variant-numeric:tabular-nums;line-height:1.2;margin-bottom:3px}'+\r
  '.rc-card-hl .rc-card-val{color:#fff !important}'+\r
  '.rc-card-lbl{font-size:11px;font-weight:500;color:#6b7280;line-height:1.3}'+\r
  '.rc-card-hl .rc-card-lbl{color:rgba(255,255,255,.85) !important}'+\r
  '.rc-card-sub{font-size:10px;color:#9ca3af;margin-top:3px}'+\r
  '.rc-card-hl .rc-card-sub{color:rgba(255,255,255,.7) !important}'+\r
  '.rc-compare{padding:0 24px 20px}'+\r
  '.rc-compare-box{background:#f8f8f8;border-radius:10px;padding:16px 20px}'+\r
  '.rc-compare-title{font-size:12px;font-weight:600;color:#1a1a1a;margin-bottom:12px}'+\r
  '.rc-bar-group{margin-bottom:10px}'+\r
  '.rc-bar-top{display:flex;justify-content:space-between;margin-bottom:5px}'+\r
  '.rc-bar-lbl{font-size:11px;color:#6b7280}'+\r
  '.rc-bar-val{font-size:12px;font-weight:600}'+\r
  '.rc-bar-val-o{color:#E8600A}'+\r
  '.rc-bar-val-g{color:#6b7280}'+\r
  '.rc-bar-track{height:8px;background:#FFE0CC;border-radius:4px;overflow:hidden}'+\r
  '.rc-bar-fill-o{height:100%;background:#E8600A;border-radius:4px;width:100%}'+\r
  '.rc-bar-track-g{height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden}'+\r
  '.rc-bar-fill-g{height:100%;width:33.3%;background:#9ca3af;border-radius:4px}'+\r
  '.rc-extra{text-align:center;padding:10px 14px;background:#FFF3EC;border-radius:8px;font-size:13px;font-weight:600;color:#E8600A;margin-top:12px}'+\r
  '.rc-cta{padding:0 24px 24px;text-align:center}'+\r
  '.rc-cta a{display:inline-flex;align-items:center;gap:8px;padding:12px 24px;background:#E8600A;color:#fff;font-size:14px;font-weight:600;border-radius:10px;text-decoration:none;box-shadow:0 2px 8px rgba(232,96,10,.25)}'+\r
  '.rc-cta a:hover{opacity:.9}'+\r
  '.rc-cta p{font-size:11px;color:#6b7280;margin:8px 0 0}'+\r
  '@media(max-width:600px){.rc-head,.rc-sliders,.rc-results,.rc-compare,.rc-cta{padding-left:16px !important;padding-right:16px !important}.rc-div{margin:0 16px !important}.rc-card{flex:1 1 100% !important}.rc-title{font-size:18px !important}.rc-card-val{font-size:20px !important}.rc-slider-val{font-size:15px !important}}';\r
  document.head.appendChild(css);\r
\r
if (window.frameElement) {\r
  window.frameElement.setAttribute("title", "Digital Product Revenue Calculator");\r
}\r
 \r
  var attempts = 0;\r
 \r
  function tryInject(){\r
    attempts++;\r
    var bc = document.getElementById("toc-headings-source");\r
    if(!bc || !bc.querySelector("h2")){\r
      if(attempts < 50) setTimeout(tryInject, 200);\r
      return;\r
    }\r
 \r
    var headings = bc.querySelectorAll("h2");\r
    var faqH = null;\r
    for(var i=0;i<headings.length;i++){\r
      if(headings[i].textContent.toLowerCase().includes("faq")){faqH=headings[i];break}\r
    }\r
 \r
    var state = {price:29, visitors:2000, conv:2.5, products:5};\r
 \r
    function fmt(n){\r
      if(n>=1000000) return "$"+(n/1000000).toFixed(1)+"M";\r
      if(n>=1000) return "$"+(n/1000).toFixed(n>=10000?0:1)+"K";\r
      return "$"+n.toFixed(0);\r
    }\r
 \r
    function calc(){\r
      var orders = Math.round(state.visitors*(state.conv/100));\r
      var catalogBoost = 1 + Math.min((state.products - 1) * 0.06, 1.5);\r
      var monthly = Math.round(orders * state.price * catalogBoost);\r
      var annual = monthly*12;\r
      return {orders:orders,monthly:monthly,annual:annual,digProfit:Math.round(annual*0.9),physProfit:Math.round(annual*0.3),extra:Math.round(annual*0.6),rpv:state.visitors>0?(monthly/state.visitors):0,catalogBoost:catalogBoost};\r
    }\r
 \r
    function update(){\r
      var r = calc();\r
      document.getElementById("rc-v-price").textContent = "$"+state.price;\r
      document.getElementById("rc-v-visitors").textContent = state.visitors.toLocaleString();\r
      document.getElementById("rc-v-conv").textContent = state.conv+"%";\r
      document.getElementById("rc-v-products").textContent = state.products + " products";\r
      document.getElementById("rc-f-price").style.width = ((state.price-5)/195*100)+"%";\r
      document.getElementById("rc-f-visitors").style.width = ((state.visitors-100)/49900*100)+"%";\r
      document.getElementById("rc-f-conv").style.width = ((state.conv-0.5)/9.5*100)+"%";\r
      document.getElementById("rc-f-products").style.width = ((state.products-1)/49*100)+"%";\r
      document.getElementById("rc-monthly").textContent = fmt(r.monthly);\r
      document.getElementById("rc-annual").textContent = fmt(r.annual);\r
      document.getElementById("rc-orders").textContent = r.orders.toLocaleString();\r
      document.getElementById("rc-rpv").textContent = Math.round(r.catalogBoost*100)+"% catalog effect";\r
      document.getElementById("rc-digprofit").textContent = fmt(r.digProfit);\r
      document.getElementById("rc-digbar-val").textContent = fmt(r.digProfit)+"/yr";\r
      document.getElementById("rc-physbar-val").textContent = fmt(r.physProfit)+"/yr";\r
      document.getElementById("rc-extra").textContent = "You keep "+fmt(r.extra)+" more per year selling digital";\r
    }\r
 \r
    function mkS(id,label,key,min,max,step,pre,suf){\r
      return '<div class="rc-slider-group"><div class="rc-slider-top"><span class="rc-slider-label" id="rc-l-'+id+'">'+label+'</span><span class="rc-slider-val" id="rc-v-'+id+'">'+pre+state[key]+suf+'</span></div><div class="rc-track"><div class="rc-fill" id="rc-f-'+id+'"></div><input class="rc-input" type="range" min="'+min+'" max="'+max+'" step="'+step+'" value="'+state[key]+'" data-key="'+key+'" aria-label="'+label+'" aria-labelledby="rc-l-'+id+'"></div><div class="rc-range"><span>'+pre+min+suf+'</span><span>'+pre+max.toLocaleString()+suf+'</span></div></div>';\r
    }\r
 \r
    var r = calc();\r
    var h = '<div class="rc-wrap"><div class="rc-head"><div class="rc-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8600A" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>Interactive Tool</div><h3 class="rc-title">Digital Product Revenue Calculator</h3><p class="rc-sub">Estimate how much you can earn selling digital products on Shopify.</p></div><div class="rc-div"></div><div class="rc-sliders">'+\r
    mkS("price","Average Product Price","price",5,200,1,"$","")+\r
    mkS("visitors","Monthly Store Visitors","visitors",100,50000,100,"","")+\r
    mkS("conv","Conversion Rate","conv",0.5,10,0.1,"","%")+\r
    mkS("products","Products in Catalog","products",1,50,1,"","")+\r
    '</div><div class="rc-div"></div><div class="rc-results"><div class="rc-results-label">Your estimated revenue</div><div class="rc-cards">'+\r
    '<div class="rc-card"><div class="rc-card-val" id="rc-monthly">'+fmt(r.monthly)+'</div><div class="rc-card-lbl">Monthly Revenue</div></div>'+\r
    '<div class="rc-card rc-card-hl"><div class="rc-card-val" id="rc-annual">'+fmt(r.annual)+'</div><div class="rc-card-lbl">Annual Revenue</div></div>'+\r
    '<div class="rc-card"><div class="rc-card-val" id="rc-orders">'+r.orders.toLocaleString()+'</div><div class="rc-card-lbl">Monthly Orders</div><div class="rc-card-sub" id="rc-rpv">'+Math.round(r.catalogBoost*100)+'% catalog effect</div></div>'+\r
    '<div class="rc-card"><div class="rc-card-val" id="rc-digprofit">'+fmt(r.digProfit)+'</div><div class="rc-card-lbl">Digital Profit (90%)</div><div class="rc-card-sub">vs 30% with physical</div></div>'+\r
    '</div></div><div class="rc-compare"><div class="rc-compare-box"><div class="rc-compare-title">Digital vs Physical: Profit Comparison</div>'+\r
    '<div class="rc-bar-group"><div class="rc-bar-top"><span class="rc-bar-lbl">Digital Products (90% margin)</span><span class="rc-bar-val rc-bar-val-o" id="rc-digbar-val">'+fmt(r.digProfit)+'/yr</span></div><div class="rc-bar-track"><div class="rc-bar-fill-o"></div></div></div>'+\r
    '<div class="rc-bar-group"><div class="rc-bar-top"><span class="rc-bar-lbl">Physical Products (30% margin)</span><span class="rc-bar-val rc-bar-val-g" id="rc-physbar-val">'+fmt(r.physProfit)+'/yr</span></div><div class="rc-bar-track-g"><div class="rc-bar-fill-g"></div></div></div>'+\r
    '<div class="rc-extra" id="rc-extra">You keep '+fmt(r.extra)+' more per year selling digital</div></div></div>'+\r
    '<div class="rc-cta"><a href="https://apps.shopify.com/digital-download-products" target="_blank" rel="noopener">Start Selling for Free <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a><p>Free plan: 250MB storage, 50 orders/month</p></div></div>';\r
 \r
    var w = document.createElement("div");\r
    w.innerHTML = h;\r
    if(faqH){faqH.parentNode.insertBefore(w, faqH)} else {bc.appendChild(w)}\r
 \r
    w.querySelectorAll(".rc-input").forEach(function(inp){\r
      inp.addEventListener("input",function(e){\r
        state[e.target.dataset.key] = parseFloat(e.target.value);\r
        update();\r
      });\r
    });\r
    update();\r
  }\r
 \r
  if(document.readyState === "complete") setTimeout(tryInject, 1000);\r
  else window.addEventListener("load", function(){ setTimeout(tryInject, 1000); });\r
})();\r
<\/script>\r
`),id:`cA_x3Na1U`,loadMode:`once`,name:`Interactive Tools Injector`,pageIds:new Set([`laHrDjJ5i`]),placement:`bodyEnd`},{code:e=>(e?.oUrnuHZfq,e?.gTEiY8mCm,e?.aanAcPPI1,e?.Oq3rJECoL,e?.updatedAt,e?.MNDPyEtDT,`<!-- Big Digital Downloads - Orange bullets via JS injection -->\r
<script>\r
(function(){\r
  function injectBulletColor(){\r
    if(document.getElementById("penida-bullet-style")) return;\r
    var style = document.createElement("style");\r
    style.id = "penida-bullet-style";\r
    style.textContent = 'li[data-preset-tag]::before { color: #E8600A !important; }';\r
    document.head.appendChild(style);\r
  }\r
 \r
  // Try immediately\r
  injectBulletColor();\r
 \r
  // Try again after Framer hydrates\r
  if(document.readyState === "complete"){\r
    setTimeout(injectBulletColor, 500);\r
    setTimeout(injectBulletColor, 1500);\r
  } else {\r
    window.addEventListener("load", function(){\r
      setTimeout(injectBulletColor, 500);\r
      setTimeout(injectBulletColor, 1500);\r
    });\r
  }\r
})();\r
<\/script>`),id:`TFKFeAE59`,loadMode:`once`,name:`Bigdd bullet orange`,pageIds:new Set([`laHrDjJ5i`]),placement:`bodyEnd`},{code:e=>`<script type="application/ld+json">\r
{\r
  "@context": "https://schema.org",\r
  "@type": "FAQPage",\r
  "mainEntity": [\r
    {\r
      "@type": "Question",\r
      "name": "How do I start selling digital products on Shopify?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "Install Big Digital Downloads from the Shopify App Store, upload your files, set prices, and publish. After checkout, customers automatically receive a download link via email. The free plan supports unlimited products with 250MB storage and 50 orders. Setup takes under 5 minutes."\r
      }\r
    },\r
    {\r
      "@type": "Question",\r
      "name": "What is the best app for selling digital products on Shopify?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "Big Digital Downloads is rated 4.9 stars with 800+ reviews and is used by 15,000+ stores. It supports all digital file types, license keys, PDF stamping, download limits, and custom branded emails. The free plan includes unlimited products and license keys."\r
      }\r
    },\r
    {\r
      "@type": "Question",\r
      "name": "Is there a free app for selling digital downloads on Shopify?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "Yes, Big Digital Downloads offers a free plan with 250MB storage, 50 orders, unlimited products, and unlimited license keys. No credit card required. When you need more storage or features like PDF stamping, paid plans start at $9.99/month."\r
      }\r
    },\r
    {\r
      "@type": "Question",\r
      "name": "How do I upload digital products to my Shopify store?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "In Big Digital Downloads, click Add Product, upload your file (PDF, ZIP, MP4, or any format), set the price and description, and publish. The entire process takes under a minute per product. You can also bulk import products."\r
      }\r
    },\r
    {\r
      "@type": "Question",\r
      "name": "What file types can I sell with Big Digital Downloads?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "Big Digital Downloads supports every digital file type: PDF, JPEG, PNG, MP4, MP3, ZIP, RAR, EPUB, MOBI, and more. There is no restriction on file format. Customers can download files individually or all at once after purchase."\r
      }\r
    },\r
    {\r
      "@type": "Question",\r
      "name": "How does digital product delivery work on Shopify?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "After checkout, Big Digital Downloads automatically sends a download link via email. Customers also see a download page after completing their purchase. You can customize the email template with your logo, colors, and text."\r
      }\r
    },\r
    {\r
      "@type": "Question",\r
      "name": "Is there a file size limit for digital downloads?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "Big Digital Downloads supports files of any size. Storage varies by plan: Free (250MB), Starter $9.99/month (15GB), Pro $19.99/month (50GB), Growth $49.99/month (1TB), Enterprise $99.99/month (unlimited). For very large files, use the download-by-URL feature to host files externally."\r
      }\r
    },\r
    {\r
      "@type": "Question",\r
      "name": "What is the bandwidth limit for digital downloads?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "Bandwidth varies by plan: Starter (50GB), Pro (500GB), Growth (1TB), Enterprise (custom). Bandwidth is the total data your customers download per month. For high-volume sellers, the Growth plan at $49.99/month offers 1TB bandwidth."\r
      }\r
    },\r
    {\r
      "@type": "Question",\r
      "name": "Can I deliver license keys automatically on Shopify?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "Yes, Big Digital Downloads supports automatic license key delivery. Upload your license keys in bulk, and the app assigns one to each customer automatically after purchase. Keys are sent via email and displayed on the download page."\r
      }\r
    },\r
    {\r
      "@type": "Question",\r
      "name": "Can I sell game codes or gift cards on Shopify?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "Yes, Big Digital Downloads handles game codes, gift cards, serial keys, and software activation keys. Upload your codes, and each customer receives a unique code after purchase. The app prevents duplicate delivery automatically."\r
      }\r
    },\r
    {\r
      "@type": "Question",\r
      "name": "Does Big Digital Downloads support PDF stamping?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "Yes, PDF stamping is available on the Starter plan ($9.99/month) and above. Each PDF is automatically stamped with the buyer's name and order details before download, discouraging unauthorized sharing."\r
      }\r
    },\r
    {\r
      "@type": "Question",\r
      "name": "Can I set download limits for customers?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "Yes, download limits are available on the Starter plan ($9.99/month) and above. Set the maximum number of times a customer can download their purchased files. You can also set download expiration dates."\r
      }\r
    },\r
    {\r
      "@type": "Question",\r
      "name": "Does Big Digital Downloads protect against fraud?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "Yes, Big Digital Downloads includes fraud protection that automatically halts downloads for suspicious or fraudulent orders flagged by Shopify. This prevents unauthorized access to your digital products."\r
      }\r
    },\r
    {\r
      "@type": "Question",\r
      "name": "How much does Big Digital Downloads cost?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "Plans range from $0/month (free, 250MB storage, 50 orders) to $99.99/month (unlimited storage). Full pricing: Free ($0), Starter ($9.99, 15GB), Pro ($19.99, 50GB), Growth ($49.99, 1TB, custom sender), Enterprise ($99.99, unlimited). All plans include unlimited products and license keys."\r
      }\r
    },\r
    {\r
      "@type": "Question",\r
      "name": "What is the most popular Big Digital Downloads plan?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "The Growth plan at $49.99/month is the most popular, with over 10,000 purchases. It includes 1TB storage, custom sender email, and 1TB bandwidth. Ideal for established sellers with a large product catalog."\r
      }\r
    },\r
    {\r
      "@type": "Question",\r
      "name": "Big Digital Downloads vs Shopify Digital Downloads — what's the difference?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "Shopify Digital Downloads is free but basic. Big Digital Downloads adds PDF stamping, license key delivery, download limits, custom branded emails, fraud protection, and unlimited storage on paid plans. Big Digital Downloads has 800+ reviews at 4.9 stars."\r
      }\r
    },\r
    {\r
      "@type": "Question",\r
      "name": "How does Big Digital Downloads compare to SendOwl?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "Big Digital Downloads offers a free plan with 50 orders and unlimited products. SendOwl charges monthly from the start with no free tier. Big Digital Downloads charges no transaction fees and includes unlimited license keys on all plans."\r
      }\r
    },\r
    {\r
      "@type": "Question",\r
      "name": "Can I customize the download email with my branding?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "Yes, Big Digital Downloads lets you customize the entire download email. Add your logo, change colors, edit all text, and use variables like {name} for personalization. Available on all plans including the free plan."\r
      }\r
    },\r
    {\r
      "@type": "Question",\r
      "name": "Can I use a custom sender email address?",\r
      "acceptedAnswer": {\r
        "@type": "Answer",\r
        "text": "Yes, the Growth plan ($49.99/month) and above includes custom sender email. Send download emails from your own domain instead of a generic address. This improves deliverability and brand trust."\r
      }\r
    }\r
  ]\r
}\r
<\/script>`,id:`ltwTsFqT8`,loadMode:`once`,name:`FAQ Schema Markup`,pageIds:new Set([`Jjxz4vNap`]),placement:`headStart`},{code:e=>`<script type="application/ld+json">\r
{\r
  "@context": "https://schema.org",\r
  "@type": "SoftwareApplication",\r
  "name": "Big Digital Downloads",\r
  "applicationCategory": "BusinessApplication",\r
  "operatingSystem": "Web",\r
  "description": "Big Digital Downloads is a Shopify app for selling digital products, ebooks, software, license keys, game codes, templates, and any downloadable file. Supports all file types (PDF, ZIP, MP4, MP3, JPEG, RAR, EPUB, MOBI, and more), automatic license key delivery, PDF stamping, download limits, download expiration, custom branded download emails, fraud protection, and bulk import. Free plan includes unlimited products and unlimited license keys. Used by 15,000+ stores worldwide.",\r
  "url": "https://www.bigdigitaldownload.com",\r
  "downloadUrl": "https://apps.shopify.com/digital-download-products",\r
  "screenshot": "https://www.bigdigitaldownload.com",\r
  "aggregateRating": {\r
    "@type": "AggregateRating",\r
    "ratingValue": "4.9",\r
    "ratingCount": "800",\r
    "bestRating": "5"\r
  },\r
  "offers": {\r
    "@type": "AggregateOffer",\r
    "lowPrice": "0",\r
    "highPrice": "99.99",\r
    "priceCurrency": "USD",\r
    "offerCount": "5",\r
    "offers": [\r
      {\r
        "@type": "Offer",\r
        "name": "Regular (Free)",\r
        "price": "0",\r
        "priceCurrency": "USD",\r
        "description": "250MB storage, 50 orders, unlimited products, unlimited license keys, download files by URL"\r
      },\r
      {\r
        "@type": "Offer",\r
        "name": "Starter",\r
        "price": "9.99",\r
        "priceCurrency": "USD",\r
        "description": "15GB storage, 50GB bandwidth, unlimited products and orders, PDF stamping, download limits"\r
      },\r
      {\r
        "@type": "Offer",\r
        "name": "Pro",\r
        "price": "19.99",\r
        "priceCurrency": "USD",\r
        "description": "50GB storage, 500GB bandwidth, all Starter features"\r
      },\r
      {\r
        "@type": "Offer",\r
        "name": "Growth",\r
        "price": "49.99",\r
        "priceCurrency": "USD",\r
        "description": "1TB storage, 1TB bandwidth, custom sender email. Most popular plan with 10,000+ purchases"\r
      },\r
      {\r
        "@type": "Offer",\r
        "name": "Enterprise",\r
        "price": "99.99",\r
        "priceCurrency": "USD",\r
        "description": "Unlimited storage, custom bandwidth, custom sender email"\r
      }\r
    ]\r
  },\r
  "featureList": [\r
    "Sell any digital file type (PDF, JPEG, MP4, ZIP, RAR, EPUB, MOBI, and more)",\r
    "One-click upload and download",\r
    "Unlimited products on all plans",\r
    "Automatic license key and serial key delivery",\r
    "Game codes and gift card delivery",\r
    "PDF stamping with buyer name and order details",\r
    "Download limits per customer",\r
    "Download expiration dates",\r
    "Download files by URL for external hosting",\r
    "Custom download page",\r
    "Custom branded email templates with logo, colors, and variables",\r
    "Custom sender email address (Growth plan and above)",\r
    "Fraud protection with automatic download halt for suspicious orders",\r
    "Bulk import products and orders",\r
    "Multi-language email support"\r
  ],\r
  "author": {\r
    "@type": "Organization",\r
    "name": "Penida",\r
    "url": "https://www.bigdigitaldownload.com",\r
    "description": "Independent bootstrapped company based in France and Estonia, building Shopify apps"\r
  }\r
}\r
<\/script>`,id:`DkMnxGgUp`,loadMode:`once`,name:`Software Schema Markup`,pageIds:new Set([`diQ3HdoeK`]),placement:`headStart`},{code:e=>`<script type="application/ld+json">\r
{\r
  "@context": "https://schema.org",\r
  "@type": "Organization",\r
  "name": "Penida",\r
  "url": "https://www.bigdigitaldownload.com",\r
  "logo": "https://www.bigdigitaldownload.com/favicon.ico",\r
  "description": "Independent bootstrapped company building Shopify apps. Makers of Big Digital Downloads and Cowlendar booking app.",\r
  "foundingDate": "2020",\r
  "founders": [\r
    {"@type": "Person", "name": "Marc"},\r
    {"@type": "Person", "name": "Charles"}\r
  ],\r
  "address": {\r
    "@type": "PostalAddress",\r
    "addressCountry": "FR"\r
  },\r
  "sameAs": []\r
}\r
<\/script>`,id:`ago66ejjO`,loadMode:`once`,name:`Organization Schema Markup`,pageIds:new Set([`diQ3HdoeK`]),placement:`headStart`},{code:e=>`<link rel="canonical" href="https://www.bigdigitaldownload.com/big-digital-downloads-vs-shopify-digital-downloads">\r
<script type="application/ld+json">\r
{\r
  "@context": "https://schema.org",\r
  "@type": "Article",\r
  "headline": "Big Digital Downloads vs Shopify Digital Downloads: Which Should You Use?",\r
  "description": "Complete feature comparison between Big Digital Downloads and Shopify's native Digital Downloads app. License keys, PDF stamping, fraud protection, pricing, and reviews compared side by side.",\r
  "author": {\r
    "@type": "Organization",\r
    "name": "Penida"\r
  },\r
  "publisher": {\r
    "@type": "Organization",\r
    "name": "Penida",\r
    "logo": {\r
      "@type": "ImageObject",\r
      "url": "https://www.bigdigitaldownload.com/favicon.ico"\r
    }\r
  },\r
  "mainEntityOfPage": {\r
    "@type": "WebPage",\r
    "@id": "https://www.bigdigitaldownload.com/big-digital-downloads-vs-shopify-digital-downloads"\r
  }\r
}\r
<\/script>`,id:`uDHybCPcg`,loadMode:`once`,name:`Article Schema Markup`,pageIds:new Set([`LupDk0CaI`]),placement:`headStart`},{code:e=>`<link rel="canonical" href="https://www.bigdigitaldownload.com/big-digital-downloads-vs-filemonk">\r
<script type="application/ld+json">\r
{\r
  "@context": "https://schema.org",\r
  "@type": "Article",\r
  "headline": "Big Digital Downloads vs Filemonk: Which Should You Use?",\r
  "description": "Compare Big Digital Downloads and Filemonk for Shopify digital products. See pricing, license keys, PDF watermarking, download limits, branding, fraud protection, support, and more side by side.",\r
  "author": {\r
    "@type": "Organization",\r
    "name": "Penida"\r
  },\r
  "publisher": {\r
    "@type": "Organization",\r
    "name": "Penida",\r
    "logo": {\r
      "@type": "ImageObject",\r
      "url": "https://www.bigdigitaldownload.com/favicon.ico"\r
    }\r
  },\r
  "mainEntityOfPage": {\r
    "@type": "WebPage",\r
    "@id": "https://www.bigdigitaldownload.com/big-digital-downloads-vs-filemonk"\r
  }\r
}\r
<\/script>`,id:`xtCyt40EN`,loadMode:`once`,name:`Article Schema Markup`,pageIds:new Set([`lyWGU6tbA`]),placement:`headStart`},{code:e=>`<link rel="canonical" href="https://www.bigdigitaldownload.com/big-digital-downloads-vs-pdf-pendora">\r
<script type="application/ld+json">\r
{\r
  "@context": "https://schema.org",\r
  "@type": "Article",\r
  "headline": "Big Digital Downloads vs PDF Pendora: The Real Difference",\r
  "description": "Big Digital Downloads vs PDF Pendora compared. Pendora is free but lacks PDF stamping, fraud protection, branded emails, and API access. See the full feature breakdown.",\r
  "author": {\r
    "@type": "Organization",\r
    "name": "Penida"\r
  },\r
  "publisher": {\r
    "@type": "Organization",\r
    "name": "Penida",\r
    "logo": {\r
      "@type": "ImageObject",\r
      "url": "https://www.bigdigitaldownload.com/favicon.ico"\r
    }\r
  },\r
  "mainEntityOfPage": {\r
    "@type": "WebPage",\r
    "@id": "https://www.bigdigitaldownload.com/big-digital-downloads-vs-pdf-pendora"\r
  }\r
}\r
<\/script>`,id:`c59n3U5x0`,loadMode:`once`,name:`Article Schema Markup`,pageIds:new Set([`Hqv39DBGq`]),placement:`headStart`},{code:e=>`<link rel="canonical" href="https://www.bigdigitaldownload.com/big-digital-downloads-vs-sky-pilot">\r
<script type="application/ld+json">\r
{\r
  "@context": "https://schema.org",\r
  "@type": "Article",\r
  "headline": "Big Digital Downloads vs Sky Pilot: Features and Pricing Compared (2026)",\r
  "description": "Big Digital Downloads vs Sky Pilot feature comparison. License keys, PDF stamping, image stamping, and invisible PDF marking included free on BDD. Sky Pilot charges $54.99/mo for license keys and basic PDF stamping.",\r
  "author": {\r
    "@type": "Organization",\r
    "name": "Penida"\r
  },\r
  "publisher": {\r
    "@type": "Organization",\r
    "name": "Penida",\r
    "logo": {\r
      "@type": "ImageObject",\r
      "url": "https://www.bigdigitaldownload.com/favicon.ico"\r
    }\r
  },\r
  "mainEntityOfPage": {\r
    "@type": "WebPage",\r
    "@id": "https://www.bigdigitaldownload.com/big-digital-downloads-vs-sky-pilot"\r
  }\r
}\r
<\/script>`,id:`vi48YfLHy`,loadMode:`once`,name:`Article Schema Markup`,pageIds:new Set([`MjYXRBtqp`]),placement:`headStart`},{code:e=>`<link rel="canonical" href="https://www.bigdigitaldownload.com/best-shopify-digital-download-apps">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "10 Best Shopify Apps for Selling Digital Products (2026)",
  "description": "The definitive ranking of Shopify digital download apps for 2026, verified from Shopify App Store data.",
  "numberOfItems": 10,
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Big Digital Downloads", "url": "https://apps.shopify.com/digital-download-products"},
    {"@type": "ListItem", "position": 2, "name": "PDF Pendora", "url": "https://apps.shopify.com/digital-downloads-app-by-pendora"},
    {"@type": "ListItem", "position": 3, "name": "Filemonk", "url": "https://apps.shopify.com/filemonk"},
    {"@type": "ListItem", "position": 4, "name": "Sky Pilot", "url": "https://apps.shopify.com/sky-pilot"},
    {"@type": "ListItem", "position": 5, "name": "Easy Digital Products", "url": "https://apps.shopify.com/easy-digital-products"},
    {"@type": "ListItem", "position": 6, "name": "Shopify Digital Products", "url": "https://apps.shopify.com/digital-downloads"},
    {"@type": "ListItem", "position": 7, "name": "Fileflare", "url": "https://apps.shopify.com/fileflare"},
    {"@type": "ListItem", "position": 8, "name": "DDA", "url": "https://apps.shopify.com/digital-assets"},
    {"@type": "ListItem", "position": 9, "name": "SendOwl", "url": "https://apps.shopify.com/sendowl"},
    {"@type": "ListItem", "position": 10, "name": "FetchApp", "url": "https://apps.shopify.com/fetchapp"}
  ]
}
<\/script>`,id:`Z3BM3X4VU`,loadMode:`once`,name:`Script`,pageIds:new Set([`Bh8nqEnYX`]),placement:`headStart`}],u=new r,d={laHrDjJ5i:async(e,t)=>{let r={from:{alias:`laHrDjJ5i`,data:(await import(`./vfbMHor_LFycOQ6YHQY1N6CbjKofbigcsnj_8_E6O9k.BgVVKz0H.mjs`)).default,type:`Collection`},select:[{collection:`laHrDjJ5i`,name:`oUrnuHZfq`,type:`Identifier`},{collection:`laHrDjJ5i`,name:`gTEiY8mCm`,type:`Identifier`},{collection:`laHrDjJ5i`,name:`aanAcPPI1`,type:`Identifier`},{collection:`laHrDjJ5i`,name:`Oq3rJECoL`,type:`Identifier`},{collection:`laHrDjJ5i`,name:`updatedAt`,type:`Identifier`},{collection:`laHrDjJ5i`,name:`MNDPyEtDT`,type:`Identifier`}],where:n(e,`laHrDjJ5i`)},i=await u.query(r,t);if(i.length===0)throw Error(`No data matches pathVariables`);return i[0]}},f={bodyEnd:[`PzRxBNXXz`,`RJaoL0GPA`,`Nvp7i64L6`,`cA_x3Na1U`,`TFKFeAE59`,`Kabs9KNmf`],bodyStart:[],headEnd:[],headStart:[`Ot_jedtSR`,`nghFGpbO2`,`UEeAPSTj9`,`yuPuPy3qV`,`ltwTsFqT8`,`DkMnxGgUp`,`ago66ejjO`,`xN1FmJZdx`,`ETMW7ldhD`,`uDHybCPcg`,`xtCyt40EN`,`c59n3U5x0`,`vi48YfLHy`,`Z3BM3X4VU`]},p={exports:{snippetsSorting:{type:`variable`,annotations:{framerContractVersion:`1`}},getSnippets:{type:`function`,annotations:{framerContractVersion:`1`}},__FramerMetadata__:{type:`variable`}}}}))();export{p as __FramerMetadata__,i as getSnippets,f as snippetsSorting};
//# sourceMappingURL=uoVhvrChedsa5jpgi_dGcTAzaUuRzvHm2zV-WlMg-uc.DgK5TEpf.mjs.map