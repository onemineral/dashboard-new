import { DateRange } from "./shared";

export interface ApplicableDiscount {
    daterange: DateRange;
    discounts: Array<{
            name?: string,
            percent?: number,
            amount?: number,
            type?: "discount" | "los_discount",
            los?: {
                min_stay?: number,
                percent?: number
            }
        }>;
}
