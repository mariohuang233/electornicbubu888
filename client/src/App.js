import React from 'react';
import { Layout } from 'antd';
import Dashboard from './components/Dashboard';
import './App.css';

const { Header, Content } = Layout;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ color: '#1890ff', fontSize: '20px', fontWeight: 'bold' }}>
          家庭用电监控系统
        </div>
      </Header>
      <Content>
        <Dashboard />
      </Content>
    </Layout>
  );
}

export default App;
