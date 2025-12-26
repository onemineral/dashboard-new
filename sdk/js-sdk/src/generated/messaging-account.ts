import { Account } from "./account";
import { MessageProvider } from "./message-provider";

export interface MessagingAccount {
    type: string;
    label: string;
    records: Array<{
            record?: Account,
            providers?: MessageProvider[]
        }>;
}
