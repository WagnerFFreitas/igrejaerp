const { spawn } = require('child_process');

const children = [];

function run(name, npmScript) {
  const isWindows = process.platform === 'win32';
  const command = isWindows ? (process.env.ComSpec || 'cmd.exe') : 'npm';
  const args = isWindows
    ? ['/d', '/s', '/c', `npm run ${npmScript}`]
    : ['run', npmScript];

  const child = spawn(command, args, {
    stdio: 'inherit',
  });

  child.on('exit', (code, signal) => {
    if (shuttingDown) return;
    console.log(`[${name}] finalizado${signal ? ` por ${signal}` : ` com codigo ${code}`}`);
    shutdown(code || 0);
  });

  children.push(child);
}

let shuttingDown = false;

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) child.kill();
  }

  setTimeout(() => process.exit(code), 300);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

run('api', 'api:dev');
run('web', 'dev');
