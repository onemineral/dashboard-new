import { AnyObject } from '../../types';
import { FileResourceProperty, PropertyOptions } from '../resource';
import { schemaUtils } from '../schema-utils';

export function buildFileField(
    field: AnyObject,
    options?: PropertyOptions
): FileResourceProperty {
    const { name, description } = field;

    return {
        kind: 'file',
        name: schemaUtils.fieldToMemberName(name),
        description,
        type: 'string | Blob | Buffer | NodeFileUpload',
        options,
    };
}
