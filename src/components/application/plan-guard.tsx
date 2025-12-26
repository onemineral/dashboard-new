import { Children, cloneElement, isValidElement, PropsWithChildren, ReactNode, useMemo } from 'react';
import AccessControl from "@/components/application/access-control.tsx";
import {useAppContext} from "@/contexts/app-context.tsx";

export interface PlanGuardProps {
    resource: string;
    action?: string | string[];
    field?: string | string[];
    fallback: ReactNode;
}

export function PlanGuard({ children, resource, action, field, fallback }: PropsWithChildren<PlanGuardProps>) {
    const { schema, subscription } = useAppContext();
    const hasUpgradePath = Boolean(subscription?.has_upgrade_path);
    const shouldUpgrade = hasUpgradePath && !schema.can(resource, field, action) && schema.canAction('subscription', 'change-plan');

    const fallbackWithUpgradePath = useMemo(
        () =>
            Children.map(fallback, (child) => {
                if (isValidElement(child)) {
                    return cloneElement(child, {
                        shouldUpgrade: shouldUpgrade,
                    } as any);
                }
            }),
        [fallback, shouldUpgrade],
    );

    if (!shouldUpgrade) {
        return (
            <AccessControl resource={resource} field={field} action={action}>
                {children}
            </AccessControl>
        );
    }

    return <>{fallbackWithUpgradePath}</>;
}