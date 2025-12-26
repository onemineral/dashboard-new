import { AnyObject } from '../types';
import { ResourceProperty } from './resource';
import { buildStringField } from './fields/buildStringField';
import { buildNumberField } from './fields/buildNumberField';
import { buildTranslatedTextField } from './fields/buildTranslatedTextField';
import { buildDateRangeField } from './fields/buildDateRangeField';
import { buildGeoField } from './fields/buildGeoField';
import { buildBooleanField } from './fields/buildBooleanField';
import { buildJsonFieldType } from './fields/buildJsonType';
import { buildComposedFieldType } from './fields/buildComposedFieldType';
import { buildPicklistType } from './fields/buildPicklistType';
import { buildSingleRelationshipType } from './fields/buildSingleRelationshipType';
import { buildMultipleRelationshipType } from './fields/buildMultipleRelationshipType';
import { buildMorphToType } from './fields/buildMorphToType';
import { buildListOfType } from './fields/buildListOfType';
import { buildFileField } from './fields/buildFileField';

export function parseFields(fields: AnyObject): ResourceProperty[] {
    return Object.values(fields).map((f) => {
        return parseField(f);
    });
}

export function parseField(field: AnyObject): ResourceProperty {
    const { type, is_required = false, is_nullable = true } = field;
    const options = {
        optional: !is_required,
        nullable: is_nullable,
    };

    switch (type) {
        case 'text':
        case 'datetime':
        case 'date':
        case 'color':
        case 'url':
        case 'email':
        case 'password':
        case 'svg':
        case 'secret':
            return buildStringField(field, options);
        case 'id':
        case 'integer':
        case 'decimal':
        case 'percent':
        case 'price':
            return buildNumberField(field, options);
        case 'translated-text':
            return buildTranslatedTextField(field, options);
        case 'daterange':
            return buildDateRangeField(field, options);
        case 'geo':
            return buildGeoField(field, options);
        case 'boolean':
            return buildBooleanField(field, options);
        case 'json':
            return buildJsonFieldType(field, options);
        case 'composed':
            return buildComposedFieldType(field, parseField, {
                optional: !is_required,
            });
        case 'picklist':
            return buildPicklistType(field, options);
        case 'has-one':
        case 'belongs-to':
            return buildSingleRelationshipType(field, {
                optional: !is_required,
            });
        case 'has-many':
        case 'belongs-to-many':
        case 'ancestors':
            return buildMultipleRelationshipType(field, {
                optional: !is_required,
            });
        case 'morph-to':
            return buildMorphToType(field, options);
        case 'list-of':
            return buildListOfType(field, parseField, {
                optional: !is_required,
            });
        case 'file':
            return buildFileField(field, options);
        default:
            console.warn(
                `Type ${type} cannot be parsed. Defaulting to 'string' type`
            );
            return buildStringField(field, options);
    }
}
