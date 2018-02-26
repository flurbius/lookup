 import * as oed from './config';
import * as axios from 'axios';
import { Log } from '../commons/log';
import { Record, Ledger } from './record'

export class OED {
    private static readonly FN = 'OED:: ';
    private static ax = axios.default.create(oed.config);
    private static requestHistory: Ledger;

    static queryDictionary(op: string, word: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if (!word) {
                reject('No word supplied');
            }
            word = word.replace(/ /g, '_',)
                       .toLowerCase();
            let endpoint = oed.definitions.replace(/{word}/, word).escapeHTML();
            if (op == 'SYNONYMS') {
                endpoint = oed.synonyms.replace(/{word}/, word).escapeHTML();
            }

            Log.to.info(OED.FN + 'Sending request ' + endpoint);

            await this.ax.get(endpoint)
                .then((response) => {
                    Log.to.info(OED.FN + 'received response from ' + endpoint);
                    if (response.status !== 200) {
                        reject(response.statusText);
                    }
                    resolve(response.data);
                })
                .catch((err) => {
                    this.handleError(err);
                    reject(err);
                });
        });
    }

    private static handleError(e: axios.AxiosError) {
        if (e.response) {
            Log.to.error(OED.FN + 'Bad response: ' + e.code +' '+ e.name , e.message);
        } else if (e.request) {
            Log.to.error(OED.FN + 'Bad request: ' + e.code +' '+ e.name, e.message);
        } else {
            Log.to.error(OED.FN + 'Failed to send request: ' + e.code +' '+ e.name, e.message);
        }
    }
}
