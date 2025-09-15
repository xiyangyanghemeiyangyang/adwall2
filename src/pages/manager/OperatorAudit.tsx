// src/pages/manager/OperatorAudit.tsx
import { useEffect, useState } from 'react';
import { Card, List, Tag, Space, Button, Input, Select, Row, Col, Typography, message, Modal } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SearchOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { operatorAuditApi, type OperatorApplicant, type AuditStatus } from '../../api/manger/operatorAudit';

const { Title, Text } = Typography;
const { Option } = Select;

const statusColor: Record<AuditStatus, string> = {
  '待审核': 'gold',
  '已通过': 'green',
  '已拒绝': 'red',
};

const OperatorAudit = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OperatorApplicant[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<AuditStatus | ''>('');

  const fetchList = async (toPage = page) => {
    setLoading(true);
    try {
      const res = await operatorAuditApi.list({ page: toPage, pageSize, keyword, status });
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

  const approve = async (record: OperatorApplicant) => {
    const ok = await operatorAuditApi.approve(record.id);
    if (ok) {
      message.success('已通过，已为其分配默认角色：员工');
      fetchList();
    } else {
      message.error('操作失败');
    }
  };

  // 拒绝弹窗状态
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<OperatorApplicant | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const openReject = (record: OperatorApplicant) => {
    setRejectTarget(record);
    setRejectReason('');
    setRejectOpen(true);
  };

  const submitReject = async () => {
    if (!rejectTarget) return;
    const reason = rejectReason.trim();
    if (!reason) return;
    const ok = await operatorAuditApi.reject(rejectTarget.id, reason);
    if (ok) {
      message.success('已拒绝');
      setRejectOpen(false);
      setRejectTarget(null);
      setRejectReason('');
      fetchList();
    } else {
      message.error('操作失败');
    }
  };

  return (
    <div>
      <Title level={4}>运营者身份审核</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8}>
          <Input
            placeholder="搜索名称/电话"
            allowClear
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={() => fetchList(1)}
            suffix={<SearchOutlined onClick={() => fetchList(1)} />}
          />
        </Col>
        <Col xs={24} sm={12} md={4}>
          <Select placeholder="状态" allowClear value={status || undefined} onChange={(v) => setStatus((v || '') as AuditStatus | '')} style={{ width: '100%' }}>
            <Option value="待审核">待审核</Option>
            <Option value="已通过">已通过</Option>
            <Option value="已拒绝">已拒绝</Option>
          </Select>
        </Col>
        <Col xs={24} md={12} style={{ textAlign: 'right' }}>
          <Space>
            <Button type="link" onClick={() => fetchList(1)}>搜索</Button>
            <Button type="link" onClick={() => { setKeyword(''); setStatus(''); fetchList(1); }}>重置</Button>
          </Space>
        </Col>
      </Row>

      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={data}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: false,
          onChange: (cp) => fetchList(cp),
          showTotal: (t) => `共 ${t} 条`,
        }}
        renderItem={(item) => (
          <List.Item>
            <Card>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <Space align="center" size="large" style={{ justifyContent: 'space-between', width: '100%' }}>
                  <Space align="center">
                    <Tag color="blue" style={{ marginRight: 12 }}>运营者</Tag>
                    <Title level={5} style={{ margin: 0 }}>{item.name}</Title>
                    <Tag color={statusColor[item.status]}>{item.status}</Tag>
                    {item.role && <Tag>{item.role}</Tag>}
                  </Space>
                  <Space>
                    <Button type="link" style={{ color: '#52c41a' }} icon={<CheckCircleOutlined />} disabled={item.status !== '待审核'} onClick={() => approve(item)}>通过</Button>
                    <Button type="link" danger icon={<CloseCircleOutlined />} disabled={item.status !== '待审核'} onClick={() => openReject(item)}>拒绝</Button>
                  </Space>
                </Space>

                <Space style={{ color: '#666' }} size="large" wrap>
                  <span><ClockCircleOutlined /> {new Date(item.submitTime).toLocaleString('zh-CN')}</span>
                  <span>分类：{item.category}</span>
                </Space>

                <Space direction="vertical" size={6}>
                  <Text>{item.desc}</Text>
                  <Text type="secondary">手机号：{item.phone}</Text>
                </Space>
              </Space>
            </Card>
          </List.Item>
        )}
      />

<Modal
        title="拒绝申请"
        open={rejectOpen}
        onCancel={() => setRejectOpen(false)}
        footer={
          <Space>
            <Button type="link" onClick={() => setRejectOpen(false)}>取消</Button>
            <Button type="link" onClick={submitReject} disabled={!rejectReason.trim()}>确定</Button>
          </Space>
        }
      >
        <Input.TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="请填写拒绝理由（必填）"
        />
      </Modal>
    </div>

    
  );
};

export default OperatorAudit;