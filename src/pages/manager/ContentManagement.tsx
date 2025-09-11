import { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Tag, Typography, Modal, Form, Input, Select, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { contentApi, type ContentItem, type ContentStatus } from '../../api/manger/contentManagement';

const { Title, Text } = Typography;
const { Option } = Select;

const ContentManagement = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ContentItem[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 8, total: 0 });
  const [statusFilter, setStatusFilter] = useState<ContentStatus | ''>('');
  const [search, setSearch] = useState('');
  const [detailVisible, setDetailVisible] = useState(false);
  const [current, setCurrent] = useState<ContentItem | null>(null);
  const [createVisible, setCreateVisible] = useState(false);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

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

  useEffect(() => { fetchList(1, pagination.pageSize); }, []);

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
    { title: '标题', dataIndex: 'title', key: 'title' },
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
        <Space>
          <Input.Search allowClear placeholder="搜索标题/作者" onSearch={() => onSearch()} onChange={(e) => setSearch(e.target.value)} style={{ width: 240 }} />
          <Select allowClear placeholder="状态" style={{ width: 140 }} value={statusFilter || undefined} onChange={(v) => setStatusFilter((v as ContentStatus) || '')}>
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
          pagination={{ ...pagination, showSizeChanger: true }}
          onChange={onTableChange}
        />
      </Card>

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
    </div>
  );
};

export default ContentManagement;


