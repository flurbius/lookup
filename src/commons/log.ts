import * as Logger from 'bunyan';
import { isNullOrUndefined } from 'util';
import *  as Path from 'path';
import { strictEqual } from 'assert';
import { homedir } from 'os';
import { ensurePathIsWriteable } from './file';

var PrettyStream = require('bunyan-prettystream');

class Log {

    public static get to(): Logger {
        if (isNullOrUndefined(this._to)) {
            this.initializeLog();
        }
        return this._to;
    }
    public static verbose(): boolean {
        return Log._verbose;
    }

    public static dir(): string {
        return Log._dir;
    }
    public static filename(): string {
        return Log._log;
    }
    public static setLogFile(dir: string, name: string = 'error'){
        Log._dir = ensurePathIsWriteable(dir, homedir());
        Log._log = name;
        this.initializeLog();
    }
    public static setVerbose(meiyo: boolean): void {
        Log._verbose = (!meiyo);
        if (Log._verbose){
            Log.to.level(Log.to.levels()[0]);
            Log.to.level(Log.to.levels()[1]);
        } else {
            Log.to.level(Log.to.levels()[0]-1);
            Log.to.level(Log.to.levels()[1]-1);
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
    private static _dir = Path.join(homedir(), 'logs');
    private static _log = 'error';
    private static _to: Logger;
    private static _verbose: boolean = true;
    private static initializeLog() {
        // if (!isNullOrUndefined(this._To)){
        //     this._To.removeAllListeners();
        //     this._To = null;
        // }
        const pretty = new PrettyStream();
        pretty.pipe(process.stdout);
        const config: Logger.LoggerOptions = {
            name: 'LookUp',
            streams: [
                {
                    level: 'error',
                    stream: pretty
                },
                {
                    type: 'rotating-file',
                    level: 'info',
                    path: Path.join(Log.dir(), Log._log + '.log'),
                    period: '1d',
                    count: 3
                }
            ],
            src: true,
        };
        this._to = Logger.createLogger(config);
    }



}

export { Log };
