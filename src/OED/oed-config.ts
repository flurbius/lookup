import * as  secret from './.secret';
    

    export const endpointDefinitionsExamplesUS = '/entries/en/{word}/definitions;examples;regions=us';
    export const endpointSynonymsAntonyms = '/entries/en/{word}/synonyms;antonyms';


    // defaults
    export const oedUrl = 'https://od-api.oxforddictionaries.com/api/v1';
    export const timeout = 1000;
    export const maxContentLength = 20000;

    export const headers = {
            'app_id': secret.appid,
            'app_key': secret.appkey
        };
