// src/api/operator/operatorAudit.ts
export type AuditStatus = '待审核' | '已通过' | '已拒绝';

export interface OperatorApplicant {
  id: string;
  name: string;            // 应用/用户名称
  phone: string;           // 微信App ID
     // Universal Link
  submitTime: string;      // ISO 时间
  category: string;        // 分类
  desc: string;            // 简述
  status: AuditStatus;
  role?: '员工' | '管理员' | '访客'; // 审核通过后赋默认“员工”
}

let applicants: OperatorApplicant[] = [
  {
    id: 'OA20250001',
    name: '张三',
    phone: '123456789',
    
    submitTime: '2025-01-15T14:30:00Z',
    category: '运营部1',
    desc: '个人介绍',
    status: '待审核',
  },
  {
    id: 'OA20250002',
    name: '李四',
    phone: '123456789',
    
    submitTime: '2025-01-14T09:15:00Z',
    category: '运营部2',
    desc: '个人价绍',
    status: '已通过',
    role: '员工',
  },
  {
    id: 'OA20250003',
    name: '小明',
    phone: '123456789',
    
    submitTime: '2025-01-10T11:00:00Z',
    category: '运营部3',
    desc: '个人介绍',
    status: '已拒绝',
  },
];

const delay = <T,>(data: T, ms = 300) => new Promise<T>(r => setTimeout(() => r(data), ms));

export const operatorAuditApi = {
  async list(params: { page?: number; pageSize?: number; keyword?: string; status?: AuditStatus | '' } = {}) {
    const { page = 1, pageSize = 10, keyword = '', status = '' } = params;
    let list = applicants.slice();
    if (keyword) {
      const k = keyword.trim();
      list = list.filter(x => x.name.includes(k) || x.phone.includes(k));
    }
    if (status) list = list.filter(x => x.status === status);
    const total = list.length;
    const data = list.slice((page - 1) * pageSize, page * pageSize);
    return delay({ data, total, page, pageSize });
  },

  async approve(id: string) {
    const one = applicants.find(a => a.id === id);
    if (!one) return delay(false);
    one.status = '已通过';
    one.role = '员工'; // 默认角色
    return delay(true);
  },

  async reject(id: string, _reason?: string) {
    const one = applicants.find(a => a.id === id);
    if (!one) return delay(false);
    one.status = '已拒绝';
    // 可在真实接口中记录 reason
    return delay(true);
  },
};