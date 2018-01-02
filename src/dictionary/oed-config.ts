import * as secret from './.secret';



export namespace oed {
    // OED API Methods/Operations
    //Lists available dictionaries
export const op01Languages = '/languages';
    // Lists available filters
export const op02Filters = '/filters';
    // Lists available filters for specific endpoint
export const op03FiltersForEndpoint = '/filters/{endpoint}';
    // Lists available lexical categories in a dataset
export const op04LexicalCategories = '/lexicalcategories/{lang}';
    // Lists available registers in a monolingual dataset
export const op05Registers = '/registers/{lang}';
    // Lists available domains in a monolingual dataset
export const op06Domains = '/domains/{lang}';
    // Lists available regions in a monolingual dataset
export const op07Regions = '/regions/{lang}';
    // Lists available grammatical features in a dataset
export const op08Grammar = '/grammaticalFeatures/{lang}';
    // Lists available registers in a bilingual dataset
export const op09RegistersSourceTarget = '/registers/{lang}/{target_lang}';
    // Lists available domains in a bilingual dataset
export const op10DomainsSourceTarget = '/domains/{lang}/{target_lang}';
    // Retrieve the frequency of a word derived from a corpus.
export const op11StatsFrequency = '/stats/frequency/word/{lang}/';
    // Retrieve a list of frequencies of a word/words derived from a corpus.
export const op12StatsFrequencies = '/stats/frequency/words/{lang}/';
    //Retrieve the frequency of ngrams (1-4) derived from a corpus
export const op13StatsFrequencyNgrams = '/stats/frequency/ngrams/{lang}/{corpus}/{ngram-size}/';
    // Retrieve corpus sentences for a given word
export const op14SentencesEntry = '/entries/{lang}/{word}/sentences';
    // Check a word exists in the dictionary and retrieve its root form
export const op17Inflections = '/inflections/{lang}/{word}';
    // Apply optional filters to Lemmatron response			
export const op18InflectionsFiltered = '/inflections/{lang}/{word}/{filter}';
    // Retrieve dictionary information for a given word
export const op19DictEntry = '/entries/{lang}/{word}';
    // Specify GB or US dictionary for English entry search
export const op20DictEntryRegion = '/entries/{lang}/{word}/regions={region}';
    // Apply filters to response
export const op21DictEntryFiltered = '/entries/{lang}/{word}/{filter}';
    // Retrieve words that are similar
export const op22ThesaurusSynonyms = '/entries/{lang}/{word}/synonyms';
    // Retrieve words that mean the opposite
export const op23ThesaurusAntonyms = '/entries/{lang}/{word}/antonyms';
    // Retrieve synonyms and antonyms for a given word
export const op24ThesaurusSynonymsAntonyms = '/entries/{lang}/{word}/synonyms;antonyms';
    // Retrieve possible matches to input
export const op25Search = '/search/{lang}';
    // Retrieve possible translation matches to input
export const op26SearchTranslation = '/search/{lang}/translations={target_lang}';
    // Retrieve translation for a given word
export const op27TranslationEntry = '/entries/{lang}/{word}/translations={c}';
    // Retrieve a list of words in a category
export const op28ListCategory = '/wordlist/{lang}/{filter}';
    // Retrieve list of words for category with advanced options
export const op29ListCategoryFiltered = '/wordlist/{lang}/{filter_advanced}';


    // defaults
export const baseURL = 'https://od-api.oxforddictionaries.com/api/v1';
export const timeout = 1000;
export const maxContentLength = 10000;
export const headers = {
        'app_id': secret.appid,
        'app_key': secret.appkey
    };

}

