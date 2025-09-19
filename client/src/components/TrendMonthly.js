import React, { useState, useEffect } from 'react';
import { Card, Spin, Alert } from 'antd';
import ReactECharts from 'echarts-for-react';
import { apiService } from '../services/api';
import moment from 'moment';

const TrendMonthly = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await apiService.getTrendMonthly();
      setData(result);
      setError(null);
    } catch (err) {
      setError('获取数据失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getChartOption = () => {
    const months = data.map(item => moment(item.month).format('YYYY-MM'));
    const usedKwh = data.map(item => item.used_kwh);

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

export default TrendMonthly;
