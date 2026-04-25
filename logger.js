const pino = require('pino');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

/**
 * Pino Logger Configuration
 * Outputs JSON by default.
 * Includes service_name, instance_id, and trace_id in standard metadata.
 */

const transport = pino.transport({
  targets: [
    {
      target: 'pino/file',
      options: { destination: 1 }, // stdout
      level: process.env.LOG_LEVEL || 'info'
    },
    {
      target: 'pino-loki',
      options: {
        batching: true,
        interval: 5,
        host: process.env.LOKI_HOST || 'http://localhost:3100',
        labels: { 
          job: 'mobile-money',
          service: 'payment-gateway'
        }
      },
      level: process.env.LOG_LEVEL || 'info'
    }
  ]
});

const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    // Standard metadata included in every log
    base: {
      service_name: 'mobile-money-api',
      instance_id: process.env.INSTANCE_ID || os.hostname(),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => {
        return { log_level: label.toUpperCase() };
      },
    },
    // Trace ID can be added per child logger or passed in log objects
    mixin() {
      return { trace_id: uuidv4() }; // Demo trace_id generation; in production use async_hooks or middleware
    }
  },
  transport
);

module.exports = logger;
