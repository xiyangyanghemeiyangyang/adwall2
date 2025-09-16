import { useEffect, useState } from 'react';
import { Card, Button, Space, Typography, Modal, Form, Input, Select, message, Tabs, Row, Col, Statistic, Popconfirm, InputNumber, DatePicker, Tag, Tooltip, Badge } from 'antd';
import { adCampaignApi, type AdCampaignItem, type AdCampaignStatus } from '../../api/manger/adCampaignManagement';
import { 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  BarChartOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  AimOutlined,
  RiseOutlined,
  MoreOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import ReactECharts from 'echarts-for-react';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const AdCampaignManagement = () => {
  const [, setLoading] = useState(false);
  const [data, setData] = useState<AdCampaignItem[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<AdCampaignStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');

  const [detailVisible, setDetailVisible] = useState(false);
  const [current, setCurrent] = useState<AdCampaignItem | null>(null);
  const [createVisible, setCreateVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  const [activeTab, setActiveTab] = useState('campaigns');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await adCampaignApi.getCampaigns({
        search, status: statusFilter, type: typeFilter, platform: platformFilter
      });
      setData(res.data);
    } catch {
      message.error('获取广告活动列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [search, statusFilter, typeFilter, platformFilter]);

  const openCreate = () => { setCreateVisible(true); createForm.resetFields(); };
  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();
      const ok = await adCampaignApi.createCampaign({
        name: values.name,
        type: values.type,
        platform: values.platform,
        budget: Number(values.budget) || 0,
        dailyBudget: Number(values.dailyBudget) || 0,
        status: values.status,
        targetAudience: values.targetAudience,
        keywords: values.keywords || [],
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        description: values.description
      } as any);
      if (ok) {
        message.success('创建成功');
        setCreateVisible(false);
        fetchData();
      }
    } catch {}
  };

  const openEdit = (record: AdCampaignItem) => {
    setCurrent(record);
    form.setFieldsValue({
      ...record,
      dateRange: [dayjs(record.startDate), dayjs(record.endDate)]
    });
    setEditVisible(true);
  };
  const handleEdit = async () => {
    if (!current) return;
    try {
      const values = await form.validateFields();
      const ok = await adCampaignApi.updateCampaign(current.id, {
        ...values,
        budget: Number(values.budget) || 0,
        dailyBudget: Number(values.dailyBudget) || 0,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
      });
      if (ok) {
        message.success('更新成功');
        setEditVisible(false);
        setCurrent(null);
        fetchData();
      }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      const ok = await adCampaignApi.deleteCampaign(id);
      if (ok) {
        message.success('删除成功');
        fetchData();
      }
    } catch {
      message.error('删除失败');
    }
  };

  const openDetail = (record: AdCampaignItem) => {
    setCurrent(record);
    setDetailVisible(true);
  };

  const getStatusColor = (status: AdCampaignStatus) => {
    const colors = {
      '进行中': 'green',
      '已暂停': 'orange',
      '已结束': 'red',
      '待审核': 'blue'
    };
    return colors[status] || 'default';
  };


  const getPlatformColor = (platform: string) => {
    const colors: { [key: string]: string } = {
      '抖音': '#ff0050',
      '快手': '#ff6600',
      '百度': '#2932e1',
      '微信': '#07c160',
      'Google Ads': '#4285f4',
      'LinkedIn': '#0077b5'
    };
    return colors[platform] || '#1890ff';
  };

  const getTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      '信息流': '📱',
      '搜索': '🔍',
      '展示': '🖼️',
      '视频': '🎥'
    };
    return icons[type] || '📊';
  };

  // 计算总体统计
  const totalStats = data.reduce((acc, campaign) => {
    acc.impressions += campaign.impressions || 0;
    acc.clicks += campaign.clicks || 0;
    acc.conversions += campaign.conversions || 0;
    acc.cost += campaign.cost || 0;
    acc.revenue += campaign.revenue || 0;
    return acc;
  }, { impressions: 0, clicks: 0, conversions: 0, cost: 0, revenue: 0 });

  const totalROI = totalStats.cost > 0 ? totalStats.revenue / totalStats.cost : 0;

  // ECharts 配置
  const getPlatformPerformanceOption = () => {
    const platformData = data.reduce((acc, campaign) => {
      if (!acc[campaign.platform]) {
        acc[campaign.platform] = {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          cost: 0,
          revenue: 0
        };
      }
      acc[campaign.platform].impressions += campaign.impressions || 0;
      acc[campaign.platform].clicks += campaign.clicks || 0;
      acc[campaign.platform].conversions += campaign.conversions || 0;
      acc[campaign.platform].cost += campaign.cost || 0;
      acc[campaign.platform].revenue += campaign.revenue || 0;
      return acc;
    }, {} as any);

    const platforms = Object.keys(platformData);
    const impressions = platforms.map(p => platformData[p].impressions);
    const clicks = platforms.map(p => platformData[p].clicks);
    const conversions = platforms.map(p => platformData[p].conversions);

    return {
      title: {
        text: '各平台投放效果对比',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['展示量', '点击量', '转化量'],
        top: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: platforms,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '展示量',
          type: 'bar',
          data: impressions,
          itemStyle: {
            color: '#3b82f6'
          }
        },
        {
          name: '点击量',
          type: 'bar',
          data: clicks,
          itemStyle: {
            color: '#10b981'
          }
        },
        {
          name: '转化量',
          type: 'bar',
          data: conversions,
          itemStyle: {
            color: '#f59e0b'
          }
        }
      ]
    };
  };

  const getROIAnalysisOption = () => {
    const roiData = data.map(campaign => ({
      name: campaign.name,
      value: campaign.roi || 0,
      platform: campaign.platform,
      cost: campaign.cost || 0
    }));

    return {
      title: {
        text: '广告活动ROI分析',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)<br/>成本: ¥{@cost}'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle'
      },
      series: [
        {
          name: 'ROI',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['60%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: roiData
        }
      ]
    };
  };

  const getCostTrendOption = () => {
    // 模拟7天的成本趋势数据
    const dates = [];
    const costData = [];
    const revenueData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = dayjs().subtract(i, 'day').format('MM-DD');
      dates.push(date);
      costData.push(Math.floor(Math.random() * 10000) + 5000);
      revenueData.push(Math.floor(Math.random() * 15000) + 8000);
    }

    return {
      title: {
        text: '成本与收入趋势',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['成本', '收入'],
        top: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '¥{value}'
        }
      },
      series: [
        {
          name: '成本',
          type: 'line',
          data: costData,
          smooth: true,
          itemStyle: {
            color: '#ef4444'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(239, 68, 68, 0.3)'
              }, {
                offset: 1, color: 'rgba(239, 68, 68, 0.1)'
              }]
            }
          }
        },
        {
          name: '收入',
          type: 'line',
          data: revenueData,
          smooth: true,
          itemStyle: {
            color: '#10b981'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0, color: 'rgba(16, 185, 129, 0.3)'
              }, {
                offset: 1, color: 'rgba(16, 185, 129, 0.1)'
              }]
            }
          }
        }
      ]
    };
  };

  const getCTRAnalysisOption = () => {
    const ctrData = data.map(campaign => ({
      name: campaign.name,
      ctr: ((campaign.ctr || 0) * 100).toFixed(1),
      cpc: (campaign.cpc || 0).toFixed(1),
      platform: campaign.platform
    }));

    return {
      title: {
        text: 'CTR与CPC分析',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function(params: any) {
          let result = params[0].name + '<br/>';
          params.forEach((param: any) => {
            result += param.seriesName + ': ' + param.value;
            if (param.seriesName === 'CTR') {
              result += '%';
            } else {
              result += '元';
            }
            result += '<br/>';
          });
          return result;
        }
      },
      legend: {
        data: ['CTR', 'CPC'],
        top: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ctrData.map(item => item.name),
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'CTR (%)',
          position: 'left',
          axisLabel: {
            formatter: '{value}%'
          }
        },
        {
          type: 'value',
          name: 'CPC (元)',
          position: 'right',
          axisLabel: {
            formatter: '¥{value}'
          }
        }
      ],
      series: [
        {
          name: 'CTR',
          type: 'bar',
          yAxisIndex: 0,
          data: ctrData.map(item => parseFloat(item.ctr)),
          itemStyle: {
            color: '#3b82f6'
          }
        },
        {
          name: 'CPC',
          type: 'line',
          yAxisIndex: 1,
          data: ctrData.map(item => parseFloat(item.cpc)),
          itemStyle: {
            color: '#f59e0b'
          },
          lineStyle: {
            width: 3
          }
        }
      ]
    };
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #eff6ff, #e0e7ff)', 
      padding: '16px' 
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '8px', 
            background: 'linear-gradient(to right, #2563eb, #7c3aed)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            广告投放管理系统
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '4px' }}>
            统一管理所有招聘广告的投放计划和效果
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Multi-Platform Campaign Management & Analytics
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          style={{ width: '100%' }}
          items={[
            {
              key: 'campaigns',
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChartOutlined style={{ width: '16px', height: '16px' }} />
                  广告活动管理
                </span>
              ),
              children: (
                <div>
                  {/* 统计概览 */}
                  <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={6}>
                      <Card style={{ 
                        textAlign: 'center', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        background: 'linear-gradient(to bottom right, #3b82f6, #1d4ed8)',
                        color: 'white'
                      }}>
                        <Statistic 
                          title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>总展示量</span>}
                          value={totalStats.impressions} 
                          valueStyle={{ color: 'white' }}
                          prefix={<EyeOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                      <Card style={{ 
                        textAlign: 'center', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        background: 'linear-gradient(to bottom right, #10b981, #059669)',
                        color: 'white'
                      }}>
                        <Statistic 
                          title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>总点击量</span>}
                          value={totalStats.clicks} 
                          valueStyle={{ color: 'white' }}
                          prefix={<AimOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                      <Card style={{ 
                        textAlign: 'center', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        background: 'linear-gradient(to bottom right, #f59e0b, #d97706)',
                        color: 'white'
                      }}>
                        <Statistic 
                          title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>总成本(¥)</span>}
                          value={totalStats.cost} 
                          valueStyle={{ color: 'white' }}
                          prefix={<DollarOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                      <Card style={{ 
                        textAlign: 'center', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        background: 'linear-gradient(to bottom right, #8b5cf6, #7c3aed)',
                        color: 'white'
                      }}>
                        <Statistic 
                          title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>平均ROI</span>}
                          value={totalROI.toFixed(2)} 
                          valueStyle={{ color: 'white' }}
                          prefix={<RiseOutlined />}
                        />
                      </Card>
                    </Col>
                  </Row>

                  {/* 搜索和筛选 */}
                  <Card style={{ marginBottom: '24px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                        <Input.Search
                          allowClear
                          placeholder="搜索广告名称/平台/关键词"
                          onSearch={() => fetchData()}
                          onChange={(e) => setSearch(e.target.value)}
                          style={{ width: 280 }}
                          prefix={<SearchOutlined />}
                        />
                        <Select
                          allowClear
                          placeholder="状态"
                          style={{ width: 120 }}
                          value={statusFilter || undefined}
                          onChange={(v) => setStatusFilter((v as AdCampaignStatus) || '')}
                          suffixIcon={<FilterOutlined />}
                        >
                          <Option value="进行中">进行中</Option>
                          <Option value="已暂停">已暂停</Option>
                          <Option value="已结束">已结束</Option>
                          <Option value="待审核">待审核</Option>
                        </Select>
                        <Select
                          allowClear
                          placeholder="类型"
                          style={{ width: 140 }}
                          value={typeFilter || undefined}
                          onChange={(v) => setTypeFilter(v || '')}
                        >
                          <Option value="信息流">信息流</Option>
                          <Option value="搜索">搜索</Option>
                          <Option value="展示">展示</Option>
                          <Option value="视频">视频</Option>
                        </Select>
                        <Select
                          allowClear
                          placeholder="平台"
                          style={{ width: 140 }}
                          value={platformFilter || undefined}
                          onChange={(v) => setPlatformFilter(v || '')}
                        >
                          <Option value="抖音">抖音</Option>
                          <Option value="快手">快手</Option>
                          <Option value="百度">百度</Option>
                          <Option value="微信">微信</Option>
                          <Option value="Google Ads">Google Ads</Option>
                          <Option value="LinkedIn">LinkedIn</Option>
                        </Select>
                      </div>
                        <Button 
                          type="primary" 
                          icon={<PlusOutlined />} 
                          onClick={openCreate}
                          style={{ 
                            background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', 
                            border: 'none', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                          }}
                          size="large"
                        >
                          新建广告活动
                        </Button>
                    </div>
                  </Card>

                  {/* 广告活动卡片网格 */}
                  <Row gutter={[24, 24]}>
                    {data.map((campaign) => (
                      <Col xs={24} sm={12} lg={8} xl={6} key={campaign.id}>
                        <Card 
                          style={{ 
                            height: '100%', 
                            border: 'none', 
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                          }}
                          bodyStyle={{ padding: '20px' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          {/* 卡片头部 */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '24px' }}>{getTypeIcon(campaign.type)}</span>
                              <div>
                                <Title level={5} style={{ marginBottom: '0', color: '#262626' }}>
                                  {campaign.name}
                                </Title>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                  {campaign.type} · {campaign.platform}
                                </Text>
                              </div>
                            </div>
                            <Badge 
                              color={getStatusColor(campaign.status)} 
                              text={campaign.status}
                              style={{ fontSize: '12px' }}
                            />
                          </div>

                          {/* 平台标识 */}
                          <div style={{ marginBottom: '16px' }}>
                            <Tag 
                              color={getPlatformColor(campaign.platform)}
                              style={{ padding: '4px 12px', borderRadius: '16px' }}
                            >
                              {campaign.platform}
                            </Tag>
                          </div>

                          {/* 预算信息 */}
                          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <Text type="secondary" style={{ fontSize: '12px' }}>总预算</Text>
                              <Text strong style={{ color: '#1890ff' }}>
                                ¥{campaign.budget.toLocaleString()}
                              </Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Text type="secondary" style={{ fontSize: '12px' }}>日预算</Text>
                              <Text style={{ color: '#666' }}>
                                ¥{campaign.dailyBudget.toLocaleString()}
                              </Text>
                            </div>
                          </div>

                          {/* 效果数据 */}
                          {campaign.status === '进行中' && (
                            <div style={{ marginBottom: '16px' }}>
                              <Row gutter={8}>
                                <Col span={12}>
                                  <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#e6f7ff', borderRadius: '6px' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                                      {((campaign.ctr || 0) * 100).toFixed(1)}%
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#999' }}>CTR</div>
                                  </div>
                                </Col>
                                <Col span={12}>
                                  <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f6ffed', borderRadius: '6px' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                                      ¥{(campaign.cpc || 0).toFixed(1)}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#999' }}>CPC</div>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          )}

                          {/* 投放时间 */}
                          <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                              <CalendarOutlined style={{ color: '#999' }} />
                              <Text type="secondary">
                                {campaign.startDate} 至 {campaign.endDate}
                              </Text>
                            </div>
                          </div>

                          {/* 目标受众 */}
                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                              <UserOutlined style={{ color: '#999' }} />
                              <Text type="secondary">{campaign.targetAudience}</Text>
                            </div>
                          </div>

                          {/* 关键词标签 */}
                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {campaign.keywords.slice(0, 3).map((keyword, index) => (
                                <Tag key={index} color="blue">
                                  {keyword}
                                </Tag>
                              ))}
                              {campaign.keywords.length > 3 && (
                                <Tag color="default">
                                  +{campaign.keywords.length - 3}
                                </Tag>
                              )}
                            </div>
                          </div>

                          {/* 操作按钮 */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
                            <Space>
                              <Tooltip title="查看详情">
                                <Button 
                                  type="text" 
                                  icon={<EyeOutlined />} 
                                  onClick={() => openDetail(campaign)}
                                  style={{ color: '#1890ff' }}
                                />
                              </Tooltip>
                              <Tooltip title="编辑">
                                <Button 
                                  type="text" 
                                  icon={<EditOutlined />} 
                                  onClick={() => openEdit(campaign)}
                                  style={{ color: '#52c41a' }}
                                />
                              </Tooltip>
                              <Tooltip title="删除">
                                <Popconfirm
                                  title="确认删除"
                                  description="确定要删除这个广告活动吗？"
                                  onConfirm={() => handleDelete(campaign.id)}
                                  okText="确认"
                                  cancelText="取消"
                                >
                                  <Button 
                                    type="text" 
                                    icon={<DeleteOutlined />}
                                    style={{ color: '#ff4d4f' }}
                                  />
                                </Popconfirm>
                              </Tooltip>
                            </Space>
                            <Button 
                              type="text" 
                              icon={<MoreOutlined />}
                              style={{ color: '#999' }}
                            />
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  {data.length === 0 && (
                    <Card style={{ textAlign: 'center', padding: '48px 0', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <div style={{ fontSize: '64px', marginBottom: '16px' }}>📊</div>
                      <Title level={4} type="secondary">暂无广告活动</Title>
                      <Text type="secondary">点击"新建广告活动"开始创建您的第一个广告投放计划</Text>
                    </Card>
                  )}
                </div>
              )
            },
            {
              key: 'analytics',
              label: (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RiseOutlined style={{ width: '16px', height: '16px' }} />
                  投放效果分析
                </span>
              ),
              children: (
                <div>
                  {/* 总体统计卡片 */}
                  <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={6}>
                      <Card style={{ 
                        textAlign: 'center', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        background: 'linear-gradient(to bottom right, #3b82f6, #1d4ed8)',
                        color: 'white'
                      }}>
                        <Statistic 
                          title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>总展示量</span>}
                          value={totalStats.impressions} 
                          valueStyle={{ color: 'white' }}
                          prefix={<EyeOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                      <Card style={{ 
                        textAlign: 'center', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        background: 'linear-gradient(to bottom right, #10b981, #059669)',
                        color: 'white'
                      }}>
                        <Statistic 
                          title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>总点击量</span>}
                          value={totalStats.clicks} 
                          valueStyle={{ color: 'white' }}
                          prefix={<AimOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                      <Card style={{ 
                        textAlign: 'center', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        background: 'linear-gradient(to bottom right, #f59e0b, #d97706)',
                        color: 'white'
                      }}>
                        <Statistic 
                          title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>总成本(¥)</span>}
                          value={totalStats.cost} 
                          valueStyle={{ color: 'white' }}
                          prefix={<DollarOutlined />}
                        />
                      </Card>
                    </Col>
                    <Col xs={24} sm={6}>
                      <Card style={{ 
                        textAlign: 'center', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        background: 'linear-gradient(to bottom right, #8b5cf6, #7c3aed)',
                        color: 'white'
                      }}>
                        <Statistic 
                          title={<span style={{ color: 'rgba(255,255,255,0.8)' }}>平均ROI</span>}
                          value={totalROI.toFixed(2)} 
                          valueStyle={{ color: 'white' }}
                          prefix={<RiseOutlined />}
                        />
                      </Card>
                    </Col>
                  </Row>

                  {/* 图表区域 */}
                  <Row gutter={[24, 24]}>
                    {/* 平台效果对比 */}
                    <Col xs={24} lg={12}>
                      <Card 
                        style={{ 
                          border: 'none', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          height: '400px'
                        }}
                        bodyStyle={{ height: '100%', padding: '20px' }}
                      >
                        <ReactECharts 
                          option={getPlatformPerformanceOption()} 
                          style={{ height: '100%', width: '100%' }}
                        />
                      </Card>
                    </Col>

                    {/* ROI分析 */}
                    <Col xs={24} lg={12}>
                      <Card 
                        style={{ 
                          border: 'none', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          height: '400px'
                        }}
                        bodyStyle={{ height: '100%', padding: '20px' }}
                      >
                        <ReactECharts 
                          option={getROIAnalysisOption()} 
                          style={{ height: '100%', width: '100%' }}
                        />
                      </Card>
                    </Col>

                    {/* 成本趋势 */}
                    <Col xs={24} lg={12}>
                      <Card 
                        style={{ 
                          border: 'none', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          height: '400px'
                        }}
                        bodyStyle={{ height: '100%', padding: '20px' }}
                      >
                        <ReactECharts 
                          option={getCostTrendOption()} 
                          style={{ height: '100%', width: '100%' }}
                        />
                      </Card>
                    </Col>

                    {/* CTR与CPC分析 */}
                    <Col xs={24} lg={12}>
                      <Card 
                        style={{ 
                          border: 'none', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          height: '400px'
                        }}
                        bodyStyle={{ height: '100%', padding: '20px' }}
                      >
                        <ReactECharts 
                          option={getCTRAnalysisOption()} 
                          style={{ height: '100%', width: '100%' }}
                        />
                      </Card>
                    </Col>
                  </Row>

                  {/* 详细数据表格 */}
                  <Card 
                    style={{ 
                      marginTop: '24px',
                      border: 'none', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    title="详细效果数据"
                  >
                    <Row gutter={[16, 16]}>
                      {data.map((campaign) => (
                        <Col xs={24} sm={12} lg={8} key={campaign.id}>
                          <Card 
                            size="small" 
                            style={{ 
                              height: '100%', 
                              border: '1px solid #f0f0f0',
                              borderRadius: '8px'
                            }}
                          >
                            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                              <Title level={5} style={{ marginBottom: '8px' }}>{campaign.name}</Title>
                              <Tag color={getPlatformColor(campaign.platform)}>
                                {campaign.platform}
                              </Tag>
                            </div>
                            <Row gutter={[8, 8]}>
                              <Col span={12}>
                                <Statistic 
                                  title="展示量" 
                                  value={campaign.impressions || 0} 
                                  valueStyle={{ fontSize: '16px' }}
                                />
                              </Col>
                              <Col span={12}>
                                <Statistic 
                                  title="点击量" 
                                  value={campaign.clicks || 0} 
                                  valueStyle={{ fontSize: '16px' }}
                                />
                              </Col>
                              <Col span={12}>
                                <Statistic 
                                  title="转化量" 
                                  value={campaign.conversions || 0} 
                                  valueStyle={{ fontSize: '16px' }}
                                />
                              </Col>
                              <Col span={12}>
                                <Statistic 
                                  title="ROI" 
                                  value={(campaign.roi || 0).toFixed(2)} 
                                  valueStyle={{ fontSize: '16px', color: '#52c41a' }}
                                />
                              </Col>
                            </Row>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </Card>
                </div>
              )
            }
          ]}
        />

        {/* 详情弹窗 */}
        <Modal 
          title="广告活动详情" 
          open={detailVisible} 
          onCancel={() => setDetailVisible(false)} 
          footer={null} 
          width={800}
          style={{ borderRadius: '8px' }}
        >
          {current && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <span style={{ fontSize: '32px' }}>{getTypeIcon(current.type)}</span>
                <div>
                  <Title level={3} style={{ marginBottom: '4px' }}>{current.name}</Title>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag color={getPlatformColor(current.platform)}>{current.platform}</Tag>
                    <Badge 
                      color={getStatusColor(current.status)} 
                      text={current.status}
                    />
                  </div>
                </div>
              </div>

              <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Statistic 
                      title="总预算" 
                      value={current.budget} 
                      prefix="¥" 
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Statistic 
                      title="日预算" 
                      value={current.dailyBudget} 
                      prefix="¥" 
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <Statistic 
                      title="ROI" 
                      value={(current.roi || 0).toFixed(2)} 
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Card>
                </Col>
              </Row>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>目标受众：</Text>
                <Text style={{ marginLeft: '8px' }}>{current.targetAudience}</Text>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>关键词：</Text>
                <div style={{ marginTop: '8px' }}>
                  <Space wrap>
                    {current.keywords.map((keyword, index) => (
                      <Tag key={index} color="blue">{keyword}</Tag>
                    ))}
                  </Space>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>投放时间：</Text>
                <Text style={{ marginLeft: '8px' }}>{current.startDate} 至 {current.endDate}</Text>
              </div>

              <Card size="small">
                <Text strong>描述：</Text>
                <div style={{ marginTop: '8px', color: '#666' }}>{current.description || '-'}</div>
              </Card>
            </div>
          )}
        </Modal>

        {/* 新建弹窗 */}
        <Modal 
          title="新建广告活动" 
          open={createVisible} 
          onCancel={() => setCreateVisible(false)} 
          onOk={handleCreate} 
          okButtonProps={{ 
            type: 'default',
            style: { 
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', 
              border: 'none',
              color: 'white'
            }
          }}
          width={600}
          style={{ borderRadius: '8px' }}
        >
          <Form form={createForm} layout="vertical">
            <Form.Item name="name" label="广告活动名称" rules={[{ required: true }]}>
              <Input placeholder="请输入广告活动名称" />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="type" label="广告类型" rules={[{ required: true }]}>
                  <Select placeholder="请选择类型">
                    <Option value="信息流">信息流</Option>
                    <Option value="搜索">搜索</Option>
                    <Option value="展示">展示</Option>
                    <Option value="视频">视频</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="platform" label="投放平台" rules={[{ required: true }]}>
                  <Select placeholder="请选择平台">
                    <Option value="抖音">抖音</Option>
                    <Option value="快手">快手</Option>
                    <Option value="百度">百度</Option>
                    <Option value="微信">微信</Option>
                    <Option value="Google Ads">Google Ads</Option>
                    <Option value="LinkedIn">LinkedIn</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="budget" label="总预算" rules={[{ required: true }]}>
                  <InputNumber addonBefore="¥" style={{ width: '100%' }} min={0} placeholder="请输入总预算" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="dailyBudget" label="日预算" rules={[{ required: true }]}>
                  <InputNumber addonBefore="¥" style={{ width: '100%' }} min={0} placeholder="请输入日预算" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="status" label="状态" initialValue="待审核" rules={[{ required: true }]}>
              <Select>
                <Option value="进行中">进行中</Option>
                <Option value="已暂停">已暂停</Option>
                <Option value="已结束">已结束</Option>
                <Option value="待审核">待审核</Option>
              </Select>
            </Form.Item>
            <Form.Item name="targetAudience" label="目标受众" rules={[{ required: true }]}>
              <Input placeholder="如：18-35岁求职者" />
            </Form.Item>
            <Form.Item name="keywords" label="关键词">
              <Select mode="tags" placeholder="请输入关键词，按回车添加" />
            </Form.Item>
            <Form.Item name="dateRange" label="投放时间" rules={[{ required: true }]}>
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="description" label="描述">
              <Input.TextArea rows={4} placeholder="请输入广告活动描述" />
            </Form.Item>
          </Form>
        </Modal>

        {/* 编辑弹窗 */}
        <Modal 
          title="编辑广告活动" 
          open={editVisible} 
          onCancel={() => setEditVisible(false)} 
          onOk={handleEdit} 
          okButtonProps={{ 
            type: 'default',
            style: { 
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', 
              border: 'none',
              color: 'white'
            }
          }}
          width={600}
          style={{ borderRadius: '8px' }}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="name" label="广告活动名称" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="type" label="广告类型" rules={[{ required: true }]}>
                  <Select placeholder="请选择类型">
                    <Option value="信息流">信息流</Option>
                    <Option value="搜索">搜索</Option>
                    <Option value="展示">展示</Option>
                    <Option value="视频">视频</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="platform" label="投放平台" rules={[{ required: true }]}>
                  <Select placeholder="请选择平台">
                    <Option value="抖音">抖音</Option>
                    <Option value="快手">快手</Option>
                    <Option value="百度">百度</Option>
                    <Option value="微信">微信</Option>
                    <Option value="Google Ads">Google Ads</Option>
                    <Option value="LinkedIn">LinkedIn</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item name="budget" label="总预算" rules={[{ required: true }]}>
                  <InputNumber addonBefore="¥" style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="dailyBudget" label="日预算" rules={[{ required: true }]}>
                  <InputNumber addonBefore="¥" style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select>
                <Option value="进行中">进行中</Option>
                <Option value="已暂停">已暂停</Option>
                <Option value="已结束">已结束</Option>
                <Option value="待审核">待审核</Option>
              </Select>
            </Form.Item>
            <Form.Item name="targetAudience" label="目标受众" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="keywords" label="关键词">
              <Select mode="tags" placeholder="请输入关键词，按回车添加" />
            </Form.Item>
            <Form.Item name="dateRange" label="投放时间" rules={[{ required: true }]}>
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name="description" label="描述">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default AdCampaignManagement;
