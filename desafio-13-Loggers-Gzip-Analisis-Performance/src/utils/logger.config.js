import log4js from 'log4js';
import { config } from './config.js';

log4js.configure({
    appenders: {
        console: {type: 'console'},
        debugFile: { type: 'file', filename: './debug.log'},
        errorFile: { type: 'file', filename: './error.log'},
        warnFile: { type: 'file' , filename: './warn.log' },
        //
        loggerConsole: { type: 'logLevelFilter', appender: 'console', level: 'info'},
        loggerDebug: { type: 'logLevelFilter', appender: 'debugFile', level: 'info'},
        loggerError: { type: 'logLevelFilter', appender: 'errorFile', level: 'error'},
        loggerWarn: { type: 'logLevelFilter', appender: 'warnFile', level: 'warn'},
    },
    categories: {
        default: {
            appenders: ['loggerConsole', 'loggerDebug', 'loggerError', 'loggerWarn'],
            level: 'all'
        },
        production: {
            appenders: ['loggerError'],
            level: 'all'
        }
    }
});

const logger = log4js.getLogger();

export { logger }