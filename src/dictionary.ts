import * as jp from 'jsonpath';
import {
    DefinitionFile,
    Definition,
    Word,
    Phrase,
    Entry
} from "./definition-file";

import { OED } from './OED/OED';

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
                d.pron = Dictionary.extractPronunciation(json);
                d.origin = Dictionary.extractOrigin(json);
                d.link = Dictionary.extractPronunciationLink(json);
                let cats = Dictionary.extractCategories(json);
                for (let j = 0; j < cats.length; j++) {
                    if (typeof (d.entries[j]) === 'undefined') {
                        d.entries[j] = new Entry();
                    }
                    d.entries[j].index = j + 1;
                    d.entries[j].category = Dictionary.extractCategoryName(cats[j]);
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
                    let n = Dictionary.extractCategoryName(cats[j]);
                    let k = d.entries.findIndex((e, i) => { return e.category===n });
                    if (k < 0) { // this should only happen if there are antonyms/synonyms for a category that doesnt have a meaning
                        k = d.entries.length;
                        d.entries[k] = new Entry();
                        d.entries[k].index = k + 1;
                        d.entries[k].category = n;
                        d.entries[k].examples = Dictionary.extractExamples(cats[j]);
                        console.error('Error unexpected missing entry for %s : %s', d.text, n);
                    }
                    d.entries[k].synonyms = Dictionary.extractSynonyms(cats[j]);
                    d.entries[k].antonyms = Dictionary.extractAntonyms(cats[j]);
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
    
    private static returnOneString(json: any, path: string): string {
        let p = jp.query(json, path);
        if (p.length===1){
            return p[0].toString();
        }
        if (p.length > 1) {
            console.log('unexpected extra data using %s', path);
            return p[0].toString();
        }
        console.log('No data found using %s', path);
        return '';
    }

    private static returnArrayOfStrings(json: any, path: string): string[] {
        let oo = jp.query(json, path);
        let s: string[] = [];
        for (let n = 0; n < oo.length; n++) {
            s.push(oo[n].toString());
        }
        return s;
    }
    
    private static extractOrigin(json: any): string {
        return this.returnOneString(json, '$..etymologies[0]');
    }
    private static extractPronunciation(json: any): string {
        return this.returnOneString(json, '$..pronunciations[0].phoneticSpelling');
    }
    private static extractPronunciationLink(json: any): string {
        return this.returnOneString(json, '$..pronunciations[0].audioFile');
    }
    
    private static extractCategories(json: any): any[] {
        return jp.query(json, '$..lexicalEntries[*]');
    }
    // the following should be called with one of the entries from the array returned by the previous method
    private static extractCategoryName(json: any): string {
        return this.returnOneString(json, '$..lexicalCategory');
    }
    private static extractDefinitions(json: any): string[] {
        return this.returnArrayOfStrings(json, '$..definitions[*]');
    }
    private static extractExamples(json: any): string[] {
        return this.returnArrayOfStrings(json, '$..examples[*].text');
    }
    private static extractSynonyms(json: any): string[] {
        return this.returnArrayOfStrings(json, '$..synonyms[*].text');
    }
    private static extractAntonyms(json: any): string[] {
        return this.returnArrayOfStrings(json, '$..antonyms[*].text');
    }

}
