// backend/server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
// CORS 允许前端来源（开发端口可能变动，尽量覆盖常见端口）
const allowedOrigins = [
  'https://labelwall.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174'
];

app.use(cors({
  origin: function(origin, callback) {
    // 兼容本地直接打开文件或无 Origin 的情况
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: false
}));
app.use(express.json());

/**
 * 配置
 * 注意：生产请放到环境变量
 */
const APP_ID = 'wx80165734ffa68ebf';
const APP_SECRET = 'd95324476ca7cb8169eee504a151ec50';
const PORT = 3001;

// 你的前端地址，用于回调完成后给用户提示或自动关闭页签（可选）
const FRONTEND_ORIGIN = 'https://labelwall.com'; // 前端页面域名（用于回跳提示页）
const BASE_URL = 'https://labelwall.com';        // 你的公网域名（需和开放平台配置一致）
const REDIRECT_URI = encodeURIComponent(`${BASE_URL}/wechat/callback`);

// 简单的内存态存储 state -> { status, user }
const loginStateStore = new Map();
// 状态过期时间（毫秒）
const STATE_TTL = 5 * 60 * 1000;

function generateState() {
  return crypto.randomBytes(16).toString('hex');
}

function setState(state, data) {
  loginStateStore.set(state, { ...data, ts: Date.now() });
}

function getState(state) {
  const v = loginStateStore.get(state);
  if (!v) return null;
  if (Date.now() - v.ts > STATE_TTL) {
    loginStateStore.delete(state);
    return null;
  }
  return v;
}

/**
 * 1. 前端请求扫码链接
 */
app.get('/wechat/login-url', (req, res) => {
  const state = (req.query.state && String(req.query.state)) || generateState();
  // 记录初始状态
  setState(state, { status: 'pending' });

  const url =
    `https://open.weixin.qq.com/connect/qrconnect` +
    `?appid=${APP_ID}` +
    `&redirect_uri=${REDIRECT_URI}` +
    `&response_type=code` +
    `&scope=snsapi_login` +
    `&state=${state}#wechat_redirect`;

  res.json({ state, url });
});

/**
 * 2. 微信回调
 * GET /wechat/callback?code=xxx&state=yyy
 */
app.get('/wechat/callback', async (req, res) => {
  const { code, state } = req.query;
  if (!code || !state) {
    return res.status(400).send('Missing code or state');
  }

  try {
    // 2.1 用 code 换 access_token
    const tokenResp = await axios.get(
      `https://api.weixin.qq.com/sns/oauth2/access_token`,
      {
        params: {
          appid: APP_ID,
          secret: APP_SECRET,
          code,
          grant_type: 'authorization_code',
        },
      }
    );

    const tokenData = tokenResp.data;
    if (!tokenData.access_token || !tokenData.openid) {
      setState(state, { status: 'error', error: tokenData });
      return res.status(500).send('Failed to get access_token');
    }

    // 2.2 拉取用户信息
    const userResp = await axios.get(
      `https://api.weixin.qq.com/sns/userinfo`,
      {
        params: {
          access_token: tokenData.access_token,
          openid: tokenData.openid,
        },
      }
    );

    const user = userResp.data;

    // 标记登录完成，把必要信息存进状态
    // 注意：生产不要把 access_token 直接返回给前端
    setState(state, {
      status: 'ok',
      user: {
        openid: user.openid,
        nickname: user.nickname,
        headimgurl: user.headimgurl,
      },
    });

    // 简单提示页（也可以重定向到前端某个完成页）
    res.send(`
      <html>
        <body>
          <h3>微信扫码成功，您可以回到原页面继续操作。</h3>
          <script>
            setTimeout(function(){
              window.location.href = '${FRONTEND_ORIGIN}';
            }, 1000);
          </script>
        </body>
      </html>
    `);
    console.log('WeChat login ok:', user.openid, user.nickname);
  } catch (e) {
    setState(state, { status: 'error', error: e?.message || 'unknown' });
    res.status(500).send('WeChat callback error');
  }
});

/**
 * 3. 前端轮询状态
 */
app.get('/wechat/status', (req, res) => {
  const state = String(req.query.state || '');
  if (!state) return res.status(400).json({ status: 'error', error: 'no_state' });

  const data = getState(state);
  if (!data) return res.json({ status: 'pending' });

  res.json({ status: data.status, user: data.user || null });
});

app.listen(PORT, () => {
  console.log(`WeChat auth server listening on http://localhost:${PORT}`);
});

app.get('/debug/state', (req, res) => {
  const s = String(req.query.state || '');
  res.json(getState(s) || { status: 'none' });
});