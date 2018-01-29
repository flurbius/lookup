import * as Logger from 'bunyan';
import { isNullOrUndefined } from 'util';
var PrettyStream = require('bunyan-prettystream');

class Log {
    private static createLogger() {
    }

    private static _To: Logger;
    
    public static get To(): Logger {
        if (isNullOrUndefined(this._To)) {
            const pretty = new PrettyStream();
            pretty.pipe(process.stdout);
            const LookupConfig: Logger.LoggerOptions = {
                name: 'LookUp',
                streams: [
                    {
                        level: 'error',
                        stream: pretty
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
            this._To = Logger.createLogger(LookupConfig);
        }
        return this._To;
    }
}

export { Log };