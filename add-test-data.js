const mongoose = require('mongoose');
const ElectricityData = require('./models/ElectricityData');
const config = require('./config');
const moment = require('moment');

async function addTestData() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('连接MongoDB成功');
    
    // 获取最新数据
    const latest = await ElectricityData.findOne().sort({ collected_at: -1 });
    let remainingKwh = latest ? latest.remaining_kwh : 50.0;
    
    // 添加最近几小时的数据
    const now = moment();
    const data = [];
    
    for (let i = 0; i < 6; i++) {
      const time = now.clone().subtract(i, 'hours');
      const usage = Math.random() * 0.3 + 0.1; // 0.1-0.4 kWh
      remainingKwh += usage; // 模拟用电，剩余电量减少
      
      data.push({
        meter_id: '18100071580',
        meter_name: '2759弄18号402阳台',
        remaining_kwh: Math.round(remainingKwh * 100) / 100,
        collected_at: time.toDate()
      });
    }
    
    // 按时间顺序插入（最早的先插入）
    data.reverse();
    await ElectricityData.insertMany(data);
    
    console.log(`成功添加 ${data.length} 条测试数据`);
    console.log('最新数据:', data[data.length - 1]);
    
  } catch (error) {
    console.error('添加测试数据失败:', error);
  } finally {
    await mongoose.disconnect();
  }
}

addTestData();
