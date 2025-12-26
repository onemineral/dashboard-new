import { Property } from "./property";
import { LosTemplate } from "./los-template";
import { DateRange } from "./shared";
import { PropertyOccupancyRate } from "./property-occupancy-rate";

export interface PropertyOccupancySeason {
    id: number;
    property: Property;
    los_template?: LosTemplate;
    name?: string | null;
    daterange: DateRange;
    notes?: string | null;
    min_stay: number;
    is_incremental: boolean;
    occupancy_rates: PropertyOccupancyRate[];
    created_at: string;
    updated_at: string;
}
