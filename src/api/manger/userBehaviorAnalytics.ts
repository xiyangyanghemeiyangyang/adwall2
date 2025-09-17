// 用户行为数据分析相关数据类型定义和模拟数据

// 模拟数据常量
const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二'];
const schools = ['清华大学', '北京大学', '复旦大学', '上海交通大学', '浙江大学', '南京大学', '中山大学', '华中科技大学'];
const majors = ['计算机科学与技术', '软件工程', '数据科学与大数据技术', '人工智能', '网络工程', '信息安全'];
const positions = ['前端工程师', '后端工程师', '全栈工程师', '数据分析师', '产品经理', 'UI设计师', '测试工程师'];
const industries = ['互联网', '金融', '教育', '电商', '游戏', '医疗', '制造业'];
const cities = ['北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '武汉'];
const regions = ['华北', '华东', '华南', '华中', '西南', '西北', '东北'];
const skills = ['JavaScript', 'Python', 'Java', 'React', 'Vue', 'Node.js', 'MySQL', 'Redis', 'Docker', 'Kubernetes'];
const educations: ('本科' | '硕士' | '博士' | '专科' | '其他')[] = ['本科', '硕士', '博士', '专科'];
const companies = ['腾讯', '阿里巴巴', '字节跳动', '百度', '京东', '美团', '滴滴', '网易'];

export interface Resume {
  id: string;
  name: string;
  phone: string;
  email: string;
  school: string;
  major: string;
  targetPosition: string;
  targetIndustry: string;
  education: '本科' | '硕士' | '博士' | '专科' | '其他';
  workExperience: number; // 工作年限
  skills: string[];
  city: string;
  region: string;
  submitTime: string;
  status: '待审核' | '审核通过' | '已驳回';
  lastUpdateTime: string;
  viewCount: number;
  applicationCount: number;
}

export interface UserBehaviorLog {
  id: string;
  userId: string;
  userName: string;
  action: '登录' | '浏览职位' | '投递简历' | '更新简历' | '查看公司' | '搜索' | '收藏';
  target: string; // 目标对象（职位ID、公司名等）
  timestamp: string;
  ip: string;
  device: string;
  location: string;
}

export interface UserProfile {
  userId: string;
  userName: string;
  age: number;
  education: string;
  city: string;
  industry: string;
  skills: string[];
  loginCount: number;
  lastLoginTime: string;
  totalViewTime: number; // 总浏览时长（分钟）
  favoriteJobs: string[];
  appliedJobs: string[];
}

export interface AnalyticsData {
  overview: {
    totalUsers: number;
    totalResumes: number;
    totalApplications: number;
    avgScore: number;
    growthRate: number;
    conversionRate: number;
  };
  userGrowthTrend: Array<{
    date: string;
    newUsers: number;
    activeUsers: number;
  }>;
  applicationTrend: Array<{
    date: string;
    applications: number;
    completed: number;
  }>;
  popularJobs: Array<{
    jobTitle: string;
    company: string;
    applications: number;
    views: number;
  }>;
  userActivity: Array<{
    date: string;
    logins: number;
    views: number;
    updates: number;
  }>;
  educationDistribution: Array<{
    education: string;
    count: number;
    percentage: number;
  }>;
  ageDistribution: Array<{
    ageRange: string;
    count: number;
    percentage: number;
  }>;
  skillDistribution: Array<{
    skill: string;
    count: number;
    percentage: number;
  }>;
  regionDistribution: Array<{
    region: string;
    count: number;
    percentage: number;
  }>;
}

// 市场预测相关类型定义
export interface JobTrendPrediction {
  jobTitle: string;
  industry: string;
  currentDemand: number;
  predictedGrowth: number; // 百分比
  confidence: number; // 置信度 0-100
  timeframe: string; // 预测时间范围
  factors: string[]; // 影响因素
  recommendation: string; // 建议
}

export interface MarketAnalysisReport {
  id: string;
  title: string;
  reportType: 'weekly' | 'monthly';
  generateTime: string;
  summary: string;
  keyFindings: string[];
  marketTrends: Array<{
    trend: string;
    impact: 'high' | 'medium' | 'low';
    description: string;
  }>;
  emergingJobs: Array<{
    jobTitle: string;
    growthRate: number;
    description: string;
    skills: string[];
  }>;
  recommendations: Array<{
    category: string;
    suggestion: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  predictions: JobTrendPrediction[];
}

export interface MarketForecastData {
  predictions: JobTrendPrediction[];
  reports: MarketAnalysisReport[];
  lastUpdated: string;
}

// 模拟数据存储
const STORAGE_KEY_RESUMES = 'user_behavior_resumes';
const STORAGE_KEY_LOGS = 'user_behavior_logs';
const STORAGE_KEY_PROFILES = 'user_behavior_profiles';

const saveData = (key: string, data: any[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    // ignore storage errors in mock env
  }
};

const loadData = (key: string, seed: any[]): any[] => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : seed;
    }
  } catch (err) {
    // ignore parse errors and fall back to seed
  }
  saveData(key, seed);
  return seed;
};

