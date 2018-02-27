import { EOL } from 'os';

import jsonFormat from './json-format';
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

        let title = defs.class;
        if (defs.date)
        title += ': ' + defs.date;

        result.push(f.title.replace('{TITLE}', title));
        
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
            // if (word.state.length >0) {
            //     result.push(' ');
            //     for (let k = 0; k < word.state.length; k++)
            //         result.push(f.listitem.replace('{ITEM}', word.state[k]));
            // }
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
                    .replace('{WORD}', word.text + '  (')
                    .replace('{CATEGORY}', category.category.toLowerCase()+ ')')
                );
                if (category.senses.length > 0){

                    result.push(f.heading.replace('{HEADING}', 'Meanings (' + category.senses.length + ')'));
                    for (let l = 0; l < category.senses.length; l++) {
                        const sense = category.senses[l];
                        if (sense.means.length > 0)
                            FileBuilder.addSense(result, f, l+1, sense.means.join(', '), sense.examples);
                    }
                }
                if (category.related[0] && category.related[0].text.length > 0)
                    FileBuilder.addList(result, f, category.related[0].rel, category.related[0].text);

                if (category.related[1] && category.related[1].text.length > 0)
                    FileBuilder.addList(result, f, category.related[1].rel, category.related[1].text);
                result.push(f.catend);
            }
            result.push(f.divider1);
        }
        defs.time = ((Date.now().valueOf() - defs.start) / 1000).toFixed(2);
        result.push(' ');
        let today = new Date();
        let dt = today.toLocaleDateString() + ' at ' + today.toLocaleTimeString();
        let credit = f.italic.replace('{TEXT}', 'This file was made on ' + dt + ', using the services of the Oxford English Dictionary, It took ' + defs.time + ' seconds to create.'); 
        result.push(credit);
        result.push(f.divider2);
        let payload = f.document.replace('{DOCUMENT}', result.join(EOL));
        return payload;
    }

    private static addSense(result: string[], f: formatStrings, num: number, meaning: string, examples: string[]): string[] {
        const means = f.italic.replace('{TEXT}',  meaning);
        result.push(f.listitem.replace('{ITEM}',  num.toString() + ': ' + means));
        for (let m = 0; m < examples.length; m++)
                result.push(f.sublistitem.replace('{ITEM}', 'eg. ' + examples[m]));
        return result;
    }
    private static addList(result: string[], f: formatStrings, heading: string, items: string[]): string[] {
        result.push(f.heading.replace('{HEADING}', heading + ' (' + items.length.valueOf() + ')'));
        let l = 0;
        if (items.length < 21) {
            for (l = 0; l < items.length; l++)
                result.push(f.listitem.replace('{ITEM}', items[l]));
        } else {
            if (items.length < 101) {
                for (l = 9; l < items.length; l = l + 10)
                    result.push(f.listitem.replace('{ITEM}', items.slice(l - 9, l+1).join(', ')));

                if ((l-9)< items.length)
                    result.push(f.listitem.replace('{ITEM}', items.slice(l-9, items.length).join(', ')));
            } else {
                for (l = 19; l < items.length; l = l + 20)
                    result.push(f.listitem.replace('{ITEM}', items.slice(l - 19, l+1).join(', ')));

                if ((l-19)< items.length)
                    result.push(f.listitem.replace('{ITEM}', items.slice(l-19, items.length).join(', ')));
            }
        }
        result.push(f.footing);
        return result;
    }
}
