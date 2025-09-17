// src/pages/manager/EnterpriseAudit.tsx
import { useEffect, useState } from 'react';
import { Card, List, Table, Space, Button, Input, Select, Tag, Drawer, Row, Col, Image, Divider, message, Modal, Typography } from 'antd';
import { ZoomInOutlined, ZoomOutOutlined, RedoOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, SearchOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { enterpriseAuditApi, type EnterpriseAuditStatus, type EnterpriseBasicInfo, type EnterpriseDetail, type AuditLogItem } from '../../api/manger/enterpriseAudit';

const { Option } = Select;
const { Text } = Typography;
const { Title } = Typography;

const statusColor: Record<EnterpriseAuditStatus, string> = {
  '待审核': 'gold',
  '已认证': 'green',
  '已驳回': 'red',
  '待定': 'blue',
};

const EnterpriseAudit = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<EnterpriseBasicInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<EnterpriseAuditStatus | ''>('');
  const [detail, setDetail] = useState<EnterpriseDetail | null>(null);
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState<AuditLogItem[]>([]);

  // 图片预览控制
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const fetchList = async (toPage = page) => {
    setLoading(true);
    try {
      const res = await enterpriseAuditApi.list({ page: toPage, pageSize, keyword, status });
      setList(res.data);
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

  const openDetail = async (row: EnterpriseBasicInfo) => {
    const d = await enterpriseAuditApi.detail(row.id);
    if (!d) return message.error('加载详情失败');
    setDetail(d);
    setOpen(true);
    setScale(1);
    setRotate(0);
    const l = await enterpriseAuditApi.logs(row.id);
    setLogs(l);
  };

  const approve = async () => {
    if (!detail) return;
    const ok = await enterpriseAuditApi.approve(detail.id);
    if (ok) {
      message.success('已认证，已发送通知');
      setOpen(false);
      fetchList();
    } else {
      message.error('操作失败');
    }
  };

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectPreset, setRejectPreset] = useState<string | undefined>(undefined);

  const submitReject = async () => {
    if (!detail) return;
    const reason = (rejectPreset || '') + (rejectReason.trim() ? (rejectPreset ? '：' : '') + rejectReason.trim() : '');
    if (!reason) return message.error('请填写或选择驳回理由');
    const ok = await enterpriseAuditApi.reject(detail.id, reason);
    if (ok) {
      message.success('已驳回');
      setRejectOpen(false);
      setRejectReason('');
      setRejectPreset(undefined);
      setOpen(false);
      fetchList();
    } else {
      message.error('操作失败');
    }
  };

  const [pendingOpen, setPendingOpen] = useState(false);
  const [pendingRemark, setPendingRemark] = useState('');

  const submitPending = async () => {
    if (!detail) return;
    if (!pendingRemark.trim()) return message.error('请填写备注');
    const ok = await enterpriseAuditApi.pending(detail.id, pendingRemark.trim());
    if (ok) {
      message.success('已标记待定');
      setPendingOpen(false);
      setPendingRemark('');
      setOpen(false);
      fetchList();
    } else {
      message.error('操作失败');
    }
  };

  const columns: ColumnsType<EnterpriseBasicInfo> = [
    { title: '企业名称', dataIndex: 'companyName', key: 'companyName' },
    { title: '统一社会信用代码', dataIndex: 'creditCode', key: 'creditCode' },
    { title: '法人', dataIndex: 'legalPerson', key: 'legalPerson', width: 120 },
    { title: '联系电话', dataIndex: 'contactPhone', key: 'contactPhone', width: 140 },
    { title: '提交时间', dataIndex: 'submitTime', key: 'submitTime', width: 180, render: (v: string) => new Date(v).toLocaleString() },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (s: EnterpriseAuditStatus) => <Tag color={statusColor[s]}>{s}</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, row) => (
        <Space>
          <Button type="link" onClick={() => openDetail(row)}>查看</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
    <Title level={4}>企业认证审核</Title>
      <Card>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="企业名称/信用代码/法人"
            allowClear
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={() => fetchList(1)}
            suffix={<SearchOutlined onClick={() => fetchList(1)} />}
            style={{ width: 260 }}
          />
          <Select placeholder="状态" allowClear value={status || undefined} onChange={(v) => setStatus((v || '') as EnterpriseAuditStatus | '')} style={{ width: 160 }}>
            <Option value="待审核">待审核</Option>
            <Option value="已认证">已认证</Option>
            <Option value="已驳回">已驳回</Option>
            <Option value="待定">待定</Option>
          </Select>
          <Button onClick={() => fetchList(1)}>搜索</Button>
          <Button onClick={() => { setKeyword(''); setStatus(''); fetchList(1); }}>重置</Button>
        </Space>

        <List
            loading={loading}
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
            dataSource={list}
            pagination={{
                current: page,
                pageSize,
                total,
                onChange: (cp) => fetchList(cp),
                showTotal: (t) => `共 ${t} 条`,
            }}
            renderItem={(item) => (
                <List.Item>
                <Card
                    hoverable
                    title={
                    <Space align="center">
                        <span style={{ fontWeight: 600 }}>{item.companyName}</span>
                        <Tag color={statusColor[item.status]}>{item.status}</Tag>
                    </Space>
                    }
                    // extra={
                    // // <Button type="link" onClick={() => openDetail(item)}>
                    // //     查看
                    // // </Button>
                    // }
                >
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                    <div>统一社会信用代码：<strong>{item.creditCode}</strong></div>
                    <Space size={24} wrap>
                        <span>法人：{item.legalPerson}</span>
                        <span>联系电话：{item.contactPhone}</span>
                    </Space>
                    <div style={{ color: '#666' }}>
                        提交时间：{new Date(item.submitTime).toLocaleString()}
                    </div>
                    <Space style={{ marginTop: 8 }}>
                        <Button
                          disabled={item.status !== '待审核'}
                          onClick={() => openDetail(item)}
                        >
                          去审核
                        </Button>
                    </Space>
                    </Space>
                </Card>
                </List.Item>
            )}
            />
      </Card>

      <Drawer
        title={detail ? `${detail.companyName} · 资质审核` : '企业详情'}
        open={open}
        onClose={() => setOpen(false)}
        width={1100}
        destroyOnClose
        extra={
          <Space>
            <Button type="primary" icon={<CheckCircleOutlined />} onClick={approve} disabled={!detail || detail.status !== '待审核'}>通过</Button>
            <Button danger icon={<CloseCircleOutlined />} onClick={() => setRejectOpen(true)} disabled={!detail || detail.status !== '待审核'}>驳回</Button>
            <Button icon={<ExclamationCircleOutlined />} onClick={() => setPendingOpen(true)} disabled={!detail || detail.status !== '待审核'}>待定</Button>
          </Space>
        }
      >
        {detail && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 信息比对 */}
            <Card title="信息比对(填写 vs 证件OCR)">
              <Row gutter={16}>
                <Col span={12}>
                  <Card size="small" title="企业填写信息">
                    <p>企业名称：<Text strong>{detail.filledInfo.companyName}</Text></p>
                    <p>统一社会信用代码：<Text strong>{detail.filledInfo.creditCode}</Text></p>
                    <p>法人：<Text strong>{detail.filledInfo.legalPerson}</Text></p>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card size="small" title="证件OCR识别（模拟）">
                    <p>企业名称：<Text type={detail.ocrInfo.companyName === detail.filledInfo.companyName ? 'success' : 'danger'} strong>{detail.ocrInfo.companyName || '-'}</Text></p>
                    <p>统一社会信用代码：<Text type={detail.ocrInfo.creditCode === detail.filledInfo.creditCode ? 'success' : 'danger'} strong>{detail.ocrInfo.creditCode || '-'}</Text></p>
                    <p>法人：<Text type={detail.ocrInfo.legalPerson === detail.filledInfo.legalPerson ? 'success' : 'danger'} strong>{detail.ocrInfo.legalPerson || '-'}</Text></p>
                  </Card>
                </Col>
              </Row>
            </Card>

            {/* 资质材料展示 + 预览控制 */}
            <Card title="资质材料展示">
              <Space style={{ marginBottom: 12 }}>
                <Button icon={<ZoomInOutlined />} onClick={() => setScale(s => Math.min(3, s + 0.2))}>放大</Button>
                <Button icon={<ZoomOutOutlined />} onClick={() => setScale(s => Math.max(0.4, s - 0.2))}>缩小</Button>
                <Button icon={<RedoOutlined />} onClick={() => setRotate(r => (r + 90) % 360)}>旋转</Button>
                <Button onClick={() => { setScale(1); setRotate(0); }}>重置</Button>
              </Space>
              <Row gutter={[16, 16]}>
                {[{ title: '营业执照', url: detail.docs.businessLicenseUrl }, { title: '法人身份证（正面）', url: detail.docs.legalIdFrontUrl }, { title: '法人身份证（反面）', url: detail.docs.legalIdBackUrl }].map((img) => (
                  <Col span={8} key={img.title}>
                    <Card size="small" title={img.title}>
                      <div style={{ overflow: 'hidden', borderRadius: 8, border: '1px solid #eee' }}>
                        <Image
                          src={img.url}
                          alt={img.title}
                          preview={{ mask: '点击放大预览' }}
                          style={{ transform: `scale(${scale}) rotate(${rotate}deg)`, transformOrigin: 'center center', transition: 'transform 0.2s ease' }}
                        />
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>

            {/* 审核历史记录 */}
            <Card title="审核日志与记录">
              <Table
                size="small"
                rowKey="id"
                pagination={false}
                columns={[
                  { title: '操作人', dataIndex: 'operator', key: 'operator', width: 120 },
                  { title: '动作', dataIndex: 'action', key: 'action', width: 100 },
                  { title: '时间', dataIndex: 'time', key: 'time', width: 200, render: (v: string) => new Date(v).toLocaleString() },
                  { title: '理由/备注', key: 'reason', render: (_, r: AuditLogItem) => r.reason || r.remark || '-' },
                ]}
                dataSource={logs}
              />
              <Divider />
              <Space style={{ color: '#666' }}>
                <ClockCircleOutlined />
                <span>共 {logs.length} 条操作记录</span>
              </Space>
            </Card>
          </Space>
        )}
      </Drawer>

      {/* 驳回弹窗 */}
      <Modal
        title="驳回申请"
        open={rejectOpen}
        onCancel={() => setRejectOpen(false)}
        onOk={submitReject}
        okText="确认驳回"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select
            placeholder="选择常见驳回理由"
            allowClear
            value={rejectPreset}
            onChange={(v) => setRejectPreset(v)}
          >
            <Option value="营业执照不清晰">营业执照不清晰</Option>
            <Option value="公司信息与证件不符">公司信息与证件不符</Option>
            <Option value="证件过期或缺失">证件过期或缺失</Option>
          </Select>
          <Input.TextArea rows={4} placeholder="补充说明（可选）" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
        </Space>
      </Modal>

      {/* 待定弹窗 */}
      <Modal
        title="设置为待定"
        open={pendingOpen}
        onCancel={() => setPendingOpen(false)}
        onOk={submitPending}
        okText="确认"
        cancelText="取消"
      >
        <Input.TextArea rows={4} placeholder="请填写待定原因或备注" value={pendingRemark} onChange={(e) => setPendingRemark(e.target.value)} />
      </Modal>
    </div>
  );
};

export default EnterpriseAudit;