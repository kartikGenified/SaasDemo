import { Alert, Linking, Platform } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { GoogleMapsKey } from "@env";

const handleLocationPermissionAndFetch = async (
 
) => {
  const showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text:"Settings",
          onPress: () =>
            Platform.OS === "android"
              ? Linking.openSettings()
              : Linking.openURL("app-settings:"),
        },
      ],
      { cancelable: false }
    );
  };

  const fetchLocation = async (latitude, longitude) => {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&location_type=ROOFTOP&result_type=street_address&key=${GoogleMapsKey}`;
      const response = await fetch(url);
      const json = await response.json();
      console.log("jnjkbvjbsajbhjvbashjhjbchjbasjhbcjh",json)
      if (json.status === "OK") {
        const formattedAddress = json?.results[0]?.formatted_address || "N/A";
        const addressComponents = json?.results[0]?.address_components || [];
        const locationJson = {
          lat: latitude,
          lon: longitude,
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

        return locationJson;
      } else {
        showAlert(
         "Geocoding Error",
           "Failed to fetch address."
        );
        return null;
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
      showAlert(
        "Error",
        "Unable to fetch location details."
      );
      return null;
    }
  };

  const getCurrentLocation = async () => {
    console.log("Attempting to retrieve current latitude and longitude");
  
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        async (res) => {
          console.log("getCurrentLocation success:", res);
  
          const lat = res.coords.latitude;
          const lon = res.coords.longitude;
  
          console.log(`Latitude: ${lat}, Longitude: ${lon}`);
  
          // Call fetchLocation to process latitude and longitude
          try {
            const locationData = await fetchLocation(lat, lon);
            console.log("Fetched location data:", locationData);
            resolve(locationData); // Resolve the Promise with the location data
          } catch (fetchError) {
            console.error("Error while fetching location details:", fetchError);
            Alert.alert(
              "Error",
              "An error occurred while fetching your location details."
            );
            reject(fetchError); // Reject the Promise with the error
          }
        },
        (error) => {
          console.error("getCurrentLocation error:", error);
  
          if (error.code === 1) {
            // Permission Denied
            Alert.alert(
              "Permission Denied",
              "Location permission is denied. Please enable it in settings."
            );
          } else if (error.code === 2) {
            // Position Unavailable
            console.error("Position Unavailable:", error.message);
            getLocationPermission(); // Retry permission
          } else {
            // Other errors
            Alert.alert(
              "Error",
              "An unexpected error occurred while fetching your location.",
              [{ text: "OK", onPress: () => console.log("OK Pressed") }]
            );
          }
          reject(error); // Reject the Promise with the error
        },
        {
          enableHighAccuracy: true,
        }
      );
    });
  };
  
  

  const checkAndFetchLocation = async () => {
    if (Platform.OS === "ios") {
      showAlert(
        "GPS Disabled",
        
          "Please enable GPS/Location to use this feature."
      );
      return null;
    } else if (Platform.OS === "android") {
      try {
        const result = await LocationServicesDialogBox.checkLocationServicesIsEnabled({
          message:
            "<h2 style='color: #0af13e'>Enable Location</h2>We need access to your location for better services.",
          ok: "YES",
          cancel: "NO",
          enableHighAccuracy: true,
          showDialog: true,
          openLocationServices: true,
          preventOutSideTouch: false,
          preventBackClick: true,
          providerListener: false,
        });
        console.log("checking location access dialog box",result)
        if (result.status === "enabled") {
          console.log("location is enabled now you can use")
          return new Promise((resolve,reject)=>{
            getCurrentLocation().then((res)=>{
              console.log("getCurrent location resolved location to",res)
              resolve(res)
            }).catch((e)=>{ 

              console.log("Error in resolving promise",e)
              reject(e)
            })
          })
          
          // console.log("getCurrent location resolved location to", await getCurrentLocation())
          // await getCurrentLocation().then((res)=>{
          // return res;
          // }).catch((e)=>{console.log("Error in getting current location",e)})
        } else {
          console.error("Location services not enabled.");
          return null;
        }
      } catch (error) {
        console.error("Location Services Error:", error);
        return null;
      }
    }
  };

  return await checkAndFetchLocation();
};

export default handleLocationPermissionAndFetch;
