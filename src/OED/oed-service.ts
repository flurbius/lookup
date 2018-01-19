import * as axios from 'axios';

import * as oed from './oed-config';

export class DictionaryProvider {
    constructor(service: string) {

    }
    private ax = axios.default.create({
        baseURL: oed.oedUrl,
        headers: oed.headers,
        maxContentLength: oed.maxContentLength
    });
    
    private callAPI(endpoint: string): Promise<any> {
        return new Promise((resolve, reject) => {
            console.log('Sending request %s at %s', endpoint, new Date().toTimeString());
            this.ax.get(endpoint)
                .then((response) => {
                    console.log('received response %s at %s\n%s', endpoint, new Date().toTimeString(), JSON.stringify(response));
                    if (response.status !== 200) {
                        reject(response.statusText);
                    }
                    resolve(response.data);
                })
                .catch((err) => {
                    console.error('Error for %s at %s\n%s', endpoint, new Date().toTimeString(), err);
                    reject(err);
                });
        });
    }

    getUSDefinitionsExamples(word: string): Promise<any> {
        if (!word) {
            return new Promise((resolve, reject) => {
                reject('No word supplied');
            });
        }
        const myUrl = oed.endpointDefinitionsExamplesUS.replace('{word}', word.toLowerCase());
        return this.callAPI(myUrl);
    }

    getSynonymsAntonyms(word: string): Promise<any> {
        if (!word) {
            return new Promise((resolve, reject) => {
                reject('No word supplied');
            });
        }
        const myUrl = oed.endpointSynonymsAntonyms.replace('{word}', word.toLowerCase());
        return this.callAPI(myUrl);
    }
}

