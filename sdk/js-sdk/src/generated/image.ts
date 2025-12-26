import { TranslatedText } from "./shared";

export interface Image {
    id: number;
    description?: TranslatedText | null;
    tags?: Array<"Activities" | "Animals" | "BBQ facilities" | "Balcony/Terrace" | "Bathroom" | "Beach" | "Bedroom" | "Breakfast" | "Canoeing" | "Children playground" | "City view" | "Cycling" | "Dining area" | "Diving" | "Entertainment" | "Facade/entrance" | "Featured" | "Fitness centre/facilities" | "Floor plan" | "Food and drinks" | "Garden" | "Garden view" | "Golfcourse" | "Hiking" | "Hot Tub" | "Kids's club" | "Kitchen or kitchenette" | "Lake view" | "Landmark view" | "Living room" | "Lobby or reception" | "Lounge or bar" | "Massage" | "Mountain view" | "Nearby landmark" | "Neighbourhood" | "Parking" | "Patio" | "Pool view" | "Property building" | "Restaurant/places to eat" | "River view" | "Sauna" | "Sea view" | "Shower" | "Skiing" | "Snorkeling" | "Spa and wellness centre/facilities" | "Sports" | "Street view" | "Swimming pool" | "Table tennis" | "Tennis court" | "Toilet" | "Windsurfing">;
    order: number;
    width: number;
    height: number;
    file_name: string;
    thumbnail: string;
    medium: string;
    large: string;
    original?: string;
    created_at: string;
    updated_at: string;
}
