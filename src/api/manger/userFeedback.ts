// src/api/manger/userFeedback.ts
export type Rating = 1 | 2 | 3 | 4 | 5;

export type EnterpriseFeedbackItem = {
  id: string;
  packageId: string;
  packageName: string;
  rating: Rating;
  title?: string;
  content: string;
  pros?: string[];
  cons?: string[];
  suggestion?: string;
  createdAt: string;
  author: string;
  version?: string; // 可选：套餐版本或周期说明
};

export type JobseekerFeedbackItem = {
  id: string;
  jobId: string;
  jobTitle: string;
  rating: Rating;
  title?: string;
  content: string;
  step?: '投递' | '筛选' | '面试' | '录用' | '入职';
  createdAt: string;
  author: string;
};

export type Aggregate = {
  avgRating: number;         // 平均分（xx.x）
  total: number;             // 总评价数
  dist: Record<Rating, number>; // 评分分布
};

const delay = (ms = 200) => new Promise(r => setTimeout(r, ms));
const now = () => new Date().toISOString();

import { promoApi } from './promotionalPackages';

// 初始化一些示例套餐与岗位，用于卡片聚合
const seedJobs = [
  { jobId: 'job_1', jobTitle: '前端开发工程师' },
  { jobId: 'job_2', jobTitle: '后端开发工程师' },
  { jobId: 'job_3', jobTitle: '产品经理' },
  { jobId: 'job_4', jobTitle: '测试工程师' },
];

let enterpriseFeedback: EnterpriseFeedbackItem[] = [];
let jobseekerFeedback: JobseekerFeedbackItem[] = [];

// 随机生成少量数据
function rand<T>(arr: T[]) { return arr[Math.floor(Math.random()*arr.length)]; }
function randInt(min: number, max: number) { return Math.floor(Math.random()*(max-min+1))+min; }

async function initOnce() {
  // 从推广套餐拿到前若干个，生成与之关联的评价
  const pkgPage = await promoApi.listPackages({ page: 1, pageSize: 10 });
  const pkgs = pkgPage.data;

  if (enterpriseFeedback.length === 0) {
    pkgs.forEach(p => {
      const n = randInt(8, 20);
      for (let i=0;i<n;i++){
        const rating = rand([3,4,4,5,5]) as Rating;
        enterpriseFeedback.push({
          id: `ef_${p.id}_${i}_${Date.now()+i}`,
          packageId: p.id,
          packageName: p.name,
          rating,
          title: rating >=4 ? '效果不错' : '有待优化',
          content: rating >=4 ? '投放转化还可以，报告也比较及时。' : '投放初期效果一般，需要更主动的优化建议。',
          pros: rating >=4 ? ['服务响应快','报告清晰'] : undefined,
          cons: rating <=3 ? ['优化节奏慢'] : undefined,
          suggestion: rating <=3 ? '希望在前两周增加AB测试与素材迭代' : undefined,
          createdAt: new Date(Date.now() - randInt(0, 60)*86400000).toISOString(),
          author: `企业用户${randInt(1,99)}`,
          version: '月度套餐'
        });
      }
    });
  }

  if (jobseekerFeedback.length === 0) {
    seedJobs.forEach(j => {
      const n = randInt(6, 16);
      for (let i=0;i<n;i++){
        const rating = rand([3,4,4,5,5]) as Rating;
        jobseekerFeedback.push({
          id: `jf_${j.jobId}_${i}_${Date.now()+i}`,
          jobId: j.jobId,
          jobTitle: j.jobTitle,
          rating,
          title: rating >=4 ? '流程顺畅' : '流程一般',
          content: rating >=4 ? '投递后反馈迅速，面试安排合理。' : '投递后等待较久，建议优化沟通频度。',
          step: rand(['投递','筛选','面试','录用','入职']),
          createdAt: new Date(Date.now() - randInt(0, 60)*86400000).toISOString(),
          author: `求职者${randInt(1000,9999)}`
        });
      }
    });
  }
}

