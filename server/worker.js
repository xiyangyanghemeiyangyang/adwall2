const { parentPort } = require('worker_threads');

parentPort.on('message', (task) => {
  if (task.type === 'compute') {
    const result = heavyCompute();
    parentPort.postMessage({ ts: task.ts, result });
  }
});

function heavyCompute() {
  // Mock: generate random KPI for customer module
  const total = 100 + Math.floor(Math.random() * 50);
  const signed = Math.floor(total * Math.random());
  const pending = total - signed;
  const active = Math.floor(total * Math.random());
  return { total, signed, pending, active };
}


