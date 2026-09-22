import { readFileSync, writeFileSync } from 'node:fs';
const id = process.argv[2];
if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '') || id.startsWith('00000000-')) {
  console.error('Usage: npm run db:configure -- <real D1 database UUID>');
  process.exit(1);
}
const config = JSON.parse(readFileSync(new URL('../wrangler.example.jsonc', import.meta.url), 'utf8'));
config.d1_databases[0].database_id = id;
writeFileSync(new URL('../wrangler.production.jsonc', import.meta.url), JSON.stringify(config, null, 2) + '\n');
console.log('Created ignored wrangler.production.jsonc. Use npm run db:remote to apply migrations.');
