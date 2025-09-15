import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Space, Typography, Button, Row, Col, Skeleton, Modal, message, Statistic, Avatar, Divider, Flex } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, StopOutlined, ArrowLeftOutlined, BankOutlined } from '@ant-design/icons';
import { jobApi, type Job, type JobStatus } from '../../api/manger/jobManagement';

const { Title, Text, Paragraph } = Typography;

const statusColor: Record<JobStatus, string> = {
  '待审核': 'gold',
  '已发布': 'green',
  '已下架': 'red',
  '已驳回': 'volcano',
};

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<Job | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const detail = jobId ? await jobApi.getJobById(jobId) : null;
      if (mounted) {
        setJob(detail);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [jobId]);

  const refresh = async () => {
    if (!jobId) return;
    const detail = await jobApi.getJobById(jobId);
    setJob(detail);
  };

  const onApprove = async () => {
    if (!job) return;
    setActionLoading(true);
    const ok = await jobApi.approveJob(job.id);
    setActionLoading(false);
    if (ok) {
      message.success('已通过审核并发布');
      refresh();
    } else {
      message.error('操作失败');
    }
  };

  const onReject = async () => {
    if (!job) return;
    let reason = '';
    Modal.confirm({
      title: '驳回并反馈',
      content: (
        <Typography.Paragraph>
          <Typography.Text type="secondary">将通知企业，请填写原因：</Typography.Text>
          <textarea style={{ width: '100%', marginTop: 8 }} rows={3} onChange={(e) => (reason = (e.target as HTMLTextAreaElement).value)} />
        </Typography.Paragraph>
      ),
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { type: 'link' },
      cancelButtonProps: { type: 'link' },
      onOk: async () => {
        setActionLoading(true);
        const ok = await jobApi.rejectJob(job.id, reason || '不符合发布规范');
        setActionLoading(false);
        if (ok) {
          message.success('已驳回');
          refresh();
        } else {
          message.error('操作失败');
        }
      },
    });
  };

  const onTakeDown = async () => {
    if (!job) return;
    setActionLoading(true);
    const ok = await jobApi.takeDownJob(job.id, '存在问题，已下架');
    setActionLoading(false);
    if (ok) {
      message.success('已下架');
      refresh();
    } else {
      message.error('操作失败');
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>返回</Button>
      </Space>

      {loading ? (
        <Skeleton active />
      ) : !job ? (
        <Card>未找到职位信息</Card>
      ) : (
        <div>
          <Card>
            <Flex align="center" justify="space-between" wrap>
              <Space size={16} align="center">
                <Avatar size={56} icon={<BankOutlined />} />
                <div>
                  <Title level={4} style={{ margin: 0 }}>{job.title}</Title>
                  <Space wrap>
                    <Text type="secondary">{job.company}</Text>
                    <Tag>{job.city}</Tag>
                    <Tag>{job.industry}</Tag>
                    <Tag color="blue">{job.salaryRange}</Tag>
                    <Tag color={statusColor[job.status]}>{job.status}</Tag>
                  </Space>
                </div>
              </Space>
              <Flex gap="small" wrap>
                {job.status === '待审核' && (
                  <>
                    <Button danger icon={<CloseCircleOutlined />} loading={actionLoading} onClick={onReject}>驳回</Button>
                    <Button type="link" icon={<CheckCircleOutlined />} loading={actionLoading} onClick={onApprove}>通过</Button>
                  </>
                )}
                {job.status === '已发布' && (
                  <Button danger icon={<StopOutlined />} loading={actionLoading} onClick={onTakeDown}>下架</Button>
                )}
              </Flex>
            </Flex>

            <Divider style={{ margin: '16px 0' }} />
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card size="small">
                  <Statistic title="投递数量" value={job.applications} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card size="small">
                  <Statistic title="发布时间" value={new Date(job.publishTime).toLocaleString('zh-CN')} valueRender={(node) => <Text>{node}</Text>} />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card size="small">
                  <Statistic title="当前状态" valueRender={() => <Tag color={statusColor[job.status]}>{job.status}</Tag>} value={undefined as unknown as number} />
                </Card>
              </Col>
            </Row>
          </Card>

          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            <Col xs={24} lg={16}>
              <Card title="职位信息">
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="职位ID">{job.id}</Descriptions.Item>
                  <Descriptions.Item label="公司">{job.company}</Descriptions.Item>
                  <Descriptions.Item label="城市">{job.city}</Descriptions.Item>
                  <Descriptions.Item label="行业">{job.industry}</Descriptions.Item>
                  <Descriptions.Item label="薪资" span={2}>{job.salaryRange}</Descriptions.Item>
                </Descriptions>
                <Title level={5} style={{ marginTop: 16 }}>职位描述</Title>
                <Paragraph>{job.description}</Paragraph>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title="职位动态" size="small">
                <div style={{ maxHeight: 360, overflow: 'auto' }}>
                  {job.history.map((h, idx) => (
                    <div key={idx} style={{ padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
                      <div>
                        <Text strong>{h.action}</Text>
                        <Text type="secondary"> · {new Date(h.time).toLocaleString('zh-CN')}</Text>
                      </div>
                      <Text type="secondary">{h.by}{h.remark ? ` · 备注：${h.remark}` : ''}</Text>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};

export default JobDetail;


