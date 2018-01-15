#!/usr/bin/env Node
/* lookup.ts  */

import * as fs from 'fs';
import * as path from 'path';

import * as com from 'commander';
import { parseIso, format as dtfmt } from 'ts-date/locale/en';
var pkginfo = require('pkginfo')(module, 'name', 'description', 'version');
//import { name, despription, version } from '../pkginfo';

import './polyfills';
import { 
    DefinitionFile, 
    Phrase, 
    Word, 
    Sense, 
    Meta 
} from './definition-file';

import * as oed from './dictionary/oed-service';

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
    function logIODebugInfo() {
        if (isDirectory(inputDirectory)){
            console.debug('In Dir: %s', inputDirectory);
            console.debug('# files: %i', files.length);
            console.dir('Files: %o', JSON.stringify(files));
            } else {
            console.debug('In File: %s', inputDirectory);
        }
        console.debug('Out Dir: %s', outputDirectory);
        console.debug('Format: %s', format);
        console.log('option pronunciations = %o', lookup.pronunciations);
        console.log('option definitions = %o', lookup.definitions);
        console.log('option examples = %o', lookup.examples);
        console.log('option antonyms = %o', lookup.antonyms);
        console.log('option synonyms = %o', lookup.synonyms);
    }
    function logWordDebugInfo(f: string, w: string[]) {
        console.debug('File: %s', f);
        console.dir('Words: %o', JSON.stringify(w));
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
        .command('*', 'Lookup a list of words and output their meanings etc')
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
        files = fs.readdirSync(inputDirectory)
                  .map((f, i, entries) => {
                      if ((typeof(f) !== 'undefined') && (f.endsWith('txt'))){
                          return path.join(inputDirectory, f);
                      }
                  });
    } else {
        files = [ inputDirectory,  ];
    }
    logIODebugInfo(); /* DEBUGGING INFO   */
    files.forEach(f => {
        if (f && typeof(f) !== 'undefined' || '' !== f){
            let defs = new DefinitionFile();
            let fnparts = getFilenameParts(f as string);
            defs.name = fnparts[NAME] + defaultSuffix;
            defs.path = fnparts[DIRECTORY];
            defs.ext = format;
            let lines = getAsLines(f as string);
            for (let i = 0; i < lines.length; i++){
                let s = lines[i];
                if (s==='' || !s || s.length<1 || typeof(s)==='undefined'){
                    continue;
                }
                if (s[0] == '#'){  //# means the rest is date, class or meta
                    s = s.slice(s.lastIndexOf('#')+1).trim();  //TODO replace with regex
                    if (i>1){ //Meta data
                        defs.meta.push({ 
                            i: i, 
                            data:s 
                        });
                    } else {
                        let d = getDate(s);
                        if (d){// Date
                            defs.date = d;
                        } else { // class name
                            defs.class = s;
                        }
                    }
                } else{ // its a word or phrase
                    let wp: (Word | Phrase);
                    let p = s.split('.');
                    let index = -1;  // an index  -1 means assign next sequential but if
                    if (p.length > 1){ //there is a number in front - use it
                        index = parseInt(p[0]);
                        s = p[1].trim(); 
                    }else {
                        s = s.trim();
                    }
                    if (s.search(' ')<1){
                        wp = new Word();
                    } else {
                        wp = new Phrase();
                    }
                    wp.index = index;
                    wp.word = s;
                    defs.definitions.push(wp);
                }
            }// next word/line

            logWordDebugInfo(defs.name, lines);
        }/* next file*/ 
    });
}
