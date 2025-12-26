import * as React from "react";
import {Wrapper} from "@googlemaps/react-wrapper";
import {MapPin} from "lucide-react";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {config} from "@/config";
import {FormattedMessage, useIntl} from "react-intl";

// Extend Window interface for Google Maps marker library
declare global {
    interface Window {
        google: typeof google;
    }
}

/**
 * Coordinate value interface used by the component.
 * Uses 'lon' property (NOT 'lng') for consistency across the application.
 *
 * IMPORTANT: Google Maps API uses {lat, lng} format internally.
 * This component handles all conversions automatically.
 */
export interface CoordinateValue {
    lat: number;
    lon: number;
}

/**
 * Google Maps LatLngLiteral type (uses 'lng' instead of 'lon')
 */
type GoogleMapsLatLng = google.maps.LatLngLiteral;

/**
 * Convert from component format {lat, lon} to Google Maps format {lat, lng}
 * @param coords - Coordinates in component format
 * @returns Coordinates in Google Maps format
 */
const toGoogleMapsFormat = (coords: CoordinateValue): GoogleMapsLatLng => {
    return {
        lat: coords.lat,
        lng: coords.lon, // Convert lon to lng
    };
};

/**
 * Convert from Google Maps format {lat, lng} to component format {lat, lon}
 * @param coords - Coordinates in Google Maps format
 * @returns Coordinates in component format
 */
const fromGoogleMapsFormat = (coords: GoogleMapsLatLng | google.maps.LatLng): CoordinateValue => {
    return {
        lat: typeof coords.lat === 'function' ? coords.lat() : coords.lat,
        lon: typeof (coords as any).lng === 'function' ? (coords as any).lng() : (coords as GoogleMapsLatLng).lng,
    };
};

/**
 * Props for the GeoLocationInput component
 */
export interface GeoLocationInputProps {
    /** Current coordinate value (controlled) */
    value?: CoordinateValue | null;
    /** Callback when coordinates change */
    onChange?: (coordinates: CoordinateValue | null) => void;
    /** Callback on blur (for form validation) */
    onBlur?: () => void;
    /** Placeholder for autocomplete input */
    placeholder?: string;
    /** Disable the input */
    disabled?: boolean;
    /** Show error state */
    error?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Map height in pixels */
    mapHeight?: number;
    /** Default zoom level */
    defaultZoom?: number;
    /** Test ID for testing */
    "data-testid"?: string;
}

/**
 * Map component that handles the Google Maps instance
 * Accepts coordinates in component format {lat, lon} and converts to Google Maps format internally
 */
interface MapComponentProps {
    center: CoordinateValue;
    zoom: number;
    onMarkerDrag: (coordinates: CoordinateValue) => void;
    disabled?: boolean;
    height: number;
}

const MapComponent = React.memo<MapComponentProps>(
    ({center, zoom, onMarkerDrag, disabled, height}) => {
        // Convert component format to Google Maps format for use with Google Maps APIs
        const googleMapsCenter = React.useMemo(() => toGoogleMapsFormat(center), [center]);
        const mapRef = React.useRef<HTMLDivElement>(null);
        const [map, setMap] = React.useState<google.maps.Map | null>(null);
        const [marker, setMarker] = React.useState<google.maps.marker.AdvancedMarkerElement | null>(null);

        // Initialize map
        React.useEffect(() => {
            if (!mapRef.current || map) return;

            const newMap = new google.maps.Map(mapRef.current, {
                center: googleMapsCenter,
                zoom,
                mapId: config.googleMapsMapId || "9b1d511d7f44195729ca6380",
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: true,
                gestureHandling: "cooperative",
            });

            setMap(newMap);
        }, [center, zoom, map, googleMapsCenter]);

        // Create/update marker
        React.useEffect(() => {
            if (!map) return;

            if (!marker) {
                const newMarker = new google.maps.marker.AdvancedMarkerElement({
                    position: googleMapsCenter,
                    map,
                    gmpDraggable: !disabled,
                    title: "Property Location",
                });

                // Handle marker drag - convert from Google Maps format to component format
                newMarker.addListener("dragend", () => {
                    const position = newMarker.position;
                    if (position) {
                        // Convert from Google Maps {lat, lng} to component {lat, lon}
                        const coords = fromGoogleMapsFormat(position as google.maps.LatLng);
                        onMarkerDrag(coords);
                    }
                });

                setMarker(newMarker);
            } else {
                marker.position = googleMapsCenter;
                marker.gmpDraggable = !disabled;
            }
        }, [map, marker, googleMapsCenter, disabled, onMarkerDrag]);

        // Update map center when coordinates change
        React.useEffect(() => {
            if (map) {
                map.setCenter(googleMapsCenter);
            }
        }, [map, googleMapsCenter]);

        // Update map zoom when it changes
        React.useEffect(() => {
            if (map) {
                map.setZoom(zoom);
            }
        }, [map, zoom]);

        return (
            <div
                ref={mapRef}
                className="w-full rounded-md overflow-hidden border border-input"
                style={{height: `${height}px`}}
            />
        );
    }
);

