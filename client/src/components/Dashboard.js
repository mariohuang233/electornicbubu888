import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, Alert, Tabs, Typography } from 'antd';
import { ThunderboltOutlined, CalendarOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { apiService } from '../services/api';
import moment from 'moment';

const { Title } = Typography;
const { TabPane } = Tabs;

const Dashboard = () => {
  const [overviewData, setOverviewData] = useState(null);
  const [trend24h, setTrend24h] = useState([]);
  const [trendToday, setTrendToday] = useState([]);
  const [trend30d, setTrend30d] = useState([]);
  const [trendMonthly, setTrendMonthly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [overview, trend24hData, trendTodayData, trend30dData, trendMonthlyData] = await Promise.all([
        apiService.getOverview(),
        apiService.getTrend24h(),
        apiService.getTrendToday(),
        apiService.getTrend30d(),
        apiService.getTrendMonthly()
      ]);

      setOverviewData(overview);
      setTrend24h(trend24hData);
      setTrendToday(trendTodayData);
      setTrend30d(trend30dData);
      setTrendMonthly(trendMonthlyData);
      setError(null);
    } catch (err) {
      setError('获取数据失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const get24HourChartOption = () => {
    const times = trend24h.map(item => moment(item.time).format('HH:mm'));
    const usedKwh = trend24h.map(item => item.used_kwh);
    const remainingKwh = trend24h.map(item => item.remaining_kwh);

    return {
      title: {
        text: '过去24小时用电趋势',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: ['用电量', '剩余电量'],
        top: 30
      },
      xAxis: {
        type: 'category',
        data: times,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '用电量 (kWh)',
          position: 'left'
        },
        {
          type: 'value',
          name: '剩余电量 (kWh)',
          position: 'right'
        }
      ],
      series: [
        {
          name: '用电量',
          type: 'bar',
          data: usedKwh,
          itemStyle: {
            color: '#1890ff'
          }
        },
        {
          name: '剩余电量',
          type: 'line',
          yAxisIndex: 1,
          data: remainingKwh,
          itemStyle: {
            color: '#52c41a'
          }
        }
      ]
    };
  };

  const getTodayChartOption = () => {
    const hours = trendToday.map(item => `${item.hour}:00`);
    const usedKwh = trendToday.map(item => item.used_kwh);

    return {
      title: {
        text: '当天用电分布（按小时）',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} kWh'
      },
      xAxis: {
        type: 'category',
        data: hours,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '用电量 (kWh)'
      },
      series: [
        {
          name: '用电量',
          type: 'bar',
          data: usedKwh,
          itemStyle: {
            color: '#1890ff'
          }
        }
      ]
    };
  };

  const get30DayChartOption = () => {
    const dates = trend30d.map(item => moment(item.date).format('MM-DD'));
    const usedKwh = trend30d.map(item => item.used_kwh);

    return {
      title: {
        text: '最近30天每日用电趋势',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} kWh'
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '用电量 (kWh)'
      },
      series: [
        {
          name: '用电量',
          type: 'line',
          data: usedKwh,
          smooth: true,
          itemStyle: {
            color: '#1890ff'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.1)' }
              ]
            }
          }
        }
      ]
    };
  };

  const getMonthlyChartOption = () => {
    const months = trendMonthly.map(item => moment(item.month).format('YYYY-MM'));
    const usedKwh = trendMonthly.map(item => item.used_kwh);

    return {
      title: {
        text: '最近12个月用电趋势',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} kWh'
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: '用电量 (kWh)'
      },
      series: [
        {
          name: '用电量',
          type: 'bar',
          data: usedKwh,
          itemStyle: {
            color: '#52c41a'
          }
        }
      ]
    };
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="错误"
        description={error}
        type="error"
        showIcon
        style={{ margin: '20px' }}
      />
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>
        家庭用电监控系统
      </Title>

      {/* 总览卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '30px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日用电"
              value={overviewData?.today_usage || 0}
              suffix="kWh"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="本周用电"
              value={overviewData?.week_usage || 0}
              suffix="kWh"
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="本月用电"
              value={overviewData?.month_usage || 0}
              suffix="kWh"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="本月费用"
              value={overviewData?.month_cost || 0}
              suffix="元"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 当前剩余电量和更新时间 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '30px' }}>
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="当前剩余电量"
              value={overviewData?.current_remaining || 0}
              suffix="kWh"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#722ed1', fontSize: '24px' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12}>
          <Card>
            <Statistic
              title="最新更新时间"
              value={overviewData?.last_updated ? moment(overviewData.last_updated).format('YYYY-MM-DD HH:mm:ss') : '暂无数据'}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#13c2c2', fontSize: '16px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表标签页 */}
      <Card>
        <Tabs defaultActiveKey="24h" type="card">
          <TabPane tab="24小时趋势" key="24h">
            <ReactECharts
              option={get24HourChartOption()}
              style={{ height: '400px', width: '100%' }}
            />
          </TabPane>
          
          <TabPane tab="当天用电" key="today">
            <ReactECharts
              option={getTodayChartOption()}
              style={{ height: '400px', width: '100%' }}
            />
          </TabPane>
          
          <TabPane tab="30天趋势" key="30d">
            <ReactECharts
              option={get30DayChartOption()}
              style={{ height: '400px', width: '100%' }}
            />
          </TabPane>
          
          <TabPane tab="月度趋势" key="monthly">
            <ReactECharts
              option={getMonthlyChartOption()}
              style={{ height: '400px', width: '100%' }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Dashboard;
