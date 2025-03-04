import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Keyboard
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { useGetMPINLoginMutation } from "../../apiServices/login/otpBased/OtpLoginApi";
import {
  setAppUserId,
  setAppUserName,
  setAppUserType,
  setId,
  setUserData,
} from "../../../redux/slices/appUserDataSlice";
import { useFetchLegalsMutation } from "../../apiServices/fetchLegal/FetchLegalApi";
import { useGetAppMenuDataMutation } from "../../apiServices/dashboard/AppUserDashboardMenuAPi.js";
import { useGetLoginOtpMutation } from "../../apiServices/login/otpBased/SendOtpApi";
import { useGetAppUserBannerDataMutation } from "../../apiServices/dashboard/AppUserBannerApi";
import { useGetFormMutation } from "../../apiServices/workflow/GetForms";
import { useGetAppDashboardDataMutation } from "../../apiServices/dashboard/AppUserDashboardApi";
import { useGetWorkflowMutation } from "../../apiServices/workflow/GetWorkflowByTenant";
import { setPolicy, setTerms } from "../../../redux/slices/termsPolicySlice";
import * as Keychain from "react-native-keychain";
import {
  setBannerData,
  setDashboardData,
} from "../../../redux/slices/dashboardDataSlice";
import {
  setIsGenuinityOnly,
  setProgram,
  setWorkflow,
} from "../../../redux/slices/appWorkflowSlice";
import { setDrawerData } from "../../../redux/slices/drawerDataSlice";
import {
  setWarrantyForm,
  setWarrantyFormId,
} from "../../../redux/slices/formSlice";
import ErrorModal from "../../components/modals/ErrorModal";
import { appIcon } from "../../utils/HandleClientSetup";

