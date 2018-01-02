# Lookup v0.1.0
_Lookup a list of words in the OED and output the senses,meanings,synonyms and other data in trhe requested format_

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

If word files are found in the directory they will all be processed output files will have the same name as the input file prefixed with out- and with an extension reflecting its format.

If the first or second line of the file starts with a # it will be treated as a date (if it can be) or a class name (if it cannot be parsed as a date) this metadata will be used in the output file.  The remaining lines ofr the wordfile should have one word or phrase per line which will be the item that will be defined.  the word may be preceded by a number and full stop, in which case these numbers will be used to label the words and will define the order that they are presented in, otherwise they will be presented in alphabetical order. 

Each Item will be presented with its pronunciation, a list of the senses in which it is used with meanings example sentences, antonyms and synonyms if available.