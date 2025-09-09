import { useState } from 'react';
import { Form, Input, Button, message, Tabs, Checkbox, Typography, QRCode } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, MailOutlined, QrcodeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import appPreviewImg from '../assets/OIP-C.jpg';
const { Title, Paragraph, Text } = Typography;

interface LoginFormValues {
  username: string;
  password: string;
}

interface RegisterFormValues {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
  agreement: boolean;
}

// 动画效果
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
`;

// 定义styled-components
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #edf5ff 0%, #e6f0ff 100%);
`;

const LeftSection = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 4rem;
  position: relative;
  background-color: #f5f9ff;
  background-image: linear-gradient(135deg, rgba(240, 247, 255, 0.8) 0%, rgba(232, 244, 255, 0.8) 100%);
  
  @media (max-width: 992px) {
    display: none;
  }
`;

const RightSection = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  
  @media (max-width: 992px) {
    width: 100%;
  }
`;

const Logo = styled.div`
  position: absolute;
  top: 30px;
  left: 40px;
  display: flex;
  align-items: center;
  
  .logo-svg {
    height: 50px;
    margin-right: 10px;
  }
  
  .logo-text {
    font-size: 24px;
    font-weight: bold;
    color: #2468f2;
  }
`;

const AboutLink = styled.a`
  position: absolute;
  top: 30px;
  right: 40px;
  font-size: 14px;
  color: #666;
  
  &:hover {
    color: #2468f2;
  }
`;

const QrCodeModal = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f0f7ff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: ${fadeIn} 0.3s ease-out forwards;
  
  .qrcode-container {
    border: 2px solid #f0f0f0;
    background: white;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 16px;
  }
  
  .back-btn {
    margin-top: 20px;
    padding: 8px 16px;
    background: white;
    border-radius: 4px;
    color: #2468f2;
    cursor: pointer;
    font-size: 14px;
    border: 1px solid #e8e8e8;
    
    &:hover {
      color: #4785f8;
      border-color: #4785f8;
    }
  }
`;

const AppPreview = styled.div`
  margin-bottom: 40px;
  
  img {
    width: 300px;
    animation: ${float} 6s ease-in-out infinite;
  }
`;

const DownloadSection = styled.div`
  margin-top: 20px;
`;

const DownloadButton = styled(Button)`
  background: #2468f2;
  border-color: #2468f2;
  height: 42px;
  padding: 0 24px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 21px;
  
  &:hover, &:focus {
    background: #4785f8;
    border-color: #4785f8;
  }
`;

const WelcomeBox = styled.div`
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.8s ease-out forwards;
  position: relative;
`;

const TabsWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const QrCodeBtn = styled(Button)`
  position: absolute;
  right: 0;
  top: 8px;
  z-index: 2;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 50%;
  color: #2468f2;
  border-color: #2468f2;
  
  &:hover {
    color: #4785f8;
    border-color: #4785f8;
  }
`;

const StyledTabs = styled(Tabs)`
  .ant-tabs-nav {
    margin-bottom: 24px;
  }

  .ant-tabs-nav-list {
    display: flex;
    width: 100%;
  }

  .ant-tabs-tab {
    flex: 1;
    justify-content: center;
    font-size: 14px;
    padding: 8px 0;
    margin: 0;
  }

  .ant-tabs-tab + .ant-tabs-tab {
    margin-left: 0;
  }

  .ant-tabs-ink-bar {
    background: #2468f2;
    height: 3px;
  }

  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #2468f2;
    font-weight: 500;
  }
`;

const StyledInput = styled(Input)`
  height: 42px;
  border-radius: 4px;
  padding-left: 12px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s;
  background-color: #f9f9f9;
  
  &:hover, &:focus {
    border-color: #2468f2;
    background-color: white;
    box-shadow: 0 0 0 2px rgba(36, 104, 242, 0.1);
  }
  
  .ant-input-prefix {
    margin-right: 10px;
    color: #bfbfbf;
  }
`;

const StyledPasswordInput = styled(Input.Password)`
  height: 42px;
  border-radius: 4px;
  padding-left: 12px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s;
  background-color: #f9f9f9;
  
  &:hover, &:focus {
    border-color: #2468f2;
    background-color: white;
    box-shadow: 0 0 0 2px rgba(36, 104, 242, 0.1);
  }
  
  .ant-input-prefix {
    margin-right: 10px;
    color: #bfbfbf;
  }
`;

const LoginButton = styled(Button)`
  height: 48px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  background: #2468f2;
  border: none;
  width: 100%;
  margin-top: 10px;
  
  &:hover, &:focus {
    background: #4785f8;
  }
