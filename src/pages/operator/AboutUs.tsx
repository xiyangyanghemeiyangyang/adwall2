import { useState } from 'react';
import { 
  Card, 
  Button, 
  Typography, 
  Row, 
  Col, 
  Space,
  Badge,
  Timeline
} from 'antd';
import { 
  TeamOutlined,
  RocketOutlined,
  HeartOutlined,
  BulbOutlined,
  UserOutlined,
  TrophyOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// Hero Section Component
const HeroSection = () => {
  return (
    <section style={{ 
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '80px 16px',
      textAlign: 'center'
    }}>
      {/* Background with brand gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
      }}></div>
      
      {/* Main content */}
      <div style={{ position: 'relative', padding: '80px 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <Title level={1} style={{ 
            marginBottom: '24px', 
            fontSize: '48px',
            color: 'white',
            fontWeight: 'bold'
          }}>
            推动支付行业的未来
          </Title>
          <Paragraph style={{ 
            marginBottom: '32px', 
            fontSize: '18px', 
            color: 'rgba(255, 255, 255, 0.9)',
            maxWidth: '800px',
            margin: '0 auto 32px auto'
          }}>
            在Constellation Payments，我们正在构建下一代支付解决方案，将合作伙伴放在首位。
            了解我们如何通过创新技术和坚定不移的卓越承诺来革新支付格局。
          </Paragraph>
          <Button 
            size="large" 
            style={{ 
              fontSize: '18px', 
              padding: '12px 32px',
              height: 'auto',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: 'white',
              borderRadius: '8px'
            }}
            icon={<TeamOutlined />}
          >
            认识我们的团队
          </Button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: '40px',
        width: '80px',
        height: '80px',
        background: 'rgba(102, 126, 234, 0.2)',
        borderRadius: '50%',
        filter: 'blur(20px)'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '80px',
        right: '40px',
        width: '128px',
        height: '128px',
        background: 'rgba(118, 75, 162, 0.2)',
        borderRadius: '50%',
        filter: 'blur(20px)'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '25%',
        width: '64px',
        height: '64px',
        background: 'rgba(52, 168, 83, 0.2)',
        borderRadius: '50%',
        filter: 'blur(16px)'
      }}></div>
    </section>
  );
};

