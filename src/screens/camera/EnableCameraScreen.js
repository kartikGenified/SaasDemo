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
  PermissionsAndroid,
  AppState,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  setCameraPermissionStatus,
  setCameraStatus,
} from "../../../redux/slices/cameraStatusSlice";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useIsFocused } from "@react-navigation/native";
import { cameraPermissionMessage } from "../../utils/HandleClientSetup";

const EnableCameraScreen = ({ navigation, route }) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [cameraPermissionEnabled, setCameraPermissionEnabled] = useState(false);
  const [CameraEnabled, setCameraEnabled] = useState(false);
  const [requiresLocation, setRequiresLocation] = useState(false)
  const [neverAskAgain, setNeverAskAgain] = useState(false);
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const message = route.params?.message;
  let alertShown = false;
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";

  const cameraPermissionStatus = useSelector(
    (state) => state.cameraStatus.cameraPermissionStatus
  );
  const locationSetup = useSelector(state=>state.appusers.locationSetup)

  const cameraStatus = useSelector((state) => state.cameraStatus.cameraStatus);

  console.log("EnableCameraScreen", cameraPermissionStatus, cameraStatus);
  useEffect(()=>{
    if(locationSetup)
    {
      if(Object.keys(locationSetup)?.length != 0)
      {
        setRequiresLocation(true)
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
  const handleCameraPermissions = async () => {
    console.log(
      "Response from android camera check",
      await PermissionsAndroid.check("android.permission.CAMERA")
    );
    if (!(await PermissionsAndroid.check("android.permission.CAMERA"))) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "expolo App Camera Permission",
            message: "expolo App needs access to your camera",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          if (!alertShown) {
            Alert.alert(
              "Alert",
              `${cameraPermissionMessage}`,
              [{ text: "OK", onPress: () => Linking.openSettings() }],
              { cancelable: false }
            );
            alertShown = true;
          }
        } else {
          alertShown = false;
        }
        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
          setTimeout(() => {
            setCameraPermissionEnabled(true);
          }, 300);
          dispatch(setCameraPermissionStatus(true));
          dispatch(setCameraStatus(true));
          setTimeout(() => {
             navigation.replace("EnableLocationScreen",{navigateTo:"QrCodeScanner"});
          }, 500);
        }
        if (granted == "denied") {
          setCameraEnabled(false);
        }
        if (granted == "never_ask_again") {
          setNeverAskAgain(true);
        }

        console.log("handleCameraPermissionsStatus ", granted);
      } catch (err) {
        console.log(err);
      }
    } else if (await PermissionsAndroid.check("android.permission.CAMERA")) {
      setTimeout(() => {
        setCameraPermissionEnabled(true);
      }, 300);
      dispatch(setCameraPermissionStatus(true));
      dispatch(setCameraStatus(true));
      setTimeout(() => {
        navigation.replace("EnableLocationScreen",{navigateTo:"QrCodeScanner"});
      }, 500);
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/background/) && nextAppState === "active") {
        console.log("App has come to the foreground!");
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    console.log("focused");
    handleCameraPermissions();
  }, [focused]);

  //   useEffect(()=>{
  //     if(cameraPermissionStatus)
  //     navigation.replace('QrCodeScanner')
  //   },[cameraPermissionStatus])

  return (
    <ScrollView contentContainerStyle={{ height: "100%", width: "100%" }}>
      <View style={styles.container}>
        <PoppinsTextMedium
          style={styles.message}
          content={message}
        ></PoppinsTextMedium>
        <Image
          resizeMode="contain"
          style={styles.image}
          source={require("../../../assets/images/enableCameraMessage.png")}
        ></Image>
        {!cameraPermissionStatus && (
          <PoppinsTextMedium
            style={{ color: "black", fontSize: 22, fontWeight: "700" }}
            content="Checking Camera Access"
          ></PoppinsTextMedium>
        )}

        {cameraPermissionStatus && cameraStatus && (
          <PoppinsTextMedium
            style={{
              color: ternaryThemeColor,
              fontSize: 22,
              fontWeight: "700",
            }}
            content="Camera Access Granted"
          ></PoppinsTextMedium>
        )}

        {neverAskAgain && (
          <PoppinsTextMedium
            style={{
              color: "black",
              fontSize: 22,
              fontWeight: "700",
              marginTop: 20,
            }}
            content="You can still enable camera access by pressing the button below."
          ></PoppinsTextMedium>
        )}
        {!cameraPermissionStatus && !cameraStatus && (
          <TouchableOpacity
            onPress={() => {
              handleCameraPermissions();
            }}
            style={[styles.button, { backgroundColor: ternaryThemeColor }]}
          >
            <PoppinsTextMedium
              style={{ ...styles.buttonText, color: "white" }}
              content="Enable Camera Access"
            ></PoppinsTextMedium>
          </TouchableOpacity>
        )}
        {!cameraPermissionStatus && !cameraStatus && (
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              ...styles.button,
              ...styles.buttonOutline,
              borderColor: ternaryThemeColor,
            }}
          >
            <PoppinsTextMedium
              style={{ ...styles.buttonText, color: ternaryThemeColor }}
              content="Go Back"
            ></PoppinsTextMedium>
          </TouchableOpacity>
        )}
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
  },
  buttonOutline: {
    borderWidth: 1,
    marginTop: 16,
  },
});

export default EnableCameraScreen;
