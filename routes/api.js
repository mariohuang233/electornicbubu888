const express = require('express');
const router = express.Router();
const DataProcessor = require('../services/dataProcessor');
const logger = require('../utils/logger');
const moment = require('moment');

// 总览接口
router.get('/overview', async (req, res) => {
  try {
    const [todayUsage, weekUsage, monthUsage, latestData] = await Promise.all([
      DataProcessor.getTodayUsage(),
      DataProcessor.getWeekUsage(),
      DataProcessor.getMonthUsage(),
      DataProcessor.getLatestData()
    ]);

    res.json({
      today_usage: Math.round(todayUsage * 100) / 100,
      week_usage: Math.round(weekUsage * 100) / 100,
      month_usage: Math.round(monthUsage * 100) / 100,
      month_cost: Math.round(monthUsage * 100) / 100, // 1元/kWh
      current_remaining: latestData ? Math.round(latestData.remaining_kwh * 100) / 100 : 0,
      last_updated: latestData ? moment(latestData.collected_at).utcOffset(8).format('YYYY-MM-DD HH:mm:ss') : null
    });
  } catch (error) {
    logger.error('获取总览数据失败:', error);
    res.status(500).json({ error: '获取总览数据失败' });
  }
});

// 过去24小时趋势
router.get('/trend/24h', async (req, res) => {
  try {
    const trend = await DataProcessor.get24HourTrend();
    res.json(trend);
  } catch (error) {
    logger.error('获取24小时趋势失败:', error);
    res.status(500).json({ error: '获取24小时趋势失败' });
  }
});

// 当天用电（按小时）
router.get('/trend/today', async (req, res) => {
  try {
    const hourlyUsage = await DataProcessor.getTodayHourlyUsage();
    res.json(hourlyUsage);
  } catch (error) {
    logger.error('获取当天用电数据失败:', error);
    res.status(500).json({ error: '获取当天用电数据失败' });
  }
});

// 最近30天每日用电
router.get('/trend/30d', async (req, res) => {
  try {
    const dailyTrend = await DataProcessor.get30DayTrend();
    res.json(dailyTrend);
  } catch (error) {
    logger.error('获取30天趋势失败:', error);
    res.status(500).json({ error: '获取30天趋势失败' });
  }
});

// 每月用电
router.get('/trend/monthly', async (req, res) => {
  try {
    const monthlyTrend = await DataProcessor.getMonthlyTrend();
    res.json(monthlyTrend);
  } catch (error) {
    logger.error('获取月度趋势失败:', error);
    res.status(500).json({ error: '获取月度趋势失败' });
  }
});

module.exports = router;
