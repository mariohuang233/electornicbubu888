const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('./database');
const Scheduler = require('./scheduler');
const apiRoutes = require('./routes/api');
const config = require('./config');
const logger = require('./utils/logger');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务（前端构建文件）
app.use(express.static(path.join(__dirname, 'client/build')));

// API路由
app.use('/api', apiRoutes);

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 手动触发爬虫接口（用于测试）
app.post('/api/trigger-scraper', async (req, res) => {
  try {
    const scheduler = new Scheduler();
    const success = await scheduler.triggerScraper();
    res.json({ success, message: success ? '爬虫任务执行成功' : '爬虫任务执行失败' });
  } catch (error) {
    logger.error('手动触发爬虫失败:', error);
    res.status(500).json({ success: false, message: '手动触发爬虫失败' });
  }
});

// 前端路由（React Router）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error('服务器错误:', err);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
async function startServer() {
  try {
    // 连接数据库
    await Database.connect();
    
    // 启动定时任务
    const scheduler = new Scheduler();
    scheduler.start();
    
    // 启动HTTP服务器
    const server = app.listen(config.PORT, () => {
      logger.info(`服务器启动成功，端口: ${config.PORT}`);
      logger.info(`环境: ${config.NODE_ENV}`);
    });

    // 优雅关闭
    process.on('SIGTERM', async () => {
      logger.info('收到SIGTERM信号，开始优雅关闭...');
      scheduler.stop();
      server.close(async () => {
        await Database.disconnect();
        process.exit(0);
      });
    });

    process.on('SIGINT', async () => {
      logger.info('收到SIGINT信号，开始优雅关闭...');
      scheduler.stop();
      server.close(async () => {
        await Database.disconnect();
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('服务器启动失败:', error);
    process.exit(1);
  }
}

// 启动应用
startServer();
