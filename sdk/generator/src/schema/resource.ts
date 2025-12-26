export interface Resource {
    name: string;
    interfaceName: string;
    properties: ResourceProperty[];
    actions: ResourceAction[];
}

export type ResourceProperty =
    | SimpleResourceProperty
    | FileResourceProperty
    | ComposedResourceProperty
    | JsonResourceProperty
    | RelationResourceProperty
    | MorphToResourceProperty
    | PicklistResourceProperty
    | StatusResourceProperty
    | ListOfResourceProperty;

export interface PropertyOptions {
    optional?: boolean;
    nullable?: boolean;
}

export interface SimpleResourceProperty {
    kind: 'simple';
    name: string;
    description: string;
    type: string;
    options?: PropertyOptions;
}

export interface FileResourceProperty {
    kind: 'file';
    name: string;
    description: string;
    type: string;
    options?: PropertyOptions;
}

export interface ComposedResourceProperty {
    kind: 'composed';
    name: string;
    description: string;
    type: ResourceProperty[];
    options?: PropertyOptions;
}

export interface JsonResourceProperty {
    kind: 'json';
    name: string;
    description: string;
    type: string;
    options?: PropertyOptions;
}

export interface RelationResourceProperty {
    kind: 'relation';
    relationKind: 'single' | 'many';
    name: string;
    description: string;
    relatedType: string;
    type: string;
    options?: PropertyOptions;
}

export interface MorphToResourceProperty {
    kind: 'morph-to';
    name: string;
    description: string;
    relatedTypes: string[];
    type: any;
    options?: PropertyOptions;
}

export interface PicklistResourceProperty {
    kind: 'picklist';
    name: string;
    description: string;
    type: string;
    options?: PropertyOptions;
}

export interface StatusResourceProperty {
    kind: 'status';
    name: string;
    description: string;
    type: string;
    options?: PropertyOptions;
}

export interface ListOfResourceProperty {
    kind: 'list-of';
    name: string;
    description: string;
    itemType:
        | string
        | string[]
        | ResourceProperty[]
        | ListOfResourceProperty
        | MorphToResourceProperty;
    type: string;
    options?: PropertyOptions;
}

export type ResourceAction =
    | QueryResourceAction
    | FetchResourceAction
    | CreateResourceAction
    | UpdateResourceAction
    | DeleteResourceAction
    | CustomResourceAction;

export interface QueryResourceAction {
    kind: 'query';
    name: string;
    description: string;
    args: ResourceProperty[];
    responseKind: string;
    responseType: string;
}

export interface FetchResourceAction {
    kind: 'fetch';
    name: string;
    description: string;
    args: ResourceProperty[];
    responseKind: string;
    responseType: string;
}

export interface CreateResourceAction {
    kind: 'create';
    name: string;
    description: string;
    args: ResourceProperty[];
    responseKind: string;
    responseType: string;
}

export interface UpdateResourceAction {
    kind: 'update';
    name: string;
    description: string;
    args: ResourceProperty[];
    responseKind: string;
    responseType: string;
}

export interface DeleteResourceAction {
    kind: 'delete';
    name: string;
    description: string;
    args: ResourceProperty[];
    responseKind: string;
    responseType: string;
}

export interface CustomResourceAction {
    kind: 'custom';
    name: string;
    description: string;
    args: ResourceProperty[];
    responseKind: string;
    responseType: string;
}
