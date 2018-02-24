// These define the data contract for
// looking up a list of words

// List Of Lemmas + metadata
export interface iLol {
    start: number,          //date 
    time: string,
    source: string,
    path: string,
    name: string,
    ext: string,
    class: string,
    date: string,
    list: iLemma[],
    [propName: string]: any
}

// a lemma is a word or a phrase
export interface iLemma {
    ltype: string,
    text: string,
    ipa: string,
    link: string,
    origin: string,
    state: string[],
    entries: iEntry[],
    [propName: string]: any
}

// a language category (noun, verb etc)
export interface iEntry {
    category: string,
    senses: iSense[],
    related: iRelated[],
    [propName: string]: any
}
// The sense of a lemma's use (meaning in a context)
export interface iSense {
    key: string,
    means: string[],
    examples: string[],
    [propName: string]: any
}
// related lemmas eg antonym, synonym, etc
export interface iRelated {
    register: string,
    text: string[],
    [propName: string]: any
}
