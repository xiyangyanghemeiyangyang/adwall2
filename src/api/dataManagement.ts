// 数据管理相关数据类型定义和模拟数据

export interface DataRecord {
  id: string;
  customerName: string;
  customerId: string;
  region: string;
  city: string;
  clickCount: number; // 点击量
  conversionRate: number; // 转化率
  cost: number; // 广告花费
  revenue: number; // 收入
  impressions: number; // 展示量
  ctr: number; // 点击率
  cpc: number; // 每次点击成本
  cpm: number; // 每千次展示成本
  date: string;
  status: '正常' | '暂停' | '异常';
  campaignType: '搜索推广' | '信息流推广' | '品牌推广' | '其他';
}

export interface RegionData {
  region: string;
  totalClicks: number;
  totalCost: number;
  totalRevenue: number;
  totalImpressions: number;
  avgConversionRate: number;
  customerCount: number;
}

export interface TimeSeriesData {
  date: string;
  clicks: number;
  cost: number;
  revenue: number;
  impressions: number;
  conversionRate: number;
}

export interface CustomerDataDetail {
  customerId: string;
  customerName: string;
  region: string;
  totalClicks: number;
  totalCost: number;
  totalRevenue: number;
  totalImpressions: number;
  avgConversionRate: number;
  timeSeriesData: TimeSeriesData[];
  regionData: RegionData[];
  campaignData: Array<{
    campaignType: string;
    clicks: number;
    cost: number;
    revenue: number;
  }>;
  cityData: Array<{
    city: string;
    region: string;
    totalClicks: number;
    totalCost: number;
    totalRevenue: number;
    avgConversionRate: number;
  }>;
}

export interface CustomerSummary {
  customerId: string;
  customerName: string;
  totalClicks: number;
  totalCost: number;
  totalRevenue: number;
  totalImpressions: number;
  avgConversionRate: number;
  totalCampaigns: number;
  totalRegions: number;
  totalCities: number;
  status: '正常' | '暂停' | '异常';
  lastActiveDate: string;
  detailRecords: DataRecord[];
}

// 模拟数据存储
const STORAGE_KEY = 'data_management_records';

const saveData = (data: DataRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    // ignore storage errors in mock env
  }
};

const loadData = (seed: DataRecord[]): DataRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DataRecord[];
      return Array.isArray(parsed) ? parsed : seed;
    }
  } catch (err) {
    // ignore parse errors and fall back to seed
  }
  // initialize storage with seed on first load
  saveData(seed);
  return seed;
};

// 生成模拟数据
const generateMockData = (): DataRecord[] => {
  const customers = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];
  const regions = ['华北', '华东', '华南', '华中', '西南', '西北', '东北'];
  const cities = {
    '华北': ['北京', '天津', '石家庄', '太原'],
    '华东': ['上海', '南京', '杭州', '合肥', '福州'],
    '华南': ['广州', '深圳', '南宁', '海口'],
    '华中': ['武汉', '长沙', '郑州', '南昌'],
    '西南': ['成都', '重庆', '昆明', '贵阳'],
    '西北': ['西安', '兰州', '银川', '西宁'],
    '东北': ['沈阳', '大连', '长春', '哈尔滨']
  };
  const campaignTypes: DataRecord['campaignType'][] = ['搜索推广', '信息流推广', '品牌推广', '其他'];
  const statuses: DataRecord['status'][] = ['正常', '暂停', '异常'];

  const data: DataRecord[] = [];
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-01-31');

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    
    customers.forEach((customer, customerIndex) => {
      regions.forEach((region) => {
        const regionCities = cities[region as keyof typeof cities];
        regionCities.forEach((city) => {
          // 每个客户每天每个城市生成1-3条记录
          const recordCount = Math.floor(Math.random() * 3) + 1;
          
          for (let i = 0; i < recordCount; i++) {
            const impressions = Math.floor(Math.random() * 10000) + 1000;
            const clicks = Math.floor(impressions * (Math.random() * 0.05 + 0.01)); // 1-6% CTR
            const conversions = Math.floor(clicks * (Math.random() * 0.1 + 0.02)); // 2-12% 转化率
            const cost = Math.floor(clicks * (Math.random() * 2 + 0.5)); // 0.5-2.5元每次点击
            const revenue = Math.floor(conversions * (Math.random() * 50 + 10)); // 10-60元每次转化

            data.push({
              id: `${customerIndex}-${region}-${city}-${dateStr}-${i}`,
              customerName: customer,
              customerId: String(customerIndex + 1),
              region,
              city,
              clickCount: clicks,
              conversionRate: conversions / clicks * 100,
              cost,
              revenue,
              impressions,
              ctr: clicks / impressions * 100,
              cpc: cost / clicks,
              cpm: cost / impressions * 1000,
              date: dateStr,
              status: statuses[Math.floor(Math.random() * statuses.length)],
              campaignType: campaignTypes[Math.floor(Math.random() * campaignTypes.length)]
            });
          }
        });
      });
    });
  }

  return data;
};