MapComponent.displayName = "MapComponent";

/**
 * Autocomplete input component
 */
interface AutocompleteInputProps {
    value: string;
    onChange: (value: string) => void;
    onPlaceSelect: (coordinates: CoordinateValue) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
}

const AutocompleteInput = React.memo<AutocompleteInputProps>(
    ({value, onChange, onPlaceSelect, placeholder, disabled, error}) => {
        const intl = useIntl();
        const inputRef = React.useRef<HTMLInputElement>(null);
        const autocompleteRef = React.useRef<google.maps.places.Autocomplete | null>(null);
        const [hasPlacesError, setHasPlacesError] = React.useState(false);

        // Initialize autocomplete
        React.useEffect(() => {
            if (!inputRef.current || autocompleteRef.current || hasPlacesError) return;

            try {
                const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
                    fields: ["geometry", "formatted_address", "name"],
                });

                autocomplete.addListener("place_changed", () => {
                    const place = autocomplete.getPlace();
                    if (place.geometry?.location) {
                        // Convert from Google Maps format {lat, lng} to component format {lat, lon}
                        const coords = fromGoogleMapsFormat(place.geometry.location);
                        onPlaceSelect(coords);
                        onChange(place.formatted_address || place.name || "");
                    }
                });

                autocompleteRef.current = autocomplete;
            } catch (error) {
                console.error("Google Places Autocomplete initialization failed:", error);
                setHasPlacesError(true);
            }
        }, [onPlaceSelect, onChange, hasPlacesError]);

        return (
            <div className="relative w-full">
                <Input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={hasPlacesError
                        ? intl.formatMessage({
                            defaultMessage: "Click on the map to set location",
                            description: "Placeholder when Places API is not available"
                        })
                        : placeholder
                    }
                    disabled={disabled || hasPlacesError}
                    className={cn(
                        "pr-10 bg-background/95 backdrop-blur-sm shadow-lg",
                        error && "border-destructive",
                        hasPlacesError && "cursor-not-allowed"
                    )}
                    title={hasPlacesError
                        ? intl.formatMessage({
                            defaultMessage: "Places API not enabled. Please enable it in Google Cloud Console or use the map to set location.",
                            description: "Tooltip explaining Places API is disabled"
                        })
                        : undefined
                    }
                />
                <MapPin
                    className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"/>
                {hasPlacesError && (
                    <p className="text-xs text-amber-600 mt-1 bg-background/95 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                        <FormattedMessage
                            defaultMessage="Places API not enabled. Use the map to set location."
                            description="Warning message when Places API is not enabled"
                        />
                    </p>
                )}
            </div>
        );
    }
);

AutocompleteInput.displayName = "AutocompleteInput";

/**
 * Validate coordinates
 */
const isValidCoordinate = (lat: number, lon: number): boolean => {
    return (
        !isNaN(lat) &&
        !isNaN(lon) &&
        lat >= -90 &&
        lat <= 90 &&
        lon >= -180 &&
        lon <= 180
    );
};

