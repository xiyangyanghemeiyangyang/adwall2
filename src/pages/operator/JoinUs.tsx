import { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  message, 
  Typography, 
  Row, 
  Col, 
  Space,
  Collapse,
  Divider
} from 'antd';
import { 
  PhoneOutlined, 
  MailOutlined, 
  EnvironmentOutlined, 
  SendOutlined 
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

const JoinUs = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: FormData) => {
    setLoading(true);
    try {
      console.log('Form submitted:', values);
      // 这里通常会发送数据到后端
      message.success('消息发送成功！我们会尽快回复您。');
      form.resetFields();
    } catch (error) {
      message.error('发送失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      {/* Header Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        padding: '80px 16px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Title level={1} style={{ color: 'white', marginBottom: '24px', fontSize: '48px' }}>
            联系我们
          </Title>
          <Paragraph style={{ color: 'white', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
            我们在这里帮助您解决任何问题或提供支持需求
          </Paragraph>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '80px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[48, 48]}>
            {/* Contact Form */}
            <Col xs={24} lg={16}>
              <Card 
                style={{ 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                  border: 'none',
                  borderRadius: '12px'
                }}
              >
                <Title level={2} style={{ marginBottom: '32px', color: '#1f2937' }}>
                  发送消息给我们
                </Title>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  size="large"
                >
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="fullName"
                        label="姓名"
                        rules={[{ required: true, message: '请输入您的姓名' }]}
                      >
                        <Input placeholder="请输入您的姓名" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[
                          { required: true, message: '请输入您的邮箱' },
                          { type: 'email', message: '请输入有效的邮箱地址' }
                        ]}
                      >
                        <Input placeholder="请输入您的邮箱" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="phone"
                    label="电话号码"
                    rules={[{ required: true, message: '请输入您的电话号码' }]}
                  >
                    <Input placeholder="请输入您的电话号码" />
                  </Form.Item>
                  
                  <Form.Item
                    name="message"
                    label="消息内容"
                    rules={[{ required: true, message: '请输入消息内容' }]}
                  >
                    <TextArea 
                      rows={6} 
                      placeholder="告诉我们如何帮助您..."
                      style={{ resize: 'none' }}
                    />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      size="large"
                      style={{ 
                        width: '100%', 
                        height: '48px',
                        background: '#1890ff',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px'
                      }}
                      icon={<SendOutlined />}
                    >
                      发送消息
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            {/* Contact Info Sidebar */}
            <Col xs={24} lg={8}>
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Contact Information Card */}
                <Card 
                  style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                    border: 'none',
                    borderRadius: '12px'
                  }}
                >
                  <Title level={3} style={{ marginBottom: '24px', color: '#1f2937' }}>
                    联系信息
                  </Title>
                  
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ 
                        background: '#e6f7ff', 
                        padding: '12px', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <PhoneOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                      </div>
                      <div>
                        <Title level={5} style={{ margin: '0 0 4px 0', color: '#1f2937' }}>
                          客户服务
                        </Title>
                        <Text style={{ color: '#6b7280' }}>+86 138 0013 8000</Text>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ 
                        background: '#f6ffed', 
                        padding: '12px', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <MailOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
                      </div>
                      <div>
                        <Title level={5} style={{ margin: '0 0 4px 0', color: '#1f2937' }}>
                          邮箱地址
                        </Title>
                        <Text style={{ color: '#6b7280' }}>support@adwall.com</Text>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                      <div style={{ 
                        background: '#fff7e6', 
                        padding: '12px', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <EnvironmentOutlined style={{ fontSize: '20px', color: '#fa8c16' }} />
                      </div>
                      <div>
                        <Title level={5} style={{ margin: '0 0 4px 0', color: '#1f2937' }}>
                          办公地址
                        </Title>
                        <Text style={{ color: '#6b7280' }}>
                          北京市朝阳区建国门外大街1号<br />
                          国贸大厦A座2001室
                        </Text>
                      </div>
                    </div>
                  </Space>
                </Card>

                {/* Map Placeholder */}
                <Card 
                  style={{ 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                    border: 'none',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ 
                    background: '#f5f5f5', 
                    height: '200px', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}>
                    <EnvironmentOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '8px' }} />
                    <Text style={{ color: '#8c8c8c', fontSize: '16px' }}>办公位置地图</Text>
                    <Text style={{ color: '#bfbfbf', fontSize: '12px' }}>Google Maps 集成</Text>
                  </div>
                </Card>
              </Space>
            </Col>
          </Row>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '80px 16px', background: '#fafafa' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Title level={2} style={{ marginBottom: '16px', color: '#1f2937' }}>
              常见问题
            </Title>
            <Text style={{ color: '#6b7280', fontSize: '16px' }}>
              快速找到常见问题的答案
            </Text>
          </div>

          <Collapse 
            size="large"
            style={{ 
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <Panel 
              header="如何与您合作？" 
              key="1"
              style={{ 
                border: 'none',
                borderRadius: '8px',
                marginBottom: '8px'
              }}
            >
              <Text style={{ color: '#6b7280', lineHeight: '1.6' }}>
                您可以通过上方的联系表单或拨打我们的客服电话与我们联系。我们的业务专家将指导您完成整个合作流程，包括业务评估、文档准备和平台入驻。
              </Text>
            </Panel>
            
            <Panel 
              header="如何预约商务洽谈？" 
              key="2"
              style={{ 
                border: 'none',
                borderRadius: '8px',
                marginBottom: '8px'
              }}
            >
              <Text style={{ color: '#6b7280', lineHeight: '1.6' }}>
                您可以通过填写联系表单，提供您的业务详情和期望的洽谈时间。我们的团队将与您协调，安排一个方便的商务洽谈时间。我们也提供在线视频会议服务。
              </Text>
            </Panel>
            
            <Panel 
              header="合作需要准备哪些材料？" 
              key="3"
              style={{ 
                border: 'none',
                borderRadius: '8px',
                marginBottom: '8px'
              }}
            >
              <Text style={{ color: '#6b7280', lineHeight: '1.6' }}>
                合作通常需要准备：有效的营业执照、法人身份证、银行开户许可证、业务介绍材料、联系方式等。我们的团队将根据您的具体需求提供完整的材料清单。
              </Text>
            </Panel>
            
            <Panel 
              header="是否提供技术支持？" 
              key="4"
              style={{ 
                border: 'none',
                borderRadius: '8px'
              }}
            >
              <Text style={{ color: '#6b7280', lineHeight: '1.6' }}>
                是的，我们为所有合作伙伴提供全面的技术支持。这包括7x24小时紧急支持、定期技术培训、系统维护服务和技术咨询服务。您可以通过我们的客户支持渠道报告任何技术问题。
              </Text>
            </Panel>
          </Collapse>
        </div>
      </section>
    </div>
  );
};

export default JoinUs;