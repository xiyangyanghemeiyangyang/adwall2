// src/api/manger/promotionalPackages.ts
export type PromotionalPackage = {
    id: string;
    name: string;
    shortDescription: string;
    description: string;
    price: number;
    priceLabel: string;
    deliveryTime: string;
    thumbnail: string;
    includes: string[];
    options: { name: string; price: number }[];
    category: 'social' | 'seo' | 'content' | 'sem' | 'branding';
    isNew?: boolean;
    isPopular?: boolean;
    rating?: number;
    reviewsCount?: number;
  };
  
  export type OrderStatus = '待审核' | '投放中' | '已完成' | '已暂停' | '已取消';
  
  export type PromotionalOrder = {
    id: string;
    packageId: string;
    packageName: string;
    status: OrderStatus;
    orderDate: string;
    startDate?: string;
    endDate?: string;
    price: number;
    selectedOptions?: string[];
    brief?: string;
    link?: string;
    targetCity?: string;
  };
  
  type ListParams = { search?: string; category?: string; page?: number; pageSize?: number };
  
  const mockPackages: PromotionalPackage[] = [
    {
      id: 'pkg_1',
      name: '抖音广告推广套餐',
      shortDescription: '每月1000次曝光',
      description:
        '在抖音进行定向广告投放，目标受众精准，适合招聘岗位曝光与品牌提升。包含投放策略、投放素材建议与每周效果报告。',
      price: 299,
      priceLabel: '¥299/月',
      deliveryTime: '1个月',
      thumbnail: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
      includes: ['抖音定向广告', '每周效果报告', '投放素材建议', '基础投放优化'],
      options: [
        { name: '额外3000次曝光', price: 199 },
        { name: '短视频制作（3条）', price: 399 },
        { name: '投放城市扩展（+3城）', price: 150 }
      ],
      category: 'social',
      isPopular: true,
      rating: 4.8,
      reviewsCount: 126
    },
    {
      id: 'pkg_2',
      name: 'SEO 搜索优化套餐',
      shortDescription: '站内技术+内容策略',
      description:
        '技术SEO体检与修复、关键词布局、栏目规划、内容策略输出，并提供基础外链建议与监测报告。',
      price: 499,
      priceLabel: '¥499/月',
      deliveryTime: '1个月',
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
      includes: ['技术SEO体检', '关键词策略', '内容规划建议', '月度报告'],
      options: [
        { name: '外链建设（10条）', price: 300 },
        { name: '深度词库拓展', price: 200 }
      ],
      category: 'seo',
      isNew: true,
      rating: 4.7,
      reviewsCount: 78
    },
    {
      id: 'pkg_3',
      name: '内容营销套餐',
      shortDescription: '图文+短视频组合',
      description:
        '为你的岗位/品牌定制内容矩阵，含图文与短视频脚本与发布节奏建议，适配多平台分发。',
      price: 399,
      priceLabel: '¥399/月',
      deliveryTime: '1个月',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
      includes: ['每周2篇图文', '每周1条短视频脚本', '分发节奏建议', '月度复盘'],
      options: [{ name: '短视频成片（4条）', price: 600 }],
      category: 'content',
      rating: 4.6,
      reviewsCount: 52
    },
    {
      id: 'pkg_4',
      name: '搜索引擎竞价（SEM）',
      shortDescription: '招聘关键词定向',
      description:
        '百度/360等搜索引擎，围绕招聘意图词投放，完善落地页转化路径，配合周报优化。',
      price: 899,
      priceLabel: '¥899/月',
      deliveryTime: '1个月',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      includes: ['账户搭建', '关键词与否词管理', '出价优化', '素材AB测'],
      options: [{ name: '落地页优化包', price: 500 }],
      category: 'sem',
      rating: 4.5,
      reviewsCount: 41
    },
    {
      id: 'pkg_5',
      name: '品牌形象升级（Branding）',
      shortDescription: '雇主品牌素材全套',
      description:
        '统一品牌视觉与招聘物料：海报模板、岗位卡片、用工优势图、规范化色彩字体与素材包。',
      price: 1299,
      priceLabel: '¥1299/一次性',
      deliveryTime: '10天',
      thumbnail: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400&h=300&fit=crop',
      includes: ['品牌规范手册', '岗位模板', '海报模板', '素材包'],
      options: [{ name: '官网招聘页设计', price: 1200 }],
      category: 'branding',
      rating: 4.9,
      reviewsCount: 33
    }
  ];
  
  let mockOrders: PromotionalOrder[] = [
    {
      id: 'ord_1',
      packageId: 'pkg_1',
      packageName: '抖音广告推广套餐',
      status: '投放中',
      orderDate: '2025-01-20',
      startDate: '2025-01-21',
      endDate: '2025-02-20',
      price: 299,
      selectedOptions: ['额外3000次曝光']
    },
    {
      id: 'ord_2',
      packageId: 'pkg_2',
      packageName: 'SEO 搜索优化套餐',
      status: '已完成',
      orderDate: '2025-01-01',
      startDate: '2025-01-02',
      endDate: '2025-02-01',
      price: 699,
      selectedOptions: ['外链建设（10条）']
    },
    {
      id: 'ord_3',
      packageId: 'pkg_3',
      packageName: '内容营销套餐',
      status: '待审核',
      orderDate: '2025-01-28',
      price: 399
    }
  ];
  
  const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));
  const paginate = <T,>(arr: T[], page = 1, pageSize = 6) => {
    const total = arr.length;
    const start = (page - 1) * pageSize;
    const data = arr.slice(start, start + pageSize);
    return { data, total, page, pageSize };
  };
  
  export const promoApi = {
    async listPackages(params: ListParams = {}) {
      await delay();
      const { search = '', category = '', page = 1, pageSize = 6 } = params;
      let list = [...mockPackages];
      if (search) {
        const k = search.toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(k) ||
            p.shortDescription.toLowerCase().includes(k) ||
            p.description.toLowerCase().includes(k)
        );
      }
      if (category && category !== 'all') {
        list = list.filter((p) => p.category === category);
      }
      return paginate(list, page, pageSize);
    },
  
    async getPackageById(id: string) {
      await delay();
      const found = mockPackages.find((p) => p.id === id);
      if (!found) throw new Error('套餐不存在');
      return found;
    },
  
    async listOrders(params: { page?: number; pageSize?: number } = {}) {
      await delay();
      const { page = 1, pageSize = 5 } = params;
      const sorted = [...mockOrders].sort((a, b) => (a.orderDate < b.orderDate ? 1 : -1));
      return paginate(sorted, page, pageSize);
    },
  
    async createOrder(payload: Omit<PromotionalOrder, 'id' | 'status' | 'orderDate' | 'packageName'>) {
      await delay();
      const pkg = mockPackages.find((p) => p.id === payload.packageId);
      if (!pkg) throw new Error('套餐不存在');
      const id = `ord_${Date.now()}`;
      const order: PromotionalOrder = {
        ...payload,
        id,
        status: '待审核',
        orderDate: new Date().toISOString().slice(0, 10),
        packageName: pkg.name
      };
      mockOrders.unshift(order);
      return order;
    },
  
    async updateOrderStatus(id: string, status: OrderStatus) {
      await delay();
      const idx = mockOrders.findIndex((o) => o.id === id);
      if (idx === -1) throw new Error('订单不存在');
      mockOrders[idx].status = status;
      return true;
    },
  
    async pauseOrder(id: string) {
      return this.updateOrderStatus(id, '已暂停');
    },
  
    async resumeOrder(id: string) {
      return this.updateOrderStatus(id, '投放中');
    },
  
    async cancelOrder(id: string) {
      return this.updateOrderStatus(id, '已取消');
    },
  
    async renewOrder(id: string, extraMonth = 1) {
      await delay();
      const idx = mockOrders.findIndex((o) => o.id === id);
      if (idx === -1) throw new Error('订单不存在');
      const o = mockOrders[idx];
      const start = o.endDate ? new Date(o.endDate) : new Date();
      const end = new Date(start);
      end.setMonth(end.getMonth() + extraMonth);
      o.startDate = start.toISOString().slice(0, 10);
      o.endDate = end.toISOString().slice(0, 10);
      o.status = '投放中';
      return true;
    }
  };