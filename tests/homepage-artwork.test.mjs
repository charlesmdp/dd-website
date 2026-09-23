import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('original vector filters and gradients retain XML casing', () => {
  const artwork=readFileSync('dist/assets/home-icons.svg','utf8');
  assert.match(artwork, /<feGaussianBlur\b/);
  assert.match(artwork, /<linearGradient\b/);
  assert.match(artwork, /filterUnits="userSpaceOnUse"/);
  assert.doesNotMatch(artwork, /<(?:fegaussianblur|fecolormatrix|lineargradient|clippath)\b/);
  assert.doesNotMatch(artwork, /\b(?:viewbox|filterunits|stddeviation|gradientunits)=/);
});

test('original interactive islands preserve a single lightweight server-rendered page', () => {
  const html=readFileSync('dist/index.html','utf8');
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.ok(Buffer.byteLength(html)<600_000);
  for(const name of ['Steps','GalleryDown','GalleryUp','Storage','Speed','Sender','Analytics']) {
    assert.ok(html.includes(`data-original-island="${name}"`), name);
  }
  assert.doesNotMatch(html, /<script[^>]+script_main/);
  assert.doesNotMatch(html, /home-steps-demo|demo-shield|demo-storage-bars/);
  assert.match(html, /home-icons\.svg\?v=[a-f0-9]+#svg/);
  const loader=readFileSync('dist/assets/home-islands.js','utf8');
  assert.match(loader, /original-components\.mjs\?v=[a-f0-9]+/);
  const components=readFileSync('dist/assets/runtime-v3/original-components.mjs','utf8');
  assert.match(components,/export function Storage\(\)/);
  assert.match(components,/export function GalleryDown\(\)/);
});