/**
 * GeoLocationInput component
 *
 * A comprehensive geo-location input with Google Maps integration that allows users
 * to specify property coordinates through multiple synchronized methods:
 * - Autocomplete address search
 * - Interactive map with draggable marker
 * - Manual coordinate entry
 *
 * @example
 * ```tsx
 * // Basic usage
 * const [location, setLocation] = useState<CoordinateValue | null>(null);
 *
 * <GeoLocationInput
 *   value={location}
 *   onChange={setLocation}
 *   placeholder="Search for address..."
 * />
 *
 * // With React Hook Form
 * <Controller
 *   name="coordinates"
 *   control={control}
 *   rules={{ required: "Location is required" }}
 *   render={({ field, fieldState }) => (
 *     <InputWrapper
 *       label="Property Location"
 *       required
 *       error={fieldState.error?.message}
 *       description="Search for an address or drag the marker to set the exact location"
 *     >
 *       <GeoLocationInput
 *         value={field.value}
 *         onChange={field.onChange}
 *         onBlur={field.onBlur}
 *         error={!!fieldState.error}
 *       />
 *     </InputWrapper>
 *   )}
 * />
 *
 * // With custom map height
 * <GeoLocationInput
 *   value={location}
 *   onChange={setLocation}
 *   mapHeight={500}
 *   defaultZoom={15}
 * />
 * ```
 */
