import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Typography, 
  Row, 
  Col,
  Statistic,
  message,
  Spin,
  Space,
  Tag
} from 'antd';
import { 
  ArrowLeftOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DollarOutlined,
  AimOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { dataManagementApi, type CustomerDataDetail } from '../api/dataManagement';

const { Title } = Typography;

const DataDetail = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dataDetail, setDataDetail] = useState<CustomerDataDetail | null>(null);

  // 获取客户数据详情
  const fetchDataDetail = async () => {
    if (!customerId) return;
    
    setLoading(true);
    try {
      const detail = await dataManagementApi.getCustomerDataDetail(customerId);
      setDataDetail(detail);
    } catch (error) {
      message.error('获取数据详情失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataDetail();
  }, [customerId]);

  // 返回上一页
  const handleBack = () => {
    navigate('/data-management');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!dataDetail) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={4}>数据不存在</Title>
        <Button type="primary" onClick={handleBack}>
          返回数据管理
        </Button>
      </div>
    );
  }

  // 柱状图配置 - 不同城市数据对比
  const getBarChartOption = () => {
    if (!dataDetail.regionData || dataDetail.regionData.length === 0) {
      return {
        title: { text: '暂无数据', left: 'center' },
        series: []
      };
    }
    
    const cities = dataDetail.regionData.map(item => item.region);
    const clicks = dataDetail.regionData.map(item => item.totalClicks);
    const costs = dataDetail.regionData.map(item => item.totalCost);
    const revenues = dataDetail.regionData.map(item => item.totalRevenue);

    return {
      title: {
        text: '各区域推广数据对比',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['点击量', '花费', '收入'],
        top: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: cities
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '点击量',
          type: 'bar',
          data: clicks,
          itemStyle: {
            color: '#1677ff'
          }
        },
        {
          name: '花费',
          type: 'bar',
          data: costs,
          itemStyle: {
            color: '#faad14'
          }
        },
        {
          name: '收入',
          type: 'bar',
          data: revenues,
          itemStyle: {
            color: '#52c41a'
          }
        }
      ]
    };
  };

  // 折线图配置 - 时间趋势
  const getLineChartOption = () => {
    if (!dataDetail.timeSeriesData || dataDetail.timeSeriesData.length === 0) {
      return {
        title: { text: '暂无数据', left: 'center' },
        series: []
      };
    }
    
    const dates = dataDetail.timeSeriesData.map(item => item.date);
    const clicks = dataDetail.timeSeriesData.map(item => item.clicks);
    const costs = dataDetail.timeSeriesData.map(item => item.cost);
    const revenues = dataDetail.timeSeriesData.map(item => item.revenue);
    const conversionRates = dataDetail.timeSeriesData.map(item => item.conversionRate);

    return {
      title: {
        text: '推广数据趋势分析',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['点击量', '花费', '收入', '转化率'],
        top: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates
      },
      yAxis: [
        {
          type: 'value',
          name: '数量/金额',
          position: 'left'
        },
        {
          type: 'value',
          name: '转化率(%)',
          position: 'right'
        }
      ],
      series: [
        {
          name: '点击量',
          type: 'line',
          data: clicks,
          smooth: true,
          itemStyle: {
            color: '#1677ff'
          }
        },
        {
          name: '花费',
          type: 'line',
          data: costs,
          smooth: true,
          itemStyle: {
            color: '#faad14'
          }
        },
        {
          name: '收入',
          type: 'line',
          data: revenues,
          smooth: true,
          itemStyle: {
            color: '#52c41a'
          }
        },
        {
          name: '转化率',
          type: 'line',
          yAxisIndex: 1,
          data: conversionRates,
          smooth: true,
          itemStyle: {
            color: '#722ed1'
          }
        }
      ]
    };
  };

  // 饼图配置 - 推广类型占比
  const getPieChartOption = () => {
    if (!dataDetail.campaignData || dataDetail.campaignData.length === 0) {
      return {
        title: { text: '暂无数据', left: 'center' },
        series: []
      };
    }
    
    const data = dataDetail.campaignData.map(item => ({
      name: item.campaignType,
      value: item.clicks
    }));

    return {
      title: {
        text: '推广类型点击量分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle'
      },
      series: [
        {
          name: '点击量',
          type: 'pie',
          radius: '50%',
          center: ['60%', '50%'],
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  };

  // 区域收入分布图 - 使用柱状图替代地图
  const getRegionChartOption = () => {
    if (!dataDetail.regionData || dataDetail.regionData.length === 0) {
      return {
        title: { text: '暂无数据', left: 'center' },
        series: []
      };
    }
    
    const regions = dataDetail.regionData.map(item => item.region);
    const revenues = dataDetail.regionData.map(item => item.totalRevenue);

    return {
      title: {
        text: '区域收入分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const data = params[0];
          const regionData = dataDetail.regionData.find(item => item.region === data.name);
          return `${data.name}<br/>
                  收入: ¥${data.value.toLocaleString()}<br/>
                  点击量: ${regionData?.totalClicks.toLocaleString()}<br/>
                  花费: ¥${regionData?.totalCost.toLocaleString()}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: regions,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '收入(¥)'
      },
      series: [
        {
          name: '收入',
          type: 'bar',
          data: revenues,
          itemStyle: {
            color: '#52c41a'
          },
          emphasis: {
            itemStyle: {
              color: '#389e0d'
            }
          }
        }
      ]
    };
  };

  // 获取客户推广的所有区域和城市信息
  const getCustomerRegionsAndCities = () => {
    if (!dataDetail.regionData || dataDetail.regionData.length === 0) {
      return { regions: [], cities: [] };
    }
    
    const regions = dataDetail.regionData.map(item => item.region);
    const cities = dataDetail.cityData ? dataDetail.cityData.map(item => item.city) : [];
    
    return { regions, cities };
  };

  const { regions, cities } = getCustomerRegionsAndCities();

  return (
    <div className="data-detail">
      {/* 页面头部 */}
      <div style={{ marginBottom: '24px' }}>
        <Space align="center" style={{ marginBottom: '16px' }}>
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            style={{ padding: 0 }}
          >
            返回
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            {dataDetail.customerName} - 数据详情
          </Title>
        </Space>
        
        {/* 客户推广区域和城市信息 */}
        <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
          <Col span={24}>
            <Card title="推广覆盖范围" size="small">
              <Row gutter={[16, 8]}>
                <Col xs={24} sm={12}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong>推广区域：</strong>
                    <div style={{ marginTop: '4px' }}>
                      {regions.map((region, index) => (
                        <Tag key={index} color="blue" style={{ margin: '2px' }}>
                          {region}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div>
                    <strong>覆盖城市：</strong>
                    <div style={{ marginTop: '4px' }}>
                      {cities.map((city, index) => (
                        <Tag key={index} color="green" style={{ margin: '2px' }}>
                          {city}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="总点击量"
                    value={dataDetail.totalClicks}
                    prefix={<AimOutlined />}
                    valueStyle={{ color: '#1677ff' }}
                    formatter={(value) => value?.toLocaleString()}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="总花费"
                    value={dataDetail.totalCost}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: '#faad14' }}
                    formatter={(value) => `¥${value?.toLocaleString()}`}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="总收入"
                    value={dataDetail.totalRevenue}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                    formatter={(value) => `¥${value?.toLocaleString()}`}
                  />
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Statistic
                    title="平均转化率"
                    value={dataDetail.avgConversionRate}
                    suffix="%"
                    prefix={<BarChartOutlined />}
                    valueStyle={{ color: '#722ed1' }}
                    precision={2}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        {/* 柱状图 - 区域数据对比 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <BarChartOutlined />
                区域数据对比
              </Space>
            }
            style={{ height: '400px' }}
          >
            <ReactECharts 
              option={getBarChartOption()} 
              style={{ height: '300px' }}
            />
          </Card>
        </Col>

        {/* 折线图 - 时间趋势 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <LineChartOutlined />
                数据趋势分析
              </Space>
            }
            style={{ height: '400px' }}
          >
            <ReactECharts 
              option={getLineChartOption()} 
              style={{ height: '300px' }}
            />
          </Card>
        </Col>

        {/* 饼图 - 推广类型分布 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <PieChartOutlined />
                推广类型分布
              </Space>
            }
            style={{ height: '400px' }}
          >
            <ReactECharts 
              option={getPieChartOption()} 
              style={{ height: '300px' }}
            />
          </Card>
        </Col>

        {/* 区域收入分布图 */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <BarChartOutlined />
                区域收入分布
              </Space>
            }
            style={{ height: '400px' }}
          >
            <ReactECharts 
              option={getRegionChartOption()} 
              style={{ height: '300px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 区域详细数据表格 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Card title="区域详细数据">
            <Row gutter={[16, 16]}>
              {dataDetail.regionData.map((region, index) => (
                <Col xs={24} sm={12} md={8} lg={6} key={index}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <Tag color="blue">{region.region}</Tag>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      <div>点击量: {region.totalClicks.toLocaleString()}</div>
                      <div>花费: ¥{region.totalCost.toLocaleString()}</div>
                      <div>收入: ¥{region.totalRevenue.toLocaleString()}</div>
                      <div>转化率: {region.avgConversionRate.toFixed(2)}%</div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 城市详细数据表格 */}
      {dataDetail.cityData && dataDetail.cityData.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
          <Col span={24}>
            <Card title="城市详细数据">
              <Row gutter={[16, 16]}>
                {dataDetail.cityData.map((city, index) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={index}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <Tag color="green">{city.city}</Tag>
                        <div style={{ fontSize: '10px', color: '#999', marginTop: '2px' }}>
                          {city.region}
                        </div>
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        <div>点击量: {city.totalClicks.toLocaleString()}</div>
                        <div>花费: ¥{city.totalCost.toLocaleString()}</div>
                        <div>收入: ¥{city.totalRevenue.toLocaleString()}</div>
                        <div>转化率: {city.avgConversionRate.toFixed(2)}%</div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default DataDetail;
