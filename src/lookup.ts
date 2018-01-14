#!/usr/bin/env Node
/* lookup.ts  */

import './polyfills';
import * as com from 'commander';
import * as fs from 'fs';
import { DefinitionFile, Phrase, Word, Sense, Meta, MetaType } from './definition-file';
import { parseIso, format as dtfmt } from 'ts-date/locale/en';
import * as path from 'path';

var pkginfo = require('pkginfo')(module, 'name', 'description', 'version');

export module dvsLookup {

    const lookup = new com.Command();
    const defaultInputDirectory = 'lookup';
    const defaultOutputDirectory = 'lookup';
    const defaultFormat = 'html';
    const defaultSuffix = '.defs'

    let inputDirectory: string = '';
    let outputDirectory: string ='';
    let format: string = '';
    let files: (string | undefined)[];
    let words: string[];

    
    function objectAccessible(dir: string): boolean {
        try {
            fs.accessSync(dir);
            return true;
        } catch (err) {
            console.error('objectAccessible Rejected: %o', err);
            return false;
        }
    }

    function isDirectory(file: string): boolean {
        try {
            return fs.statSync(file).isDirectory();
        } catch (err) {
            console.error('isDirectory result is negative: %o',JSON.stringify(err));
        }
        try {
            fs.mkdirSync(file);
            return fs.statSync(file).isDirectory();
        } catch (err) {
            console.error('couldnt create it either :-( %o',JSON.stringify(err));
            return false;
        }
    }
    function coerceInputDirectoryOrFile(val: string): string {
        if (!val) {
            val = defaultInputDirectory;
            console.error('no parameter supplied for --input option using default value: %s', defaultInputDirectory);
        }
        return inputDirectory = fileOrDirectory(val);
    }

    function fileOrDirectory(dir: string): string {
        // take the first match that is a directory or a file

        if (objectAccessible(dir)) {
            return path.join(dir);
        }
        if (objectAccessible(path.join('~', dir))) {
            return path.join('~', dir);
        }
        if (objectAccessible(path.join(__dirname, dir))) {
            return path.join(__dirname, dir);
        }
        console.debug('fileOrDirectory: Could not use supplied value %s, using %s', dir, __dirname);
        return __dirname;
    }

    function coerceOutputDirectory(val: string): string {
        if ('' === val || typeof(val)===undefined || !val) {
            if ('' === inputDirectory){
                val = defaultOutputDirectory;
                console.log('no parameter supplied for --output option using default value %s', val);
            } else {
                val = inputDirectory;
                console.log('no parameter supplied for --output option using input directory %s', val);
            }
        }
        return outputDirectory = directory(val);
    }
    function directory(dir: string): string{
        // take the first match that is a directory

        if (isDirectory(dir)) {
            return path.join(dir);
        }
        if (isDirectory(path.join('~', dir))) {
            return path.join('~', dir);
        }
        if (isDirectory(path.join(__dirname, dir))) {
            return path.join(__dirname, dir);
        }
        console.debug('directory: Could not use supplied value %s, using %s', dir, __dirname);
        return __dirname;
    }

    function coerceFormat(val: string) {
        if ('md' === val) return format = 'md';
        if ('txt' === val) return format = 'txt';
        if ('html' === val) return format = 'html';
        console.error('coerceFormat: Unknown format (%s) using default (%s)', val, defaultFormat);
        return format = defaultFormat;
    }
    function logDebugInfo() {
        if (isDirectory(inputDirectory)){
            console.debug('In Dir: %s', inputDirectory);
            console.debug('# files: %i', files.length);
            console.dir('Files: %o', JSON.stringify(files));
            } else {
            console.debug('In File: %s', inputDirectory);
        }
        console.debug('Out Dir: %s', outputDirectory);
        console.debug('Format: %s', format);
        console.dir('Words: %o', JSON.stringify(words));
        console.log('option pronunciations = %o', lookup.pronunciations);
        console.log('option definitions = %o', lookup.definitions);
        console.log('option examples = %o', lookup.examples);
        console.log('option antonyms = %o', lookup.antonyms);
        console.log('option synonyms = %o', lookup.synonyms);
    }