// 生成模拟简历数据
const generateMockResumes = (): Resume[] => {
  const statuses: Resume['status'][] = ['待审核', '审核通过', '已驳回'];

  const resumes: Resume[] = [];
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');

  for (let i = 0; i < 200; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const school = schools[Math.floor(Math.random() * schools.length)];
    const major = majors[Math.floor(Math.random() * majors.length)];
    const position = positions[Math.floor(Math.random() * positions.length)];
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const education = educations[Math.floor(Math.random() * educations.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // 随机选择3-6个技能
    const userSkills = skills
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 4) + 3);

    const submitTime = new Date(
      startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
    ).toISOString();

    const lastUpdateTime = new Date(
      new Date(submitTime).getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    resumes.push({
      id: `R${String(i + 1).padStart(6, '0')}`,
      name,
      phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      email: `${name.toLowerCase()}@example.com`,
      school,
      major,
      targetPosition: position,
      targetIndustry: industry,
      education,
      workExperience: Math.floor(Math.random() * 10),
      skills: userSkills,
      city,
      region,
      submitTime,
      status,
      lastUpdateTime,
      viewCount: Math.floor(Math.random() * 100),
      applicationCount: Math.floor(Math.random() * 20)
    });
  }

  return resumes.sort((a, b) => new Date(b.submitTime).getTime() - new Date(a.submitTime).getTime());
};

// 生成模拟用户行为日志
const generateMockLogs = (resumes: Resume[]): UserBehaviorLog[] => {
  const actions: UserBehaviorLog['action'][] = ['登录', '浏览职位', '投递简历', '更新简历', '查看公司', '搜索', '收藏'];
  const devices = ['PC', 'Mobile', 'Tablet'];
  const locations = ['北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '武汉'];

  const logs: UserBehaviorLog[] = [];
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');

  resumes.forEach(resume => {
    // 每个用户生成10-50条行为记录
    const logCount = Math.floor(Math.random() * 41) + 10;
    
    for (let i = 0; i < logCount; i++) {
      const action = actions[Math.floor(Math.random() * actions.length)];
      const timestamp = new Date(
        startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
      ).toISOString();

      let target = '';
      switch (action) {
        case '浏览职位':
        case '投递简历':
        case '收藏':
          target = `职位-${positions[Math.floor(Math.random() * positions.length)]}`;
          break;
        case '查看公司':
          target = `公司-${companies[Math.floor(Math.random() * companies.length)]}`;
          break;
        case '搜索':
          target = `搜索-${skills[Math.floor(Math.random() * skills.length)]}`;
          break;
        default:
          target = '系统';
      }

      logs.push({
        id: `L${String(logs.length + 1).padStart(8, '0')}`,
        userId: resume.id,
        userName: resume.name,
        action,
        target,
        timestamp,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        device: devices[Math.floor(Math.random() * devices.length)],
        location: locations[Math.floor(Math.random() * locations.length)]
      });
    }
  });

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// 生成模拟用户画像数据
const generateMockProfiles = (resumes: Resume[]): UserProfile[] => {
  return resumes.map(resume => ({
    userId: resume.id,
    userName: resume.name,
    age: Math.floor(Math.random() * 30) + 22, // 22-52岁
    education: resume.education,
    city: resume.city,
    industry: resume.targetIndustry,
    skills: resume.skills,
    loginCount: Math.floor(Math.random() * 100) + 1,
    lastLoginTime: resume.lastUpdateTime,
    totalViewTime: Math.floor(Math.random() * 1000) + 100,
    favoriteJobs: Array.from({ length: Math.floor(Math.random() * 10) }, () => 
      `职位-${positions[Math.floor(Math.random() * positions.length)]}`
    ),
    appliedJobs: Array.from({ length: resume.applicationCount }, () => 
      `职位-${positions[Math.floor(Math.random() * positions.length)]}`
    )
  }));
};

// 初始化模拟数据
const mockResumes = loadData(STORAGE_KEY_RESUMES, generateMockResumes());
const mockLogs = loadData(STORAGE_KEY_LOGS, generateMockLogs(mockResumes));
const mockProfiles = loadData(STORAGE_KEY_PROFILES, generateMockProfiles(mockResumes));

// API 模拟函数
export const userBehaviorApi = {//////////////////////////
  // 获取简历列表
  getResumes: (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    city?: string;
    region?: string;
    education?: string;
    industry?: string;
    dateRange?: [string, string];
  }) => {
    return new Promise<{ data: Resume[]; total: number }>((resolve) => {
      setTimeout(() => {
        let filteredData = [...mockResumes];

        if (params?.search) {
          filteredData = filteredData.filter(resume =>
            resume.name.includes(params.search!) ||
            resume.school.includes(params.search!) ||
            resume.skills.some((skill: string) => skill.includes(params.search!))
          );
        }

        if (params?.status) {
          filteredData = filteredData.filter(resume => resume.status === params.status);
        }

        if (params?.city) {
          filteredData = filteredData.filter(resume => resume.city === params.city);
        }

        if (params?.region) {
          filteredData = filteredData.filter(resume => resume.region === params.region);
        }

        if (params?.education) {
          filteredData = filteredData.filter(resume => resume.education === params.education);
        }

        if (params?.industry) {
          filteredData = filteredData.filter(resume => resume.targetIndustry === params.industry);
        }

        if (params?.dateRange && params.dateRange.length === 2) {
          filteredData = filteredData.filter(resume =>
            resume.submitTime >= params.dateRange![0] && resume.submitTime <= params.dateRange![1]
          );
        }

        const total = filteredData.length;
        const page = params?.page || 1;
        const pageSize = params?.pageSize || 10;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;

        resolve({
          data: filteredData.slice(start, end),
          total
        });
      }, 500);
    });
  },

  // 获取简历详情
  getResumeById: (id: string) => {
    return new Promise<Resume | null>((resolve) => {
      setTimeout(() => {
        const resume = mockResumes.find(r => r.id === id);
        resolve(resume || null);
      }, 300);
    });
  },

  // 审核简历
  approveResume: (id: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const resume = mockResumes.find(r => r.id === id);
        if (resume) {
          resume.status = '审核通过';
          resume.lastUpdateTime = new Date().toISOString();
          saveData(STORAGE_KEY_RESUMES, mockResumes);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  },

  // 驳回简历
  rejectResume: (id: string, _reason: string) => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const resume = mockResumes.find(r => r.id === id);
        if (resume) {
          resume.status = '已驳回';
          resume.lastUpdateTime = new Date().toISOString();
          saveData(STORAGE_KEY_RESUMES, mockResumes);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  },

  // 获取用户行为日志
  getUserBehaviorLogs: (userId: string) => {
    return new Promise<UserBehaviorLog[]>((resolve) => {
      setTimeout(() => {
        const logs = mockLogs.filter(log => log.userId === userId);
        resolve(logs);
      }, 300);
    });
  },

  // 获取用户画像
  getUserProfile: (userId: string) => {
    return new Promise<UserProfile | null>((resolve) => {
      setTimeout(() => {
        const profile = mockProfiles.find(p => p.userId === userId);
        resolve(profile || null);
      }, 300);
    });
  },

  // 获取分析数据
  getAnalyticsData: (_dateRange?: [string, string]) => {
    return new Promise<AnalyticsData>((resolve) => {
      setTimeout(() => {
        // 计算概览数据
        const totalUsers = mockProfiles.length;
        const totalResumes = mockResumes.length;
        const totalApplications = mockResumes.reduce((sum, r) => sum + r.applicationCount, 0);
        const avgScore = 75 + Math.random() * 20; // 模拟平均分数
        const growthRate = 15.3 + Math.random() * 10;
        const conversionRate = (totalApplications / totalResumes * 100).toFixed(1);

        // 生成用户增长趋势数据
        const userGrowthTrend = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          return {
            date: date.toISOString().split('T')[0],
            newUsers: Math.floor(Math.random() * 20) + 5,
            activeUsers: Math.floor(Math.random() * 100) + 50
          };
        });

        // 生成投递趋势数据
        const applicationTrend = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          return {
            date: date.toISOString().split('T')[0],
            applications: Math.floor(Math.random() * 50) + 10,
            completed: Math.floor(Math.random() * 30) + 5
          };
        });

        // 生成热门职位数据
        const popularJobs = positions.slice(0, 6).map((position: string) => ({
          jobTitle: position,
          company: companies[Math.floor(Math.random() * companies.length)],
          applications: Math.floor(Math.random() * 100) + 20,
          views: Math.floor(Math.random() * 500) + 100
        }));

        // 生成用户活跃度数据
        const userActivity = Array.from({ length: 30 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - (29 - i));
          return {
            date: date.toISOString().split('T')[0],
            logins: Math.floor(Math.random() * 200) + 50,
            views: Math.floor(Math.random() * 1000) + 200,
            updates: Math.floor(Math.random() * 50) + 10
          };
        });

        // 生成学历分布数据
        const educationStats = educations.map((education: string) => {
          const count = mockResumes.filter(r => r.education === education).length;
          return {
            education,
            count,
            percentage: Number((count / totalResumes * 100).toFixed(1))
          };
        });

        // 生成年龄分布数据
        const ageRanges = ['22-25', '26-30', '31-35', '36-40', '41-45', '46-50', '51+'];
        const ageDistribution = ageRanges.map(ageRange => {
          const count = Math.floor(Math.random() * 50) + 10;
          return {
            ageRange,
            count,
            percentage: Number((count / totalUsers * 100).toFixed(1))
          };
        });

        // 生成技能分布数据
        const skillStats = skills.slice(0, 8).map((skill: string) => {
          const count = mockResumes.filter(r => r.skills.includes(skill)).length;
          return {
            skill,
            count,
            percentage: Number((count / totalResumes * 100).toFixed(1))
          };
        });

        // 生成地区分布数据
        const regionStats = regions.map((region: string) => {
          const count = mockResumes.filter(r => r.region === region).length;
          return {
            region,
            count,
            percentage: Number((count / totalResumes * 100).toFixed(1))
          };
        });



        resolve({
          overview: {
            totalUsers,
            totalResumes,
            totalApplications,
            avgScore: Math.round(avgScore),
            growthRate: Number(growthRate.toFixed(1)),
            conversionRate: Number(conversionRate)
          },
          userGrowthTrend,
          applicationTrend,
          popularJobs,
          userActivity,
          educationDistribution: educationStats,
          ageDistribution,
          skillDistribution: skillStats,
          regionDistribution: regionStats
        });
      }, 500);
    });
  },

  

      // 获取市场预测数据
  getMarketForecastData: () => {
    return new Promise<MarketForecastData>((resolve) => {
      setTimeout(() => {
        const predictions: JobTrendPrediction[] = [
          {
            jobTitle: '软件测试工程师',
            industry: '互联网',
            currentDemand: 85,
            predictedGrowth: 15,
            confidence: 88,
            timeframe: '未来6个月',
            factors: ['数字化转型加速', '质量要求提升', '自动化测试需求增长'],
            recommendation: '建议企业加强测试团队建设，关注自动化测试技能培训'
          },
          {
            jobTitle: '数据分析师',
            industry: '金融',
            currentDemand: 92,
            predictedGrowth: 22,
            confidence: 85,
            timeframe: '未来6个月',
            factors: ['数据驱动决策', 'AI技术应用', '监管要求加强'],
            recommendation: '建议企业培养数据科学团队，投资数据基础设施'
          },
          {
            jobTitle: '前端工程师',
            industry: '互联网',
            currentDemand: 78,
            predictedGrowth: 8,
            confidence: 75,
            timeframe: '未来6个月',
            factors: ['移动端需求稳定', '新技术框架普及', '用户体验要求提升'],
            recommendation: '建议关注React、Vue等主流框架，提升用户体验设计能力'
          },
          {
            jobTitle: '产品经理',
            industry: '互联网',
            currentDemand: 88,
            predictedGrowth: 12,
            confidence: 82,
            timeframe: '未来6个月',
            factors: ['产品创新需求', '用户体验重视', '敏捷开发普及'],
            recommendation: '建议加强产品设计能力，关注用户研究和数据分析'
          },
          {
            jobTitle: 'UI设计师',
            industry: '互联网',
            currentDemand: 75,
            predictedGrowth: 18,
            confidence: 80,
            timeframe: '未来6个月',
            factors: ['视觉设计重要性提升', '品牌建设需求', '用户体验优化'],
            recommendation: '建议关注设计趋势，提升交互设计和品牌设计能力'
          }
        ];

        const reports: MarketAnalysisReport[] = [
          {
            id: 'RPT001',
            title: '2024年12月市场分析报告',
            reportType: 'monthly',
            generateTime: '2024-12-01T00:00:00Z',
            summary: '本月市场整体呈现稳定增长态势，技术岗位需求持续上升，特别是数据分析和测试相关职位。',
            keyFindings: [
              '技术岗位需求增长15%，其中数据分析师需求增长最快',
              '一线城市岗位竞争激烈，二三线城市机会增多',
              '远程工作模式逐渐成为主流，影响地域分布',
              '技能要求更加多元化，复合型人才更受欢迎'
            ],
            marketTrends: [
              { trend: '数字化转型加速', impact: 'high', description: '企业数字化转型需求推动技术岗位需求增长' },
              { trend: 'AI技术普及', impact: 'medium', description: '人工智能技术在各行业的应用推动相关岗位需求' },
              { trend: '远程工作常态化', impact: 'medium', description: '远程工作模式改变地域分布和技能要求' }
            ],
            emergingJobs: [
              { jobTitle: 'AI产品经理', growthRate: 35, description: '负责AI产品规划管理', skills: ['产品管理','AI技术','数据分析','用户体验'] },
              { jobTitle: '数据安全工程师', growthRate: 28, description: '负责数据安全与隐私保护', skills: ['网络安全','数据保护','合规管理','风险评估'] }
            ],
            recommendations: [
              { category: '企业招聘', suggestion: '关注新兴技术岗位，提前布局人才储备', priority: 'high' },
              { category: '人才培养', suggestion: '加强跨领域技能培训，培养复合型人才', priority: 'medium' },
              { category: '市场策略', suggestion: '关注二三线城市市场，扩大招聘范围', priority: 'medium' }
            ],
            predictions: predictions.slice(0, 3)
          },
          {
            id: 'RPT002',
            title: '2024年第48周市场分析报告',
            reportType: 'weekly',
            generateTime: '2024-11-25T00:00:00Z',
            summary: '本周市场活跃度较高，技术岗位投递量增长明显，特别是前端和测试岗位。',
            keyFindings: [
              '前端工程师岗位投递量增长20%',
              '测试工程师需求持续增长',
              '产品经理岗位竞争激烈',
              'UI设计师岗位需求稳定'
            ],
            marketTrends: [
              { trend: '技术岗位需求增长', impact: 'high', description: '前端与测试相关职位需求显著' }
            ],
            emergingJobs: [
              { jobTitle: '全栈工程师', growthRate: 25, description: '具备前后端能力的工程师需求增长', skills: ['前端','后端','数据库','DevOps'] }
            ],
            recommendations: [
              { category: '技能提升', suggestion: '建议技术人员学习全栈技能，提升竞争力', priority: 'high' }
            ],
            predictions: predictions.slice(3, 5)
          }
        ];

        resolve({
          predictions,
          reports,
          lastUpdated: new Date().toISOString()
        });
      }, 600);
    });
  },

  // 生成新的市场分析报告
  generateMarketReport: (reportType: 'weekly' | 'monthly') => {
    return new Promise<MarketAnalysisReport>((resolve) => {
      setTimeout(() => {
        const now = new Date();
        const reportId = `RPT${String(Date.now()).slice(-6)}`;
        const title = reportType === 'weekly'
          ? `${now.getFullYear()}年第${Math.ceil((now.getTime() - new Date(`${now.getFullYear()}-01-01`).getTime()) / (7 * 24 * 60 * 60 * 1000))}周市场分析报告`
          : `${now.getFullYear()}年${now.getMonth() + 1}月市场分析报告`;

        const report: MarketAnalysisReport = {
          id: reportId,
          title,
          reportType,
          generateTime: now.toISOString(),
          summary: `${reportType === 'weekly' ? '本周' : '本月'}市场整体表现良好，技术岗位需求稳定增长。`,
          keyFindings: ['技术岗位需求持续增长', '新兴技术岗位机会增多', '技能要求更加多元化', '远程工作模式普及'],
          marketTrends: [{ trend: '技术岗位需求增长', impact: 'high', description: '新兴技术相关职位持续升温' }],
          emergingJobs: [{ jobTitle: '新兴技术岗位', growthRate: 20, description: '新技术相关岗位需求增长', skills: ['新技术','创新思维','学习能力'] }],
          recommendations: [{ category: '市场策略', suggestion: '关注新兴技术趋势，提前布局相关人才', priority: 'high' }],
          predictions: []
        };

        resolve(report);
      }, 800);
    });
  }

};
