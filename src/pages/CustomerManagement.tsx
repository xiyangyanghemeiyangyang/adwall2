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
  Modal,
  Popconfirm,//注销账户更改的引入
  Form,
  Checkbox
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EyeOutlined, 
  EditOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { customerApi, type Customer } from '../api/customerData';

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const CustomerManagement = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 4,
    total: 0
  });
  const [searchText, setSearchText] = useState('');
  const [contractStatusFilter, setContractStatusFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchActive, setSearchActive] = useState(false);
  const [editActiveId, setEditActiveId] = useState<string | null>(null);
  
  
  // 新增/编辑客户模态框
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm();

  // 获取客户列表
  const fetchCustomers = async (page = 1, pageSize = 10, search = '', contractStatus = '', status = '') => {
    setLoading(true);
    try {
      const result = await customerApi.getCustomers({
        page,
        pageSize,
        search,
        contractStatus,
        status
      });
      
      setCustomers(result.data);
      setPagination(prev => ({
        ...prev,
        current: page,
        total: result.total
      }));
    } catch (error) {
      message.error('获取员工列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
     fetchCustomers(pagination.current, pagination.pageSize, searchText, contractStatusFilter, statusFilter);
      }, []);

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchCustomers(1, pagination.pageSize, value, contractStatusFilter, statusFilter);
  };

  // 处理合同状态筛选
  const handleContractStatusFilter = (value: string) => {
    setContractStatusFilter(value);
    fetchCustomers(1, pagination.pageSize, searchText, value, statusFilter);
  };

  // 处理状态筛选
  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    fetchCustomers(1, pagination.pageSize, searchText, contractStatusFilter, value);
  };

  // 处理表格分页
  const handleTableChange = (pagination: any) => {
    fetchCustomers(pagination.current, pagination.pageSize, searchText, contractStatusFilter, statusFilter);
  };

  // 查看客户详情
  const handleViewCustomer = (customerId: string) => {
    navigate(`/customer-management/${customerId}`);
  };

  // 新增客户
  const handleAddCustomer = () => {
    setEditingCustomer(null);
    form.resetFields();
    setModalVisible(true);
  };

  // （移除快速添加模拟客户，统一走表单手动新增）

  // 编辑客户
  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue({
      ...customer,
      permissions: customer.permissions
    });
    setModalVisible(true);
  };

  // 保存客户
  const handleSaveCustomer = async (values: any) => {
    try {
      if (editingCustomer) {
        const ok = await customerApi.updateCustomer(editingCustomer.id, values);
        if (!ok) throw new Error('更新失败');
        message.success('员工信息更新成功');
      } else {
        const ok = await customerApi.addCustomer(values);
        if (!ok) throw new Error('新增失败');
        message.success('员工添加成功');
      }
      setModalVisible(false);
      form.resetFields();
      fetchCustomers(pagination.current, pagination.pageSize, searchText, contractStatusFilter, statusFilter);
    } catch (error) {
      message.error('保存员工信息失败');
    }
  };

  // 注销账户
  const handleDeleteCustomer = async (customer: Customer) => {
    try {
      await customerApi.updateCustomerStatus(customer.id, '注销');
      message.success('员工账户已注销');
      fetchCustomers(pagination.current, pagination.pageSize, searchText, contractStatusFilter, statusFilter);
    } catch (error) {
      message.error('注销员工账户失败');
    }
  };

    // 基于 company 的稳定配色（同名公司固定同一颜色）
    const tagColors = ['#1677ff', '#ff4d4f', '#52c41a', '#fa8c16', '#722ed1', '#13c2c2', '#2f54eb', '#eb2f96'];
    const bgColors  = ['#E6F4FF', '#FFF1F0', '#F6FFED', '#FFF7E6', '#F9F0FF', '#E6FFFB', '#F0F5FF', '#FFF0F6'];
  
    const companyColorIndex = (name: string) => {
      let h = 0;
      for (let i = 0; i < name.length; i++) h = (h << 5) - h + name.charCodeAt(i);
      return Math.abs(h) % tagColors.length;
    };
    const getTagColor = (name: string) => tagColors[companyColorIndex(name)];
    const getBgColor  = (name: string) => bgColors[companyColorIndex(name)];

    // 表格列定义
    const companySpan = (() => {
      const map: Record<string, { firstIndex: number; count: number }> = {};
      customers.forEach((c, idx) => {
        if (!map[c.company]) map[c.company] = { firstIndex: idx, count: 0 };
        map[c.company].count += 1;
      });
      return map;
    })();
  
    const columns: ColumnsType<Customer> = [
      {
        title: '部门',
        dataIndex: 'company',
        key: 'company',
        onCell: (record, index) => {
          <Tag color={getTagColor(record.company)}>{record.company}</Tag>
          const info = companySpan[record.company];
          if (!info) return {};
          if (index === info.firstIndex) {
            return { rowSpan: info.count };
          }
          return { rowSpan: 0 };
        },
      },
      {
        title: '员工名称',
        dataIndex: 'name',
        key: 'name',
        render: (text) => (
          <div>
            <div style={{ fontWeight: 'bold' }}>{text}</div>
          </div>
        ),
      },
    {
      title: '推广区域',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: '联系方式',
      key: 'contact',
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: '4px' }}>
            <PhoneOutlined style={{ marginRight: '4px' }} />
            {record.phone}
          </div>
          <div>
            <MailOutlined style={{ marginRight: '4px' }} />
            {record.email}
          </div>
        </div>
      ),
    },
    {
      title: '合同状态',
      dataIndex: 'contractStatus',
      key: 'contractStatus',
      render: (status: Customer['contractStatus']) => {
        const colorMap: Record<string, string> = {
          '未签约': 'default',
          '已签约': 'green',
          '续约中': 'orange',
          '已到期': 'red',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
      filters: [
        { text: '未签约', value: '未签约' },
        { text: '已签约', value: '已签约' },
        { text: '续约中', value: '续约中' },
        { text: '已到期', value: '已到期' },
      ],
      onFilter: (value, record) => record.contractStatus === value,
    },
    {
      title: '推广权限',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: string[]) => (
        <Space wrap>
          {permissions.map(permission => (
            <Tag key={permission} color="blue">
              {permission}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '账户状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: Customer['status']) => {
        const colorMap: Record<string, string> = {
          '正常': 'green',
          '注销': 'red',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
      filters: [
        { text: '正常', value: '正常' },
        { text: '注销', value: '注销' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewCustomer(record.id)}
          >
            查看详情
          </Button>
          <Button 
            type="link" 
            icon={
              <EditOutlined 
                style={{ color: editActiveId === record.id ? '#1677ff' : '#69b1ff' }}
              />
            }
            onMouseDown={() => setEditActiveId(record.id)}
            onMouseUp={() => setEditActiveId(null)}
            onMouseLeave={() => setEditActiveId(null)}
            onClick={() => handleEditCustomer(record)}
          >
            编辑
          </Button>
          {record.status === '正常' && (
            <Popconfirm
              title="确认注销"
              description={`确定要注销员工"${record.name}"的账户吗？`}
              okText="确认"
              cancelText="取消"
              // 按钮样式的更改
              okButtonProps={{ type: 'link', style: { color: '#69b1ff' } }}
              onConfirm={() => handleDeleteCustomer(record)}
            >
              <Button 
                type="link" 
                danger
                icon={<DeleteOutlined />} 
              >
                注销账户
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // 统计数据
  const getStatistics = () => {
    const total = customers.length;
    const signed = customers.filter(c => c.contractStatus === '已签约').length;
    const pending = customers.filter(c => c.contractStatus === '未签约').length;
    const active = customers.filter(c => c.status === '正常').length;
    
    return { total, signed, pending, active };
  };

  const stats = getStatistics();

  return (
    <div className="customer-management">
      <div style={{ marginBottom: '24px' }}>
        <Title level={4}>员工管理</Title>
      </div>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="员工总数"
              value={stats.total}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已签约"
              value={stats.signed}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="未签约"
              value={stats.pending}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="正常账户"
              value={stats.active}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索和筛选 */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Search
              placeholder="搜索员工姓名、公司、电话或区域"
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
              placeholder="合同状态"
              allowClear
              style={{ width: '100%' }}
              value={contractStatusFilter || undefined}
              onChange={handleContractStatusFilter}
            >
              <Option value="未签约">未签约</Option>
              <Option value="已签约">已签约</Option>
              <Option value="续约中">续约中</Option>
              <Option value="已到期">已到期</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Select
              placeholder="账户状态"
              allowClear
              style={{ width: '100%' }}
              value={statusFilter || undefined}
              onChange={handleStatusFilter}
            >
              <Option value="正常">正常</Option>
              <Option value="注销">注销</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={10} style={{ textAlign: 'right' }}>
            <Button type="link" style={{ color: '#69b1ff' }} icon={<PlusOutlined style={{ color: '#69b1ff' }} />} onClick={handleAddCustomer}>
              添加员工
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 员工列表表格 */}
      <Card>
      <Table
          columns={columns}
          dataSource={customers}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条，共 ${Math.ceil(total / pagination.pageSize)} 页`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
          onRow={(record) => ({
            style: { backgroundColor: getBgColor(record.company) }
          })}
        />
      </Card>

      {/* 新增/编辑客户模态框 */}
      <Modal
        title={editingCustomer ? '编辑员工' : '新增员工'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} onFinish={handleSaveCustomer} layout="vertical" initialValues={{ status: '正常', permissions: [] }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="员工姓名" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="联系电话" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="email" label="邮箱地址" rules={[{ required: true, type: 'email' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="company" label="所属部门" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="industry" label="投放岗位" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="region" label="推广区域" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="contractStatus" label="合同状态" rules={[{ required: true }]}>
                <Select>
                  <Option value="未签约">未签约</Option>
                  <Option value="已签约">已签约</Option>
                  <Option value="续约中">续约中</Option>
                  <Option value="已到期">已到期</Option>
                </Select>
              </Form.Item>
            </Col>
            
          </Row>

          <Form.Item name="permissions" label="推广权限">
            <Checkbox.Group>
              <Checkbox value="城市推广">城市推广</Checkbox>
              <Checkbox value="区域推广">区域推广</Checkbox>
              <Checkbox value="单元推广">单元推广</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item name="status" label="账户状态" rules={[{ required: true }]}> 
            <Select>
              <Option value="正常">正常</Option>
              <Option value="注销">注销</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              {editingCustomer ? (
                <Button type="link" htmlType="submit" style={{ color: '#69b1ff' }}>
                  更新
                </Button>
              ) : (
                <Button type="link" htmlType="submit" style={{ color: '#69b1ff' }}>保存</Button>
              )}
              <Button type="link" style={{ color: '#69b1ff' }} onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerManagement;
