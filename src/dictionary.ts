import * as jp from 'jsonpath';
import { 
    DefinitionFile,
    Definition,
    Word,
    Phrase,
    Entry
 } from "./definition-file";

 import { DictionaryProvider } from './OED/oed-service';



export class Dictionary{
    static service = new DictionaryProvider('OED');
    
    static GetDefinitions(input:DefinitionFile):DefinitionFile{
        input.definitions.forEach((d, i, defs)=>{
            this.service.getEntry(d.text)
            .then((json)=>{
                console.log(JSON.stringify(json));
                d.pron = this.getPronunciation(json);
                d.origin = this.getOrigin(json);
                d.link = this.getPronunciationLink(json);
                let cats = this.extractCategories(json);
                for (let i = 0; i < cats.length; i++){
                    let e = new Entry();
                    e.index = i+1;
                    e.category = this.getCategoryName(cats[i]);
                    e.meaning = this.extractDefinitions(cats[i]);
                    e.examples = this.extractExamples(cats[i]);
                    d.entries.push(e);
                }

                
            })
            .catch((err)=>{
                console.error(err);
            });
        })
        return input;
    }
    static returnOneJsonValue(json:any, path:string): string{
        let p = jp.query(json, path);
        if (p.length < 1){
            return '';
        }
        return p[0].toString();
    }
    static returnArray(json:any, path:string): any{
        let p = jp.query(json, path);
        return p;
    }
    static returnArrayOfStrings(json:any, path:string): any{
        let oo = jp.query(json, path);
        let s:string[]=[];
        for (let n = 0; n< oo.length; n++ ){
            s.push(oo[n].toString());
        }
        return s;
    }
    static getOrigin(json: any): string {
        return this.returnOneJsonValue(json, '$..etymologies[0]');
    }
    static getPronunciation(json: any):string{
        return this.returnOneJsonValue(json, '$..pronunciations[0].phoneticSpelling');
    }
    static getPronunciationLink(json: any):string{
        return this.returnOneJsonValue(json, '$..pronunciations[0].audioFile');
    }
    static extractDefinitions(json: any):any{
        return this.returnArrayOfStrings(json, '$..definitions[*]');
    }
    static extractExamples(json: any):any{
        return this.returnArrayOfStrings(json, '$..examples[*].text');
    }
    static extractCategories(json: any):any{
        return this.returnArray(json, '$..lexicalEntries[*]');
    }
    static getCategoryName(json:any): string{
        return this.returnOneJsonValue(json, '$..lexicalCategory');
    }

}