import * as Logger from 'bunyan';

class Log {

    static LookupConfig: Logger.LoggerOptions = {
        name: 'LU',
        streams: [
            {
                level: 'error',
                stream: process.stdout
            },
            {
                type: 'rotating-file',
                level: 'info',
                path: '/home/flurbius/lookup/error.log',
                period: '1d',
                count: 3
            }
        ],
        src: true,
    };

    static To: Logger = Logger.createLogger(Log.LookupConfig);
}

export { Log };