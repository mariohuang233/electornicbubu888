const mongoose = require('mongoose');

const electricityDataSchema = new mongoose.Schema({
  meter_id: {
    type: String,
    required: true,
    index: true
  },
  meter_name: {
    type: String,
    required: true
  },
  remaining_kwh: {
    type: Number,
    required: true
  },
  collected_at: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// 创建复合索引以提高查询性能
electricityDataSchema.index({ meter_id: 1, collected_at: -1 });
electricityDataSchema.index({ collected_at: -1 });

// 连接到electricity_monitor数据库
module.exports = function() {
  const db = mongoose.connection.useDb('electricity_monitor');
  return db.model('ElectricityReading', electricityDataSchema, 'electricityreadings');
};
