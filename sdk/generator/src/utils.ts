import { AnyObject } from './types';

export function isObject(o: any): o is AnyObject {
    const isArray = Array.isArray(o);
    return typeof o === 'object' && !isArray;
}
