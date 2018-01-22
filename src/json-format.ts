// converted to a typescript compatible file from 
// https://github.com/johan/format-json
export default (function () {
    function json(o: any) { return JSON.stringify(o); }
    var n: any
        , leadOp = '\n$2$1 '
        , tailOp = /\ ?([,\{\[])\n ( *)(?: )/gm // make trailing ,{[ become leading
        , cuddle = /(^|[,\{\[] ?)\n */gm // cuddle brackets, braces and array items
        , format = {
                terse: json
                , plain: function (o: any, i?: number) { 
                    return JSON.stringify(o, n, i == n ? 2 : i); 
                }
                , diffy: function (o: any) {
                    return format.plain(o).replace(tailOp, leadOp).replace(cuddle, '$1');
                }
                , space: function (o: any) {
                    return JSON.stringify(o, null, 1).replace(/\n */g, ' ');
                }
                , lines: function (o: any) {
                    if ('object' !== typeof o || o == null) 
                        return format.terse(o);
                    if ('[object Array]' === Object.prototype.toString.call(o))
                        return '[ ' + o.map(format.space).join('\n, ') + '\n]';
                    var res = '', sep = '{ ', key;
                    for (key in o) {
                        res += sep + json(key) + ': ' + format.space(o[key]);
                        sep = '\n, ';
                    }
                    return res + '\n}';
                }
            }
        ;
    return format;
})();
