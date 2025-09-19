# 家庭用电监控与可视化系统

一个基于Node.js和React的家庭用电监控系统，支持自动数据采集、存储和可视化展示。

## 功能特性

- 🔄 **自动数据采集**: 每10分钟自动爬取电表数据
- 📊 **数据可视化**: 多种图表展示用电趋势
- 💾 **数据存储**: MongoDB存储历史数据
- 📱 **响应式设计**: 支持移动端和桌面端
- 🚀 **一键部署**: 支持Railway和Zeabur部署

## 技术栈

### 后端
- Node.js + Express
- MongoDB + Mongoose
- Cheerio (网页解析)
- Node-cron (定时任务)
- Winston (日志管理)

### 前端
- React 18
- Ant Design
- ECharts
- React Router

## 项目结构

```
elec12/
├── client/                 # React前端
│   ├── public/
│   ├── src/
│   │   ├── components/   # React组件
│   │   ├── services/      # API服务
│   │   └── App.js
│   └── package.json
├── models/                # 数据模型
├── routes/                # API路由
├── services/              # 业务逻辑
├── utils/                 # 工具函数
├── logs/                  # 日志文件
├── server.js              # 主服务器文件
└── package.json
```

## 快速开始

### 1. 安装依赖

```bash
# 安装后端依赖
npm install

# 安装前端依赖
cd client && npm install
```

### 2. 配置环境变量

复制 `config.js` 中的MongoDB连接字符串，或设置环境变量：

```bash
export MONGODB_URI="your_mongodb_connection_string"
export PORT=3000
```

### 3. 启动开发服务器

```bash
# 启动后端服务器
npm run dev

# 启动前端开发服务器（新终端）
cd client && npm start
```

### 4. 构建生产版本

```bash
# 构建前端
cd client && npm run build

# 启动生产服务器
npm start
```

## API接口

### 总览数据
```
GET /api/overview
```

### 趋势数据
```
GET /api/trend/24h      # 24小时趋势
GET /api/trend/today    # 当天用电
GET /api/trend/30d      # 30天趋势
GET /api/trend/monthly  # 月度趋势
```

### 手动触发爬虫
```
POST /api/trigger-scraper
```

### 健康检查
```
GET /health
```

## 部署

### Railway部署

1. 连接GitHub仓库到Railway
2. 设置环境变量：
   - `MONGODB_URI`: MongoDB连接字符串
   - `NODE_ENV`: production
3. 自动部署

### Zeabur部署

1. 连接GitHub仓库到Zeabur
2. 设置环境变量
3. 选择Node.js环境
4. 自动部署

### Docker部署

```bash
# 构建镜像
docker build -t elec-monitor .

# 运行容器
docker run -p 3000:3000 -e MONGODB_URI="your_connection_string" elec-monitor
```

## 数据模型

### 电表数据
```javascript
{
  meter_id: "18100071580",
  meter_name: "2759弄18号402阳台", 
  remaining_kwh: 9.84,
  collected_at: "2025-09-18T10:10:00Z"
}
```

## 定时任务

- **频率**: 每10分钟 (`*/10 * * * *`)
- **重试**: 失败时自动重试3次
- **日志**: 所有操作记录到 `logs/` 目录

## 监控与日志

- 应用日志: `logs/combined.log`
- 错误日志: `logs/error.log`
- 健康检查: `/health` 端点

## 开发说明

### 爬虫配置

需要根据实际网页结构调整 `services/scraper.js` 中的选择器：

```javascript
extractMeterName($) {
  // 根据实际网页结构调整
  return $('.meter-name').text().trim();
}
```

### 数据计算

用电量计算逻辑：
- 单小时用电 = 上一条剩余电量 - 当前剩余电量
- 负数视为充值，按0处理

## 许可证

MIT License
