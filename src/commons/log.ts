import * as Logger from 'bunyan';
import { isNullOrUndefined } from 'util';
import *  as Path from 'path';
import { strictEqual } from 'assert';
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
                        path: Path.join(__dirname, 'error.log'),
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
    private static _verbose: boolean = true;
    public static Verbose(): boolean {
        return Log._verbose;

    }
    public static SetVerbose(meiyo: boolean): void {
        Log._verbose = (!meiyo);
        if (Log._verbose){
            Log.To.level(Log.To.levels()[0]);
            Log.To.level(Log.To.levels()[1]);
        } else {
            Log.To.level(Log.To.levels()[0]-1);
            Log.To.level(Log.To.levels()[1]-1);
        }
    }
    public static console(strgs: string[]): void{
        if (Log._verbose){
            for (let i = 0; i< strgs.length;i++) {
                console.log(strgs[i]);
            }
        }
    }
    public static fatal(strgs: string[], code:number = -1): void{
        if (strgs.length<1)
            strgs = ['Unspecified Fatal Error!?! '];
        for (let i = 0; i< strgs.length;i++) {
            console.error(strgs[i]);
        }
        process.exit(code);
    }
}

export { Log };
