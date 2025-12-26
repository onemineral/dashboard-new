import { TaxClass } from './tax-class';

export interface PropertyHostRevShare {
    tax_class?: TaxClass;
    type?: 'revenue_share' | 'commission';
    service_fee_amount?: number;
    host_percent?: number;
    apply_on?: 'accommodation' | 'subtotal' | 'total';
    apply_with_tax?: boolean;
    exclude_ta_commission?: boolean;
}
