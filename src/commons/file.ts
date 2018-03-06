
import * as fs from 'fs';
import { join, resolve } from 'path';
import { Log } from './log';
import { isNullOrUndefined } from 'util';
import { parseIso,  format as formatDate } from 'ts-date/locale/en';
import { homedir } from 'os';

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
        Log.to.info(err, FN + 'isDirectory result is negative: ' + path);
    }
    try {
        fs.mkdirSync(path);
        return fs.statSync(path).isDirectory();
    } catch (err) {
        Log.to.info(err, FN + 'couldnt create it either ' + path);
        return false;
    }
}
export function parseDate(item: string): string | null {
    const d = parseIso(item);
    formatDate(d, 'Do MMMM YYYY');
    if (d) {
        return d.toLocaleDateString();
    } else {
        return null;
    }
}

export function isAccessibleObject(path: string): boolean {
    try {
        fs.accessSync(path);
        return true;
    } catch (err) {
        Log.to.info(err, FN + 'isAccessibleObject Rejected: ' + path);
        return false;
    }
}

export function ensurePathOrFileIsReadable(path: string, defaultPath:string = ''): string {
    if (!path) {
        path = defaultPath;
        Log.to.warn(FN + 'ensurePathOrFileIsReadable called with no parameter, using default value: ' + defaultPath);
    }
    let result = cannonicalPathOrFile(path);
    if ('' === result && '' !== defaultPath)
        return cannonicalPathOrFile(defaultPath);
    else
        return result;
}

export function cannonicalPathOrFile(path: string): string {
    if (isAccessibleObject(resolve(path))) {
        return resolve(path);
    }
    const it = resolve (__dirname, homedir(), path);
    if (isAccessibleObject(it))
        return it;
    Log.to.info(FN + 'cannonicalPathOrFile: Could not use supplied value ' + path);
    return '';
}

export function ensurePathIsWriteable(path: string, defaultPath: string = ''): string {
    if ('' === path || typeof (path) === undefined || !path) {
        path = defaultPath;
    }
    let result = cannonicalPath(path);
    if ('' === result && '' !== defaultPath)
        return cannonicalPath(defaultPath);
    else if (isAccessibleObject(result))
        return result;
    else
        return '';
}
export function cannonicalPath(path: string): string {
    // take the first match that is a directory
    if (isNullOrUndefined(path) || '' === path) {
        return '';
    }
    const it = resolve('/tmp', homedir(), path);
    if (isDirectory(it))
        return it;
    Log.to.info(FN + 'cannonicalPath: Could not use supplied value ' + path);
    return '';
}



