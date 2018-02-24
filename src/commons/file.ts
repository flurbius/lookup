
import * as fs from 'fs';
import { join } from 'path';
import { Log } from './log';
import { isNullOrUndefined } from 'util';
import { parseIso,  format as dtfmt } from 'ts-date/locale/en';

const FN = 'util:: ';

export function readFileAsArray(file: string): string[] {
    return fs.readFileSync(file, { encoding: 'utf8', flag: 'r' })
        .replace(/\r\n/g, '\n')
        .split('\n');
}
export const enum FilenameParts {
    Path,
    Name,
    Extension
}
export function getFilenameParts(file: string): string[] {
    const parts = ['', '', ''];
    const rp = fs.realpathSync(file);
    parts[FilenameParts.Extension] = rp.slice(rp.lastIndexOf('.'));
    parts[FilenameParts.Name] = rp.slice(rp.lastIndexOf('/') + 1, rp.lastIndexOf('.'));
    parts[FilenameParts.Path] = rp.slice(0, rp.lastIndexOf('/'));
    return parts;
}

export function isDirectory(path: string): boolean {
    try {
        return fs.statSync(path).isDirectory();
    } catch (err) {
        Log.To.info(err, FN + 'isDirectory result is negative: ' + path);
    }
    try {
        fs.mkdirSync(path);
        return fs.statSync(path).isDirectory();
    } catch (err) {
        Log.To.info(err, FN + 'couldnt create it either ' + path);
        return false;
    }
}
export function parseDate(item: string): string | null {
    const d = parseIso(item);
    dtfmt(d, 'Do MMMM YYYY');
    if (d) {
        return d.toLocaleDateString();
    } else {
        return null;
    }
}

function isAccessibleObject(path: string): boolean {
    try {
        fs.accessSync(path);
        return true;
    } catch (err) {
        Log.To.info(err, FN + 'isAccessibleObject Rejected: ' + path);
        return false;
    }
}

function isReadablePathOrFile(path: string, defaultPath:string): string {
    if (!path) {
        path = defaultPath;
        Log.To.warn(FN + 'isReadablePathOrFile called with no parameter, using default value: ' + defaultPath);
    }
    return cannonicalPathOrFile(path);
}

function cannonicalPathOrFile(path: string): string {
    if (isAccessibleObject(path)) {
        return join(path);
    }
    if (isAccessibleObject(join('~', path))) {
        return join('~', path);
    }
    if (isAccessibleObject(join(__dirname, path))) {
        return join(__dirname, path);
    }
    Log.To.info(FN + 'cannonicalPathOrFile: Could not use supplied value ' + path + ', using ' + __dirname);
    return __dirname;
}

export function isWritablePath(path: string, defaultPath: string): string {
    if ('' === path || typeof (path) === undefined || !path) {
        path = defaultPath;
    }
    return cannonicalPath(path);
}
function cannonicalPath(path: string): string {
    // take the first match that is a directory
    if (isNullOrUndefined(path) || '' === path) {
        return __dirname;
    }
    if (isDirectory(path)) {
        return join(path);
    }
    if (isDirectory(join('~', path))) {
        return join('~', path);
    }
    if (isDirectory(join('/tmp', path))) {
        return join('/tmp', path);
    }
    Log.To.info(FN + 'cannonicalPath: Could not use supplied value ' + path + ', using ' + __dirname);
    return __dirname;
}



