#!/usr/bin/env Node
/* lookup.ts  */

import './polyfills';
import * as com from 'commander';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as sanitize from 'sanitize-filename';
import * as path from 'path';

var pkginfo = require('pkginfo')(module, 'name', 'description', 'version');

export module dvsLookup {

    enum Format {
        html,
        md,
        txt
    }

    const defaultInputDirectory = 'lookup';
    const defaultOutputDirectory = 'lookup';
    const defaultFormat = Format.html;
    const defaultSuffix = 'defs'

    let inputDirectory: string;
    let outputDirectory: string;
    let format: Format | null = null;
    let files: string[];

    
    function objectAccessible(dir: string): boolean {
        try {
            fs.accessSync(dir);
            return true;
        } catch (err) {
            console.error('objectAccessible Rejected: ' + JSON.stringify(err));
            return false;
        }
    }

    function isDirectory(file: string): boolean {
        try {
            return fs.statSync(file).isDirectory();
        } catch (err) {
            console.error('isDirectory result is negative: ' + JSON.stringify(err));
            return false;
        }
    }
    function coerceInputDirectory(val: string): string {
        return inputDirectory = coerceDirectory(val, defaultInputDirectory);
    }
    function coerceOutputDirectory(val: string): string {
        return outputDirectory = coerceDirectory(val, defaultOutputDirectory);
    }


    function coerceDirectory(val: string, def: string): string {
        // take the first match that is a directory or a file
        if (val) {
            def = val;
        }
        if (objectAccessible(def)) {
            return path.join(def);
        }
        if (objectAccessible(path.join('~', def))) {
            return path.join('~', def);
        }
        if (objectAccessible(path.join(__dirname, def))) {
            return path.join(__dirname, def);
        }
        return __dirname;
        // const msg = 'Error: No words found:\n You must specify an input file (--input-file <filename>, or provide the default file words.txt in '
        //     + path.join(__dirname, 'in') + ' or ' + path.join('~', 'in') + ' or ' + path.join('~');
        // throw (new Error(msg));
    }

    function coerceFormat(val: string) {
        if (val == 'md') return format = Format.md;
        if (val == 'txt') return format = Format.txt;
        return format = defaultFormat;
    }
    function logDebugInfo() {
        console.log('In Dir: ' + inputDirectory);
        console.log('Out Dir: ' + outputDirectory);
        console.log('Format: ' + JSON.stringify(format));
        console.log('# files: ' + files.length);
        console.log('Files: ' + files.join());
    }

    const lookup = new com.Command;

    lookup
        .version(module.exports.version)
        .option('-i, --input <dir>',
            'A directory containing one or more files that contain the words to be defined.',
            coerceInputDirectory,
            defaultInputDirectory)
        .option('-o, --output <dir>',
            'A directory where the files containing the definitions will be written to.',
            coerceOutputDirectory,
            defaultOutputDirectory)
        .option('-f, --format <format>',
            'A format, the definitions will be output as html, txt or md',
            coerceFormat,
            defaultFormat)
            .option('-P, --no-pronunciations', 'Do not include pronunciations')
            .option('-D, --no-meanings', 'Do not include word definitions')
            .option('-E, --no-examples', 'Do not include example sentences')
            .option('-A, --no-antonyms', 'Do not include antonyms')
            .option('-S, --no-synonyms', 'Do not include synonyms')
            .arguments('[options]')
        .action(function () {
            if (!inputDirectory){
                coerceInputDirectory(lookup.input); //? why not lookup.opts['input']
            }
            if (!outputDirectory){
                coerceOutputDirectory(com.output);
            }
            if (!format){
                coerceFormat(com.format);
            }

            // read all text files in dir
            if (isDirectory(inputDirectory)){
                files = fs.readdirSync(inputDirectory);
                files.map((f, i, entries) => {
                    if (f.endsWith('txt')){
                        return path.join(inputDirectory, f);
                    }
                });
            } else {
                files = [ inputDirectory ];
            }
            logDebugInfo();



//                let lines = fs.readFileSync(com.input).toString().replace(/\r\n/g, '\n').split('\n');
            // if (words.length < 1) {
            //     const msg = 'Error: No words found:\n You must specify an input file (--input-file <filename>, or provide the default file words.txt in '
            //         + path.join(__dirname, 'in') + ' or ' + path.join('~', 'in') + ' or ' + path.join('~');
            //     throw (new Error(msg));
            // }


            
        })
        .parse(process.argv);
}
