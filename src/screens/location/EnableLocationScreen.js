import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
  ScrollView,
  AppState,
} from "react-native";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useSelector, useDispatch } from "react-redux";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import Geolocation from "@react-native-community/geolocation";
import {
  setLocation,
  setLocationPermissionStatus,
  setLocationEnabled,
} from "../../../redux/slices/userLocationSlice";
import { GoogleMapsKey,locationIqApi } from "@env";
import { useIsFocused } from "@react-navigation/native";
import crashlytics from "@react-native-firebase/crashlytics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
const EnableLocationScreen = ({ route, navigation }) => {
  const appState = useRef(AppState.currentState);
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [locationRadius, setLocationRadius] = useState()
  const [continueWithoutGeocoding, setContinueWithoutGeoCoding] = useState(false)
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const focused = useIsFocused();
  const {t} = useTranslation()
  const message = route.params?.message;
  const navigateTo = route.params?.navigateTo;
  const dispatch = useDispatch();
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const locationEnabled = useSelector(
    (state) => state.userLocation.locationEnabled
  );
  const locationPermissionStatus = useSelector(
    (state) => state.userLocation.locationPermissionStatus
  );

  // const locationSetup = useSelector(state=>state.appusers.locationSetup)
  const locationSetup = {
    radius:10,
    continue_lat_long:false
  }

  console.log(
    "EnableLocationScreen",
    locationEnabled,
    locationPermissionStatus,
    navigateTo
  );

  
  useEffect(()=>{
    if(locationSetup)
    {
    if(Object.keys(locationSetup)?.length==0)
    {
        navigation.navigate("QrCodeScanner")
    }
    else{
        setLocationRadius(locationSetup?.radius)
        setContinueWithoutGeoCoding(locationSetup?.continue_lat_long)
    }
}
  },[locationSetup])

  const openSettings = () => {
    if (Platform.OS === "android") {
      Linking.openSettings().then(() => {});
    } else {
      Linking.openURL("app-settings:");
    }
  };

  const saveLocationToStorage = async (location) => {
    const data = {
      location,
      timestamp: new Date().getTime(),
    };
    await AsyncStorage.setItem("locationData", JSON.stringify(data));
  };

  const getLocationFromStorage = async () => {
    const locationData = await AsyncStorage.getItem("locationData");
    if (locationData) {
      const { location, timestamp } = JSON.parse(locationData);
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - timestamp;

      if (timeDiff < 12 * 60 * 60 * 1000) {
        // Return location if it's within the 12-hour period
        return location;
      }
    }
    return null;
  };

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const R = 6371; // Radius of the Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  const getLocationPermission = async () => {
    console.log("LocationServicesDialogBox");

    if (Platform.OS === "ios") {
      Alert.alert(
        t("GPS Disabled"),
        t("Please enable GPS/Location to use this feature."),
        [
          { text: t("Cancel"), style: "cancel" },
          { text: "Settings", onPress: openSettings },
        ],
        { cancelable: false }
      );
    } else if (Platform.OS === "android") {
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message:
          `<h2 style='color: #0af13e'>${t("Use Location ?")}</h2>${t("Ozostars wants to change your device settings:")}<br/><br/>${t("Enable location to use the application.")}<br/><br/><a href='#'>${t("Learn more")}</a>`,
        ok: "YES",
        cancel: "NO",
        enableHighAccuracy: true,
        showDialog: true,
        openLocationServices: true,
        preventOutSideTouch: false,
        preventBackClick: true,
        providerListener: false,
        style: {
          backgroundColor: "#DDDDDD",
          positiveButtonTextColor: "white",
          positiveButtonBackgroundColor: "#298d7b",
          negativeButtonTextColor: "white",
          negativeButtonBackgroundColor: "#ba5f5f",
        },
      })
        .then(() => {
          dispatch(setLocationPermissionStatus(true));
          dispatch(setLocationEnabled(true));
          getLocation();
        })
        .catch((error) => {
          Alert.alert(
            t("You denied GPS access"),
            t("To scan QR code, Ozostars app requires location access, kindly enable GPS access to start scanning"),
            [
              {
                text: t("OK"),
                onPress: () => {
                  navigation.navigate("Dashboard");
                },
              },
            ]
          );
        });
    }
  };

  const getLocation = useCallback(async () => {
    console.log("getLocation function called");
    Geolocation.getCurrentPosition(
      async (res) => {

        const lati = res.coords.latitude;
        const long = res.coords.longitude;
        console.log("Geolocation success:", lati, long);

        setLat(lati);
        setLon(long);
        const locationJson = {
          lat: lati || "N/A",
          lon: long || "N/A",
        };
        if (
          ((lati == undefined) || (long == undefined)) ||
          (lati == null || long == null)
        ) {
          Alert.alert(
            t("Unable To Fetch Location"),
            "We are not able to fetch your lat/lon at the moment",
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("Dashboard");
                },
              },
            ]
          );
        }

        const savedLocation = await getLocationFromStorage();

        if (savedLocation) {
          const distance = haversineDistance(
            savedLocation.lat,
            savedLocation.lon,
            lati,
            long
          );
            console.log("haversine distance", distance)
          if (distance <= locationRadius) {
            // Use previously saved location
            console.log("Distance is less using previously stored location", distance, savedLocation);
            dispatch(setLocation(savedLocation));
            dispatch(setLocationPermissionStatus(true));
            dispatch(setLocationEnabled(true));
            setTimeout(() => {
              navigateTo && navigation.replace(navigateTo);
            }, 500);
            return;
          }
        }

        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lati},${long}&location_type=ROOFTOP&result_type=street_address&key=${GoogleMapsKey}`;

        fetch(url)
          .then((response) => response.json())
          .then((json) => {
            console.log("Google Maps API response:", json);
            if (json.status === "OK") {
              const formattedAddress = json?.results[0]?.formatted_address;
              locationJson.address = formattedAddress || "N/A";
              const addressComponent = json?.results[0]?.address_components;
              locationJson.compoundCode = json?.plus_code?.compound_code
              
              addressComponent.forEach((component) => {
                if (component.types.includes("postal_code")) {
                  locationJson.postcode = component.long_name;
                } else if (component.types.includes("country")) {
                  locationJson.country = component.long_name;
                } else if (
                  component.types.includes("administrative_area_level_1")
                ) {
                  locationJson.state = component.long_name;
                } else if (
                  component.types.includes("administrative_area_level_3")
                ) {
                  locationJson.district = component.long_name;
                } else if (component.types.includes("locality")) {
                  locationJson.city = component.long_name;
                }
              });

              console.log("Dispatching setLocation with:", locationJson);
              dispatch(setLocation(locationJson));
              dispatch(setLocationPermissionStatus(true));
              dispatch(setLocationEnabled(true));

              saveLocationToStorage(locationJson);

              setTimeout(() => {
                navigateTo && navigation.replace(navigateTo);
              }, 500);
            } else {
                console.log("locationSetupelse",locationSetup,lati,long)
            locationSetup && Object.keys(locationSetup)?.length>0 && handleFailedLocationFetch("error in constructing location json", lati,long);
            }
          })
          .catch((error) => {
            console.log("locationSetupcatch",locationSetup,lati,long)
            locationSetup && Object.keys(locationSetup)?.length>0 && handleFailedLocationFetch(error, lati, long);
          });
      },
      (error) => {
        console.error("Geolocation error:", error);
        if (error.code === 1) {
          Alert.alert(
            t("Alert"),
            t("To scan a QR code, the OZOSTAR app must have access permissions. Please grant access to the location."),
            [{ text: "NO",onPress:(()=>{
                
            }) }, { text: "Yes", onPress: openSettings }],
            { cancelable: false }
          );
        } else if (error.code === 2) {
          getLocationPermission();
        } else {
            locationSetup && Object.keys(locationSetup)?.length>0 &&  handleFailedLocationFetch(error, lat,lon);
        }
      }
    );
  }, []);

  const handleFailedLocationFetch = async (error, latitude,longitude) => {
    console.log("handleFailedLocationFetch",error,latitude,longitude)
    const savedLocation = await getLocationFromStorage();

    if (savedLocation && Object.keys(savedLocation).length!=0) {
        const distance = haversineDistance(
            savedLocation.lat,
            savedLocation.lon,
            latitude,
            longitude
          );
    console.error("Failed to fetch location:", latitude,longitude, error,savedLocation,distance,locationSetup?.radius);
        
        if (distance <= locationSetup?.radius) {
            // Use previously saved location
            console.log("Using previously saved location as the previously stored location is nearby:", savedLocation);

            dispatch(setLocation(savedLocation));
            dispatch(setLocationPermissionStatus(true));
            dispatch(setLocationEnabled(true));
            setTimeout(() => {
              navigateTo && navigation.replace(navigateTo);
            }, 500);
            
          }
          else {
            console.log("inside else handleFailedLocationFetch")
            //location IQ reverse geocoding api to resolve unhandled requests from google api.
            try{
              const options = {method: 'GET', headers: {accept: 'application/json'}};
              console.log("location IQ API", locationIqApi, lat,lon)
              fetch(`https://us1.locationiq.com/v1/reverse?key=${locationIqApi}&lat=${latitude}&lon=${longitude}&format=json`,options)
              .then(response => response.json())
              .then(response => {
                console.log("location iq api response",response)
                let locationJson = {}
                locationJson["lat"] = latitude
                locationJson["lon"] = longitude
                locationJson["postcode"] = response?.address?.postcode
                locationJson["city"] = response?.address?.city
                locationJson["state"] = response?.address?.state
                locationJson["district"] = response?.address?.state_district
                locationJson["country"] = response?.address?.country
                dispatch(setLocation(locationJson));
                dispatch(setLocationPermissionStatus(true));
                dispatch(setLocationEnabled(true));
                saveLocationToStorage(locationJson);
      
                setTimeout(() => {
                  navigateTo && navigation.replace(navigateTo);
                }, 500);
              })
              .catch(err => {
                console.error(err)
                if(continueWithoutGeocoding)
                {
                    setTimeout(() => {
                        navigateTo && navigation.replace(navigateTo);
                      }, 500);
                }
                else{
                    Alert.alert(
                        t("Unable To Fetch Location"),
                        t("We are not able to fetch your location from your lat/lon at the moment"),
                        [
                          {
                            text: "OK",
                            onPress: () => {
                              navigation.navigate("Dashboard");
                            },
                          },
                        ]
                      );
                }
              });
            }
            catch(e)
            {
      
              if(continueWithoutGeocoding)
              {
                  setTimeout(() => {
                      navigateTo && navigation.replace(navigateTo);
                    }, 500);
              }
              else{
                  Alert.alert(
                      t("Unable To Fetch Location"),
                      t("We are not able to fetch your location from your lat/lon at the moment"),
                      [
                        {
                          text: "OK",
                          onPress: () => {
                            navigation.navigate("Dashboard");
                          },
                        },
                      ]
                    );
              }
            }
      
          }
      
    }
    else {
      console.log("inside else handleFailedLocationFetch")
      //location IQ reverse geocoding api to resolve unhandled requests from google api.
      try{
        const options = {method: 'GET', headers: {accept: 'application/json'}};
        console.log("location IQ API", locationIqApi, lat,lon)
        fetch(`https://us1.locationiq.com/v1/reverse?key=${locationIqApi}&lat=${latitude}&lon=${longitude}&format=json`,options)
        .then(response => response.json())
        .then(response => {
          console.log("location iq api response",response)
          let locationJson = {}
          locationJson["lat"] = latitude
          locationJson["lon"] = longitude
          locationJson["postcode"] = response?.address?.postcode
          locationJson["city"] = response?.address?.city
          locationJson["state"] = response?.address?.state
          locationJson["district"] = response?.address?.state_district
          locationJson["country"] = response?.address?.country
          dispatch(setLocation(locationJson));
          dispatch(setLocationPermissionStatus(true));
          dispatch(setLocationEnabled(true));
          saveLocationToStorage(locationJson);

          setTimeout(() => {
            navigateTo && navigation.replace(navigateTo);
          }, 500);
        })
        .catch(err => {
          console.error(err)
          if(continueWithoutGeocoding)
          {
              setTimeout(() => {
                  navigateTo && navigation.replace(navigateTo);
                }, 500);
          }
          else{
              Alert.alert(
                  t("Unable To Fetch Location"),
                  t("We are not able to fetch your location from your lat/lon at the moment"),
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        navigation.navigate("Dashboard");
                      },
                    },
                  ]
                );
          }
        });
      }
      catch(e)
      {

        if(continueWithoutGeocoding)
        {
            setTimeout(() => {
                navigateTo && navigation.replace(navigateTo);
              }, 500);
        }
        else{
            Alert.alert(
                t("Unable To Fetch Location"),
                t("We are not able to fetch your location from your lat/lon at the moment"),
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.navigate("Dashboard");
                    },
                  },
                ]
              );
        }
      }

    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      appState.current = nextAppState;
      if (appState.current == "active") {
        // getLocationPermission()
      }
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [appState.current]);

  useEffect(() => {
    if (focused) {
      getLocation();
    }
  }, [focused]);

  return (
    <ScrollView contentContainerStyle={{ height: "100%", width: "100%" }}>
      <View style={styles.container}>
        <PoppinsTextMedium style={styles.message} content={message} />
        <Image
          resizeMode="contain"
          style={styles.image}
          source={require("../../../assets/images/deviceLocation.png")}
        />
        {!locationEnabled && !locationPermissionStatus && (
          <PoppinsTextMedium
            style={styles.checkingText}
            content={t("Checking Location Access")}
          />
        )}
        {locationEnabled && locationPermissionStatus && (
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <PoppinsTextMedium
              style={{ ...styles.grantedText, color: ternaryThemeColor }}
              content={t("Location Access Granted")}
            />
            <View style={{ flexDirection: "row" }}>
              {lat && (
                <PoppinsTextMedium
                  style={{ ...styles.grantedSubText, color: ternaryThemeColor }}
                  content={`LAT - ${lat?.toFixed(2)},`}
                />
              )}
              {lon && (
                <PoppinsTextMedium
                  style={{
                    ...styles.grantedSubText,
                    color: ternaryThemeColor,
                    marginLeft: 10,
                  }}
                  content={`LOG - ${lon?.toFixed(2)}`}
                />
              )}
            </View>
          </View>
        )}
        <TouchableOpacity
          onPress={getLocation}
          style={[styles.button, { backgroundColor: ternaryThemeColor }]}
        >
          <PoppinsTextMedium
            style={styles.buttonText}
            content={t("Enable Device Location")}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  message: {
    color: "black",
    fontSize: 22,
    marginBottom: 60,
    width: "80%",
    fontWeight: "600",
  },
  image: {
    height: "30%",
    width: "80%",
  },
  checkingText: {
    color: "black",
    fontSize: 22,
    fontWeight: "700",
  },
  grantedText: {
    fontSize: 22,
    fontWeight: "700",
  },
  grantedSubText: {
    fontSize: 12,
    fontWeight: "700",
  },
  button: {
    height: 60,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 140,
  },
  buttonText: {
    fontSize: 19,
    color: "white",
  },
});

export default EnableLocationScreen;