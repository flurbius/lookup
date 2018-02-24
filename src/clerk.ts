// Clerk is a utility class with just one public static method (maybe I should just define it as a function?)
import * as jp from 'jsonpath';
import {
    iLol,
    iLemma,
    iEntry
} from './i-lol';

import { OED } from './OED/OED';
import { Log } from './commons/log';
// import { isNullOrUndefined } from 'util';
import { Validator } from './validator';
import { Sense, Entry } from './lol';




/**
 * Clerk currently only knows one Dictionary - the Oxford English Dictionary.  If there is demand,
 * we could implement many sources. Since it has no state and a simple API it could be a global function 
 * or (as it is) a class with a few public static methods (just one so far).  If/when more info sources are 
 * defined it could introduce a bit of state but not enough to worry about.
 */
export class Clerk {

    static readonly FN = 'Clerk:: ';

    /**
     * DefineWords goes through the list of words and queries a Clerk for meanings, Etymology and 
     * related words.  It puts that data in the iLul structure that was passed in and returns it.
     * @param input: A Lol (Look Up List) is a structure that holds a list of words and related data. 
     * @returns a Promise of a completed Lol 
     */
    static async DefineWords(input: iLol): Promise<iLol> {
        for (let i = 0; i < input.list.length; i++) {
            const word = input.list[i];
            await Clerk.getMeanings(word)
            .then(await Clerk.getSynonyms)
            .then((w) => {
                input.list[i] = w;
            })
            .catch((err)=>{ });
        }
        return input;
    }

    private static async getMeanings(word: iLemma): Promise<iLemma> {
        await OED.queryDictionary('DEFINITION', word.text)
            .then((json) => {
                Clerk.causeDelay(500);
                Validator.coerce(json, word.text);
                word.ipa = Clerk.extractPronunciation(json);
                word.origin = Clerk.extractOrigin(json);
                word.link = Clerk.extractPronunciationLink(json);
                const cats = Clerk.extractCategories(json);
                for (let j = 0; j < cats.length; j++) {
                    word.entries[j] = new Entry();
                    word.entries[j].category = Clerk.extractCategoryName(cats[j]);
                    const senses = Clerk.extractSenses(cats[j]);
                    for (let k = 0; k < senses.length; k++){
                        const sense = new Sense();
                        sense.key = Clerk.extractSenseId(senses[k]);
                        sense.means = Clerk.extractSenseDefinitions(senses[k]);
                        sense.examples = Clerk.extractSenseExamples(senses[k]);
                        word.entries[j].senses.push(sense);
                        const subsenses = Clerk.extractSubSenses(senses[k]);
                        for (let l = 0; l < subsenses.length; l++){
                            const subsense = new Sense();
                            subsense.key = Clerk.extractSenseId(subsenses[l]);
                            subsense.means.concat(Clerk.extractSenseDefinitions(subsenses[l]));
                            subsense.examples.concat(Clerk.extractSenseExamples(subsenses[l]));
                            word.entries[j].senses.push(subsense);
                        }
                    }
                }
            })
            .catch((err) => { 
                word.state.push('Encountered a problem retrieving the definitions for ' + word.text);
            });
        
        return word;
    }

    private static async getSynonyms(word: iLemma): Promise<iLemma> {
        await OED.queryDictionary('SYNONYMS', word.text)
            .then((json) => {
                Validator.coerce(json, word.text + '.syn');
                let cats = Clerk.extractCategories(json);
                for (let j = 0; j < cats.length; j++) {
                    let name = Clerk.extractCategoryName(cats[j]);
                    let k = word.entries.findIndex((e, i) => { return e.category===name });
                    if (k < 0) { 
                        k = word.entries.length;
                        word.entries[k] = new Entry();
                        word.entries[k].category = name;
                        word.entries[k].senses[0] = new Sense();
                        word.entries[k].senses[0].examples = Clerk.extractThesaurusExamples(cats[j]);
                    }
                    word.entries[k].related.push ({
                        register: 'synonyms',
                        text: Clerk.extractSynonyms(cats[j])
                    });
                    word.entries[k].related.push ({
                        register: 'antonyms',
                        text: Clerk.extractAntonyms(cats[j])
                    });
                    // get the regions
                    // loop over and add those
                    // get the registers
                    // loop over and add those
                }
            })
            .catch((err) => {
                word.state.push('Encountered a problem retrieving related words for ' + word.text);
            });
        return word;
    }

