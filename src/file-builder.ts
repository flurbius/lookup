import {
    DefinitionFile,
    Definition,
    Word,
    Phrase,
    Entry
} from "./definition-file";
import * as os from 'os';
import jsonFormat from './json-format';
import * as formats from './formats';
import { formatStrings, markdown, text } from "./formats";

export class FileBuilder{
    static create(format: string, defs: DefinitionFile): string {
        let result:string[] = [];
        let f:formatStrings = markdown;
        switch (format) {
            case 'txt':
                f = text;
                break;
            case 'md':
                break;
            case 'html':
                break;
            case 'json':
            default:
                defs.ext = '.json';
                return jsonFormat.diffy(defs);
        }
        result.push(f.title.replace('{TITLE}',defs.class + ': ' + defs.date));
        for (let i = 0, j = 0; ;) {
            const word = defs.definitions[j];
            const sect = defs.sections[i];
                if (sect && word && (word.index > sect.i)) {
                    result.push(f.divider1);
                    result.push(f.section.replace('{SECTION', sect.title));
                    i++;
                    continue; 
                }
                if (!word){
                    result.push(f.divider2);
                    break;
                }
                result.push(f.word
                    .replace('{#}', word.index.toString())
                    .replace('{WORD}', word.text)
                );
                if (word.origin){
                    result.push(f.origin.replace('{ORIGIN}', word.origin));
                    result.push(' ');
                }
                if (word.pron){
                    result.push(f.pronunciation.replace('{PRONUNCIATION}', word.pron));
                    result.push(' ');
                }
                if (word.link){
                    result.push(f.link.replace('{LINK}', word.link));
                    result.push(' ');
                }
                for (let k = 0; k < word.entries.length; k++) {
                    const category = word.entries[k];
                    result.push(f.category
                        .replace('{#.#}', word.index.toString() + '.' + category.index.toString())
                        .replace('{CATEGORY}', category.category)
                    );
                    if (category.meaning.length > 0)
                        this.addTo(result, f, 'Meanings:', category.meaning);

                    if (category.examples.length > 0)
                        this.addTo(result, f, 'Examples:', category.examples);

                    if (category.synonyms.length > 0)
                        this.addTo(result, f, 'Synonyms:', category.synonyms);

                    if (category.antonyms.length > 0) 
                        this.addTo(result, f, 'Antonyms:', category.antonyms);
                }
                result.push(f.divider1);
                j++;
            }
            return result.join(os.EOL);
        }
        private static addTo(result:string[], f:formatStrings, heading:string, items:string[]): string[]{
            result.push(f.heading.replace('{HEADING}', heading));
            for (let l = 0; l < items.length; l++)
                result.push(f.oneItem.replace('{ITEM}', items[l]));
            return result;
        }
    }
