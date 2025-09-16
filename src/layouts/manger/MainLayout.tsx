import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, theme, Drawer, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  SettingOutlined,
  MessageOutlined,
  AimOutlined,
  MenuOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setDrawerOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sideMenuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: 'management',
      icon: <SettingOutlined />,
      label: '运营管理',
      children: [
        {
          key: 'customer-management',
          label: '员工管理',
        },
        
        {
          key: 'content-management',
          label: '内容管理',
        },
        {
          key: 'channel-management',
          label: '渠道管理',
        },
        {
          key: 'data-management',
          label: '数据管理',
        },
      ],
    },
    {
      key: 'job-management',
      icon: <AimOutlined />,
      label: '招聘管理',
      children: [
        {
          key: 'b-job-management',
          label: 'B端岗位管理',
        },
        {
          key: 'c-job-management',
          label: 'C端简历管理',
        },
        {
          key: 'ad-campaign',
          label: '广告投放',
        },
      ],
    },
    {
      key: 'communication',
      icon: <MessageOutlined />,
      label: '消息中心',
      children: [
        {
          key: 'user-feedback',
          label: '用户反馈',
        },
        {
          key: 'system-announcement',
          label: '系统公告',
        },
      ],
    },
    {
      key: 'audit',
      icon: <CheckCircleOutlined />,
      label: '审核',
      children: [
        {
          key: 'company-audit',
          label: '企业认证审核',
        },
        {
          key: 'job-post-audit',
          label: '职位发布审核',
        },
        {
          key: 'resume-audit',
          label: '简历审核',
        },
        {
          key: 'operator-audit',
          label: '运营者身份审核',
        },
      ],
    },
    {
      key: 'setting',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ];

  const handleMenuClick = (key: string) => {
    if (key === 'home') {
      navigate('/page/manger/dashboard');
    } else {
      navigate(`/page/manger/${key}`);
    }
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  // 移动端渲染侧边栏内容的组件
  const SidebarContent = () => (
    <div style={{ height: '100%' }}>
      <div style={{ padding: '16px', fontWeight: 'bold', fontSize: '18px' }}>标签墙</div>
      <Menu
        mode="inline"
        defaultSelectedKeys={['home']}
        defaultOpenKeys={isMobile ? [] : ['management']}
        style={{ borderRight: 0 }}
        items={sideMenuItems}
        onClick={({ key }) => handleMenuClick(key as string)}
      />
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isMobile && (
        <Sider 
          trigger={null} 
          collapsible 
          collapsed={collapsed} 
          breakpoint="lg"
          collapsedWidth={80} 
          width={220} 
          style={{ background: colorBgContainer }}
        >
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '16px' }}
            />
            {!collapsed && <span style={{ marginLeft: '8px', fontSize: '18px', fontWeight: 'bold' }}>标签墙</span>}
          </div>
          <Menu
            mode="inline"
            defaultSelectedKeys={['home']}
            defaultOpenKeys={['management']}
            style={{ borderRight: 0 }}
            items={sideMenuItems}
            onClick={({ key }) => handleMenuClick(key as string)}
          />
        </Sider>
      )}

      <Layout>
        <Header style={{ 
          padding: '0 16px', 
          background: colorBgContainer, 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #f0f0f0',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setDrawerOpen(true)}
                style={{ fontSize: '16px', marginRight: '8px' }}
              />
            )}
            <div style={{ fontWeight: 'bold', fontSize: isMobile ? '16px' : '18px' }}>标签墙</div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!isMobile ? (
              <Menu 
                mode="horizontal" 
                defaultSelectedKeys={['home']} 
                style={{ border: 'none' }}
                onClick={({ key }) => handleMenuClick(key as string)}
              >
                <Menu.Item key="home">首页</Menu.Item>
                <Menu.Item key="about">关于我们</Menu.Item>
                <Menu.Item key="product">产品介绍</Menu.Item>
                <Menu.Item key="join">加入我们</Menu.Item>
              </Menu>
            ) : (
              <Space>
                <Button type="link" onClick={() => handleMenuClick('home')}>首页</Button>
                <Button type="link" onClick={() => handleMenuClick('about')}>关于</Button>
              </Space>
            )}
            <Button 
              type="link" 
              danger 
              onClick={() => {
                try {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                } catch {}
                navigate('/login');
              }}
            >退出登录</Button>
          </div>
        </Header>
        
        <Content
          style={{
            margin: isMobile ? '12px 8px' : '24px 16px',
            padding: isMobile ? 16 : 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 280,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </Content>
      </Layout>

      {/* 移动端抽屉菜单 */}
      {isMobile && (
        <Drawer
          title={null}
          placement="left"
          closable={false}
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          bodyStyle={{ padding: 0 }}
          width={250}
        >
          <SidebarContent />
        </Drawer>
      )}
    </Layout>
  );
};

export default MainLayout; 