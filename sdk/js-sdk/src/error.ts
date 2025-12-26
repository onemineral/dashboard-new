import { AnyObject } from './types';
import merge from 'lodash.merge';

export class OMError extends Error {
    public readonly raw: AnyObject;
    public readonly statusCode: number;
    public readonly responseBody: any;
    public readonly headers: { [key: string]: string };

    public constructor(raw: AnyObject = {}) {
        super(raw.message);

        this.raw = raw;
        this.responseBody = raw.response?.data;
        this.statusCode = raw.statusCode;
        this.headers = raw.headers;
    }
}

export class OMValidationError extends OMError {}

export class OMAuthenticationError extends OMError {}

export function combineMultipleErrors(errors: OMError[]): OMError {
    errors.forEach((e) => {
        if (e.statusCode !== 422) {
            throw e;
        }
    });

    const rawResponses = errors.map((e) => e.raw);

    return new OMError(merge({}, ...rawResponses));
}

// TODO(bunea): Construct more refined errors (e.g. booking errors)
