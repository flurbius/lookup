//import { Array } from "core-js/library/web/timers";
import {
    iEntry,
    iLemma,
    iLol,
    iSense,
    iRelated
} from './i-lol';

export class Sense implements iSense {
    key: string='';
    means:string[]=[];
    examples:string[]=[];
}
export class Related implements iRelated {
    register:string='';
    text:string[]=[];
}
export class Entry implements iEntry {
    category:string='';
    senses:iSense[]=[];
    related:iRelated[]=[];
}

export class Word implements iLemma {

    readonly ltype: string='WORD';
    text:  string='';
    ipa:  string='';
    link:  string='';
    origin:string='';
    state: string[]=[];
    entries:iEntry[]=new Array<Entry>();
}

export class Phrase extends Word {
    
    readonly ltype='PHRASE';
}

export class Lol implements iLol {
    start: number=0;
    time:  string='';
    source:string='';
    path:  string='';
    name:  string='';
    ext:   string='';
    class: string='';
    date:  string='';
    list:  iLemma[]=new Array<Word>();
}
