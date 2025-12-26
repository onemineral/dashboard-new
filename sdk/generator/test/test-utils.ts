import * as path from 'path';
import * as fs from 'fs';
import { AnyObject } from '../src/types';

type Fixture =
    | 'resource-with-simple-fields'
    | 'resource-with-relations'
    | 'resource-with-simple-actions'
    | 'schema';
export function readAndParseFixture(name: Fixture): AnyObject {
    return parseFixture(readFixture(name));
}

export function readFixture(name: Fixture): string {
    const fixturePath = path.resolve(__dirname, `fixtures/${name}.json`);
    return fs.readFileSync(fixturePath).toString('utf-8');
}

export function parseFixture(fixture: string): AnyObject {
    return JSON.parse(fixture);
}
