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

const STORAGE_KEY = 'cm_contents';

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

export const mockContents: ContentItem[] = load(seed);

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
};


