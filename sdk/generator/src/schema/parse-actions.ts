import { AnyObject } from '../types';
import { ResourceAction } from './resource';
import { buildQueryAction } from './actions/buildQueryAction';
import { buildFetchAction } from './actions/buildFetchAction';
import { buildCreateAction } from './actions/buildCreateAction';
import { buildUpdateAction } from './actions/buildUpdateAction';
import { buildDeleteAction } from './actions/buildDeleteAction';
import { buildCustomAction } from './actions/buildCustomAction';

export function parseActions(
    resourceInterface: string,
    actions: AnyObject
): ResourceAction[] {
    return Object.values(actions).map((a) => {
        return actionToType(resourceInterface, a);
    });
}

function actionToType(
    resourceInterface: string,
    action: AnyObject
): ResourceAction {
    const { name } = action;

    switch (name) {
        case 'query':
            return buildQueryAction(resourceInterface, action);
        case 'fetch':
            return buildFetchAction(resourceInterface, action);
        case 'create':
            return buildCreateAction(resourceInterface, action);
        case 'update':
            return buildUpdateAction(resourceInterface, action);
        case 'delete':
            return buildDeleteAction(resourceInterface, action);
        default:
            return buildCustomAction(resourceInterface, action);
    }
}
