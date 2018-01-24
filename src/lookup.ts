#!/usr/bin/node
/* lookup.ts  */

import * as fs from 'fs';
import * as path from 'path';

import * as com from 'commander';
import { parseIso, format as dtfmt } from 'ts-date/locale/en';
var pkginfo = require('pkginfo')(module, 'name', 'description', 'version');

import './polyfills';
import { 
    DefinitionFile, 
    Phrase, 
    Word, 
    Entry,
    Section, 
    Definition
} from './definition-file';
import { Dictionary } from './dictionary';
import { FileBuilder } from './file-builder';


export module dvsLookup {

    const lookup = new com.Command();
    const defaultInputDirectory = 'lookup';
    const defaultOutputDirectory = 'lookup';
    const defaultFormat = 'json';
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
            } else {
                val = inputDirectory;
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
        switch (val) {
            case 'md':
            case 'txt':
            case 'html':
                return format = val;
            default:
                return val = format = defaultFormat;
        }
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
        parts[NAME] = rp.slice(rp.lastIndexOf('/')+1, rp.lastIndexOf('.'));
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

    function buildWordlist(f: string): DefinitionFile{
        let wordlist = new DefinitionFile();
        wordlist.inputfile = f;
        let fnparts = getFilenameParts(f);
        wordlist.name = fnparts[NAME] + defaultSuffix;
        wordlist.path = outputDirectory;
        wordlist.ext = '.' + format;
        let lines = getAsLines(f);
        let item = 1;
        for (let i = 0; i < lines.length; i++){
            let l = lines[i];
            if ((l==='') || !l || (l.length<1)){
                continue;
            }
            if (l[0] == '#'){  //# means a comment
                l = l.slice(l.lastIndexOf('#')+1).trim();
                if (i<2){  //first two lines can be date or class name 
                    let d = getDate(l);
                    if (d){// Date
                        wordlist.date = d;
                    } else { // class name
                        wordlist.class = l;
                    }
                } else {  // other comments are section titles
                    wordlist.sections.push({ 
                        i: item, 
                        title:l 
                    });
                    item++;
                }
            } else{ // its a word or phrase
                let wp: Definition;
                let index = item;
                let p = l.split('.');  // if there is a . indicates the words are numbered
                if (p.length > 1){ //there is a number in front - use it instead
                    index = parseInt(p[0]);
                    l = p[1].trim(); 
                }
                if (p.length < 2 || isNaN(index)) {
                    index = item;
                    l = l.trim();
                }
                item = index + 1;
                if (l.search(' ')<1){
                    wp = new Word();
                } else {
                    wp = new Phrase();
                }
                wp.index = index;
                wp.text = l;
                wordlist.definitions.push(wp);
            }
        }
        return wordlist;
    }


    /*
    *Entry point
    */
    lookup.version("lookup version " + module.exports.version)
        .option('-l, --list-format', 'Output information on the expected list format for --input files.')
        .option('-i, --input <dir>',
            'A directory containing one or more files with a .txt extension that contain the words to be defined, or a single file',
            coerceInputDirectoryOrFile)
        .option('-o, --output <dir>',
            'A directory where the files containing the definitions will be written to, default is to write to the same directory as --input.',
            coerceOutputDirectory)
        .option('-f, --format <format>',
            'A format, the definitions will be output as json, html, txt or md,\ndefault is json',
            coerceFormat)
        .option('-p, --no-pronunciations', 'Do not include pronunciations')
        .option('-d, --no-definitions', 'Do not include word definitions')
        .option('-e, --no-examples', 'Do not include example sentences')
        .option('-a, --no-antonyms', 'Do not include antonyms')
        .option('-s, --no-synonyms', 'Do not include synonyms')
        .description('Look up the definitions of words, using an online dictionary, you may specify one or more files containing words to be looked up.  For information regarding the file format type "lookup --list-format.')
        .arguments('[file] ...');
    lookup.parseOptions(process.argv);
    lookup.parse(process.argv);
    if (lookup.listFormat){
        console.log('Files must be like so ...');
        process.exit(0);
    }

    if (''=== inputDirectory){
        coerceInputDirectoryOrFile(lookup.input); //? why not lookup.opts['input']
    }
    if (''=== outputDirectory){
        coerceOutputDirectory(lookup.output);
    }
    if (!format){
        coerceFormat(lookup.format);
    }

    // if we are dealing with a dir then populate the list of input files 
    if (isDirectory(inputDirectory)){
        files = fs.readdirSync(inputDirectory)
                  .filter((f, i, entries) => {
                      if ((typeof(f) !== 'undefined') && (f.endsWith('txt'))){
                          return true;
                      }
                  })
                  .map((f,i,entries)=> {return path.join(inputDirectory, f)})
    } else {  // otherwise it is just one file
        files = [ inputDirectory ];
    }
    //logIODebugInfo(); /* DEBUGGING INFO   */
    let output: DefinitionFile[] = [];
    files.forEach(f => {
        if (f && typeof(f) !== 'undefined' && '' !== f){
            let wordlist = buildWordlist(f);
            Dictionary.DefineWords(wordlist)
            .then((defs)=>{
                let out = FileBuilder.create(format, wordlist);
                let can = path.join(defs.path, defs.name + defs.ext);
                fs.writeFileSync(can,out);
                return defs;
            })
            .catch((err)=>{
                console.error('Error getting definitions for file %s')
            });
        }/* next file*/ 
    });
}
