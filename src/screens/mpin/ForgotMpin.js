//import liraries
import { useNavigation } from "@react-navigation/native";
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import { useSelector } from "react-redux";
import TextInputRectangularWithPlaceholder from "../../components/atoms/input/TextInputRectangularWithPlaceholder";
import { useTranslation } from "react-i18next";
import { useGetLoginOtpMutation } from "../../apiServices/login/otpBased/SendOtpApi";
import { useGetNameMutation } from "../../apiServices/login/GetNameByMobile";

// create a component
const ForgotMpin = (params) => {
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(false);
  const [message, setMessage] = useState();
  const [isEditable, setIsEditable] = useState(true);

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const { t } = useTranslation();
  const navigation = useNavigation();
  let navigationParams = params.route.params
  console.log("parraaa", navigationParams)

  const user_type_id = params.route.params.user_type_id;
  const user_type = params.route.params.user_type;

  const [
    sendOtpFunc,
    {
      data: sendOtpData,
      error: sendOtpError,
      isLoading: sendOtpIsLoading,
      isError: sendOtpIsError,
    },
  ] = useGetLoginOtpMutation();

  const [
    getNameFunc,
    {
      data: getNameData,
      error: getNameError,
      isLoading: getLoading,
      isError: getIsError,
    },
  ] = useGetNameMutation();

  

  useEffect(() => {
    if (sendOtpData) {
      console.log("sendOtpData", sendOtpData);
      if (sendOtpData?.success === true && mobile.length === 10) {
        if (Object.keys(getNameData?.body)?.length != 0) {
          const nameData = getNameData?.body;
          navigation.navigate("VerifyOtpForMpin", {
            navigationParams,
            kycData: nameData,
            from: "ForgotMpin"
          });
        }
      } else {
        console.log("Trying to open error modal");
      }
    //   setHideButton(false);
    } else if (sendOtpError) {
      console.log("err", sendOtpError);

      if (sendOtpError.status == 400) setAlert(true);
      else setError(true);

    //   setHideButton(false);
      setMessage(sendOtpError?.data?.message);
    }
  }, [sendOtpData, sendOtpError]);

  useEffect(() => {
    if (getNameData) {
      console.log("getNameData", getNameData);
      if (getNameData?.success) {
        if (getNameData?.body?.mobile) {
          setMobile(getNameData?.body.mobile);
        } else {
          setError(true);
          setMessage("Invalid UID");
        }

        setIsEditable(checkKyc());
      }
    } else if (getNameError) {
      console.log("getNameError", getNameError);
    }
  }, [getNameData, getNameError]);

  //functions
  const getUid = (data) => {
    console.log("UID DATA", data);
    setName(data);
    // const reg = '^([0|+[0-9]{1,5})?([6-9][0-9]{9})$';
    // const mobReg = new RegExp(reg)

    //   setMobile(data)
    //   if (data !== undefined) {
    //     if (data.length === 10) {
    //       if(mobReg.test(data))
    //     {
    // getNameFunc({ mobile: data })
    if (data.length === 6) getNameFunc({ uid: data });

    if (getNameData?.body.mobile && data.length !== 6) {
      setMobile("");
    }

    //     Keyboard.dismiss();
    //   }
    //   else{
    //     setError(true)
    //     setMessage("Please enter a valid mobile number")
    //   }
    // }
    // }
  };
  const getMobile = (data) => {
    console.log("Data getting function", data);
    if (data !== undefined) {
      const reg = "^([0|+[0-9]{1,5})?([6-9][0-9]{9})$";
      const mobReg = new RegExp(reg);

      setMobile(data);
      // console.log("userexistbody",name, mobile,data)

      if (data !== undefined) {
        if (data.length === 10) {
          if (mobReg.test(data)) {
            setMobile(data);
          } else {
            Alert.alert("Kindly enter a valid UID ");
            setMobile("");
          }
        }
      }
    }
  };
  const checkKyc = () => {
    if (getNameData?.body?.is_valid_aadhar && getNameData?.body?.is_valid_pan) {
      return false;
    } else if (
      getNameData?.body?.is_valid_gstin &&
      getNameData?.body?.is_valid_aadhar
    ) {
      return false;
    }
  };

  const sendOtp = () =>{
    sendOtpFunc({ mobile, name, user_type, user_type_id })
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          backgroundColor: ternaryThemeColor,
          alignItems: "center",
          height: 80,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            position: "absolute",
            left: 10,
            top: 27,
          }}
        >
          <Image
            style={{
              height: 30,
              width: 30,
              resizeMode: "contain",
            }}
            source={require("../../../assets/images/blackBack.png")}
          />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: 55,
            marginTop: 0,
            fontSize: 20,
            color: "white",
            fontWeight: "bold",
          }}
        >
          Forgot MPIN
        </Text>
      </View>
      <View>
        <KeyboardAvoidingView>
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
            }}
          >
            <TextInputRectangularWithPlaceholder
              placeHolder={t("UID")}
              handleData={getUid}
              value={name}
            ></TextInputRectangularWithPlaceholder>

            <TextInputRectangularWithPlaceholder
              placeHolder={t("mobile")}
              handleData={getMobile}
              value={mobile}
              maxLength={10}
              editable={false}
              keyboardType="numeric"
            ></TextInputRectangularWithPlaceholder>
            {mobile && (
              <TouchableOpacity onPress={sendOtp} style={{backgroundColor:ternaryThemeColor, width:200, height:50,alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'white',fontWeight:'800'}}>Reset MPIN</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

//make this component available to the app
export default ForgotMpin;
