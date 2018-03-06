
# Lookup

_Lookup a list of words in the OED and output the senses,meanings,synonyms and other data in the requested format_

### Version 0.1.0

```bash
  __________           .___ ________ Ⓒ
  \______   \ ____   __| _/ \______ \____________    ____   ____   ____  
   |       _// __ \ / __ |   |    |  \_  __ \__  \  / ___\ /  _ \ /    \ 
   |    |   \  ___// /_/ |   |    `   \  | \// __ \/ /_/  >  <_> )   |  \
   |____|_  /\___  >____ |  /_______  /__|  (____  |___  / \____/|___|  /
          \/     \/     \/          \/           \/_____/             \/ 
```

## issues
If you find any problems with this software please notify the author via this link: [Lookup issues](https://github.com/flurbius/lookup/issues/).

## Purpose

lookup is a command line utility to automate the finding and formatting of lists words and their meanings.  It is designed to help teachers or students of English in preparing material for ESL classes.


## Installing

Using npm:

```bash
npm install lookup -g
```

## Input

Words to be defined are supplied via command line arguments.  You may specify a directory a file or a comma separated list of words.

examples
```bash
lookup /path/to/wordfile/directory/

lookup afile.txt

lookup a,list,of,words 

```

If a file is specified lookup will just use that file, if a directory is specified lookup will use all files in the directory that have a .txt extension.  

Each line of the input files should contain one word or phrase that will be defined in the output.  The only punctuation that lookup recognises are hyphens '-' as they appear in compund words (eg upside-down) or underscores '_' as spaces between words in a phrase (eg one_more_for_the_road).  Any line that starts with a hash '#', will be treated as a comment (ignored), except the first two lines of each file. If the first two lines are marked as comments they will be used to designate a title for the file in the form of TITLE DATE.

example
```bash
\# Bowling Words
\# 2018-03-06
pin
alley
ball
...

```

## Output

Each input file will generate one output file.  The output file will have the same name as its corresponding input file except that the extension '.txt' will be replaced  with '.defs' plus either '.json', '.txt', '.md' or '.html' depending on the format requested.  Output files will be written to the directory specified by the -o or --output command line option.  If an output location is not specified the files will be written to the folder where the input files are located.

example
```bash
lookup -o '/path/to/outputfile/dir' 
```

## Format

The Output file will be formated as html by default.  This can be changed by using one of the command line options --txt for plain text, --md for markdown or --json for JSON.

 * -j, --json
 * -m, --md
 * -t, --txt 


## Definitions

All non-comment lines of the input file(s) will be treated as one item each. Items are treated as one word or phrase, which will generate a definition in the corresponding output file.  Each Item will be presented with its etymology (origin), pronunciation in International Phonetic Alphabet (IPA), sections for each lexical category under which it maay be used (noun, verb adjective etc).  In each category there will be a list of the senses in which it is used, a list of antonyms and a list of synonyms, if available.  Also each sense will have a list of meanings  and examples for each meaning where appropriate.


![Red Dragon](https://github.com/flurbius/lookup/blob/master/red-dragon.png)