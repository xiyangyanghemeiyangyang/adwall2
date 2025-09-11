import { Card, Row, Col, Table, List, Avatar, Typography } from 'antd';
import { UserOutlined, FileSearchOutlined, GlobalOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;

// 模拟数据 - 统计卡片
const statisticsData = [
  { 
    key: 'accounts', 
    title: '推广账号总数', 
    value: 2846, 
    icon: <UserOutlined />, 
    color: '#1677ff',
    increase: 12.5
  },
  { 
    key: 'pendingReviews', 
    title: '待审核内容', 
    value: 152, 
    icon: <FileSearchOutlined />, 
    color: '#faad14',
    increase: -8.2
  },
  { 
    key: 'regions', 
    title: '活跃区域数', 
    value: 178, 
    icon: <GlobalOutlined />, 
    color: '#52c41a',
    increase: 3.7
  },
  { 
    key: 'commission', 
    title: '本月佣金(元)', 
    value: 284690, 
    precision: 2,
    prefix: '¥',
    icon: <UserOutlined />, 
    color: '#722ed1',
    increase: 22.3
  },
];

// 模拟数据 - 最近账号申请
interface AccountApplicationRecord {
  key: string;
  name: string;
  region: string;
  type: string;
  status: '待审核' | '已通过' | '已拒绝';
  createTime: string;
}

const accountApplications: AccountApplicationRecord[] = [
  {
    key: '1',
    name: '张三',
    region: '上海市',
    type: '城市推广',
    status: '待审核',
    createTime: '2023-05-08 14:21:33',
  },
  {
    key: '2',
    name: '李四',
    region: '北京市',
    type: '区域推广',
    status: '已通过',
    createTime: '2023-05-07 09:15:22',
  },
  {
    key: '3',
    name: '王五',
    region: '广州市',
    type: '城市推广',
    status: '已拒绝',
    createTime: '2023-05-06 16:42:11',
  },
  {
    key: '4',
    name: '赵六',
    region: '深圳市',
    type: '区域推广',
    status: '待审核',
    createTime: '2023-05-05 10:33:45',
  },
  {
    key: '5',
    name: '钱七',
    region: '杭州市',
    type: '城市推广',
    status: '已通过',
    createTime: '2023-05-04 15:27:36',
  },
];

const columns: ColumnsType<AccountApplicationRecord> = [
  {
    title: '申请人',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '区域',
    dataIndex: 'region',
    key: 'region',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (status: '待审核' | '已通过' | '已拒绝') => {
      const colorMap: Record<string, string> = {
        '待审核': '#faad14',
        '已通过': '#52c41a',
        '已拒绝': '#ff4d4f',
      };
      return <Text style={{ color: colorMap[status] }}>{status}</Text>;
    },
  },
  {
    title: '申请时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
];

// 模拟数据 - 最近活动
const activities = [
  {
    title: '李四的账号申请已通过审核',
    time: '10分钟前',
    avatar: <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />,
  },
  {
    title: '王五发布的房源信息被退回修改',
    time: '2小时前',
    avatar: <Avatar style={{ backgroundColor: '#ff4d4f' }} icon={<FileSearchOutlined />} />,
  },
  {
    title: '赵六更新了区域推广范围',
    time: '5小时前',
    avatar: <Avatar style={{ backgroundColor: '#52c41a' }} icon={<GlobalOutlined />} />,
  },
  {
    title: '本月佣金结算报表已生成',
    time: '1天前',
    avatar: <Avatar style={{ backgroundColor: '#722ed1' }} icon={<UserOutlined />} />,
  },
];

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Title level={4}>仪表盘</Title>
      <Text type="secondary" className="block mb-6">欢迎使用CrmPlus管理系统</Text>
      
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        {statisticsData.map(item => (
          <Col xs={24} sm={12} lg={6} key={item.key}>
            <Card bordered={false} className="h-full">
              <div className="flex justify-between items-center">
                <div>
                  <Text type="secondary">{item.title}</Text>
                  <div className="text-2xl font-bold mt-2">
                    {item.prefix && <span>{item.prefix}</span>}
                    {item.value.toLocaleString('zh-CN')}
                  </div>
                  <div className="mt-2">
                    {item.increase > 0 ? (
                      <Text type="success" className="flex items-center">
                        <RiseOutlined /> {item.increase}%
                      </Text>
                    ) : (
                      <Text type="danger" className="flex items-center">
                        <FallOutlined /> {Math.abs(item.increase)}%
                      </Text>
                    )}
                  </div>
                </div>
                <div className="flex justify-center items-center h-12 w-12 rounded-full" style={{ backgroundColor: `${item.color}20` }}>
                  <span style={{ color: item.color }}>{item.icon}</span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* 最近账号申请 */}
        <Col xs={24} lg={16}>
          <Card 
            title="最近账号申请" 
            bordered={false}
            className="h-full"
          >
            <Table 
              dataSource={accountApplications} 
              columns={columns} 
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        
        {/* 最近活动 */}
        <Col xs={24} lg={8}>
          <Card 
            title="最近活动" 
            bordered={false}
            className="h-full"
          >
            <List
              itemLayout="horizontal"
              dataSource={activities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={item.avatar}
                    title={item.title}
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 