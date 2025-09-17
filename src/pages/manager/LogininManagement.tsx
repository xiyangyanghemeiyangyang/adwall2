import React, { useState } from 'react';
import { Card, Form, Input, Upload, Button, Steps, Typography, Space, Select, Checkbox, message } from 'antd';
import { InboxOutlined, CheckCircleTwoTone } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Step } = Steps;
const { Option } = Select;

type ClubData = {
  // 资质与联系人信息
  logo?: File | null;
  clubName: string;
  clubAddress: string;
  clubPhone: string;
  clubEmail: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  // 管理员账号
  adminRole: string;
  adminEmail: string;
  adminPassword: string;
  adminPasswordConfirm: string;
  // 部门/业务
  selectedSports: string[];
};

const initialData: ClubData = {
  logo: null,
  clubName: '',
  clubAddress: '',
  clubPhone: '',
  clubEmail: '',
  contactName: '',
  contactPhone: '',
  contactEmail: '',
  adminRole: '',
  adminEmail: '',
  adminPassword: '',
  adminPasswordConfirm: '',
  selectedSports: [],
};

const LogininManagement: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0,1,2
  const [data, setData] = useState<ClubData>(initialData);
  const [loading, setLoading] = useState(false);

  const steps = [
    { title: '部门/企业信息', description: '资质与联系人信息' },
    { title: '管理员账户', description: '创建管理账号' },
    { title: '业务范围', description: '选择部门业务' },
  ];

  const onUploadChange = (info: any) => {
    if (info.file.status === 'done' || info.file.status === 'uploading' || info.file.status === 'success') {
      setData(prev => ({ ...prev, logo: info.file.originFileObj || null }));
    }
  };

  const next = async () => {
    // 简单校验
    if (currentStep === 0) {
      if (!data.clubName || !data.contactName) {
        return message.error('请填写“企业/部门名称”和“联系人姓名”。');
      }
    }
    if (currentStep === 1) {
      if (!data.adminEmail || !data.adminPassword || !data.adminPasswordConfirm) {
        return message.error('请完善管理员邮箱与密码。');
      }
      if (data.adminPassword !== data.adminPasswordConfirm) {
        return message.error('两次输入的密码不一致。');
      }
    }
    setCurrentStep(s => Math.min(2, s + 1));
  };

  const prev = () => setCurrentStep(s => Math.max(0, s - 1));

  const submitAll = async () => {
    if (!data.selectedSports.length) {
      return message.error('请至少选择一个业务/部门。');
    }
    setLoading(true);
    try {
      // TODO: 在这里调用后端 API（当前项目用的是 /api 下的模拟接口，可后续接入）
      await new Promise(r => setTimeout(r, 800));
      message.success('注册提交成功');
      setCurrentStep(0);
      setData(initialData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Title level={4}>部门注册 / 企业认证</Title>

      <Card>
        <div className="mb-6">
          <Steps current={currentStep} responsive>
            {steps.map((s, idx) => (
              <Step
                key={s.title}
                title={s.title}
                description={s.description}
                icon={currentStep > idx ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : undefined}
              />
            ))}
          </Steps>
        </div>

        <Card className="rounded-2xl">
          {currentStep === 0 && (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Title level={5}>资质与联系人信息</Title>
              <Form
                layout="vertical"
                onValuesChange={(_, all) => setData(prev => ({ ...prev, ...all }))}
                initialValues={data}
              >
                <Form.Item label="Logo / 证照(可选)">
                  <Upload.Dragger
                    name="file"
                    multiple={false}
                    showUploadList={!!data.logo}
                    beforeUpload={() => false}
                    onChange={onUploadChange}
                  >
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">拖拽文件到此或点击上传</p>
                    <p className="ant-upload-hint">支持 PNG/JPG/PDF 等，最大 10MB</p>
                  </Upload.Dragger>
                </Form.Item>

                <Form.Item label="企业/部门名称" required>
                  <Input
                    value={data.clubName}
                    onChange={(e) => setData(p => ({ ...p, clubName: e.target.value }))}
                    placeholder="例如：市场部 / 深圳市星河科技有限公司"
                  />
                </Form.Item>

                <Form.Item label="地址">
                  <Input
                    value={data.clubAddress}
                    onChange={(e) => setData(p => ({ ...p, clubAddress: e.target.value }))}
                    placeholder="详细地址"
                  />
                </Form.Item>

                <Space size="large" wrap>
                  <Form.Item label="联系电话">
                    <Input
                      value={data.clubPhone}
                      onChange={(e) => setData(p => ({ ...p, clubPhone: e.target.value }))}
                      placeholder="手机/座机"
                      style={{ width: 260 }}
                    />
                  </Form.Item>
                  <Form.Item label="联系邮箱">
                    <Input
                      value={data.clubEmail}
                      onChange={(e) => setData(p => ({ ...p, clubEmail: e.target.value }))}
                      placeholder="contact@example.com"
                      style={{ width: 260 }}
                    />
                  </Form.Item>
                </Space>

                <Space size="large" wrap>
                  <Form.Item label="联系人姓名" required>
                    <Input
                      value={data.contactName}
                      onChange={(e) => setData(p => ({ ...p, contactName: e.target.value }))}
                      placeholder="张三"
                      style={{ width: 260 }}
                    />
                  </Form.Item>
                  <Form.Item label="联系人电话">
                    <Input
                      value={data.contactPhone}
                      onChange={(e) => setData(p => ({ ...p, contactPhone: e.target.value }))}
                      placeholder="138xxxxxx"
                      style={{ width: 260 }}
                    />
                  </Form.Item>
                  <Form.Item label="联系人邮箱">
                    <Input
                      value={data.contactEmail}
                      onChange={(e) => setData(p => ({ ...p, contactEmail: e.target.value }))}
                      placeholder="zhangsan@example.com"
                      style={{ width: 260 }}
                    />
                  </Form.Item>
                </Space>
              </Form>

              <Space>
                <Button onClick={next} type="primary">下一步</Button>
              </Space>
            </Space>
          )}

          {currentStep === 1 && (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Title level={5}>管理员账户</Title>
              <Form
                layout="vertical"
                onValuesChange={(_, all) => setData(prev => ({ ...prev, ...all }))}
                initialValues={data}
              >
                <Space size="large" wrap>
                  <Form.Item label="角色/权限">
                    <Select
                      placeholder="选择角色"
                      value={data.adminRole || undefined}
                      onChange={(v) => setData(p => ({ ...p, adminRole: v }))}
                      style={{ width: 260 }}
                      allowClear
                    >
                      <Option value="管理员">管理员</Option>
                      <Option value="审核员">审核员</Option>
                      <Option value="员工">员工</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="管理员邮箱" required>
                    <Input
                      value={data.adminEmail}
                      onChange={(e) => setData(p => ({ ...p, adminEmail: e.target.value }))}
                      placeholder="admin@example.com"
                      style={{ width: 260 }}
                    />
                  </Form.Item>
                </Space>

                <Space size="large" wrap>
                  <Form.Item label="登录密码" required>
                    <Input.Password
                      value={data.adminPassword}
                      onChange={(e) => setData(p => ({ ...p, adminPassword: e.target.value }))}
                      placeholder="至少 6 位"
                      style={{ width: 260 }}
                    />
                  </Form.Item>
                  <Form.Item label="确认密码" required>
                    <Input.Password
                      value={data.adminPasswordConfirm}
                      onChange={(e) => setData(p => ({ ...p, adminPasswordConfirm: e.target.value }))}
                      placeholder="再次输入密码"
                      style={{ width: 260 }}
                    />
                  </Form.Item>
                </Space>
              </Form>

              <Space>
                <Button onClick={prev}>上一步</Button>
                <Button onClick={next} type="primary">下一步</Button>
              </Space>
            </Space>
          )}

          {currentStep === 2 && (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Title level={5}>业务范围</Title>
              <Form layout="vertical">
                <Form.Item label="选择部门业务/职责">
                  <Checkbox.Group
                    value={data.selectedSports}
                    onChange={(vals) => setData(p => ({ ...p, selectedSports: vals as string[] }))}
                  >
                    <Space direction="vertical">
                      <Checkbox value="人力资源">人力资源</Checkbox>
                      <Checkbox value="市场运营">市场运营</Checkbox>
                      <Checkbox value="销售管理">销售管理</Checkbox>
                      <Checkbox value="财务出纳">财务出纳</Checkbox>
                      <Checkbox value="法务合规">法务合规</Checkbox>
                      <Checkbox value="技术支持">技术支持</Checkbox>
                    </Space>
                  </Checkbox.Group>
                </Form.Item>
              </Form>

              <Space>
                <Button onClick={prev}>上一步</Button>
                <Button type="primary" loading={loading} onClick={submitAll}>提交注册</Button>
              </Space>
            </Space>
          )}
        </Card>
      </Card>
    </div>
  );
};

export default LogininManagement;