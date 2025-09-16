import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Input, 
  Switch, 
  Select, 
  Tabs, 
  Divider, 
  Avatar, 
  Upload, 
  message,
  Row,
  Col,
  Typography,
  Space,
  Form
} from 'antd';
import { 
  SettingOutlined, 
  UserOutlined, 
  BellOutlined, 
  SafetyOutlined, 
  DatabaseOutlined,
  MobileOutlined,
  MailOutlined,
  SaveOutlined,
  UploadOutlined,
  DownloadOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

export function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    alerts: true
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'zh',
    timezone: 'Asia/Shanghai',
    units: 'metric'
  });

  const [form] = Form.useForm();

  const handleSave = () => {
    message.success('设置已保存');
  };

  const handleExport = () => {
    message.success('数据导出成功');
  };

  const handleImport = () => {
    message.success('数据导入成功');
  };

  const handleDeleteAccount = () => {
    message.warning('删除账户功能暂未实现');
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px',
        background: 'white',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div>
          <Title level={2} style={{ marginBottom: '8px' }}>
            <SettingOutlined style={{ marginRight: '8px' }} />
            系统设置
          </Title>
          <Text type="secondary">管理您的账户和应用程序偏好设置</Text>
        </div>
        <Button 
          type="primary" 
          icon={<SaveOutlined />}
          onClick={handleSave}
          size="large"
        >
          保存更改
        </Button>
      </div>

      <Tabs defaultActiveKey="profile" size="large">
        <TabPane 
          tab={
            <span>
              <UserOutlined />
              个人资料
            </span>
          } 
          key="profile"
        >
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <Avatar 
                size={64} 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#52c41a', marginRight: '16px' }}
              />
              <div>
                <Title level={4} style={{ marginBottom: '4px' }}>张三</Title>
                <Text type="secondary">系统管理员</Text>
                <br />
                <Upload showUploadList={false}>
                  <Button size="small" style={{ marginTop: '8px' }}>
                    <UploadOutlined /> 更换头像
                  </Button>
                </Upload>
              </div>
            </div>

            <Form form={form} layout="vertical">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item label="姓名" name="name" initialValue="张三">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="邮箱" name="email" initialValue="zhangsan@example.com">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="电话" name="phone" initialValue="+86 138 0013 8000">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="角色" name="role" initialValue="admin">
                    <Select>
                      <Option value="admin">系统管理员</Option>
                      <Option value="manager">管理员</Option>
                      <Option value="operator">操作员</Option>
                      <Option value="viewer">查看者</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <BellOutlined />
              通知设置
            </span>
          } 
          key="notifications"
        >
          <Card>
            <Title level={4} style={{ marginBottom: '16px' }}>
              <BellOutlined style={{ marginRight: '8px' }} />
              通知偏好设置
            </Title>
            
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>邮件通知</Text>
                  <br />
                  <Text type="secondary">通过邮件接收通知</Text>
                </div>
                <Switch 
                  checked={notifications.email}
                  onChange={(checked) => setNotifications(prev => ({...prev, email: checked}))}
                />
              </div>
              
              <Divider />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>SMS通知</Text>
                  <br />
                  <Text type="secondary">通过短信接收重要提醒</Text>
                </div>
                <Switch 
                  checked={notifications.sms}
                  onChange={(checked) => setNotifications(prev => ({...prev, sms: checked}))}
                />
              </div>
              
              <Divider />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>推送通知</Text>
                  <br />
                  <Text type="secondary">浏览器推送通知</Text>
                </div>
                <Switch 
                  checked={notifications.push}
                  onChange={(checked) => setNotifications(prev => ({...prev, push: checked}))}
                />
              </div>
              
              <Divider />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>系统警报</Text>
                  <br />
                  <Text type="secondary">关键系统和设备警报</Text>
                </div>
                <Switch 
                  checked={notifications.alerts}
                  onChange={(checked) => setNotifications(prev => ({...prev, alerts: checked}))}
                />
              </div>
            </Space>
          </Card>

         
        </TabPane>

        <TabPane 
          tab={
            <span>
              <SettingOutlined />
              偏好设置
            </span>
          } 
          key="preferences"
        >
          <Card>
            <Title level={4} style={{ marginBottom: '16px' }}>应用程序偏好设置</Title>
            
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div>
                  <Text strong>主题</Text>
                  <Select 
                    value={preferences.theme} 
                    onChange={(value) => setPreferences(prev => ({...prev, theme: value}))}
                    style={{ width: '100%', marginTop: '4px' }}
                  >
                    <Option value="light">浅色</Option>
                    <Option value="dark">深色</Option>
                    <Option value="auto">自动</Option>
                  </Select>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div>
                  <Text strong>语言</Text>
                  <Select 
                    value={preferences.language} 
                    onChange={(value) => setPreferences(prev => ({...prev, language: value}))}
                    style={{ width: '100%', marginTop: '4px' }}
                  >
                    <Option value="zh">中文</Option>
                    <Option value="en">English</Option>
                    <Option value="ja">日本語</Option>
                  </Select>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div>
                  <Text strong>时区</Text>
                  <Select 
                    value={preferences.timezone} 
                    onChange={(value) => setPreferences(prev => ({...prev, timezone: value}))}
                    style={{ width: '100%', marginTop: '4px' }}
                  >
                    <Option value="Asia/Shanghai">北京时间 (UTC+8)</Option>
                    <Option value="America/New_York">纽约时间 (UTC-5)</Option>
                    <Option value="Europe/London">伦敦时间 (UTC+0)</Option>
                    <Option value="Asia/Tokyo">东京时间 (UTC+9)</Option>
                  </Select>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div>
                  <Text strong>单位制</Text>
                  <Select 
                    value={preferences.units} 
                    onChange={(value) => setPreferences(prev => ({...prev, units: value}))}
                    style={{ width: '100%', marginTop: '4px' }}
                  >
                    <Option value="metric">公制</Option>
                    <Option value="imperial">英制</Option>
                  </Select>
                </div>
              </Col>
            </Row>
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <SafetyOutlined />
              安全设置
            </span>
          } 
          key="security"
        >
          <Card>
            <Title level={4} style={{ marginBottom: '16px' }}>
              <SafetyOutlined style={{ marginRight: '8px' }} />
              安全设置
            </Title>
            
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Text strong>当前密码</Text>
                <Input.Password style={{ marginTop: '4px' }} />
              </div>
              <div>
                <Text strong>新密码</Text>
                <Input.Password style={{ marginTop: '4px' }} />
              </div>
              <div>
                <Text strong>确认新密码</Text>
                <Input.Password style={{ marginTop: '4px' }} />
              </div>
              <Button type="primary" danger>
                更新密码
              </Button>
            </Space>
          </Card>

          <Card style={{ marginTop: '16px' }}>
            <Title level={4} style={{ marginBottom: '16px' }}>双因素认证</Title>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong>启用2FA增强安全性</Text>
                <br />
                <Text type="secondary">使用手机验证登录尝试</Text>
              </div>
              <Button>启用2FA</Button>
            </div>
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <DatabaseOutlined />
              数据管理
            </span>
          } 
          key="data"
        >
          <Card>
            <Title level={4} style={{ marginBottom: '16px' }}>
              <DatabaseOutlined style={{ marginRight: '8px' }} />
              数据管理
            </Title>
            
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '16px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px'
              }}>
                <div>
                  <Text strong>导出系统数据</Text>
                  <br />
                  <Text type="secondary">下载所有系统数据为CSV/JSON格式</Text>
                </div>
                <Button icon={<DownloadOutlined />} onClick={handleExport}>
                  导出
                </Button>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '16px',
                border: '1px solid #d9d9d9',
                borderRadius: '6px'
              }}>
                <div>
                  <Text strong>导入数据</Text>
                  <br />
                  <Text type="secondary">从其他系统导入数据</Text>
                </div>
                <Button icon={<UploadOutlined />} onClick={handleImport}>
                  导入
                </Button>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '16px',
                border: '1px solid #ff4d4f',
                borderRadius: '6px',
                backgroundColor: '#fff2f0'
              }}>
                <div>
                  <Text strong style={{ color: '#ff4d4f' }}>删除账户</Text>
                  <br />
                  <Text type="secondary" style={{ color: '#ff7875' }}>
                    永久删除您的账户和所有数据
                  </Text>
                </div>
                <Button 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteAccount}
                >
                  删除
                </Button>
              </div>
            </Space>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
}