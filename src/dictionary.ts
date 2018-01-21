import * as jp from 'jsonpath';
import {
    DefinitionFile,
    Definition,
    Word,
    Phrase,
    Entry
} from "./definition-file";

import { OED } from './OED/oed-service';

export class Dictionary {
    static async DefineWords(input: DefinitionFile): Promise<DefinitionFile> {
        for (let i = 0; i < input.definitions.length; i++) {
            await this.getMeanings(input.definitions[i])
            .then(await this.getSynonyms)
            .then((d) => {
                input.definitions[i] = d;
            })
            .catch((err)=>{
                input.definitions[i].origin = 'Error retrieving definition'; 
            });
        }
        return input;
    }
    private static async getMeanings(d: Definition): Promise<Definition> {
        await OED.queryDictionary('DEFINITION', d.text)
            .then((json) => {
                d.pron = Dictionary.getPronunciation(json);
                d.origin = Dictionary.getOrigin(json);
                d.link = Dictionary.getPronunciationLink(json);
                let cats = Dictionary.extractCategories(json);
                for (let j = 0; j < cats.length; j++) {
                    if (typeof (d.entries[j]) === 'undefined') {
                        d.entries[j] = new Entry();
                    }
                    d.entries[j].index = j + 1;
                    d.entries[j].category = Dictionary.getCategoryName(cats[j]);
                    d.entries[j].meaning = Dictionary.extractDefinitions(cats[j]);
                    d.entries[j].examples = Dictionary.extractExamples(cats[j]);
                }
            })
            .catch((err) => {
                console.error('Error retrieving definitions %s\n%s', d.text, err);
            });
        return d;
    }

    private static async getSynonyms(d: Definition): Promise<Definition> {
        if (d.type == 'PHRASE') {
            return d;
        }
        await OED.queryDictionary('SYNONYMS', d.text)
            .then((json) => {
                let cats = Dictionary.extractCategories(json);
                for (let j = 0; j < cats.length; j++) {
                    if (typeof (d.entries[j]) === 'undefined') {
                        d.entries[j] = new Entry();
                        d.entries[j].index = j + 1;
                        d.entries[j].category = Dictionary.getCategoryName(cats[j]);
                        d.entries[j].examples = Dictionary.extractExamples(cats[j]);
                        console.error('Error unexpected missing entry for %s : %s', d.text, d.entries[j].category);
                    }
                    d.entries[j].synonyms = Dictionary.extractSynonyms(cats[j]);
                    d.entries[j].antonyms = Dictionary.extractAntonyms(cats[j]);
                }
            })
            .catch((err) => {
                console.error('Error retrieving synonyms %s\n%s', d.text, err);
            });
        return d;
    }

    private static causeDelay(ms: number): void {
        let w = new Date().getTime() + 1000;
        let n = 0;
        while (w > n) { n = new Date().getTime() }
    }
    private static returnOneJsonValue(json: any, path: string): string {
        let p = jp.query(json, path);
        if (p.length < 1) {
            return '';
        }
        return p[0].toString();
    }
    private static returnArray(json: any, path: string): any {
        let p = jp.query(json, path);
        return p;
    }
    private static returnArrayOfStrings(json: any, path: string): any {
        let oo = jp.query(json, path);
        let s: string[] = [];
        for (let n = 0; n < oo.length; n++) {
            s.push(oo[n].toString());
        }
        return s;
    }
    private static getOrigin(json: any): string {
        return this.returnOneJsonValue(json, '$..etymologies[0]');
    }
    private static getPronunciation(json: any): string {
        return this.returnOneJsonValue(json, '$..pronunciations[0].phoneticSpelling');
    }
    private static getPronunciationLink(json: any): string {
        return this.returnOneJsonValue(json, '$..pronunciations[0].audioFile');
    }
    private static extractDefinitions(json: any): any {
        return this.returnArrayOfStrings(json, '$..definitions[*]');
    }
    private static extractExamples(json: any): any {
        return this.returnArrayOfStrings(json, '$..examples[*].text');
    }
    private static extractCategories(json: any): any {
        return this.returnArray(json, '$..lexicalEntries[*]');
    }
    private static getCategoryName(json: any): string {
        return this.returnOneJsonValue(json, '$..lexicalCategory');
    }
    private static extractSynonyms(json: any): any {
        return this.returnArrayOfStrings(json, '$..synonyms[*]');
    }
    private static extractAntonyms(json: any): any {
        return this.returnArrayOfStrings(json, '$..antonyms[*]');
    }

}
