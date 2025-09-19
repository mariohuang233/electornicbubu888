const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./utils/logger');

class Database {
  static async connect() {
    try {
      await mongoose.connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      
      logger.info('MongoDB连接成功');
      
      // 监听连接事件
      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB连接错误:', err);
      });
      
      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB连接断开');
      });
      
      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB重新连接成功');
      });
      
    } catch (error) {
      logger.error('MongoDB连接失败:', error);
      throw error;
    }
  }
  
  static async disconnect() {
    try {
      await mongoose.disconnect();
      logger.info('MongoDB连接已关闭');
    } catch (error) {
      logger.error('关闭MongoDB连接失败:', error);
    }
  }
}

module.exports = Database;
