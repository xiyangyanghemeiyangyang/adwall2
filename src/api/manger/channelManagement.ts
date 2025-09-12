export type ChannelStatus = '启用' | '停用';

export interface ChannelItem {
  id: string;
  name: string;
  type: string; // 渠道类型，如：社交媒体、广告投放、内容营销 等
  platform: string; // 平台，如：抖音、快手、百度广告、Google Ads
  budget: number; // 预算
  status: ChannelStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelPerformance {
  id: string;
  channelId: string;
  date: string; // ISO
  impressions: number; // 展示
  clicks: number; // 点击
  conversions: number; // 转化
  cost: number; // 成本
  revenue: number; // 收入
}

export interface ChannelListResponse {
  data: ChannelItem[];
  total: number;
}

export interface ChannelStatsRow {
  channelId: string;
  name: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  revenue: number;
  roi: number; // 收入/成本
  cvr: number; // 转化率 = 转化/点击
}

const CHANNEL_STORAGE_KEY = 'cm_channels';
const PERF_STORAGE_KEY = 'cm_channel_perf';

const save = (data: ChannelItem[]) => {
  try { localStorage.setItem(CHANNEL_STORAGE_KEY, JSON.stringify(data)); } catch {}
};
const load = (seed: ChannelItem[]) => {
  try {
    const raw = localStorage.getItem(CHANNEL_STORAGE_KEY);
    if (!raw) { save(seed); return seed; }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seed;
  } catch {
    save(seed);
    return seed;
  }
};

const savePerf = (data: ChannelPerformance[]) => {
  try { localStorage.setItem(PERF_STORAGE_KEY, JSON.stringify(data)); } catch {}
};
const loadPerf = (seed: ChannelPerformance[]) => {
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
const channelSeed: ChannelItem[] = [
  {
    id: 'ch1',
    name: '抖音信息流',
    type: '社交媒体',
    platform: '抖音',
    budget: 30000,
    status: '启用',
    description: '短视频信息流广告投放',
    createdAt: '2024-02-01 10:00:00',
    updatedAt: '2024-02-01 10:00:00',
  },
  {
    id: 'ch2',
    name: '百度竞价',
    type: '广告投放',
    platform: '百度',
    budget: 50000,
    status: '启用',
    description: 'SEM 关键词投放',
    createdAt: '2024-01-20 09:30:00',
    updatedAt: '2024-01-20 09:30:00',
  },
  {
    id: 'ch3',
    name: '微信公众号',
    type: '内容营销',
    platform: '微信',
    budget: 10000,
    status: '停用',
    description: '图文软文投放',
    createdAt: '2024-01-10 11:00:00',
    updatedAt: '2024-01-10 11:00:00',
  },
];

const perfSeed: ChannelPerformance[] = [
  { id: 'p1', channelId: 'ch1', date: '2024-02-01T00:00:00.000Z', impressions: 120000, clicks: 8000, conversions: 560, cost: 18000, revenue: 45000 },
  { id: 'p2', channelId: 'ch2', date: '2024-02-01T00:00:00.000Z', impressions: 90000, clicks: 5000, conversions: 300, cost: 22000, revenue: 40000 },
  { id: 'p3', channelId: 'ch3', date: '2024-02-01T00:00:00.000Z', impressions: 30000, clicks: 1200, conversions: 60, cost: 4000, revenue: 6000 },
];

export const mockChannels: ChannelItem[] = load(channelSeed);
export const mockPerfs: ChannelPerformance[] = loadPerf(perfSeed);

export const channelApi = {
  getChannels: (params?: { page?: number; pageSize?: number; search?: string; status?: ChannelStatus | ''; type?: string; platform?: string }) => {
    return new Promise<ChannelListResponse>((resolve) => {
      setTimeout(() => {
        let list = [...mockChannels];
        if (params?.search) {
          list = list.filter(i => i.name.includes(params.search!) || i.platform.includes(params.search!) || (i.description || '').includes(params.search!));
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

  createChannel: (payload: Omit<ChannelItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const id = 'ch' + (Math.max(0, ...mockChannels.map(i => Number(String(i.id).replace('ch','')))) + 1);
        const now = new Date().toISOString();
        mockChannels.unshift({ ...payload, id, createdAt: now, updatedAt: now });
        save(mockChannels);
        resolve(true);
      }, 200);
    });
  },

  updateChannel: (id: string, payload: Partial<ChannelItem>) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const idx = mockChannels.findIndex(i => i.id === id);
        if (idx >= 0) {
          mockChannels[idx] = { ...mockChannels[idx], ...payload, updatedAt: new Date().toISOString() };
          save(mockChannels);
          resolve(true);
        } else resolve(false);
      }, 200);
    });
  },

  deleteChannel: (id: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const idx = mockChannels.findIndex(i => i.id === id);
        if (idx >= 0) {
          mockChannels.splice(idx, 1);
          save(mockChannels);
          resolve(true);
        } else resolve(false);
      }, 200);
    });
  },

  // 汇总每个渠道的总数据，返回指标行
  getChannelStats: (params?: { page?: number; pageSize?: number; search?: string }) => {
    return new Promise<{ data: ChannelStatsRow[]; total: number }>((resolve) => {
      setTimeout(() => {
        const byChannel = new Map<string, ChannelStatsRow>();
        for (const c of mockChannels) {
          byChannel.set(c.id, {
            channelId: c.id,
            name: c.name,
            impressions: 0,
            clicks: 0,
            conversions: 0,
            cost: 0,
            revenue: 0,
            roi: 0,
            cvr: 0,
          });
        }
        for (const p of mockPerfs) {
          const agg = byChannel.get(p.channelId);
          if (agg) {
            agg.impressions += p.impressions;
            agg.clicks += p.clicks;
            agg.conversions += p.conversions;
            agg.cost += p.cost;
            agg.revenue += p.revenue;
          }
        }
        const rows = Array.from(byChannel.values()).map(r => ({
          ...r,
          roi: r.cost > 0 ? Number((r.revenue / r.cost).toFixed(2)) : 0,
          cvr: r.clicks > 0 ? Number((r.conversions / r.clicks).toFixed(4)) : 0,
        }));
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
};