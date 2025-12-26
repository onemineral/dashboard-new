import { AnyObject } from './types';

export class OMError extends Error {
    public readonly raw: AnyObject;
    public readonly statusCode: number;
    public readonly headers: { [key: string]: string };

    public constructor(raw: AnyObject = {}) {
        super(raw.message);

        this.raw = raw;
        this.statusCode = raw.statusCode;
        this.headers = raw.headers;
    }
}

export class OMValidationError extends OMError {}

export class OMAuthenticationError extends OMError {}

// TODO(bunea): Construct more refined errors (e.g. booking errors)
