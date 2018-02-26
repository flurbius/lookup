
export interface formatStrings {
  document: string;
  title: string;
  section: string;
  divider1: string;
  divider2: string;
  word: string;
  italic: string;
  bold: string;
  origin: string;
  pronunciation: string;
  link: string;
  category: string;
  heading: string;
  footing: string;
  catend: string;
  listitem: string;
  sublistitem: string;
}

export const text: formatStrings = {
  document:      '{DOCUMENT}',
  title:         '{TITLE}',
  section:       '{SECTION}',
  divider1:      '࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ࿖ ',
  divider2:      '⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏',
  word:          '{#}. {WORD}',
  italic:        '{TEXT}',
  bold:          '{TEXT}',
  origin:        '  Origin: {ORIGIN}',
  pronunciation: '  Pronunciation (IPA): {PRONUNCIATION}',
  link:          '  Audio File: {LINK}',
  category:      '  {#.#} {WORD} {CATEGORY}',
  catend:        '',
  heading:       '    ⮚ {HEADING}',
  footing:       '',
  listitem:       '      ⮩ {ITEM}',
  sublistitem:    '         * {ITEM}'
}

export const markdown: formatStrings = {
  document:      '{DOCUMENT}',
  title:         '# **{TITLE}**',
  section:       '# {SECTION}',
  divider1:      '- - - ',
  divider2:      '___',
  word:          '### {#}. __{WORD}__',
  italic:        '_{TEXT}_',
  bold:          '__{TEXT}__',
  origin:        '_Origin: {ORIGIN}_',
  pronunciation: '__Pronunciation (IPA): {PRONUNCIATION}__',
  link:          'Audio File: [{LINK}]({LINK})',
  category:      '#### {#.#} {WORD} {CATEGORY}',
  catend:        '',
  heading:       '* {HEADING}',
  footing:       '',
  listitem:      '  + {ITEM}',
  sublistitem:   '    - {ITEM}'
}

export const html: formatStrings = {
  document:      '<html><head></head><body>{DOCUMENT}</body></html>',
  title:         '<h1>{TITLE}</h1>',
  section:       '<h2>{SECTION}</h2>',
  divider1:      '<hr />',
  divider2:      '<hr />',
  word:          '<h3>{#}. {WORD}</h3>',
  italic:        '<br /><i>{TEXT}</i>',
  bold:          '<br /><b>{TEXT}</b>',
  origin:        '<br /><i>Origin: {ORIGIN}</i>',
  pronunciation: '<br /><b>Pronunciation (IPA): {PRONUNCIATION}</b>',
  link:          '<br />Audio File: <a href="{LINK}">{LINK}</a>',
  category:      '<h5> {#.#} {WORD} {CATEGORY}</h5><ol>',
  catend:        '</ol>',
  heading:       '<li>{HEADING}</li><ul>',
  footing:       '</ul>',
  listitem:      '<li>{ITEM}</li>',
  sublistitem:   '<li>{ITEM}</li>',
}
