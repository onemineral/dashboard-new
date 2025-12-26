export interface CustomerPayment {
    id: string;
    payment_method_id: string;
    amount: number;
    description: string;
    client_secret: string;
    last_payment_error?: {
        charge_id: string;
        message: string;
        error_code: string;
        decline_code: string;
        type: string;
    };
    next_step_url?: string | null;
}
