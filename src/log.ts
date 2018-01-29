import * as Logger from 'bunyan';
import { isNull } from 'util';
var PrettyStream = require('bunyan-prettystream');

class Log {
    private static createLogger() {
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

    private static _To: Logger;
    public static get To(): Logger {
        if (isNull(this._To))
            this.createLogger();
        return this._To;
    }

}

export { Log };