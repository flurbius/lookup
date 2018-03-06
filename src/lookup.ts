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
    ensurePathIsWriteable,
    isDirectory,
    isAccessibleObject,
    parseDate,
    readFileAsArray,
    FilenameParts,
    getFilenameParts,
    ensurePathOrFileIsReadable
} from './commons/file';
import { homedir } from 'os';

// make this a class
export module dvsLookup {

    const FN = "lookup:: ";
    const commander = new com.Command();
    const defaultInputDirectory = 'lookup';
    const defaultSuffix = '.defs'

    let inputDirectory: string = '';
    let outputDirectory: string = '';
    let format: string = 'md';
    let files: (string | undefined)[];

    function buildWordlist(f: string): Lol {
        let wordlist = new Lol();
        wordlist.start = Date.now().valueOf();
        let lines: string[] = [];
        if (f.startsWith('ARGS~~')){
            lines = f.slice(f.lastIndexOf('ARGS~~')).split(',');
            wordlist.name= 'args-' + Date.now().toString() + defaultSuffix;
            Log.to.info(FN+ 'Wordlist - comandline: ', f);
        } else {
            let fnparts = getFilenameParts(f);
            wordlist.name = fnparts[FilenameParts.Name] + defaultSuffix;
            lines = readFileAsArray(f);
            Log.to.info(FN + 'Wordlist - file: ', f);
        }


        wordlist.source = f;
        wordlist.path = outputDirectory;
        wordlist.ext = '.' + format;
        Log.to.info(FN + 'Wordlist - name: ', wordlist.name);
        Log.to.info(FN + 'Wordlist - path: ', wordlist.path);
        Log.to.info(FN + 'Wordlist - ext: ', wordlist.ext);
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
                        Log.to.info(FN + 'Date is ' + d);
                    } else { // class name
                        wordlist.class = line;
                        Log.to.info(FN + 'Class is ' + line);
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
                // /([A-Z]+[A-Z_ -]*[A-Z]+)/i   will match one or more words separated by spaces, underscores or hyphens
                const m = line.match(/([A-Z]+[A-Z_ -]*[A-Z]+)/i);
                if (isNull(m))
                    wp.text = line.trim();
                else
                    wp.text = m[0].toString();
                wordlist.list.push(wp);
                Log.to.info(FN + 'Word added: ' + wp.text);
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

    function InitializeCommander() {
        commander
            .version("lookup version " + module.exports.version)

            .option('-l, --list-format', 'Shows information on the expected list format for input files.')

            .option('-o, --output <dir>',
                'A directory where the files containing the definitions will be written to, default is to write to the directory the input file came from.',
                (val, def) => { 
                    outputDirectory = ensurePathIsWriteable(val);
                    Log.to.info(FN + 'Output to ' + outputDirectory);
                })

            .option('-m, --markdown',
                'Output is formatted as markdown (default)',
                () => { format = 'md'})
            
            .option('-H, --html',
                'Output is formatted as HTML',
                () => { format = 'html'})

            .option('-t, --txt',
                'Output is formatted as plain text',
                () => { format = 'txt'})

            .option('-j, --json',
                'Output is formatted as JSON',
                () => { format = 'json'})

            .option('-v, --verbose', 'Show debugging information')

            .command('', 'Look up the definitions of words, using an online dictionary, ' +
                'you may specify a file of words, a directory of such files, or a word to be looked up.  ' +
                'For information regarding the file format type "lookup --list-format.')
            .arguments('<file|dir|word>')
            .action(lookup);
    }

    function lookup(arg: string, args:string[]): void {
        if (commander.listFormat)
            showListFileHelpandExit();

        if (commander.verbose) {
            Log.setVerbose(true);
        } else {
            Log.setVerbose(false);
        }

        Log.to.info(FN + 'Verbose ' + commander.verbose);

        inputDirectory = ensurePathOrFileIsReadable(arg);
        outputDirectory = ensurePathIsWriteable(commander.output);


        if (isDirectory(inputDirectory)){
            if ('' === outputDirectory) 
                outputDirectory = inputDirectory;
            files = fs.readdirSync(inputDirectory)
            .filter((f, i, entries) => {
                if ((typeof (f) !== 'undefined') && (f.endsWith('txt'))) {
                    Log.console([FN + 'File: ' + f + ' will be processed from a possible ' + entries.length.toString()]);
                    return true;
                }
            })
            .map((f, i, entries) => { return join(inputDirectory, f) });
        } else if (isAccessibleObject(inputDirectory)){
            if ('' === outputDirectory)
                outputDirectory = getFilenameParts(inputDirectory)[FilenameParts.Path];
            Log.console([FN + 'File: ' + inputDirectory + ' is the only specified file and will be processed.']);
            files = [inputDirectory];
        } else {
            if ('' === outputDirectory)
                outputDirectory = ensurePathIsWriteable(__dirname, '~/lookup/');
            files = [ 'ARGS~~' + arg ];
            Log.console([FN + 'Processing input from the command line.']);

        }

        Log.to.info(FN + 'Input: ', files);
        let output: Lol[] = [];
        files.forEach(f => {
            if (f && typeof (f) !== 'undefined' && '' !== f) {
                let wordlist = buildWordlist(f);
                Clerk.DefineWords(wordlist)
                    .catch((err) => {
                        Log.to.error(err, FN + 'Error getting definitions for file ' + f);
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
                        Log.to.error(err, FN + 'Error writing file ' + f);
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
        Log.setLogFile(join(homedir(),'lookup'), 'lookup');

        console.log (FN + 'Logfile at ' + Log.dir() + '/' + Log.filename() + '.log');
        Log.to.info('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
        let today = new Date();
        let dt = today.toLocaleDateString() + ' at ' + today.toLocaleTimeString();
        Log.to.info(FN + 'Launched on ' + dt  + '<<<<<<<<<<<<<<<<<<<<');
        Log.to.info(FN + 'Arguments: ', process.argv.join());


        let a = commander.parseOptions(process.argv);
        commander.parse(a.args);
    }

    Main();
}