export const mockDataRecords: DataRecord[] = loadData(generateMockData());

// API 模拟函数
export const dataManagementApi = {
  // 获取数据列表
  getDataRecords: (params?: { 
    page?: number; 
    pageSize?: number; 
    search?: string; 
    region?: string; 
    city?: string;
    status?: string;
    campaignType?: string;
    dateRange?: [string, string];
  }) => {
    return new Promise<{ data: DataRecord[]; total: number }>((resolve) => {
      setTimeout(() => {
        let filteredData = [...mockDataRecords];
        
        if (params?.search) {
          filteredData = filteredData.filter(record => 
            record.customerName.includes(params.search!) ||
            record.region.includes(params.search!) ||
            record.city.includes(params.search!)
          );
        }
        
        if (params?.region) {
          filteredData = filteredData.filter(record => record.region === params.region);
        }
        
        if (params?.city) {
          filteredData = filteredData.filter(record => record.city === params.city);
        }
        
        if (params?.status) {
          filteredData = filteredData.filter(record => record.status === params.status);
        }
        
        if (params?.campaignType) {
          filteredData = filteredData.filter(record => record.campaignType === params.campaignType);
        }
        
        if (params?.dateRange && params.dateRange.length === 2) {
          filteredData = filteredData.filter(record => 
            record.date >= params.dateRange![0] && record.date <= params.dateRange![1]
          );
        }
        
        const total = filteredData.length;
        const page = params?.page || 1;
        const pageSize = params?.pageSize || 10;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        
        resolve({
          data: filteredData.slice(start, end),
          total
        });
      }, 500);
    });
  },

  // 获取客户数据详情
  getCustomerDataDetail: (customerId: string) => {
    return new Promise<CustomerDataDetail>((resolve) => {
      setTimeout(() => {
        const customerRecords = mockDataRecords.filter(record => record.customerId === customerId);
        
        if (customerRecords.length === 0) {
          resolve({
            customerId,
            customerName: '未知客户',
            region: '',
            totalClicks: 0,
            totalCost: 0,
            totalRevenue: 0,
            totalImpressions: 0,
            avgConversionRate: 0,
            timeSeriesData: [],
            regionData: [],
            campaignData: [],
            cityData: []
          });
          return;
        }

        const customerName = customerRecords[0].customerName;
        const region = customerRecords[0].region;
        
        // 计算总计数据
        const totalClicks = customerRecords.reduce((sum, record) => sum + record.clickCount, 0);
        const totalCost = customerRecords.reduce((sum, record) => sum + record.cost, 0);
        const totalRevenue = customerRecords.reduce((sum, record) => sum + record.revenue, 0);
        const totalImpressions = customerRecords.reduce((sum, record) => sum + record.impressions, 0);
        const avgConversionRate = totalClicks > 0 ? 
          customerRecords.reduce((sum, record) => sum + record.conversionRate, 0) / customerRecords.length : 0;

        // 生成时间序列数据
        const dateMap = new Map<string, TimeSeriesData>();
        customerRecords.forEach(record => {
          const existing = dateMap.get(record.date);
          if (existing) {
            existing.clicks += record.clickCount;
            existing.cost += record.cost;
            existing.revenue += record.revenue;
            existing.impressions += record.impressions;
            existing.conversionRate = existing.clicks > 0 ? (existing.revenue / existing.clicks * 100) : 0;
          } else {
            dateMap.set(record.date, {
              date: record.date,
              clicks: record.clickCount,
              cost: record.cost,
              revenue: record.revenue,
              impressions: record.impressions,
              conversionRate: record.conversionRate
            });
          }
        });
        
        const timeSeriesData = Array.from(dateMap.values()).sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // 生成区域数据
        const regionMap = new Map<string, RegionData>();
        customerRecords.forEach(record => {
          const existing = regionMap.get(record.region);
          if (existing) {
            existing.totalClicks += record.clickCount;
            existing.totalCost += record.cost;
            existing.totalRevenue += record.revenue;
            existing.totalImpressions += record.impressions;
            existing.customerCount = 1; // 简化处理
          } else {
            regionMap.set(record.region, {
              region: record.region,
              totalClicks: record.clickCount,
              totalCost: record.cost,
              totalRevenue: record.revenue,
              totalImpressions: record.impressions,
              avgConversionRate: record.conversionRate,
              customerCount: 1
            });
          }
        });
        
        const regionData = Array.from(regionMap.values());

        // 生成推广类型数据
        const campaignMap = new Map<string, { campaignType: string; clicks: number; cost: number; revenue: number }>();
        customerRecords.forEach(record => {
          const existing = campaignMap.get(record.campaignType);
          if (existing) {
            existing.clicks += record.clickCount;
            existing.cost += record.cost;
            existing.revenue += record.revenue;
          } else {
            campaignMap.set(record.campaignType, {
              campaignType: record.campaignType,
              clicks: record.clickCount,
              cost: record.cost,
              revenue: record.revenue
            });
          }
        });
        
        const campaignData = Array.from(campaignMap.values());

        // 生成城市数据
        const cityMap = new Map<string, { city: string; region: string; totalClicks: number; totalCost: number; totalRevenue: number; avgConversionRate: number }>();
        customerRecords.forEach(record => {
          const key = `${record.region}-${record.city}`;
          const existing = cityMap.get(key);
          if (existing) {
            existing.totalClicks += record.clickCount;
            existing.totalCost += record.cost;
            existing.totalRevenue += record.revenue;
            existing.avgConversionRate = existing.totalClicks > 0 ? (existing.totalRevenue / existing.totalClicks * 100) : 0;
          } else {
            cityMap.set(key, {
              city: record.city,
              region: record.region,
              totalClicks: record.clickCount,
              totalCost: record.cost,
              totalRevenue: record.revenue,
              avgConversionRate: record.conversionRate
            });
          }
        });
        
        const cityData = Array.from(cityMap.values());

        resolve({
          customerId,
          customerName,
          region,
          totalClicks,
          totalCost,
          totalRevenue,
          totalImpressions,
          avgConversionRate,
          timeSeriesData,
          regionData,
          campaignData,
          cityData
        });
      }, 500);
    });
  },

  // 获取所有区域数据汇总
  getAllRegionData: () => {
    return new Promise<RegionData[]>((resolve) => {
      setTimeout(() => {
        const regionMap = new Map<string, RegionData>();
        
        mockDataRecords.forEach(record => {
          const existing = regionMap.get(record.region);
          if (existing) {
            existing.totalClicks += record.clickCount;
            existing.totalCost += record.cost;
            existing.totalRevenue += record.revenue;
            existing.totalImpressions += record.impressions;
            existing.customerCount++;
          } else {
            regionMap.set(record.region, {
              region: record.region,
              totalClicks: record.clickCount,
              totalCost: record.cost,
              totalRevenue: record.revenue,
              totalImpressions: record.impressions,
              avgConversionRate: record.conversionRate,
              customerCount: 1
            });
          }
        });
        
        const regionData = Array.from(regionMap.values()).map(region => ({
          ...region,
          avgConversionRate: region.totalClicks > 0 ? 
            (region.totalRevenue / region.totalClicks * 100) : 0
        }));
        
        resolve(regionData);
      }, 300);
    });
  },

  // 获取统计数据
  getStatistics: () => {
    return new Promise<{
      totalClicks: number;
      totalCost: number;
      totalRevenue: number;
      totalImpressions: number;
      avgConversionRate: number;
      totalCustomers: number;
      totalRegions: number;
    }>((resolve) => {
      setTimeout(() => {
        const totalClicks = mockDataRecords.reduce((sum, record) => sum + record.clickCount, 0);
        const totalCost = mockDataRecords.reduce((sum, record) => sum + record.cost, 0);
        const totalRevenue = mockDataRecords.reduce((sum, record) => sum + record.revenue, 0);
        const totalImpressions = mockDataRecords.reduce((sum, record) => sum + record.impressions, 0);
        const avgConversionRate = totalClicks > 0 ? 
          mockDataRecords.reduce((sum, record) => sum + record.conversionRate, 0) / mockDataRecords.length : 0;
        
        const uniqueCustomers = new Set(mockDataRecords.map(record => record.customerId));
        const uniqueRegions = new Set(mockDataRecords.map(record => record.region));
        
        resolve({
          totalClicks,
          totalCost,
          totalRevenue,
          totalImpressions,
          avgConversionRate,
          totalCustomers: uniqueCustomers.size,
          totalRegions: uniqueRegions.size
        });
      }, 300);
    });
  },

  // 获取客户汇总数据列表
  getCustomerSummaries: (params?: { 
    page?: number; 
    pageSize?: number; 
    search?: string; 
    region?: string; 
    city?: string;
    status?: string;
    campaignType?: string;
    dateRange?: [string, string];
  }) => {
    return new Promise<{ data: CustomerSummary[]; total: number }>((resolve) => {
      setTimeout(() => {
        let filteredData = [...mockDataRecords];
        
        // 应用筛选条件
        if (params?.search) {
          filteredData = filteredData.filter(record => 
            record.customerName.includes(params.search!) ||
            record.region.includes(params.search!) ||
            record.city.includes(params.search!)
          );
        }
        
        if (params?.region) {
          filteredData = filteredData.filter(record => record.region === params.region);
        }
        
        if (params?.city) {
          filteredData = filteredData.filter(record => record.city === params.city);
        }
        
        if (params?.status) {
          filteredData = filteredData.filter(record => record.status === params.status);
        }
        
        if (params?.campaignType) {
          filteredData = filteredData.filter(record => record.campaignType === params.campaignType);
        }
        
        if (params?.dateRange && params.dateRange.length === 2) {
          filteredData = filteredData.filter(record => 
            record.date >= params.dateRange![0] && record.date <= params.dateRange![1]
          );
        }
        
        // 按客户ID分组并汇总数据
        const customerMap = new Map<string, CustomerSummary>();
        
        filteredData.forEach(record => {
          const existing = customerMap.get(record.customerId);
          if (existing) {
            existing.totalClicks += record.clickCount;
            existing.totalCost += record.cost;
            existing.totalRevenue += record.revenue;
            existing.totalImpressions += record.impressions;
            existing.detailRecords.push(record);
            
            // 更新最后活跃日期
            if (new Date(record.date) > new Date(existing.lastActiveDate)) {
              existing.lastActiveDate = record.date;
            }
          } else {
            const uniqueRegions = new Set<string>();
            const uniqueCities = new Set<string>();
            const uniqueCampaigns = new Set<string>();
            
            filteredData
              .filter(r => r.customerId === record.customerId)
              .forEach(r => {
                uniqueRegions.add(r.region);
                uniqueCities.add(r.city);
                uniqueCampaigns.add(r.campaignType);
              });
            
            customerMap.set(record.customerId, {
              customerId: record.customerId,
              customerName: record.customerName,
              totalClicks: record.clickCount,
              totalCost: record.cost,
              totalRevenue: record.revenue,
              totalImpressions: record.impressions,
              avgConversionRate: record.conversionRate,
              totalCampaigns: uniqueCampaigns.size,
              totalRegions: uniqueRegions.size,
              totalCities: uniqueCities.size,
              status: record.status,
              lastActiveDate: record.date,
              detailRecords: [record]
            });
          }
        });
        
        // 计算平均转化率
        customerMap.forEach(customer => {
          customer.avgConversionRate = customer.totalClicks > 0 ? 
            (customer.totalRevenue / customer.totalClicks * 100) : 0;
        });
        
        const customerSummaries = Array.from(customerMap.values());
        
        const total = customerSummaries.length;
        const page = params?.page || 1;
        const pageSize = params?.pageSize || 10;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        
        resolve({
          data: customerSummaries.slice(start, end),
          total
        });
      }, 500);
    });
  }
};