const MpinValidationScreen = (params) => {
  const [mpin, setMpin] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [parsedJsonValue, setParsedJsonValue] = useState();
  const [openModalWithBorder, setModalWithBorder] = useState(false);
  const [checkKycOption1, setCheckKycOption1] = useState();
  const [checkKycOption2, setCheckKycOption2] = useState();

  const navigationParams = params.route.params || {};
  console.log("Paramssssssssss", navigationParams);

  const refInputs = useRef([]);

  // const kycData = useSelector((state) => state.kycDataSlice.kycData);

  // console.log("kyc data", kycData)

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );

  const dispatch = useDispatch();

  // const [
  //   mpinLoginFunc,
  //   {
  //     data: mpinLoginData,
  //     error: mpinLoginError,
  //     isLoading: mpinLoginIsLoading,
  //     isError: mpinLoginIsError,
  //   },
  // ] = useGetMPINLoginMutation();

  const [
    getTermsAndCondition,
    {
      data: getTermsData,
      error: getTermsError,
      isLoading: termsLoading,
      isError: termsIsError,
    },
  ] = useFetchLegalsMutation();

  const [
    getPolicies,
    {
      data: getPolicyData,
      error: getPolicyError,
      isLoading: policyLoading,
      isError: policyIsError,
    },
  ] = useFetchLegalsMutation();

  const [
    getAppMenuFunc,
    {
      data: getAppMenuData,
      error: getAppMenuError,
      isLoading: getAppMenuIsLoading,
      isError: getAppMenuIsError,
    },
  ] = useGetAppMenuDataMutation();

  const [
    getBannerFunc,
    {
      data: getBannerData,
      error: getBannerError,
      isLoading: getBannerIsLoading,
      isError: getBannerIsError,
    },
  ] = useGetAppUserBannerDataMutation();

  const [
    getFormFunc,
    {
      data: getFormData,
      error: getFormError,
      isLoading: getFormIsLoading,
      isError: getFormIsError,
    },
  ] = useGetFormMutation();

  const [
    getDashboardFunc,
    {
      data: getDashboardData,
      error: getDashboardError,
      isLoading: getDashboardIsLoading,
      isError: getDashboardIsError,
    },
  ] = useGetAppDashboardDataMutation();

  const [
    getWorkflowFunc,
    {
      data: getWorkflowData,
      error: getWorkflowError,
      isLoading: getWorkflowIsLoading,
      isError: getWorkflowIsError,
    },
  ] = useGetWorkflowMutation();

  // let uid = params.route.params.name;
  const userData = useSelector((state) => state.appusersdata.userData);

  const navigation = useNavigation();

  const icon = useSelector((state) => state.apptheme.icon1)
    ? useSelector((state) => state.apptheme.icon1)
    : require("../../../assets/images/demoIcon.png");

  useEffect(() => {
    const fetchTerms = async () => {
      // const credentials = await Keychain.getGenericPassword();
      // const token = credentials.username;
      const params = {
        type: "term-and-condition",
      };
      getTermsAndCondition(params);
    };
    fetchTerms();

    const fetchPolicies = async () => {
      // const credentials = await Keychain.getGenericPassword();
      // const token = credentials.username;
      const params = {
        type: "privacy-policy",
      };
      getPolicies(params);
    };
    fetchPolicies();
  }, []);

  useEffect(() => {
    if (getAppMenuData) {
      // console.log("usertype", userData.user_type)
      console.log("getAppMenuData", JSON.stringify(getAppMenuData));
      if (parsedJsonValue) {
        const tempDrawerData = getAppMenuData.body.filter((item) => {
          return item.user_type === parsedJsonValue.user_type;
        });
        // console.log("tempDrawerData", JSON.stringify(tempDrawerData))
        tempDrawerData && dispatch(setDrawerData(tempDrawerData[0]));
        // mpinLoginData &&  checkKYCDoneStatus(mpinLoginData.body);

        setModalWithBorder(true);
      }
    } else if (getAppMenuError) {
      console.log("getAppMenuError", getAppMenuError);
    }
  }, [getAppMenuData, getAppMenuError]);

  //modal close
  useEffect(() => {
    console.log("running");
    if (openModalWithBorder == true)
      setTimeout(() => {
        console.log("running2");
        modalWithBorderClose();
      }, 2000);
  }, [success, openModalWithBorder]);

  useEffect(() => {
    if (checkKycOption1) {
      navigation.reset({ index: "0", routes: [{ name: "Dashboard" }] });

      // !checkForKyc && navigation.navigate("CheckKycOptions")
    } else if (checkKycOption2) {
      navigation.reset({ index: "0", routes: [{ name: "Dashboard" }] });
    } else if (checkKycOption1 == false && checkKycOption2 == false) {
      navigation.reset({
        index: "0",
        routes: [{ name: "CheckKycOptions", params: { isMPin: true } }],
      });
    }
  }, [checkKycOption1, checkKycOption2]);

  useEffect(() => {
    if (getTermsData) {
      console.log("getTermsData", getTermsData.body.data?.[0]?.files[0]);
      dispatch(setTerms(getTermsData.body.data?.[0]?.files[0]));
    } else if (getTermsError) {
      console.log("gettermserror", getTermsError);
    }
  }, [getTermsData, getTermsError]);

  useEffect(() => {
    if (getPolicyData) {
      console.log("getPolicyData123>>>>>>>>>>>>>>>>>>>", getPolicyData);
      dispatch(setPolicy(getPolicyData?.body?.data?.[0]?.files?.[0]));
    } else if (getPolicyError) {
      setError(true);
      setMessage(getPolicyError?.message);
      console.log("getPolicyError>>>>>>>>>>>>>>>", getPolicyError);
    }
  }, [getPolicyData, getPolicyError]);

  useEffect(() => {
    if (getFormData) {
      // console.log("Form Fields", getFormData?.body)
      dispatch(setWarrantyForm(getFormData?.body?.template));
      dispatch(setWarrantyFormId(getFormData?.body?.form_template_id));
      const fetchMenu = async () => {
        console.log("fetching app menu getappmenufunc");
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log(
            "Credentials successfully loaded for user " + credentials.username
          );
          const token = credentials.username;
          getAppMenuFunc(token);
        }
      };

      fetchMenu();
    } else if (getFormError) {
      console.log("getFormError", getFormError);
      setError(true);
      setMessage("Can't fetch forms for warranty.");
    }
  }, [getFormData, getFormError]);

  useEffect(() => {
    if (getBannerData) {
      // console.log("getBannerData", getBannerData?.body)
      const images = Object.values(getBannerData?.body).map((item) => {
        return item.image[0];
      });
      // console.log("imagesBanner", images)
      dispatch(setBannerData(images));
      console.log("parsedJsonValue", parsedJsonValue);
      parsedJsonValue &&
        getWorkflowFunc({
          userId: parsedJsonValue?.user_type_id,
          token: parsedJsonValue?.token,
        });
    } else if (getBannerError) {
      setError(true);
      setMessage("Unable to fetch app banners");
      console.log("getBannerError", getBannerError);
    }
  }, [getBannerError, getBannerData]);

  useEffect(() => {
    if (getWorkflowData) {
      if (getWorkflowData.length === 1 && getWorkflowData[0] === "Genuinity") {
        dispatch(setIsGenuinityOnly());
      }
      const removedWorkFlow = getWorkflowData?.body[0]?.program.filter(
        (item, index) => {
          return item !== "Warranty";
        }
      );
      console.log("getWorkflowData", getWorkflowData);
      dispatch(setProgram(removedWorkFlow));
      dispatch(setWorkflow(getWorkflowData?.body[0]?.workflow_id));
      const form_type = "2";
      parsedJsonValue &&
        getFormFunc({ form_type: form_type, token: parsedJsonValue?.token });
    } else if (getWorkflowError) {
      console.log("getWorkflowError", getWorkflowError);
      setError(true);
      setMessage("Oops something went wrong");
    }
  }, [getWorkflowData, getWorkflowError]);

  useEffect(() => {
    if (getDashboardData) {
      console.log("getDashboardData", getDashboardData, parsedJsonValue.token);
      dispatch(setDashboardData(getDashboardData?.body?.app_dashboard));
      parsedJsonValue && getBannerFunc(parsedJsonValue?.token);
    } else if (getDashboardError) {
      setError(true);
      setMessage("Can't get dashboard data, kindly retry.");
      console.log("getDashboardError", getDashboardError);
    }
  }, [getDashboardData, getDashboardError]);

  async function updateToken(newToken) {
    
    
    await AsyncStorage.setItem("loginData", JSON.stringify(newToken));
    dispatch(setUserData(newToken));



    const check = await AsyncStorage.getItem("loginData");

    console.log("check", JSON.parse(check)?.token);
  }

  // useEffect(() => {
  //   if (mpinLoginData) {
  //     console.log("mpinLoginData", mpinLoginData);

  //     saveUserDetails(mpinLoginData?.body);
  //     setParsedJsonValue(mpinLoginData?.body);
  //     console.log("successfullyLoggedIn", mpinLoginData?.body?.token);
  //     saveToken(mpinLoginData?.body?.token);
  //     updateToken(mpinLoginData?.body);
  //     storeData(mpinLoginData?.body);
  //     saveUserDetails(mpinLoginData?.body);
  //     mpinLoginData?.body?.token &&
  //     getDashboardFunc(mpinLoginData?.body?.token);
  //     setMessage("Successfully Logged In");
  //     setSuccess(true);
  //   } else {
  //     console.log("mpinLoginError", mpinLoginError);
  //   }
  // }, [mpinLoginData, mpinLoginError]);

  //function to handle Modal
  const modalWithBorderClose = async () => {
    setModalWithBorder(false);
    setMessage("");
    // navigation.navigate("Dashboard");
  };

  const storeData = async (value) => {
    console.log("storeDataloginData", value);
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("loginData", jsonValue);
    } catch (e) {
      console.log("Error while saving loginData", e);
    }
  };

  const saveUserDetails = (data) => {
    try {
      console.log("Saving user details", data);
      dispatch(setAppUserId(data?.user_type_id));
      dispatch(setAppUserName(data?.name));
      dispatch(setAppUserType(data?.user_type));
      dispatch(setUserData(data));
      dispatch(setId(data?.id));
    } catch (e) {
      console.log("error", e);
    }
  };

  const checkKYCDoneStatus = (kycData) => {
    const kycCompletedCount = [];
    
    console.log("the kyc dataaaaa=>", kycData)

    for (var i = 0; i < kycOption1.length; i++) {
      if (
        kycOption1.includes("aadhar") &&
        !kycCompletedCount.includes("aadhar")
      ) {
        if (kycData.is_valid_aadhar) {
          kycCompletedCount.push("aadhar");
        }
      }
      if (
        kycOption1.includes("gstin") &&
        !kycCompletedCount.includes("gstin")
      ) {
        if (kycData.is_valid_gstin) {
          kycCompletedCount.push("gstin");
        }
      }
      if (kycOption1.includes("pan") && !kycCompletedCount.includes("pan")) {
        if (kycData.is_valid_pan) {
          kycCompletedCount.push("pan");
        }
      }
    }
    console.log("completed kyc from the first array", kycCompletedCount)
    var count1 = 0;

    for (var i = 0; i < kycCompletedCount.length; i++) {
      if (kycOption1.includes(kycCompletedCount[i])) {
        count1++;
      }
    }

    console.log("count", count1, kycOption1.length);
    if (count1 == kycOption1.length) {
      setCheckKycOption1(true);
    } else {
      setCheckKycOption1(false);
    }
    console.log("new clg", kycCompletedCount.length, kycOption1.length);

    if (checkKycOption1 == false && checkKycOption1 != undefined) {
      for (var i = 0; i < kycOption2.length; i++) {
        if (
          kycOption2.includes("aadhar") &&
          !kycCompletedCount.includes("aadhar")
        ) {
          if (kycData.is_valid_aadhar) {
            kycCompletedCount.push("aadhar");
          }
        }
        if (
          kycOption2.includes("gstin") &&
          !kycCompletedCount.includes("gstin")
        ) {
          if (kycData.is_valid_gstin) {
            kycCompletedCount.push("gstin");
          }
        }
        if (kycOption2.includes("pan") && !kycCompletedCount.includes("pan")) {
          if (kycData.is_valid_pan) {
            kycCompletedCount.push("pan");
          }
        }
      }
    console.log("completed kyc from the second array", kycCompletedCount)

      var count2 = 0;
      for (var i = 0; i < kycCompletedCount.length; i++) {
        if (kycOption2.includes(kycCompletedCount[i])) {
          count2++;
        }
      }
      if (count2 == kycOption2.length) {
        setCheckKycOption2(true);
      } else {
        setCheckKycOption2(false);
      }
    console.log("new clg 2", kycCompletedCount.length, kycOption1.length);

    }
  };

  const clearMpin =async()=>{
    try{
        AsyncStorage.removeItem("userMpin")
        navigation.navigate("SelectUser")
    }
    catch(e){
      console.log("error", e)
    }
  }

  // Handle input changes
  const handleInputChange = (text, index) => {
    const newMpin = [...mpin];
    newMpin[index] = text;
    setMpin(newMpin);

    // Move to the next input if a number is entered
    if (text.length === 1 && index < 3) {
      refInputs.current[index + 1].focus();
    }
    else{
      Keyboard.dismiss()
    }
  };

  // Handle key press to move back on backspace
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      if (mpin[index] === "" && index > 0) {
        refInputs.current[index - 1].focus();
        const newMpin = [...mpin];
        newMpin[index - 1] = "";
        setMpin(newMpin);
      }
    }
  };

  // Handle input blur
  const handleBlur = (index) => {
    if (mpin[index] === "" && index > 0) {
      refInputs.current[index - 1].focus();
    }
  };

  const saveToken = async (data) => {
    const token = data;
    const password = "17dec1998";

    await Keychain.setGenericPassword(token, password);
  };

  // Validate MPIN
  const validateMpin = async () => {
    const enteredMpin = mpin.join("");
    // const storedMpin = await AsyncStorage.getItem('userMpin');
    let mPin = await AsyncStorage.getItem("userMpin")

    if(enteredMpin == mPin){
      navigation.navigate("Dashboard")
    }
    else{
      setError(true)
      setMessage("Incorrect MPIN. Please try again.");
    }


    // if (uid != null && mpin.length == 4) {
    //   mpinLoginFunc(data);
    // } else {
    //   Alert.alert("Error", "Incorrect MPIN. Please try again.");
    // }
  };

  const modalClose = () => {
    setError(false);
  };


  return (
    <View style={styles.container}>
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
        />
      </TouchableOpacity> */}

      <View
        style={{
          backgroundColor: 'white',
          padding: 10,
          marginTop: "35%",
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
      </View>

      <Text style={{ ...styles.title, color: ternaryThemeColor }}>
        Enter Your MPIN
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
            onKeyPress={(e) => handleKeyPress(e, index)}
            onBlur={() => handleBlur(index)}
            ref={(input) => (refInputs.current[index] = input)}
          />
        ))}
      </View>
      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
          warning = {true}
        ></ErrorModal>
      )}
      <TouchableOpacity
        style={{ ...styles.button, backgroundColor: ternaryThemeColor }}
        onPress={validateMpin}
      >
        <Text style={styles.buttonText}>Validate MPIN</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          clearMpin()
        }}
        style={{ marginTop: 30 }}
      >
        <Text style={{ color: ternaryThemeColor, fontWeight: "800" }}>
          Forgot MPIN ?
        </Text>
      </TouchableOpacity>
    </View>
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
    color:'black',
    borderBottomColor: "#000",
    fontSize: 24,
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

export default MpinValidationScreen;
