#!/usr/bin/node
/* lookup.ts  */

import * as fs from 'fs';
import { join } from 'path';
import { isNullOrUndefined, isNull } from 'util';
import * as com from 'commander';
var pkginfo = require('pkginfo')(module, 'name', 'description', 'version');

import './polyfills';

import { Clerk } from './clerk';
import { FileBuilder } from './file-builder';
import { Log } from './commons/log';
import { Lol, Word, Phrase } from './lol';
import { iLemma, iLol } from './i-lol';
import {
    isWritablePath,
    isDirectory,
    parseDate,
    readFileAsArray,
    FilenameParts,
    getFilenameParts
} from './commons/file';

// make this a class
export module dvsLookup {

    const FN = "lookup:: ";
    const commander = new com.Command();
    const defaultInputDirectory = 'lookup';
    const defaultOutputDirectory = 'lookup';
    const defaultSuffix = '.defs'

    let inputDirectory: string = '';
    let outputDirectory: string = '';
    let format: string = '';
    let files: (string | undefined)[];

    function coerceFormat(val: string, defaultFormat: string = 'md') {
        switch (val) {
            case 'md':
            case 'txt':
            case 'html':
                return val;
            default:
                val = defaultFormat;
                return val;
        }
    }

    function buildWordlist(f: string): Lol {
        let wordlist = new Lol();

        wordlist.start = Date.now().valueOf();
        wordlist.source = f;
        let fnparts = getFilenameParts(f);
        wordlist.name = fnparts[FilenameParts.Name] + defaultSuffix;
        wordlist.path = outputDirectory;
        wordlist.ext = '.' + format;
        let lines = readFileAsArray(f);
        let item = 1;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if ((line === '') || !line || (line.length < 1))
                continue;
            if (line[0] == '#') {  //# means a comment
                line = line.slice(line.lastIndexOf('#') + 1).trim();
                if (i < 2) {  //first two lines can be date or class name 
                    let d = parseDate(line);
                    if (d) {// Date
                        wordlist.date = d;
                    } else { // class name
                        wordlist.class = line;
                    }
                } else {
                    // ignore comment
                }
            } else { // its a word or phrase
                let wp: iLemma;
                // if it has spaces or underscores we may treat it differently
                if ((line.search(' ') < 1) || (line.search('_') < 1)) {
                    wp = new Word();
                } else {
                    wp = new Phrase();
                }
                // /([A-Z]+[A-Z_ -]*[A-Z]+)/i
                const m = line.match(/([A-Z]+[A-Z_ -]*[A-Z]+)/i);
                if (!isNull(m))
                    wp.text = m[0].toString();
                else
                    wp.text == line;
                wordlist.list.push(wp);
            }
        }
        return wordlist;
    }
    function showListFileHelpandExit() {
        const description = [
            'Input file format\n\nWords should be each on their own line.  Use present perfect tense in '
            , 'verbs, make nouns singular, when in doubt use a hyphen. Any line that begins with "#" is '
            , 'regarded as a comment and will be ignored.  The first two lines, if they are comments, '
            , 'may contain a date, or a string.  If present, the string is used as the class name and '
            , 'appears alongside the date if any as the title of the document. Each line that is not a '
            , 'comment should have one word or phrase on it.\n\n'
            , '        eg: # 2018-02-22\n'
            , '            # Advaanced\n'
            , '            novel\n'
            , '            puzzle\n'
            , '            muncher\n'
        ];
        console.log(description.join(''));
        process.exit(0);
    }

    function CheckFileSystem() {
    }

    function InitializeCommander() {
        commander
            .version("lookup version " + module.exports.version)

            .option('-l, --list-format', 'Shows information on the expected list format for input files.')

            .option('-o, --output <dir>',
                'A directory where the files containing the definitions will be written to, default is to write to the directory the input file came from.',
                (val, def) => { outputDirectory = isWritablePath(val, defaultOutputDirectory) })

            .option('-f, --format <format>',
                'One of [json | html | txt | md], the definitions will be output as json, html, txt or md,\ndefault is json',
                (val, def) => { format = coerceFormat(val) })

            .option('-v, --verbose', 'Show debugging information')

            .command('*', 'Look up the definitions of words, using an online dictionary, ' +
                'you may specify a file of words, a directory of such files, or a word to be looked up.  ' +
                'For information regarding the file format type "lookup --list-format.')
            .arguments('<file|dir|word>')
            .action(lookup);

    }

    function lookup(arg:string): void {
        if (commander.listFormat)
            showListFileHelpandExit();

        if (commander.verbose)
            Log.SetVerbose(true);
        else
            Log.SetVerbose(false);

        // if (args.length < 1) {
        //     Log.fatal(['No words to look up!']);
        // }
        // for (let n = 0; n < args.length; n++) {
            inputDirectory = arg;

            if ('' === outputDirectory) {
                outputDirectory = isWritablePath(commander.output, defaultOutputDirectory);
            }
            // if we are dealing with a dir then populate the list of input files 
            if (isDirectory(inputDirectory)) {
                files = fs.readdirSync(inputDirectory)
                    .filter((f, i, entries) => {
                        if ((typeof (f) !== 'undefined') && (f.endsWith('txt'))) {
                            Log.console([FN + 'File: ' + f + ' will be processed from a possible ' + entries.length.toString() ]);
                            return true;
                        }
                    })
                    .map((f, i, entries) => { return join(inputDirectory, f) });
            } else {  // otherwise it is just one file
                Log.console([FN + 'File: ' + inputDirectory + ' is the only specified file and will be processed.']);
                files = [inputDirectory];
            }
            // or maybe some words

            let output: Lol[] = [];
            files.forEach(f => {
                if (f && typeof (f) !== 'undefined' && '' !== f) {
                    let wordlist = buildWordlist(f);
                    Clerk.DefineWords(wordlist)
                        .catch((err) => {
                            Log.To.error(err, FN + 'Error getting definitions for file ' + f);
                        })
                        .then((defs) => {
                            if (typeof (defs) !== 'undefined' && defs.path !== '') {
                                let out = FileBuilder.create(format, wordlist);
                                let can = join(defs.path, defs.name + defs.ext);
                                fs.writeFileSync(can, out);
                                return defs;
                            }
                        })
                        .catch((err) => {
                            Log.To.error(err, FN + 'Error writing file ' + f);
                        });
                }/* next file*/
            });
  //      } //next arg
    }
    /*
    *Entry point
    */
    function Main() {
        InitializeCommander();

        let a = commander.parseOptions(process.argv);
        commander.parse(a.args);
    }

    Main();
}