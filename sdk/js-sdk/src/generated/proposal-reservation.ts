import { ExperienceLike } from './experience-like';
import { Image } from './image';
import { Geo } from './shared';

export interface ProposalReservation {
    id: string;
    title: string;
    description: string;
    arrival_date: string;
    departure_date: string;
    record_type: string;
    type: string;
    status: string;
    order: string;
    location: string;
    location_details: string;
    guests_override: string;
    listing_url: string;
    comfortable_occupancy?: string | null;
    max_occupancy?: string | null;
    bedrooms?: string | null;
    bathrooms?: string | null;
    price: string;
    likes: ExperienceLike[];
    dislikes: ExperienceLike[];
    images: Image[];
    geo: Geo;
}
