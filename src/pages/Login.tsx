import { useState } from 'react';
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

const Login = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('login');
  const [loading, setLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

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
          onChange={setActiveKey}
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


