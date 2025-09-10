// 客户管理相关数据类型定义和模拟数据

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  industry: string;
  region: string; // 推广区域
  contractStatus: '未签约' | '已签约' | '续约中' | '已到期'; // 合同状态
  permissions: string[]; // 推广权限：城市推广/区域推广/单元推广
  status: '正常' | '注销';
  createTime: string;
  lastContactTime: string;
  assignedTo: string;
  tags: string[];
}

export interface FollowUpRecord {
  id: string;
  customerId: string;
  type: '电话' | '邮件' | '会议' | '微信' | '其他';
  content: string;
  result: string;
  nextAction: string;
  createTime: string;
  createBy: string;
}

export interface Task {
  id: string;
  customerId: string;
  title: string;
  description: string;
  type: '联系客户' | '发送报价' | '发送合同' | '跟进回访' | '其他';
  priority: '高' | '中' | '低';
  status: '待处理' | '进行中' | '已完成' | '已取消';
  assignedTo: string;
  dueDate: string;
  createTime: string;
  completeTime?: string;
}

export interface CustomerStats {
  customerId: string;
  loginCount: number;
  purchaseHistory: Array<{
    product: string;
    amount: number;
    date: string;
  }>;
  interactionCount: number;
  lastLoginTime: string;
}

// 模拟客户数据
const STORAGE_KEY = 'crm_customers';

const saveCustomers = (data: Customer[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    // ignore storage errors in mock env
  }
};
//修改了更新新用户小时的问题。
const loadCustomers = (seed: Customer[]): Customer[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Customer[];
      return Array.isArray(parsed) ? parsed : seed;
    }
  } catch (err) {
    // ignore parse errors and fall back to seed
  }
  // initialize storage with seed on first load
  saveCustomers(seed);
  return seed;
};

const defaultMockCustomers: Customer[] = [
  {
    id: '1',
    name: '张三',
    phone: '13800138001',
    email: 'zhangsan@example.com',
    company: '运营部1',
    industry: '互联网',
    region: '北京市',
    contractStatus: '已签约',
    permissions: ['城市推广', '区域推广'],
    status: '正常',
    createTime: '2024-01-15 09:30:00',
    lastContactTime: '2024-01-20 14:20:00',
    assignedTo: '李销售',
    tags: ['VIP', '技术导向']
  },
  {
    id: '2',
    name: '李四',
    phone: '13800138002',
    email: 'lisi@example.com',
    company: '运营部1',
    industry: '贸易',
    region: '上海市',
    contractStatus: '续约中',
    permissions: ['城市推广', '区域推广', '单元推广'],
    status: '正常',
    createTime: '2024-01-10 10:15:00',
    lastContactTime: '2024-01-18 16:45:00',
    assignedTo: '王销售',
    tags: ['大客户', '价格敏感']
  },
  {
    id: '3',
    name: '王五',
    phone: '13800138003',
    email: 'wangwu@example.com',
    company: '运营部2',
    industry: '制造业',
    region: '广州市',
    contractStatus: '未签约',
    permissions: ['城市推广'],
    status: '正常',
    createTime: '2024-01-22 11:00:00',
    lastContactTime: '2024-01-22 11:00:00',
    assignedTo: '赵销售',
    tags: ['潜在客户']
  },
  {
    id: '4',
    name: '赵六',
    phone: '13800138004',
    email: 'zhaoliu@example.com',
    company: '运营部2',
    industry: '金融',
    region: '深圳市',
    contractStatus: '已签约',
    permissions: ['区域推广'],
    status: '正常',
    createTime: '2024-01-12 14:30:00',
    lastContactTime: '2024-01-19 10:15:00',
    assignedTo: '李销售',
    tags: ['金融行业', '决策者']
  },
  {
    id: '5',
    name: '钱七',
    phone: '13800138005',
    email: 'qianqi@example.com',
    company: '运营部3',
    industry: '电商',
    region: '杭州市',
    contractStatus: '已到期',
    permissions: ['城市推广'],
    status: '注销',
    createTime: '2024-01-05 16:20:00',
    lastContactTime: '2024-01-15 09:30:00',
    assignedTo: '王销售',
    tags: ['价格敏感', '竞品对比']
  },
  {
    id: '6',
    name: '孙八',
    phone: '13800138006',
    email: 'sunba@example.com',
    company: '运营部3',
    industry: '教育',
    region: '成都市',
    contractStatus: '已签约',
    permissions: ['城市推广', '单元推广'],
    status: '正常',
    createTime: '2024-01-18 13:45:00',
    lastContactTime: '2024-01-21 15:20:00',
    assignedTo: '赵销售',
    tags: ['教育行业', '预算充足']
  }
];

