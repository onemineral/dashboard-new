import { NodeFileUpload } from './generated/shared';

type AnyObject = { [key: string]: any };

// taken from https://github.com/stripe/stripe-node/blob/master/lib/utils.js#L377
export function flattenAndStringify(data: AnyObject): AnyObject {
    const result: AnyObject = {};

    const step = (obj: AnyObject, prevKey?: string) => {
        Object.keys(obj).forEach((key) => {
            const value = obj[key];

            const newKey = prevKey ? `${prevKey}[${key}]` : key;

            if (isObject(value)) {
                if (!isBuffer(value) && !isBlob(value) && !isFileObject(value) && !isNodeUpload(value)) {
                    return step(value, newKey);
                } else {
                    result[newKey] = value;
                }
            } else {
                result[newKey] = String(value);
            }
        });
    };

    step(data);

    return result;
}

export function isObject(obj: any): obj is AnyObject {
    const type = typeof obj;
    return (type === 'function' || type === 'object') && !!obj;
}

export function isBlob(obj: any): obj is Blob {
    let maybeBlob = Object.prototype.toString.call(obj) === '[object Blob]';
    if (typeof Blob !== 'undefined') {
        maybeBlob = obj instanceof Blob;
    }

    return maybeBlob;
}

export function isNodeUpload(obj: any): obj is NodeFileUpload {
    return typeof obj.stream !== 'undefined' && typeof window === 'undefined';
}

export function isBuffer(obj: any): obj is Buffer {
    let maybeBuffer = obj instanceof Uint8Array;
    if (typeof Buffer !== 'undefined') {
        maybeBuffer = Buffer.isBuffer(obj);
    }

    return maybeBuffer;
}

export function isFileObject(obj: any): boolean {
    return obj.hasOwnProperty('data') && obj.hasOwnProperty('type') && obj.type === 'application/octet-stream';
}
