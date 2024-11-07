import React, { useCallback, useEffect, useId, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions,
  Text,
} from "react-native";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useSelector, useDispatch } from "react-redux";
import TextInputRectangleMandatory from "../../components/atoms/input/TextInputRectangleMandatory";
import TextInputRectangle from "../../components/atoms/input/TextInputRectangle";
import TextInputNumericRectangle from "../../components/atoms/input/TextInputNumericRectangle";
import InputDate from "../../components/atoms/input/InputDate";
import ImageInput from "../../components/atoms/input/ImageInput";
import * as Keychain from "react-native-keychain";
import MessageModal from "../../components/modals/MessageModal";
import RegistrationProgress from "../../components/organisms/RegistrationProgress";
import { useGetFormAccordingToAppUserTypeMutation } from "../../apiServices/workflow/GetForms";
import ButtonOval from "../../components/atoms/buttons/ButtonOval";
import {
  useRegisterUserByBodyMutation,
  useUpdateProfileAtRegistrationMutation,
} from "../../apiServices/register/UserRegisterApi";
import TextInputAadhar from "../../components/atoms/input/TextInputAadhar";
import TextInputPan from "../../components/atoms/input/TextInputPan";
import TextInputGST from "../../components/atoms/input/TextInputGST";
import ErrorModal from "../../components/modals/ErrorModal";
import Geolocation from "@react-native-community/geolocation";
import axios from "axios";
import PrefilledTextInput from "../../components/atoms/input/PrefilledTextInput";
import { useGetLocationFromPinMutation } from "../../apiServices/location/getLocationFromPincode";
import PincodeTextInput from "../../components/atoms/input/PincodeTextInput";
import OtpInput from "../../components/organisms/OtpInput";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import { useGetLoginOtpMutation } from "../../apiServices/login/otpBased/SendOtpApi";
import { useGetAppLoginMutation } from "../../apiServices/login/otpBased/OtpLoginApi";
import { useVerifyOtpMutation } from "../../apiServices/login/otpBased/VerifyOtpApi";
import { useGetLoginOtpForVerificationMutation } from "../../apiServices/otp/GetOtpApi";
import { useVerifyOtpForNormalUseMutation } from "../../apiServices/otp/VerifyOtpForNormalUseApi";
import DropDownRegistration from "../../components/atoms/dropdown/DropDownRegistration";
import EmailTextInput from "../../components/atoms/input/EmailTextInput";
import { validatePathConfig } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import { GoogleMapsKey } from "@env";
import { useTranslation } from "react-i18next";
import {
  RegistrationMessage,
  clientName,
  eKyc,
} from "../../utils/HandleClientSetup";

