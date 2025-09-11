import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, 
  Tabs, 
  Form, 
  Input, 
  Button, 
  Radio, 
  message, 
  Typography, 
  Space } from 'antd';
  import axios from 'axios';
  import { QRCode } from 'antd';

const { Title, Text } = Typography;

type RoleType = 'manager' | 'operator';

interface StoredUser {
  username: string;
  password: string;
  role: RoleType;
}

const STORAGE_KEY = 'auth_users';

const readUsers = (): StoredUser[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveUsers = (users: StoredUser[]) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(users)); } catch {}
};

const API_BASE = (typeof window !== 'undefined' && window.location.hostname === 'labelwall.com')
  ? 'https://labelwall.com'
  : 'http://localhost:3001';

const Login = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('login');
  const [loading, setLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [wxState, setWxState] = useState<string>('');
  const [wxQrUrl, setWxQrUrl] = useState<string>('');
  const [wxLoading , setWxLoading] = useState(false);
  const [wxTimer , setWxTimer] = useState<number| null>(null);

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const users = readUsers();
      const found = users.find(u => u.username === values.username && u.password === values.password);
      if (!found) {
        message.error('用户名或密码不正确');
        return;
      }
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({ username: found.username, role: found.role }));
      message.success('登录成功');
      if (found.role === 'manager') {
        navigate('/page/manger');
      } else {
        navigate('/page/operator');
      }
    } finally {
      setLoading(false);
    }
  };



  const startWeChatLogin = async () => {
    try {
      setWxLoading(true);
      // 让后端生成扫码链接与 state
      const { data } = await axios.get(`${API_BASE}/wechat/login-url`);
      setWxState(data.state);
      setWxQrUrl(data.url);

      // 清理旧轮询
      if (wxTimer) {
        window.clearInterval(wxTimer);
      }
      // 开始轮询状态
      const tid = window.setInterval(async () => {
        try {
          const resp = await axios.get(`${API_BASE}/wechat/status`, { params: { state: data.state } });
          if (resp.data.status === 'ok' && resp.data.user) {
            // 模拟生成本系统用户与 token
            const user = { username: resp.data.user.nickname || 'wx_user', role: 'manager', openid: resp.data.user.openid };
            localStorage.setItem('token', 'wx-mock-token');
            localStorage.setItem('user', JSON.stringify(user));
            

            // 跳转
            navigate('/page/manger');
            window.clearInterval(tid);
            setWxTimer(null);
          }
        } catch {}
      }, 1500);
      setWxTimer(tid);
    } finally {
      setWxLoading(false);
    }
  };

  // 组件卸载时清理轮询
  useEffect(() => {
    return () => {
      if (wxTimer) {
        try { window.clearInterval(wxTimer); } catch {}
      }
    };
  }, [wxTimer]);


  const handleRegister = async (values: { username: string; password: string; confirm: string; role: RoleType }) => {
    setRegisterLoading(true);
    try {
      const users = readUsers();
      if (users.some(u => u.username === values.username)) {
        message.warning('该用户名已被注册');
        return;
      }
      const next: StoredUser = { username: values.username, password: values.password, role: values.role };
      users.push(next);
      saveUsers(users);
      message.success('注册成功，请登录');
      setActiveKey('login');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', padding: 16 }}>
      <Card style={{ width: 420 }} bodyStyle={{ padding: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Title level={4} style={{ margin: 0 }}>登录 / 注册</Title>
          <Text type="secondary">按照角色进入不同工作台</Text>
        </div>
        <Tabs
          
          
          activeKey={activeKey}
          onChange={(k) => {
            setActiveKey(k);
            if (k === 'wechat' && !wxQrUrl) startWeChatLogin();
          }}
          items={[
            {
              key: 'login',
              label: '登录',
              children: (
                <Form layout="vertical" onFinish={handleLogin}>
                  <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
                    <Input placeholder="请输入用户名" />
                  </Form.Item>
                  <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
                    <Input.Password placeholder="请输入密码" />
                  </Form.Item>
                  <Form.Item>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Button type="link" onClick={() => setActiveKey('register')}>去注册</Button>
                      <Button type="link" htmlType="submit" loading={loading} style={{ color: '#69b1ff' }}>登录</Button>
                    </Space>
                  </Form.Item>
                </Form>
              )
            },
          
          {
            key: 'wechat',
            label: '微信扫码',
            children: (
              <div style={{ textAlign: 'center', paddingTop: 8 }}>
                <div style={{ marginBottom: 12 }}>请使用微信“扫一扫”扫描下方二维码</div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <QRCode value={wxQrUrl || 'about:blank'} size={180} />
                </div>
                <Space>
                  <Button type="link" onClick={startWeChatLogin} loading={wxLoading} style={{ color: '#69b1ff' }}>
                    {wxQrUrl ? '刷新二维码' : '生成二维码'}
                  </Button>
                </Space>
              </div>
            ),
          },



            {
              key: 'register',
              label: '注册',
              children: (
                <Form layout="vertical" onFinish={handleRegister}>
                  <Form.Item name="username" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
                    <Input placeholder="请输入用户名" />
                  </Form.Item>
                  <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '至少6位' }]}>
                    <Input.Password placeholder="请设置密码" />
                  </Form.Item>
                  <Form.Item name="confirm" label="确认密码" dependencies={['password']} rules={[
                    { required: true, message: '请再次输入密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) return Promise.resolve();
                        return Promise.reject(new Error('两次输入不一致'));
                      }
                    })
                  ]}>
                    <Input.Password placeholder="请再次输入密码" />
                  </Form.Item>
                  <Form.Item name="role" label="选择角色" initialValue={'manager'} rules={[{ required: true }]}>
                    <Radio.Group>
                      <Radio value="manager">管理者</Radio>
                      <Radio value="operator">运营者</Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Form.Item>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <Button onClick={() => setActiveKey('login')}>返回登录</Button>
                      <Button type="link" htmlType="submit" loading={registerLoading} style={{ color: '#69b1ff' }}>注册</Button>
                    </Space>
                  </Form.Item>
                </Form>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default Login;