    private static returnOneString(json: any, path: string): string {
        let p = jp.query(json, path);
        if (p.length===1){
            return p[0].toString();
        }
        if (p.length > 1) {
            let msg ='';
            for (const item of p) {
                msg += ',' + item.toString();
            }
            Log.To.info(Clerk.FN + 'Discarding redundant data: ' + msg.slice(1));
            return p[0].toString();
        }
        Log.To.info(Clerk.FN + 'No data found using ' + path);
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
        return Clerk.returnOneString(json, '$..etymologies[0]');
    }
    private static extractPronunciation(json: any): string {
        return Clerk.returnOneString(json, '$..lexicalEntries[0].pronunciations[0].phoneticSpelling');
    }
    private static extractPronunciationLink(json: any): string {
        return Clerk.returnOneString(json, '$..lexicalEntries[0].pronunciations[0].audioFile');
    }
    
    private static extractCategories(json: any): any[] {
        return jp.query(json, '$..lexicalEntries[*]');
    }
    // the following (extractCategoryName, extractSenses, extractThesaurusExamples) should be called with one of the entries 
    // from the array returned by the previous method (extractCategories)
    private static extractCategoryName(json: any): string {
        return Clerk.returnOneString(json, '$.lexicalCategory');
    }
    private static extractSenses(json: any): any[] {
        return jp.query(json, '$..senses[*]');
    }
    // the following (extractSenseId, extractSenseDefinitions, extractSenseExamples, extractSubSenses) should be called 
    // with one of the entries from the array returned by the previous method (extractSenses) or the next (extractSubSenses)
    private static extractSubSenses(json: any): any[] {
        return jp.query(json, '$.subsenses[*]');
    }
    private static extractSenseId(json: any): string {
        return Clerk.returnOneString(json, '$.id');
    }
    private static extractSenseDefinitions(json: any): string[] {
        return Clerk.returnArrayOfStrings(json, '$.definitions[*]');
    }
    private static extractSenseExamples(json: any): string[] {
        return Clerk.returnArrayOfStrings(json, '$.examples[*].text');
    }
    private static extractThesaurusExamples(json: any): string[] {
        return Clerk.returnArrayOfStrings(json, '$..examples[*].text');
    }
    private static extractSynonyms(json: any): string[] {
        return Clerk.returnArrayOfStrings(json, '$..synonyms[*].text');
    }
    private static extractAntonyms(json: any): string[] {
        return Clerk.returnArrayOfStrings(json, '$..antonyms[*].text');
    }
    // $..lexicalEntries[0]..subsenses[?(@.regions)].regions
    // private static extractRegions(json: any): string[] {
    //     return Clerk.returnArrayOfStrings(json, '$..senses[*].examples[*].text');
    // }
    // // $..lexicalEntries[0]..subsenses[?(@.registers)].registers
    // private static extractRegisters(json: any): string[] {
    //     return Clerk.returnArrayOfStrings(json, '$..senses[*].examples[*].text');
    // }
    // private static extractRRSynonyms(json: any): string[] {
    //     return Clerk.returnArrayOfStrings(json, '$..senses[*].synonyms[*].text');
    // }
    // private static extractRRAntonyms(json: any): string[] {
    //     return Clerk.returnArrayOfStrings(json, '$..senses[*].antonyms[*].text');
    // }

    /**
     * Clerk.causeDelay method was implemented in order to not overrun the free # of calls that the OED limit clients to
     * 60 per minute.  It seems wasteful but it is easy and it works.
     * @param millis number of milliseconds to delay Clerk thread by.
     */
    private static causeDelay(millis: number): void {
        const end = new Date().getTime() + Math.abs(millis);
        while (new Date().getTime() < end){ }
    }
}
