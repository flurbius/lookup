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

This project is a WIP.  At this stage it is not yet functional and cannot be used for any purpose.  This readme is a reflection of my goals and intents for this project.  A _future doc_ if you will.  If you have any comment please file it [under issues](https://github.com/flurbius/lookup/issues/).

## Purpose

lookup is a command line utility to automate the finding and format of a small number of words and their meanings.  It is designed to help me in preparing for ESL classes where I mainly teach conversational skills and vocabulary.


## Installing

Using npm:

```bash
npm install lookup -g
```

## Input

Words to be defined are supplied in one or more text files (files that end in a txt file extension).  The default location for these files is ~/lookup/ but this location can be specified by the command line option -i or --input: 

```bash
lookup -i '/path/to/wordfile/dir' 
```
or
```bash
lookup --input '/dir'
```

## Output

Output will be written to files in the default location ~/lookup/ or wherever specified by the command line option -o or --output:

```bash
lookup -o '/path/to/outputfile/dir' 
```
or
```bash
lookup --output '/dir'
```

## Format

The Output file will be html by default but can be set to plain text or mark down by the command line option -f or --format

```bash
lookup -f <format>
```
or
```bash
lookup --format <format>
```
where \<format> is md or txt

## Definitions

If text files are found in the directory they will all be processed.  Output files will have the same name as the input file but will be given an extension of .defs.txt, .defs.md or .defs.html depending on the format.

If any line in an input file starts with a '#' it will be treated as a comment.  The '#' will be removed and any text on that line will be used to generate a subheading in the output file.  If the first or second lines of an input file are comments, lookup will try to parse them as a date or a class name (if it cannot be parsed as a date) this metadata _will_ be used as headings in the output file.  

All non-comment lines of the input file will be treated as one item each. Items should consist of one word or phrase each, which will generate a definition, duplicates will be ignored.  Each item may be preceded by a number and full stop, in which case these numbers will be used to label the items and their definitions.  If numbers are present they define the order that the items are presented in, otherwise they will be presented in alphabetical order. 

Each Item will be presented with its pronunciation, a list of the senses in which it is used with meanings, example sentences, antonyms and synonyms if available.  Any of these sections may be switched off by passing an appropriate option:

```bash
lookup --no-meanings
lookup --no-pronunciations
lookup --no-examples
lookup --no-synonyms
lookup --no-antonyms
```
![Red Dragon](https://github.com/flurbius/lookup/blob/master/red-dragon.png)