# 使用官方Node.js 20镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production --no-audit --no-fund

# 复制源代码
COPY . .

# 构建前端
WORKDIR /app/client
RUN npm install
RUN npm run build

# 回到根目录
WORKDIR /app

# 创建logs目录
RUN mkdir -p logs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV=production

# 启动应用
CMD ["node", "server.js"]
