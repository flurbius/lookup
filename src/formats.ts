
export interface formatStrings {
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
           italic: '{TEXT}',
             bold: '{TEXT}',
           origin: '  Origin: {ORIGIN}',
    pronunciation: '  Pronunciation (IPA): {PRONUNCIATION}',
             link: '  Audio File: {LINK}',
         category: '  {#.#} {CATEGORY}',
           catend: '',
          heading: '    ⮚ {HEADING}',
          footing: '',
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
           italic: '_{TEXT}_',
             bold: '__{TEXT}__',
           origin: '_Origin: {ORIGIN}_',
    pronunciation: '__Pronunciation (IPA): {PRONUNCIATION}__',
             link: '[Audio File]({LINK})',
         category: '#### {#.#} {CATEGORY}',
         catend: '',
          heading: '  * {HEADING}',
          footing: '',
          oneItem: '   - {ITEM}',
         tableTop: '',
         tableRow: '   - {ITEM1},{ITEM2},{ITEM3},{ITEM4},{ITEM5},{ITEM6},{ITEM7},{ITEM8}',
      tableBottom: ''
}
