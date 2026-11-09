import test from 'node:test';
import assert from 'node:assert/strict';
import {run} from '../public/assets/tool-studio/engine.mjs';
import {pageOrder,makeZip} from '../public/assets/tool-studio/files.mjs';

test('pricing, launch and print estimates match their worked examples', async()=>{
  assert.equal((await run('price',{cost:6.5,flat:.3,fee:3,margin:60})).headline,'$18.38');
  assert.equal((await run('breakeven',{budget:900,price:20,cost:2,flat:0,fee:0})).headline,'50 orders');
  assert.equal((await run('dpi',{width:3600,height:5400,ppi:300})).rows[0][1],'30.48 × 45.72 cm');
  assert.equal((await run('bundle',{items:'Book | 24\nA | 18\nB | 18',price:45})).rows.at(-1)[1],'25%');
  assert.equal((await run('download',{size:1,unit:'GB',speed:50,efficiency:100})).headline,'2 min 40 sec');
  await assert.rejects(run('price',{cost:1,flat:0,fee:40,margin:60}),/100%/);
  await assert.rejects(run('breakeven',{budget:5,price:3,cost:3,flat:0,fee:0}),/contribute/);
  assert.match((await run('bundle',{items:'A | 12',price:16})).headline,/premium/);
});
test('page selections preserve order, collapse duplicates and reject corrupt ranges',()=>{
  assert.deepEqual(pageOrder('4, 1, 3-4',4),[3,0,2]);
  for(const item of ['2-1','4-5','0','1,','2.5','1 - 900000'])assert.throws(()=>pageOrder(item,4));
});
test('ZIP headers, CRCs, duplicate paths, empty files and the end record are readable',async()=>{
  const files=[new File(['123456789'],'é.txt'),new File([''],'é.txt'),new File(['a'],'../b')];
  const {blob,items}=await makeZip(files);
  assert.deepEqual(items,['é.txt','é (2).txt','-b']);
  const bytes=Buffer.from(await blob.arrayBuffer()),end=bytes.length-22;
  assert.equal(bytes.readUInt32LE(0),0x04034b50);
  assert.equal(bytes.readUInt16LE(6),0x800);
  assert.equal(bytes.readUInt32LE(14),0xcbf43926);
  assert.equal(bytes.readUInt32LE(end),0x06054b50);
  assert.equal(bytes.readUInt16LE(end+10),3);
  const directory=bytes.readUInt32LE(end+16);
  assert.equal(bytes.readUInt32LE(directory),0x02014b50);
  assert.equal(bytes.readUInt32LE(end+12)+directory,end);
  await assert.rejects(makeZip(Array(41).fill(files[0])),/40/);
});
test('checksum verifies known SHA-256 bytes without ignoring a mismatch',async()=>{
  const good='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
  const files=[new File(['abc'],'hello.txt')];
  assert.equal((await run('hash',{expected:good.toUpperCase()},files)).headline,'Checksums match');
  assert.equal((await run('hash',{expected:'0'.repeat(64)},files)).headline,'Checksums differ');
  await assert.rejects(run('hash',{expected:'abc'},files),/64/);
});
test('inventory outputs are unique and preserve the original variant values',async()=>{
  const keys=(await run('license',{prefix:'STUDIO',count:1000,groups:3,length:4})).text.trim().split('\r\n').slice(1);
  assert.equal(new Set(keys).size,1000);
  assert.ok(keys.every(k=>/^"STUDIO-([A-HJ-NP-Z2-9]{4}-){2}[A-HJ-NP-Z2-9]{4}"$/.test(k)));
  const values={base:'NOTES',editions:'Standard\nDeluxe',formats:'PDF\nEPUB\nZIP'};
  assert.equal((await run('sku',values)).text.trim().split('\r\n').length,7);
  await assert.rejects(run('sku',{...values,editions:'Café\nCafe'}),/CAFE/);
  assert.match((await run('sku',{...values,editions:'=A1'})).text,/"'=A1"/);
});
test('landing-page exports escape merchant input and preserve URL parameters',async()=>{
  const result=await run('utm',{url:'https://example.org/item?variant=4&utm_source=a&utm_source=b&utm_term=old#details',source:'team & co',medium:'email',campaign:'launch',term:'',content:''});
  const url=new URL(result.text);assert.deepEqual(url.searchParams.getAll('utm_source'),['team & co']);
  assert.equal(url.searchParams.get('variant'),'4');assert.equal(url.hash,'#details');assert.equal(url.searchParams.has('utm_term'),false);
  await assert.rejects(run('utm',{url:'javascript:alert(1)'}),/web URL/);
  assert.ok((await run('snippet',{url:'https://example.org',title:'<b>&',description:'" test'})).text.includes('&lt;b&gt;&amp;'));
  const faq=await run('faq',{entries:[{q:'What is <included>?',a:'</script><img onerror=x>'}]});
  assert.ok(faq.text.includes('&lt;/script&gt;'));assert.equal(faq.text.match(/<\/script>/g).length,1);
  const schema=JSON.parse(faq.text.split('application/ld+json">\n')[1].split('\n</script>')[0]);assert.equal(schema.mainEntity[0].acceptedAnswer.text,'</script><img onerror=x>');
  const email=await run('email',{url:'https://example.org/file',product:'Notes',store:'House',support:'h@example.org',instructions:'Print at 100%.'});
  assert.ok(email.text.includes('Subject: Your Notes download is ready'));assert.ok(email.text.includes('Print at 100%.'));
});
