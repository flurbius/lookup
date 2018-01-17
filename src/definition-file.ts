import { Array } from "core-js/library/web/timers";

export class Entry{
    index: number;
    text: string;
    category: string;
    explain: string;
    examples: string[]=[];
    synonyms: string[]=[];
    antonyms: string[]=[];
}
export abstract class Definition{
    abstract type: string;
    index: number;
    lang: string;
    text: string;
    pron: string;
    use: string;
    origin: string;
    entries: Entry[]=[];
}

export class Word extends Definition{
    readonly type='WORD';
}
export class Phrase extends Definition{
    readonly type='PHRASE';
}
export class Section{
    i:number;
    title:string;
}

export class DefinitionFile{
    path:string;
    name:string;
    ext: string;
    class:string;
    date:string;
    sections:Section[] = [];
    definitions:(Definition)[] = [];
}
