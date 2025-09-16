import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Input, 
  Select, 
  message, 
  Row, 
  Col, 
  Typography, 
  Space, 
  Badge,
  Statistic,
  Form,
  Modal
} from 'antd';
import { 
  QuestionCircleOutlined,
  PlusOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SendOutlined,
  SearchOutlined,
  FilterOutlined,
  EnvironmentOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { 
  supportApi, 
  type SupportTicket, 
  type Branch, 
  type CreateTicketRequest,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  TICKET_STATUS_OPTIONS
} from '../../api/manger/supportManagement';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const SupportManagement = () => {
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState('principal');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  });
  const [form] = Form.useForm();

  // 获取数据
  const fetchData = async () => {
    setLoading(true);
    try {
      const [ticketsData, branchesData, statsData] = await Promise.all([
        supportApi.getTickets({ branchId: selectedBranch }),
        supportApi.getBranches(),
        supportApi.getTicketStats(selectedBranch)
      ]);
      
      setTickets(ticketsData);
      setBranches(branchesData);
      setTicketStats(statsData);
    } catch (error) {
      message.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedBranch]);

  // 创建新票据
  const handleCreateTicket = async (values: CreateTicketRequest) => {
    try {
      const newTicket = await supportApi.createTicket({
        ...values,
        branchId: selectedBranch
      });
      
      setTickets(prev => [newTicket, ...prev]);
      setShowNewTicketForm(false);
      form.resetFields();
      message.success('票据创建成功，我们会尽快联系您');
      fetchData(); // 刷新统计数据
    } catch (error) {
      message.error('创建票据失败');
    }
  };

  // 获取状态徽章
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge status="error" text="开放" />;
      case 'in-progress':
        return <Badge status="processing" text="进行中" />;
      case 'resolved':
        return <Badge status="success" text="已解决" />;
      default:
        return <Badge status="default" text={status} />;
    }
  };

  // 获取优先级徽章
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge color="red" text="紧急" />;
      case 'high':
        return <Badge color="orange" text="高" />;
      case 'medium':
        return <Badge color="blue" text="中" />;
      case 'low':
        return <Badge color="green" text="低" />;
      default:
        return <Badge color="default" text={priority} />;
    }
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'in-progress':
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      case 'resolved':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      default:
        return <QuestionCircleOutlined style={{ color: '#8c8c8c' }} />;
    }
  };

  // 过滤票据
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 16]} align="top">
          <Col xs={24} lg={16}>
            <div>
              <Title level={2} style={{ marginBottom: '8px' }}>
                <QuestionCircleOutlined style={{ marginRight: '8px' }} />
                问题管理
              </Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                管理您集团对所遇到的技术问题
              </Text>
              
              {/* 分支机构选择器 - 独立一行 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '12px 16px',
                background: '#fafafa',
                borderRadius: '6px',
                border: '1px solid #f0f0f0'
              }}>
                <EnvironmentOutlined style={{ color: '#8c8c8c', fontSize: '16px' }} />
                <Text strong style={{ color: '#262626', minWidth: '80px' }}>选择机构:</Text>
                <Select
                  value={selectedBranch}
                  onChange={setSelectedBranch}
                  style={{ flex: 1, maxWidth: '400px' }}
                  placeholder="选择分支机构"
                >
                  {branches.map((branch) => (
                    <Option key={branch.value} value={branch.value}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{branch.label}</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{branch.address}</div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </Col>
          
          <Col xs={24} lg={8} style={{ textAlign: 'right' }}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setShowNewTicketForm(true)}
              size="large"
              style={{ width: '100%', maxWidth: '200px' }}
            >
              新建票据
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="总票据数"
              value={ticketStats.total}
              prefix={<QuestionCircleOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="开放中"
              value={ticketStats.open}
              prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="处理中"
              value={ticketStats.inProgress}
              prefix={<ClockCircleOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card>
            <Statistic
              title="已解决"
              value={ticketStats.resolved}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索和筛选 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={16}>
            <Input.Search
              placeholder="搜索票据..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Space>
              <FilterOutlined style={{ color: '#8c8c8c' }} />
              <Select
                value={filterStatus}
                onChange={setFilterStatus}
                style={{ width: 150 }}
              >
                {TICKET_STATUS_OPTIONS.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 票据列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} hoverable>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  {getStatusIcon(ticket.status)}
                  <Title level={4} style={{ margin: 0 }}>
                    #{ticket.id} - {ticket.title}
                  </Title>
                  <Space>
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                  </Space>
                </div>
                
                <Text type="secondary" style={{ marginBottom: '12px', display: 'block' }}>
                  {ticket.description}
                </Text>
                
                <Space split={<span style={{ color: '#d9d9d9' }}>|</span>}>
                  <Text type="secondary">
                    类别: {TICKET_CATEGORIES.find(c => c.value === ticket.category)?.label}
                  </Text>
                  <Text type="secondary">创建: {ticket.createdAt}</Text>
                  <Text type="secondary">更新: {ticket.updatedAt}</Text>
                  <Space>
                    <MessageOutlined style={{ color: '#8c8c8c' }} />
                    <Text type="secondary">{ticket.responses} 回复</Text>
                  </Space>
                </Space>
              </div>
              
              <Button icon={<EyeOutlined />}>
                查看详情
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '48px 0' }}>
          <QuestionCircleOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
          <Title level={4} type="secondary">暂无票据</Title>
          <Text type="secondary">
            {searchTerm || filterStatus !== 'all' 
              ? '没有找到匹配的票据' 
              : '您还没有创建任何支持票据'}
          </Text>
        </Card>
      )}

      {/* 帮助资源 */}
      <Card style={{ marginTop: '24px', background: '#e6f7ff', border: '1px solid #91d5ff' }}>
        <Title level={4} style={{ color: '#0050b3', marginBottom: '16px' }}>
          帮助资源
        </Title>
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Title level={5} style={{ color: '#0050b3' }}>常见问题</Title>
            <ul style={{ color: '#0050b3', paddingLeft: '20px' }}>
              <li>这个模块是解决</li>
              <li>运营者及员工</li>
              <li>发布时</li>
              <li>所遇到的一些问题</li>
            </ul>
          </Col>
          <Col xs={24} md={12}>
            <Title level={5} style={{ color: '#0050b3' }}>直接联系</Title>
            <ul style={{ color: '#0050b3', paddingLeft: '20px' }}>
              <li>邮箱: support@example.com</li>
              <li>电话: +86 400-123-4567</li>
              <li>微信: support_wechat</li>
              <li>工作时间: 周一至周五 9:00-18:00</li>
            </ul>
          </Col>
        </Row>
      </Card>

      {/* 新建票据弹窗 */}
      <Modal
        title="创建新票据"
        open={showNewTicketForm}
        onCancel={() => {
          setShowNewTicketForm(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateTicket}
        >
          <Form.Item
            name="title"
            label="票据标题"
            rules={[{ required: true, message: '请输入票据标题' }]}
          >
            <Input placeholder="简要描述您的问题或咨询" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="类别"
                initialValue="general"
              >
                <Select>
                  {TICKET_CATEGORIES.map(cat => (
                    <Option key={cat.value} value={cat.value}>
                      {cat.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="priority"
                label="优先级"
                initialValue="medium"
              >
                <Select>
                  {TICKET_PRIORITIES.map(priority => (
                    <Option key={priority.value} value={priority.value}>
                      {priority.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="详细描述"
            rules={[{ required: true, message: '请输入详细描述' }]}
          >
            <TextArea
              rows={4}
              placeholder="详细描述您的问题、咨询或请求。如果是技术问题，请包含重现步骤。"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setShowNewTicketForm(false);
                form.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
                创建票据
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SupportManagement;