const ElectricityScraper = require('./services/scraper');
const Database = require('./database');
const logger = require('./utils/logger');

async function testScraper() {
  try {
    console.log('🔗 连接数据库...');
    await Database.connect();
    
    console.log('🕷️ 测试爬虫功能...');
    const scraper = new ElectricityScraper();
    const success = await scraper.scrapeData();
    
    if (success) {
      console.log('✅ 爬虫测试成功！');
    } else {
      console.log('❌ 爬虫测试失败！');
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  } finally {
    await Database.disconnect();
    process.exit(0);
  }
}

testScraper();
