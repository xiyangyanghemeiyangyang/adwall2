// src/api/manger/jobManagement.ts
export type JobStatus = '待审核' | '已发布' | '已下架' | '已驳回';

export interface Job {
  id: string;
  title: string;
  company: string;
  city: string;
  industry: string;
  salaryRange: string;
  publishTime: string; // ISO
  status: JobStatus;
  applications: number;
  description: string;
  history: Array<{ time: string; action: string; by: string; remark?: string }>;
}

export interface JobQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: JobStatus | '';
  city?: string;
  industry?: string;
  timeFrom?: string; // ISO
  timeTo?: string;   // ISO
}

let jobs: Job[] = [
  {
    id: 'J20250001',
    title: '高级前端工程师',
    company: '星辰科技',
    city: '上海',
    industry: '互联网',
    salaryRange: '25k-40k',
    publishTime: '2025-09-01T10:22:00Z',
    status: '待审核',
    applications: 18,
    description: '负责前端架构与组件库建设，React/TypeScript 优先。',
    history: [
      { time: '2025-09-01T10:22:00Z', action: '职位创建', by: '企业-星辰科技' },
    ],
  },
  {
    id: 'J20250002',
    title: '数据分析师',
    company: '华南数科',
    city: '广州',
    industry: '大数据',
    salaryRange: '18k-28k',
    publishTime: '2025-09-05T03:12:00Z',
    status: '已发布',
    applications: 42,
    description: '负责业务指标监控、报表建设与分析洞察，熟悉SQL/可视化。',
    history: [
      { time: '2025-09-05T03:12:00Z', action: '职位创建', by: '企业-华南数科' },
      { time: '2025-09-05T06:30:00Z', action: '审核通过', by: '管理员A' },
      { time: '2025-09-05T06:35:00Z', action: '职位发布', by: '系统' },
    ],
  },
  {
    id: 'J20250003',
    title: '渠道运营经理',
    company: '北极光网络',
    city: '北京',
    industry: '互联网',
    salaryRange: '20k-32k',
    publishTime: '2025-09-07T08:15:00Z',
    status: '已下架',
    applications: 7,
    description: '负责渠道拓展与运营，制定渠道策略与落地执行。',
    history: [
      { time: '2025-09-07T08:15:00Z', action: '职位创建', by: '企业-北极光网络' },
      { time: '2025-09-07T10:10:00Z', action: '审核通过', by: '管理员A' },
      { time: '2025-09-10T02:00:00Z', action: '强制下架', by: '管理员B', remark: '描述不规范' },
    ],
  },
];

const delay = <T,>(data: T, ms = 300) => new Promise<T>(resolve => setTimeout(() => resolve(data), ms));

export const jobApi = {
  async getJobs(query: JobQuery = {}) {
    const {
      page = 1,
      pageSize = 10,
      keyword = '',
      status = '',
      city = '',
      industry = '',
      timeFrom,
      timeTo,
    } = query;

    let list = [...jobs];

    if (keyword) {
      const k = keyword.trim();
      list = list.filter(j =>
        j.title.includes(k) || j.company.includes(k) || j.id.includes(k)
      );
    }
    if (status) list = list.filter(j => j.status === status);
    if (city) list = list.filter(j => j.city === city);
    if (industry) list = list.filter(j => j.industry === industry);
    if (timeFrom) list = list.filter(j => new Date(j.publishTime) >= new Date(timeFrom));
    if (timeTo) list = list.filter(j => new Date(j.publishTime) <= new Date(timeTo));

    const total = list.length;
    const start = (page - 1) * pageSize;
    const data = list.slice(start, start + pageSize);
    return delay({ data, total, page, pageSize });
  },

  async getJobById(id: string) {
    const job = jobs.find(j => j.id === id) || null;
    return delay(job);
  },

  async approveJob(id: string) {
    const j = jobs.find(x => x.id === id);
    if (!j) return delay(false);
    j.status = '已发布';
    j.history.push({ time: new Date().toISOString(), action: '审核通过', by: '管理员' });
    return delay(true);
  },

  async rejectJob(id: string, reason: string) {
    const j = jobs.find(x => x.id === id);
    if (!j) return delay(false);
    j.status = '已驳回';
    j.history.push({ time: new Date().toISOString(), action: '审核驳回', by: '管理员', remark: reason });
    return delay(true);
  },

  async takeDownJob(id: string, reason?: string) {
    const j = jobs.find(x => x.id === id);
    if (!j) return delay(false);
    j.status = '已下架';
    j.history.push({ time: new Date().toISOString(), action: '强制下架', by: '管理员', remark: reason });
    return delay(true);
  },

  async updateJob(id: string, data: Partial<Job>) {
    const j = jobs.find(x => x.id === id);
    if (!j) return delay(false);
    Object.assign(j, data);
    j.history.push({ time: new Date().toISOString(), action: '职位编辑', by: '管理员' });
    return delay(true);
  },

  async deleteJob(id: string) {
    const idx = jobs.findIndex(x => x.id === id);
    if (idx < 0) return delay(false);
    jobs.splice(idx, 1);
    return delay(true);
  },
};