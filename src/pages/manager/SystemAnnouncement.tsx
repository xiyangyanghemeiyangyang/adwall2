// src/pages/manager/SystemAnnouncement.tsx
import { useEffect, useMemo, useState } from 'react';
import { Card, Tabs, Button, Modal, Form, Input, Select, Tag, Space, DatePicker, TimePicker, Row, Col, message, Popconfirm } from 'antd';
import type { Announcement, EventItem } from '../../api/manger/systemAnnouncement';
import {
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  togglePinAnnouncement,
  fetchEvents,
  createEvent,
  deleteEvent,
} from '../../api/manger/systemAnnouncement';
import dayjs from 'dayjs';

const { TabPane } = Tabs;
const { TextArea } = Input;

const priorityColors: Record<Announcement['priority'], string> = {
  Urgent: 'red',
  High: 'orange',
  Medium: 'blue',
  Low: 'default',
};

const eventTypeColors: Record<EventItem['eventType'], string> = {
  Academic: 'blue',
  Sports: 'green',
  Cultural: 'purple',
  Holiday: 'gold',
  Examination: 'red',
  Meeting: 'default',
};

const statusColors: Record<Announcement['status'] | EventItem['status'], string> = {
  Published: 'green',
  Scheduled: 'green',
  Ongoing: 'blue',
  Draft: 'gold',
  Completed: 'default',
  Cancelled: 'red',
  Archived: 'red',
};

