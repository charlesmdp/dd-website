import { spawnSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
const python = process.platform === 'win32' ? '.venv/Scripts/python.exe' : '.venv/bin/python';
if (!existsSync(python)) run('python3', ['-m', 'venv', '.venv']);
run(python, ['-m', 'pip', 'install', '--disable-pip-version-check', '-q', '-r', 'requirements.txt']);
rmSync('dist', { recursive: true, force: true });
run(python, ['scripts/build_site.py']);
run(python, ['scripts/export_cloudflare.py']);
run(python, ['scripts/validate_v2.py']);
