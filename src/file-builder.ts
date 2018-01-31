import * as os from 'os';
import * as md from 'markdown-it'

import {
    DefinitionFile,
    Definition,
    Word,
    Phrase,
    Entry
} from "./definition-file";
import jsonFormat from './json-format';
import * as formats from './formats';
import { formatStrings, markdown, text } from "./formats";

export class FileBuilder {
    static create(format: string, defs: DefinitionFile): string {
        let result: string[] = [];
        let f: formatStrings = markdown;
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
        result.push(f.title.replace('{TITLE}', defs.class + ': ' + defs.date));
        for (let i = 0, j = 0; ;) {
            const word = defs.definitions[j];
            const sect = defs.sections[i];
            if (sect && word && (word.index > sect.i)) {
                result.push('  ');
                result.push(f.divider2);
                result.push('  ');
                result.push(f.section.replace('{SECTION}', sect.title));
                i++;
                continue;
            }
            if (!word) {
                result.push(' ');
                result.push(f.divider2);
                result.push(' ');
                break;
            }
            result.push(f.word
                .replace('{#}', word.index.toString())
                .replace('{WORD}', word.text)
            );
            if (word.state.length >0) {
                result.push(' ');
                for (let k = 0; k < word.state.length; k++)
                    result.push(f.oneItem.replace('{ITEM}', word.state[k]));
            }
            if (word.origin) {
                result.push(' ');
                result.push(f.origin.replace('{ORIGIN}', word.origin));
            }
            if (word.pron) {
                result.push(' ');
                result.push(f.pronunciation.replace('{PRONUNCIATION}', word.pron));
            }
            if (word.link) {
                result.push(' ');
                const g = f.link.replace('{LINK}', word.link);
                result.push(g.replace('{LINK}', word.link));
            }
            for (let k = 0; k < word.entries.length; k++) {
                const category = word.entries[k];
                result.push(' ');
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
        defs.time = ((Date.now().valueOf() - defs.start) / 1000).toFixed(2);
        result.push(' ');
        let credit = f.italic.replace('{TEXT}', 'This file was made with lookup, using the services of the Oxford English Dictionary, It took ' + defs.time + ' seconds to create.'); 
        result.push(credit);
        result.push(f.divider2);
        let payload = result.join(os.EOL);
        if (format === 'html'){
            const convert = new md();
            
            payload = convert.render(payload);
        }
        return payload;


    }
    private static addTo(result: string[], f: formatStrings, heading: string, items: string[]): string[] {
        result.push(f.heading.replace('{HEADING}', heading + ' (' + items.length.valueOf() + ')'));
        let l = 0;
        if (items.length < 15) {
            for (l = 0; l < items.length; l++)
                result.push(f.oneItem.replace('{ITEM}', items[l]));
        } else {
            if (items.length < 101) {
                for (l = 9; l < items.length; l = l + 10)
                    result.push(f.oneItem
                        .replace('{ITEM}', items.slice(l - 9, l+1).join(', ')));
                if ((l-9)< items.length)
                    result.push(f.oneItem.replace('{ITEM}', items.slice(l-9, items.length).join(', ')));
            } else {
                for (l = 14; l < items.length; l = l + 15)
                    result.push(f.oneItem
                        .replace('{ITEM}', items.slice(l - 14, l+1).join(', ')));
                if ((l-14)< items.length)
                    result.push(f.oneItem.replace('{ITEM}', items.slice(l-14, items.length).join(', ')));
            }
        }
        return result;
    }
}