// Our Story Component
const OurStory = () => {
  return (
    <section style={{ padding: '80px 16px', background: '#fafafa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Title level={2} style={{ marginBottom: '16px', color: '#1f2937' }}>
            我们的故事
          </Title>
          <Paragraph style={{ 
            fontSize: '18px', 
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            从谦逊的开始到行业领导地位，了解塑造Constellation Payments的历程。
          </Paragraph>
        </div>
        
        <Row gutter={[32, 32]} style={{ marginBottom: '48px' }}>
          <Col xs={24} md={12}>
            <Card style={{ padding: '32px', height: '100%' }}>
              <Title level={3} style={{ marginBottom: '16px', color: '#1f2937' }}>
                我们的起源
              </Title>
              <Paragraph style={{ color: '#6b7280', marginBottom: '16px' }}>
                怀着简化复杂支付流程的愿景，Constellation Payments从认识到企业需要的不仅仅是交易处理——他们需要真正的合作伙伴这一认知中诞生。
              </Paragraph>
              <Paragraph style={{ color: '#6b7280' }}>
                我们的旅程始于一小群支付行业资深人士，他们了解传统支付系统的痛点，并着手构建更好的解决方案。
              </Paragraph>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card style={{ padding: '32px', height: '100%' }}>
              <Title level={3} style={{ marginBottom: '16px', color: '#1f2937' }}>
                我们的发展
              </Title>
              <Paragraph style={{ color: '#6b7280', marginBottom: '16px' }}>
                从一个专注的解决方案开始，已经发展成为一个全面的支付生态系统。
                我们已经从服务本地企业发展到为多个行业的公司提供支持。
              </Paragraph>
              <Paragraph style={{ color: '#6b7280' }}>
                我们旅程中的每个里程碑都由一个不变的因素驱动：倾听我们的合作伙伴并交付超出他们期望的解决方案。
              </Paragraph>
            </Card>
          </Col>
        </Row>
        
        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            <Card style={{ 
              padding: '32px', 
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
              border: '1px solid rgba(102, 126, 234, 0.2)',
              height: '100%'
            }}>
              <Title level={3} style={{ marginBottom: '16px', color: '#1f2937' }}>
                我们的使命
              </Title>
              <Paragraph style={{ color: '#6b7280' }}>
                为各种规模的企业提供安全、可靠且旨在随其成功而增长的创新支付解决方案。
                我们相信，优秀的支付技术对最终用户应该是无形的，但对企业来说却极其强大。
              </Paragraph>
            </Card>
          </Col>
          
          <Col xs={24} md={12}>
            <Card style={{ 
              padding: '32px', 
              background: 'linear-gradient(135deg, rgba(52, 168, 83, 0.05) 0%, rgba(34, 197, 94, 0.05) 100%)',
              border: '1px solid rgba(52, 168, 83, 0.2)',
              height: '100%'
            }}>
              <Title level={3} style={{ marginBottom: '16px', color: '#1f2937' }}>
                Jonas Software 家族
              </Title>
              <Paragraph style={{ color: '#6b7280' }}>
                作为Jonas Software家族的骄傲成员，我们受益于数十年的软件专业知识和对垂直市场解决方案的承诺。
                这种合作伙伴关系为我们提供了资源和稳定性，使我们能够大胆创新，同时保持专注支付公司的敏捷性。
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </section>
  );
};

// Timeline Component
const TimelineSection = () => {
  const milestones = [
    {
      year: "2019",
      title: "公司成立",
      description: "Constellation Payments成立，愿景是革新支付处理。",
      status: "completed",
      color: "#667eea"
    },
    {
      year: "2020",
      title: "第一个企业客户",
      description: "成功入驻我们的第一个主要企业客户，验证了我们可扩展的架构。",
      status: "completed",
      color: "#764ba2"
    },
    {
      year: "2021",
      title: "Jonas Software收购",
      description: "加入Jonas Software家族，获得广泛的资源和专业知识。",
      status: "completed",
      color: "#34a853"
    },
    {
      year: "2022",
      title: "API平台发布",
      description: "发布我们全面的API平台，为开发者实现无缝集成。",
      status: "completed",
      color: "#fbbc04"
    },
    {
      year: "2024",
      title: "多行业扩展",
      description: "将我们的解决方案扩展到医疗保健、零售和专业服务行业。",
      status: "completed",
      color: "#ea4335"
    },
    {
      year: "2025年10月",
      title: "下一代平台发布",
      description: "发布我们革命性的统一支付平台，具有AI驱动的分析和增强的安全性。",
      status: "upcoming",
      color: "#1f2937"
    }
  ];

  return (
    <section style={{ padding: '80px 16px', background: '#f5f5f5' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Title level={2} style={{ marginBottom: '16px', color: '#1f2937' }}>
            我们的历程
          </Title>
          <Paragraph style={{ 
            fontSize: '18px', 
            color: '#6b7280',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            塑造Constellation Payments成为今天行业领导者的关键里程碑。
          </Paragraph>
        </div>
        
        <Timeline
          mode="alternate"
          items={milestones.map((milestone, index) => ({
            dot: (
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: milestone.status === 'upcoming' ? '#1f2937' : milestone.color,
                border: '4px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }} />
            ),
            children: (
              <Card style={{
                background: milestone.status === 'upcoming' 
                  ? 'linear-gradient(135deg, rgba(31, 41, 55, 0.05) 0%, rgba(102, 126, 234, 0.05) 100%)'
                  : `linear-gradient(135deg, ${milestone.color}10 0%, ${milestone.color}05 100%)`,
                border: `1px solid ${milestone.color}30`,
                borderRadius: '12px',
                padding: '24px'
              }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Space>
                    <Badge 
                      count={milestone.year}
                      style={{ 
                        background: milestone.status === 'upcoming' ? '#1f2937' : milestone.color,
                        color: 'white'
                      }}
                    />
                    {milestone.status === 'upcoming' && (
                      <Badge 
                        count="即将到来" 
                        style={{ 
                          background: 'rgba(251, 188, 4, 0.1)',
                          color: '#fbbc04',
                          border: '1px solid rgba(251, 188, 4, 0.3)'
                        }}
                      />
                    )}
                  </Space>
                  <Title level={4} style={{ margin: '8px 0', color: '#1f2937' }}>
                    {milestone.title}
                  </Title>
                  <Text style={{ color: '#6b7280' }}>
                    {milestone.description}
                  </Text>
                </Space>
              </Card>
            )
          }))}
        />
      </div>
    </section>
  );
};

// Leadership & Culture Component
const LeadershipPreview = () => {
  const values = [
    {
      title: "诚信第一",
      description: "我们做正确的事，即使没有人看着。透明和诚实指导每一个决定。",
      color: "#1f2937",
      icon: <HeartOutlined />
    },
    {
      title: "合作伙伴成功",
      description: "我们合作伙伴的成功就是我们的成功。我们通过为他人创造的价值来衡量我们的成就。",
      color: "#34a853",
      icon: <TrophyOutlined />
    },
    {
      title: "创新与卓越",
      description: "我们不断突破界限，拥抱新技术，并努力在所做的一切中追求卓越。",
      color: "#667eea",
      icon: <RocketOutlined />
    },
    {
      title: "协作精神",
      description: "我们相信伟大的解决方案来自不同观点朝着共同目标共同努力。",
      color: "#764ba2",
      icon: <TeamOutlined />
    },
    {
      title: "持续学习",
      description: "支付行业发展迅速。我们投资于我们的人员并保持领先于新兴趋势。",
      color: "#34a853",
      icon: <BulbOutlined />
    },
    {
      title: "客户痴迷",
      description: "每个功能、每个流程、每次互动都以客户需求为中心设计。",
      color: "#fbbc04",
      icon: <UserOutlined />
    }
  ];

  return (
    <section style={{ padding: '80px 16px', background: '#fafafa' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Title level={2} style={{ marginBottom: '16px', color: '#1f2937' }}>
            领导力与文化
          </Title>
          <Paragraph style={{ 
            fontSize: '18px', 
            color: '#6b7280',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            我们的价值观不仅仅是墙上的文字——它们是我们文化的基础，也是我们成功背后的驱动力。
          </Paragraph>
        </div>

        <Row gutter={[24, 24]} style={{ marginBottom: '48px' }}>
          {values.map((value, index) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <Card style={{
                padding: '24px',
                background: 'white',
                border: `4px solid ${value.color}20`,
                borderLeft: `4px solid ${value.color}`,
                borderRadius: '12px',
                height: '100%',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              hoverable
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      background: `${value.color}20`,
                      padding: '12px',
                      borderRadius: '8px',
                      color: value.color,
                      fontSize: '20px'
                    }}>
                      {value.icon}
                    </div>
                    <Title level={4} style={{ margin: 0, color: '#1f2937' }}>
                      {value.title}
                    </Title>
                  </div>
                  <Text style={{ color: '#6b7280', lineHeight: '1.6' }}>
                    {value.description}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        <div style={{ textAlign: 'center' }}>
          <Card style={{
            padding: '48px',
            background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.05) 0%, rgba(102, 126, 234, 0.05) 50%, rgba(118, 75, 162, 0.05) 100%)',
            border: '1px solid rgba(31, 41, 55, 0.2)',
            borderRadius: '16px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Title level={3} style={{ margin: 0, color: '#1f2937' }}>
                认识推动创新的团队
              </Title>
              <Paragraph style={{ 
                fontSize: '18px', 
                color: '#6b7280',
                margin: 0,
                maxWidth: '600px',
                margin: '0 auto'
              }}>
                我们的领导团队汇集了支付、技术和商业战略方面数十年的经验。
                了解推动Constellation Payments前进的远见者。
              </Paragraph>
              <Button 
                size="large" 
                style={{ 
                  fontSize: '18px', 
                  padding: '12px 32px',
                  height: 'auto',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '8px'
                }}
                icon={<TeamOutlined />}
              >
                查看领导团队
              </Button>
            </Space>
          </Card>
        </div>
      </div>
    </section>
  );
};

// Main AboutUs Component
const AboutUs = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <HeroSection />
      <OurStory />
      <TimelineSection />
      <LeadershipPreview />
    </div>
  );
};

export default AboutUs;