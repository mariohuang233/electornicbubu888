#!/bin/bash

echo "🔧 启动开发环境..."

# 检查Node.js版本
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装Node.js (版本 >= 18.0.0)"
    exit 1
fi

# 安装后端依赖
echo "📦 安装后端依赖..."
npm install

# 安装前端依赖
echo "📦 安装前端依赖..."
cd client
npm install
cd ..

# 创建logs目录
mkdir -p logs

echo "✅ 开发环境准备完成"
echo "🎯 启动开发服务器..."

# 启动后端开发服务器
npm run dev &
BACKEND_PID=$!

# 等待后端启动
sleep 3

# 启动前端开发服务器
cd client
npm start &
FRONTEND_PID=$!

# 等待用户中断
echo "按 Ctrl+C 停止开发服务器"
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

wait
