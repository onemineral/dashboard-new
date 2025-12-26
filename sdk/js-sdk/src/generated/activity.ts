import { User } from "./user";
import { Property } from "./property";
import { Language } from "./language";

export interface Activity {
    id: number;
    description: string;
    causer: {
            type: 'user',
            record: User
        };
    subject: {
            type: 'property' | 'user' | 'language',
            record: Property | User | Language
        };
    changes: any;
    time_elapsed: string;
    created_at: string;
    updated_at: string;
}
