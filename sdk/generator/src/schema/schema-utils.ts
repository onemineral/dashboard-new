import { camelCase, snakeCase } from 'lodash';

export const schemaUtils = {
    resourceToInterfaceName(resource: string) {
        return capitalizeFirst(camelCase(resource));
    },

    actionToName(action: string) {
        return action;
    },

    fieldToMemberName(field: string) {
        return snakeCase(field);
    },
};

function capitalizeFirst(s: string) {
    return s[0].toUpperCase() + s.slice(1);
}
