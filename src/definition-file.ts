import { Array } from "core-js/library/web/timers";

// Sense represents the way a word is used
// properties for its meaning, category(noun, verb etc)
// and sets of example sentences, antonyms and synonyms
export class Sense{
    index:number;
    cat:string;
    means: string;
    examples: string[]=[];
    antonyms: string[]=[];
    synonyms: string[]=[];
}

export class Word{
    index:number;
    word:string;
    pron:string;
    senses: Sense[]=[];
}
export class Phrase{
    index:number;
    word: string;
    use: string;
    origin: string;
    examples: string[] = [];
}
export interface Meta{
    i:number;
    data:string;
}

export class DefinitionFile{
    path:string;
    name:string;
    ext: string;
    class:string;
    date:string;
    meta:Meta[] = [];
    definitions:(Word | Phrase)[] = [];
}
