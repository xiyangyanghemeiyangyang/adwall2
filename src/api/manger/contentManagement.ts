export type ContentStatus = '待审核' | '已发布' | '已下架';

export interface ContentItem {
  id: string;
  title: string;
  status: ContentStatus;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  body: string;
}

// 新增：招聘模板接口
export interface RecruitmentTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  category: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// 新增：模板列表响应接口
export interface TemplateListResponse {
  data: RecruitmentTemplate[];
  total: number;
}

const STORAGE_KEY = 'cm_contents';
const TEMPLATE_STORAGE_KEY = 'cm_templates';

const save = (data: ContentItem[]) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
};

const load = (seed: ContentItem[]): ContentItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { save(seed); return seed; }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seed;
  } catch {
    save(seed);
    return seed;
  }
};

// 新增：模板存储函数
const saveTemplates = (data: RecruitmentTemplate[]) => {
  try { localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(data)); } catch {}
};

const loadTemplates = (seed: RecruitmentTemplate[]): RecruitmentTemplate[] => {
  try {
    const raw = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    if (!raw) { saveTemplates(seed); return seed; }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seed;
  } catch {
    saveTemplates(seed);
    return seed;
  }
};

const seed: ContentItem[] = [
  {
    id: 'c1',
    title: 'A岗位',
    status: '待审核',
    authorId: '1',
    authorName: '张三',
    createdAt: '2024-02-01 10:00:00',
    updatedAt: '2024-02-01 10:00:00',
    body: '123456',
  },
  {
    id: 'c2',
    title: 'B岗位',
    status: '已发布',
    authorId: '2',
    authorName: '李四',
    createdAt: '2024-01-20 09:30:00',
    updatedAt: '2024-01-22 14:10:00',
    body: '147258',
  },
  {
    id: 'c3',
    title: 'C岗位',
    status: '已下架',
    authorId: '5',
    authorName: '钱七',
    createdAt: '2024-01-10 11:00:00',
    updatedAt: '2024-01-18 08:45:00',
    body: '777888999',
  },
];

// 新增：模板种子数据
const templateSeed: RecruitmentTemplate[] = [
  {
    id: 't1',
    name: '技术岗位通用模板',
    description: '适用于软件开发、测试等技术岗位',
    content: '岗位职责：\n1. 负责系统开发与维护\n2. 参与需求分析\n3. 编写技术文档\n\n任职要求：\n1. 本科及以上学历\n2. 3年以上相关经验\n3. 熟练掌握相关技术栈',
    category: '技术类',
    usageCount: 15,
    createdAt: '2024-01-15 10:00:00',
    updatedAt: '2024-01-15 10:00:00',
    createdBy: '管理员'
  },
  {
    id: 't2',
    name: '销售岗位模板',
    description: '适用于销售、市场推广等岗位',
    content: '岗位职责：\n1. 开发新客户\n2. 维护现有客户关系\n3. 完成销售目标\n\n任职要求：\n1. 大专及以上学历\n2. 2年以上销售经验\n3. 良好的沟通能力',
    category: '销售类',
    usageCount: 8,
    createdAt: '2024-01-20 14:30:00',
    updatedAt: '2024-01-20 14:30:00',
    createdBy: '管理员'
  },
  {
    id: 't3',
    name: '管理岗位模板',
    description: '适用于部门经理、主管等管理岗位',
    content: '岗位职责：\n1. 团队管理与指导\n2. 制定部门计划\n3. 协调内外部资源\n\n任职要求：\n1. 本科及以上学历\n2. 5年以上管理经验\n3. 优秀的领导能力',
    category: '管理类',
    usageCount: 5,
    createdAt: '2024-02-01 09:15:00',
    updatedAt: '2024-02-01 09:15:00',
    createdBy: '管理员'
  }
];

export const mockContents: ContentItem[] = load(seed);
export const mockTemplates: RecruitmentTemplate[] = loadTemplates(templateSeed);

export const contentApi = {
  getContents: (params?: { page?: number; pageSize?: number; search?: string; status?: ContentStatus | '' }) => {
    return new Promise<{ data: ContentItem[]; total: number }>((resolve) => {
      setTimeout(() => {
        let list = [...mockContents];
        if (params?.search) {
          list = list.filter(i => i.title.includes(params.search!) || i.authorName.includes(params.search!));
        }
        if (params?.status) {
          list = list.filter(i => i.status === params.status);
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

  getContentById: (id: string) => {
    return new Promise<ContentItem>((resolve, reject) => {
      setTimeout(() => {
        const found = mockContents.find(i => i.id === id);
        if (found) resolve(found);
        else reject(new Error('内容不存在'));
      }, 200);
    });
  },

  updateContentStatus: (id: string, status: ContentStatus) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const idx = mockContents.findIndex(i => i.id === id);
        if (idx >= 0) {
          mockContents[idx] = { ...mockContents[idx], status, updatedAt: new Date().toISOString() };
          save(mockContents);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 200);
    });
  },

  createContent: (payload: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const id = 'c' + (Math.max(0, ...mockContents.map(i => Number(String(i.id).replace('c','')))) + 1);
        const now = new Date().toISOString();
        mockContents.unshift({ ...payload, id, createdAt: now, updatedAt: now });
        save(mockContents);
        resolve(true);
      }, 200);
    });
  },

  getTemplates: (params?: { page?: number; pageSize?: number; search?: string; category?: string }) => {
    return new Promise<TemplateListResponse>((resolve) => {
      setTimeout(() => {
        let list = [...mockTemplates];
        if (params?.search) {
          list = list.filter(t => t.name.includes(params.search!) || t.description.includes(params.search!));
        }
        if (params?.category) {
          list = list.filter(t => t.category === params.category);
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

  getTemplateById: (id: string) => {
    return new Promise<RecruitmentTemplate>((resolve, reject) => {
      setTimeout(() => {
        const found = mockTemplates.find(t => t.id === id);
        if (found) resolve(found);
        else reject(new Error('模板不存在'));
      }, 200);
    });
  },

  createTemplate: (payload: Omit<RecruitmentTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const id = 't' + (Math.max(0, ...mockTemplates.map(t => Number(String(t.id).replace('t','')))) + 1);
        const now = new Date().toISOString();
        mockTemplates.unshift({ 
          ...payload, 
          id, 
          createdAt: now, 
          updatedAt: now, 
          usageCount: 0 
        });
        saveTemplates(mockTemplates);
        resolve(true);
      }, 200);
    });
  },

  updateTemplate: (id: string, payload: Partial<RecruitmentTemplate>) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const idx = mockTemplates.findIndex(t => t.id === id);
        if (idx >= 0) {
          mockTemplates[idx] = { 
            ...mockTemplates[idx], 
            ...payload, 
            updatedAt: new Date().toISOString() 
          };
          saveTemplates(mockTemplates);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 200);
    });
  },

  deleteTemplate: (id: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const idx = mockTemplates.findIndex(t => t.id === id);
        if (idx >= 0) {
          mockTemplates.splice(idx, 1);
          saveTemplates(mockTemplates);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 200);
    });
  },

  incrementTemplateUsage: (id: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const idx = mockTemplates.findIndex(t => t.id === id);
        if (idx >= 0) {
          mockTemplates[idx].usageCount += 1;
          mockTemplates[idx].updatedAt = new Date().toISOString();
          saveTemplates(mockTemplates);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 200);
    });
  }
};


