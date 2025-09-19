import React, { useState, useEffect } from 'react';
import { Card, Spin, Alert } from 'antd';
import ReactECharts from 'echarts-for-react';
import { apiService } from '../services/api';
import moment from 'moment';

const Trend24h = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await apiService.getTrend24h();
      setData(result);
      setError(null);
    } catch (err) {
      setError('获取数据失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getChartOption = () => {
    const times = data.map(item => moment(item.time).format('HH:mm'));
    const usedKwh = data.map(item => item.used_kwh);
    const remainingKwh = data.map(item => item.remaining_kwh);

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

export default Trend24h;
