export type AdCampaignStatus = '进行中' | '已暂停' | '已结束' | '待审核';

export interface AdCampaignItem {
  id: string;
  name: string;
  type: string; // 广告类型：信息流、搜索、展示、视频等
  platform: string; // 投放平台：抖音、快手、百度、微信、Google Ads等
  budget: number; // 预算
  dailyBudget: number; // 日预算
  status: AdCampaignStatus;
  targetAudience: string; // 目标受众
  keywords: string[]; // 关键词
  startDate: string; // 开始时间
  endDate: string; // 结束时间
  description?: string;
  createdAt: string;
  updatedAt: string;
  // 效果数据
  impressions?: number;
  clicks?: number;
  conversions?: number;
  cost?: number;
  revenue?: number;
  ctr?: number; // 点击率
  cpc?: number; // 平均点击成本
  cpa?: number; // 平均转化成本
  roi?: number; // 投资回报率
}

export interface AdPerformance {
  id: string;
  campaignId: string;
  date: string; // ISO
  impressions: number; // 展示量
  clicks: number; // 点击量
  conversions: number; // 转化量
  cost: number; // 成本
  revenue: number; // 收入
  ctr: number; // 点击率
  cpc: number; // 平均点击成本
  cpa: number; // 平均转化成本
}

export interface AdCampaignListResponse {
  data: AdCampaignItem[];
  total: number;
}

export interface AdCampaignStatsRow {
  campaignId: string;
  name: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  revenue: number;
  roi: number; // 投资回报率
  ctr: number; // 点击率
  cpc: number; // 平均点击成本
  cpa: number; // 平均转化成本
}

const CAMPAIGN_STORAGE_KEY = 'ad_campaigns';
const PERF_STORAGE_KEY = 'ad_campaign_perf';

const save = (data: AdCampaignItem[]) => {
  try { localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(data)); } catch {}
};

const load = (seed: AdCampaignItem[]) => {
  try {
    const raw = localStorage.getItem(CAMPAIGN_STORAGE_KEY);
    if (!raw) { save(seed); return seed; }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seed;
  } catch {
    save(seed);
    return seed;
  }
};

const savePerf = (data: AdPerformance[]) => {
  try { localStorage.setItem(PERF_STORAGE_KEY, JSON.stringify(data)); } catch {}
};

const loadPerf = (seed: AdPerformance[]) => {
  try {
    const raw = localStorage.getItem(PERF_STORAGE_KEY);
    if (!raw) { savePerf(seed); return seed; }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seed;
  } catch {
    savePerf(seed);
    return seed;
  }
};

