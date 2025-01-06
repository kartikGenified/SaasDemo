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
import { GoogleMapsKey } from "@env";
import { useIsFocused } from "@react-navigation/native";
import crashlytics from "@react-native-firebase/crashlytics";
import { locationPermissionMessage } from "../../utils/HandleClientSetup";

const EnableLocationScreen = ({ route, navigation }) => {
  const appState = useRef(AppState.currentState);
  const [lat, setLat] = useState()
  const [lon, setLon] = useState()
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const focused = useIsFocused();
  const message = route.params?.message;
  const navigateTo = route.params?.navigateTo
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

  const locationSetup = useSelector(state=>state.appusers.locationSetup)

  console.log(
    "EnableLocationScreen",
    locationEnabled,
    locationPermissionStatus
  );

  const openSettings = () => {
    if (Platform.OS === "android") {
      Linking.openSettings().then(() => {});
    } else {
      Linking.openURL("app-settings:");
    }
  };
  const getLocationPermission = async () => {
    console.log("LocationServicesDialogBox");

    if (Platform.OS === "ios") {
      Alert.alert(
        "GPS Disabled",
        "Please enable GPS/Location to use this feature.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Settings", onPress: openSettings },
        ],
        { cancelable: false }
      );
    } else if (Platform.OS === "android") {
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message:
          "<h2 style='color: #0af13e'>Use Location ?</h2>expolo wants to change your device settings:<br/><br/>Enable location to use the application.<br/><br/><a href='#'>Learn more</a>",
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
                "You denied GPS access",
                "To scan QR code, expolo app requires location access, kindly enable GPS access to start scanning",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.navigate("Dashboard");
                    },
                  },
                ]
              );
        });
    }
  };

  const getLocation = useCallback(() => {
    console.log("getLocation function called");
    Geolocation.getCurrentPosition(
      (res) => {
        console.log("Geolocation success:", res);
        
        const lat = res.coords.latitude;
        const lon = res.coords.longitude;
        setLat(lat)
        setLon(lon)
        const locationJson = {
          lat: lat || "N/A",
          lon: lon || "N/A",
        };
        if (
          (lat == undefined) & (lon == undefined) ||
          (lat == null && lon == undefined)
        ) {
          Alert.alert(
            "Unable To Fetch Location",
            "We are not able to fetch your location from your lat/lon at the moment",
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

        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&location_type=ROOFTOP&result_type=street_address&key=${GoogleMapsKey}`;

        fetch(url)
          .then((response) => response.json())
          .then((json) => {
            console.log("Google Maps API response:", json);
            if (json.status === "OK") {
              const formattedAddress = json?.results[0]?.formatted_address;
              locationJson.address = formattedAddress || "N/A";
              const addressComponent = json?.results[0]?.address_components;

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

              setTimeout(() => {
               navigateTo &&  navigation.replace(navigateTo);
              }, 500);
            } else {
              Alert.alert(
                "Unable To Fetch Location",
                "We are not able to fetch your location from your lat/lon at the moment",
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
          })
          .catch((error) => {
            Alert.alert("Unable To Fetch Location", error, [
              {
                text: "OK",
                onPress: () => {
                  navigation.navigate("Dashboard");
                },
              },
            ]);
          });
      },
      (error) => {
        console.error("Geolocation error:", error);
        if (error.code === 1) {
          Alert.alert(
            "Alert",
            `${locationPermissionMessage}`
            [{ text: "NO" }, { text: "Yes", onPress: openSettings }],
            { cancelable: false }
          );
        } else if (error.code === 2) {
          getLocationPermission();
        } else {
          Alert.alert(
            "Unable To Fetch Location Status",
            "We are not able to fetch your location status at the moment",
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
    );
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      appState.current = nextAppState;
      if(appState.current == "active")
      {
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
            content="Checking Location Access"
          />
        )}
        {locationEnabled && locationPermissionStatus && (
          <View style={{alignItems:'center',justifyContent:'center'}}>
          <PoppinsTextMedium
            style={{ ...styles.grantedText, color: ternaryThemeColor }}
            content="Location Access Granted"
          />
          <View style={{flexDirection:'row'}}>
          { lat && <PoppinsTextMedium
            style={{ ...styles.grantedSubText, color: ternaryThemeColor }}
            content={`LAT - ${lat?.toFixed(2)},`}
          />}
          {lon && <PoppinsTextMedium
            style={{ ...styles.grantedSubText, color: ternaryThemeColor, marginLeft:10 }}
            content={`LOG - ${lon?.toFixed(2)}`}
          />}
          </View>
          
          </View>
        )}
        <TouchableOpacity
          onPress={getLocation}
          style={[styles.button, { backgroundColor: ternaryThemeColor }]}
        >
          <PoppinsTextMedium
            style={styles.buttonText}
            content="Enable Device Location"
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