function aggregate<T extends EnterpriseFeedbackItem | JobseekerFeedbackItem>(items: T[]): Aggregate {
  const dist: Record<Rating, number> = { 1:0, 2:0, 3:0, 4:0, 5:0 };
  let sum = 0;
  items.forEach(i => { sum += i.rating; dist[i.rating as Rating]++; });
  const total = items.length;
  const avgRating = total ? Math.round((sum/total)*10)/10 : 0;
  return { avgRating, total, dist };
}

function paginate<T>(list: T[], page=1, pageSize=10) {
  const total = list.length;
  const start = (page-1)*pageSize;
  const data = list.slice(start, start+pageSize);
  return { data, total, page, pageSize };
}

export const userFeedbackApi = {
  // 企业侧：列出套餐聚合卡片
  async listEnterpriseAggregates(params: { search?: string; page?: number; pageSize?: number } = {}) {
    await initOnce(); await delay();
    const pkgPage = await promoApi.listPackages({ page: 1, pageSize: 50 });
    let cards = pkgPage.data.map(p => {
      const items = enterpriseFeedback.filter(e => e.packageId === p.id);
      const agg = aggregate(items);
      return {
        packageId: p.id,
        packageName: p.name,
        thumbnail: p.thumbnail,
        category: p.category,
        rating: agg.avgRating,
        reviewsCount: agg.total
      };
    });
    if (params.search) {
      const k = params.search.toLowerCase();
      cards = cards.filter(c => c.packageName.toLowerCase().includes(k));
    }
    return paginate(cards, params.page || 1, params.pageSize || 8);
  },

  // 企业侧：指定套餐的评分分布与详情
  async getEnterpriseDetails(params: { packageId: string; page?: number; pageSize?: number }) {
    await initOnce(); await delay();
    const all = enterpriseFeedback.filter(e => e.packageId === params.packageId)
      .sort((a,b) => (a.createdAt < b.createdAt ? 1 : -1));
    const agg = aggregate(all);
    const pageData = paginate(all, params.page || 1, params.pageSize || 10);
    return { aggregate: agg, ...pageData };
  },

  // 求职者侧：岗位聚合卡片
  async listJobAggregates(params: { search?: string; page?: number; pageSize?: number } = {}) {
    await initOnce(); await delay();
    let cards = seedJobs.map(j => {
      const items = jobseekerFeedback.filter(x => x.jobId === j.jobId);
      const agg = aggregate(items);
      return {
        jobId: j.jobId,
        jobTitle: j.jobTitle,
        rating: agg.avgRating,
        reviewsCount: agg.total
      };
    });
    if (params.search) {
      const k = params.search.toLowerCase();
      cards = cards.filter(c => c.jobTitle.toLowerCase().includes(k));
    }
    return paginate(cards, params.page || 1, params.pageSize || 8);
  },

  // 求职者侧：指定岗位/流程的评分分布与详情
  async getJobDetails(params: { jobId: string; step?: JobseekerFeedbackItem['step']; page?: number; pageSize?: number }) {
    await initOnce(); await delay();
    let all = jobseekerFeedback.filter(e => e.jobId === params.jobId);
    if (params.step) all = all.filter(e => e.step === params.step);
    all.sort((a,b) => (a.createdAt < b.createdAt ? 1 : -1));
    const agg = aggregate(all);
    const pageData = paginate(all, params.page || 1, params.pageSize || 10);
    return { aggregate: agg, ...pageData };
  },

  // 允许新增评价（可用于后续扩展表单）
  async addEnterpriseFeedback(item: Omit<EnterpriseFeedbackItem, 'id' | 'createdAt'>) {
    await initOnce(); await delay();
    const doc: EnterpriseFeedbackItem = { ...item, id: `ef_${Date.now()}`, createdAt: now() };
    enterpriseFeedback.unshift(doc);
    return doc;
  },
  async addJobseekerFeedback(item: Omit<JobseekerFeedbackItem, 'id' | 'createdAt'>) {
    await initOnce(); await delay();
    const doc: JobseekerFeedbackItem = { ...item, id: `jf_${Date.now()}`, createdAt: now() };
    jobseekerFeedback.unshift(doc);
    return doc;
  }
};