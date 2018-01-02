const cred = '7c1697e1';
const baseUrl = 'https://od-api.oxforddictionaries.com/api/v1';

// Params used in following operations

// lang
// word
// filter
// region
// target_lang
// filter
// filters_advanced
// corpus
// ngram-size
// endpoint

// Operations
// Lemmatron

// Check a word exists in the dictionary and retrieve its root form
const opInflections = '/inflections/{lang}/{word}';
            
// Apply optional filters to Lemmatron response			
const opInflectionsFiltered = '/inflections/{lang}/{word}/{filter}';
            

// Dictionary entries

// Retrieve dictionary information for a given word
const opDictEntry = '/entries/{lang}/{word}';

// Specify GB or US dictionary for English entry search
const opDictEntryRegion = '/entries/{lang}/{word}/regions={region}';
            
// Apply filters to response
const opDictEntryFiltered = '/entries/{lang}/{word}/{filter}';
            

// Thesaurus

// Retrieve words that are similar
const opThesaurusSynonyms = '/entries/{lang}/{word}/synonyms';

// Retrieve words that mean the opposite
const opThesaurusAntonyms = '/entries/{lang}/{word}/antonyms';
            
// Retrieve synonyms and antonyms for a given word
const opThesaurusSynonymsAntonyms = '/entries/{lang}/{word}/synonyms;antonyms';
            

// Search

// Retrieve possible matches to input
const opSearch = '/search/{lang}';

// Retrieve possible translation matches to input
const opSearchTranslation = '/search/{lang}/translations={target_lang}';
            

// Translation

// Retrieve translation for a given word
const opTranslationEntry = '/entries/{lang}/{word}/translations={c}';
            

// Wordlist

// Retrieve a list of words in a category
const opListCategory = '/wordlist/{lang}/{filter}';

// Retrieve list of words for category with advanced options
const opListCategoryFiltered = '/wordlist/{lang}/{filter_advanced}';

// The Sentence Dictionary

// Retrieve corpus sentences for a given word
const opSentencesEntry = '/entries/{lang}/{word}/sentences';
            

// LexiStats

// Retrieve the frequency of a word derived from a corpus.
const opStatsFrequency = '/stats/frequency/word/{lang}/';

// Retrieve a list of frequencies of a word/words derived from a corpus.
const opStatsFrequencies = '/stats/frequency/words/{lang}/';

//Retrieve the frequency of ngrams (1-4) derived from a corpus
const opStatsFrequencyNgrams = '/stats/frequency/ngrams/{lang}/{corpus}/{ngram-size}/';
            

// Utility

//Lists available dictionaries
const opLanguages = '/languages';

// Lists available filters
const opFilters = '/filters';

// Lists available filters for specific endpoint
const opFiltersForEndpoint = '/filters/{endpoint}';

// Lists available lexical categories in a dataset
const opLexicalCategories = '/lexicalcategories/{lang}';

// Lists available registers in a monolingual dataset
const opRegisters = '/registers/{lang}';

// Lists available registers in a bilingual dataset
const opRegistersSourceTarget = '/registers/{lang}/{target_lang}';

// Lists available domains in a monolingual dataset
const opDomains = '/domains/{lang}';

// Lists available domains in a bilingual dataset
const opDomainsSourceTarget = '/domains/{lang}/{target_lang}';

// Lists available regions in a monolingual dataset
const opRegions = '/regions/{lang}';

// Lists available grammatical features in a dataset
const opGrammar = '/grammaticalFeatures/{lang}';
            
