import * as os from 'os';
import * as md from 'markdown-it'


import jsonFormat from './json-format';
import * as formats from './formats';
import { formatStrings, markdown, text, html } from "./formats";
import { iLol } from './i-lol';

export class FileBuilder {
    static create(format: string, defs: iLol): string {
        let result: string[] = [];
        let f: formatStrings = markdown;
        switch (format) {
            case 'txt':
                f = text;
                break;
            case 'md':
                break;
            case 'html':
                f = html;
                break;
            case 'json':
            default:
                defs.ext = '.json';
                return jsonFormat.diffy(defs);
        }

        result.push(f.title.replace('{TITLE}', defs.class + ': ' + defs.date));
        
        let wordNumber = 0;
        for (let i = 0; i < defs.list.length; i++) {
            const word = defs.list[i];
            if (!word) {
                result.push(' ');
                result.push(f.divider2);
                result.push(' ');
                continue;
            }
            wordNumber++;
            result.push(f.word
                .replace('{#}', wordNumber.toString())
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
            if (word.ipa) {
                result.push(' ');
                result.push(f.pronunciation.replace('{PRONUNCIATION}', word.ipa));
            }
            if (word.link) {
                result.push(' ');
                result.push(f.link.replace(/{LINK}/g, word.link));
            }
            let lexcat = 0;
            for (let k = 0; k < word.entries.length; k++) {
                const category = word.entries[k];
                result.push(' ');
                lexcat++;
                result.push(f.category
                    .replace('{#.#}', wordNumber.toString() + '.' + lexcat.toString())
                    .replace('{WORD}', word.text)
                    .replace('{CATEGORY}', category.category)
                );
                if (category.senses.length > 0)
                    FileBuilder.addTo(result, f, 'Meanings:', category.senses[0].means);

                if (category.senses[0].examples.length > 0)
                    FileBuilder.addTo(result, f, 'Examples:', category.senses[0].examples);

                if (category.related[0].text.length > 0)
                    FileBuilder.addTo(result, f, category.related[0].register, category.related[0].text);

                if (category.related[1].text.length > 0)
                    FileBuilder.addTo(result, f, category.related[1].register, category.related[1].text);
                result.push(f.catend);
            }
            result.push(f.divider1);
        }
        defs.time = ((Date.now().valueOf() - defs.start) / 1000).toFixed(2);
        result.push(' ');
        let credit = f.italic.replace('{TEXT}', 'This file was made with lookup, using the services of the Oxford English Dictionary, It took ' + defs.time + ' seconds to create.'); 
        result.push(credit);
        result.push(f.divider2);
        let payload = result.join(os.EOL);
        if (format === 'html'){
           payload = '<html><head></head><body>'+ payload + '</body></html>';
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
                    result.push(f.oneItem.replace('{ITEM}', items.slice(l - 9, l+1).join(', ')));

                if ((l-9)< items.length)
                    result.push(f.oneItem.replace('{ITEM}', items.slice(l-9, items.length).join(', ')));
            } else {
                for (l = 14; l < items.length; l = l + 15)
                    result.push(f.oneItem.replace('{ITEM}', items.slice(l - 14, l+1).join(', ')));

                if ((l-14)< items.length)
                    result.push(f.oneItem.replace('{ITEM}', items.slice(l-14, items.length).join(', ')));
            }
        }
        result.push(f.footing);
        return result;
    }
}
