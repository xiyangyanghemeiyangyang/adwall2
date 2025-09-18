// src/pages/manager/PromotionalPackages.tsx
import { useEffect, useMemo, useState } from 'react';
import { Card, Row, Col, Input, Segmented, Badge, Button, Modal, Typography, List, Divider, Space, Tag, Form, message, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ShoppingCartOutlined, ClockCircleOutlined, StarFilled, CheckCircleTwoTone, PauseCircleOutlined, StopOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { promoApi, type PromotionalPackage, type PromotionalOrder } from '../../api/manger/promotionalPackages';

const { Title, Text, Paragraph } = Typography;

const categoryOptions = [
  { label: '全部', value: 'all' },
  { label: '社交媒体', value: 'social' },
  { label: 'SEO', value: 'seo' },
  { label: '内容营销', value: 'content' },
  { label: 'SEM', value: 'sem' },
  { label: 'Branding', value: 'branding' }
];

const statusColor: Record<string, string> = {
  '待审核': 'gold',
  '投放中': 'processing',
  '已完成': 'success',
  '已暂停': 'warning',
  '已取消': 'default'
};

export default function PromotionalPackages() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<PromotionalPackage[]>([]);
  const [pkgPage, setPkgPage] = useState({ current: 1, pageSize: 6, total: 0 });

  const [detailOpen, setDetailOpen] = useState(false);
  const [currentPkg, setCurrentPkg] = useState<PromotionalPackage | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [orderForm] = Form.useForm();

  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orders, setOrders] = useState<PromotionalOrder[]>([]);
  const [orderPage, setOrderPage] = useState({ current: 1, pageSize: 5, total: 0 });

  const fetchPackages = async (page = 1, pageSize = pkgPage.pageSize) => {
    setLoading(true);
    try {
      const res = await promoApi.listPackages({ search, category, page, pageSize });
      setPackages(res.data);
      setPkgPage({ current: res.page, pageSize: res.pageSize, total: res.total });
    } catch (e: any) {
      message.error(e.message || '获取套餐失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (page = 1, pageSize = orderPage.pageSize) => {
    setOrdersLoading(true);
    try {
      const res = await promoApi.listOrders({ page, pageSize });
      setOrders(res.data);
      setOrderPage({ current: res.page, pageSize: res.pageSize, total: res.total });
    } catch (e: any) {
      message.error(e.message || '获取订单失败');
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages(1, pkgPage.pageSize);
    fetchOrders(1, orderPage.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPrice = useMemo(() => {
    if (!currentPkg) return 0;
    const base = currentPkg.price;
    const addon = selectedOptions.reduce((sum, name) => {
      const opt = currentPkg.options.find((o) => o.name === name);
      return sum + (opt?.price || 0);
    }, 0);
    return base + addon;
  }, [currentPkg, selectedOptions]);

  const openDetail = (pkg: PromotionalPackage) => {
    setCurrentPkg(pkg);
    setSelectedOptions([]);
    orderForm.resetFields();
    setDetailOpen(true);
  };

  const placeOrder = async () => {
    if (!currentPkg) return;
    try {
      const values = await orderForm.validateFields();
      await promoApi.createOrder({
        packageId: currentPkg.id,
        price: totalPrice,
        selectedOptions,
        brief: values.brief,
        link: values.link,
        targetCity: values.targetCity
      });
      message.success('下单成功，等待审核');
      setDetailOpen(false);
      fetchOrders(orderPage.current, orderPage.pageSize);
    } catch (e: any) {
      if (e?.errorFields) return; // 校验错误
      message.error(e.message || '下单失败');
    }
  };

  const onOrderAction = async (record: PromotionalOrder, action: 'pause' | 'resume' | 'cancel' | 'renew') => {
    try {
      if (action === 'pause') await promoApi.pauseOrder(record.id);
      if (action === 'resume') await promoApi.resumeOrder(record.id);
      if (action === 'cancel') await promoApi.cancelOrder(record.id);
      if (action === 'renew') await promoApi.renewOrder(record.id, 1);
      message.success('操作成功');
      fetchOrders(orderPage.current, orderPage.pageSize);
    } catch (e: any) {
      message.error(e.message || '操作失败');
    }
  };

  const orderColumns: ColumnsType<PromotionalOrder> = [
    { title: '套餐名称', dataIndex: 'packageName', key: 'packageName' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (s: PromotionalOrder['status']) => <Badge status={s === '投放中' ? 'processing' : s === '已完成' ? 'success' : s === '待审核' ? 'warning' : s === '已暂停' ? 'default' : 'error'} text={<Tag color={statusColor[s]}>{s}</Tag>} />
    },
    { title: '订单日期', dataIndex: 'orderDate', key: 'orderDate' },
    {
      title: '投放周期',
      key: 'period',
      render: (_, r) => <Text type="secondary">{r.startDate && r.endDate ? `${r.startDate} ~ ${r.endDate}` : '-'}</Text>
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (p) => <Text strong style={{ color: '#52c41a' }}>¥{p}</Text>
    },
    {
      title: '操作',
      key: 'action',
      render: (_, r) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => message.info('可跳转到订单详情页（未实现）')} style={{ color: '#69b1ff' }}>详情</Button>
          {r.status === '投放中' && <Button type="link" icon={<PauseCircleOutlined />} onClick={() => onOrderAction(r, 'pause')} style={{ color: '#faad14' }}>暂停</Button>}
          {r.status === '已暂停' && <Button type="link" icon={<ReloadOutlined />} onClick={() => onOrderAction(r, 'resume')} style={{ color: '#69b1ff' }}>恢复</Button>}
          {(r.status === '待审核' || r.status === '投放中' || r.status === '已暂停') && (
            <Button type="link" danger icon={<StopOutlined />} onClick={() => onOrderAction(r, 'cancel')}>终止</Button>
          )}
          {(r.status === '已暂停' || r.status === '已完成') && (
            <Button type="link" onClick={() => onOrderAction(r, 'renew')} style={{ color: '#52c41a' }}>续订</Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4} style={{ margin: 0 }}>推广套餐</Title>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input.Search
              allowClear
              placeholder="搜索套餐名称/描述"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={() => fetchPackages(1, pkgPage.pageSize)}
            />
          </Col>
          <Col xs={24} sm={12} md={10}>
            <Segmented
              options={categoryOptions}
              value={category}
              onChange={(v) => setCategory(v as string)}
            />
          </Col>
          <Col xs={24} sm="auto">
            <Space>
              <Button onClick={() => fetchPackages(1, pkgPage.pageSize)} type="link" style={{ color: '#69b1ff' }}>筛选</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {packages.map((pkg) => (
          <Col xs={24} md={12} lg={8} key={pkg.id}>
            <Card
              hoverable
              loading={loading}
              cover={<img alt={pkg.name} src={pkg.thumbnail} style={{ height: 180, objectFit: 'cover' }} />}
              actions={[
                <Button type="link" onClick={() => openDetail(pkg)} style={{ color: '#69b1ff' }} icon={<ShoppingCartOutlined />}>购买</Button>
              ]}
            >
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <Space wrap>
                  <Title level={5} style={{ margin: 0 }}>{pkg.name}</Title>
                  {pkg.isNew && <Tag color="green">新上线</Tag>}
                  {pkg.isPopular && <Tag color="orange">热门</Tag>}
                </Space>
                <Text type="secondary">{pkg.shortDescription}</Text>
                <Space align="center">
                  {typeof pkg.rating === 'number' && (
                    <>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarFilled key={i} style={{ color: i < Math.floor(pkg.rating!) ? '#faad14' : '#d9d9d9' }} />
                      ))}
                      <Text type="secondary">{pkg.rating}</Text>
                      <Text type="secondary">({pkg.reviewsCount})</Text>
                    </>
                  )}
                </Space>
                <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                  <Text strong style={{ color: '#52c41a' }}>{pkg.priceLabel}</Text>
                  <Text type="secondary"><ClockCircleOutlined /> {pkg.deliveryTime}</Text>
                </Space>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: 16, textAlign: 'right' }}>
        <Text type="secondary">共 {pkgPage.total} 条</Text>
      </div>

      <Divider />

      <Title level={5}>我的推广</Title>
      <Card>
        <Table
          rowKey="id"
          columns={orderColumns}
          dataSource={orders}
          loading={ordersLoading}
          pagination={{
            ...orderPage,
            showSizeChanger: false,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`
          }}
          onChange={(p) => fetchOrders(p.current!, p.pageSize!)}
        />
      </Card>

      <Modal
        title={currentPkg?.name}
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        onOk={placeOrder}
        okText="确认下单"
        okButtonProps={{ type: 'default' }}
        width={900}
        destroyOnClose
      >
        {currentPkg && (
          <Row gutter={[16, 16]}>
            <Col xs={24} md={14}>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <img src={currentPkg.thumbnail} alt={currentPkg.name} style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 8 }} />
                <div>
                  <Title level={5}>详细描述</Title>
                  <Paragraph>{currentPkg.description}</Paragraph>
                </div>
                <div>
                  <Title level={5}>包含服务</Title>
                  <List
                    size="small"
                    dataSource={currentPkg.includes}
                    renderItem={(i) => (
                      <List.Item style={{ padding: '6px 0' }}>
                        <Space>
                          <CheckCircleTwoTone twoToneColor="#52c41a" />
                          <Text>{i}</Text>
                        </Space>
                      </List.Item>
                    )}
                  />
                </div>
                <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                  <Text strong style={{ color: '#52c41a' }}>{currentPkg.priceLabel}</Text>
                  <Text type="secondary"><ClockCircleOutlined /> {currentPkg.deliveryTime}</Text>
                </Space>
              </Space>
            </Col>
            <Col xs={24} md={10}>
              <Card size="small" title="自定义订单">
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  {currentPkg.options.length > 0 && (
                    <div>
                      <Text type="secondary">附加选项</Text>
                      <div style={{ marginTop: 8 }}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          {currentPkg.options.map((opt) => {
                            const checked = selectedOptions.includes(opt.name);
                            return (
                              <div key={opt.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa', padding: 8, borderRadius: 6 }}>
                                <Space>
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={(e) => {
                                      if (e.target.checked) setSelectedOptions((arr) => [...arr, opt.name]);
                                      else setSelectedOptions((arr) => arr.filter((n) => n !== opt.name));
                                    }}
                                  />
                                  <Text>{opt.name}</Text>
                                </Space>
                                <Text style={{ color: '#52c41a' }}>+¥{opt.price}</Text>
                              </div>
                            );
                          })}
                        </Space>
                      </div>
                    </div>
                  )}

                  <Form form={orderForm} layout="vertical">
                    <Form.Item name="brief" label="推广需求简述" rules={[{ required: true, message: '请填写需求' }]}>
                      <Input.TextArea rows={4} placeholder="例如：岗位链接、目标城市、投放目标等" />
                    </Form.Item>
                    <Form.Item name="link" label="岗位/落地页链接" rules={[{ required: true, message: '请填写链接' }]}>
                      <Input placeholder="https://..." />
                    </Form.Item>
                    <Form.Item name="targetCity" label="目标城市">
                      <Input placeholder="例如：上海、北京、杭州" />
                    </Form.Item>
                  </Form>

                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Text>总价</Text>
                    <Title level={4} style={{ margin: 0, color: '#52c41a' }}>¥{totalPrice}</Title>
                  </Space>
                </Space>
              </Card>
            </Col>
          </Row>
        )}
      </Modal>
    </div>
  );
}