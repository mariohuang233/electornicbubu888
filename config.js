module.exports = {
  // MongoDB连接字符串
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://mariohuang:Huangjw1014@yierbubu.aha67vc.mongodb.net/?retryWrites=true&w=majority&appName=yierbubu',
  
  // 服务器配置
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'production',
  
  // 爬虫配置
  SCRAPER_URL: process.env.SCRAPER_URL || 'http://www.wap.cnyiot.com/nat/pay.aspx?mid=18100071580',
  SCRAPER_INTERVAL: process.env.SCRAPER_INTERVAL || '*/10 * * * *',
  
  // 日志配置
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};
