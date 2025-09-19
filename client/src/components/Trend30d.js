import React, { useState, useEffect } from 'react';
import { Card, Spin, Alert } from 'antd';
import ReactECharts from 'echarts-for-react';
import { apiService } from '../services/api';
import moment from 'moment';

const Trend30d = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await apiService.getTrend30d();
      setData(result);
      setError(null);
    } catch (err) {
      setError('获取数据失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getChartOption = () => {
    const dates = data.map(item => moment(item.date).format('MM-DD'));
    const usedKwh = data.map(item => item.used_kwh);

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
    <div>
      <Card>
        <ReactECharts
          option={getChartOption()}
          style={{ height: '500px', width: '100%' }}
        />
      </Card>
    </div>
  );
};

export default Trend30d;
