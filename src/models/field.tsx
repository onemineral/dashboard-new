import { ReactNode } from 'react';
import { FilterProps } from '../components/application/filters/types';

export interface DisplayProps {
    record: any;
    path?: string;
    params?: any;
}

export interface InputProps {
    resource?: string;
    hideLabel?: boolean;
    record?: any;
    value?: any;
    onChange?: (value: any) => void;
    onChangeItem?: (item: any) => void;
    errors?: any;
    params?: any;
}

export default class Field {
    private readonly _name: string;

    private readonly _type: string;

    private readonly _label: string;

    private readonly _description: string;

    private readonly _hints: any;

    private readonly _isRequired: boolean;

    private readonly _isFilterable: boolean;

    protected readonly _errors: any;

    protected readonly _defaultValue?: any;

    protected readonly _possibleValues?: any;

    protected readonly _spec: any;

    public constructor(data: any) {
        const {
            name,
            type,
            label,
            description,
            hints,
            errors,
            isRequired,
            is_required,
            is_filterable,
            default_value,
            possible_values,
        } = data;

        this._spec = data;
        this._name = name;
        this._type = type;
        this._label = label;
        this._description = description;
        this._hints = hints;
        this._errors = errors;
        this._isRequired = isRequired || is_required;
        this._isFilterable = is_filterable;
        this._defaultValue = default_value;
        this._possibleValues = possible_values;
    }

    public get name() {
        return this._name;
    }

    public get type() {
        return this._type;
    }

    public get label() {
        return this._label;
    }

    public get defaultValue() {
        return this._defaultValue;
    }

    public get isFilterable() {
        return this._isFilterable;
    }

    public get isRequired() {
        return this._isRequired;
    }

    public get description() {
        return this._description;
    }

    public get spec() {
        return this._spec;
    }

    public get hints() {
        return this._hints;
    }

    public get errors() {
        return this._errors;
    }

    public get possibleValues() {
        return this._possibleValues;
    }

}