// 种子数据
const campaignSeed: AdCampaignItem[] = [
  {
    id: 'ac1',
    name: '春季招聘信息流广告',
    type: '信息流',
    platform: '抖音',
    budget: 50000,
    dailyBudget: 2000,
    status: '进行中',
    targetAudience: '18-35岁求职者',
    keywords: ['招聘', '工作', '求职', '岗位'],
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    description: '针对春季招聘季的信息流广告投放，主要推广技术岗位',
    createdAt: '2024-02-01 10:00:00',
    updatedAt: '2024-02-01 10:00:00',
    impressions: 150000,
    clicks: 12000,
    conversions: 800,
    cost: 18000,
    revenue: 60000,
    ctr: 0.08,
    cpc: 1.5,
    cpa: 22.5,
    roi: 3.33
  },
  {
    id: 'ac2',
    name: '百度搜索推广',
    type: '搜索',
    platform: '百度',
    budget: 30000,
    dailyBudget: 1500,
    status: '进行中',
    targetAudience: '有明确求职意向的用户',
    keywords: ['前端开发', '后端开发', '产品经理', 'UI设计师'],
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    description: 'SEM关键词投放，精准匹配求职需求',
    createdAt: '2024-01-15 09:30:00',
    updatedAt: '2024-01-15 09:30:00',
    impressions: 80000,
    clicks: 6000,
    conversions: 450,
    cost: 12000,
    revenue: 45000,
    ctr: 0.075,
    cpc: 2.0,
    cpa: 26.67,
    roi: 3.75
  },
  {
    id: 'ac3',
    name: '快手短视频招聘',
    type: '视频',
    platform: '快手',
    budget: 25000,
    dailyBudget: 1000,
    status: '已暂停',
    targetAudience: '年轻求职群体',
    keywords: ['短视频', '招聘', '工作机会'],
    startDate: '2024-01-01',
    endDate: '2024-02-29',
    description: '短视频形式展示工作环境和岗位信息',
    createdAt: '2024-01-01 11:00:00',
    updatedAt: '2024-01-01 11:00:00',
    impressions: 60000,
    clicks: 3000,
    conversions: 180,
    cost: 8000,
    revenue: 18000,
    ctr: 0.05,
    cpc: 2.67,
    cpa: 44.44,
    roi: 2.25
  },
  {
    id: 'ac4',
    name: '微信朋友圈广告',
    type: '展示',
    platform: '微信',
    budget: 20000,
    dailyBudget: 800,
    status: '待审核',
    targetAudience: '职场人士',
    keywords: ['职场', '跳槽', '新机会'],
    startDate: '2024-03-01',
    endDate: '2024-05-31',
    description: '朋友圈精准投放，触达职场人群',
    createdAt: '2024-02-20 14:00:00',
    updatedAt: '2024-02-20 14:00:00',
    impressions: 0,
    clicks: 0,
    conversions: 0,
    cost: 0,
    revenue: 0,
    ctr: 0,
    cpc: 0,
    cpa: 0,
    roi: 0
  },
  {
    id: 'ac5',
    name: 'Google Ads海外招聘',
    type: '搜索',
    platform: 'Google Ads',
    budget: 40000,
    dailyBudget: 1800,
    status: '进行中',
    targetAudience: '海外技术人才',
    keywords: ['remote work', 'tech jobs', 'software engineer'],
    startDate: '2024-02-10',
    endDate: '2024-06-10',
    description: '面向海外技术人才的招聘广告投放',
    createdAt: '2024-02-10 16:00:00',
    updatedAt: '2024-02-10 16:00:00',
    impressions: 120000,
    clicks: 9000,
    conversions: 600,
    cost: 15000,
    revenue: 50000,
    ctr: 0.075,
    cpc: 1.67,
    cpa: 25.0,
    roi: 3.33
  },
  {
    id: 'ac6',
    name: 'LinkedIn专业招聘',
    type: '展示',
    platform: 'LinkedIn',
    budget: 35000,
    dailyBudget: 1600,
    status: '已结束',
    targetAudience: '专业职场人士',
    keywords: ['career', 'job opportunity', 'professional'],
    startDate: '2024-01-01',
    endDate: '2024-02-28',
    description: 'LinkedIn平台专业招聘广告',
    createdAt: '2024-01-01 12:00:00',
    updatedAt: '2024-01-01 12:00:00',
    impressions: 90000,
    clicks: 4500,
    conversions: 300,
    cost: 11000,
    revenue: 35000,
    ctr: 0.05,
    cpc: 2.44,
    cpa: 36.67,
    roi: 3.18
  }
];

const perfSeed: AdPerformance[] = [
  { 
    id: 'p1', 
    campaignId: 'ac1', 
    date: '2024-02-01T00:00:00.000Z', 
    impressions: 150000, 
    clicks: 12000, 
    conversions: 800, 
    cost: 18000, 
    revenue: 60000,
    ctr: 0.08,
    cpc: 1.5,
    cpa: 22.5
  },
  { 
    id: 'p2', 
    campaignId: 'ac2', 
    date: '2024-02-01T00:00:00.000Z', 
    impressions: 80000, 
    clicks: 6000, 
    conversions: 450, 
    cost: 12000, 
    revenue: 45000,
    ctr: 0.075,
    cpc: 2.0,
    cpa: 26.67
  },
  { 
    id: 'p3', 
    campaignId: 'ac3', 
    date: '2024-02-01T00:00:00.000Z', 
    impressions: 60000, 
    clicks: 3000, 
    conversions: 180, 
    cost: 8000, 
    revenue: 18000,
    ctr: 0.05,
    cpc: 2.67,
    cpa: 44.44
  },
  { 
    id: 'p4', 
    campaignId: 'ac5', 
    date: '2024-02-01T00:00:00.000Z', 
    impressions: 120000, 
    clicks: 9000, 
    conversions: 600, 
    cost: 15000, 
    revenue: 50000,
    ctr: 0.075,
    cpc: 1.67,
    cpa: 25.0
  },
  { 
    id: 'p5', 
    campaignId: 'ac6', 
    date: '2024-02-01T00:00:00.000Z', 
    impressions: 90000, 
    clicks: 4500, 
    conversions: 300, 
    cost: 11000, 
    revenue: 35000,
    ctr: 0.05,
    cpc: 2.44,
    cpa: 36.67
  }
];

