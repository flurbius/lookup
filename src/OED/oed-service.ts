import * as oed from './oed-config';
import * as axios from 'axios';

export class OED {
    private static ax = axios.default.create(oed.config);
    
    static queryDictionary(op: string, word: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!word) {
                reject('No word supplied');
            }
            
            let endpoint = oed.definitions.replace('{word}', word.toLowerCase());
            if (op=='SYNONYMS'){
                endpoint = oed.synonyms.replace('{word}', word.toLowerCase());
            } 

            console.log('Sending request %s at %s', endpoint, new Date().toTimeString());

            this.ax.get(endpoint)
                .then((response) => {
                    console.log('received response %s at %s', endpoint, new Date().toTimeString());
                    if (response.status !== 200) {
                        reject(response.statusText);
                    }
                    resolve(response.data);
                })
                .catch((err) => {
                    console.error('Error for %s at %s', endpoint, new Date().toTimeString());
                    this.handleError(err);
                    reject(err);
                });
        });
    }
    
    private static handleError(error: axios.AxiosError) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log('No response received');
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
    }
}
