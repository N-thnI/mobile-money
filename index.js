const logger = require('./logger');

/**
 * Mobile Money Service Entry Point
 */

logger.info({ 
    event: 'service_start',
    message: 'Mobile Money Centralized Logging Demo is starting...' 
});

// Simulate some activity
setInterval(() => {
    const isError = Math.random() > 0.9;
    if (isError) {
        logger.error({
            event: 'transaction_failed',
            transaction_id: 'TXN-' + Math.floor(Math.random() * 1000),
            error_code: 'INSUFFICIENT_FUNDS',
            stack: new Error('Transaction failed').stack
        });
    } else {
        logger.info({
            event: 'transaction_success',
            transaction_id: 'TXN-' + Math.floor(Math.random() * 1000),
            amount: (Math.random() * 100).toFixed(2)
        });
    }
}, 3000);
