
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
             link: 'Audio File: [{LINK}]({LINK})',
         category: '#### {#.#} {CATEGORY}',
         catend: '',
          heading: '  * {HEADING}',
          footing: '',
          oneItem: '   - {ITEM}',
         tableTop: '',
         tableRow: '   - {ITEM1},{ITEM2},{ITEM3},{ITEM4},{ITEM5},{ITEM6},{ITEM7},{ITEM8}',
      tableBottom: ''
}
export const html: formatStrings = {
  title: '<h1>{TITLE}</h1>',
section: '<h2>{SECTION}</h2>',
divider1: '<hr />',
divider2: '<hr />',
   word: '<h3>{#}. {WORD}</h3>',
 italic: '<br /><i>{TEXT}</i>',
   bold: '<br /><b>{TEXT}</b>',
 origin: '<br /><i>Origin: {ORIGIN}</i>',
pronunciation: '<br /><b>Pronunciation (IPA): {PRONUNCIATION}</b>',
   link: '<br />Audio File: <a href="{LINK}">{LINK}</a>',
category: '<h5> {#.#} {CATEGORY}</h5><ol>',
catend: '</ol>',
heading: '<li>{HEADING}</li><ul>',
footing: '</ul>',
oneItem: '<li>{ITEM}</li>',
tableTop: '<table>',
tableRow: '<tr><td>{ITEM1}</td><td>{ITEM2}</td><td>{ITEM3}</td><td>{ITEM4}</td><td>{ITEM5}</td><td>{ITEM6}</td><td>{ITEM7}</td><td>{ITEM8}</td></tr>',
tableBottom: '</table>'
}