export const GeoLocationInput = React.memo<GeoLocationInputProps>(
    ({
         value,
         onChange,
         onBlur,
         placeholder,
         disabled = false,
         error = false,
         className,
         mapHeight = 400,
         defaultZoom = 10,
         "data-testid": dataTestId,
     }) => {
        const intl = useIntl();
        const [searchValue, setSearchValue] = React.useState("");
        const [latInput, setLatInput] = React.useState("");
        const [lonInput, setLonInput] = React.useState("");
        const [currentZoom, setCurrentZoom] = React.useState(defaultZoom);
        const [isTyping, setIsTyping] = React.useState(false);

        // Get translated placeholder
        const translatedPlaceholder = placeholder || intl.formatMessage({
            defaultMessage: "Search for address...",
            description: "Placeholder for address search input in geolocation picker"
        });

        // Default center (fallback to a neutral location)
        const defaultCenter: CoordinateValue = {lat: 0, lon: 0};
        const center = value || defaultCenter;

        // Sync input fields with value only when NOT actively typing
        React.useEffect(() => {
            if (value && !isTyping) {
                setLatInput(value.lat.toFixed(6));
                setLonInput(value.lon.toFixed(6));
            }
        }, [value, isTyping]);

        // Handle autocomplete selection - zoom in to level 16 when address selected
        const handlePlaceSelect = React.useCallback(
            (coordinates: CoordinateValue) => {
                setIsTyping(false);
                onChange?.(coordinates);
                setCurrentZoom(16);
                setTimeout(() => onBlur?.(), 0);
            },
            [onChange, onBlur]
        );

        // Handle marker drag
        const handleMarkerDrag = React.useCallback(
            (coordinates: CoordinateValue) => {
                setIsTyping(false);
                onChange?.(coordinates);
                setTimeout(() => onBlur?.(), 0);
            },
            [onChange, onBlur]
        );

        // Handle manual latitude input
        const handleLatChange = React.useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const newLat = e.target.value;
                setIsTyping(true);
                setLatInput(newLat);

                const lat = parseFloat(newLat);
                const lon = parseFloat(lonInput);

                // Only update parent value if both coordinates are valid
                if (isValidCoordinate(lat, lon)) {
                    onChange?.({lat, lon});
                }
            },
            [lonInput, onChange]
        );

        // Handle manual longitude input
        const handleLonChange = React.useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                const newLon = e.target.value;
                setIsTyping(true);
                setLonInput(newLon);

                const lat = parseFloat(latInput);
                const lon = parseFloat(newLon);

                // Only update parent value if both coordinates are valid
                if (isValidCoordinate(lat, lon)) {
                    onChange?.({lat, lon});
                }
            },
            [latInput, onChange]
        );

        // Handle blur for coordinate inputs
        const handleCoordinateBlur = React.useCallback(() => {
            setIsTyping(false);
            setTimeout(() => onBlur?.(), 0);
        }, [onBlur]);

        // Check if individual input values are valid (for showing red borders)
        const isLatInputValid = React.useMemo(() => {
            if (!latInput) return true; // Empty is not invalid, just missing
            const lat = parseFloat(latInput);
            return !isNaN(lat) && lat >= -90 && lat <= 90;
        }, [latInput]);

        const isLonInputValid = React.useMemo(() => {
            if (!lonInput) return true; // Empty is not invalid, just missing
            const lon = parseFloat(lonInput);
            return !isNaN(lon) && lon >= -180 && lon <= 180;
        }, [lonInput]);

        // Render map content
        const renderMapContent = () => {
            if (!config.googleMapsApiKey) {
                return (
                    <div className="flex items-center justify-center h-[400px] bg-muted rounded-md border border-input">
                        <div className="flex flex-col items-center gap-2 text-center px-4">
                            <MapPin className="size-6 text-muted-foreground"/>
                            <p className="text-sm text-muted-foreground">
                                <FormattedMessage
                                    defaultMessage="Google Maps API key not configured"
                                    description="Error message when Google Maps API key is missing"
                                />
                            </p>
                        </div>
                    </div>
                );
            }

            return (
                <Wrapper
                    apiKey={config.googleMapsApiKey}
                    libraries={["places", "marker"]}
                >
                    <div className="relative">
                        {/* Google Maps Display */}
                        <MapComponent
                            center={center}
                            zoom={currentZoom}
                            onMarkerDrag={handleMarkerDrag}
                            disabled={disabled}
                            height={mapHeight}
                        />
                        
                        {/* Autocomplete Search Input - Overlay on Map */}
                        <div className="absolute top-3 left-3 right-3 md:left-4 md:right-auto w-80 z-10">
                            <AutocompleteInput
                                value={searchValue}
                                onChange={setSearchValue}
                                onPlaceSelect={handlePlaceSelect}
                                placeholder={translatedPlaceholder}
                                disabled={disabled}
                                error={error}
                            />
                        </div>
                    </div>
                </Wrapper>
            );
        };

        return (
            <div className={cn("flex flex-col gap-4", className)} data-testid={dataTestId}>
                {renderMapContent()}

                {/* Manual Coordinate Inputs */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label
                            htmlFor="latitude-input"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            <FormattedMessage
                                defaultMessage="Latitude"
                                description="Label for latitude coordinate input"
                            />
                        </label>
                        <Input
                            id="latitude-input"
                            type="number"
                            step="0.000001"
                            min="-90"
                            max="90"
                            value={latInput}
                            onChange={handleLatChange}
                            onBlur={handleCoordinateBlur}
                            placeholder={intl.formatMessage({
                                defaultMessage: "e.g., 37.774929",
                                description: "Example placeholder for latitude input"
                            })}
                            disabled={disabled}
                            className={cn(
                                !isLatInputValid && "border-destructive"
                            )}
                            aria-label={intl.formatMessage({
                                defaultMessage: "Latitude coordinate",
                                description: "ARIA label for latitude input"
                            })}
                        />
                        {!isLatInputValid && (
                            <p className="text-xs text-destructive">
                                <FormattedMessage
                                    defaultMessage="Valid range: -90 to 90"
                                    description="Validation error for latitude out of range"
                                />
                            </p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label
                            htmlFor="longitude-input"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            <FormattedMessage
                                defaultMessage="Longitude"
                                description="Label for longitude coordinate input"
                            />
                        </label>
                        <Input
                            id="longitude-input"
                            type="number"
                            step="0.000001"
                            min="-180"
                            max="180"
                            value={lonInput}
                            onChange={handleLonChange}
                            onBlur={handleCoordinateBlur}
                            placeholder={intl.formatMessage({
                                defaultMessage: "e.g., -122.419415",
                                description: "Example placeholder for longitude input"
                            })}
                            disabled={disabled}
                            className={cn(
                                !isLonInputValid && "border-destructive"
                            )}
                            aria-label={intl.formatMessage({
                                defaultMessage: "Longitude coordinate",
                                description: "ARIA label for longitude input"
                            })}
                        />
                        {!isLonInputValid && (
                            <p className="text-xs text-destructive">
                                <FormattedMessage
                                    defaultMessage="Valid range: -180 to 180"
                                    description="Validation error for longitude out of range"
                                />
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }
);

GeoLocationInput.displayName = "GeoLocationInput";

/**
 * Export types for external use
 */
export type {CoordinateValue as GeoLocationCoordinateValue};