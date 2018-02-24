
import * as fs from 'fs';
import * as path from 'path';
import jsonFormat from './json-format';

export class Validator {
    public static coerce(data: any,  name: string): string {
        const out = jsonFormat.diffy(data);
        fs.writeFileSync(path.join('/home/flurbius/lookup/output/raw/', name +'.json'), out);
        return out;
    }
    
}

