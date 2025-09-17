// src/api/manger/enterpriseAudit.ts
export type EnterpriseAuditStatus = '待审核' | '已认证' | '已驳回' | '待定';

export interface EnterpriseBasicInfo {
  id: string;
  companyName: string;
  creditCode: string;       // 统一社会信用代码
  legalPerson: string;      // 法人姓名
  contactPhone: string;
  submitTime: string;       // ISO
  status: EnterpriseAuditStatus;
}

export interface EnterpriseDocs {
  businessLicenseUrl: string;
  legalIdFrontUrl: string;
  legalIdBackUrl: string;
}

export interface EnterpriseOcrInfo {
  companyName?: string;
  creditCode?: string;
  legalPerson?: string;
}

export interface EnterpriseDetail extends EnterpriseBasicInfo {
  docs: EnterpriseDocs;
  filledInfo: {
    companyName: string;
    creditCode: string;
    legalPerson: string;
  };
  ocrInfo: EnterpriseOcrInfo;
}

export interface AuditLogItem {
  id: string;
  enterpriseId: string;
  operator: string;
  action: '提交' | '通过' | '驳回' | '待定';
  reason?: string;
  remark?: string;
  time: string; // ISO
}

const now = () => new Date().toISOString();

let enterprises: EnterpriseDetail[] = [
  {
    id: 'ENT20250917001',
    companyName: '深圳市星河科技有限公司',
    creditCode: '91440300MA5XXXXXX',
    legalPerson: '王小明',
    contactPhone: '13800000001',
    submitTime: now(),
    status: '待审核',
    docs: {
      businessLicenseUrl: 'https://dummyimage.com/1000x700/ede9fe/1f2937&text=%E8%90%A5%E4%B8%9A%E6%89%80',
      legalIdFrontUrl: 'https://dummyimage.com/1000x700/d1fae5/1f2937&text=%E6%B3%95%E4%BA%BA%E8%BA%AB%E4%BB%BD%E8%AF%81-%E6%AD%A3%E9%9D%A2',
      legalIdBackUrl: 'https://dummyimage.com/1000x700/fee2e2/1f2937&text=%E6%B3%95%E4%BA%BA%E8%BA%AB%E4%BB%BD%E8%AF%81-%E5%8F%8D%E9%9D%A2',
    },
    filledInfo: {
      companyName: '深圳市星河科技有限公司',
      creditCode: '91440300MA5XXXXXX',
      legalPerson: '王小明',
    },
    ocrInfo: {
      companyName: '深圳市星河科技有限公司',
      creditCode: '91440300MA5XXXXXX',
      legalPerson: '王小明',
    },
  },
  {
    id: 'ENT20250917002',
    companyName: '杭州云脉信息技术有限公司',
    creditCode: '91330106MA2XXXXXX',
    legalPerson: '李晓',
    contactPhone: '13900000002',
    submitTime: now(),
    status: '待审核',
    docs: {
      businessLicenseUrl: 'https://dummyimage.com/1000x700/fef3c7/1f2937&text=%E8%90%A5%E4%B8%9A%E6%89%80',
      legalIdFrontUrl: 'https://dummyimage.com/1000x700/bae6fd/1f2937&text=%E6%B3%95%E4%BA%BA%E8%BA%AB%E4%BB%BD%E8%AF%81-%E6%AD%A3%E9%9D%A2',
      legalIdBackUrl: 'https://dummyimage.com/1000x700/ede9fe/1f2937&text=%E6%B3%95%E4%BA%BA%E8%BA%AB%E4%BB%BD%E8%AF%81-%E5%8F%8D%E9%9D%A2',
    },
    filledInfo: {
      companyName: '杭州云脉信息技术有限公司',
      creditCode: '91330106MA2XXXXXX',
      legalPerson: '李晓',
    },
    ocrInfo: {
      companyName: '杭州云脉信息技术有限公司',
      creditCode: '91330106MA2XXXXXX',
      legalPerson: '李晓',
    },
  },
];

let logs: AuditLogItem[] = [
  { id: 'L1', enterpriseId: 'ENT20250917001', operator: '管理员A', action: '提交', time: now() },
  { id: 'L2', enterpriseId: 'ENT20250917002', operator: '管理员A', action: '提交', time: now() },
];

const delay = <T,>(data: T, ms = 300) => new Promise<T>(r => setTimeout(() => r(data), ms));

export const enterpriseAuditApi = {
  async list(params: { page?: number; pageSize?: number; keyword?: string; status?: EnterpriseAuditStatus | '' } = {}) {
    const { page = 1, pageSize = 10, keyword = '', status = '' } = params;
    let list = enterprises.slice();
    if (keyword) {
      const k = keyword.trim();
      list = list.filter(x => x.companyName.includes(k) || x.creditCode.includes(k) || x.legalPerson.includes(k));
    }
    if (status) list = list.filter(x => x.status === status);
    const total = list.length;
    const data = list.slice((page - 1) * pageSize, page * pageSize)
      .map(x => ({ ...x } as EnterpriseBasicInfo & { status: EnterpriseAuditStatus }));
    return delay({ data, total, page, pageSize });
  },

  async detail(id: string) {
    const one = enterprises.find(e => e.id === id) || null;
    return delay(one);
  },

  async approve(id: string, operator = '管理员A') {
    const one = enterprises.find(e => e.id === id);
    if (!one) return delay(false);
    one.status = '已认证';
    logs.unshift({
      id: `L${Date.now()}`,
      enterpriseId: id,
      operator,
      action: '通过',
      time: now(),
    });
    // TODO: 在真实后端触发通知
    return delay(true);
  },

  async reject(id: string, reason: string, operator = '管理员A') {
    const one = enterprises.find(e => e.id === id);
    if (!one) return delay(false);
    one.status = '已驳回';
    logs.unshift({
      id: `L${Date.now()}`,
      enterpriseId: id,
      operator,
      action: '驳回',
      reason,
      time: now(),
    });
    return delay(true);
  },

  async pending(id: string, remark: string, operator = '管理员A') {
    const one = enterprises.find(e => e.id === id);
    if (!one) return delay(false);
    one.status = '待定';
    logs.unshift({
      id: `L${Date.now()}`,
      enterpriseId: id,
      operator,
      action: '待定',
      remark,
      time: now(),
    });
    return delay(true);
  },

  async logs(enterpriseId: string) {
    return delay(logs.filter(l => l.enterpriseId === enterpriseId));
  },
};