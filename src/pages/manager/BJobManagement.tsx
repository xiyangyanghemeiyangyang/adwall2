// src/pages/manager/BJobManagement.tsx
import { useEffect, useMemo, useState } from 'react';
import { Card, Row, Col, Input, Select, DatePicker, Button, Table, Tag, Space, Modal, Form, message, Descriptions, Typography, Popconfirm ,Flex} from 'antd';
import { EyeOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined, StopOutlined, DeleteOutlined, SearchOutlined, BarChartOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { jobApi, type Job, type JobStatus } from '../../api/manger/jobManagement';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

const statusColor: Record<JobStatus, string> = {
  '待审核': 'gold',
  '已发布': 'green',
  '已下架': 'red',
  '已驳回': 'volcano',
};

const cities = ['北京', '上海', '广州', '深圳', '杭州'];
const industries = ['互联网', '大数据', '金融', '制造', '教育'];

const BJobManagement = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<JobStatus | ''>('');
  const [city, setCity] = useState('');
  const [industry, setIndustry] = useState('');
  const [timeRange, setTimeRange] = useState<[string | undefined, string | undefined]>([undefined, undefined]);

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [current, setCurrent] = useState<Job | null>(null);
  const [form] = Form.useForm();

  const stats = useMemo(() => {
    const totalCount = total;
    const pending = data.filter(d => d.status === '待审核').length;
    return { totalCount, pending };
  }, [data, total]);

  const fetchList = async (toPage = page) => {
    setLoading(true);
    try {
      const res = await jobApi.getJobs({
        page: toPage,
        pageSize,
        keyword,
        status,
        city,
        industry,
        timeFrom: timeRange[0],
        timeTo: timeRange[1],
      });
      setData(res.data);
      setTotal(res.total);
      setPage(res.page);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = () => fetchList(1);

  const handleApprove = async (record: Job) => {
    const ok = await jobApi.approveJob(record.id);
    if (ok) {
      message.success('已通过审核并发布');
      fetchList();
    } else {
      message.error('操作失败');
    }
  };

  const handleReject = async (record: Job) => {
    let reason = '';
    Modal.confirm({
      title: '驳回并反馈',
      content: (
        <Input.TextArea rows={3} onChange={(e) => (reason = e.target.value)} placeholder="填写驳回原因（将通知企业）" />
      ),
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { type: 'link' },
      cancelButtonProps: { type: 'link' },
      onOk: async () => {
        const ok = await jobApi.rejectJob(record.id, reason || '不符合发布规范');
        if (ok) {
          message.success('已驳回');
          fetchList();
        } else {
          message.error('操作失败');
        }
      },
    });
  };

  const handleTakeDown = async (record: Job) => {
    const ok = await jobApi.takeDownJob(record.id, '存在问题，已下架');
    if (ok) {
      message.success('已下架');
      fetchList();
    } else {
      message.error('操作失败');
    }
  };

  const handleDelete = async (record: Job) => {
    const ok = await jobApi.deleteJob(record.id);
    if (ok) {
      message.success('已删除');
      fetchList();
    } else {
      message.error('删除失败');
    }
  };

  const openView = async (record: Job) => {
    const detail = await jobApi.getJobById(record.id);
    setCurrent(detail);
    setViewOpen(true);
  };

  const openEdit = (record: Job) => {
    setCurrent(record);
    form.setFieldsValue(record);
    setEditOpen(true);
  };

  const submitEdit = async () => {
    const values = await form.validateFields();
    if (!current) return;
    const ok = await jobApi.updateJob(current.id, values);
    if (ok) {
      message.success('已更新');
      setEditOpen(false);
      fetchList();
    } else {
      message.error('更新失败');
    }
  };

  const columns: ColumnsType<Job> = [
    { title: '职位ID', dataIndex: 'id', key: 'id', width: 140 },
    {
      title: '职位名称',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <span style={{ fontWeight: 600 }}>{text}</span>
          <Text type="secondary">{record.company} · {record.city} · {record.industry}</Text>
        </Space>
      ),
    },
    { title: '薪资', dataIndex: 'salaryRange', key: 'salaryRange', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (s: JobStatus) => <Tag color={statusColor[s]}>{s}</Tag>,
      filters: [
        { text: '待审核', value: '待审核' },
        { text: '已发布', value: '已发布' },
        { text: '已下架', value: '已下架' },
        { text: '已驳回', value: '已驳回' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    { title: '投递数量', dataIndex: 'applications', key: 'applications', width: 100 },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      width: 180,
      render: (t: string) => new Date(t).toLocaleString('zh-CN'),
      sorter: (a, b) => +new Date(a.publishTime) - +new Date(b.publishTime),
    },
    {
      title: '操作',
      key: 'action',
      width: 320,
      render: (_, record) => (
        <Space wrap>
          <Button type="link" icon={<EyeOutlined />} onClick={() => openView(record)}>查看</Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => openEdit(record)}>编辑</Button>
          {record.status === '待审核' && (
            <>
              <Button type="link" icon={<CheckCircleOutlined />} onClick={() => handleApprove(record)}>通过</Button>
              <Button type="link" danger icon={<CloseCircleOutlined />} onClick={() => handleReject(record)}>驳回</Button>
            </>
          )}
          {record.status === '已发布' && (
            <Button type="link" danger icon={<StopOutlined />} onClick={() => handleTakeDown(record)}>下架</Button>
          )}
          <Popconfirm 
          title="确认删除该职位？"
          okText="确定"
          cancelText="取消"
          okButtonProps = {{type: 'link'}}
          cancelButtonProps = {{type: 'link'}}
           onConfirm={() => handleDelete(record)}
           >
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>B端岗位管理</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="职位/公司/ID"
            allowClear
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={onSearch}
            suffix={<SearchOutlined onClick={onSearch} />}
          />
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Select placeholder="状态" allowClear value={status || undefined} onChange={(v) => setStatus((v || '') as JobStatus | '')} style={{ width: '100%' }}>
            <Option value="待审核">待审核</Option>
            <Option value="已发布">已发布</Option>
            <Option value="已下架">已下架</Option>
            <Option value="已驳回">已驳回</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Select placeholder="城市" allowClear value={city || undefined} onChange={(v) => setCity(v || '')} style={{ width: '100%' }}>
            {cities.map(c => <Option key={c} value={c}>{c}</Option>)}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Select placeholder="行业" allowClear value={industry || undefined} onChange={(v) => setIndustry(v || '')} style={{ width: '100%' }}>
            {industries.map(i => <Option key={i} value={i}>{i}</Option>)}
          </Select>
        </Col>
        <Col xs={24} sm={24} md={6}>
          <RangePicker
            style={{ width: '100%' }}
            showTime
            onChange={(vals) => {
              if (!vals) return setTimeRange([undefined, undefined]);
              setTimeRange([vals[0]?.toISOString(), vals[1]?.toISOString()]);
            }}
          />
        </Col>
        <Col span={24}>
          <Flex justify="flex-end" gap="small" wrap>
            <Button type="link" icon={<SearchOutlined />} onClick={onSearch}>搜索</Button>
            <Button
              type="link"
              onClick={() => {
                setKeyword('');
                setStatus('');
                setCity('');
                setIndustry('');
                setTimeRange([undefined, undefined]);
                fetchList(1);
              }}
            >
              重置
            </Button>
          </Flex>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space>
              <BarChartOutlined style={{ color: '#1677ff' }} />
              <div>
                <div style={{ fontSize: 12, color: '#999' }}>总职位数量</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{total}</div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Space>
              <CheckCircleOutlined style={{ color: '#faad14' }} />
              <div>
                <div style={{ fontSize: 12, color: '#999' }}>待审核职位数量</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.pending}</div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Card>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (t, r) => `第 ${r[0]}-${r[1]} 条/共 ${t} 条`,
            onChange: (cp) => fetchList(cp),
          }}
        />
      </Card>

      <Modal
        title="职位详情"
        open={viewOpen}
        onCancel={() => setViewOpen(false)}
        footer={null}
        width={720}
      >
        {current && (
          <>
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="职位ID">{current.id}</Descriptions.Item>
              <Descriptions.Item label="职位名称">{current.title}</Descriptions.Item>
              <Descriptions.Item label="公司">{current.company}</Descriptions.Item>
              <Descriptions.Item label="城市">{current.city}</Descriptions.Item>
              <Descriptions.Item label="行业">{current.industry}</Descriptions.Item>
              <Descriptions.Item label="薪资">{current.salaryRange}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusColor[current.status]}>{current.status}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="投递数量">{current.applications}</Descriptions.Item>
              <Descriptions.Item label="发布时间" span={2}>
                {new Date(current.publishTime).toLocaleString('zh-CN')}
              </Descriptions.Item>
              <Descriptions.Item label="职位描述" span={2}>
                {current.description}
              </Descriptions.Item>
            </Descriptions>
            <Title level={5} style={{ marginTop: 16 }}>历史记录</Title>
            <div style={{ maxHeight: 200, overflow: 'auto', padding: '8px 0' }}>
              {current.history.map((h, idx) => (
                <div key={idx} style={{ padding: '6px 0', borderBottom: '1px solid #f5f5f5' }}>
                  <Space direction="vertical" size={0} style={{ width: '100%' }}>
                    <div>
                      <Text strong>{h.action}</Text>
                      <Text type="secondary"> · {new Date(h.time).toLocaleString('zh-CN')}</Text>
                    </div>
                    <Text type="secondary">处理人：{h.by}{h.remark ? ` · 备注：${h.remark}` : ''}</Text>
                  </Space>
                </div>
              ))}
            </div>
            {current.status === '待审核' && (
              <div style={{ textAlign: 'right', marginTop: 12 }}>
                <Space>
                  <Button onClick={() => handleReject(current)} danger icon={<CloseCircleOutlined />}>驳回</Button>
                  <Button type="link" onClick={() => handleApprove(current)} icon={<CheckCircleOutlined />}>通过</Button>
                </Space>
              </div>
            )}
          </>
        )}
      </Modal>

      <Modal
        title="编辑职位"
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        footer={
          <Flex justify="flex-end" gap="small" wrap>
            <Button type="link" onClick={() => setEditOpen(false)}>取消</Button>
            <Button type="link" onClick={submitEdit}>确定</Button>
          </Flex>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="职位名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="company" label="公司" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="city" label="城市" rules={[{ required: true }]}>
            <Select allowClear>
              {cities.map(c => <Option key={c} value={c}>{c}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="industry" label="行业" rules={[{ required: true }]}>
            <Select allowClear>
              {industries.map(i => <Option key={i} value={i}>{i}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="salaryRange" label="薪资范围" rules={[{ required: true }]}>
            <Input placeholder="例如：20k-30k" />
          </Form.Item>
          <Form.Item name="description" label="职位描述" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BJobManagement;