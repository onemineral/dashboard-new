import { TranslatedText } from "./shared";

export interface PropertyPolicy {
    id: number;
    booking_category: "request_to_book" | "instant_booking";
    babies_allowed: boolean;
    children_allowed: boolean;
    pets_allowed: boolean;
    smoking_allowed: boolean;
    parties_allowed: boolean;
    checkin_window: {
            from?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20" | "21" | "22" | "23" | "flexible",
            to?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20" | "21" | "22" | "23" | "flexible"
        };
    checkout_time: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20" | "21" | "22" | "23" | "flexible";
    max_booking_window: number;
    min_prior_notify: "0" | "1" | "2" | "3" | "7";
    min_children_age: number;
    min_adults_age: number;
    adults_age_from: number;
    policy_description?: TranslatedText | null;
}
