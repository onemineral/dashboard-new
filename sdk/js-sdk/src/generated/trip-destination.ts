export interface TripDestination {
    name?: string;
    airports_and_codes?: string;
    best_mode_of_transportation?: string;
    country_dialing_code?: string;
    spoken_languages?: string;
    currency_exchange?: string;
    currency?: string;
    customs_and_immigration?: string;
    driving_regulations?: string;
    etiquette?: string;
    emergency?: {
        police?: string;
        fire?: string;
        medical?: string;
    };
    geographic_description?: string;
    geo?: {
        latitude?: string;
        longitude?: string;
    };
    hygiene?: string;
    transport_description?: string;
    instructions?: string;
    language_essentials?: string;
    required_immunizations?: string;
    required_visas?: string;
    tipping?: string;
    insiders_description?: string;
    image?: string;
}
