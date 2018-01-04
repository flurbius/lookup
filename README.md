# Lookup
_Lookup a list of words in the OED and output the senses,meanings,synonyms and other data in the requested format_

### Version 0.1.0

This project is a WIP.  At this stage it is not yet functional and cannot be used for any purpose.  This readme is a reflection of my goals and intents for this project.  A _future doc_ if you will.  If you have any comment please file it [under issues](https://github.com/flurbius/lookup/issues/).

## Purpose

lookup is a command line utility to automate the finding and format of a small number of words and their meanings.  It is designed to help me in preparing for ESL classes wwhere I mainly teach conversational skills and vocabulaary.

## Input

Words may be supplied on the command line or supplied in one or more text files.  The default location for these files is ~/lookup/ but this location can be specified in the config file ~/.lookup or by a command line option: 

-i '/path/to/wordfile/dir' or 
--input '/dir'

## Output

Output will be written to files in the default location ~/lookup/ or wherever specified by the config file ~/.lookup or by a command line option:

-o '/path/to/outputfile/dir' or 
--output '/dir'

## Format

The Output file will be html by default but can be set to plain text or mark down by the options

-f md    or
--format txt

## Definitions

If word files are found in the directory they will all be processed.  Output files will have the same name as the input file prefixed with out- and with an extension reflecting its format.

If any line in an input file starts with a '#' it will be treated as a comment and will not generaate an item in the output file.  If the first or second line of an input file will be parsed as a date or a class name (if it cannot be parsed as a date) this metadata _will_ be used in the output file.  The remaining lines of the input file should have one word or phrase each, which will generate a definition, duplicates will be ignored.  Each item may be preceded by a number and full stop, in which case these numbers will be used to label the items and their definitions.  If numbers are present they define the order that the items are presented in, otherwise they will be presented in alphabetical order. 

Each Item will be presented with its pronunciation, a list of the senses in which it is used with meanings, example sentences, antonyms and synonyms if available.  Any of these sections may be switched off by passing an appropriate option:

  --no-meanings
  --no-pronunciations
  --no-examples
  --no-synonyms
  --no-antonyms