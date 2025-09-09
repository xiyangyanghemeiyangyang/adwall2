const { parentPort } = require('worker_threads');

parentPort.on('message', (task) => {
  if (task.type === 'compute') {
    const result = heavyCompute();
    parentPort.postMessage({ ts: task.ts, result });
  }
});

function heavyCompute() {
  // 模拟数据管理模块统计指标（与前端 getStatistics 对齐）
  const totalClicks = randInt(1_000_000, 5_000_000);
  const totalImpressions = randInt(totalClicks * 5, totalClicks * 10);
  const totalCost = randInt(totalClicks * 0.6, totalClicks * 2.5);
  const totalRevenue = randInt(totalClicks * 0.8, totalClicks * 3.5);
  const avgConversionRate = totalClicks > 0 ? +( (totalRevenue / totalClicks) * 100 ).toFixed(2) : 0;
  const totalCustomers = randInt(50, 200);
  const totalRegions = randInt(5, 7);
  return {
    totalClicks,
    totalCost,
    totalRevenue,
    totalImpressions,
    avgConversionRate,
    totalCustomers,
    totalRegions
  };
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


