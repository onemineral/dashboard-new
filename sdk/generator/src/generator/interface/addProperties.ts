import { InterfaceDeclaration } from 'ts-morph';
import { ResourceProperty } from '../../schema/resource';
import { addComposed } from './addComposed';
import { addListOf } from './addListOf';
import { addSimple } from './addSimple';
import { addMorphTo } from './addMorphTo';

export function addPropertiesToInterface(
    inter: InterfaceDeclaration,
    properties: ResourceProperty[]
) {
    properties.forEach((p) => {
        if (p.kind === 'composed') {
            addComposed(inter, p);
        } else if (p.kind === 'list-of') {
            addListOf(inter, p);
        } else if (p.kind === 'morph-to') {
            addMorphTo(inter, p);
        } else {
            addSimple(inter, p);
        }
    });
}
