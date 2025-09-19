const ElectricityDataModel = require('../models/ElectricityData');
const moment = require('moment');

class DataProcessor {
  // 计算单小时用电量
  static calculateHourlyUsage(currentData, previousData) {
    if (!previousData) return 0;
    
    const usage = previousData.remaining_kwh - currentData.remaining_kwh;
    return usage < 0 ? 0 : usage;
  }

  // 获取今日用电量
  static async getTodayUsage() {
    const ElectricityData = ElectricityDataModel();
    const today = moment().startOf('day').toDate();
    const now = new Date();
    
    // 计算今日用电量：今日开始时的剩余电量 - 当前剩余电量
    const todayStartData = await ElectricityData.findOne({
      collected_at: { $gte: today, $lte: now }
    }).sort({ collected_at: 1 });
    
    const currentData = await ElectricityData.findOne({
      collected_at: { $gte: today, $lte: now }
    }).sort({ collected_at: -1 });
    
    if (!todayStartData || !currentData) return 0;
    
    const usage = todayStartData.remaining_kwh - currentData.remaining_kwh;
    return usage < 0 ? 0 : usage;
  }

  // 获取本周用电量
  static async getWeekUsage() {
    const ElectricityData = ElectricityDataModel();
    const weekStart = moment().startOf('week').toDate();
    const now = new Date();
    
    // 计算本周用电量：本周开始时的剩余电量 - 当前剩余电量
    const weekStartData = await ElectricityData.findOne({
      collected_at: { $gte: weekStart, $lte: now }
    }).sort({ collected_at: 1 });
    
    const currentData = await ElectricityData.findOne({
      collected_at: { $gte: weekStart, $lte: now }
    }).sort({ collected_at: -1 });
    
    if (!weekStartData || !currentData) return 0;
    
    const usage = weekStartData.remaining_kwh - currentData.remaining_kwh;
    return usage < 0 ? 0 : usage;
  }

  // 获取本月用电量
  static async getMonthUsage() {
    const ElectricityData = ElectricityDataModel();
    const monthStart = moment().startOf('month').toDate();
    const now = new Date();
    
    // 计算本月用电量：本月开始时的剩余电量 - 当前剩余电量
    const monthStartData = await ElectricityData.findOne({
      collected_at: { $gte: monthStart, $lte: now }
    }).sort({ collected_at: 1 });
    
    const currentData = await ElectricityData.findOne({
      collected_at: { $gte: monthStart, $lte: now }
    }).sort({ collected_at: -1 });
    
    if (!monthStartData || !currentData) return 0;
    
    const usage = monthStartData.remaining_kwh - currentData.remaining_kwh;
    return usage < 0 ? 0 : usage;
  }

  // 获取过去24小时趋势数据
  static async get24HourTrend() {
    const ElectricityData = ElectricityDataModel();
    const startTime = moment().subtract(24, 'hours').toDate();
    const now = new Date();
    
    const data = await ElectricityData.find({
      collected_at: { $gte: startTime, $lte: now }
    }).sort({ collected_at: 1 });

    const trend = [];
    for (let i = 1; i < data.length; i++) {
      const current = data[i];
      const previous = data[i - 1];
      const usedKwh = this.calculateHourlyUsage(current, previous);
      
      trend.push({
        time: current.collected_at.toISOString(),
        used_kwh: usedKwh,
        remaining_kwh: current.remaining_kwh
      });
    }

    return trend;
  }

  // 获取当天用电（按小时）
  static async getTodayHourlyUsage() {
    const ElectricityData = ElectricityDataModel();
    const today = moment().startOf('day').toDate();
    const now = new Date();
    
    const data = await ElectricityData.find({
      collected_at: { $gte: today, $lte: now }
    }).sort({ collected_at: 1 });

    const hourlyUsage = new Array(24).fill(0);
    
    for (let i = 1; i < data.length; i++) {
      const current = data[i];
      const previous = data[i - 1];
      const hour = moment(current.collected_at).hour();
      const usedKwh = this.calculateHourlyUsage(current, previous);
      
      hourlyUsage[hour] += usedKwh;
    }

    return hourlyUsage.map((usage, hour) => ({
      hour,
      used_kwh: usage
    }));
  }

  // 获取最近30天每日用电
  static async get30DayTrend() {
    const ElectricityData = ElectricityDataModel();
    const startDate = moment().subtract(30, 'days').startOf('day').toDate();
    const endDate = moment().endOf('day').toDate();
    
    const data = await ElectricityData.find({
      collected_at: { $gte: startDate, $lte: endDate }
    }).sort({ collected_at: 1 });

    const dailyUsage = {};
    
    for (let i = 1; i < data.length; i++) {
      const current = data[i];
      const previous = data[i - 1];
      const date = moment(current.collected_at).format('YYYY-MM-DD');
      const usedKwh = this.calculateHourlyUsage(current, previous);
      
      if (!dailyUsage[date]) {
        dailyUsage[date] = 0;
      }
      dailyUsage[date] += usedKwh;
    }

    return Object.entries(dailyUsage).map(([date, used_kwh]) => ({
      date,
      used_kwh
    }));
  }

  // 获取每月用电
  static async getMonthlyTrend() {
    const ElectricityData = ElectricityDataModel();
    const startDate = moment().subtract(12, 'months').startOf('month').toDate();
    const endDate = moment().endOf('month').toDate();
    
    const data = await ElectricityData.find({
      collected_at: { $gte: startDate, $lte: endDate }
    }).sort({ collected_at: 1 });

    const monthlyUsage = {};
    
    for (let i = 1; i < data.length; i++) {
      const current = data[i];
      const previous = data[i - 1];
      const month = moment(current.collected_at).format('YYYY-MM');
      const usedKwh = this.calculateHourlyUsage(current, previous);
      
      if (!monthlyUsage[month]) {
        monthlyUsage[month] = 0;
      }
      monthlyUsage[month] += usedKwh;
    }

    return Object.entries(monthlyUsage).map(([month, used_kwh]) => ({
      month,
      used_kwh
    }));
  }

  // 获取最新数据
  static async getLatestData() {
    const ElectricityData = ElectricityDataModel();
    return await ElectricityData.findOne().sort({ _id: -1 });
  }
}

module.exports = DataProcessor;