export default function SystemAnnouncement() {
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);

  const [addAnnVisible, setAddAnnVisible] = useState(false);
  const [addEvtVisible, setAddEvtVisible] = useState(false);
  const [annForm] = Form.useForm();
  const [evtForm] = Form.useForm();

  const loadAll = async () => {
    setLoading(true);
    try {
      const [a, e] = await Promise.all([fetchAnnouncements(), fetchEvents()]);
      setAnnouncements(a);
      setEvents(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const metrics = useMemo(() => {
    return {
      activeAnnouncements: announcements.filter((a) => a.status === 'Published').length,
      upcomingEvents: events.filter((e) => e.status === 'Scheduled').length,
      pinned: announcements.filter((a) => a.isPinned).length,
      notificationsSent: 2847, // mock
    };
  }, [announcements, events]);

  const onAddAnnouncement = async () => {
    const values = await annForm.validateFields();
    await createAnnouncement({
      title: values.title,
      content: values.content,
      priority: values.priority,
      targetAudience: values.targetAudience || [],
      expiryDate: values.expiryDate ? dayjs(values.expiryDate).format('YYYY-MM-DD') : undefined,
    });
    message.success('已发布公告');
    setAddAnnVisible(false);
    annForm.resetFields();
    loadAll();
  };

  const onAddEvent = async () => {
    const values = await evtForm.validateFields();
    await createEvent({
      title: values.title,
      description: values.description,
      eventType: values.eventType,
      startDate: values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : '',
      endDate: values.endDate ? dayjs(values.endDate).format('YYYY-MM-DD') : '',
      startTime: values.startTime ? dayjs(values.startTime).format('HH:mm') : '',
      endTime: values.endTime ? dayjs(values.endTime).format('HH:mm') : '',
      location: values.location,
      participants: values.participants || [],
    });
    message.success('已创建活动');
    setAddEvtVisible(false);
    evtForm.resetFields();
    loadAll();
  };

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <div>
        <h2 style={{ margin: 0 }}>系统公告与活动</h2>
        <div style={{ color: '#999' }}>管理系统公告与即将发生的活动</div>
      </div>

      <Row gutter={16}>
        <Col xs={24} md={6}>
          <Card loading={loading}>
            <div style={{ fontSize: 12, color: '#666' }}>Active Announcements</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{metrics.activeAnnouncements}</div>
            <div style={{ fontSize: 12, color: '#999' }}>Currently published</div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card loading={loading}>
            <div style={{ fontSize: 12, color: '#666' }}>Upcoming Events</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{metrics.upcomingEvents}</div>
            <div style={{ fontSize: 12, color: '#999' }}>Next 30 days</div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card loading={loading}>
            <div style={{ fontSize: 12, color: '#666' }}>Pinned Items</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{metrics.pinned}</div>
            <div style={{ fontSize: 12, color: '#999' }}>High priority</div>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card loading={loading}>
            <div style={{ fontSize: 12, color: '#666' }}>Notifications Sent</div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{metrics.notificationsSent}</div>
            <div style={{ fontSize: 12, color: '#999' }}>This month</div>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="announcements">
        <TabPane tab="公告" key="announcements">
          <Card
            title={
              <div>
                <div style={{ fontWeight: 600 }}>Announcements</div>
                <div style={{ color: '#999' }}>Manage system-wide announcements</div>
              </div>
            }
            extra={
              <Button type="primary" onClick={() => setAddAnnVisible(true)}>
                New Announcement
              </Button>
            }
            loading={loading}
          >
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {announcements.map((a) => (
                <Card
                  key={a.id}
                  size="small"
                  title={
                    <Space size={8} wrap>
                      {a.isPinned && <Tag color="gold">Pinned</Tag>}
                      <span style={{ fontWeight: 600 }}>{a.title}</span>
                      <Tag color={priorityColors[a.priority]}>{a.priority}</Tag>
                    </Space>
                  }
                  extra={
                    <Space>
                      <Button size="small" onClick={async () => { await togglePinAnnouncement(a.id); loadAll(); }}>
                        {a.isPinned ? '取消置顶' : '置顶'}
                      </Button>
                      {/* 可拓展编辑功能 */}
                      <Popconfirm title="确定删除该公告？" onConfirm={async () => { await deleteAnnouncement(a.id); message.success('已删除'); loadAll(); }}>
                        <Button size="small" danger>
                          删除
                        </Button>
                      </Popconfirm>
                    </Space>
                  }
                >
                  <div style={{ color: '#555', marginBottom: 8 }}>{a.content}</div>
                  <Space split="•" style={{ fontSize: 12, color: '#888' }}>
                    <span>By {a.author}</span>
                    <span>{a.publishDate}</span>
                    {a.expiryDate && <span>Expires: {a.expiryDate}</span>}
                  </Space>
                  <div style={{ marginTop: 8 }}>
                    <Space size={[4, 4]} wrap>
                      {a.targetAudience.map((aud) => (
                        <Tag key={aud}>{aud}</Tag>
                      ))}
                    </Space>
                  </div>
                </Card>
              ))}
            </Space>
          </Card>
        </TabPane>

        <TabPane tab="事件" key="events">
          <Card
            title={
              <div>
                <div style={{ fontWeight: 600 }}>Events Calendar</div>
                <div style={{ color: '#999' }}>Manage events and activities</div>
              </div>
            }
            extra={
              <Button type="primary" onClick={() => setAddEvtVisible(true)}>
                New Event
              </Button>
            }
            loading={loading}
          >
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              {events.map((e) => (
                <Card
                  key={e.id}
                  size="small"
                  title={
                    <Space size={8} wrap>
                      <span style={{ fontWeight: 600 }}>{e.title}</span>
                      <span style={{ color: '#888' }}>{e.location}</span>
                      <Tag color={eventTypeColors[e.eventType]}>{e.eventType}</Tag>
                    </Space>
                  }
                  extra={
                    <Space>
                      <Tag color={statusColors[e.status]}>{e.status}</Tag>
                      <Popconfirm title="确定删除该活动？" onConfirm={async () => { await deleteEvent(e.id); message.success('已删除'); loadAll(); }}>
                        <Button size="small" danger>
                          删除
                        </Button>
                      </Popconfirm>
                    </Space>
                  }
                >
                  <div style={{ color: '#555', marginBottom: 8 }}>{e.description}</div>
                  <Space split="•" style={{ fontSize: 12, color: '#888' }}>
                    <span>
                      {e.startDate} - {e.endDate}
                    </span>
                    <span>
                      {e.startTime} - {e.endTime}
                    </span>
                    <span>Organized by {e.organizer}</span>
                  </Space>
                  <div style={{ marginTop: 8 }}>
                    <Space size={[4, 4]} wrap>
                      {e.participants.map((p) => (
                        <Tag key={p}>{p}</Tag>
                      ))}
                    </Space>
                  </div>
                </Card>
              ))}
            </Space>
          </Card>
        </TabPane>
      </Tabs>

      {/* 新建公告 */}
      <Modal
        title="Create New Announcement"
        open={addAnnVisible}
        onCancel={() => setAddAnnVisible(false)}
        onOk={onAddAnnouncement}
        okText="Publish"
        okType='primary'
        okButtonProps={{ type: 'primary' }}
        
        destroyOnClose
      >
        <Form form={annForm} layout="vertical" preserve={false}>
          <Form.Item label="Title" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Content" name="content" rules={[{ required: true, message: '请输入内容' }]}>
            <TextArea rows={4} />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Priority" name="priority" initialValue="Medium">
                <Select
                  options={[
                    { value: 'Low', label: 'Low' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'High', label: 'High' },
                    { value: 'Urgent', label: 'Urgent' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Expiry Date" name="expiryDate">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Target Audience" name="targetAudience">
            <Select
              mode="multiple"
              options={['Students', 'Teachers', 'Parents', 'Staff'].map((v) => ({ value: v, label: v }))}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 新建活动 */}
      <Modal
        title="Create New Event"
        open={addEvtVisible}
        onCancel={() => setAddEvtVisible(false)}
        onOk={onAddEvent}
        okText="Create"
        okType='primary'
        okButtonProps={{ type: 'primary' }}
        
        destroyOnClose
      >
        <Form form={evtForm} layout="vertical" preserve={false}>
          <Form.Item label="Event Title" name="title" rules={[{ required: true, message: '请输入活动标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: '请输入描述' }]}>
            <TextArea rows={3} />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Event Type" name="eventType" initialValue="Academic">
                <Select
                  options={[
                    'Academic',
                    'Sports',
                    'Cultural',
                    'Holiday',
                    'Examination',
                    'Meeting',
                  ].map((v) => ({ value: v, label: v }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Location" name="location" rules={[{ required: true, message: '请输入地点' }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Start Date" name="startDate" rules={[{ required: true, message: '请选择开始日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="End Date" name="endDate" rules={[{ required: true, message: '请选择结束日期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Start Time" name="startTime" rules={[{ required: true, message: '请选择开始时间' }]}>
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="End Time" name="endTime" rules={[{ required: true, message: '请选择结束时间' }]}>
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Participants" name="participants">
            <Select
              mode="multiple"
              options={['Students', 'Teachers', 'Parents', 'Staff'].map((v) => ({ value: v, label: v }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}