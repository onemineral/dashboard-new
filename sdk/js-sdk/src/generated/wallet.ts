import { WalletTransaction } from './wallet-transaction';

export interface Wallet {
    wallet_id: string;
    g_balance: number;
    usd_balance: number;
    transactions: WalletTransaction[];
}
