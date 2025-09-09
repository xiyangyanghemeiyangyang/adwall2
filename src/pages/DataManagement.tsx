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
  DatePicker,
  Tooltip
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined, 
  BarChartOutlined,
  DollarOutlined,
  AimOutlined,
  UserOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { dataManagementApi, type DataRecord } from '../api/dataManagement';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const DataManagement = () => {
  const navigate = useNavigate();
  const [dataRecords, setDataRecords] = useState<DataRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [campaignTypeFilter, setCampaignTypeFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [statistics, setStatistics] = useState({
    totalClicks: 0,
    totalCost: 0,
    totalRevenue: 0,
    totalImpressions: 0,
    avgConversionRate: 0,
    totalCustomers: 0,
    totalRegions: 0
  });

  // 获取数据列表
  const fetchDataRecords = async (
    page = 1, 
    pageSize = 10, 
    search = '', 
    region = '', 
    city = '',
    status = '',
    campaignType = '',
    dateRange?: [string, string]
  ) => {
    setLoading(true);
    try {
      const result = await dataManagementApi.getDataRecords({
        page,
        pageSize,
        search,
        region,
        city,
        status,
        campaignType,
        dateRange
      });
      setDataRecords(result.data);
      setPagination(prev => ({
        ...prev,
        current: page,
        total: result.total
      }));
    } catch (error) {
      message.error('获取数据列表失败');
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

  useEffect(() => {
    fetchDataRecords();
    fetchStatistics();
  }, []);

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchDataRecords(1, pagination.pageSize, value, regionFilter, cityFilter, statusFilter, campaignTypeFilter, dateRange || undefined);
  };

  // 处理筛选
  const handleFilterChange = (type: string, value: string) => {
    switch (type) {
      case 'region':
        setRegionFilter(value);
        fetchDataRecords(1, pagination.pageSize, searchText, value, cityFilter, statusFilter, campaignTypeFilter, dateRange || undefined);
        break;
      case 'city':
        setCityFilter(value);
        fetchDataRecords(1, pagination.pageSize, searchText, regionFilter, value, statusFilter, campaignTypeFilter, dateRange || undefined);
        break;
      case 'status':
        setStatusFilter(value);
        fetchDataRecords(1, pagination.pageSize, searchText, regionFilter, cityFilter, value, campaignTypeFilter, dateRange || undefined);
        break;
      case 'campaignType':
        setCampaignTypeFilter(value);
        fetchDataRecords(1, pagination.pageSize, searchText, regionFilter, cityFilter, statusFilter, value, dateRange || undefined);
        break;
    }
  };

  // 处理日期范围筛选
  const handleDateRangeChange = (dates: any, dateStrings: [string, string]) => {
    if (dates) {
      setDateRange(dateStrings);
      fetchDataRecords(1, pagination.pageSize, searchText, regionFilter, cityFilter, statusFilter, campaignTypeFilter, dateStrings);
    } else {
      setDateRange(null);
      fetchDataRecords(1, pagination.pageSize, searchText, regionFilter, cityFilter, statusFilter, campaignTypeFilter);
    }
  };

  // 处理表格分页
  const handleTableChange = (pagination: any) => {
    fetchDataRecords(pagination.current, pagination.pageSize, searchText, regionFilter, cityFilter, statusFilter, campaignTypeFilter, dateRange || undefined);
  };

  // 查看数据详情
  const handleViewDetail = (customerId: string) => {
    navigate(`/data-management/${customerId}`);
  };

  // 表格列定义
  const columns: ColumnsType<DataRecord> = [
    {
      title: '客户信息',
      key: 'customer',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.customerName}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <UserOutlined /> {record.customerId}
          </div>
        </div>
      ),
    },
    {
      title: '推广区域',
      key: 'location',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{record.region}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <EnvironmentOutlined /> {record.city}
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
            <span style={{ fontWeight: 'bold' }}>{record.clickCount.toLocaleString()}</span>
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>点击</span>
          </div>
          <div>
            <DollarOutlined style={{ marginRight: '4px', color: '#52c41a' }} />
            <span style={{ fontWeight: 'bold' }}>¥{record.cost.toLocaleString()}</span>
            <span style={{ fontSize: '12px', color: '#666', marginLeft: '4px' }}>花费</span>
          </div>
        </div>
      ),
    },
    {
      title: '转化率',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      render: (rate: number) => (
        <Tag color={rate > 5 ? 'green' : rate > 2 ? 'orange' : 'red'}>
          {rate.toFixed(2)}%
        </Tag>
      ),
      sorter: (a, b) => a.conversionRate - b.conversionRate,
    },
    {
      title: '收入',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue: number) => (
        <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
          ¥{revenue.toLocaleString()}
        </span>
      ),
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: '推广类型',
      dataIndex: 'campaignType',
      key: 'campaignType',
      render: (type: DataRecord['campaignType']) => {
        const colorMap: Record<string, string> = {
          '搜索推广': 'blue',
          '信息流推广': 'green',
          '品牌推广': 'purple',
          '其他': 'default',
        };
        return <Tag color={colorMap[type]}>{type}</Tag>;
      },
      filters: [
        { text: '搜索推广', value: '搜索推广' },
        { text: '信息流推广', value: '信息流推广' },
        { text: '品牌推广', value: '品牌推广' },
        { text: '其他', value: '其他' },
      ],
      onFilter: (value, record) => record.campaignType === value,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: DataRecord['status']) => {
        const colorMap: Record<string, string> = {
          '正常': 'green',
          '暂停': 'orange',
          '异常': 'red',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
      filters: [
        { text: '正常', value: '正常' },
        { text: '暂停', value: '暂停' },
        { text: '异常', value: '异常' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
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
              enterButton={<SearchOutlined />}
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
              onChange={(value) => handleFilterChange('region', value)}
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
              onChange={(value) => handleFilterChange('campaignType', value)}
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
              onChange={(value) => handleFilterChange('status', value)}
            >
              <Option value="正常">正常</Option>
              <Option value="暂停">暂停</Option>
              <Option value="异常">异常</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker
              style={{ width: '100%' }}
              placeholder={['开始日期', '结束日期']}
              onChange={handleDateRangeChange}
            />
          </Col>
        </Row>
      </Card>

      {/* 数据列表表格 */}
      <Card>
        <Table
          columns={columns}
          dataSource={dataRecords}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条，共 ${Math.ceil(total / pagination.pageSize)} 页`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default DataManagement;
