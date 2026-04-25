const pino = require('pino');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  base: {
    service_name: 'mobile-money-api',
    instance_id: process.env.INSTANCE_ID || os.hostname(),
  },
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  mixin() {
    return { trace_id: uuidv4() };
  }
});

module.exports = logger;
