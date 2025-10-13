export const config = {
  appUrl: import.meta.env.VITE_PMS_ENDPOINT ? import.meta.env.VITE_PMS_ENDPOINT : (window.location.protocol + '//' + window.location.host),
  googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  googleMapsMapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID,
  limits: {
    select: 30,
  }
};
