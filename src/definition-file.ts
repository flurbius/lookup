//import { Array } from "core-js/library/web/timers";

export class Entry {
    index: number;
    category: string;
    examples: string[] =[];
    meaning: string[] = [];
    synonyms: string[] = [];
    antonyms: string[] = [];
}

export abstract class Definition {
    abstract type: string;
    index: number;
    text: string;
    pron: string;
    link: string;
    origin: string;
    state: string = 'undefined';
    entries: Entry[] = [];
}

export class Word extends Definition {
    readonly type = 'WORD';
}
export class Phrase extends Definition {
    readonly type = 'PHRASE';
}
export class Section {
    i: number;
    title: string;
}

export class DefinitionFile {
    start: number;
    time: string;
    inputfile: string;
    path: string;
    name: string;
    ext: string;
    class: string;
    date: string;
    sections: Section[] = [];
    definitions: (Definition)[] = [];
}
