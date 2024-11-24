// scripts/run.ts
import { spawn } from 'child_process';
import path from 'path';

const script = process.argv[2];
if (!script) {
  console.error('Please specify a script to run');
  process.exit(1);
}

const scriptPath = path.join(__dirname, script + '.ts');

const child = spawn('tsx', [scriptPath], {
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
