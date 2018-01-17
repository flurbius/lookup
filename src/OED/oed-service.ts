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
    /*
    *GetEntry
    */
    getEntry(word: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!word) {
                reject('No word supplied');
            }
            const myUrl = oed.op19DictEntry.replace('{word}', word.toLowerCase());
            this.ax.get(myUrl)
                .then((response) => {
                    if (response.status < 200 || response.status > 299) {
                        reject(response.statusText);
                    }
                    resolve(response.data);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}
