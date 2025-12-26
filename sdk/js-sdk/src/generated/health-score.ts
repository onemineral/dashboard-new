import { Property } from "./property";

export interface HealthScore {
    id: number;
    resource: {
            type: 'property',
            record: Property
        };
    provider: string;
    check_id: string;
    description: string;
    level: "low" | "medium" | "high" | "critical";
    done: boolean;
    score: number;
    created_at: string;
    updated_at: string;
}
