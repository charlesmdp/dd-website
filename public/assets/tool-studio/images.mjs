import {cleanName,round} from './engine.mjs';
export function surface(width,height) {
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const ctx=canvas.getContext('2d');
  if(!ctx)throw Error('This browser could not create the image. Try a smaller canvas or a browser with canvas support.');
  return {canvas,ctx};
}
export function encodeCanvas(canvas,type='image/png',quality) {
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>{
    if(!blob || blob.type!==type)reject(Error('Your browser could not export '+type+'. Try a browser that supports this format.'));
    else resolve(blob);
  },type,quality));
}
function wrapLines(ctx,text,width) {
  const lines=[];
  for(const paragraph of text.trim().split(/\r?\n/)) {
    let line='';
    for(const word of paragraph.split(/\s+/)) {
      if(ctx.measureText(word).width>width)return null;
      const next=line?line+' '+word:word;
      if(line && ctx.measureText(next).width>width){lines.push(line);line=word;}
      else line=next;
    }
    lines.push(line);
  }
  return lines;
}
export function wrapText(ctx,text,x,y,width,height,max,min,weight,family,color) {
  if(!text.trim())return;
  for(let size=max;size>=min;size-=2) {
    ctx.font=weight+' '+size+'px '+family;ctx.textBaseline='top';
    const lines=wrapLines(ctx,text,width),leading=size*1.16;
    if(lines && lines.length*leading<=height) {
      ctx.fillStyle=color;lines.forEach((line,i)=>ctx.fillText(line,x,y+i*leading));ctx.textBaseline='alphabetic';return;
    }
  }
  throw Error('This text is too long for the artwork. Shorten a line or add a space within a long word.');
}
function disc(ctx,x,y,r,color) {ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
function tile(ctx,x,y,w,h,color) {ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
function mountains(ctx,color,points) {ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();}
export async function sampleImage() {
  const {canvas,ctx}=surface(1200,800);
  tile(ctx,0,0,1200,800,'#f4d9b5');disc(ctx,888,212,103,'#f48350');
  mountains(ctx,'#719889',[[0,510],[280,280],[450,432],[640,215],[1040,525],[1200,382],[1200,800],[0,800]]);
  mountains(ctx,'#284f45',[[0,790],[0,622],[205,448],[425,590],[640,414],[990,695],[1200,540],[1200,800]]);
  tile(ctx,0,730,1200,70,'#f7efdc');ctx.fillStyle='#254e40';ctx.font='600 22px sans-serif';ctx.fillText('NORTH HOUSE  /  LANDSCAPE STUDIES',48,777);
  return new File([await encodeCanvas(canvas)],'studio-proof.png',{type:'image/png'});
}
function cover(v) {
  const {canvas,ctx}=surface(1600,2560);
  const styles={grove:['#eae9ce','#254c35','#a7bc65','#d98d44'],orbit:['#212847','#eee6e5','#8c86de','#ffd28a'],tide:['#f0c7ad','#793e3b','#b56459','#f5e7c4']};
  const [paper,ink,colour,accent]=styles[v.design]||styles.grove;
  tile(ctx,0,0,1600,2560,paper);
  tile(ctx,105,150,1390,4,ink);tile(ctx,105,2375,1390,4,ink);
  if(v.design==='orbit'){
    ctx.save();ctx.translate(814,1665);ctx.rotate(-.45);
    for(let n=0;n<6;n++){ctx.beginPath();ctx.ellipse(0,0,650-n*71,404-n*42,0,0,Math.PI*2);ctx.strokeStyle=n%2?accent:colour;ctx.lineWidth=10;ctx.stroke();}
    ctx.restore();disc(ctx,950,1465,180,colour);disc(ctx,370,1830,56,accent);disc(ctx,1220,1240,30,ink);
  } else if(v.design==='tide') {
    ctx.save();ctx.beginPath();ctx.rect(105,1120,1390,1070);ctx.clip();
    tile(ctx,105,1120,1390,1070,accent);disc(ctx,1130,1350,165,colour);
    for(let n=0;n<4;n++){ctx.fillStyle=[paper,colour,ink,accent][n];ctx.beginPath();ctx.moveTo(91,1510+n*152);ctx.bezierCurveTo(510,1180+n*180,810,1960+n*96,1510,1420+n*176);ctx.lineTo(1510,2210);ctx.lineTo(91,2210);ctx.fill();}
    ctx.restore();
  } else {
    tile(ctx,105,1110,1390,1080,colour);disc(ctx,1105,1395,163,accent);
    for(let n=0;n<7;n++){const x=150+n*192;ctx.fillStyle=n%2?'#55764e':ink;ctx.beginPath();ctx.moveTo(x,2190);ctx.bezierCurveTo(x+12,1960,x+35,1740,x+245,1450+n%3*100);ctx.bezierCurveTo(x+255,1780,x+173,2040,x+51,2190);ctx.closePath();ctx.fill();}
  }
  wrapText(ctx,v.title,102,243,1370,570,212,65,'bold','Georgia',ink);
  wrapText(ctx,v.subtitle,109,839,1330,209,59,34,'400','sans-serif',ink);
  wrapText(ctx,v.author,107,2260,1360,100,60,32,'600','sans-serif',ink);
  return canvas;
}
async function readPicture(file) {
  if(!file || file.size>24*1024*1024)throw Error('Choose a JPEG, PNG or WebP image up to 24 MiB.');
  const signature=new Uint8Array(await file.slice(0,12).arrayBuffer());
  const tag=String.fromCharCode(...signature);
  if(!(signature[0]===255&&signature[1]===216 || tag.startsWith('\x89PNG\r\n\x1a\n') || tag.startsWith('RIFF')&&tag.slice(8)==='WEBP'))throw Error('Choose a JPEG, PNG or WebP image.');
  const url=URL.createObjectURL(file),img=new Image();img.src=url;
  try {await img.decode();if(img.naturalWidth*img.naturalHeight>24000000 || Math.max(img.naturalWidth,img.naturalHeight)>16384)throw Error('This image exceeds 24 megapixels or 16,384 pixels on one side.');return img;}
  catch(error){if(error.message.includes('exceeds'))throw error;throw Error('The selected image could not be decoded. Try another JPEG, PNG or WebP file.');}
  finally{URL.revokeObjectURL(url);}
}
export async function renderImage(key,v,files) {
  if(key==='cover') {
    const canvas=cover(v);
    return {headline:'Your ebook cover',detail:'1,600 × 2,560 pixels · PNG',image:true,blob:await encodeCanvas(canvas),filename:cleanName(v.title,'ebook').toLowerCase().replace(/\s+/g,'-')+'-cover.png'};
  }
  const file=files[0],img=await readPicture(file),iw=img.naturalWidth,ih=img.naturalHeight;
  const width=key==='resize'?Number(v.width):iw,height=key==='resize'?Number(v.height):ih;
  if(key==='resize'&&(!Number.isInteger(width)||!Number.isInteger(height)||Math.min(width,height)<64||Math.max(width,height)>4096))throw Error('Choose whole target dimensions between 64 and 4,096 pixels.');
  const {canvas,ctx}=surface(width,height);
  const name=cleanName(file.name).replace(/\.[^.]+$/,'');
  if(key==='resize') {
    const scale=(v.fit==='cover'?Math.max:Math.min)(width/iw,height/ih);
    if(v.fit!=='cover')tile(ctx,0,0,width,height,'#ffffff');
    ctx.imageSmoothingQuality='high';ctx.drawImage(img,(width-iw*scale)/2,(height-ih*scale)/2,iw*scale,ih*scale);
  } else ctx.drawImage(img,0,0);
  if(key==='watermark') {
    const pad=Math.max(1,Math.min(width,height)*.048),text=v.mark.trim();
    if(!text)throw Error('Enter the text to put on the image.');
    let size=Math.max(2,Math.min(width,height)*.078);
    ctx.font='600 '+size+'px sans-serif';
    size*=Math.min(1,(width-2*pad)/ctx.measureText(text).width);ctx.font='600 '+size+'px sans-serif';
    ctx.fillStyle=v.ink==='dark'?'#17251f':'#ffffff';ctx.globalAlpha=Number(v.opacity)/100;
    const center=v.position==='center',top=v.position==='top';
    ctx.textAlign=center?'center':top?'left':'right';ctx.textBaseline=center?'middle':top?'top':'bottom';
    ctx.fillText(text,center?width/2:top?pad:width-pad,center?height/2:top?pad:height-pad);
  }
  const webp=key==='webp',type=webp?'image/webp':'image/png';
  const blob=await encodeCanvas(canvas,type,webp?Number(v.quality)/100:undefined);
  const result={image:true,blob,headline:({webp:'Your WebP image',resize:'Resized artwork',watermark:'Watermarked artwork'})[key],detail:width.toLocaleString('en-US')+' × '+height.toLocaleString('en-US')+' pixels',filename:name+(webp?'.webp':key==='resize'?'-'+width+'x'+height+'.png':'-marked.png')};
  if(webp)result.rows=[['Original',round(file.size/1024)+' KiB'],['WebP',round(blob.size/1024)+' KiB'],['Size change',round(Math.abs(blob.size/file.size-1)*100)+'% '+(blob.size<=file.size?'smaller':'larger')]];
  return result;
}
