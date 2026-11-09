import {cleanName,publicUrl} from './engine.mjs';
const MiB=1024*1024;
let pdfEngine;
export async function pdfLib() {
  if(!pdfEngine) pdfEngine=import('/assets/vendor/pdf-lib.min.js').then(()=>{
    if(!globalThis.PDFLib) throw Error('The PDF editor could not be loaded. Reload the page and try again.');
    return globalThis.PDFLib;
  }).catch(error=>{pdfEngine=undefined;throw error;});
  return pdfEngine;
}
export function pageOrder(input,count) {
  const pages=new Set();
  for(const token of String(input).split(',')) {
    const match=token.trim().match(/^(\d+)(?:\s*[-–]\s*(\d+))?$/);
    if(!match) throw Error('Use page positions or ascending ranges, for example 1, 3-5.');
    const a=Number(match[1]),b=Number(match[2]||a);
    if(a<1 || b<a || b>count)throw Error('This PDF has '+count+' pages. Check the range “'+token.trim()+'”.');
    for(let p=a;p<=b;p++)pages.add(p-1);
  }
  return [...pages];
}
async function pdfOutput(key,v,file) {
  if(!file || file.size>50*MiB) throw Error('Choose an unlocked PDF up to 50 MiB.');
  const {PDFDocument,StandardFonts,rgb,degrees}=await pdfLib();
  let src;
  try {src=await PDFDocument.load(await file.arrayBuffer());} catch {throw Error('This PDF could not be opened. Choose a valid, unlocked PDF.');}
  const total=src.getPageCount(),name=cleanName(file.name).replace(/\.pdf$/i,'');
  if(key==='extract') {
    const order=pageOrder(v.pages,total), doc=await PDFDocument.create();
    for(const page of await doc.copyPages(src,order))doc.addPage(page);
    return {headline:order.length+(order.length===1?' page extracted':' pages extracted'),detail:'Original order follows your selection',lines:['Pages '+order.map(p=>p+1).join(', ')],blob:new Blob([await doc.save()],{type:'application/pdf'}),filename:name+'-sample.pdf'};
  }
  const font=await src.embedFont(StandardFonts.Helvetica);
  const start=Number(v.start);
  if(!Number.isInteger(start) || start<1 || start>999999)throw Error('Choose a starting number between 1 and 999,999.');
  src.getPages().forEach((page,index)=>{
    const n=start+index,text=v.style==='page'?'Page '+n:v.style==='dash'?'– '+n+' –':String(n);
    const {x,y,width:w,height:h}=page.getCropBox();
    const angle=((page.getRotation().angle%360)+360)%360;
    const displayWidth=angle%180?h:w, displayHeight=angle%180?w:h;
    const size=Math.min(11,displayHeight*.08,displayWidth*.65/font.widthOfTextAtSize(text,1));
    const margin=Math.min(25,displayWidth*.08);
    const labelWidth=font.widthOfTextAtSize(text,size);
    const u=v.position==='left'?margin:v.position==='right'?displayWidth-margin-labelWidth:(displayWidth-labelWidth)/2;
    const b=Math.min(19,displayHeight*.07);
    const pos={0:[u,b],90:[w-b,u],180:[w-u,h-b],270:[b,h-u]}[angle];
    if(!pos)throw Error('This document uses an unsupported page rotation.');
    page.drawText(text,{x:x+pos[0],y:y+pos[1],size,font,rotate:degrees(angle),color:rgb(.15,.2,.18)});
  });
  return {headline:total+' pages numbered',detail:'Footer numbers '+start+' to '+(start+total-1),blob:new Blob([await src.save()],{type:'application/pdf'}),filename:name+'-numbered.pdf'};
}
const crcTable=Uint32Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function crc32(bytes) {let crc=0xffffffff;for(const byte of bytes)crc=crcTable[(crc^byte)&255]^(crc>>>8);return (crc^0xffffffff)>>>0;}
function header(signature,size) {
  const view=new DataView(new ArrayBuffer(size));view.setUint32(0,signature,true);
  return {bytes:view.buffer,u16:(offset,value)=>view.setUint16(offset,value,true),u32:(offset,value)=>view.setUint32(offset,value,true)};
}
export async function makeZip(files) {
  if(!files.length || files.length>40 || files.reduce((n,f)=>n+f.size,0)>64*MiB)throw Error('Choose 1–40 files with a combined size of up to 64 MiB.');
  const names=new Set(),parts=[],directory=[],items=[];let offset=0,centralSize=0;
  for(const file of files) {
    const base=cleanName(file.name),dot=base.lastIndexOf('.'),stem=dot>0?base.slice(0,dot):base,extension=dot>0?base.slice(dot):'';
    let name=base,number=2;
    while(names.has(name.toLowerCase()))name=stem+' ('+(number++)+')'+extension;
    names.add(name.toLowerCase());items.push(name);
    const encoded=new TextEncoder().encode(name),bytes=new Uint8Array(await file.arrayBuffer()),crc=crc32(bytes);
    const date=new Date(file.lastModified||Date.now());
    const dosDate=((Math.min(2107,Math.max(1980,date.getFullYear()))-1980)<<9)|((date.getMonth()+1)<<5)|date.getDate();
    const dosTime=(date.getHours()<<11)|(date.getMinutes()<<5)|(date.getSeconds()>>1);
    const local=header(0x04034b50,30);
    local.u16(4,20);local.u16(6,0x800);local.u16(10,dosTime);local.u16(12,dosDate);local.u32(14,crc);local.u32(18,bytes.length);local.u32(22,bytes.length);local.u16(26,encoded.length);
    parts.push(local.bytes,encoded,bytes);
    const entry=header(0x02014b50,46);
    entry.u16(4,20);entry.u16(6,20);entry.u16(8,0x800);entry.u16(12,dosTime);entry.u16(14,dosDate);entry.u32(16,crc);entry.u32(20,bytes.length);entry.u32(24,bytes.length);entry.u16(28,encoded.length);entry.u32(42,offset);
    directory.push(entry.bytes,encoded);centralSize+=46+encoded.length;offset+=30+encoded.length+bytes.length;
  }
  const end=header(0x06054b50,22);
  end.u16(8,files.length);end.u16(10,files.length);end.u32(12,centralSize);end.u32(16,offset);
  return {blob:new Blob([...parts,...directory,end.bytes],{type:'application/zip'}),items};
}
async function accessPdf(v) {
  const url=publicUrl(v.url);
  if(url.protocol!=='https:' || !(url.hostname==='canva.com' || url.hostname.endsWith('.canva.com')) || /\/edit(?:\/|$)/i.test(url.pathname))throw Error('Enter a secure Canva share link intended for customers. Editor links cannot be used.');
  const {PDFDocument,PDFName,PDFArray,PDFString}=await pdfLib();
  const {surface,wrapText,encodeCanvas}=await import('./images.mjs');
  const {canvas,ctx}=surface(1190,1684);
  ctx.fillStyle='#f7f6ee';ctx.fillRect(0,0,1190,1684);
  ctx.fillStyle='#19493d';ctx.fillRect(0,0,1190,26);
  ctx.fillStyle='#dc6b45';ctx.fillRect(72,85,52,10);
  wrapText(ctx,v.store,72,161,1046,100,44,24,'600','sans-serif','#19493d');
  ctx.fillStyle='#527265';ctx.font='600 27px sans-serif';ctx.fillText('TEMPLATE ACCESS',74,334);
  wrapText(ctx,v.title,72,410,1046,330,102,40,'bold','Georgia','#133f34');
  wrapText(ctx,v.instructions,74,795,1032,345,40,23,'400','sans-serif','#325348');
  ctx.fillStyle='#184b3c';ctx.beginPath();ctx.roundRect(72,1230,1046,128,30);ctx.fill();
  ctx.fillStyle='#fffdf5';ctx.font='600 44px sans-serif';ctx.fillText('Open your template',116,1311);ctx.fillText('↗',1020,1311);
  ctx.fillStyle='#aabbb0';ctx.fillRect(72,1490,1046,2);ctx.fillStyle='#416354';ctx.font='30px sans-serif';ctx.fillText('Keep this access sheet with your purchase.',74,1563);
  const doc=await PDFDocument.create(),page=doc.addPage([595,842]);
  const art=await doc.embedPng(await (await encodeCanvas(canvas)).arrayBuffer());
  page.drawImage(art,{x:0,y:0,width:595,height:842});
  const annotation=doc.context.register(doc.context.obj({Type:'Annot',Subtype:'Link',Rect:[36,163,559,227],Border:[0,0,0],A:{Type:'Action',S:'URI',URI:PDFString.of(url.href)}}));
  const annotations=PDFArray.withContext(doc.context);annotations.push(annotation);page.node.set(PDFName.of('Annots'),annotations);
  doc.setTitle(v.title);doc.setAuthor(v.store);
  return {headline:'Template access sheet',detail:'One-page PDF · Clickable Canva button',blob:new Blob([await doc.save()],{type:'application/pdf'}),filename:'template-access.pdf'};
}
export async function processFile(key,v,files) {
  if(key==='canva')return accessPdf(v);
  if(!files.length)throw Error('Choose a file or use the example to try this tool.');
  if(key==='zip') {
    const {blob,items}=await makeZip(files);
    return {headline:items.length+' files bundled',detail:'ZIP archive · Original file bytes preserved',lines:items.slice(0,5),blob,filename:cleanName(v.name,'creator-kit').replace(/\.zip$/i,'')+'.zip'};
  }
  if(key==='hash') {
    const file=files[0];
    if(file.size>100*MiB)throw Error('Choose a file up to 100 MiB.');
    const expected=v.expected.trim().toLowerCase();
    if(expected && !/^[0-9a-f]{64}$/.test(expected))throw Error('The expected SHA-256 must be exactly 64 hexadecimal characters.');
    const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await file.arrayBuffer())),b=>b.toString(16).padStart(2,'0')).join('');
    return {headline:expected?(hash===expected?'Checksums match':'Checksums differ'):'SHA-256 fingerprint',detail:file.name,lines:[hash],text:hash+'  '+cleanName(file.name)+'\n',filename:'release.sha256'};
  }
  return pdfOutput(key,v,files[0]);
}
export async function sampleFiles(key) {
  if(['number','extract'].includes(key)) {
    const {PDFDocument,StandardFonts,rgb}=await pdfLib();
    const doc=await PDFDocument.create(),font=await doc.embedFont(StandardFonts.Helvetica);
    for(const [i,title] of ['Field Notes','First exercise','Observation log','Reflection'].entries()){
      const p=doc.addPage([420,560]);p.drawRectangle({x:0,y:0,width:420,height:560,color:rgb(.97,.97,.93)});p.drawText('NORTH HOUSE  /  FIELD NOTES',{x:34,y:498,size:12,font});
      p.drawText(title,{x:34,y:399,size:30,font});p.drawText('Sample workbook  /  page '+(i+1),{x:34,y:345,size:12,font});
    }
    return [new File([await doc.save()],'workbook.pdf',{type:'application/pdf'})];
  }
  if(key==='zip')return [new File(['Welcome to your creator kit.\n'],'Welcome.txt'),new File(['Review artwork\nExport the files\n'],'Release checklist.txt'),new File(['colour,hex\nForest,#19493d\n'],'Palette.csv')];
  if(key==='hash')return [new File(['abc'],'sample.txt',{type:'text/plain'})];
  if(['webp','watermark','resize'].includes(key))return [await (await import('./images.mjs')).sampleImage()];
  return [];
}
