import { useEffect, useState } from 'react';
import { Card, Table, Button, Space, Tag, Typography, Modal, Form, Input, Select, message, Tabs, Row, Col, Statistic, Popconfirm, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { channelApi, type ChannelItem, type ChannelStatus, type ChannelStatsRow } from '../../api/manger/channelManagement';

const { Title, Text } = Typography;
const { Option } = Select;

const formatDateTime = (v?: string) => (v ? new Date(v).toLocaleString() : '-');

const ChannelManagement = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ChannelItem[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 6, total: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ChannelStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');

  const [detailVisible, setDetailVisible] = useState(false);
  const [current, setCurrent] = useState<ChannelItem | null>(null);
  const [createVisible, setCreateVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  // 统计页
  const [statLoading, setStatLoading] = useState(false);
  const [stats, setStats] = useState<ChannelStatsRow[]>([]);
  const [statPagination, setStatPagination] = useState({ current: 1, pageSize: 6, total: 0 });
  const [statSearch, setStatSearch] = useState('');
  const [activeTab, setActiveTab] = useState('list');

  const fetchList = async (page = 1, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      const res = await channelApi.getChannels({
        page, pageSize, search, status: statusFilter, type: typeFilter, platform: platformFilter
      });
      setData(res.data);
      setPagination(prev => ({ ...prev, current: page, pageSize, total: res.total }));
    } catch {
      message.error('获取渠道列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (page = 1, pageSize = statPagination.pageSize) => {
    setStatLoading(true);
    try {
      const res = await channelApi.getChannelStats({ page, pageSize, search: statSearch });
      setStats(res.data);
      setStatPagination(prev => ({ ...prev, current: page, pageSize, total: res.total }));
    } catch {
      message.error('获取渠道数据失败');
    } finally {
      setStatLoading(false);
    }
  };

  useEffect(() => { fetchList(1, pagination.pageSize); }, []);
  useEffect(() => { if (activeTab === 'data') fetchStats(1, statPagination.pageSize); }, [activeTab]);

  const onTableChange = (p: any) => { fetchList(p.current, p.pageSize); };
  const onStatTableChange = (p: any) => { fetchStats(p.current, p.pageSize); };

  const openCreate = () => { setCreateVisible(true); createForm.resetFields(); };
  const handleCreate = async () => {
    try {
      const values = await createForm.validateFields();
      const ok = await channelApi.createChannel({
        name: values.name,
        type: values.type,
        platform: values.platform,
        budget: Number(values.budget) || 0,
        status: values.status,
        description: values.description
      } as any);
      if (ok) {
        message.success('创建成功');
        setCreateVisible(false);
        fetchList(1, pagination.pageSize);
      }
    } catch {}
  };

  const openEdit = (record: ChannelItem) => {
    setCurrent(record);
    form.setFieldsValue(record);
    setEditVisible(true);
  };
  const handleEdit = async () => {
    if (!current) return;
    try {
      const values = await form.validateFields();
      const ok = await channelApi.updateChannel(current.id, {
        ...values,
        budget: Number(values.budget) || 0,
      });
      if (ok) {
        message.success('更新成功');
        setEditVisible(false);
        setCurrent(null);
        fetchList(pagination.current, pagination.pageSize);
      }
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      const ok = await channelApi.deleteChannel(id);
      if (ok) {
        message.success('删除成功');
        fetchList(pagination.current, pagination.pageSize);
      }
    } catch {
      message.error('删除失败');
    }
  };

  const openDetail = (record: ChannelItem) => {
    setCurrent(record);
    setDetailVisible(true);
  };

  const columns: ColumnsType<ChannelItem> = [
    { title: '渠道名称', dataIndex: 'name', key: 'name', render: (t) => <Text strong>{t}</Text> },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '平台', dataIndex: 'platform', key: 'platform' },
    { title: '预算', dataIndex: 'budget', key: 'budget', render: (v) => `¥${Number(v).toLocaleString()}` },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: ChannelStatus) => <Tag color={s === '启用' ? 'green' : 'red'}>{s}</Tag> },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', render: (v) => formatDateTime(v) },
    {
      title: '操作', key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" style={{ color: '#69b1ff' }} onClick={() => openDetail(record)}>查看</Button>
          <Button type="link" style={{ color: '#69b1ff' }} onClick={() => openEdit(record)}>编辑</Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这个渠道吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  const statColumns: ColumnsType<ChannelStatsRow> = [
    { title: '渠道', dataIndex: 'name', key: 'name' },
    { title: '展示量', dataIndex: 'impressions', key: 'impressions' },
    { title: '点击量', dataIndex: 'clicks', key: 'clicks' },
    { title: '转化量', dataIndex: 'conversions', key: 'conversions' },
    { title: '成本(¥)', dataIndex: 'cost', key: 'cost', render: (v) => Number(v).toFixed(2) },
    { title: '收入(¥)', dataIndex: 'revenue', key: 'revenue', render: (v) => Number(v).toFixed(2) },
    { title: 'ROI', dataIndex: 'roi', key: 'roi', render: (v) => Number(v).toFixed(2) },
    { title: '转化率', dataIndex: 'cvr', key: 'cvr', render: (v) => `${(Number(v) * 100).toFixed(2)}%` },
  ];

  const statTotals = stats.reduce((acc, r) => {
    acc.impressions += r.impressions;
    acc.clicks += r.clicks;
    acc.conversions += r.conversions;
    acc.cost += r.cost;
    acc.revenue += r.revenue;
    return acc;
  }, { impressions: 0, clicks: 0, conversions: 0, cost: 0, revenue: 0 });
  const roiAvg = statTotals.cost > 0 ? statTotals.revenue / statTotals.cost : 0;

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>渠道管理</Title>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'list',
            label: '渠道列表',
            children: (
              <div>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Input.Search
                      allowClear
                      placeholder="搜索名称/平台/描述"
                      onSearch={() => fetchList(1, pagination.pageSize)}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ width: 240 }}
                    />
                    <Select
                      allowClear
                      placeholder="状态"
                      style={{ width: 120 }}
                      value={statusFilter || undefined}
                      onChange={(v) => setStatusFilter((v as ChannelStatus) || '')}
                    >
                      <Option value="启用">启用</Option>
                      <Option value="停用">停用</Option>
                    </Select>
                    <Select
                      allowClear
                      placeholder="类型"
                      style={{ width: 140 }}
                      value={typeFilter || undefined}
                      onChange={(v) => setTypeFilter(v || '')}
                    >
                      <Option value="社交媒体">社交媒体</Option>
                      <Option value="广告投放">广告投放</Option>
                      <Option value="内容营销">内容营销</Option>
                      <Option value="其他">其他</Option>
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
                    </Select>
                    <Button type="link" onClick={() => fetchList(1, pagination.pageSize)} style={{ color: '#69b1ff' }}>筛选</Button>
                    <Button type="link" onClick={openCreate} style={{ color: '#69b1ff' }}>新建渠道</Button>
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
            key: 'data',
            label: '渠道数据',
            children: (
              <div>
                <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                  <Col xs={24} sm={6}>
                    <Card>
                      <Statistic title="总展示量" value={statTotals.impressions} valueStyle={{ color: '#1677ff' }} />
                    </Card>
                  </Col>
                  <Col xs={24} sm={6}>
                    <Card>
                      <Statistic title="总点击量" value={statTotals.clicks} valueStyle={{ color: '#52c41a' }} />
                    </Card>
                  </Col>
                  <Col xs={24} sm={6}>
                    <Card>
                      <Statistic title="总成本(¥)" value={Number(statTotals.cost.toFixed(2))} valueStyle={{ color: '#faad14' }} />
                    </Card>
                  </Col>
                  <Col xs={24} sm={6}>
                    <Card>
                      <Statistic title="平均ROI" value={Number(roiAvg.toFixed(2))} valueStyle={{ color: '#722ed1' }} />
                    </Card>
                  </Col>
                </Row>

                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <Input.Search
                      allowClear
                      placeholder="搜索渠道名称"
                      onSearch={() => fetchStats(1, statPagination.pageSize)}
                      onChange={(e) => setStatSearch(e.target.value)}
                      style={{ width: 240 }}
                    />
                    <Button type="link" onClick={() => fetchStats(1, statPagination.pageSize)} style={{ color: '#69b1ff' }}>筛选</Button>
                  </Space>
                </div>

                <Card>
                  <Table
                    rowKey="channelId"
                    columns={statColumns}
                    dataSource={stats}
                    loading={statLoading}
                    pagination={{
                      ...statPagination,
                      showSizeChanger: false,
                      showTotal: (total, range) =>
                        `第 ${range[0]}-${range[1]} 条/共 ${total} 条，共 ${Math.ceil(total / statPagination.pageSize)} 页`,
                    }}
                    onChange={onStatTableChange}
                  />
                </Card>
              </div>
            )
          }
        ]}
      />

      <Modal title="渠道详情" open={detailVisible} onCancel={() => setDetailVisible(false)} footer={null} width={720}>
        {current && (
          <div>
            <Title level={5}>{current.name}</Title>
            <div style={{ marginBottom: 8 }}>
              <Space>
                <Tag>{current.status}</Tag>
                <Text type="secondary">类型：{current.type}</Text>
                <Text type="secondary">平台：{current.platform}</Text>
                <Text type="secondary">预算：¥{Number(current.budget).toLocaleString()}</Text>
                <Text type="secondary">创建：{formatDateTime(current.createdAt)}</Text>
                <Text type="secondary">更新：{formatDateTime(current.updatedAt)}</Text>
              </Space>
            </div>
            <Card size="small">
              <div style={{ whiteSpace: 'pre-wrap' }}>{current.description || '-'}</div>
            </Card>
          </div>
        )}
      </Modal>

      <Modal title="新建渠道" open={createVisible} onCancel={() => setCreateVisible(false)} onOk={handleCreate} okButtonProps={{ type: 'default' }}>
        <Form form={createForm} layout="vertical">
          <Form.Item name="name" label="渠道名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select placeholder="请选择类型">
              <Option value="社交媒体">社交媒体</Option>
              <Option value="广告投放">广告投放</Option>
              <Option value="内容营销">内容营销</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item name="platform" label="平台" rules={[{ required: true }]}><Input placeholder="如 抖音/快手/百度/微信/Google Ads" /></Form.Item>
          <Form.Item name="budget" label="预算" rules={[{ required: true }]}><InputNumber addonBefore="¥" style={{ width: '100%' }} min={0} /></Form.Item>
          <Form.Item name="status" label="状态" initialValue="启用" rules={[{ required: true }]}>
            <Select>
              <Option value="启用">启用</Option>
              <Option value="停用">停用</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea rows={4} /></Form.Item>
        </Form>
      </Modal>

      <Modal title="编辑渠道" open={editVisible} onCancel={() => setEditVisible(false)} onOk={handleEdit} okButtonProps={{ type: 'default' }}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="渠道名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="type" label="类型" rules={[{ required: true }]}>
            <Select placeholder="请选择类型">
              <Option value="社交媒体">社交媒体</Option>
              <Option value="广告投放">广告投放</Option>
              <Option value="内容营销">内容营销</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item name="platform" label="平台" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="budget" label="预算" rules={[{ required: true }]}><InputNumber addonBefore="¥" style={{ width: '100%' }} min={0} /></Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Select>
              <Option value="启用">启用</Option>
              <Option value="停用">停用</Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea rows={4} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChannelManagement;