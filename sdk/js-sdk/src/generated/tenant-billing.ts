import { Country } from "./country";

export interface TenantBilling {
    id: number;
    type?: "company" | "individual";
    company_name?: string | null;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_number?: string | null;
    address?: string;
    postcode?: string;
    city?: string;
    state?: string | null;
    country?: Country;
    currency?: "EUR" | "RON" | "USD";
    tax_id?: string | null;
    tax_id_valid?: boolean;
    created_at: string;
    updated_at: string;
}
