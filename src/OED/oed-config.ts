import * as  secret from './.secret';
    
    // OED API Methods/Operations
    //Lists available dictionaries
    export const op01Languages = '/languages';
    // Lists available filters
    export const op02Filters = '/filters';
    // Lists available filters for specific endpoint
    export const op03FiltersForEndpoint = '/filters/{endpoint}';
    // Lists available lexical categories in a dataset
    export const op04LexicalCategories = '/lexicalcategories/en';
    // Lists available registers in a monolingual dataset
    export const op05Registers = '/registers/en';
    // Lists available domains in a monolingual dataset
    export const op06Domains = '/domains/en';
    // Lists available regions in a monolingual dataset
    export const op07Regions = '/regions/en';
    // Lists available grammatical features in a dataset
    export const op08Grammar = '/grammaticalFeatures/en';
    // Lists available registers in a bilingual dataset
    export const op09RegistersSourceTarget = '/registers/en/{target_lang}';
    // Lists available domains in a bilingual dataset
    export const op10DomainsSourceTarget = '/domains/en/{target_lang}';
    // Retrieve the frequency of a word derived from a corpus.
    export const op11StatsFrequency = '/stats/frequency/word/en/';
    // Retrieve a list of frequencies of a word/words derived from a corpus.
    export const op12StatsFrequencies = '/stats/frequency/words/en/';
    //Retrieve the frequency of ngrams (1-4) derived from a corpus
    export const op13StatsFrequencyNgrams = '/stats/frequency/ngrams/en/{corpus}/{ngram-size}/';
    // Retrieve corpus sentences for a given word
    export const op14SentencesEntry = '/entries/en/{word}/sentences';
    // Check a word exists in the dictionary and retrieve its root form
    export const op17Inflections = '/inflections/en/{word}';
    // Apply optional filters to Lemmatron response			
    export const op18InflectionsFiltered = '/inflections/en/{word}/{filter}';
    // Retrieve dictionary information for a given word
    export const op19DictEntry = '/entries/en/{word}';
    // Specify GB or US dictionary for English entry search
    export const op20DictEntryRegion = '/entries/en/{word}/regions={region}';
    // Apply filters to response
    export const op21DictEntryFiltered = '/entries/en/{word}/{filter}';
    // Retrieve words that are similar
    export const op22ThesaurusSynonyms = '/entries/en/{word}/synonyms';
    // Retrieve words that mean the opposite
    export const op23ThesaurusAntonyms = '/entries/en/{word}/antonyms';
    // Retrieve synonyms and antonyms for a given word
    export const op24ThesaurusSynonymsAntonyms = '/entries/en/{word}/synonyms;antonyms';
    // Retrieve possible matches to input
    export const op25Search = '/search/en';
    // Retrieve possible translation matches to input
    export const op26SearchTranslation = '/search/en/translations={target_lang}';
    // Retrieve translation for a given word
    export const op27TranslationEntry = '/entries/en/{word}/translations={c}';
    // Retrieve a list of words in a category
    export const op28ListCategory = '/wordlist/en/{filter}';
    // Retrieve list of words for category with advanced options
    export const op29ListCategoryFiltered = '/wordlist/en/{filter_advanced}';


    // defaults
    export const oedUrl = 'https://od-api.oxforddictionaries.com/api/v1';
    export const timeout = 1000;
    export const maxContentLength = 10000;

    export const headers = {
            'app_id': secret.appid,
            'app_key': secret.appkey
        };
