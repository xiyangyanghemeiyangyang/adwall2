import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Descriptions, 
  Tabs, 
  Table, 
  Button, 
  Tag, 
  Typography, 
  Row, 
  Col,
  Statistic,
  Space,
  message,
  Modal,
  Form,
  Input,
  Select,
  DatePicker
} from 'antd';
import { 
  ArrowLeftOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  CalendarOutlined,
  PlusOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { customerApi, type Customer, type FollowUpRecord, type Task, type CustomerStats } from '../api/customerData';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [followUpRecords, setFollowUpRecords] = useState<FollowUpRecord[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [followUpModalVisible, setFollowUpModalVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [addTagModalVisible, setAddTagModalVisible] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [form] = Form.useForm();
  const [taskForm] = Form.useForm();
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);
  const [purchaseForm] = Form.useForm();

  // 获取客户详情
  const fetchCustomerDetail = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [customerData, followUpData, tasksData, statsData] = await Promise.all([
        customerApi.getCustomerById(id),
        customerApi.getFollowUpRecords(id),
        customerApi.getTasks(id),
        customerApi.getCustomerStats(id).catch(() => null)
      ]);
      
      setCustomer(customerData);
      setFollowUpRecords(followUpData);
      setTasks(tasksData);
      setStats(statsData);
    } catch (error) {
      message.error('获取客户详情失败');
      navigate('/customer-management');
    } finally {
      setLoading(false);
    }
  };
  // 添加标签
  const handleConfirmAddTag = async () => {
    const value = newTag.trim();
    if (!value) {
      message.warning('请输入标签');
      return;
    }
    try {
      const existing = customer?.tags || [];
      const nextTags = Array.from(new Set([...(existing), value]));
      await customerApi.updateCustomer(customer!.id, { tags: nextTags });
      message.success('标签已添加');
      setAddTagModalVisible(false);
      setNewTag('');
      fetchCustomerDetail();
    } catch (error) {
      message.error('添加标签失败');
    }
  };


  useEffect(() => {
    fetchCustomerDetail();
  }, [id]);

  // 添加跟进记录
  const handleAddFollowUp = async () => {
    try {
      const values = await form.validateFields();
      await customerApi.addFollowUpRecord({
        customerId: id!,
        type: values.type,
        content: values.content,
        result: values.result || '',
        nextAction: values.nextAction || '',
        createBy: customer?.assignedTo || '系统',
      });
      message.success('跟进记录添加成功');
      setFollowUpModalVisible(false);
      form.resetFields();
      fetchCustomerDetail();
    } catch (error) {
      message.error('添加跟进记录失败');
    }
  };

  // 添加任务
  const handleAddTask = async () => {
    try {
      const values = await taskForm.validateFields();
      const dueDateValue = values.dueDate;
      const dueDate = dueDateValue?.format ? dueDateValue.format('YYYY-MM-DD') : new Date(dueDateValue).toISOString().slice(0, 10);
      await customerApi.addTask({
        customerId: id!,
        title: values.title,
        description: values.description || '',
        type: values.type,
        priority: values.priority,
        status: '待处理',
        assignedTo: values.assignedTo,
        dueDate,
      });
      message.success('任务添加成功');
      setTaskModalVisible(false);
      taskForm.resetFields();
      fetchCustomerDetail();
    } catch (error) {
      message.error('添加任务失败');
    }
  };

  // 添加购买记录
  const handleAddPurchase = async () => {
    try {
      const values = await purchaseForm.validateFields();
      const dateValue = values.date;
      const date = dateValue?.format ? dateValue.format('YYYY-MM-DD') : new Date(dateValue).toISOString().slice(0, 10);
      await customerApi.addPurchase(id!, {
        product: values.product,
        amount: Number(values.amount),
        date
      });
      message.success('购买记录添加成功');
      setPurchaseModalVisible(false);
      purchaseForm.resetFields();
      fetchCustomerDetail();
    } catch (error) {
      message.error('添加购买记录失败');
    }
  };

  // 跟进记录表格列
  const followUpColumns: ColumnsType<FollowUpRecord> = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const colorMap: Record<string, string> = {
          '电话': 'blue',
          '邮件': 'green',
          '会议': 'orange',
          '微信': 'purple',
          '其他': 'default'
        };
        return <Tag color={colorMap[type]}>{type}</Tag>;
      }
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true
    },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      ellipsis: true
    },
    {
      title: '下一步行动',
      dataIndex: 'nextAction',
      key: 'nextAction',
      ellipsis: true
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      key: 'createBy'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => new Date(text).toLocaleString('zh-CN')
    }
  ];

  // 任务表格列
  const taskColumns: ColumnsType<Task> = [
    {
      title: '任务标题',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        const colorMap: Record<string, string> = {
          '高': 'red',
          '中': 'orange',
          '低': 'green'
        };
        return <Tag color={colorMap[priority]}>{priority}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap: Record<string, string> = {
          '待处理': 'default',
          '进行中': 'processing',
          '已完成': 'success',
          '已取消': 'error'
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      }
    },
    {
      title: '负责人',
      dataIndex: 'assignedTo',
      key: 'assignedTo'
    },
    {
      title: '截止时间',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text) => new Date(text).toLocaleDateString('zh-CN')
    }
  ];

  if (loading) {
    return <div>加载中...</div>;
  }

  if (!customer) {
    return <div>客户不存在</div>;
  }

  return (
    <div className="customer-detail">
      {/* 页面头部 */}
      <div style={{ marginBottom: '24px' }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/customer-management')}
          style={{ marginBottom: '16px' }}
        >
          返回客户列表
        </Button>
        <Title level={4}>{customer.name} - 客户详情</Title>
      </div>

      {/* 客户基本信息 */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Descriptions title="基本信息" bordered column={2}>
              <Descriptions.Item label="客户姓名">{customer.name}</Descriptions.Item>
              <Descriptions.Item label="联系电话">
                <Space>
                  <PhoneOutlined />
                  {customer.phone}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="邮箱地址">
                <Space>
                  <MailOutlined />
                  {customer.email}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="所属公司">{customer.company}</Descriptions.Item>
              <Descriptions.Item label="所属行业">{customer.industry}</Descriptions.Item>
              <Descriptions.Item label="推广区域">{customer.region}</Descriptions.Item>
              <Descriptions.Item label="合同状态">
                <Tag color={
                  customer.contractStatus === '未签约' ? 'default' :
                  customer.contractStatus === '已签约' ? 'green' :
                  customer.contractStatus === '续约中' ? 'orange' : 'red'
                }>
                  {customer.contractStatus}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="账户状态">
                <Tag color={customer.status === '正常' ? 'green' : 'red'}>
                  {customer.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="负责人">{customer.assignedTo}</Descriptions.Item>
              <Descriptions.Item label="创建时间" span={2}>
                <Space>
                  <CalendarOutlined />
                  {new Date(customer.createTime).toLocaleString('zh-CN')}
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="推广权限" size="small">
              <Space wrap>
                {(customer.permissions || []).map(permission => (
                  <Tag key={permission} color="blue">{permission}</Tag>
                ))}
              </Space>
            </Card>
            {/* 添加标签 */}
            <Card title="客户标签" size="small" style={{ marginTop: '16px' }} extra={<Button type="link" onClick={() => setAddTagModalVisible(true)} style={{ padding: 0 }}>＋</Button>}>
              <Space wrap>
                {(customer.tags || []).map(tag => (
                  <Tag key={tag} color="green">{tag}</Tag>
                ))}
              </Space>
            </Card>
            {stats && (
              <Card title="数据统计" size="small" style={{ marginTop: '16px' }}>
                <Statistic
                  title="登录次数"
                  value={stats.loginCount}
                  prefix={<UserOutlined />}
                />
                <Statistic
                  title="互动次数"
                  value={stats.interactionCount}
                  prefix={<UserOutlined />}
                  style={{ marginTop: '16px' }}
                />
                <div style={{ marginTop: '16px' }}>
                  <Text type="secondary">最后登录：</Text>
                  <br />
                  <Text>{new Date(stats.lastLoginTime).toLocaleString('zh-CN')}</Text>
                </div>
              </Card>
            )}
          </Col>
        </Row>
      </Card>

      {/* 详细信息标签页 */}
      <Card>
        <Tabs defaultActiveKey="followUp">
          <TabPane tab="跟进记录" key="followUp">
            <div style={{ marginBottom: '16px' }}>
              <Button 
                type="link"
                style={{ color: '#69b1ff' }}
                icon={<PlusOutlined style={{ color: '#69b1ff' }} />}
                onClick={() => setFollowUpModalVisible(true)}
              >
                添加跟进记录
              </Button>
            </div>
            <Table
              columns={followUpColumns}
              dataSource={followUpRecords}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </TabPane>
          
          <TabPane tab="任务管理" key="tasks">
            <div style={{ marginBottom: '16px' }}>
              <Button 
                type="link"
                style={{ color: '#69b1ff' }}
                icon={<PlusOutlined style={{ color: '#69b1ff' }} />}
                onClick={() => setTaskModalVisible(true)}
              >
                添加任务
              </Button>
            </div>
            <Table
              columns={taskColumns}
              dataSource={tasks}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </TabPane>
          
          <TabPane tab="购买历史" key="purchase">
            <div style={{ marginBottom: '16px' }}>
              <Button 
                type="link"
                style={{ color: '#69b1ff' }}
                icon={<PlusOutlined style={{ color: '#69b1ff' }} />}
                onClick={() => setPurchaseModalVisible(true)}
              >
                添加购买
              </Button>
            </div>
            {stats && stats.purchaseHistory.length > 0 ? (
              <Table
                dataSource={stats.purchaseHistory}
                rowKey="product"
                pagination={false}
                size="small"
                columns={[
                  { title: '产品名称', dataIndex: 'product', key: 'product' },
                  { title: '金额', dataIndex: 'amount', key: 'amount', render: (amount) => `¥${amount.toLocaleString()}` },
                  { title: '购买日期', dataIndex: 'date', key: 'date' }
                ]}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                暂无购买记录
              </div>
            )}
          </TabPane>
        </Tabs>
      </Card>

      {/* 添加跟进记录模态框 */}
      <Modal
        title="添加跟进记录"
        open={followUpModalVisible}
        onCancel={() => setFollowUpModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddFollowUp} layout="vertical">
          <Form.Item name="type" label="跟进类型" rules={[{ required: true }]}>
            <Select>
              <Option value="电话">电话</Option>
              <Option value="邮件">邮件</Option>
              <Option value="会议">会议</Option>
              <Option value="微信">微信</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item name="content" label="跟进内容" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item name="result" label="跟进结果">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="nextAction" label="下一步行动">
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="link" htmlType="submit" style={{ color: '#69b1ff' }}>
                保存
              </Button>
              <Button onClick={() => setFollowUpModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加标签模态框 */}
      <Modal
        title="添加标签"
        open={addTagModalVisible}
        onCancel={() => { setAddTagModalVisible(false); setNewTag(''); }}
        onOk={handleConfirmAddTag}
        okText="添加"
        cancelText="取消"
        okButtonProps={{ type: 'default' }}
      >
        <Input
          placeholder="请输入新标签"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onPressEnter={handleConfirmAddTag}
        />
      </Modal>

      {/* 添加任务模态框 */}
      <Modal
        title="添加任务"
        open={taskModalVisible}
        onCancel={() => setTaskModalVisible(false)}
        footer={null}
      >
        <Form form={taskForm} onFinish={handleAddTask} layout="vertical">
          <Form.Item name="title" label="任务标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="任务描述">
            <TextArea rows={3} />
          </Form.Item>
          <Form.Item name="type" label="任务类型" rules={[{ required: true }]}>
            <Select>
              <Option value="联系客户">联系客户</Option>
              <Option value="发送报价">发送报价</Option>
              <Option value="发送合同">发送合同</Option>
              <Option value="跟进回访">跟进回访</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item name="priority" label="优先级" rules={[{ required: true }]}>
            <Select>
              <Option value="高">高</Option>
              <Option value="中">中</Option>
              <Option value="低">低</Option>
            </Select>
          </Form.Item>
          <Form.Item name="assignedTo" label="负责人" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="dueDate" label="截止时间" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="link" htmlType="submit" style={{ color: '#69b1ff' }}>
                保存
              </Button>
              <Button onClick={() => setTaskModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 添加购买模态框 */}
      <Modal
        title="添加购买"
        open={purchaseModalVisible}
        onCancel={() => setPurchaseModalVisible(false)}
        footer={null}
      >
        <Form form={purchaseForm} onFinish={handleAddPurchase} layout="vertical">
          <Form.Item name="product" label="产品名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="amount" label="金额" rules={[{ required: true }]}>
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item name="date" label="购买日期" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="link" htmlType="submit" style={{ color: '#69b1ff' }}>
                保存
              </Button>
              <Button onClick={() => setPurchaseModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerDetail;
