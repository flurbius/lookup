#!/usr/bin/env Node 

import './polyfills';
import * as com from 'commander';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as sanitize from 'sanitize-filename';

import * as path from 'path';

export module dvsLookup {

    function filename(val: string) {
        if (fs.existsSync(path.join(val))) {
            return path.join(val);
        }
        if (fs.existsSync(path.join('~', val))) {
            return path.join('~', val);
        }
        if (fs.existsSync(path.join(__dirname, 'in/words.txt'))) {
            return path.join(__dirname, 'in/words.txt');
        }
        if (fs.existsSync(path.join('~', 'in/words.txt'))) {
            return path.join('~', 'in/words.txt');
        }
        if (fs.existsSync(path.join('~', 'words.txt'))) {
            return path.join('~', 'words.txt');
        }
        const msg = 'Error: No words found:\n You must specify an input file (--input-file <filename>, or provide the default file words.txt in '
            + path.join(__dirname, 'in') + ' or ' + path.join('~', 'in') + ' or ' + path.join('~');
        throw (new Error(msg));
    }
    function outfile(val: string) {
        return path.join(__dirname, 'out', sanitize(val));

    }
    enum Format {
        html,
        md,
        txt
    }
    function format(val: string) {
        if (val == 'md') return Format.md;
        if (val == 'txt') return Format.txt;
        return Format.html;
    }
    function define(words: String[], outfile: String, format: Format) {
        console.log('Outfile: ' + outfile);
        console.log('Format: ' + format.toString());
        console.log('Words: ' + words.join());
    }


    
    com
        .version('0.1.0', )
        .option('-i, --input <file>', 'A file containing the words to be defined', filename, 'in/words.txt')
        .option('-o, --output <file>', 'A filename the definitions will be written to', outfile, 'out/words.html')
        .option('-f, --format <format>', 'A format, the definitions will be output as html, txt or md', format, 'html')
        .arguments('[options] [Words...]')
        .action(function (Words: String[]) {
            var words = Array<String>();
            if (Words) {
                for (let w in Words)
                    words.push(Words[w]);
            } else if (com.input) {
                let lines = fs.readFileSync(com.input).toString().replace(/\r\n/g, '\n').split('\n');
                for (let w in lines)
                    words.push(lines[w]);
            }
            if (words.length < 1) {
                const msg = 'Error: No words found:\n You must specify an input file (--input-file <filename>, or provide the default file words.txt in '
                    + path.join(__dirname, 'in') + ' or ' + path.join('~', 'in') + ' or ' + path.join('~');
                throw (new Error(msg));
            }


            define(words, com.output, com.format);
        })
        .parse(process.argv);
}
