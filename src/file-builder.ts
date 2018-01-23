import {
    DefinitionFile,
    Definition,
    Word,
    Phrase,
    Entry
} from "./definition-file";
import * as os from 'os';
import './json-format';
import jsonFormat from './json-format';

export class FileBuilder{
    static create(format: string, definitions: DefinitionFile): string {
        let result:string[] = [];
        switch (format) {
            case 'txt':
            case 'md':
            case 'html':
                break;
            case 'json':
            default:
                definitions.ext = '.json';
                return jsonFormat.diffy(definitions);
        }
        

        return result.join(os.EOL);
    }

}