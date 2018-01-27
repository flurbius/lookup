import * as os from 'os';
import * as show from 'showdown'

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
                result.push(f.divider1);
                result.push(f.section.replace('{SECTION', sect.title));
                i++;
                continue;
            }
            if (!word) {
                result.push(' ');
                result.push(f.divider2);
                break;
            }
            result.push(f.word
                .replace('{#}', word.index.toString())
                .replace('{WORD}', word.text)
            );
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
                result.push(f.link.replace('{LINK}', word.link));
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
        result.push(f.origin.replace('Origin: {ORIGIN}', 'This file was made with lookup, using the services of the Oxford English Dictionary, It took ' + defs.time + ' seconds to create.'));
        result.push(f.divider2);
        let payload = result.join(os.EOL);
        if (format === 'html'){
            const convert = new show.Converter();
            
            payload = convert.makeHtml(payload);
        }
        return payload;


    }
    private static addTo(result: string[], f: formatStrings, heading: string, items: string[]): string[] {
        result.push(f.heading.replace('{HEADING}', heading + ' (' + items.length.valueOf() + ')'));
        if (items.length < 12) {
            for (let l = 0; l < items.length; l++)
                result.push(f.oneItem.replace('{ITEM}', items[l]));
        } else if (items.length < 40) {
            for (let l = 7; l < items.length; l = l + 8)
                result.push(f.oneItem
                    .replace('{ITEM}', items.slice(l - 7, l).join(', ')));
        } else if (items.length < 80)
            for (let l = 12; l < items.length; l = l + 13)
                result.push(f.oneItem
                    .replace('{ITEM}', items.slice(l - 12, l).join(', ')));
        return result;
    }
}
