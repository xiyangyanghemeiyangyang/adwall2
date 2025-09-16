// 支持系统相关的API接口和数据类型定义

export interface SupportTicket {
  id: number;
  title: string;
  description: string;
  category: 'general' | 'technical' | 'account' | 'billing' | 'feature';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  responses: number;
  branchId?: string;
  userId?: string;
}

export interface Branch {
  value: string;
  label: string;
  address: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  category: string;
  priority: string;
  branchId?: string;
}

export interface TicketFilter {
  status?: string;
  category?: string;
  priority?: string;
  search?: string;
  branchId?: string;
}

// 模拟数据
const mockBranches: Branch[] = [
  { value: '1', label: '1', address: ' 1234' },
  { value: '1', label: '2', address: '567' },
  { value: '1', label: '3', address: ' 890' },
  { value: '1', label: '4', address: '2345' }
];

const mockTickets: SupportTicket[] = [
  {
    id: 1,
    title: '数据如何让上传？',
    description: '无法上传数据',
    category: 'technical',
    priority: 'high',
    status: 'open',
    createdAt: '2025-01-25',
    updatedAt: '2025-01-25',
    responses: 2,
    branchId: 'principal'
  },
  {
    id: 2,
    title: '员工如何添加？',
    description: '审核员工账号时出现问题。',
    category: 'general',
    priority: 'medium',
    status: 'in-progress',
    createdAt: '2025-01-24',
    updatedAt: '2025-01-25',
    responses: 1,
    branchId: 'las-condes'
  },
  {
    id: 3,
    title: '如何撤回驳回？',
    description: '撤回驳回时出现问题。',
    category: 'technical',
    priority: 'low',
    status: 'resolved',
    createdAt: '2025-01-23',
    updatedAt: '2025-01-24',
    responses: 3,
    branchId: 'nunoa'
  }
];

// API 函数
export const supportApi = {
  // 获取所有分支机构
  getBranches: async (): Promise<Branch[]> => {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBranches);
      }, 100);
    });
  },

  // 获取支持票据列表
  getTickets: async (filter?: TicketFilter): Promise<SupportTicket[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredTickets = [...mockTickets];
        
        if (filter) {
          if (filter.status && filter.status !== 'all') {
            filteredTickets = filteredTickets.filter(ticket => ticket.status === filter.status);
          }
          
          if (filter.category) {
            filteredTickets = filteredTickets.filter(ticket => ticket.category === filter.category);
          }
          
          if (filter.priority) {
            filteredTickets = filteredTickets.filter(ticket => ticket.priority === filter.priority);
          }
          
          if (filter.search) {
            const searchTerm = filter.search.toLowerCase();
            filteredTickets = filteredTickets.filter(ticket => 
              ticket.title.toLowerCase().includes(searchTerm) ||
              ticket.description.toLowerCase().includes(searchTerm)
            );
          }
          
          if (filter.branchId) {
            filteredTickets = filteredTickets.filter(ticket => ticket.branchId === filter.branchId);
          }
        }
        
        resolve(filteredTickets);
      }, 200);
    });
  },

  // 创建新的支持票据
  createTicket: async (ticketData: CreateTicketRequest): Promise<SupportTicket> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!ticketData.title || !ticketData.description) {
          reject(new Error('标题和描述不能为空'));
          return;
        }

        const newTicket: SupportTicket = {
          id: Date.now(),
          title: ticketData.title,
          description: ticketData.description,
          category: ticketData.category as any,
          priority: ticketData.priority as any,
          status: 'open',
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          responses: 0,
          branchId: ticketData.branchId
        };

        mockTickets.unshift(newTicket);
        resolve(newTicket);
      }, 300);
    });
  },

  // 更新票据状态
  updateTicketStatus: async (ticketId: number, status: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticketIndex = mockTickets.findIndex(ticket => ticket.id === ticketId);
        if (ticketIndex !== -1) {
          mockTickets[ticketIndex].status = status as any;
          mockTickets[ticketIndex].updatedAt = new Date().toISOString().split('T')[0];
          resolve(true);
        } else {
          resolve(false);
        }
      }, 200);
    });
  },

  // 获取票据详情
  getTicketDetail: async (ticketId: number): Promise<SupportTicket | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const ticket = mockTickets.find(t => t.id === ticketId);
        resolve(ticket || null);
      }, 100);
    });
  },

  // 获取票据统计信息
  getTicketStats: async (branchId?: string): Promise<{
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
  }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let tickets = mockTickets;
        if (branchId) {
          tickets = tickets.filter(ticket => ticket.branchId === branchId);
        }

        const stats = {
          total: tickets.length,
          open: tickets.filter(t => t.status === 'open').length,
          inProgress: tickets.filter(t => t.status === 'in-progress').length,
          resolved: tickets.filter(t => t.status === 'resolved').length
        };

        resolve(stats);
      }, 100);
    });
  }
};

// 常量定义
export const TICKET_CATEGORIES = [
  { value: 'general', label: 'Consulta General' },
  { value: 'technical', label: 'Problema Técnico' },
  { value: 'account', label: 'Cuenta y Perfil' },
  { value: 'billing', label: 'Facturación' },
  { value: 'feature', label: 'Solicitud de Función' }
];

export const TICKET_PRIORITIES = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' }
];

export const TICKET_STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'open', label: 'Abiertos' },
  { value: 'in-progress', label: 'En Progreso' },
  { value: 'resolved', label: 'Resueltos' }
];