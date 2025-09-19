# 部署指南

## 🚀 快速启动

### 1. 本地开发
```bash
# 安装依赖并启动
./start.sh
```

### 2. 开发模式
```bash
# 启动开发服务器（前后端分离）
./dev.sh
```

### 3. 测试爬虫
```bash
# 测试爬虫功能
node test-scraper.js
```

## 🌐 部署到云平台

### Railway部署

1. **连接GitHub**
   - 将代码推送到GitHub仓库
   - 在Railway中连接GitHub仓库

2. **配置环境变量**
   ```
   MONGODB_URI=mongodb+srv://mariohuang:Huangjw1014@yierbubu.aha67vc.mongodb.net/?retryWrites=true&w=majority&appName=yierbubu
   NODE_ENV=production
   PORT=3000
   ```

3. **自动部署**
   - Railway会自动检测到Node.js项目
   - 自动安装依赖并构建前端
   - 自动启动服务器

### Zeabur部署

1. **连接GitHub**
   - 将代码推送到GitHub仓库
   - 在Zeabur中连接GitHub仓库

2. **配置环境变量**
   ```
   MONGODB_URI=mongodb+srv://mariohuang:Huangjw1014@yierbubu.aha67vc.mongodb.net/?retryWrites=true&w=majority&appName=yierbubu
   NODE_ENV=production
   ```

3. **选择Node.js环境**
   - 选择Node.js 18+
   - 自动部署

### Docker部署

```bash
# 构建镜像
docker build -t elec-monitor .

# 运行容器
docker run -p 3000:3000 \
  -e MONGODB_URI="mongodb+srv://mariohuang:Huangjw1014@yierbubu.aha67vc.mongodb.net/?retryWrites=true&w=majority&appName=yierbubu" \
  elec-monitor
```

## 📊 监控与维护

### 健康检查
- 访问 `/health` 端点检查服务状态
- 检查 `/api/overview` 获取数据状态

### 日志查看
- 应用日志: `logs/combined.log`
- 错误日志: `logs/error.log`

### 手动触发爬虫
```bash
curl -X POST https://your-domain.com/api/trigger-scraper
```

## 🔧 配置说明

### 爬虫配置
- **频率**: 每10分钟执行一次
- **重试**: 失败时自动重试3次
- **超时**: 10秒请求超时

### 数据库配置
- **连接**: MongoDB Atlas云数据库
- **索引**: 自动创建性能优化索引
- **备份**: 建议启用自动备份

### 前端配置
- **构建**: 生产环境自动构建
- **缓存**: 静态资源自动缓存
- **压缩**: 自动启用Gzip压缩

## 🚨 故障排除

### 常见问题

1. **爬虫失败**
   - 检查网络连接
   - 验证目标网站是否可访问
   - 查看错误日志

2. **数据库连接失败**
   - 检查MongoDB连接字符串
   - 验证网络访问权限
   - 检查数据库服务状态

3. **前端无法访问**
   - 检查构建是否成功
   - 验证静态文件路径
   - 检查服务器配置

### 性能优化

1. **数据库优化**
   - 定期清理旧数据
   - 监控查询性能
   - 优化索引策略

2. **服务器优化**
   - 启用Gzip压缩
   - 配置CDN加速
   - 监控内存使用

## 📈 扩展功能

### 多电表支持
- 修改爬虫支持多个电表
- 更新数据模型支持多表
- 前端展示多表数据

### 报警功能
- 设置用电量阈值
- 邮件/短信通知
- 微信推送集成

### 数据分析
- 用电模式分析
- 费用预测
- 节能建议

## 🔒 安全建议

1. **环境变量**
   - 不要将敏感信息提交到代码库
   - 使用环境变量管理配置

2. **访问控制**
   - 配置防火墙规则
   - 启用HTTPS
   - 设置访问限制

3. **数据安全**
   - 定期备份数据
   - 加密敏感信息
   - 监控异常访问
