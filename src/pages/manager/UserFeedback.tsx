// src/pages/manager/UserFeedback.tsx
import { useEffect, useMemo, useState } from 'react';
import { Card, Row, Col, Segmented, Input, Rate, Badge, List, Modal, Progress, Tag, Space, Typography, Pagination, Select, Skeleton, Empty, message } from 'antd';
import { userFeedbackApi } from '../../api/manger/userFeedback';
import { StarFilled } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

type Mode = 'enterprise' | 'job';

export default function UserFeedback() {
  const [mode, setMode] = useState<Mode>('enterprise');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // 企业卡片
  const [pkgCards, setPkgCards] = useState<any[]>([]);
  const [pkgPage, setPkgPage] = useState({ current: 1, pageSize: 8, total: 0 });

  // 求职者卡片
  const [jobCards, setJobCards] = useState<any[]>([]);
  const [jobPage, setJobPage] = useState({ current: 1, pageSize: 8, total: 0 });

  // 详情
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');
  const [ratingAgg, setRatingAgg] = useState<{ avgRating: number; total: number; dist: Record<number, number> } | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [revPage, setRevPage] = useState({ current: 1, pageSize: 10, total: 0 });

  // 求职者流程过滤
  const [jobStep, setJobStep] = useState<string | undefined>(undefined);

  const loadEnterprise = async (page = 1, pageSize = pkgPage.pageSize) => {
    setLoading(true);
    try {
      const res = await userFeedbackApi.listEnterpriseAggregates({ search, page, pageSize });
      setPkgCards(res.data);
      setPkgPage({ current: res.page, pageSize: res.pageSize, total: res.total });
    } catch (e: any) {
      message.error(e.message || '加载企业反馈失败');
    } finally {
      setLoading(false);
    }
  };

  const loadJob = async (page = 1, pageSize = jobPage.pageSize) => {
    setLoading(true);
    try {
      const res = await userFeedbackApi.listJobAggregates({ search, page, pageSize });
      setJobCards(res.data);
      setJobPage({ current: res.page, pageSize: res.pageSize, total: res.total });
    } catch (e: any) {
      message.error(e.message || '加载求职者反馈失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === 'enterprise') loadEnterprise(1, pkgPage.pageSize);
    else loadJob(1, jobPage.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const onSearch = () => {
    if (mode === 'enterprise') loadEnterprise(1, pkgPage.pageSize);
    else loadJob(1, jobPage.pageSize);
  };

  const ratingRows = useMemo(() => {
    if (!ratingAgg) return [];
    return [5,4,3,2,1].map(star => ({
      star,
      count: ratingAgg.dist[star] || 0,
      percent: ratingAgg.total ? Math.round(((ratingAgg.dist[star] || 0) / ratingAgg.total) * 100) : 0
    }));
  }, [ratingAgg]);

  const openEnterpriseDetail = async (pkg: any) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setCurrentTitle(pkg.packageName);
    try {
      const res = await userFeedbackApi.getEnterpriseDetails({ packageId: pkg.packageId, page: 1, pageSize: revPage.pageSize });
      setRatingAgg(res.aggregate);
      setReviews(res.data);
      setRevPage({ current: res.page, pageSize: res.pageSize, total: res.total });
    } finally {
      setDetailLoading(false);
    }
  };

  const openJobDetail = async (job: any) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setCurrentTitle(job.jobTitle);
    try {
      const res = await userFeedbackApi.getJobDetails({ jobId: job.jobId, step: jobStep as any, page: 1, pageSize: revPage.pageSize });
      setRatingAgg(res.aggregate);
      setReviews(res.data);
      setRevPage({ current: res.page, pageSize: res.pageSize, total: res.total });
    } finally {
      setDetailLoading(false);
    }
  };

  const onDetailPageChange = async (page: number, pageSize?: number) => {
    setDetailLoading(true);
    try {
      if (mode === 'enterprise') {
        const pkg = pkgCards.find(x => x.packageName === currentTitle);
        if (!pkg) return;
        const res = await userFeedbackApi.getEnterpriseDetails({ packageId: pkg.packageId, page, pageSize: pageSize || revPage.pageSize });
        setRatingAgg(res.aggregate);
        setReviews(res.data);
        setRevPage({ current: res.page, pageSize: res.pageSize, total: res.total });
      } else {
        const job = jobCards.find(x => x.jobTitle === currentTitle);
        if (!job) return;
        const res = await userFeedbackApi.getJobDetails({ jobId: job.jobId, step: jobStep as any, page, pageSize: pageSize || revPage.pageSize });
        setRatingAgg(res.aggregate);
        setReviews(res.data);
        setRevPage({ current: res.page, pageSize: res.pageSize, total: res.total });
      }
    } finally {
      setDetailLoading(false);
    }
  };

  const renderCard = (item: any, onClick: () => void, extra?: React.ReactNode) => (
    <Card hoverable onClick={onClick} cover={
      item.thumbnail ? <img alt={item.packageName} src={item.thumbnail} style={{ height: 140, objectFit: 'cover' }}/> : undefined
    } style={{ marginBottom: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={5} style={{ margin: 0 }}>{item.packageName || item.jobTitle}</Title>
        <Space align="center">
          <Rate disabled value={Number(item.rating) || 0} allowHalf />
          <Text type="secondary">{Number(item.rating).toFixed(1)}</Text>
          <Badge count={item.reviewsCount} style={{ backgroundColor: '#52c41a' }} />
        </Space>
        {extra}
      </Space>
    </Card>
  );

  return (
    <div>
      <Title level={3}>用户反馈</Title>
      <Space style={{ marginBottom: 16 }} wrap>
        <Segmented
          value={mode}
          onChange={(v) => setMode(v as Mode)}
          options={[
            { label: '企业', value: 'enterprise' },
            { label: '求职者', value: 'job' }
          ]}
        />
        {mode === 'job' && (
          <Select
            allowClear
            placeholder="按流程筛选"
            style={{ width: 140 }}
            value={jobStep}
            onChange={(v) => setJobStep(v)}
            onClear={() => setJobStep(undefined)}
          >
            <Option value="投递">投递</Option>
            <Option value="筛选">筛选</Option>
            <Option value="面试">面试</Option>
            <Option value="录用">录用</Option>
            <Option value="入职">入职</Option>
          </Select>
        )}
        <Input.Search
          placeholder={mode === 'enterprise' ? '搜索推广套餐' : '搜索岗位'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={onSearch}
          allowClear
          style={{ width: 280 }}
        />
      </Space>

      {loading ? (
        <Row gutter={[16,16]}>
          {Array.from({ length: 8 }).map((_,i)=>(
            <Col xs={24} sm={12} md={8} lg={6} key={i}>
              <Card><Skeleton active /></Card>
            </Col>
          ))}
        </Row>
      ) : (
        <>
          {mode === 'enterprise' ? (
            <>
              <Row gutter={[16,16]}>
                {pkgCards.length === 0 && <Col span={24}><Empty /></Col>}
                {pkgCards.map((p:any)=>(
                  <Col xs={24} sm={12} md={8} lg={6} key={p.packageId}>
                    {renderCard(
                      p,
                      () => openEnterpriseDetail(p),
                      <Tag>{p.category}</Tag>
                    )}
                  </Col>
                ))}
              </Row>
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Pagination
                  current={pkgPage.current}
                  pageSize={pkgPage.pageSize}
                  total={pkgPage.total}
                  showSizeChanger
                  onChange={(c,s)=>loadEnterprise(c,s)}
                />
              </div>
            </>
          ) : (
            <>
              <Row gutter={[16,16]}>
                {jobCards.length === 0 && <Col span={24}><Empty /></Col>}
                {jobCards.map((j:any)=>(
                  <Col xs={24} sm={12} md={8} lg={6} key={j.jobId}>
                    {renderCard(j, () => openJobDetail(j))}
                  </Col>
                ))}
              </Row>
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Pagination
                  current={jobPage.current}
                  pageSize={jobPage.pageSize}
                  total={jobPage.total}
                  showSizeChanger
                  onChange={(c,s)=>loadJob(c,s)}
                />
              </div>
            </>
          )}
        </>
      )}

      <Modal
        open={detailOpen}
        title={currentTitle || '详情'}
        onCancel={()=>setDetailOpen(false)}
        footer={null}
        width={800}
      >
        {detailLoading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : ratingAgg ? (
          <>
            <Space align="center" size="large" style={{ width: '100%', marginBottom: 12 }}>
              <Title level={2} style={{ margin: 0 }}>{ratingAgg.avgRating.toFixed(1)}</Title>
              <Rate disabled value={ratingAgg.avgRating} allowHalf />
              <Text type="secondary">{ratingAgg.total} 条评价</Text>
            </Space>
            <div style={{ marginBottom: 16 }}>
              {ratingRows.map(r => (
                <div key={r.star} style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                  <Text style={{ width: 50 }}>{r.star} 星</Text>
                  <Progress percent={r.percent} showInfo={false} />
                  <Text style={{ width: 56, textAlign: 'right', marginLeft: 8 }}>{r.count}</Text>
                </div>
              ))}
            </div>
            {mode === 'job' && (
              <Space style={{ marginBottom: 12 }}>
                <Text type="secondary">流程筛选：</Text>
                <Select
                  allowClear
                  placeholder="选择流程"
                  style={{ width: 140 }}
                  value={jobStep}
                  onChange={(v) => setJobStep(v)}
                  onClear={() => setJobStep(undefined)}
                  onSelect={async () => {
                    // 重载当前详情
                    const job = jobCards.find(x => x.jobTitle === currentTitle);
                    if (job) openJobDetail(job);
                  }}
                >
                  <Option value="投递">投递</Option>
                  <Option value="筛选">筛选</Option>
                  <Option value="面试">面试</Option>
                  <Option value="录用">录用</Option>
                  <Option value="入职">入职</Option>
                </Select>
              </Space>
            )}
            <List
              dataSource={reviews}
              renderItem={(it:any)=>(
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <StarFilled style={{ color: '#faad14' }} />
                        <Text strong>{it.title || (it.rating >=4 ? '满意' : '一般')}</Text>
                        <Tag>{it.rating} 星</Tag>
                        <Text type="secondary">{new Date(it.createdAt).toLocaleDateString()}</Text>
                        {it.step && <Tag color="blue">{it.step}</Tag>}
                      </Space>
                    }
                    description={
                      <div>
                        <div style={{ marginBottom: 6 }}>{it.content}</div>
                        {it.pros && it.pros.length > 0 && (
                          <div style={{ marginBottom: 6 }}>
                            <Text type="secondary">优点：</Text>
                            <Space wrap>{it.pros.map((p:string)=><Tag color="green" key={p}>{p}</Tag>)}</Space>
                          </div>
                        )}
                        {it.cons && it.cons.length > 0 && (
                          <div style={{ marginBottom: 6 }}>
                            <Text type="secondary">不足：</Text>
                            <Space wrap>{it.cons.map((p:string)=><Tag color="red" key={p}>{p}</Tag>)}</Space>
                          </div>
                        )}
                        {it.suggestion && (
                          <div><Text type="secondary">建议：</Text>{it.suggestion}</div>
                        )}
                        <div style={{ marginTop: 6 }}><Text type="secondary">来自：</Text>{it.author}</div>
                      </div>
                    }
                  />
                </List.Item>
              )}
              pagination={{
                current: revPage.current,
                pageSize: revPage.pageSize,
                total: revPage.total,
                showSizeChanger: true,
                onChange: onDetailPageChange
              }}
            />
          </>
        ) : (
          <Empty />
        )}
      </Modal>
    </div>
  );
}