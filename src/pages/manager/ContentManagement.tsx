import { useEffect, useState } from 'react';
import { Card, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Typography,
   Modal, 
   Form, 
   Input, 
   Select, 
   message,
  Tabs,
  Row,
  Col,
  Statistic,
  Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { contentApi, type ContentItem, type ContentStatus, type RecruitmentTemplate } from '../../api/manger/contentManagement';
import { FileTextOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { Title , Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ContentManagement = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ContentItem[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 4, total: 0 });
  const [statusFilter, setStatusFilter] = useState<ContentStatus | ''>('');
  const [search, setSearch] = useState('');
  const [detailVisible, setDetailVisible] = useState(false);
  const [current, setCurrent] = useState<ContentItem | null>(null);
  const [createVisible, setCreateVisible] = useState(false);
  const [createForm] = Form.useForm();


  // 新增状态
  const [templateLoading, setTemplateLoading] = useState(false);
  const [templates, setTemplates] = useState<RecruitmentTemplate[]>([]);
  const [templatePagination, setTemplatePagination] = useState({ current: 1, pageSize: 6, total: 0 });
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategory, setTemplateCategory] = useState('');
  const [templateCreateVisible, setTemplateCreateVisible] = useState(false);
  const [templateEditVisible, setTemplateEditVisible] = useState(false);
  const [templateDetailVisible, setTemplateDetailVisible] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<RecruitmentTemplate | null>(null);
  const [templateForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState('content');
//获取内容列表
  const fetchList = async (page = 1, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const res = await contentApi.getContents({ page, pageSize, search, status: statusFilter });
      setData(res.data);
      setPagination(prev => ({ ...prev, current: page, pageSize, total: res.total }));
    } catch {
      message.error('获取内容列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 新增函数
  const fetchTemplates = async (page = 1, pageSize = templatePagination.pageSize) => {
    setTemplateLoading(true);
    try {
      const res = await contentApi.getTemplates({ 
        page, 
        pageSize, 
        search: templateSearch, 
        category: templateCategory 
      });
      setTemplates(res.data);
      setTemplatePagination(prev => ({ ...prev, current: page, pageSize, total: res.total }));
    } catch {
      message.error('获取模板列表失败');
    } finally {
      setTemplateLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const values = await templateForm.validateFields();
      const ok = await contentApi.createTemplate({
        name: values.name,
        description: values.description,
        content: values.content,
        category: values.category,
        createdBy: '管理员'
      });
      if (ok) {
        message.success('模板创建成功');
        setTemplateCreateVisible(false);
        templateForm.resetFields();
        fetchTemplates(1, templatePagination.pageSize);
      }
    } catch {
      message.error('创建模板失败');
    }
  };

  const handleEditTemplate = async () => {
    if (!currentTemplate) return;
    try {
      const values = await templateForm.validateFields();
      const ok = await contentApi.updateTemplate(currentTemplate.id, values);
      if (ok) {
        message.success('模板更新成功');
        setTemplateEditVisible(false);
        setCurrentTemplate(null);
        templateForm.resetFields();
        fetchTemplates(templatePagination.current, templatePagination.pageSize);
      }
    } catch {
      message.error('更新模板失败');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      const ok = await contentApi.deleteTemplate(id);
      if (ok) {
        message.success('模板删除成功');
        fetchTemplates(templatePagination.current, templatePagination.pageSize);
      }
    } catch {
      message.error('删除模板失败');
    }
  };

  const openTemplateDetail = async (id: string) => {
    try {
      const template = await contentApi.getTemplateById(id);
      setCurrentTemplate(template);
      setTemplateDetailVisible(true);
    } catch {
      message.error('获取模板详情失败');
    }
  };

  const openTemplateEdit = async (id: string) => {
    try {
      const template = await contentApi.getTemplateById(id);
      setCurrentTemplate(template);
      templateForm.setFieldsValue(template);
      setTemplateEditVisible(true);
    } catch {
      message.error('获取模板信息失败');
    }
  };

  const openTemplateCreate = () => {
    setTemplateCreateVisible(true);
    templateForm.resetFields();
  };

  const openTemplateCreateFromExisting = async (id: string) => {
    try {
      const template = await contentApi.getTemplateById(id);
      setCurrentTemplate(template);
      templateForm.setFieldsValue({
        name: `${template.name} - 副本`,
        description: template.description,
        content: template.content,
        category: template.category
      });
      setTemplateCreateVisible(true);
    } catch {
      message.error('获取模板信息失败');
    }
  };

  // 模板表格列定义
  const templateColumns: ColumnsType<RecruitmentTemplate> = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '使用次数',
      dataIndex: 'usageCount',
      key: 'usageCount',
      render: (count) => <Text type="secondary">{count} 次</Text>
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => openTemplateDetail(record.id)}
            style={{ color: '#69b1ff' }}
          >
            查看
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => openTemplateEdit(record.id)}
            style={{ color: '#69b1ff' }}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            onClick={() => openTemplateCreateFromExisting(record.id)}
            style={{ color: '#69b1ff' }}
          >
            复制
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个模板吗？"
            onConfirm={() => handleDeleteTemplate(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  useEffect(() => { fetchList(1, pagination.pageSize); 
    // fetchTemplates(1, templatePagination.pageSize);
  }, []);

  useEffect(() => {
    if (activeTab === 'template') {
      fetchTemplates(1, templatePagination.pageSize);
    }
  }, [activeTab]);

  const onSearch = async () => {
    fetchList(1, pagination.pageSize);
  };

  const handleReviewAction = async (record: ContentItem, action: 'publish' | 'reject' | 'offline') => {
    let target: ContentStatus = record.status;
    if (action === 'publish') target = '已发布';
    if (action === 'reject') target = '待审核';
    if (action === 'offline') target = '已下架';
    try {
      const ok = await contentApi.updateContentStatus(record.id, target);
      if (ok) {
        message.success('操作成功');
        fetchList(pagination.current, pagination.pageSize);
      }
    } catch {
      message.error('操作失败');
    }
  };

  const openDetail = async (id: string) => {
    try {
      const item = await contentApi.getContentById(id);
      setCurrent(item);
      setDetailVisible(true);
    } catch {
      message.error('获取详情失败');
    }
  };

  const columns: ColumnsType<ContentItem> = [
    { title: '岗位', dataIndex: 'title', key: 'title' },
    { title: '发布者', dataIndex: 'authorName', key: 'authorName' },
    {
      title: '状态', dataIndex: 'status', key: 'status',
      render: (s: ContentStatus) => {
        const color = s === '待审核' ? 'orange' : s === '已发布' ? 'green' : 'red';
        return <Tag color={color}>{s}</Tag>;
      },
      filters: [
        { text: '待审核', value: '待审核' },
        { text: '已发布', value: '已发布' },
        { text: '已下架', value: '已下架' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
    {
      title: '操作', key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" style={{ color: '#69b1ff' }} onClick={() => openDetail(record.id)}>查看</Button>
          {record.status !== '已发布' && (
            <Button type="link" style={{ color: '#69b1ff' }} onClick={() => handleReviewAction(record, 'publish')}>发布</Button>
          )}
          {record.status !== '待审核' && (
            <Button type="link" style={{ color: '#69b1ff' }} onClick={() => handleReviewAction(record, 'reject')}>退回</Button>
          )}
          {record.status !== '已下架' && (
            <Button type="link" danger onClick={() => handleReviewAction(record, 'offline')}>下架</Button>
          )}
        </Space>
      )
    }
  ];

  const onTableChange = (p: any) => {
    fetchList(p.current, p.pageSize);
  };

  const openCreate = () => {
    setCreateVisible(true);
    createForm.resetFields();
  };

  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();
      const ok = await contentApi.createContent({
        title: values.title,
        body: values.body,
        status: '待审核',
        authorId: values.authorId || '0',
        authorName: values.authorName || '管理员',
      } as any);
      if (ok) {
        message.success('创建成功');
        setCreateVisible(false);
        fetchList(1, pagination.pageSize);
      }
    } catch {}
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>内容管理</Title>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          {
            key: 'content',
            label: '岗位发布',
            children: (
              <div>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Input.Search 
                      allowClear 
                      placeholder="搜索标题/作者" 
                      onSearch={() => onSearch()} 
                      onChange={(e) => setSearch(e.target.value)} 
                      style={{ width: 240 }} 
                    />
                    <Select 
                      allowClear 
                      placeholder="状态" 
                      style={{ width: 140 }} 
                      value={statusFilter || undefined} 
                      onChange={(v) => setStatusFilter((v as ContentStatus) || '')}
                    >
                      <Option value="待审核">待审核</Option>
                      <Option value="已发布">已发布</Option>
                      <Option value="已下架">已下架</Option>
                    </Select>
                    <Button type="link" onClick={() => fetchList(1, pagination.pageSize)} style={{ color: '#69b1ff' }}>筛选</Button>
                    <Button type="link" onClick={openCreate} style={{ color: '#69b1ff' }}>发布新内容</Button>
                  </Space>
                </div>

                <Card>
                  <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    pagination={{ 
                      ...pagination, 
                      showSizeChanger: false,
                      showTotal: (total, range) => 
                        `第 ${range[0]}-${range[1]} 条/共 ${total} 条，共 ${Math.ceil(total / pagination.pageSize)} 页`,
                    }}
                    onChange={onTableChange}
                  />
                </Card>
              </div>
            )
          },
          {
            key: 'template',
            label: '模板规划',
            children: (
              <div>
                {/* 模板统计卡片 */}
                <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                  <Col xs={24} sm={8}>
                    <Card>
                      <Statistic
                        title="模板总数"
                        value={templatePagination.total}
                        prefix={<FileTextOutlined />}
                        valueStyle={{ color: '#1677ff' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card>
                      <Statistic
                        title="本月使用"
                        value={templates.reduce((sum, t) => sum + t.usageCount, 0)}
                        prefix={<FileTextOutlined />}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card>
                      <Statistic
                        title="分类数量"
                        value={new Set(templates.map(t => t.category)).size}
                        prefix={<FileTextOutlined />}
                        valueStyle={{ color: '#722ed1' }}
                      />
                    </Card>
                  </Col>
                </Row>

                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Input.Search 
                      allowClear 
                      placeholder="搜索模板名称/描述" 
                      onSearch={() => onSearch()} 
                      onChange={(e) => setTemplateSearch(e.target.value)} 
                      style={{ width: 240 }} 
                    />
                    <Select 
                      allowClear 
                      placeholder="分类" 
                      style={{ width: 140 }} 
                      value={templateCategory || undefined} 
                      onChange={(v) => setTemplateCategory(v || '')}
                    >
                      <Option value="技术类">技术类</Option>
                      <Option value="销售类">销售类</Option>
                      <Option value="管理类">管理类</Option>
                      <Option value="其他">其他</Option>
                    </Select>
                    <Button type="link" onClick={() => fetchTemplates(1, templatePagination.pageSize)} style={{ color: '#69b1ff' }}>筛选</Button>
                    <Button 
                      type="link" 
                      icon={<PlusOutlined />}
                      onClick={openTemplateCreate} 
                      style={{ color: '#69b1ff' }}
                    >
                      创建模板
                    </Button>
                  </Space>
                </div>

                <Card>
                  <Table
                    rowKey="id"
                    columns={templateColumns}
                    dataSource={templates}
                    loading={templateLoading}
                    pagination={{ 
                      ...templatePagination, 
                      showSizeChanger: false,
                      showTotal: (total, range) => 
                        `第 ${range[0]}-${range[1]} 条/共 ${total} 条，共 ${Math.ceil(total / templatePagination.pageSize)} 页`,
                    }}
                    onChange={onTableChange}
                  />
                </Card>
              </div>
            )
          }
        ]}
      />

      {/* 原有模态框保持不变 */}
      <Modal title="内容详情" open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} width={720}>
        {current && (
          <div>
            <Title level={5}>{current.title}</Title>
            <div style={{ marginBottom: 8 }}>
              <Space>
                <Tag>{current.status}</Tag>
                <Text type="secondary">作者：{current.authorName}</Text>
                <Text type="secondary">创建：{current.createdAt}</Text>
                <Text type="secondary">更新：{current.updatedAt}</Text>
              </Space>
            </div>
            <Card size="small">
              <div style={{ whiteSpace: 'pre-wrap' }}>{current.body}</div>
            </Card>
          </div>
        )}
      </Modal>

      <Modal title="发布内容" open={createVisible} onCancel={() => setCreateVisible(false)} onOk={handleCreate} okButtonProps={{ type: 'default' }}>
        <Form form={createForm} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="authorName" label="作者">
            <Input />
          </Form.Item>
          <Form.Item name="body" label="正文" rules={[{ required: true }]}>
            <Input.TextArea rows={6} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal 
        title="创建模板" 
        open={templateCreateVisible} 
        onCancel={() => setTemplateCreateVisible(false)} 
        onOk={handleCreateTemplate}
        okButtonProps={{ type: 'default' }}
        width={800}
      >
        <Form form={templateForm} layout="vertical">
          <Form.Item name="name" label="模板名称" rules={[{ required: true }]}>
            <Input placeholder="请输入模板名称" />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true }]}>
            <Select placeholder="请选择分类">
              <Option value="技术类">技术类</Option>
              <Option value="销售类">销售类</Option>
              <Option value="管理类">管理类</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="模板描述" rules={[{ required: true }]}>
            <Input placeholder="请输入模板描述" />
          </Form.Item>
          <Form.Item name="content" label="模板内容" rules={[{ required: true }]}>
            <TextArea rows={12} placeholder="请输入模板内容，支持换行" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal 
        title="编辑模板" 
        open={templateEditVisible} 
        onCancel={() => setTemplateEditVisible(false)} 
        onOk={handleEditTemplate}
        okButtonProps={{ type: 'default' }}
        width={800}
      >
        <Form form={templateForm} layout="vertical">
          <Form.Item name="name" label="模板名称" rules={[{ required: true }]}>
            <Input placeholder="请输入模板名称" />
          </Form.Item>
          <Form.Item name="category" label="分类" rules={[{ required: true }]}>
            <Select placeholder="请选择分类">
              <Option value="技术类">技术类</Option>
              <Option value="销售类">销售类</Option>
              <Option value="管理类">管理类</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="模板描述" rules={[{ required: true }]}>
            <Input placeholder="请输入模板描述" />
          </Form.Item>
          <Form.Item name="content" label="模板内容" rules={[{ required: true }]}>
            <TextArea rows={12} placeholder="请输入模板内容，支持换行" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal 
        title="模板详情" 
        open={templateDetailVisible} 
        onCancel={() => setTemplateDetailVisible(false)} 
        footer={null}
        width={800}
      >
        {currentTemplate && (
          <div>
            <Title level={5}>{currentTemplate.name}</Title>
            <div style={{ marginBottom: 16 }}>
              <Space wrap>
                <Tag color="blue">{currentTemplate.category}</Tag>
                <Text type="secondary">使用次数：{currentTemplate.usageCount}</Text>
                <Text type="secondary">创建时间：{new Date(currentTemplate.createdAt).toLocaleString()}</Text>
                <Text type="secondary">更新时间：{new Date(currentTemplate.updatedAt).toLocaleString()}</Text>
              </Space>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>模板描述：</Text>
              <div style={{ marginTop: 8 }}>{currentTemplate.description}</div>
            </div>
            <Card size="small" title="模板内容">
              <div style={{ whiteSpace: 'pre-wrap' }}>{currentTemplate.content}</div>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContentManagement;


