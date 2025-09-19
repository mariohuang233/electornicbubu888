const cron = require('node-cron');
const ElectricityScraper = require('./services/scraper');
const logger = require('./utils/logger');
const config = require('./config');

class Scheduler {
  constructor() {
    this.scraper = new ElectricityScraper();
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) {
      logger.warn('调度器已经在运行中');
      return;
    }

    logger.info(`启动定时任务，间隔: ${config.SCRAPER_INTERVAL}`);
    
    // 启动时立即执行一次
    this.runScraper();
    
    // 设置定时任务
    cron.schedule(config.SCRAPER_INTERVAL, () => {
      this.runScraper();
    });

    this.isRunning = true;
    logger.info('定时任务启动成功');
  }

  stop() {
    if (!this.isRunning) {
      logger.warn('调度器未在运行');
      return;
    }

    cron.destroy();
    this.isRunning = false;
    logger.info('定时任务已停止');
  }

  async runScraper() {
    try {
      logger.info('开始执行爬虫任务');
      const success = await this.scraper.scrapeData();
      
      if (success) {
        logger.info('爬虫任务执行成功');
      } else {
        logger.error('爬虫任务执行失败');
      }
    } catch (error) {
      logger.error('爬虫任务执行异常:', error);
    }
  }

  // 手动触发爬虫任务（用于测试）
  async triggerScraper() {
    logger.info('手动触发爬虫任务');
    return await this.runScraper();
  }
}

module.exports = Scheduler;
