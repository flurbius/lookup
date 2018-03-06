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
        if (Log._logPath === '')
            Log._logPath =  Path.join(homedir(), 'logs');
        return Log._logPath;
    }
    public static filename(): string {
        if (Log._logFileName === '')
            Log._logFileName = 'error';
        return Log._logFileName;
    }
    public static setLogFile(dir: string, name: string = 'error'){
        Log._logPath = ensurePathIsWriteable(dir, Path.join(homedir(), 'logs'));
        Log._logFileName = name;
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
    private static _logPath = '';
    private static _logFileName = '';
    private static _to: Logger;
    private static _verbose: boolean = true;
    private static initializeLog() {
        const pretty = new PrettyStream();
        pretty.pipe(process.stdout);
        const filename = Path.join(Log.dir(), Log.filename() +'.log');
        const config: Logger.LoggerOptions = {
            name: 'LookUp',
            streams: [
                {
                    type: 'rotating-file',
                    level: 'info',
                    path: filename,
                    period: '1d',
                    count: 3,
                    closeOnExit: true,
                    name: 'error.log',
                    reemitErrorEvents: true
                }
            ],
            src: true,
        };
        this._to = Logger.createLogger(config);
    }



}

export { Log };