export const mockCampaigns: AdCampaignItem[] = load(campaignSeed);
export const mockPerfs: AdPerformance[] = loadPerf(perfSeed);

export const adCampaignApi = {
  getCampaigns: (params?: { 
    page?: number; 
    pageSize?: number; 
    search?: string; 
    status?: AdCampaignStatus | ''; 
    type?: string; 
    platform?: string; 
  }) => {
    return new Promise<AdCampaignListResponse>((resolve) => {
      setTimeout(() => {
        let list = [...mockCampaigns];
        if (params?.search) {
          list = list.filter(i => 
            i.name.includes(params.search!) || 
            i.platform.includes(params.search!) || 
            (i.description || '').includes(params.search!) ||
            i.keywords.some(k => k.includes(params.search!))
          );
        }
        if (params?.status) list = list.filter(i => i.status === params.status);
        if (params?.type) list = list.filter(i => i.type === params.type);
        if (params?.platform) list = list.filter(i => i.platform === params.platform);

        const total = list.length;
        const page = params?.page || 1;
        const pageSize = params?.pageSize || 10;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        resolve({ data: list.slice(start, end), total });
      }, 300);
    });
  },

  createCampaign: (payload: Omit<AdCampaignItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const id = 'ac' + (Math.max(0, ...mockCampaigns.map(i => Number(String(i.id).replace('ac','')))) + 1);
        const now = new Date().toISOString();
        mockCampaigns.unshift({ 
          ...payload, 
          id, 
          createdAt: now, 
          updatedAt: now,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          cost: 0,
          revenue: 0,
          ctr: 0,
          cpc: 0,
          cpa: 0,
          roi: 0
        });
        save(mockCampaigns);
        resolve(true);
      }, 200);
    });
  },

  updateCampaign: (id: string, payload: Partial<AdCampaignItem>) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const idx = mockCampaigns.findIndex(i => i.id === id);
        if (idx >= 0) {
          mockCampaigns[idx] = { ...mockCampaigns[idx], ...payload, updatedAt: new Date().toISOString() };
          save(mockCampaigns);
          resolve(true);
        } else resolve(false);
      }, 200);
    });
  },

  deleteCampaign: (id: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const idx = mockCampaigns.findIndex(i => i.id === id);
        if (idx >= 0) {
          mockCampaigns.splice(idx, 1);
          save(mockCampaigns);
          resolve(true);
        } else resolve(false);
      }, 200);
    });
  },

  // 获取广告投放统计数据
  getCampaignStats: (params?: { page?: number; pageSize?: number; search?: string }) => {
    return new Promise<{ data: AdCampaignStatsRow[]; total: number }>((resolve) => {
      setTimeout(() => {
        const byCampaign = new Map<string, AdCampaignStatsRow>();
        for (const c of mockCampaigns) {
          byCampaign.set(c.id, {
            campaignId: c.id,
            name: c.name,
            impressions: c.impressions || 0,
            clicks: c.clicks || 0,
            conversions: c.conversions || 0,
            cost: c.cost || 0,
            revenue: c.revenue || 0,
            roi: c.roi || 0,
            ctr: c.ctr || 0,
            cpc: c.cpc || 0,
            cpa: c.cpa || 0,
          });
        }
        const rows = Array.from(byCampaign.values());
        let list = rows;
        if (params?.search) {
          list = list.filter(r => r.name.includes(params.search!));
        }
        const total = list.length;
        const page = params?.page || 1;
        const pageSize = params?.pageSize || 10;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        resolve({ data: list.slice(start, end), total });
      }, 300);
    });
  },

  // 获取单个广告活动的详细数据
  getCampaignPerformance: (campaignId: string) => {
    return new Promise<AdPerformance[]>((resolve) => {
      setTimeout(() => {
        const perf = mockPerfs.filter(p => p.campaignId === campaignId);
        resolve(perf);
      }, 200);
    });
  },
};
