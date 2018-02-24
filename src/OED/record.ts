import * as fs from 'fs';
import * as os from 'os';
import { join } from 'path';
import { isNullOrUndefined } from 'util';
export class Record {
    /**
     * A simple record that records a string its author and the time it was recorded
     */
    constructor(it: string, auth:string) {
        this.created = new Date().getTime();
        this.item = it;
        this.author = auth;
    }
    readonly created: number;
    readonly item: string;
    readonly author: string;
}

export class Ledger{
    private records: Record[] = [];
    private store: string;
    title: string;

    /**
     *
     */
    constructor(name: string) {
        if ('' === name)
            name = 'OED';
        this.title = name;
        this.store = join(os.homedir(),'lookup/', name + '-req.json');
        this.loadRecords();
    }
    record(it: string, auth:string): number{
        this.records.push(new Record(it, auth));
        return this.records.length;
    }
    private loadRecords(): boolean{
        

        return true;
    }

}