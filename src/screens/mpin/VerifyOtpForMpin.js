//import liraries
import React, { Component, useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useVerifyOtpMutation } from "../../apiServices/login/otpBased/VerifyOtpApi";
import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";
import LeftIcon from "react-native-vector-icons/AntDesign";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import ErrorModal from "../../components/modals/ErrorModal";
import ModalWithBorder from "../../components/modals/ModalWithBorder";
import OtpInput from "../../components/organisms/OtpInput";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import Icon from "react-native-vector-icons/Feather";
import Close from "react-native-vector-icons/Ionicons";
import { useGetAppLoginMutation } from "../../apiServices/login/otpBased/OtpLoginApi";
import { useNavigation } from "@react-navigation/native";
import { setUserData } from "../../../redux/slices/appUserDataSlice";


// create a component
const VerifyOtpForMpin = (params) => {
  const [mobile, setMobile] = useState(
    params.route.params?.navigationParams?.mobile
  );
  const fcmToken = useSelector((state) => state.fcmToken.fcmToken);

  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [otp, setOtp] = useState("");
  const [checkForKyc, setCheckForKyc] = useState();
  const [checkKycOption1, setCheckKycOption1] = useState();
  const [checkKycOption2, setCheckKycOption2] = useState();
  const [parsedJsonValue, setParsedJsonValue] = useState();
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(60);
  const [openModalWithBorder, setModalWithBorder] = useState(false);

  const userData = useSelector(state => state.appusersdata.userData);

  console.log("existing userdata verify", userData)


  const icon = useSelector((state) => state.apptheme.icon1)
    ? useSelector((state) => state.apptheme.icon1)
    : require("../../../assets/images/demoIcon.png");

  const currentVersion = useSelector((state) => state.appusers.app_version);

  const navigationParams = params?.route?.params?.navigationParams;

  const { t } = useTranslation();

  const timeOutCallback = useCallback(
    () => setTimer((currTimer) => currTimer - 1),
    []
  );

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );

  const [
    verifyOtpFunc,
    {
      data: verifyOtpData,
      error: verifyOtpError,
      isLoading: verifyOtpIsLoading,
      isError: verifyOtpIsError,
    },
  ] = useVerifyOtpMutation();


  const [
    verifyLoginOtpFunc,
    {
      data: verifyLoginOtpData,
      error: verifyLoginOtpError,
      isLoading: verifyLoginOtpIsLoading,
      isError: verifyLoginOtpIsError,
    },
  ] = useGetAppLoginMutation();

  useEffect(() => {
    timer > 0 && setTimeout(timeOutCallback, 1000);
  }, [timer, timeOutCallback]);

  useEffect(() => {
    if (verifyLoginOtpData) {
      console.log("verifyLoginOtpData", verifyLoginOtpData);
      const mobile = navigationParams?.mobile;
      const name = navigationParams?.name;
      const user_type_id = navigationParams?.user_type_id;
      const user_type = navigationParams?.user_type;
      const fcm_token = fcmToken;
      const token = verifyLoginOtpData?.body?.token;
      const app_version = currentVersion;
      if (verifyLoginOtpData?.success) {
        console.log("verifyOtpFunc data", currentVersion, );

        verifyOtpFunc({
          mobile,
          name,
          otp,
          user_type_id,
          user_type,
          fcm_token,
          app_version,
        });
      }
    } else if (verifyLoginOtpError) {
      console.log("verifyLoginOtpError", verifyLoginOtpError);
      setError(true);
      setMessage(verifyLoginOtpError?.data?.message);
    }
  }, [verifyLoginOtpData, verifyLoginOtpError]);

  useEffect(()=>{
    if(verifyOtpData){
        console.log("verifyOtpData",verifyOtpData)
        let newToken = verifyOtpData?.body?.token


        dispatch(setUserData(verifyOtpData?.body))
        
        setModalWithBorder(true)

    }
    else{
        console.log("verifyOtpError",verifyOtpError)
    }
  },[verifyOtpData, verifyOtpError])

  useEffect(() => {
    if (otp.length === 6) {
      // setOtp(value);
      verifyOtp();
      // console.log('From Verify Otp', value);
    }
  }, [otp]);

  //modal close
  useEffect(() => {
    console.log("running");
    if (openModalWithBorder == true)
      setTimeout(() => {
        console.log("running2");
        modalWithBorderClose();
      }, 2000);
  }, [success, openModalWithBorder]);


  const modalWithBorderClose = () => {
    setModalWithBorder(false);
    setMessage("");
    navigation.navigate("MpinSetupScreen",{from:"ForgotMpin",navigationParams})
  };

  const getOtpFromComponent = (value) => {
    if (value.length === 6) {
      setOtp(value);
      console.log("From Verify Otp", value);
    }
  };

  const ModalContent = () => {
    return (
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ marginTop: 30, alignItems: "center", maxWidth: "80%" }}>
          <Icon name="check-circle" size={53} color={ternaryThemeColor} />
          <PoppinsTextMedium
            style={{
              fontSize: 27,
              fontWeight: "600",
              color: ternaryThemeColor,
              marginLeft: 5,
              marginTop: 5,
            }}
            content={"Success ! !"}
          ></PoppinsTextMedium>

          <ActivityIndicator
            size={"small"}
            animating={true}
            color={ternaryThemeColor}
          />

          <View style={{ marginTop: 10, marginBottom: 30 }}>
            <PoppinsTextMedium
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#000000",
                marginLeft: 5,
                marginTop: 5,
              }}
              content={"OTP Verified !"}
            ></PoppinsTextMedium>
          </View>

          {/* <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <ButtonOval handleOperation={modalWithBorderClose} backgroundColor="#000000" content="OK" style={{ color: 'white', paddingVertical: 4 }} />
          </View> */}
        </View>

        <TouchableOpacity
          style={[
            {
              backgroundColor: ternaryThemeColor,
              padding: 6,
              borderRadius: 5,
              position: "absolute",
              top: -10,
              right: -10,
            },
          ]}
          onPress={modalClose}
        >
          <Close name="close" size={17} color="#ffffff" />
        </TouchableOpacity>
      </View>
    );
  };
  const modalClose = () => {
    setError(false);
    setSuccess(false);
    setMessage("");
    setModalWithBorder(false);
  };
  const verifyOtp = () => {

    const mobile = navigationParams?.mobile;
    const name = navigationParams?.name;
    const user_type_id = navigationParams?.user_type_id;
    const user_type = navigationParams?.user_type;
    const is_approved_needed = navigationParams?.needsApproval;
    const fcm_token = fcmToken;
    const app_version = currentVersion;
    console.log(
      "verifyLoginOtpFunc data",
      mobile,
      name,
      user_type_id,
      user_type,
      otp,
      is_approved_needed,
      app_version
    );

    verifyLoginOtpFunc({
      mobile,
      name,
      user_type_id,
      user_type,
      otp,
      is_approved_needed,
      fcm_token,
      currentVersion,
    });
  };



  return (
    <LinearGradient colors={["white", "white"]} style={styles.container}>
    <View
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: ternaryThemeColor,
      }}
    >
      <View
        style={{
          height: 120,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: ternaryThemeColor,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{
            height: 50,
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            left: 10,
            top: 20,
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <LeftIcon name="arrowleft" size={24} color={"white"}></LeftIcon>
        </TouchableOpacity>
        <Image
          style={{
            height: 50,
            width: 100,
            resizeMode: "contain",
            top: 20,
            position: "absolute",
            left: 50,
          }}
          source={{ uri: icon }}
        ></Image>
      </View>

      <View
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          marginTop: 10,
          width: "90%",
        }}
      >
        <PoppinsText
          style={{ color: "white", fontSize: 28 }}
          content={t("Enter the OTP sent to")}
        ></PoppinsText>
        <PoppinsText
          style={{ color: "white", fontSize: 28 }}
          content={navigationParams.mobile}
        ></PoppinsText>
      </View>
    </View>
    <View style={{ marginHorizontal: 100 }}>
      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
        ></ErrorModal>
      )}
    </View>

    <View style={{ marginHorizontal: 100 }}>
      {openModalWithBorder && (
        <ModalWithBorder
          modalClose={modalWithBorderClose}
          message={message}
          openModal={openModalWithBorder}
          comp={ModalContent}
        ></ModalWithBorder>
      )}
    </View>

    <ScrollView contentContainerStyle={{ flex: 1 }} style={{ width: "100%" }}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Image
          style={{ height: 160, width: 160, resizeMode: "contain" }}
          source={require("../../../assets/images/otpScreenImage.png")}
        ></Image>
      </View>
      <OtpInput
        getOtpFromComponent={getOtpFromComponent}
        color={"white"}
      ></OtpInput>

      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 4,
          }}
        >
          {/* <Image
            style={{
              height: 20,
              width: 20,
              resizeMode: "contain",
            }}
            source={require("../../../assets/images/clock.png")}
          ></Image>
       */}
        </View>
     
      </View>
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          bottom: 30,
          width: "100%",
        }}
      >
        {/* {otp && (
          <ButtonNavigateArrow
            handleOperation={verifyOtp}
            backgroundColor={buttonThemeColor}
            style={{ color: 'white', fontSize: 16 }}
            content="Verify"></ButtonNavigateArrow>
        )} */}
      </View>
    </ScrollView>
  </LinearGradient>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
});

//make this component available to the app
export default VerifyOtpForMpin;
