export const safeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const usd = value => '$' + value.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
export const round = value => Number(value.toFixed(2)).toLocaleString('en-US',{maximumFractionDigits:2});
export function cleanName(value, fallback='file') {
  return (String(value).normalize('NFC').replace(/[\\/:*?"<>|\x00-\x1f\x7f]/g,'-').replace(/^[\s.]+|[\s.]+$/g,'').slice(0,120) || fallback);
}
export function publicUrl(value) {
  let url;
  try { url = new URL(value); } catch { throw Error('Enter a complete web address beginning with https:// or http://.'); }
  if (!['https:','http:'].includes(url.protocol) || !url.hostname || url.username || url.password) throw Error('Use a web URL without a username or password.');
  return url;
}
function number(data,key,min=0,max=10000000,whole=false) {
  const n=Number(data[key]);
  if (String(data[key]??'').trim()==='' || !Number.isFinite(n) || n<min || n>max || (whole && !Number.isInteger(n))) throw Error('Check the value for '+key+'. It must be '+(whole?'a whole number':'a number')+' between '+min+' and '+max+'.');
  return n;
}
function report(headline,detail,rows,filename) {
  const text=[headline,detail,'',...rows.map(([name,value])=>name+': '+value)].join('\n');
  return {headline,detail,rows,text,filename};
}
function csvCell(value) {
  const str=String(value);
  return '"'+(/^[\s]*[=+\-@\t\r]/.test(str)?"'":"")+str.replaceAll('"','""')+'"';
}
function csv(rows) {return rows.map(row=>row.map(csvCell).join(',')).join('\r\n')+'\r\n';}
function calculate(key,v) {
  if(key==='download') {
    const mb=number(v,'size',.000001)*({KB:.001,MB:1,GB:1000}[v.unit]);
    const speed=number(v,'speed',.001)*number(v,'efficiency',1,100)/100;
    const sec=Math.ceil(mb*8/speed);
    const hours=Math.floor(sec/3600),minutes=Math.floor(sec%3600/60);
    const duration=[hours&&hours+' hr',minutes&&minutes+' min',sec%60&&sec%60+' sec'].filter(Boolean).join(' ') || '< 1 sec';
    return report(duration,'Estimated transfer time',[['File size',round(mb)+' MB'],['Effective speed',round(speed)+' Mbps'],['Transfer time',round(sec)+' seconds']],'download-estimate.txt');
  }
  if(key==='dpi') {
    const ppi=number(v,'ppi',1,2400), w=number(v,'width',1,100000,true)/ppi,h=number(v,'height',1,100000,true)/ppi;
    return report(round(w)+' × '+round(h)+' in','Printable dimensions before bleed or cropping',[['Centimetres',round(w*2.54)+' × '+round(h*2.54)+' cm'],['Pixel density',round(ppi)+' PPI']],'print-dimensions.txt');
  }
  if(key==='price') {
    const cost=number(v,'cost')+number(v,'flat'),fee=number(v,'fee',0,100)/100,margin=number(v,'margin',0,100)/100;
    if (fee+margin>=1) throw Error('The target margin and percentage fee must add up to less than 100%.');
    const cents=cost/(1-fee-margin)*100;
    const price=Math.ceil(cents-Number.EPSILON*Math.abs(cents)*4)/100;
    return report(usd(price),'Minimum price at the selected margin',[['Per-sale costs',usd(cost)],['Contribution per sale',usd(price*(1-fee)-cost)],['Target margin',round(margin*100)+'%']],'pricing-estimate.txt');
  }
  if(key==='breakeven') {
    const budget=number(v,'budget'),price=number(v,'price',.01),net=price*(1-number(v,'fee',0,100)/100)-number(v,'cost')-number(v,'flat');
    if (budget>0 && net<=0) throw Error('Each sale must contribute more than zero to recover this budget. Review the price or costs.');
    const ratio=budget?budget/net:0;
    const count=Math.ceil(ratio-Number.EPSILON*Math.abs(ratio)*4);
    return report(count.toLocaleString('en-US')+' orders','Whole orders required to recover the budget',[['Contribution per order',usd(net)],['Launch budget',usd(budget)],['Contribution at break-even',usd(count*net)]],'break-even-estimate.txt');
  }
  if(key==='bundle') {
    const lines=v.items.trim().split(/\r?\n/).filter(line=>line.trim());
    if(!lines.length || lines.length>50) throw Error('Enter between one and 50 items.');
    let total=0;
    lines.forEach((line,n)=>{
      const match=line.match(/^(.+)\|\s*(\d+(?:\.\d{1,2})?)\s*$/);
      if(!match || !match[1].trim() || Number(match[2])>1e7) throw Error('Line '+(n+1)+' needs a name, a | and a price, for example Workbook | 24.');
      total+=Math.round(Number(match[2])*100);
    });
    if(!total) throw Error('At least one standalone item must have a price above zero.');
    total/=100;
    const price=number(v,'price'),saving=total-price, percent=round(100*Math.abs(saving)/total)+'%';
    const headline=saving>0?'Save '+usd(saving):saving<0?usd(-saving)+' premium':'Same price';
    return report(headline,saving<0?'Above combined standalone value':'Compared with separate purchases',[['Standalone value',usd(total)],['Bundle price',usd(price)],[saving<0?'Premium':'Discount',percent]],'bundle-estimate.txt');
  }
}
function makeKeys(v) {
  const count=number(v,'count',1,1000,true), groups=number(v,'groups',2,6,true), length=number(v,'length',3,8,true);
  const prefix=v.prefix.trim().toUpperCase();
  if(!/^[A-Z0-9_-]{0,16}$/.test(prefix)) throw Error('Use up to 16 letters, numbers, underscores or hyphens for the prefix.');
  const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const keys=new Set();
  while(keys.size<count) {
    const bytes=crypto.getRandomValues(new Uint8Array(groups*length));
    const pieces=[];
    for(let g=0;g<groups;g++) pieces.push(Array.from(bytes.slice(g*length,(g+1)*length),b=>alphabet[b%32]).join(''));
    keys.add((prefix?prefix+'-':'')+pieces.join('-'));
  }
  const all=[...keys];
  return {headline:count+' unique keys',detail:'Inventory CSV · Generated on this device',lines:all.slice(0,4),text:csv([['license_key'],...all.map(k=>[k])]),filename:'license-keys.csv',mime:'text/csv'};
}
function makeSkus(v) {
  const token=value=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-|-$/g,'');
  const options=value=>value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  const editions=options(v.editions),formats=options(v.formats),base=token(v.base);
  if(!base || !editions.length || !formats.length) throw Error('Enter a product code, an edition and a format.');
  if(editions.length*formats.length>500) throw Error('Limit a sheet to 500 edition and format combinations.');
  const rows=[], seen=new Set();
  for(const edition of editions) for(const format of formats) {
    if(!token(edition) || !token(format)) throw Error('Each option needs at least one letter or number that can form an ASCII code.');
    const sku=[base,token(edition),token(format)].join('-');
    if(seen.has(sku))throw Error('Two options produce '+sku+'. Give each one a distinct code.');
    seen.add(sku); rows.push([edition,format,sku]);
  }
  return {headline:rows.length+' variant SKUs',detail:'One row per edition and format',lines:[...seen].slice(0,4),text:csv([['edition','format','sku'],...rows]),filename:'product-skus.csv',mime:'text/csv'};
}
function launch(key,v) {
  if(key==='faq') {
    const entries=v.entries;
    if(!entries?.length || entries.length>10 || entries.some(item=>!item.q.trim() || !item.a.trim())) throw Error('Add a question and a complete answer to every row (up to ten).');
    const data={'@context':'https://schema.org','@type':'FAQPage',mainEntity:entries.map(({q,a})=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))};
    const visible='<section aria-label="Product questions">\n'+entries.map(({q,a})=>'<details><summary>'+safeHtml(q)+'</summary><p>'+safeHtml(a)+'</p></details>').join('\n')+'\n</section>';
    const json=JSON.stringify(data,null,2).replace(/</g,'\\u003c').replace(/>/g,'\\u003e');
    return {headline:entries.length+' questions',detail:'Accessible accordion with matching structured data',entries,text:visible+'\n<script type="application/ld+json">\n'+json+'\n</script>',filename:'product-faq.html',mime:'text/html'};
  }
  const url=publicUrl(v.url);
  if(key==='snippet') return {headline:'Search preview',detail:'Illustrative layout',snippet:[url.hostname+url.pathname,v.title.trim(),v.description.trim()],rows:[['Title',v.title.trim().length+' characters'],['Description',v.description.trim().length+' characters']],text:'<title>'+safeHtml(v.title.trim())+'</title>\n<meta name="description" content="'+safeHtml(v.description.trim())+'">',filename:'product-meta.html',mime:'text/html'};
  if(key==='utm') {
    for(const k of ['source','medium','campaign','content','term']) {
      url.searchParams.delete('utm_'+k);
      const value=v[k]?.trim();
      if(!value && ['source','medium','campaign'].includes(k))throw Error('Enter a source, medium and campaign name.');
      if(value)url.searchParams.set('utm_'+k,value);
    }
    return {headline:'Your campaign link',detail:'Ready to use in your launch',lines:[url.href],text:url.href,filename:'campaign-link.txt'};
  }
  const subject='Your '+v.product.trim()+' download is ready';
  const body='Thank you for choosing '+v.store.trim()+'.\n\nDownload '+v.product.trim()+':\n'+url.href+'\n\n'+v.instructions.trim()+'\n\nNeed help opening your files? Contact '+v.support.trim()+'.\n\n'+v.store.trim();
  return {headline:subject,detail:'Plain-text delivery email',lines:[body],text:'Subject: '+subject+'\n\n'+body,filename:'delivery-email.txt'};
}
export async function run(key,values,files=[]) {
  if(['price','breakeven','bundle','download','dpi'].includes(key)) return calculate(key,values);
  if(key==='license')return makeKeys(values);
  if(key==='sku')return makeSkus(values);
  if(['snippet','utm','email','faq'].includes(key))return launch(key,values);
  if(['watermark','webp','resize','cover'].includes(key))return (await import('./images.mjs')).renderImage(key,values,files);
  return (await import('./files.mjs')).processFile(key,values,files);
}