const BasicInfo = ({ navigation, route }) => {
  const [userName, setUserName] = useState(route.params.name);
  const [userMobile, setUserMobile] = useState(route.params.mobile);
  const [message, setMessage] = useState();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [registrationForm, setRegistrationForm] = useState([]);
  const [responseArray, setResponseArray] = useState([]);
  const [isManuallyApproved, setIsManuallyApproved] = useState();
  const [modalTitle, setModalTitle] = useState();
  const [needsAadharVerification, setNeedsAadharVerification] = useState(false);
  const [location, setLocation] = useState();
  const [formFound, setFormFound] = useState(true);
  const [isCorrectPincode, setIsCorrectPincode] = useState(true);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [hideButton, setHideButton] = useState(false);
  const [timer, setTimer] = useState(0);
  const [aadhaarVerified, setAadhaarVerified] = useState(true);
  const [pansVerified, setPansVerified] = useState(true);
  const [gstVerified, setGstVerified] = useState(true);
  const [mobileVerified, setMobileVerified] = useState();
  const[isLoading, setisLoading] = useState(false)
  const[otpLoadoing, setotpLoading] = useState(false)
  
  const timeOutCallback = useCallback(
    () => setTimer((currTimer) => currTimer - 1),
    []
  );
  const focused = useIsFocused();
  let showSubmit = true;

  const dispatch = useDispatch();

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";

  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  )
    ? useSelector((state) => state.apptheme.secondaryThemeColor)
    : "#FFB533";
  const isOnlineVerification = useSelector(
    (state) => state.apptheme.isOnlineVerification
  );
  const userData = useSelector((state) => state.appusersdata.userData);
  const appUsers = useSelector((state) => state.appusers.value);
  const manualApproval = useSelector((state) => state.appusers.manualApproval);
  const userType = route.params.userType;
  const userTypeId = route.params.userId;
  const needsApproval = route.params.needsApproval;
  const navigatingFrom = route.params.navigatingFrom;
  const registrationRequired =
    route.params.registrationRequired != undefined
      ? route.params.registrationRequired
      : true;
  console.log(
    "registration required basic info",
    registrationRequired,
    navigatingFrom
  );
  // const navigationParams = { "needsApproval": needsApproval, "userId": userTypeId, "user_type": userType, "mobile": mobile, "name": name, "registrationRequired":registrationRequired}
  const navigationParams = {
    needsApproval: needsApproval,
    userId: userTypeId,
    userType: userType,
    registrationRequired: true,
  };
  console.log("navigation params from basic info", navigationParams);
  const name = route.params?.name;
  const mobile = route.params?.mobile;
  console.log(
    "appUsers",
    userType,
    userTypeId,
    isManuallyApproved,
    name,
    mobile
  );
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const { t } = useTranslation();
  const gifUri = Image.resolveAssetSource(
    require("../../../assets/gif/loader.gif")
  ).uri;

  let timeoutId;

  const [
    getFormFunc,
    {
      data: getFormData,
      error: getFormError,
      isLoading: getFormIsLoading,
      isError: getFormIsError,
    },
  ] = useGetFormAccordingToAppUserTypeMutation();

  const [
    registerUserFunc,
    {
      data: registerUserData,
      error: registerUserError,
      isLoading: registerUserIsLoading,
      isError: registerUserIsError,
    },
  ] = useRegisterUserByBodyMutation();

  const [
    updateProfileAtRegistrationFunc,
    {
      data: updateProfileAtRegistrationData,
      error: updateProfileAtRegistrationError,
      isLoading: updateProfileAtRegistrationIsLoading,
      isError: updateProfileAtRegistrationIsError,
    },
  ] = useUpdateProfileAtRegistrationMutation();

  const [
    getLocationFromPincodeFunc,
    {
      data: getLocationFormPincodeData,
      error: getLocationFormPincodeError,
      isLoading: getLocationFormPincodeIsLoading,
      isError: getLocationFromPincodeIsError,
    },
  ] = useGetLocationFromPinMutation();

  // send otp for login--------------------------------
  const [
    sendOtpFunc,
    {
      data: sendOtpData,
      error: sendOtpError,
      isLoading: sendOtpIsLoading,
      isError: sendOtpIsError,
    },
  ] = useGetLoginOtpForVerificationMutation();

  const [
    verifyOtpFunc,
    {
      data: verifyOtpData,
      error: verifyOtpError,
      isLoading: verifyOtpIsLoading,
      isError: verifyOtpIsError,
    },
  ] = useVerifyOtpForNormalUseMutation();

  useEffect(() => {
    if (timer > 0) {
      timeoutId = setTimeout(timeOutCallback, 1000);
    }
    return () => clearTimeout(timeoutId);
  }, [timer, timeOutCallback]);

  useEffect(() => {
    setUserName(route.params.name);
  }, [route.params.name]);

  useEffect(() => {
    console.log(
      "mobile number from use effect",
      route.params.mobile,
      navigatingFrom
    );
    setUserMobile(route.params.mobile);
  }, [route.params.mobile]);

  useEffect(() => {
    const AppUserType = userType;
    getFormFunc({ AppUserType });
    if (manualApproval.includes(userType)) {
      setIsManuallyApproved(true);
    } else {
      setIsManuallyApproved(false);
    }
  }, []);

  useEffect(() => {
    setHideButton(false);
  }, [focused]);

  useEffect(() => {
    if (verifyOtpData?.success) {
      setotpLoading(false)
      setOtpVerified(true);
      setOtpModal(true);
      console.log("verifyOtp", verifyOtpData);
      setMessage("OTP Verified");
    } else if (verifyOtpError) {
      console.log("verifyOtpError", verifyOtpError);
      setError(true);
      setMessage("Please Enter Correct OTP");
      setotpLoading(false)

    }
  }, [verifyOtpData, verifyOtpError]);

  useEffect(() => {
    let lat = "";
    let lon = "";
    Geolocation.getCurrentPosition((res) => {
      console.log("res", res);
      lat = res.coords.latitude;
      lon = res.coords.longitude;
      // getLocation(JSON.stringify(lat),JSON.stringify(lon))
      console.log("latlong", lat, lon);
      var url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${res.coords.latitude},${res.coords.longitude}
        &location_type=ROOFTOP&result_type=street_address&key=${GoogleMapsKey}`;

      fetch(url)
        .then((response) => response.json())
        .then((json) => {
          console.log("location address=>", JSON.stringify(json));
          const formattedAddress = json.results[0].formatted_address;
          const formattedAddressArray = formattedAddress?.split(",");

          let locationJson = {
            lat:
              json.results[0].geometry.location.lat === undefined
                ? "N/A"
                : json.results[0].geometry.location.lat,
            lon:
              json.results[0].geometry.location.lng === undefined
                ? "N/A"
                : json.results[0].geometry.location.lng,
            address: formattedAddress === undefined ? "N/A" : formattedAddress,
          };

          const addressComponent = json.results[0].address_components;
          console.log("addressComponent", addressComponent);
          for (let i = 0; i <= addressComponent.length; i++) {
            if (i === addressComponent.length) {
              dispatch(setLocation(locationJson));
              setLocation(locationJson);
            } else {
              if (addressComponent[i].types.includes("postal_code")) {
                console.log("inside if");

                console.log(addressComponent[i].long_name);
                locationJson["postcode"] = addressComponent[i].long_name;
              } else if (addressComponent[i].types.includes("country")) {
                console.log(addressComponent[i].long_name);

                locationJson["country"] = addressComponent[i].long_name;
              } else if (
                addressComponent[i].types.includes(
                  "administrative_area_level_1"
                )
              ) {
                console.log(addressComponent[i].long_name);

                locationJson["state"] = addressComponent[i].long_name;
              } else if (
                addressComponent[i].types.includes(
                  "administrative_area_level_3"
                )
              ) {
                console.log(addressComponent[i].long_name);

                locationJson["district"] = addressComponent[i].long_name;
              } else if (addressComponent[i].types.includes("locality")) {
                console.log(addressComponent[i].long_name);

                locationJson["city"] = addressComponent[i].long_name;
              }
            }
          }

          console.log("formattedAddressArray", locationJson);
        });
    });
  }, []);
  useEffect(() => {
    if (getLocationFormPincodeData) {
      console.log("getLocationFormPincodeData", getLocationFormPincodeData);
      if (getLocationFormPincodeData.success) {
        const address =
          getLocationFormPincodeData.body[0].office +
          ", " +
          getLocationFormPincodeData.body[0].district +
          ", " +
          getLocationFormPincodeData.body[0].state +
          ", " +
          getLocationFormPincodeData.body[0].pincode;
        let locationJson = {
          lat: "N/A",
          lon: "N/A",
          address: address,
          city: getLocationFormPincodeData.body[0].district,
          district: getLocationFormPincodeData.body[0].division,
          state: getLocationFormPincodeData.body[0].state,
          country: "N/A",
          postcode: getLocationFormPincodeData.body[0].pincode,
        };
        console.log("getLocationFormPincodeDataLocationJson", locationJson);
        setLocation(locationJson);
      }
    } else if (getLocationFormPincodeError) {
      console.log("getLocationFormPincodeError", getLocationFormPincodeError);
      setError(true);
      setMessage(getLocationFormPincodeError.data.message);
    }
  }, [getLocationFormPincodeData, getLocationFormPincodeError]);

  useEffect(() => {
    if (getFormData) {
      if (getFormData.message !== "Not Found") {
        console.log("Form Fields", JSON.stringify(getFormData));

        const values = Object.values(getFormData.body.template);
        setRegistrationForm(values);
      } else {
        setError(true);
        setMessage("Form can't be fetched");
        setFormFound(false);
      }
    } else if (getFormError) {
      console.log("Form Field Error", getFormError);
    }
  }, [getFormData, getFormError]);

  useEffect(() => {
    if (registerUserData) {
      console.log("data after submitting form", registerUserData);
      if (registerUserData.success) {
        setSuccess(true);
        setMessage(RegistrationMessage);
        setModalTitle("Greetings");
      }
      setHideButton(false);

      // const values = Object.values(registerUserData.body.template)
      // setRegistrationForm(values)
    } else if (registerUserError) {
      console.log("form submission error", registerUserError);
      setError(true);
      setMessage(registerUserError.data.message);
      setHideButton(false);
    }
  }, [registerUserData, registerUserError]);

  useEffect(() => {
    if (updateProfileAtRegistrationData) {
      console.log(
        "updateProfileAtRegistrationData",
        updateProfileAtRegistrationData
      );
      if (updateProfileAtRegistrationData.success) {
        setSuccess(true);
        setMessage(updateProfileAtRegistrationData.message);
        setModalTitle("WOW");
      }

      // const values = Object.values(updateProfileAtRegistrationData.body.template)
      // setRegistrationForm(values)
    } else if (updateProfileAtRegistrationError) {
      console.log(
        "updateProfileAtRegistrationError",
        updateProfileAtRegistrationError
      );
      setError(true);
      // setMessage(updateProfileAtRegistrationError.data.message)
    }
  }, [updateProfileAtRegistrationData, updateProfileAtRegistrationError]);
  useEffect(() => {
    if (sendOtpData) {
      console.log("sendOtpData", sendOtpData);
      setOtpVisible(true);
    } else {
      console.log("sendOtpError", sendOtpError);
    }
  }, [sendOtpData, sendOtpError]);

  const handleTimer = () => {
    if (userMobile) {
      if (userMobile.length == 10) {
        if (timer === 60) {
          getOTPfunc();
          setOtpVisible(true);
        }
        if (timer === 0 || timer === -1) {
          setTimer(60);
          getOTPfunc();
          setOtpVisible(true);
        }
      } else {
        setError(true);
        setMessage("Mobile number length must be 10");
      }
    } else {
      setError(true);
      setMessage("Kindly enter mobile number");
    }
  };

  const isValidEmail = (text) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(text);
  };

  const handleFetchPincode = (data) => {
    console.log("pincode is", data);
    getLocationFromPinCode(data);
  };

  const handleChildComponentData = (data) => {
    if (data?.name == "aadhar") {
      console.log("handleChildComponentData", data);
    }
    // setOtpVisible(true)
    if (data?.name === "name") {
      setUserName(data?.value);
    }
    // console.log("isValidEmail", isValidEmail(data.value))

    if (data?.name === "email") {
      console.log("from text input", data?.name);

      console.log("isValidEmail", isValidEmail(data?.value), isValid);
    }
    if (data?.name === "aadhar") {
      console.log("aadhar input returned", data?.value?.length);

      if (data?.value?.length == 0 || data?.value == undefined) {
        setHideButton(false);
      } else if (data?.value.length < 12) {
        setHideButton(true);
      }
    }

    if (data?.name === "mobile") {
      const reg = "^([0|+[0-9]{1,5})?([6-9][0-9]{9})$";
      const mobReg = new RegExp(reg);
      if (data?.value?.length === 10) {
        if (mobReg.test(data?.value)) {
          setUserMobile(data?.value);
        } else {
          setError(true);
          setMessage("Please enter a valid mobile number");
        }
      }
    }
    // Update the responseArray state with the new data
    setResponseArray((prevArray) => {
      const existingIndex = prevArray.findIndex(
        (item) => item.name === data.name
      );

      if (existingIndex !== -1) {
        // If an entry for the field already exists, update the value
        const updatedArray = [...prevArray];
        updatedArray[existingIndex] = {
          ...updatedArray[existingIndex],
          value: data?.value,
        };
        return updatedArray;
      } else {
        // If no entry exists for the field, add a new entry
        return [...prevArray, data];
      }
    });
  };

  console.log("responseArray", responseArray);
  const modalClose = () => {
    setError(false);
  };

  const getLocationFromPinCode = (pin) => {
    setisLoading(true)
    console.log("getting location from pincode", pin);
    var url = `http://postalpincode.in/api/pincode/${pin}`;

    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        console.log("location address=>", JSON.stringify(json));
        if (json.PostOffice === null) {
          setError(true);
          setMessage("Pincode data cannot be retrieved.");
          setIsCorrectPincode(false);
          setisLoading(false)
        } else {
          setIsCorrectPincode(true);
          setisLoading(false)
          const locationJson = {
            postcode: pin,
            district: json.PostOffice[0].District,
            state: json.PostOffice[0].State,
            country: json.PostOffice[0].Country,
            city: json.PostOffice[0].Region,
          };
          setLocation(locationJson);
        }
      });
  };

  const getOtpFromComponent = (value) => {
    if (value.length === 6) {
      setOtp(value);

      const params = {
        mobile: userMobile,
        name: userName,
        otp: value,
        user_type_id: userTypeId,
        user_type: userType,
        type: "login",
      };
      setotpLoading(true)

      verifyOtpFunc(params);
    }
  };

  const getOTPfunc = () => {
    console.log("get user data", userData);

    console.log("ooooooo->>>>>>>>", {
      userName,
      userMobile,
      userTypeId,
      userType,
    });
    const params = {
      mobile: userMobile,
      name: userName,
      user_type_id: userTypeId,
      user_type: userType,
      type: "registration",
    };
    sendOtpFunc(params);
  };

  const panVerified = (bool) => {
    console.log("Pan Verified", bool);

    if (bool) {
      setPansVerified(true);
    } else {
      setPansVerified(false);
    }
  };

  console.log("panVerifiedhideButton", hideButton);

  const addharVerified = (bool) => {
    console.log("aadhar text input status", bool);
    if (!bool) {
      setAadhaarVerified(false);
      setHideButton(true);
    } else {
      setHideButton(false);
    }
  };

  //   const handleRegistrationFormSubmission = () => {
  //     console.log("handleRegistrationFormSubmission", registrationForm)
  //     const inputFormData = {};
  //     let isFormValid = true;
  //     let missingParam = "";

  //     inputFormData["user_type"] = userType;
  //     inputFormData["user_type_id"] = userTypeId;
  //     inputFormData["is_approved_needed"] = isManuallyApproved;
  //     inputFormData["name"] = name;
  //     inputFormData["mobile"] = mobile;

  //     for (var i = 0; i < responseArray.length; i++) {
  //         inputFormData[responseArray[i].name] = responseArray[i].value;

  //         if (responseArray[i].required && !responseArray[i].value) {
  //           console.log("missing params",responseArray[i].name)
  //             isFormValid = false;
  //             missingParam = responseArray[i].label;
  //             break;
  //         }

  //         if (responseArray[i].required && responseArray[i].name === "pincode" && responseArray[i].value.length !== 6) {
  //             isFormValid = false;
  //             missingParam = "Pincode must be exactly 6 digits";
  //             break;
  //         }
  //     }

  //     console.log("missing params", missingParam);

  //     const body = inputFormData;
  //     console.log("registration output", body);

  //     if (otpVerified) {
  //         const keys = Object.keys(body);
  //         const values = Object.values(body);
  //         if(keys.includes('pincode'))
  //         {
  //           if(!isCorrectPincode)
  //           {
  //             setError(true);
  //             setMessage("Pincode must be verified first");
  //           }
  //         }
  //         if (keys.includes('email')) {
  //             const index = keys.indexOf('email');
  //             if (isValidEmail(values[index])) {
  //                 if (isFormValid) {
  //                   if(keys.includes('pincode'))
  //                   {
  //                     if(!isCorrectPincode)
  //                     {
  //                       setError(true);
  //                       setMessage("Pincode must be verified first");
  //                     }
  //                     else{
  //                       registerUserFunc(body);
  //                       setHideButton(true);
  //                     }
  //                   }

  //                 } else {
  //                     setError(true);
  //                     setMessage(missingParam);
  //                 }
  //             } else {
  //                 setError(true);
  //                 setMessage("Email isn't verified");
  //             }
  //         } else {
  //             if (isFormValid) {
  //               if(keys.includes('pincode'))
  //               {
  //                 if(!isCorrectPincode)
  //                 {
  //                   setError(true);
  //                   setMessage("Pincode must be verified first");
  //                 }
  //                 else{
  //                   registerUserFunc(body);

  //                 }
  //               }

  //             } else {
  //                 setError(true);
  //                 setMessage(missingParam);
  //             }
  //         }
  //     } else {
  //         setError(true);
  //         setMessage(t("Otp isn't verified yet"));
  //     }

  //     console.log("responseArraybody", body);
  // };

  const handleRegistrationFormSubmission = () => {
    console.log("handleRegistrationFormSubmission", responseArray);
    const inputFormData = {};
    let isFormValid = true;
    let missingParam = "";

    inputFormData["user_type"] = userType;
    inputFormData["user_type_id"] = userTypeId;
    inputFormData["is_approved_needed"] = isManuallyApproved;
    inputFormData["name"] = name;
    inputFormData["mobile"] = mobile;

    // Create a map for quick lookup of responseArray fields
    const responseMap = new Map();
    for (let i = 0; i < responseArray.length; i++) {
      responseMap.set(responseArray[i].name, responseArray[i].value);
    }
    console.log("responseMap", responseMap);
    // Check for required fields and missing values
    for (let i = 0; i < registrationForm.length; i++) {
      const field = registrationForm[i];
      console.log("Field", field);
      if (field.required) {
        const value = responseMap.get(field.name);
        console.log("didnt get value for", value, field.name);
        if (!value) {
          isFormValid = false;
          missingParam = field.label;
          break;
        }
        if (field.name === "pincode" && value.length !== 6) {
          isFormValid = false;
          missingParam = "Pincode must be exactly 6 digits";
          break;
        }
      }
    }

    console.log("missing params", missingParam);

    // Populate inputFormData with responseArray values
    for (let i = 0; i < responseArray.length; i++) {
      inputFormData[responseArray[i].name] = responseArray[i].value;
    }
    inputFormData["login_type"] = navigatingFrom == "OtpLogin" ? "otp" : "uidp";
    const body = inputFormData;
    console.log("registration output", body);

    if (otpVerified) {
      const keys = Object.keys(body);
      const values = Object.values(body);

      if (keys.includes("pincode") && !isCorrectPincode) {
        setError(true);
        setMessage("Pincode must be verified first");
        return;
      }

      if (keys.includes("email")) {
        const index = keys.indexOf("email");
        if (isValidEmail(values[index])) {
          if (isFormValid) {
            registerUserFunc(body);
            setHideButton(true);
          } else {
            setError(true);
            setMessage(missingParam);
          }
        } else {
          setError(true);
          setMessage("Email isn't verified");
        }
      } else {
        if (isFormValid) {
          registerUserFunc(body);
        } else {
          setError(true);
          setMessage(missingParam);
        }
      }
    } else {
      setError(true);
      setMessage(t("Otp isn't verified yet"));
    }

    console.log("responseArraybody", body);
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        backgroundColor: ternaryThemeColor,
        height: "100%",
      }}
    >
      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
        ></ErrorModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          title={modalTitle}
          message={message}
          openModal={success}
          navigateTo={
            navigatingFrom === "PasswordLogin" ? "PasswordLogin" : "OtpLogin"
          }
          params={{
            needsApproval: needsApproval,
            userType: userType,
            userId: userTypeId,
            registrationRequired: registrationRequired,
          }}
        ></MessageModal>
      )}
      {/* 
      {otpModal && (
        <MessageModal
          modalClose={() => { setOtpModal(false) }}
          title={modalTitle}
          message={message}
          openModal={otpModal}
          // navigateTo={navigatingFrom === "PasswordLogin" ? "PasswordLogin" : "OtpLogin"}
          params={{ needsApproval: needsApproval, userType: userType, userId: userTypeId }}></MessageModal>
      )} */}

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "9%",
        }}
      >
        <TouchableOpacity
          style={{
            height: 24,
            width: 24,
            position: "absolute",
            top: 30,
            left: 10,
          }}
          onPress={() => {
            navigation.navigate("OtpLogin", navigationParams);
          }}
        >
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: "contain",
              marginLeft: 10,
            }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: 27,
            left: 50,
          }}
        >
          <PoppinsTextMedium
            content={t("registration")}
            style={{
              marginLeft: 5,
              fontSize: 20,
              fontWeight: "700",
              color: "white",
            }}
          ></PoppinsTextMedium>
        </View>
      </View>
      <ScrollView style={{ width: "100%" }}>
        <View
          style={{
            width: width,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: 20,
          }}
        >
          {formFound ? (
            <PoppinsTextMedium
              style={{
                color: "black",
                fontWeight: "700",
                fontSize: 18,
                // marginBottom: 40,
                borderBottomColor:'#808080',
                paddingBottom:20,
                borderBottomWidth:0.4
                
              }}
              content={t("Please Fill The Following Form To Register")}
            ></PoppinsTextMedium>
          ) : (
            <PoppinsTextMedium
              style={{
                color: "black",
                fontWeight: "700",
                fontSize: 18,
                marginBottom: 40,
              }}
              content="No Form Available !!"
            ></PoppinsTextMedium>
          )}

          <Text style={{}}></Text>
          

          {/* <RegistrationProgress data={["Basic Info","Business Info","Manage Address","Other Info"]}></RegistrationProgress> */}
          {registrationForm &&
            registrationForm.map((item, index) => {
              if (item.type === "text") {
                console.log("the user name", userName);
                if (item.name === "phone" || item.name === "mobile") {
                  return (
                    <>
                      <View style={{ flexDirection: "row", flex: 1 }}>
                        <View style={{ flex: 0.75 }}>
                          {navigatingFrom === "OtpLogin" && (
                            <TextInputNumericRectangle
                              jsonData={item}
                              key={index}
                              maxLength={10}
                              handleData={handleChildComponentData}
                              placeHolder={item.name}
                              value={userMobile}
                              displayText={item.name}
                              label={item.label}
                              keyboardType="number-pad"
                              // textContentType="telephoneNumber"
                              autoComplete="tel"
                              isEditable={true}
                            >
                              {" "}
                            </TextInputNumericRectangle>
                          )}
                          {navigatingFrom === "PasswordLogin" && (
                            <TextInputNumericRectangle
                              jsonData={item}
                              key={index}
                              maxLength={10}
                              handleData={handleChildComponentData}
                              placeHolder={item.name}
                              label={item.label}
                            >
                              {" "}
                            </TextInputNumericRectangle>
                          )}
                        </View>

                        {otpVerified ? (
                          <View style={{ flex: 0.15 }}>
                            <Image
                              style={{
                                height: 30,
                                width: 30,
                                resizeMode: "contain",
                                position: "absolute",
                                top: 15,
                              }}
                              source={require("../../../assets/images/greenTick.png")}
                            ></Image>
                          </View>
                        ) : ( 
                          <TouchableOpacity
                            style={{
                              flex: 0.15,
                              marginTop: 12,
                              backgroundColor: ternaryThemeColor,
                              alignItems: "center",
                              justifyContent: "center",
                              height: 45,
                              borderRadius: 5,
                              marginRight: 10,
                            }}
                            onPress={() => {
                              handleTimer();
                            }}
                          >
                            <PoppinsTextLeftMedium
                              style={{
                                color: "white",
                                fontWeight: "bold",
                                paddingHorizontal: 10,
                              }}
                              content={t("get otp")}
                            ></PoppinsTextLeftMedium>
                          </TouchableOpacity>
                        )}
                        {(sendOtpIsLoading || verifyOtpIsLoading )&& (
                          <FastImage
                            style={{
                              width: 40,
                              height: 40,
                              alignSelf: "center",
                            }}
                            source={{
                              uri: gifUri, // Update the path to your GIF
                              priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        )}
                      </View>

                      {console.log("conditions", otpVerified, otpVisible)}
                      {!otpVerified && otpVisible && (
                        <>
                          <PoppinsTextLeftMedium
                            style={{ marginRight: "70%" }}
                            content="OTP"
                          ></PoppinsTextLeftMedium>

                          <OtpInput
                            getOtpFromComponent={getOtpFromComponent}
                            color={"white"}
                          ></OtpInput>

                          <View
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 4,
                              }}
                            >
                              <Image
                                style={{
                                  height: 20,
                                  width: 20,
                                  resizeMode: "contain",
                                }}
                                source={require("../../../assets/images/clock.png")}
                              ></Image>
                              <Text
                                style={{
                                  color: ternaryThemeColor,
                                  marginLeft: 4,
                                }}
                              >
                                {timer}
                              </Text>
                            </View>
                            <View
                              style={{
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                style={{
                                  color: ternaryThemeColor,
                                  marginTop: 10,
                                }}
                              >
                                Didn't recieve any Code?
                              </Text>

                              <Text
                                onPress={() => {
                                  handleTimer();
                                }}
                                style={{
                                  color: ternaryThemeColor,
                                  marginTop: 6,
                                  fontWeight: "600",
                                  fontSize: 16,
                                }}
                              >
                                Resend Code
                              </Text>
                            </View>
                          </View>
                        </>
                      )}
                    </>
                  );
                } else if (item.name.trim().toLowerCase() === "name") {
                  return (
                    <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      displayText={t(item.name.toLowerCase().trim())}
                      value={userName}
                      label={item.label}
                      isEditable={true}
                      autoComplete="name"
                    ></PrefilledTextInput>
                  );
                } else if (item.name.trim().toLowerCase() === "email") {
                  return (
                    <EmailTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      displayText={t(item.name.trim())}
                      label={item.label}
                      autoComplete="email"
                      // isValidEmail = {isValidEmail}
                    ></EmailTextInput>
                  );
                }

                // }
                else if (
                  eKyc &&
                  (item.name === "aadhaar" || item.name === "aadhar")
                ) {
                  console.log("aadhar");
                  return (
                    <TextInputAadhar
                      required={item.required}
                      jsonData={item}
                      key={index}
                      notVerified={addharVerified}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      displayText={t(item.name.toLowerCase().trim())}
                      label={item.label}
                    >
                      {" "}
                    </TextInputAadhar>
                  );
                } else if (eKyc && item.name === "pan") {
                  console.log("pan");
                  return (
                    <TextInputPan
                      required={item.required}
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      label={item.label}
                      displayText={item.name}
                      panVerified={panVerified}
                    >
                      {" "}
                    </TextInputPan>
                  );
                }
                 else if (eKyc && item.name === "gstin") {
                  console.log("gstin");
                  return (
                    <View style={{width:'92%', marginLeft:-40}}>
                       <TextInputGST
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      label={item.label}
                    >
                      {" "}
                    </TextInputGST>
                      </View>
                   
                  );
                } else if (item.name.trim().toLowerCase() === "city") {
                  return (
                    <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      value={location?.city}
                      displayText={item.name}
                      label={item.label}
                      isEditable={true}
                    ></PrefilledTextInput>
                  );
                } else if (item.name.trim().toLowerCase() === "pincode") {
                  return (
                    <View style={{width:'90%',}}>
                      <PincodeTextInput
                        jsonData={item}
                        key={index}
                        handleData={handleChildComponentData}
                        handleFetchPincode={handleFetchPincode}
                        placeHolder={item.name}
                        value={location?.postcode}
                        label={item.label}
                        displayText={item.name}
                        autoComplete="postal-address"
                        maxLength={6}
                      ></PincodeTextInput>

                      {(isLoading) && (
                        <FastImage
                          style={{
                            width: 30,
                            height: 30,
                            alignSelf: "center",
                            position: "absolute",
                            right: 70,
                            top:25
                          }}
                          source={{
                            uri: gifUri, // Update the path to your GIF
                            priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.contain}
                        />
                      )}
                    </View>
                  );
                }

                // else if ((item.name).trim().toLowerCase() === "pincode" ) {

                //   return (
                //     <PincodeTextInput
                //       jsonData={item}
                //       key={index}
                //       handleData={handleChildComponentData}
                //       handleFetchPincode={handleFetchPincode}
                //       placeHolder={item.name}

                //       label={item.label}
                //       maxLength={6}
                //     ></PincodeTextInput>
                //   )
                // }
                else if (item.name.trim().toLowerCase() === "state") {
                  return (
                    <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      value={location?.state}
                      label={item.label}
                      displayText={item.name}
                      isEditable={false}
                    ></PrefilledTextInput>
                  );
                } else if (item.name.trim().toLowerCase() === "district") {
                  return (
                    <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      value={location?.district}
                      label={item.label}
                      displayText={item.name}
                      isEditable={false}
                    ></PrefilledTextInput>
                  );
                } else {
                  return (
                    <TextInputRectangle
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      label={item.label}
                    >
                      {" "}
                    </TextInputRectangle>
                  );
                }
              } else if (item.type === "file") {
                return (
                  <ImageInput
                    jsonData={item}
                    handleData={handleChildComponentData}
                    key={index}
                    data={item.name}
                    label={item.label}
                    action="Select File"
                  ></ImageInput>
                );
              } else if (item.type === "select") {
                return (
                  <DropDownRegistration
                    title={item.name}
                    header={item.options[0]}
                    jsonData={item}
                    data={item.options}
                    handleData={handleChildComponentData}
                  ></DropDownRegistration>
                );
              } else if (item.type === "date") {
                return (
                  <InputDate
                    jsonData={item}
                    handleData={handleChildComponentData}
                    data={item.label}
                    key={index}
                  ></InputDate>
                );
              }
            })}

          {formFound && !hideButton && (
            <ButtonOval
              handleOperation={() => {
                handleRegistrationFormSubmission();
              }}
              content={t("submit")}
              style={{
                paddingLeft: 30,
                paddingRight: 30,
                padding: 10,
                color: "white",
                fontSize: 16,
              }}
            ></ButtonOval>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default BasicInfo;
