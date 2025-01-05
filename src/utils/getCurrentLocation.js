import Geolocation from "@react-native-community/geolocation";
import { GoogleMapsKey } from "@env";

export const getCurrentLocation = async () => {
  try {
    const location = await new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
    });

    const { latitude: lat, longitude: lon } = location.coords;
    console.log("Latitude:", lat, "Longitude:", lon);

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${GoogleMapsKey}`;

    const response = await fetch(url);
    const json = await response.json();

    if (json.results.length === 0) {
      throw new Error("No address found for the given coordinates.");
    }

    const formattedAddress = json.results[0].formatted_address || "N/A";
    const addressComponents = json.results[0].address_components || [];

    let locationJson = {
      lat,
      lon,
      address: formattedAddress,
    };

    addressComponents.forEach((component) => {
      if (component.types.includes("postal_code")) {
        locationJson.postcode = component.long_name;
      } else if (component.types.includes("country")) {
        locationJson.country = component.long_name;
      } else if (component.types.includes("administrative_area_level_1")) {
        locationJson.state = component.long_name;
      } else if (component.types.includes("administrative_area_level_3")) {
        locationJson.district = component.long_name;
      } else if (component.types.includes("locality")) {
        locationJson.city = component.long_name;
      }
    });

    console.log("Location Details:", locationJson);
    return locationJson;
  } catch (error) {
    console.error("Error getting location or address:", error);
    return {
      lat: "N/A",
      lon: "N/A",
      address: "N/A",
      postcode: "N/A",
      country: "N/A",
      state: "N/A",
      district: "N/A",
      city: "N/A",
    };
  }
};
