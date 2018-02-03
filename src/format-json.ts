
import * as fs from 'fs';
import * as path from 'path';
import jsonFormat from './json-format';

export class FormatJson {
    public static convert(data: any,  name: string): string {
        const out = jsonFormat.diffy(data);
        return out;
    }
    
}