export const mockCustomers: Customer[] = loadCustomers(defaultMockCustomers);

const STORAGE_FOLLOWUPS = 'crm_followups';
const STORAGE_TASKS = 'crm_tasks';

const saveFollowUps = (data: FollowUpRecord[]) => {
  try { localStorage.setItem(STORAGE_FOLLOWUPS, JSON.stringify(data)); } catch {}
};

const loadFollowUps = (seed: FollowUpRecord[]): FollowUpRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_FOLLOWUPS);
    if (raw) {
      const parsed = JSON.parse(raw) as FollowUpRecord[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  saveFollowUps(seed);
  return seed;
};

// 模拟跟进记录数据（默认种子）
const defaultMockFollowUpRecords: FollowUpRecord[] = [
  {
    id: '1',
    customerId: '1',
    type: '电话',
    content: '客户询问产品价格和功能特性，对技术方案比较感兴趣',
    result: '客户表示会考虑，需要进一步了解详细报价',
    nextAction: '发送详细报价单',
    createTime: '2024-01-20 14:20:00',
    createBy: '李销售'
  },
  {
    id: '2',
    customerId: '1',
    type: '邮件',
    content: '发送了产品介绍PPT和技术白皮书',
    result: '客户已查看邮件，回复表示会仔细研究',
    nextAction: '安排技术演示会议',
    createTime: '2024-01-18 10:30:00',
    createBy: '李销售'
  },
  {
    id: '3',
    customerId: '2',
    type: '会议',
    content: '现场演示产品功能，客户对解决方案很满意',
    result: '客户当场决定购买，要求尽快提供合同',
    nextAction: '准备合同并安排签约',
    createTime: '2024-01-18 16:45:00',
    createBy: '王销售'
  },
  {
    id: '4',
    customerId: '3',
    type: '微信',
    content: '展会现场初次接触，交换了联系方式',
    result: '客户表示有兴趣，希望了解更多信息',
    nextAction: '发送产品资料并安排电话沟通',
    createTime: '2024-01-22 11:00:00',
    createBy: '赵销售'
  }
];

export const mockFollowUpRecords: FollowUpRecord[] = loadFollowUps(defaultMockFollowUpRecords);

const saveTasks = (data: Task[]) => {
  try { localStorage.setItem(STORAGE_TASKS, JSON.stringify(data)); } catch {}
};

const loadTasks = (seed: Task[]): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_TASKS);
    if (raw) {
      const parsed = JSON.parse(raw) as Task[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  saveTasks(seed);
  return seed;
};

// 模拟任务数据（默认种子）
const defaultMockTasks: Task[] = [
  {
    id: '1',
    customerId: '1',
    title: '发送详细报价单',
    description: '根据客户需求准备详细的产品报价单',
    type: '发送报价',
    priority: '高',
    status: '待处理',
    assignedTo: '李销售',
    dueDate: '2024-01-25',
    createTime: '2024-01-20 14:30:00'
  },
  {
    id: '2',
    customerId: '1',
    title: '安排技术演示会议',
    description: '为客户安排产品技术演示会议',
    type: '联系客户',
    priority: '中',
    status: '进行中',
    assignedTo: '李销售',
    dueDate: '2024-01-28',
    createTime: '2024-01-20 15:00:00'
  },
  {
    id: '3',
    customerId: '2',
    title: '准备合同并安排签约',
    description: '准备正式合同并安排客户签约',
    type: '发送合同',
    priority: '高',
    status: '已完成',
    assignedTo: '王销售',
    dueDate: '2024-01-22',
    createTime: '2024-01-18 17:00:00',
    completeTime: '2024-01-21 14:30:00'
  },
  {
    id: '4',
    customerId: '3',
    title: '发送产品资料',
    description: '向新客户发送产品介绍资料',
    type: '联系客户',
    priority: '中',
    status: '待处理',
    assignedTo: '赵销售',
    dueDate: '2024-01-24',
    createTime: '2024-01-22 11:30:00'
  }
];

export const mockTasks: Task[] = loadTasks(defaultMockTasks);

// 模拟客户统计数据
const STORAGE_STATS = 'crm_stats';

const saveStats = (data: CustomerStats[]) => {
  try { localStorage.setItem(STORAGE_STATS, JSON.stringify(data)); } catch {}
};

const loadStats = (seed: CustomerStats[]): CustomerStats[] => {
  try {
    const raw = localStorage.getItem(STORAGE_STATS);
    if (raw) {
      const parsed = JSON.parse(raw) as CustomerStats[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  saveStats(seed);
  return seed;
};

export const mockCustomerStats: CustomerStats[] = loadStats([
  {
    customerId: '1',
    loginCount: 15,
    purchaseHistory: [
      { product: '基础版套餐', amount: 5000, date: '2024-01-15' },
      { product: '升级服务', amount: 2000, date: '2024-01-20' }
    ],
    interactionCount: 8,
    lastLoginTime: '2024-01-20 14:20:00'
  },
  {
    customerId: '2',
    loginCount: 32,
    purchaseHistory: [
      { product: '企业版套餐', amount: 15000, date: '2024-01-18' },
      { product: '定制服务', amount: 8000, date: '2024-01-19' }
    ],
    interactionCount: 12,
    lastLoginTime: '2024-01-19 10:15:00'
  },
  {
    customerId: '3',
    loginCount: 3,
    purchaseHistory: [],
    interactionCount: 2,
    lastLoginTime: '2024-01-22 11:00:00'
  }
]);

// API 模拟函数
export const customerApi = {
  // 获取客户列表
  getCustomers: (params?: { page?: number; pageSize?: number; search?: string; contractStatus?: string; status?: string }) => {
    return new Promise<{ data: Customer[]; total: number }>((resolve) => {
      setTimeout(() => {
        let filteredData = [...mockCustomers];
        
        if (params?.search) {
          filteredData = filteredData.filter(customer => 
            customer.name.includes(params.search!) ||
            customer.company.includes(params.search!) ||
            customer.phone.includes(params.search!) ||
            customer.region.includes(params.search!)
          );
        }
        
        if (params?.contractStatus) {
          filteredData = filteredData.filter(customer => customer.contractStatus === params.contractStatus);
        }
        
        if (params?.status) {
          filteredData = filteredData.filter(customer => customer.status === params.status);
        }

      // 过滤完成后先排序，再做分页
      filteredData.sort((a, b) => a.company.localeCompare(b.company, 'zh-Hans-CN'));

      const total = filteredData.length;
      const page = params?.page || 1;
      const pageSize = params?.pageSize || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      resolve({
        data: filteredData.slice(start, end),
        total
      });

        
        resolve({
          data: filteredData.slice(start, end),
          total
        });
      }, 500);
    });
  },

  // 获取客户详情
  getCustomerById: (id: string) => {
    return new Promise<Customer>((resolve, reject) => {
      setTimeout(() => {
        const customer = mockCustomers.find(c => c.id === id);
        if (customer) {
          resolve(customer);
        } else {
          reject(new Error('客户不存在'));
        }
      }, 300);
    });
  },

  // 获取客户跟进记录
  getFollowUpRecords: (customerId: string) => {
    return new Promise<FollowUpRecord[]>((resolve) => {
      setTimeout(() => {
        const records = mockFollowUpRecords.filter(record => record.customerId === customerId);
        resolve(records);
      }, 300);
    });
  },

  // 新增跟进记录
  addFollowUpRecord: (payload: Omit<FollowUpRecord, 'id' | 'createTime'> & Partial<Pick<FollowUpRecord, 'id' | 'createTime'>>) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const newId = String(Math.max(0, ...mockFollowUpRecords.map(r => Number(r.id))) + 1);
        const now = new Date().toISOString();
        const record: FollowUpRecord = {
          id: payload.id || newId,
          createTime: payload.createTime || now,
          ...payload,
        } as FollowUpRecord;
        mockFollowUpRecords.unshift(record);
        saveFollowUps(mockFollowUpRecords);
        resolve(true);
      }, 300);
    });
  },

  // 新增客户
  addCustomer: (payload: Omit<Customer, 'id' | 'createTime' | 'lastContactTime'> & Partial<Pick<Customer, 'createTime' | 'lastContactTime'>>) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const newId = String(Math.max(0, ...mockCustomers.map(c => Number(c.id))) + 1);
        const now = new Date().toISOString();
        const customer: Customer = {
          id: newId,
          createTime: payload.createTime || now,
          lastContactTime: payload.lastContactTime || payload.createTime || now,
          ...payload,
          permissions: Array.isArray((payload as any).permissions) ? (payload as any).permissions : [],
          tags: Array.isArray((payload as any).tags) ? (payload as any).tags : [],
        } as Customer;
        mockCustomers.unshift(customer);
        saveCustomers(mockCustomers);
        resolve(true);
      }, 300);
    });
  },

  // （移除快速添加随机客户的接口）

  // 更新客户
  updateCustomer: (id: string, payload: Partial<Customer>) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const index = mockCustomers.findIndex(c => c.id === id);
        if (index !== -1) {
          mockCustomers[index] = { ...mockCustomers[index], ...payload } as Customer;
          saveCustomers(mockCustomers);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  },

  // 获取客户任务
  getTasks: (customerId: string) => {
    return new Promise<Task[]>((resolve) => {
      setTimeout(() => {
        const tasks = mockTasks.filter(task => task.customerId === customerId);
        resolve(tasks);
      }, 300);
    });
  },

  // 新增任务
  addTask: (payload: Omit<Task, 'id' | 'createTime'> & Partial<Pick<Task, 'id' | 'createTime'>>) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const newId = String(Math.max(0, ...mockTasks.map(t => Number(t.id))) + 1);
        const now = new Date().toISOString();
        const task: Task = {
          id: payload.id || newId,
          createTime: payload.createTime || now,
          ...payload,
        } as Task;
        mockTasks.unshift(task);
        saveTasks(mockTasks);
        resolve(true);
      }, 300);
    });
  },

  // 获取客户统计
  getCustomerStats: (customerId: string) => {
    return new Promise<CustomerStats>((resolve) => {
      setTimeout(() => {
        const stats = mockCustomerStats.find(stat => stat.customerId === customerId);
        if (stats) {
          resolve(stats);
        } else {
          // 若不存在，为该客户初始化一个空的统计数据
          const newStats: CustomerStats = {
            customerId,
            loginCount: 0,
            purchaseHistory: [],
            interactionCount: 0,
            lastLoginTime: new Date().toISOString()
          };
          mockCustomerStats.push(newStats);
          saveStats(mockCustomerStats);
          resolve(newStats);
        }
      }, 300);
    });
  },

  // 添加购买记录
  addPurchase: (customerId: string, purchase: { product: string; amount: number; date: string }) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const stats = mockCustomerStats.find(stat => stat.customerId === customerId);
        if (!stats) {
          resolve(false);
          return;
        }
        stats.purchaseHistory.unshift(purchase);
        saveStats(mockCustomerStats);
        resolve(true);
      }, 300);
    });
  },

  // 更新客户状态
  updateCustomerStatus: (id: string, status: Customer['status']) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const customer = mockCustomers.find(c => c.id === id);
        if (customer) {
          customer.status = status;
          saveCustomers(mockCustomers);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  },

  // 更新客户合同状态
  updateContractStatus: (id: string, contractStatus: Customer['contractStatus']) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const customer = mockCustomers.find(c => c.id === id);
        if (customer) {
          customer.contractStatus = contractStatus;
          saveCustomers(mockCustomers);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  },

  // 更新客户权限
  updatePermissions: (id: string, permissions: string[]) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const customer = mockCustomers.find(c => c.id === id);
        if (customer) {
          customer.permissions = permissions;
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }
};
