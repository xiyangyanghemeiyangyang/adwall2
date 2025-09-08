const { Worker } = require('worker_threads');
const WebSocket = require('ws');
const os = require('os');

const POOL_SIZE = Math.max(2, os.cpus().length - 1);
const workers = [];
const queue = [];

function createWorker() {
  const w = new Worker(require('path').join(__dirname, 'worker.js'));
  w.busy = false;
  w.on('message', (msg) => {
    w.busy = false;
    broadcast(JSON.stringify({ type: 'result', data: msg }));
    schedule();
  });
  w.on('error', (err) => console.error('Worker error:', err));
  w.on('exit', (code) => console.log('Worker exit:', code));
  return w;
}

for (let i = 0; i < POOL_SIZE; i++) workers.push(createWorker());

function schedule() {
  const w = workers.find((w) => !w.busy);
  if (!w || queue.length === 0) return;
  const task = queue.shift();
  w.busy = true;
  w.postMessage(task);
}

function submitTask(payload) {
  queue.push(payload);
  schedule();
}

const wss = new WebSocket.Server({ port: 8080 });
function broadcast(data) {
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) client.send(data);
  }
}

setInterval(() => {
  submitTask({ type: 'compute', ts: Date.now() });
}, 1000);

process.on('SIGINT', () => {
  for (const w of workers) w.terminate();
  wss.close();
  process.exit(0);
});

console.log('Realtime worker server running on ws://localhost:8080');


