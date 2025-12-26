import React, {Children, ReactNode} from 'react';
import {useAppContext} from "@/contexts/app-context.tsx";

export interface AccessControlProps {
    any?: AccessControlItem[];
    all?: AccessControlItem[];
    resource?: string;
    action?: string | string[];
    field?: string | string[];
    children: ReactNode;
}

export interface AccessControlItem {
    resource: string;
    action?: string;
    field?: string | string[];
}


const AccessControl = ({ any = [], all = [], resource, action, field, children, ...rest }: AccessControlProps) => {
    const { schema } = useAppContext();
    let hasAnyAccess = true;
    let hasAllAccess = true;
    const hasResourceAccess = resource ? schema.can(resource, field, action) : true;

    if (any.length > 0) {
        hasAnyAccess = false;
        any.forEach((item) => {
            hasAnyAccess = hasAnyAccess || schema.can(item.resource, item.field, item.action);
        });
    }

    if (all.length > 0) {
        all.forEach((item) => {
            hasAllAccess = hasAllAccess && schema.can(item.resource, item.field, item.action);
        });
    }

    return hasAllAccess && hasAnyAccess && hasResourceAccess ? (
        <>
            {Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, {
                        ...rest,
                    } as any);
                }
            })}
        </>
    ) : null;
};

export default AccessControl;
