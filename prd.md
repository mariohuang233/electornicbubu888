好👌，那我帮你把 **完整 PRD + 推荐目录结构 + 数据流设计** 全部写出来，这样你直接丢给 Cursor，它就能按这个文档搭完整项目。

---

# PRD：家庭用电监控与可视化系统（Cursor 版）

## 一、项目目标

* 每 10 分钟自动从 `http://www.wap.cnyiot.com/nat/pay.aspx?mid=18100071580` 爬取电表数据，存储到 MongoDB。
* 支持已有历史数据，统一在一个集合里使用。
* 提供 API，输出用电总览与趋势数据。
* 前端 React 网站，展示总览、趋势图表、费用估算。
* 主部署在 **Railway**，备用 **Zeabur**，配置保持一致。

---

## 二、功能需求

### 1. 数据采集（爬虫）

* **周期**：每 10 分钟（cron 表达式：`*/10 * * * *`）。
* **采集内容**：

  * 表名称 → `meter_name` (string)
  * 表号 → `meter_id` (string)
  * 剩余电量 → `remaining_kwh` (float, 单位 kWh)
* **存储结构**：

  ```json
  {
    "meter_id": "18100071580",
    "meter_name": "2759弄18号402阳台",
    "remaining_kwh": 9.84,
    "collected_at": "2025-09-18T10:10:00Z"
  }
  ```
* **逻辑**：

  * 每次新增一条数据，不覆盖。
  * 失败自动重试 3 次，失败日志写入 `logs/`.

---

### 2. 数据处理

* **单小时用电**：
  `本小时用电量 = 上一条剩余电量 - 当前剩余电量`

  * 若结果 < 0，视为充值，按 0 处理。

* **累计统计**：

  * 今日用电量（当天 00:00 至当前）
  * 本周用电量（周一 00:00 至当前）
  * 本月用电量（当月 1 号 00:00 至当前）
  * 本月预计费用 = 本月用电量 × 1 元/kWh

---

### 3. API 接口

#### (1) 总览

`GET /api/overview`
返回：

```json
{
  "today_usage": 3.2,
  "week_usage": 21.4,
  "month_usage": 85.6,
  "month_cost": 85.6
}
```

#### (2) 过去 24 小时趋势

`GET /api/trend/24h`
返回：

```json
[
  {"time": "2025-09-18T01:00:00Z", "used_kwh": 0.5, "remaining_kwh": 9.3},
  {"time": "2025-09-18T02:00:00Z", "used_kwh": 0.4, "remaining_kwh": 8.9}
]
```

#### (3) 当天用电（按小时）

`GET /api/trend/today`
返回：

```json
[
  {"hour": 0, "used_kwh": 0.2},
  {"hour": 1, "used_kwh": 0.5},
  {"hour": 2, "used_kwh": 0.4}
]
```

#### (4) 最近 30 天每日用电

`GET /api/trend/30d`
返回：

```json
[
  {"date": "2025-09-01", "used_kwh": 2.1},
  {"date": "2025-09-02", "used_kwh": 3.4}
]
```

#### (5) 每月用电

`GET /api/trend/monthly`
返回：

```json
[
  {"month": "2025-07", "used_kwh": 102.4},
  {"month": "2025-08", "used_kwh": 98.7}
]
```

---

### 4. 前端页面

* **总览页**：展示今日、本周、本月用电 + 本月预计费用。
* **用电趋势页**：过去 24 小时（剩余电量折线 + 用电柱状）。
* **当天用电页**：自然日 0–24 点（当前小时之前）。
* **每日趋势页**：最近 30 天。
* **每月趋势页**：最近 12 个月。

**前端栈**：React + ECharts（移动端 + 桌面端自适应）。

---

### 5. 部署与配置

* 主：Railway
* 备：Zeabur
* 配置保持一致：

  ```bash
  MONGO_URI=<your_mongo_connection>
  PORT=3000
  CRON_EXPRESSION=*/10 * * * *
  ```
* 支持 GitHub 自动部署。
mongo: mongodb+srv://mariohuang:<Huangjw1014>@yierbubu.aha67vc.mongodb.net/?retryWrites=true&w=majority&appName=yierbubu
---

## 三、非功能需求

* **性能**：支持 1 年数据（约 50k 条），查询响应 <1s。
* **安全**：敏感信息放环境变量，不写死。
* **扩展性**：支持未来添加多个电表。
* **容错**：爬虫异常写日志，不影响主系统。

---

## 四、推荐目录结构

```
project-root/
│
├── backend/
│   ├── src/
│   │   ├── index.js          # Express 入口
│   │   ├── routes/           # API 路由
│   │   ├── services/         # 业务逻辑（计算用电量等）
│   │   ├── models/           # Mongo Schema
│   │   ├── utils/            # 工具函数
│   │   └── crawler/          # 爬虫调度
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── pages/            # 总览、趋势等页面
│   │   ├── components/       # 公共组件（图表卡片等）
│   │   ├── api/              # 前端请求封装
│   │   └── App.js
│   ├── package.json
│   └── Dockerfile
│
├── logs/                     # 爬虫/系统日志
├── docker-compose.yml         # 本地开发可选
└── README.md
```

---

## 五、数据流

1. **Crawler** → 每 10 分钟请求电表 URL → 解析数据 → 写入 MongoDB。
2. **Backend** → 提供 REST API → 聚合计算用电量。
3. **Frontend** → 调用 API → ECharts 渲染图表。
4. **Deployment** → Railway（主），Zeabur（备），通过环境变量切换。
