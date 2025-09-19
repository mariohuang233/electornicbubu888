#!/usr/bin/env node

// Railway启动脚本 - 避免依赖冲突
const { spawn } = require('child_process');
const path = require('path');

// 设置环境变量
process.env.NODE_ENV = 'production';

// 启动服务器
const server = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

server.on('error', (err) => {
  console.error('启动失败:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  console.log(`服务器退出，代码: ${code}`);
  process.exit(code);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到SIGTERM信号，关闭服务器...');
  server.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('收到SIGINT信号，关闭服务器...');
  server.kill('SIGINT');
});
