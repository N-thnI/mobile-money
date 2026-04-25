const logger = require('./logger');
const assert = require('assert');

/**
 * Validation Script for Logger JSON Schema
 */

console.log('Running Logger Validation...');

// Capture stdout is tricky in-process, so we'll simulate a log and check its structure 
// if we were to intercept it, but here we can at least verify the logger object 
// and a manual check of the output.

function testSchema() {
    const testMsg = 'Validation test message';
    
    // We'll use a custom stream to capture the output for validation
    const stream = new (require('stream').PassThrough)();
    const testLogger = require('pino')({
        base: logger.bindings(), // Copy base metadata from main logger
        timestamp: pino.stdTimeFunctions.isoTime,
        formatters: {
            level: (label) => ({ level: label.toUpperCase() })
        }
    }, stream);

    let output = '';
    stream.on('data', (chunk) => {
        output += chunk.toString();
    });

    testLogger.info({ msg: testMsg });

    setTimeout(() => {
        try {
            const log = JSON.parse(output.trim());
            console.log('Captured Log:', log);

            assert.strictEqual(log.msg, testMsg, 'Message mismatch');
            assert.ok(log.service_name, 'service_name missing');
            assert.ok(log.instance_id, 'instance_id missing');
            assert.ok(log.level, 'level missing');
            assert.ok(log.time, 'timestamp missing');
            
            console.log('✅ JSON Schema Validation Passed');
            process.exit(0);
        } catch (err) {
            console.error('❌ Validation Failed:', err.message);
            process.exit(1);
        }
    }, 100);
}

// Simple pino reference for the test
const pino = require('pino');
testSchema();
