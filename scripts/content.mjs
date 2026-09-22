import { spawnSync } from 'node:child_process';
const python=process.platform==='win32'?'.venv/Scripts/python.exe':'.venv/bin/python';
const result=spawnSync(python,['scripts/save_article.py',...process.argv.slice(2)],{stdio:'inherit'});
if(result.error)throw result.error;
process.exit(result.status??1);