`;


const RegisterLink = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  
  a {
    color: #2468f2;
    font-size: 14px;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const RegisterForm = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: white;
  padding: 30px;
  border-radius: 10px;
  z-index: 5;
  animation: ${fadeIn} 0.3s ease-out forwards;
  
  .form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    
    h3 {
      margin: 0;
      font-size: 20px;
      color: #333;
      font-weight: 500;
    }
    
    .back-btn {
      color: #2468f2;
      cursor: pointer;
      font-size: 15px;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
`;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1');
  const [showRegister, setShowRegister] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  // 模拟动画效果
  

  const onLoginFinish = (values: LoginFormValues) => {
    setLoading(true);
    
    // 模拟登录请求
    setTimeout(() => {
      if (values.username === 'admin' && values.password === '123456') {
        message.success('登录成功，即将进入工作台');
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('user', JSON.stringify({ name: 'Admin', role: 'administrator' }));
        navigate('/workbench/homepage');
      } else {
        message.error('用户名或密码错误');
      }
      setLoading(false);
    }, 1000);
  };

  const onRegisterFinish = (_values: RegisterFormValues) => {
    setRegisterLoading(true);
    
    // 模拟注册请求
    setTimeout(() => {
      message.success('注册成功，请登录');
      setShowRegister(false);
      setActiveTab('1');
      setRegisterLoading(false);
    }, 1500);
  };

  // 模拟检查工作台名称是否被占用
  const checkWorkbenchName = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('请输入工作台名称'));
    }
    
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (value === 'admin' || value === 'test') {
          reject(new Error('该工作台名称已被占用'));
        } else {
          resolve();
        }
      }, 500);
    });
  };

  const tabItems = [
    {
      key: '1',
      label: '密码登录',
      children: (
        <Form
          name="login"
          onFinish={onLoginFinish}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入账号名/邮箱/手机号' }]}
          >
            <StyledInput
              prefix={<UserOutlined />} 
              placeholder="账号名/邮箱/手机号" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <StyledPasswordInput
              prefix={<LockOutlined />} 
              placeholder="请输入登录密码" 
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <Checkbox>记住密码</Checkbox>
              <a href="#" style={{ color: '#2468f2' }}>忘记密码</a>
            </div>
            <LoginButton type="primary" htmlType="submit" loading={loading}>
              登录
            </LoginButton>
          </Form.Item>
          
          <RegisterLink>
            <a onClick={() => setShowRegister(true)}>没有账号？立即注册</a>
          </RegisterLink>
        </Form>
      ),
    },
    {
      key: '2',
      label: '短信登录',
      children: (
        <Form
          name="sms_login"
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1\d{10}$/, message: '手机号格式不正确' }
            ]}
          >
            <StyledInput
              prefix={<MobileOutlined />} 
              placeholder="手机号" 
            />
          </Form.Item>

          <Form.Item
            name="sms"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <div style={{ display: 'flex' }}>
              <StyledInput 
                style={{ flex: 1, marginRight: 8 }} 
                placeholder="请输入验证码" 
              />
              <Button style={{ width: 120 }}>获取验证码</Button>
            </div>
          </Form.Item>
          
          <Form.Item>
            <LoginButton type="primary" htmlType="submit">
              登录
            </LoginButton>
          </Form.Item>
          
          <RegisterLink>
            <a onClick={() => setShowRegister(true)}>没有账号？立即注册</a>
          </RegisterLink>
        </Form>
      ),
    },
  ];

  return (
    <LoginContainer>
      <Logo>
        <div className="logo-svg">
          <svg width="120" height="50" viewBox="0 0 240 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20,40 Q60,10 100,40 T180,40" stroke="#2468f2" strokeWidth="8" fill="none" />
            <path d="M30,70 Q70,40 110,70 T190,70" stroke="#333" strokeWidth="6" fill="none" />
            <circle cx="200" cy="35" r="15" fill="#2468f2" />
          </svg>
        </div>
        <span className="logo-text">壁纸平台</span>
      </Logo>
      
      <AboutLink href="#">关于壁纸平台</AboutLink>
      
      <LeftSection>
        <Title level={2} style={{ fontSize: "32px", marginBottom: "10px", color: "#333", fontWeight: "bold" }}>
          壁纸平台
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#666', marginBottom: '40px' }}>
          随时随地，设计美好
        </Paragraph>
        
        <AppPreview style={{ textAlign: 'center', width: '100%' }}>
          <img src={appPreviewImg} alt="App Preview" style={{ maxWidth: '380px', width: '100%' }} />
        </AppPreview>
        
        <DownloadSection>
          <DownloadButton type="primary">
          立即入驻 &gt;
          </DownloadButton>
        </DownloadSection>
      </LeftSection>
      
      <RightSection>
        <WelcomeBox>
          <Title level={2} style={{ fontSize: "24px", marginBottom: "8px", color: "#333" }}>
            欢迎登录
          </Title>
          <Text style={{ color: '#666' }}>做生意上壁纸平台</Text>
        </WelcomeBox>
        
        <FormCard>
          {showQrCode ? (
            <QrCodeModal>
              <Text style={{ marginBottom: '20px', fontSize: '16px' }}>请使用手机扫一扫登录</Text>
              <div className="qrcode-container">
                <QRCode 
                  value="https://example.com/login/qr" 
                  size={180} 
                  bordered={false}
                />
              </div>
              <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px' }}>
                扫码登录更快捷，无需记住密码
              </Text>
              <div className="back-btn" onClick={() => setShowQrCode(false)}>
                返回账号登录
              </div>
            </QrCodeModal>
          ) : (
            <>
              <TabsWrapper>
                <StyledTabs 
                  activeKey={activeTab} 
                  onChange={setActiveTab} 
                  items={tabItems} 
                />
                <QrCodeBtn
                  type="default"
                  icon={<QrcodeOutlined />}
                  onClick={() => setShowQrCode(true)}
                />
              </TabsWrapper>
              
              {showRegister && (
                <RegisterForm>
                  <div className="form-header">
                    <h3>立即注册</h3>
                    <div className="back-btn" onClick={() => setShowRegister(false)}>返回登录</div>
                  </div>
                  
                  <Form
                    name="register"
                    onFinish={onRegisterFinish}
                    size="large"
                    layout="vertical"
                    style={{ marginTop: 10 }}
                  >
                    <Form.Item
                      name="username"
                      rules={[
                        { required: true, message: '请输入用户名' },
                        { validator: checkWorkbenchName }
                      ]}
                    >
                      <StyledInput
                        prefix={<UserOutlined />} 
                        placeholder="设置工作台名称" 
                      />
                    </Form.Item>

                    <Form.Item
                      name="password"
                      rules={[
                        { required: true, message: '请输入密码' },
                        { min: 6, message: '密码长度不能小于6位' }
                      ]}
                    >
                      <StyledPasswordInput
                        prefix={<LockOutlined />} 
                        placeholder="设置密码" 
                      />
                    </Form.Item>

                    <Form.Item
                      name="confirmPassword"
                      dependencies={['password']}
                      rules={[
                        { required: true, message: '请确认密码' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('两次输入的密码不一致'));
                          },
                        }),
                      ]}
                    >
                      <StyledPasswordInput
                        prefix={<LockOutlined />} 
                        placeholder="确认密码" 
                      />
                    </Form.Item>

                    <Form.Item
                      name="phone"
                      rules={[
                        { required: true, message: '请输入手机号' },
                        { pattern: /^1\d{10}$/, message: '手机号格式不正确' }
                      ]}
                    >
                      <StyledInput
                        prefix={<MobileOutlined />} 
                        placeholder="手机号" 
                      />
                    </Form.Item>

                    <Form.Item
                      name="email"
                      rules={[
                        { required: true, message: '请输入邮箱' },
                        { type: 'email', message: '邮箱格式不正确' }
                      ]}
                    >
                      <StyledInput
                        prefix={<MailOutlined />} 
                        placeholder="邮箱" 
                      />
                    </Form.Item>

                    <Form.Item
                      name="agreement"
                      valuePropName="checked"
                      rules={[
                        { 
                          validator: (_, value) => 
                            value ? Promise.resolve() : Promise.reject(new Error('请阅读并同意服务条款')) 
                        },
                      ]}
                    >
                      <Checkbox>
                        我已阅读并同意 <a href="#" style={{ color: '#2468f2' }}>服务条款</a> 和 <a href="#" style={{ color: '#2468f2' }}>隐私政策</a>
                      </Checkbox>
                    </Form.Item>

                    <Form.Item>
                      <LoginButton type="primary" htmlType="submit" loading={registerLoading}>
                        立即注册
                      </LoginButton>
                    </Form.Item>
                  </Form>
                </RegisterForm>
              )}
            </>
          )}
        </FormCard>
      </RightSection>
    </LoginContainer>
  );
};

export default Login;
