import { BedType } from "./bed-type";

export interface PropertyRoomBed {
    bed_count?: number;
    group?: number | null;
    bed_type?: BedType;
}
