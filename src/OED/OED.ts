import * as oed from './config';
import * as axios from 'axios';
import { Log } from '../log';


export class OED {
    private static ax = axios.default.create(oed.config);

    static queryDictionary(op: string, word: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!word) {
                reject('No word supplied');
            }

            let endpoint = oed.definitions.replace('{word}', word.toLowerCase());
            if (op == 'SYNONYMS') {
                endpoint = oed.synonyms.replace('{word}', word.toLowerCase());
            }

            Log.To.info('Sending request ' + endpoint);

            this.ax.get(endpoint)
                .then((response) => {
                    Log.To.info('received response from ' + endpoint);
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

    private static handleError(error: axios.AxiosError) {
        if (error.response) {
            Log.To.error(error, 'Bad response');
        } else if (error.request) {
            Log.To.error(error, 'Bad request');
        } else {
            Log.To.error(error, 'Error before sending request');
        }
        Log.To.error(error);
    }
}
