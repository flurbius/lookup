import { Array } from "core-js/library/web/timers";

// Sense represents the way a word is used
// properties for its meaning, category(noun, verb etc)
// and sets of example sentences, antonyms and synonyms
export interface Sense{
    index:number;
    cat:string;
    means: string;
    examples: string[];
    antonyms: string[];
    synonyms: string[];

}

export interface Word{
    index:number;
    word:string;
    pron:string;
    senses: Array<Sense>;
}
export interface Phrase{
    index:number;
    word: string;
    use: string;
    origin: string;
    examples: string[];
}
export interface Meta{
    i:number;
    data:string;
}
export class MetaType implements Meta {
    i:number;
    data: string;
    constructor(i=-1, d = ''){
        this.i = i;
        this.data = d; 
    }

}
export class DefinitionFile{
    constructor(){

    }
    path:string;
    name:string;
    ext: string;
    class:string;
    date:string;
    meta:Array<Meta>;
    definitions:Array<(Word | Phrase)>;
}
