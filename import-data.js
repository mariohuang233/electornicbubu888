const mongoose = require('mongoose');
const ElectricityData = require('./models/ElectricityData');
const config = require('./config');
const moment = require('moment');

// 模拟历史数据导入
async function importHistoricalData() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('连接MongoDB成功');
    
    // 检查是否已有数据
    const existingCount = await ElectricityData.countDocuments();
    if (existingCount > 0) {
      console.log(`数据库中已有 ${existingCount} 条数据`);
      return;
    }
    
    console.log('开始导入模拟历史数据...');
    
    // 生成过去30天的模拟数据
    const data = [];
    const startDate = moment().subtract(30, 'days').startOf('day');
    const endDate = moment().endOf('day');
    
    let currentDate = startDate.clone();
    let remainingKwh = 100.0; // 初始剩余电量
    
    while (currentDate.isBefore(endDate)) {
      // 每天生成24条数据（每小时一条）
      for (let hour = 0; hour < 24; hour++) {
        const dataTime = currentDate.clone().add(hour, 'hours');
        
        // 模拟用电量（夜间用电少，白天用电多）
        let hourlyUsage = 0;
        if (hour >= 6 && hour <= 22) {
          // 白天用电量
          hourlyUsage = Math.random() * 0.5 + 0.2; // 0.2-0.7 kWh
        } else {
          // 夜间用电量
          hourlyUsage = Math.random() * 0.2 + 0.05; // 0.05-0.25 kWh
        }
        
        remainingKwh -= hourlyUsage;
        if (remainingKwh < 0) remainingKwh = 0; // 防止负数
        
        data.push({
          meter_id: '18100071580',
          meter_name: '2759弄18号402阳台',
          remaining_kwh: Math.round(remainingKwh * 100) / 100,
          collected_at: dataTime.toDate()
        });
      }
      
      currentDate.add(1, 'day');
    }
    
    // 批量插入数据
    await ElectricityData.insertMany(data);
    console.log(`成功导入 ${data.length} 条历史数据`);
    
    // 显示统计信息
    const totalCount = await ElectricityData.countDocuments();
    const latest = await ElectricityData.findOne().sort({ collected_at: -1 });
    const oldest = await ElectricityData.findOne().sort({ collected_at: 1 });
    
    console.log('数据统计:');
    console.log(`总数据条数: ${totalCount}`);
    console.log(`数据时间范围: ${moment(oldest.collected_at).format('YYYY-MM-DD HH:mm')} 到 ${moment(latest.collected_at).format('YYYY-MM-DD HH:mm')}`);
    console.log(`最新剩余电量: ${latest.remaining_kwh} kWh`);
    
  } catch (error) {
    console.error('导入数据失败:', error);
  } finally {
    await mongoose.disconnect();
  }
}

importHistoricalData();