    function getAsLines(file: string) : string[]{
        return fs.readFileSync(file, { encoding: 'utf8', flag: 'r' })
                .replace('\r\n', '\n')
                .split('\n');  
    }
    const EXTENSION = 2;
    const NAME = 1;
    const DIRECTORY = 0;

    function getFilenameParts(file:string):string[]{
        const parts  = ['','',''];
        const rp = fs.realpathSync(file);
        parts[EXTENSION] = rp.slice(rp.lastIndexOf('.'));
        parts[NAME] = rp.slice(rp.lastIndexOf('/'), rp.lastIndexOf('.'));
        parts[DIRECTORY] = rp.slice(0,rp.lastIndexOf('/'));
        return parts;
    }
    function getDate(item:string):string | null{
        const d = parseIso(item); 
        dtfmt(d, 'Do MMMM YYYY');
        if (d) {
            return d.toLocaleDateString();
        } else {
            return null;
        }
    }

    lookup.version(module.exports.version)
          .option('--input <dir>',
          'A directory containing one or more files that contain the words to be defined, or a single file',
          coerceInputDirectoryOrFile)
          .option('--output <dir>',
          'A directory where the files containing the definitions will be written to.',
          coerceOutputDirectory)
          .option('--format <format>',
          'A format, the definitions will be output as html, txt or md',
          coerceFormat)
       .option('--no-pronunciations', 'Do not include pronunciations')
       .option('--no-definitions', 'Do not include word definitions')
       .option('--no-examples', 'Do not include example sentences')
       .option('--no-antonyms', 'Do not include antonyms')
       .option('--no-synonyms', 'Do not include synonyms')
       .action(function () { console.log('action called'); });

       console.dir('opts = %o', lookup.opts());

       lookup.parseOptions(process.argv);
       lookup.parse(process.argv);
       console.dir('argv-dir: %o', process.argv);
       console.dir('stringified: %s', JSON.stringify(process.argv));
       console.dir('opts = %o', lookup.opts());

        if (''=== inputDirectory){
            coerceInputDirectoryOrFile(lookup.input); //? why not lookup.opts['input']
        }
        if (''=== outputDirectory){
            coerceOutputDirectory(lookup.output);
        }
        if (!format){
            coerceFormat(lookup.format);
        }

        // read all text files in dir
        if (isDirectory(inputDirectory)){
            files = fs.readdirSync(inputDirectory);
            files = files.map((f, i, entries) => {
                if ((typeof(f) !== 'undefined') && (f.endsWith('txt'))){
                  return path.join(inputDirectory, f);
                }
            });
        } else {
            files = [ inputDirectory ];
        }
        files.forEach(f => {
            if (f && typeof(f) !== 'undefined' || '' !== f){
                let fnparts = getFilenameParts(f as string);
                const df = new DefinitionFile();
                df.meta = Array<MetaType>();
                df.name = fnparts[NAME] + defaultSuffix;
                df.path = fnparts[DIRECTORY];
                df.ext = fnparts[EXTENSION];
                words = getAsLines(f as string);
                for (let i = 0; i < words.length; i++){
                    let s = words[i];
                    if (s[0] == '#'){
                        if (i>1){ //Meta data
                            let meta = {
                                i: i,
                                data: s.slice(1)
                            };
                            df.meta.push(meta);

                        } else {
                            let d = getDate(s.slice(1));
                            if (d){// Date
                                df.date = d;
                            } else { // class name
                                df.class = s.slice(1);
                            }
                        }


                    } else{
                        let nw = {
                            index: -1,
                            data:''
                        }
                        let p = s.split('.');
                        if (p.length > 1){
                            // we have a number X.word
                            nw.index = parseInt(p[0]);
                            nw.data = p[1]; 
                        }else {
                           nw.index = i;
                           nw.data = s;
                        }
                        //get the  def


                    }
                }// next word/line
            }
        }/* next file*/ );






        logDebugInfo();
}
