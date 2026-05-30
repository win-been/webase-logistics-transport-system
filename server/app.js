// 1. 导入核心模块和第三方依赖
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');

// 2. 创建 Express 应用实例
const app = express();
const server = http.createServer(app);

// 3. 配置跨域（CORS）
const corsOptions = {
    origin: "http://localhost:8000", // 前端地址
    credentials: true, // 允许跨域携带 Cookie（Session 认证需要）
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // 允许的请求方法
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"] // 允许的请求头
};
app.use(cors(corsOptions));

// 4. 基础中间件配置
app.use(logger('dev')); // 日志中间件（开发环境）
app.use(express.json()); // 替代 bodyParser.json()（Express 内置）
app.use(express.urlencoded({ extended: true })); // 替代 bodyParser.urlencoded()
app.use(cookieParser()); // Cookie 解析
app.use(express.static(path.join(__dirname, 'public'))); // 静态文件托管

// 5. Session 配置
app.use(session({
    secret: 'your-secret-key-123456', // 加密密钥（建议用环境变量）
    resave: false, // 避免重复存储（性能优化）
    saveUninitialized: false, // 不存储未初始化的 Session（合规性）
    cookie: {
        maxAge: 1000 * 60 * 30, // Session 有效期 30 分钟
        httpOnly: true, // 防止 XSS 攻击（前端无法通过 JS 访问 Cookie）
        secure: process.env.NODE_ENV === 'production', // 生产环境启用 HTTPS
        sameSite: 'lax' // 防止 CSRF 攻击
    },
    rolling: true, // 每次请求刷新 Session 有效期
    name: "app-session-id" // 自定义 Session Cookie 名称
}));

// 6. 数据库连接（Sequelize 示例）
const db = require("./models");
// 同步数据库（开发环境可加 {alter: true}，生产环境慎用 {force: true}）
db.sequelize.sync({ alter: false })
    .then(() => console.log('数据库连接成功并同步完成'))
    .catch(err => console.error('数据库同步失败:', err));

// 7. 挂载路由（模块化路由）
require("./routes/userRouter")(app);
require("./routes/goodsRouter")(app);
require("./routes/formRouter")(app);

// 8. 全局错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? err : {} // 开发环境返回详细错误
    });
});

// 9. 404 处理中间件
app.use((req, res) => {
    res.status(404).json({ message: `请求地址 ${req.originalUrl} 不存在` });
});

// 10. 启动服务器
const PORT = process.env.PORT || 8001;
server.listen(PORT, () => {
    console.log(`服务器已启动，监听地址：http://localhost:${PORT}`);
});

// 导出 app 供测试或其他模块使用
module.exports = app;
