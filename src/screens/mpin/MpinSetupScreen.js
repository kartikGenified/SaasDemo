import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Keyboard,
  ScrollView
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useUpdateMpinMutation } from "../../apiServices/login/otpBased/OtpLoginApi";
import { setUserData } from "../../../redux/slices/appUserDataSlice";
import ErrorModal from "../../components/modals/ErrorModal";
import { appIcon } from "../../utils/HandleClientSetup";

const MpinSetupScreen = (params) => {
  const [mpin, setMpin] = useState(["", "", "", ""]);
  const [mobile, setMobile] = useState("");

  const [token, setToken] = useState("");

  const refInputs = useRef([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState();

  const userData = useSelector((state) => state.appusersdata.userData);
  console.log("userData..", userData);
  const ForgotMpin = params.route?.params?.from || "";
  const navigationParams = params.route?.params?.navigationParams || {};

  console.log("is forgot", ForgotMpin, userData);

  useEffect(() => {
    console.log("mobile mobile", userData.mobile);
    setMobile(userData?.mobile);
    setToken(userData?.token);
  }, [userData]);

  console.log("peri peri ladyyyyyyy", userData);

  // let uid = params

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );

  // const [
  //   mpinupdateLoginFunc,
  //   {
  //     data: mpinUpdateLoginData,
  //     error: mpinUpdateLoginError,
  //     isLoading: mpinUpdateLoginIsLoading,
  //     isError: mpinUpdateLoginIsError,
  //   },
  // ] = useUpdateMpinMutation();

  const navigation = useNavigation();

  const icon = useSelector((state) => state.apptheme.icon1)
    ? useSelector((state) => state.apptheme.icon1)
    : require("../../../assets/images/demoIcon.png");

  async function updateToken(newToken) {
    const jsonValue = await AsyncStorage.getItem("loginData");

    const parsedJsonValues = JSON.parse(jsonValue);

    console.log("oldToken", parsedJsonValues?.token);
    const newJsonValues = { ...parsedJsonValues, token: newToken };
    const newUserData = { ...userData, token: newToken };

    await AsyncStorage.setItem("kycData", JSON.stringify(newJsonValues));
    setUserData(newUserData);

    console.log("newToken", newJsonValues?.token);

    const check = await AsyncStorage.getItem("loginData");

    console.log("check", JSON.parse(check)?.token);
  }

  // useEffect(() => {
  //   if (mpinUpdateLoginData?.success) {
  //     console.log("mpinUpdateLoginData", mpinUpdateLoginData);
  //     if (ForgotMpin == "ForgotMpin") {
  //       // updateToken();
  //       navigation.navigate("MpinValidationScreen", navigationParams);
  //     } else {
  //       navigation.navigate("Dashboard");
  //     }
  //     updateToken();
  //   } else {
  //     console.log("mpinUpdateLoginError", mpinUpdateLoginError);
  //   }
  // }, [mpinUpdateLoginData, mpinUpdateLoginError]);

  // Handle input changes
  const handleInputChange = (text, index) => {
    const newMpin = [...mpin];
    newMpin[index] = text; // Update the current input
    setMpin(newMpin);


    // Move to the next input if a number is entered
    if (text.length === 1 && index < 3) {
      refInputs.current[index + 1].focus();
    }
    else{
      Keyboard.dismiss()
    }
  };

  const modalClose = () => {
    setError(false);
  };

  // Handle key press to move back on backspace
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      // If current input is empty and index is greater than 0
      if (mpin[index] === "" && index > 0) {
        const newMpin = [...mpin];
        refInputs.current[index - 1].focus(); // Move focus to the previous input
        newMpin[index - 1] = ""; // Clear the previous input
        setMpin(newMpin);
      }
    }
  };

  // Handle input blur
  const handleBlur = (index) => {
    if (mpin[index] === "" && index > 0) {
      refInputs.current[index - 1].focus(); // Move focus back to the previous input if current is empty
    }
  };

  // Store MPIN in AsyncStorage
  const saveMpin = async () => {
    const fullMpin = mpin.join("");
    if (fullMpin.length == 4) {
      console.log("Full Mpin", fullMpin);

      await AsyncStorage.setItem("userMpin", fullMpin);
      if(userData.user_type == "distributor"){

        // navigation.reset({ index: "0", routes: [{ name: "UpdatePassword",params: { 
        //   /* Your parameters here */
        //   type: "login"
        // } }] });
        navigation.reset({ index: "0", routes: [{ name: "Dashboard" }] });
      }
      else{
      navigation.reset({ index: "0", routes: [{ name: "Dashboard" }] });

      }
    } else {
      // Alert.alert("Error", "Please enter all 4 digits of your MPIN.");
      setError(true);
      setMessage("Please Enter all 4 digits of your MPIN");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          position: "absolute",
          left: 10,
          top: 20,
        }}
      >
        <Image
          style={{
            height: 30,
            width: 30,
            resizeMode: "contain",
          }}
          source={require("../../../assets/images/blackBack.png")}
        ></Image>
      </TouchableOpacity> */}

      <TouchableOpacity onPress={()=>{Keyboard.dismiss()}}
        style={{
          backgroundColor: 'white',
          padding: 10,
          marginTop: "20%",
          marginBottom: 100,
        }}
      >
        <Image
          style={{
            height: 150,
            width: 150,
            resizeMode: "contain",
          }}
          source={appIcon}
        />
      </TouchableOpacity>

      <Text style={{ ...styles.title, color: ternaryThemeColor }}>
        Create Your MPIN
      </Text>
      <View style={styles.inputContainer}>
        {mpin.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.input}
            maxLength={1}
            keyboardType="numeric"
            value={digit}
            onChangeText={(text) => handleInputChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)} // Detect backspace
            onBlur={() => handleBlur(index)} // Handle blur event
            ref={(input) => (refInputs.current[index] = input)} // Assign input refs
          />
        ))}
      </View>
      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          warning = {true}
          openModal={error}
        ></ErrorModal>
      )}
      <TouchableOpacity
        style={{ ...styles.button, backgroundColor: ternaryThemeColor }}
        onPress={saveMpin}
      >
        <Text style={styles.buttonText}>Set MPIN</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "800",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
    fontSize: 24,
    color: "black",
    textAlign: "center",
    width: 40,
    marginHorizontal: 5,
  },
  button: {
    marginTop: 50,
    paddingVertical: 13,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MpinSetupScreen;
