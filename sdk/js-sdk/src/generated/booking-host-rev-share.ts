import { TaxClass } from './tax-class';
import { CalculatedTax } from './calculated-tax';

export interface BookingHostRevShare {
    tax_class?: TaxClass;
    type?: 'revenue_share' | 'commission';
    service_fee_amount?: number;
    host_percent?: number;
    apply_on?: 'accommodation' | 'subtotal' | 'total';
    apply_with_tax?: boolean;
    exclude_ta_commission?: boolean;
    total_pretax?: number;
    taxes?: CalculatedTax[];
}
