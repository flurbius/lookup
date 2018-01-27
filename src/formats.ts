
export interface formatStrings {
    title: string;
    section: string;
    divider1: string;
    divider2: string;
    word: string;
    origin: string;
    pronunciation: string;
    link: string;
    category: string;
    heading: string;
    oneItem: string;
    tableTop: string;
    tableRow: string;
    tableBottom: string;
}

export const text: formatStrings = {
            title: '{TITLE}',
          section: '{SECTION}',
         divider1: '࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖࿖',
         divider2: '⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏⅏',
             word: '{#}. {WORD}',
           origin: '  Origin: {ORIGIN}',
    pronunciation: '  International Phonetic Alphabet: {PRONUNCIATION}',
             link: '  Audio File: {LINK}',
         category: '  {#.#} {CATEGORY}',
          heading: '    ⮚ {HEADING}',
          oneItem: '      ⮩ {ITEM}',
         tableTop: '      ╔═════════════╦═════════════╦═════════════╦═════════════╦═════════════╦═════════════╦═════════════╦═════════════╗',
         tableRow: '      ║{ITEM1}║{ITEM2}║{ITEM3}║{ITEM4}║{ITEM5}║{ITEM6}║{ITEM7}║{ITEM8}║',
      tableBottom: '      ╚═════════════╩═════════════╩═════════════╩═════════════╩═════════════╩═════════════╩═════════════╩═════════════╝',
}

export const markdown: formatStrings = {
            title: '# **{TITLE}**',
          section: '# {SECTION}',
         divider1: '---',
         divider2: '___',
             word: '### {#}. {WORD}',
           origin: '_Origin: {ORIGIN}_',
    pronunciation: '**Pronunciation (IPA): {PRONUNCIATION}**',
             link: '[Audio File]({LINK})',
         category: '#### {#.#} {CATEGORY}',
          heading: '  * {HEADING}',
          oneItem: '   - {ITEM}',
         tableTop: '',
         tableRow: '   - {ITEM1},{ITEM2},{ITEM3},{ITEM4},{ITEM5},{ITEM6},{ITEM7},{ITEM8}',
      tableBottom: ''
}
