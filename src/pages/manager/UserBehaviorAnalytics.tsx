import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  DatePicker, 
  Space, 
  Tag, 
  Modal, 
  message,
  Tabs,
  Row,
  Col,
  Statistic,
  Progress,
  Alert,
  Timeline,
  Badge
} from 'antd';
import { 
  SearchOutlined, 
  EyeOutlined, 
  CheckOutlined, 
  CloseOutlined,
  DownloadOutlined,
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined,
  LineChartOutlined,
  // TrendingUpOutlined,
  RiseOutlined,
  BulbOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { userBehaviorApi } from '../../api/manger/userBehaviorAnalytics';
import type { Resume, UserBehaviorLog, UserProfile, AnalyticsData, MarketForecastData, JobTrendPrediction, MarketAnalysisReport } from '../../api/manger/userBehaviorAnalytics';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const UserBehaviorAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<any>({});
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [userLogs, setUserLogs] = useState<UserBehaviorLog[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [analyticsModalVisible, setAnalyticsModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [marketForecastData, setMarketForecastData] = useState<MarketForecastData | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  // 样式
  const glassStyle = {
    backdropFilter: 'blur(16px)',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
  };

  useEffect(() => {
    loadResumes();
    loadAnalyticsData();
    loadMarketForecastData();
  }, [currentPage, pageSize, searchParams]);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const result = await userBehaviorApi.getResumes({
        page: currentPage,
        pageSize,
        ...searchParams
      });
      setResumes(result.data);
      setTotal(result.total);
    } catch (error) {
      message.error('加载简历数据失败');
    } finally {
      setLoading(false);
    }
  };

  const loadAnalyticsData = async () => {
    try {
      const data = await userBehaviorApi.getAnalyticsData();
      setAnalyticsData(data);
    } catch (error) {
      message.error('加载分析数据失败');
    }
  };

  const loadMarketForecastData = async () => {
    try {
      const data = await userBehaviorApi.getMarketForecastData();
      setMarketForecastData(data);
    } catch (error) {
      message.error('加载市场预测数据失败');
    }
  };

  const handleSearch = (values: any) => {
    setSearchParams(values);
    setCurrentPage(1);
  };

  const handleApprove = async (id: string) => {
    try {
      await userBehaviorApi.approveResume(id);
      message.success('审核通过');
      loadResumes();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleReject = (id: string) => {
    setRejectingId(id);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      message.error('请输入驳回理由');
      return;
    }
    
    if (!rejectingId) return;
    
    try {
      await userBehaviorApi.rejectResume(rejectingId, rejectReason);
      message.success('已驳回');
      loadResumes();
      setRejectModalVisible(false);
      setRejectReason('');
      setRejectingId(null);
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleCancelReject = () => {
    setRejectModalVisible(false);
    setRejectReason('');
    setRejectingId(null);
  };

  const handleGenerateReport = async (reportType: 'weekly' | 'monthly') => {
    setGeneratingReport(true);
    try {
      const report = await userBehaviorApi.generateMarketReport(reportType);
      message.success(`${reportType === 'weekly' ? '周' : '月'}度报告生成成功`);
      loadMarketForecastData(); // 重新加载数据
    } catch (error) {
      message.error('生成报告失败');
    } finally {
      setGeneratingReport(false);
    }
  };


  const handleViewDetail = async (resume: Resume) => {
    setSelectedResume(resume);
    try {
      const [logs, profile] = await Promise.all([
        userBehaviorApi.getUserBehaviorLogs(resume.id),
        userBehaviorApi.getUserProfile(resume.id)
      ]);
      setUserLogs(logs);
      setUserProfile(profile);
      setDetailModalVisible(true);
    } catch (error) {
      message.error('加载用户详情失败');
    }
  };

  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
    },
    {
      title: '学校',
      dataIndex: 'school',
      key: 'school',
      width: 150,
    },
    {
      title: '专业',
      dataIndex: 'major',
      key: 'major',
      width: 150,
    },
    {
      title: '意向职位',
      dataIndex: 'targetPosition',
      key: 'targetPosition',
      width: 120,
    },
    {
      title: '学历',
      dataIndex: 'education',
      key: 'education',
      width: 80,
    },
    {
      title: '工作年限',
      dataIndex: 'workExperience',
      key: 'workExperience',
      width: 100,
      render: (value: number) => `${value}年`,
    },
    {
      title: '城市',
      dataIndex: 'city',
      key: 'city',
      width: 80,
    },
    {
      title: '投递时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 120,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const color = status === '审核通过' ? 'green' : status === '已驳回' ? 'red' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Resume) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看详情
          </Button>
          {record.status === '待审核' && (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
              >
                通过
              </Button>
              <Button
                type="link"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject(record.id)}
              >
                驳回
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  // ECharts 配置
  const getUserGrowthChartOption = () => {
    if (!analyticsData) return {};
    
    return {
      title: {
        text: '用户增长趋势',
        left: 'center',
        textStyle: { color: '#333' }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ccc',
        textStyle: { color: '#333' }
      },
      legend: {
        data: ['新增用户', '活跃用户'],
        top: 30
      },
      xAxis: {
        type: 'category',
        data: analyticsData.userGrowthTrend.map(item => item.date),
        axisLabel: { color: '#666' }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#666' }
      },
      series: [
        {
          name: '新增用户',
          type: 'line',
          data: analyticsData.userGrowthTrend.map(item => item.newUsers),
          smooth: true,
          lineStyle: { color: '#8B5CF6' },
          itemStyle: { color: '#8B5CF6' }
        },
        {
          name: '活跃用户',
          type: 'line',
          data: analyticsData.userGrowthTrend.map(item => item.activeUsers),
          smooth: true,
          lineStyle: { color: '#14B8A6' },
          itemStyle: { color: '#14B8A6' }
        }
      ]
    };
  };

  const getApplicationTrendChartOption = () => {
    if (!analyticsData) return {};
    
    return {
      title: {
        text: '简历投递趋势',
        left: 'center',
        textStyle: { color: '#333' }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ccc',
        textStyle: { color: '#333' }
      },
      legend: {
        data: ['投递量', '完成量'],
        top: 30
      },
      xAxis: {
        type: 'category',
        data: analyticsData.applicationTrend.map(item => item.date),
        axisLabel: { color: '#666' }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#666' }
      },
      series: [
        {
          name: '投递量',
          type: 'bar',
          data: analyticsData.applicationTrend.map(item => item.applications),
          itemStyle: { color: '#8B5CF6' }
        },
        {
          name: '完成量',
          type: 'bar',
          data: analyticsData.applicationTrend.map(item => item.completed),
          itemStyle: { color: '#14B8A6' }
        }
      ]
    };
  };

  const getEducationDistributionChartOption = () => {
    if (!analyticsData) return {};
    
    return {
      title: {
        text: '学历分布',
        left: 'center',
        textStyle: { color: '#333' }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ccc',
        textStyle: { color: '#333' }
      },
      series: [
        {
          name: '学历分布',
          type: 'pie',
          radius: '50%',
          data: analyticsData.educationDistribution.map(item => ({
            value: item.count,
            name: item.education
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          itemStyle: {
            color: (params: any) => {
              const colors = ['#8B5CF6', '#14B8A6', '#3B82F6', '#F59E0B', '#EF4444'];
              return colors[params.dataIndex % colors.length];
            }
          }
        }
      ]
    };
  };

  const getSkillDistributionChartOption = () => {
    if (!analyticsData) return {};
    
    return {
      title: {
        text: '热门技能分布',
        left: 'center',
        textStyle: { color: '#333' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ccc',
        textStyle: { color: '#333' }
      },
      xAxis: {
        type: 'category',
        data: analyticsData.skillDistribution.map(item => item.skill),
        axisLabel: { 
          color: '#666',
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#666' }
      },
      series: [
        {
            name: '技能数量',
            type: 'bar',
            data: analyticsData.skillDistribution.map(item => item.count),
            itemStyle: {
              color: (window as any).echarts?.graphic?.LinearGradient 
                ? new (window as any).echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#8B5CF6' },
                    { offset: 1, color: '#14B8A6' }
                  ])
                : '#8B5CF6'
            }
          }
      ]
    };
  };

  const getAgeDistributionChartOption = () => {
    if (!analyticsData) return {};
    
    return {
      title: {
        text: '年龄分布',
        left: 'center',
        textStyle: { color: '#333' }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ccc',
        textStyle: { color: '#333' }
      },
      series: [
        {
          name: '年龄分布',
          type: 'pie',
          radius: ['40%', '70%'],
          data: analyticsData.ageDistribution.map(item => ({
            value: item.count,
            name: item.ageRange
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          itemStyle: {
            color: (params: any) => {
              const colors = ['#8B5CF6', '#14B8A6', '#3B82F6', '#F59E0B', '#EF4444', '#06B6D4', '#F97316'];
              return colors[params.dataIndex % colors.length];
            }
          }
        }
      ]
    };
  };

  const getRegionDistributionChartOption = () => {
    if (!analyticsData) return {};
    
    return {
      title: {
        text: '地区分布',
        left: 'center',
        textStyle: { color: '#333' }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ccc',
        textStyle: { color: '#333' }
      },
      series: [
        {
          name: '地区分布',
          type: 'pie',
          radius: '50%',
          data: analyticsData.regionDistribution.map(item => ({
            value: item.count,
            name: item.region
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          itemStyle: {
            color: (params: any) => {
              const colors = ['#8B5CF6', '#14B8A6', '#3B82F6', '#F59E0B', '#EF4444', '#06B6D4', '#F97316'];
              return colors[params.dataIndex % colors.length];
            }
          }
        }
      ]
    };
  };

  // 市场预测图表配置
  const getJobTrendChartOption = () => {
    if (!marketForecastData) return {};
    
    return {
      title: {
        text: '职位需求预测趋势',
        left: 'center',
        textStyle: { color: '#333' }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ccc',
        textStyle: { color: '#333' }
      },
      legend: {
        data: ['当前需求', '预测增长'],
        top: 30
      },
      xAxis: {
        type: 'category',
        data: marketForecastData.predictions.map(item => item.jobTitle),
        axisLabel: { 
          color: '#666',
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#666' }
      },
      series: [
        {
          name: '当前需求',
          type: 'bar',
          data: marketForecastData.predictions.map(item => item.currentDemand),
          itemStyle: { color: '#8B5CF6' }
        },
        {
          name: '预测增长',
          type: 'bar',
          data: marketForecastData.predictions.map(item => item.predictedGrowth),
          itemStyle: { color: '#14B8A6' }
        }
      ]
    };
  };

  const getConfidenceChartOption = () => {
    if (!marketForecastData) return {};
    
    return {
      title: {
        text: '预测置信度分析',
        left: 'center',
        textStyle: { color: '#333' }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c}%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ccc',
        textStyle: { color: '#333' }
      },
      series: [
        {
          name: '置信度',
          type: 'pie',
          radius: '50%',
          data: marketForecastData.predictions.map(item => ({
            value: item.confidence,
            name: item.jobTitle
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          itemStyle: {
            color: (params: any) => {
              const colors = ['#8B5CF6', '#14B8A6', '#3B82F6', '#F59E0B', '#EF4444'];
              return colors[params.dataIndex % colors.length];
            }
          }
        }
      ]
    };
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-3xl bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
            用户行为数据分析
          </h1>
          <p className="text-gray-600 mt-1">C端用户行为数据分析和简历管理</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            type="primary"
            icon={<BarChartOutlined />}
            onClick={() => setAnalyticsModalVisible(true)}
            className="bg-gradient-to-r from-purple-500 to-teal-500 border-none"
          >
            数据分析
          </Button>
          <Button 
            icon={<DownloadOutlined />}
            className="px-4 py-2 rounded-xl"
            style={glassStyle}
          >
            导出报告
          </Button>
        </div>
      </div>

      {/* 概览卡片 */}
      {analyticsData && (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card style={glassStyle} className="rounded-2xl">
              <Statistic
                title="总用户数"
                value={analyticsData.overview.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#8B5CF6' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={glassStyle} className="rounded-2xl">
              <Statistic
                title="总简历数"
                value={analyticsData.overview.totalResumes}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#14B8A6' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={glassStyle} className="rounded-2xl">
              <Statistic
                title="总投递数"
                value={analyticsData.overview.totalApplications}
                prefix={<BarChartOutlined />}
                valueStyle={{ color: '#3B82F6' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card style={glassStyle} className="rounded-2xl">
              <Statistic
                title="转化率"
                value={analyticsData.overview.conversionRate}
                suffix="%"
                prefix={<LineChartOutlined />}
                valueStyle={{ color: '#F59E0B' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* 筛选条件 */}
      <Card style={glassStyle} className="rounded-2xl">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">关键词搜索</label>
            <Input
              placeholder="按姓名、学校或技能搜索"
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchParams({ ...searchParams, search: e.target.value })}
            />
          </div>
          <div className="min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">简历状态</label>
            <Select
              placeholder="选择状态"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => setSearchParams({ ...searchParams, status: value })}
            >
              <Option value="待审核">待审核</Option>
              <Option value="审核通过">审核通过</Option>
              <Option value="已驳回">已驳回</Option>
            </Select>
          </div>
          <div className="min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">城市</label>
            <Select
              placeholder="选择城市"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => setSearchParams({ ...searchParams, city: value })}
            >
              <Option value="北京">北京</Option>
              <Option value="上海">上海</Option>
              <Option value="广州">广州</Option>
              <Option value="深圳">深圳</Option>
              <Option value="杭州">杭州</Option>
              <Option value="南京">南京</Option>
              <Option value="成都">成都</Option>
              <Option value="武汉">武汉</Option>
            </Select>
          </div>
          <div className="min-w-[120px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">学历</label>
            <Select
              placeholder="选择学历"
              allowClear
              style={{ width: '100%' }}
              onChange={(value) => setSearchParams({ ...searchParams, education: value })}
            >
              <Option value="本科">本科</Option>
              <Option value="硕士">硕士</Option>
              <Option value="博士">博士</Option>
              <Option value="专科">专科</Option>
            </Select>
          </div>
          <div className="min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">投递时间</label>
            <RangePicker
              style={{ width: '100%' }}
              onChange={(dates) => {
                if (dates) {
                  setSearchParams({
                    ...searchParams,
                    dateRange: [dates[0]?.format('YYYY-MM-DD'), dates[1]?.format('YYYY-MM-DD')]
                  });
                } else {
                  setSearchParams({ ...searchParams, dateRange: undefined });
                }
              }}
            />
          </div>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => handleSearch(searchParams)}
            className="bg-gradient-to-r from-purple-500 to-teal-500 border-none"
          >
            搜索
          </Button>
        </div>
      </Card>

      {/* 简历列表 */}
      <Card style={glassStyle} className="rounded-2xl">
        <Table
          columns={columns}
          dataSource={resumes}
          loading={loading}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size || 10);
            },
          }}
        />
      </Card>

      {/* 驳回理由弹窗 */}
      <Modal
        title="驳回简历"
        open={rejectModalVisible}
        onOk={handleConfirmReject}
        onCancel={handleCancelReject}
        okText="确认驳回"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <div className="space-y-4">
          <p className="text-gray-600">请输入驳回理由：</p>
          <Input.TextArea
            placeholder="请详细说明驳回原因..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
            maxLength={200}
            showCount
          />
        </div>
      </Modal>

      {/* 用户详情弹窗 */}
      <Modal
        title="用户详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={1000}
        footer={null}
      >
        {selectedResume && (
          <Tabs defaultActiveKey="basic">
            <TabPane tab="基本信息" key="basic">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card title="个人信息" size="small">
                    <p><strong>姓名：</strong>{selectedResume.name}</p>
                    <p><strong>电话：</strong>{selectedResume.phone}</p>
                    <p><strong>邮箱：</strong>{selectedResume.email}</p>
                    <p><strong>学校：</strong>{selectedResume.school}</p>
                    <p><strong>专业：</strong>{selectedResume.major}</p>
                    <p><strong>学历：</strong>{selectedResume.education}</p>
                    <p><strong>工作年限：</strong>{selectedResume.workExperience}年</p>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="求职信息" size="small">
                    <p><strong>意向职位：</strong>{selectedResume.targetPosition}</p>
                    <p><strong>目标行业：</strong>{selectedResume.targetIndustry}</p>
                    <p><strong>城市：</strong>{selectedResume.city}</p>
                    <p><strong>地区：</strong>{selectedResume.region}</p>
                    <p><strong>投递时间：</strong>{new Date(selectedResume.submitTime).toLocaleString()}</p>
                    <p><strong>最后更新：</strong>{new Date(selectedResume.lastUpdateTime).toLocaleString()}</p>
                    <p><strong>状态：</strong>
                      <Tag color={selectedResume.status === '审核通过' ? 'green' : selectedResume.status === '已驳回' ? 'red' : 'orange'}>
                        {selectedResume.status}
                      </Tag>
                    </p>
                  </Card>
                </Col>
                <Col span={24}>
                  <Card title="技能标签" size="small">
                    <Space wrap>
                      {selectedResume.skills.map(skill => (
                        <Tag key={skill} color="blue">{skill}</Tag>
                      ))}
                    </Space>
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="行为记录" key="behavior">
              <Table
                columns={[
                  { title: '时间', dataIndex: 'timestamp', key: 'timestamp', render: (value) => new Date(value).toLocaleString() },
                  { title: '行为', dataIndex: 'action', key: 'action' },
                  { title: '目标', dataIndex: 'target', key: 'target' },
                  { title: '设备', dataIndex: 'device', key: 'device' },
                  { title: '位置', dataIndex: 'location', key: 'location' },
                ]}
                dataSource={userLogs}
                rowKey="id"
                size="small"
                pagination={{ pageSize: 10 }}
              />
            </TabPane>
            <TabPane tab="用户画像" key="profile">
              {userProfile && (
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card title="基础信息" size="small">
                      <p><strong>年龄：</strong>{userProfile.age}岁</p>
                      <p><strong>学历：</strong>{userProfile.education}</p>
                      <p><strong>城市：</strong>{userProfile.city}</p>
                      <p><strong>行业：</strong>{userProfile.industry}</p>
                      <p><strong>登录次数：</strong>{userProfile.loginCount}</p>
                      <p><strong>最后登录：</strong>{new Date(userProfile.lastLoginTime).toLocaleString()}</p>
                      <p><strong>总浏览时长：</strong>{userProfile.totalViewTime}分钟</p>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="活跃度分析" size="small">
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">登录活跃度</p>
                        <Progress percent={Math.min(userProfile.loginCount, 100)} strokeColor="#8B5CF6" />
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">浏览活跃度</p>
                        <Progress percent={Math.min(userProfile.totalViewTime / 10, 100)} strokeColor="#14B8A6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">收藏职位数</p>
                        <p className="text-lg font-semibold text-purple-600">{userProfile.favoriteJobs.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">投递职位数</p>
                        <p className="text-lg font-semibold text-teal-600">{userProfile.appliedJobs.length}</p>
                      </div>
                    </Card>
                  </Col>
                </Row>
              )}
            </TabPane>
          </Tabs>
        )}
      </Modal>

      {/* 数据分析弹窗 */}
      <Modal
        title="用户行为数据分析"
        open={analyticsModalVisible}
        onCancel={() => setAnalyticsModalVisible(false)}
        width={1200}
        footer={null}
      >
        {analyticsData && (
          <Tabs defaultActiveKey="overview">
            <TabPane tab="概览" key="overview">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card title="用户增长趋势" size="small">
                    <ReactECharts option={getUserGrowthChartOption()} style={{ height: '300px' }} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="简历投递趋势" size="small">
                    <ReactECharts option={getApplicationTrendChartOption()} style={{ height: '300px' }} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="学历分布" size="small">
                    <ReactECharts option={getEducationDistributionChartOption()} style={{ height: '300px' }} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="年龄分布" size="small">
                    <ReactECharts option={getAgeDistributionChartOption()} style={{ height: '300px' }} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="热门技能分布" size="small">
                    <ReactECharts option={getSkillDistributionChartOption()} style={{ height: '300px' }} />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title="地区分布" size="small">
                    <ReactECharts option={getRegionDistributionChartOption()} style={{ height: '300px' }} />
                  </Card>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="热门职位" key="jobs">
              <Table
                columns={[
                  { title: '职位名称', dataIndex: 'jobTitle', key: 'jobTitle' },
                  { title: '公司', dataIndex: 'company', key: 'company' },
                  { title: '投递数', dataIndex: 'applications', key: 'applications' },
                  { title: '浏览量', dataIndex: 'views', key: 'views' },
                ]}
                dataSource={analyticsData.popularJobs}
                rowKey="jobTitle"
                pagination={false}
              />
            </TabPane>
            
            {/* 市场预测标签页 */}
            <TabPane tab="市场预测" key="forecast">
              <div className="space-y-6">
                {/* 预测概览 */}
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Card 
                      title={
                        <div className="flex items-center gap-2">
                          <RiseOutlined className="text-purple-600" />
                          <span>市场预测概览</span>
                        </div>
                      }
                      style={glassStyle}
                      className="rounded-2xl"
                    >
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} lg={6}>
                          <Statistic
                            title="预测职位数"
                            value={marketForecastData?.predictions.length || 0}
                            prefix={<BarChartOutlined />}
                            valueStyle={{ color: '#8B5CF6' }}
                          />
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                          <Statistic
                            title="平均增长率"
                            value={marketForecastData ? 
                              (marketForecastData.predictions.reduce((sum, p) => sum + p.predictedGrowth, 0) / marketForecastData.predictions.length).toFixed(1) 
                              : 0
                            }
                            suffix="%"
                            prefix={<RiseOutlined />}
                            valueStyle={{ color: '#14B8A6' }}
                          />
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                          <Statistic
                            title="平均置信度"
                            value={marketForecastData ? 
                              (marketForecastData.predictions.reduce((sum, p) => sum + p.confidence, 0) / marketForecastData.predictions.length).toFixed(1) 
                              : 0
                            }
                            suffix="%"
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#3B82F6' }}
                          />
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                          <Statistic
                            title="分析报告数"
                            value={marketForecastData?.reports.length || 0}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#F59E0B' }}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>

                {/* 预测图表 */}
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card title="职位需求预测趋势" size="small">
                      <ReactECharts option={getJobTrendChartOption()} style={{ height: '300px' }} />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card title="预测置信度分析" size="small">
                      <ReactECharts option={getConfidenceChartOption()} style={{ height: '300px' }} />
                    </Card>
                  </Col>
                </Row>

                {/* 详细预测列表 */}
                <Card title="详细预测分析" style={glassStyle} className="rounded-2xl">
                  <Table
                    columns={[
                      {
                        title: '职位名称',
                        dataIndex: 'jobTitle',
                        key: 'jobTitle',
                        width: 120,
                      },
                      {
                        title: '行业',
                        dataIndex: 'industry',
                        key: 'industry',
                        width: 100,
                      },
                      {
                        title: '当前需求',
                        dataIndex: 'currentDemand',
                        key: 'currentDemand',
                        width: 100,
                        render: (value: number) => (
                          <Progress 
                            percent={value} 
                            size="small" 
                            strokeColor="#8B5CF6"
                            format={() => `${value}%`}
                          />
                        ),
                      },
                      {
                        title: '预测增长',
                        dataIndex: 'predictedGrowth',
                        key: 'predictedGrowth',
                        width: 100,
                        render: (value: number) => (
                          <Tag color={value > 15 ? 'green' : value > 8 ? 'orange' : 'red'}>
                            +{value}%
                          </Tag>
                        ),
                      },
                      {
                        title: '置信度',
                        dataIndex: 'confidence',
                        key: 'confidence',
                        width: 100,
                        render: (value: number) => (
                          <Badge 
                            count={`${value}%`} 
                            style={{ backgroundColor: value > 80 ? '#52c41a' : value > 60 ? '#faad14' : '#f5222d' }}
                          />
                        ),
                      },
                      {
                        title: '时间范围',
                        dataIndex: 'timeframe',
                        key: 'timeframe',
                        width: 120,
                      },
                      {
                        title: '建议',
                        dataIndex: 'recommendation',
                        key: 'recommendation',
                        ellipsis: true,
                      },
                    ]}
                    dataSource={marketForecastData?.predictions || []}
                    rowKey="jobTitle"
                    pagination={false}
                    size="small"
                  />
                </Card>

                {/* 市场分析报告 */}
                <Card 
                  title={
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BulbOutlined className="text-purple-600" />
                        <span>市场分析报告</span>
                      </div>
                      <Space>
                        <Button
                          type="primary"
                          size="small"
                          icon={<ClockCircleOutlined />}
                          onClick={() => handleGenerateReport('weekly')}
                          loading={generatingReport}
                          className="bg-gradient-to-r from-purple-500 to-teal-500 border-none"
                        >
                          生成周报
                        </Button>
                        <Button
                          type="primary"
                          size="small"
                          icon={<FileTextOutlined />}
                          onClick={() => handleGenerateReport('monthly')}
                          loading={generatingReport}
                          className="bg-gradient-to-r from-purple-500 to-teal-500 border-none"
                        >
                          生成月报
                        </Button>
                      </Space>
                    </div>
                  }
                  style={glassStyle}
                  className="rounded-2xl"
                >
                  <div className="space-y-4">
                    {marketForecastData?.reports.map((report) => (
                      <Card key={report.id} size="small" className="border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-800">{report.title}</h4>
                            <p className="text-sm text-gray-500">
                              {new Date(report.generateTime).toLocaleString()}
                            </p>
                          </div>
                          <Tag color={report.reportType === 'weekly' ? 'blue' : 'green'}>
                            {report.reportType === 'weekly' ? '周报' : '月报'}
                          </Tag>
                        </div>
                        
                        <Alert
                          message={report.summary}
                          type="info"
                          showIcon
                          className="mb-3"
                        />
                        
                        <Row gutter={[16, 16]}>
                          <Col span={12}>
                            <div>
                              <h5 className="font-semibold text-gray-700 mb-2">关键发现</h5>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {report.keyFindings.map((finding, index) => (
                                  <li key={index}>• {finding}</li>
                                ))}
                              </ul>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div>
                              <h5 className="font-semibold text-gray-700 mb-2">市场趋势</h5>
                              <div className="space-y-2">
                                {report.marketTrends.map((trend, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <Tag color={trend.impact === 'high' ? 'red' : trend.impact === 'medium' ? 'orange' : 'green'}>
                                      {trend.impact === 'high' ? '高' : trend.impact === 'medium' ? '中' : '低'}
                                    </Tag>
                                    <span className="text-sm text-gray-600">{trend.trend}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </Col>
                        </Row>
                        
                        {report.emergingJobs.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-semibold text-gray-700 mb-2">新兴职位</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {report.emergingJobs.map((job, index) => (
                                <Card key={index} size="small" className="bg-blue-50">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-blue-800">{job.jobTitle}</span>
                                    <Tag color="blue">+{job.growthRate}%</Tag>
                                  </div>
                                  <p className="text-sm text-blue-600 mb-2">{job.description}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {job.skills.map((skill, skillIndex) => (
                                      <Tag key={skillIndex} size="small" color="blue">
                                        {skill}
                                      </Tag>
                                    ))}
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="mt-4">
                          <h5 className="font-semibold text-gray-700 mb-2">建议措施</h5>
                          <Timeline size="small">
                            {report.recommendations.map((rec, index) => (
                              <Timeline.Item key={index}>
                                <div className="flex items-center gap-2">
                                  <Tag color={rec.priority === 'high' ? 'red' : rec.priority === 'medium' ? 'orange' : 'green'}>
                                    {rec.priority === 'high' ? '高' : rec.priority === 'medium' ? '中' : '低'}
                                  </Tag>
                                  <span className="font-medium text-gray-700">{rec.category}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{rec.suggestion}</p>
                              </Timeline.Item>
                            ))}
                          </Timeline>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </div>
            </TabPane>
          </Tabs>
        )}
      </Modal>
    </div>
  );
};

export default UserBehaviorAnalytics;
