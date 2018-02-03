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
import {Log} from './log';
import { isNullOrUndefined } from 'util';

export module dvsLookup {

    const lookup = new com.Command();
    const defaultInputDirectory = 'lookup';
    const defaultOutputDirectory = 'lookup';
    const defaultFormat = 'json';
    const defaultSuffix = '.defs'

    let inputDirectory: string = '';
    let outputDirectory: string = '';
    let format: string = '';
    let files: (string | undefined)[];

    function objectAccessible(dir: string): boolean {
        try {
            fs.accessSync(dir);
            return true;
        } catch (err) {
            Log.To.info(err, 'objectAccessible Rejected: ' + dir);
            return false;
        }
    }

    function isDirectory(file: string): boolean {
        try {
            return fs.statSync(file).isDirectory();
        } catch (err) {
            Log.To.info(err, 'isDirectory result is negative: ' +file);
        }
        try {
            fs.mkdirSync(file);
            return fs.statSync(file).isDirectory();
        } catch (err) {
            Log.To.info(err, 'couldnt create it either ' + file);
            return false;
        }
    }
    function coerceInputDirectoryOrFile(val: string): string {
        if (!val) {
            val = defaultInputDirectory;
            Log.To.warn('no parameter supplied for --input option using default value: ' +  defaultInputDirectory);
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
        Log.To.info('fileOrDirectory: Could not use supplied value '+dir + ', using ' + __dirname);
        return __dirname;
    }

    function coerceOutputDirectory(val: string): string {
        if ('' === val || typeof (val) === undefined || !val) {
            if ('' === inputDirectory) {
                val = defaultOutputDirectory;
            } else {
                val = inputDirectory;
            }
        }
        return outputDirectory = directory(val);
    }
    function directory(dir: string): string {
        // take the first match that is a directory
        if (isNullOrUndefined(dir) || ''===dir){
            return __dirname;
        }
        if (isDirectory(dir)) {
            return path.join(dir);
        }
        if (isDirectory(path.join('~', dir))) {
            return path.join('~', dir);
        }
        if (isDirectory(path.join('/tmp', dir))) {
            return path.join('/tmp', dir);
        }
        Log.To.info('directory: Could not use supplied value ' + dir + ', using ' +  __dirname);
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

    function getAsLines(file: string): string[] {
        return fs.readFileSync(file, { encoding: 'utf8', flag: 'r' })
            .replace('\r\n', '\n')
            .split('\n');
    }
    const EXTENSION = 2;
    const NAME = 1;
    const DIRECTORY = 0;
    function getFilenameParts(file: string): string[] {
        const parts = ['', '', ''];
        const rp = fs.realpathSync(file);
        parts[EXTENSION] = rp.slice(rp.lastIndexOf('.'));
        parts[NAME] = rp.slice(rp.lastIndexOf('/') + 1, rp.lastIndexOf('.'));
        parts[DIRECTORY] = rp.slice(0, rp.lastIndexOf('/'));
        return parts;
    }

    function getDate(item: string): string | null {
        const d = parseIso(item);
        dtfmt(d, 'Do MMMM YYYY');
        if (d) {
            return d.toLocaleDateString();
        } else {
            return null;
        }
    }

    function buildWordlist(f: string): DefinitionFile {
        let wordlist = new DefinitionFile();
        wordlist.start = Date.now().valueOf();
        wordlist.inputfile = f;
        let fnparts = getFilenameParts(f);
        wordlist.name = fnparts[NAME] + defaultSuffix;
        wordlist.path = outputDirectory;
        wordlist.ext = '.' + format;
        let lines = getAsLines(f);
        let item = 1;
        for (let i = 0; i < lines.length; i++) {
            let l = lines[i];
            if ((l === '') || !l || (l.length < 1)) {
                continue;
            }
            if (l[0] == '#') {  //# means a comment
                l = l.slice(l.lastIndexOf('#') + 1).trim();
                if (i < 2) {  //first two lines can be date or class name 
                    let d = getDate(l);
                    if (d) {// Date
                        wordlist.date = d;
                    } else { // class name
                        wordlist.class = l;
                    }
                } else {  // other comments are section titles
                    wordlist.sections.push({
                        i: item,
                        title: l
                    });
                    item++;
                }
            } else { // its a word or phrase
                let wp: Definition;
                let index = item;
                let p = l.split('.');  // if there is a . indicates the words are numbered
                if (p.length > 1) { //there is a number in front - use it instead
                    index = parseInt(p[0]);
                    l = p[1].trim();
                }
                if (p.length < 2 || isNaN(index)) {
                    index = item;
                    l = l.trim();
                }
                item = index + 1;
                if ((l.search(' ') < 1) || (l.search('_') < 1)) {
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
        .option('-v, --verbose', 'Show debugging information')
        .option('-p, --no-pronunciations', 'Do not include pronunciations')
        .option('-d, --no-definitions', 'Do not include word definitions')
        .option('-e, --no-examples', 'Do not include example sentences')
        .option('-a, --no-antonyms', 'Do not include antonyms')
        .option('-s, --no-synonyms', 'Do not include synonyms')
        .description('Look up the definitions of words, using an online dictionary, you may specify one or more files containing words to be looked up.  For information regarding the file format type "lookup --list-format.')
        .arguments('[file] ...');
    lookup.parseOptions(process.argv);
    lookup.parse(process.argv);
    
    if (lookup.listFormat) { //TODO This needs to be done
        const description = ['Input file format\n\n'
                            ,'Words should be each on their own line.  Use present perfect tense in verbs, '
                            ,'make nouns singular, when in doubt use a hyphen. Any line that begins with "#" is regarded as a '
                            ,'comment and will be ignored.  The first two lines, if they are comments, may contain a date, or '
                            ,'a string.  If present, the string is used as the class name and appears alongside the date if any'
                            ,'.  Lines with words on them may have an index.  The numbers should be consecutive starting at 1 '
                            ,'for the first word.  The number should be on the same line before the word and be immediately '
                            ,'followed by a period.\n\n'
                            ,'        eg: 1.novel\n'
                            ,'            2.puzzle.\n'
                            ,'            3.muncher.\n'
                        ];
        console.log(description.join(''));
        process.exit(0);
    }

    if (lookup.verbose)
        Log.SetVerbose(true);
    else
        Log.SetVerbose(false);
    Log.console([ JSON.stringify(lookup) ]);

    if ('' === inputDirectory) {
        coerceInputDirectoryOrFile(lookup.input); //? why not lookup.opts['input']
    }
    if ('' === outputDirectory) {
        coerceOutputDirectory(lookup.output);
    }
    if (!format) {
        coerceFormat(lookup.format);
    }
    Log.console([' Input: ' + inputDirectory,
                 '   Out: ' + outputDirectory,
                 'Format: ' + format 
            ]);

    // if we are dealing with a dir then populate the list of input files 
    if (isDirectory(inputDirectory)) {
        files = fs.readdirSync(inputDirectory)
            .filter((f, i, entries) => {
                if ((typeof (f) !== 'undefined') && (f.endsWith('txt'))) {
                    Log.console([ 'File: ' + f + ' will be processed.']);
                    return true;
                }
            })
            .map((f, i, entries) => { return path.join(inputDirectory, f) })
    } else {  // otherwise it is just one file
        Log.console([ 'File: ' + inputDirectory + ' will be processed.']);
        files = [inputDirectory];
    }
    //logIODebugInfo(); /* DEBUGGING INFO   */
    let output: DefinitionFile[] = [];
    files.forEach(f => {
        if (f && typeof (f) !== 'undefined' && '' !== f) {
            let wordlist = buildWordlist(f);
            Dictionary.DefineWords(wordlist)
                .then((defs) => {
                    let out = FileBuilder.create(format, wordlist);
                    let can = path.join(defs.path, defs.name + defs.ext);
                    fs.writeFileSync(can, out);
                    return defs;
                })
                .catch((err) => {
                    Log.To.error(err, 'Error getting definitions for file ' + f);
                });
        }/* next file*/
    });
}
