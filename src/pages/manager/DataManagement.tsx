import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Typography, 
  Row, 
  Col,
  Statistic,
  message,
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined, 
  BarChartOutlined,
  DollarOutlined,
  AimOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { dataManagementApi, type CustomerSummary } from '../../api/manger/dataManagement';
import { customerApi, type Customer } from '../../api/manger/customerData';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
 

const DataManagement = () => {
  const navigate = useNavigate();
  const [customerSummaries, setCustomerSummaries] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(false);
  // 初始分页
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [regionFilter, setRegionFilter] = useState<string | undefined>(undefined);
  const [cityFilter, setCityFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [campaignTypeFilter, setCampaignTypeFilter] = useState<string | undefined>(undefined);
  const [dateRange] = useState<[string, string] | null>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [statistics, setStatistics] = useState({
    totalClicks: 0,
    totalCost: 0,
    totalRevenue: 0,
    totalImpressions: 0,
    avgConversionRate: 0,
    totalCustomers: 0,
    totalRegions: 0
  });
  // 从员工管理关联的部门映射
  const [companyById, setCompanyById] = useState<Record<string, string>>({});
  const [companyByName, setCompanyByName] = useState<Record<string, string>>({});
  type CompanyMaps = { byId: Record<string, string>; byName: Record<string, string> };
  // 部门稳定配色（同部门固定同一颜色）
  const tagColors = ['#1677ff', '#ff4d4f', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2', '#2f54eb', '#eb2f96'];
  const bgColors  = ['#E6F4FF', '#FFF1F0', '#F6FFED', '#FFF7E6', '#F9F0FF', '#E6FFFB', '#F0F5FF', '#FFF0F6'];
  const companyColorIndex = (name: string) => {
    const key = name || '未知部门';
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h << 5) - h + key.charCodeAt(i);
    return Math.abs(h) % tagColors.length;
  };
  const getTagColor = (name: string) => tagColors[companyColorIndex(name)];
  const getBgColor  = (name: string) => bgColors[companyColorIndex(name)];

  // 获取客户汇总数据列表
  const fetchCustomerSummaries = async (
    page = 1,
    pageSize = 5, // 当前显示数量
    search = '',
    region = '',
    city = '',
    status = '',
    campaignType = '',
    dateRange?: [string, string],
    companyMapsOverride?: CompanyMaps
  ) => {
    setLoading(true);
    try {
      const result = await dataManagementApi.getCustomerSummaries({
        page,
        pageSize,
        search,
        region,
        city,
        status,
        campaignType,
        dateRange
      });
      const maps = companyMapsOverride || { byId: companyById, byName: companyByName };
      const enhanced = result.data.map((item) => ({
        ...item,
        company: item.company || maps.byId[item.customerId] || maps.byName[item.customerName] || '未知部门'
      }));
      setCustomerSummaries(
        enhanced.sort((a, b) => (a.company || '').localeCompare(b.company || '', 'zh-Hans-CN'))
      );
      setPagination(prev => ({
        ...prev,
        current: page,
        pageSize: pageSize,
        total: result.total
      }));
    } catch (error) {
      message.error('获取客户数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取统计数据
  const fetchStatistics = async () => {
    try {
      const stats = await dataManagementApi.getStatistics();
      setStatistics(stats);
    } catch (error) {
      message.error('获取统计数据失败');
    }
  };
  // 获取员工列表用于部门映射（只取较小页数多次或一次足量）
  const fetchEmployeesForCompanyMap = async (): Promise<CompanyMaps> => {
    try {
      const res = await customerApi.getCustomers({ page: 1, pageSize: 1000, search: '', contractStatus: '', status: '' });
      const byId: Record<string, string> = {};
      const byName: Record<string, string> = {};
      (res.data as Customer[]).forEach((c) => {
        if (c.id) byId[c.id] = c.company;
        if (c.name) byName[c.name] = c.company;
      });
      setCompanyById(byId);
      setCompanyByName(byName);
      return { byId, byName };
    } catch {
      return { byId: {}, byName: {} };
    }
  };
// 放在 useState 下面、useEffect 之前
useEffect(() => {
  const saved = JSON.parse(localStorage.getItem('dm_state') || '{}');
  setPagination(prev => ({
    ...prev,
    current: saved.current || 1,
    pageSize: saved.pageSize || prev.pageSize
  }));
  setSearchText(saved.searchText || '');
  setRegionFilter(saved.regionFilter ?? undefined);
  setCityFilter(saved.cityFilter || '');
  setStatusFilter(saved.statusFilter ?? undefined);
  setCampaignTypeFilter(saved.campaignTypeFilter ?? undefined);

  // 先获取员工部门映射，再获取数据列表，保证能填补部门
  fetchEmployeesForCompanyMap().then((maps) => {
  fetchCustomerSummaries(
    saved.current || 1,
    saved.pageSize || pagination.pageSize,
    saved.searchText || '',
    saved.regionFilter || '',
    saved.cityFilter || '',
    saved.statusFilter || '',
    saved.campaignTypeFilter || '',
    undefined,
    maps
  );
  });
  fetchStatistics();


  // 放在 useEffect 里
  
  
  // 建立 WebSocket 订阅实时统计
  let ws: WebSocket | null = null;
  try {
    ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg.type === 'result' && msg.data) {
          setStatistics((prev) => ({
            ...prev,
            ...msg.data
          }));
        }
      } catch {}
    };
  } catch {}
  return () => {
    try { if (ws) ws.close(); } catch {}
  };
}, []);

  // 处理搜索
  const handleSearch = (value: string) => {
    const next = {
      current: 1,
      pageSize: pagination.pageSize,
      searchText: value,
      regionFilter,
      cityFilter,
      statusFilter,
      campaignTypeFilter
    };
    localStorage.setItem('dm_state', JSON.stringify(next));
    setSearchText(value);
    fetchCustomerSummaries(1, pagination.pageSize, value, regionFilter || '', cityFilter, statusFilter || '', campaignTypeFilter || '', dateRange || undefined);
  };

  // 处理筛选
  const handleFilterChange = (type: string, value: string | undefined) => {
    switch (type) {
      case 'region':
        setRegionFilter(value);
        fetchCustomerSummaries(1, pagination.pageSize, searchText, value || '', cityFilter, statusFilter || '', campaignTypeFilter || '', dateRange || undefined);
        break;
      case 'city':
        setCityFilter(value || '');
        fetchCustomerSummaries(1, pagination.pageSize, searchText, regionFilter || '', value || '', statusFilter || '', campaignTypeFilter || '', dateRange || undefined);
        break;
      case 'campaignType':
        setCampaignTypeFilter(value);
        fetchCustomerSummaries(
          1, pagination.pageSize, searchText, regionFilter || '', cityFilter || '', statusFilter || '',
          value || '', dateRange || undefined
        );
        break;
      case 'status':
        setStatusFilter(value);
        fetchCustomerSummaries(
          1, pagination.pageSize, searchText, regionFilter || '', cityFilter || '', value || '',
          campaignTypeFilter || '', dateRange || undefined
        );
        break;
    }
  };

  
  // 处理表格分页
  const handleTableChange = (pagination: any) => {
    const { current, pageSize } = pagination;
    const next = {
      current,
      pageSize,
      searchText,
      regionFilter,
      cityFilter,
      statusFilter,
      campaignTypeFilter
    };
    localStorage.setItem('dm_state', JSON.stringify(next));
    setPagination(prev => ({ ...prev, current, pageSize }));
    fetchCustomerSummaries(pagination.current, pagination.pageSize, searchText, regionFilter || '', cityFilter, statusFilter || '', campaignTypeFilter || '', dateRange || undefined);
  };

  

  // 查看数据详情
  const handleViewDetail = (customerId: string) => {
    navigate(`/page/manger/data-management/${customerId}`);
  };

  // 按部门分组合并行（与员工管理列表一致）
  const companySpan = (() => {
    const map: Record<string, { firstIndex: number; count: number }> = {};
    customerSummaries.forEach((c, idx) => {
      const key = c.company || '未知部门';
      if (!map[key]) map[key] = { firstIndex: idx, count: 0 };
      map[key].count += 1;
    });
    return map;
  })();

  // 主表格列定义
  const columns: ColumnsType<CustomerSummary> = [
    {
      title: '部门',
      dataIndex: 'company',
      key: 'company',
      render: (_, record) => {
        const name = record.company || '未知部门';
        if (name.startsWith('运营部')) {
          return (
            <Tag color="default" style={{ background: 'transparent', borderColor: 'transparent', color: '#595959' }}>
              {name}
            </Tag>
          );
        }
        return <Tag color={getTagColor(name)}>{name}</Tag>;
      },
      onCell: (record, index) => {
        const info = companySpan[record.company || '未知部门'];
        if (!info) return {};
        if (index === info.firstIndex) return { rowSpan: info.count };
        return { rowSpan: 0 };
      },
    },
    {
      title: '客户信息',
      key: 'customer',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{record.customerName}</div>
        </div>
      ),
    },
    {
      title: '推广覆盖',
      key: 'coverage',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: '4px' }}>
            <EnvironmentOutlined style={{ marginRight: '4px', color: '#1677ff' }} />
            <span style={{ fontWeight: 'bold' }}>{record.totalRegions}</span>
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>区域</span>
          </div>
          <div>
            <EnvironmentOutlined style={{ marginRight: '4px', color: '#52c41a' }} />
            <span style={{ fontWeight: 'bold' }}>{record.totalCities}</span>
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>城市</span>
          </div>
        </div>
      ),
    },
    {
      title: '推广数据',
      key: 'metrics',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: '4px' }}>
            <AimOutlined style={{ marginRight: '4px', color: '#1677ff' }} />
            <span style={{ fontWeight: 'bold' }}>{record.totalClicks.toLocaleString()}</span>
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>点击</span>
          </div>
          <div>
            <DollarOutlined style={{ marginRight: '4px', color: '#faad14' }} />
            <span style={{ fontWeight: 'bold' }}>¥{record.totalCost.toLocaleString()}</span>
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>花费</span>
          </div>
        </div>
      ),
    },
    {
      title: '转化率',
      dataIndex: 'avgConversionRate',
      key: 'avgConversionRate',
      render: (rate: number) => (
        <Tag color={rate > 5 ? 'green' : rate > 2 ? 'orange' : 'red'}>
          {rate.toFixed(2)}%
        </Tag>
      ),
      sorter: (a, b) => a.avgConversionRate - b.avgConversionRate,
    },
    {
      title: '收入',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (revenue: number) => (
        <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
          ¥{revenue.toLocaleString()}
        </span>
      ),
      sorter: (a, b) => a.totalRevenue - b.totalRevenue,
    },
    {
      title: '推广数',
      dataIndex: 'totalCampaigns',
      key: 'totalCampaigns',
      render: (count: number) => (
        <Tag color="blue">{count} 个</Tag>
      ),
      sorter: (a, b) => a.totalCampaigns - b.totalCampaigns,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: CustomerSummary['status']) => {
        const colorMap: Record<string, string> = {
          '正常': 'green',
          '暂停': 'orange',
          '异常': 'red',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: '最后活跃',
      dataIndex: 'lastActiveDate',
      key: 'lastActiveDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.lastActiveDate).getTime() - new Date(b.lastActiveDate).getTime(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Tooltip title="查看数据详情">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetail(record.customerId)}
            >
              详情
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  

  return (
    <div className="data-management">
      <div style={{ marginBottom: '24px' }}>
        <Title level={4}>数据管理</Title>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总点击量"
              value={statistics.totalClicks}
              prefix={<AimOutlined />}
              valueStyle={{ color: '#1677ff' }}
              formatter={(value) => value?.toLocaleString()}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总花费"
              value={statistics.totalCost}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#faad14' }}
              formatter={(value) => `¥${value?.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总收入"
              value={statistics.totalRevenue}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
              formatter={(value) => `¥${value?.toLocaleString()}`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="平均转化率"
              value={statistics.avgConversionRate}
              suffix="%"
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#722ed1' }}
              precision={2}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索和筛选 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="搜索客户名称、区域、城市"
              allowClear
              enterButton={
                <Button
                  type="text"
                  onMouseDown={() => setSearchActive(true)}
                  onMouseUp={() => setSearchActive(false)}
                  onMouseLeave={() => setSearchActive(false)}
                  icon={<SearchOutlined style={{ color: searchActive ? '#1677ff' : '#69b1ff' }} />}
                />
              }
              size="middle"
              onSearch={handleSearch}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="选择区域"
              allowClear
              style={{ width: '100%' }}
              value={regionFilter}
              onChange={(value) => handleFilterChange('region', value as string | undefined)}
              onClear={() => handleFilterChange('region', undefined as unknown as string)}
            >
              <Option value="华北">华北</Option>
              <Option value="华东">华东</Option>
              <Option value="华南">华南</Option>
              <Option value="华中">华中</Option>
              <Option value="西南">西南</Option>
              <Option value="西北">西北</Option>
              <Option value="东北">东北</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="推广类型"
              allowClear
              style={{ width: '100%' }}
              value={campaignTypeFilter}
              onChange={(v) => handleFilterChange('campaignType', v)}
            >
              <Option value="搜索推广">搜索推广</Option>
              <Option value="信息流推广">信息流推广</Option>
              <Option value="品牌推广">品牌推广</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="状态"
              allowClear
              style={{ width: '100%' }}
              value={statusFilter}
              onChange={(v) => handleFilterChange('status', v)}
            >
              <Option value="正常">正常</Option>
              <Option value="暂停">暂停</Option>
              <Option value="异常">异常</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* 客户数据列表表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={customerSummaries}
          rowKey="customerId"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            pageSizeOptions: ['2','3','4','5'] // ← 可选
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          onRow={(record) => ({
            style: { backgroundColor: getBgColor(record.company || '未知部门') }
          })}
        />
      </Card>
    </div>
  );
};

export default DataManagement;
