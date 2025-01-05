import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Keyboard,
  Text,
  BackHandler,
  Platform,
} from "react-native";
import { useGetLoginOtpMutation } from "../../apiServices/login/otpBased/SendOtpApi";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useSelector } from "react-redux";
import ErrorModal from "../../components/modals/ErrorModal";
import MessageModal from "../../components/modals/MessageModal";
import TextInputRectangularWithPlaceholder from "../../components/atoms/input/TextInputRectangularWithPlaceholder";
import OtpInput from "../../components/organisms/OtpInput";
import { useVerifyOtpForNormalUseMutation } from "../../apiServices/otp/VerifyOtpForNormalUseApi";
import * as Keychain from "react-native-keychain";
import { useRedeemGiftsMutation } from "../../apiServices/gifts/RedeemGifts";
import {
  useAddCashToBankWalletMutation,
  useGetWalletBalanceMutation,
  useRedeemCashbackMutation,
} from "../../apiServices/cashback/CashbackRedeemApi";
import { useGetLoginOtpForVerificationMutation } from "../../apiServices/otp/GetOtpApi";
import { useAddCashToBankMutation } from "../../apiServices/cashback/CashbackRedeemApi";
import Geolocation from "@react-native-community/geolocation";
import { useCreateCouponRequestMutation } from "../../apiServices/coupons/getAllCouponsApi";
import { useTranslation } from "react-i18next";
import {
  setPointConversionF,
  setCashConversionF,
  setRedemptionFrom,
} from "../../../redux/slices/redemptionDataSlice";
import { useDispatch } from "react-redux";
import { useRedeemSchemeApiMutation } from "../../apiServices/scheme/RedeemSchemeApi";
import { getCurrentLocation } from "../../utils/getCurrentLocation";

const OtpVerification = ({ navigation, route }) => {
  const [message, setMessage] = useState();
  const [otp, setOtp] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mobile, setMobile] = useState();
  const [timer, setTimer] = useState(60);
  const [showRedeemButton, setShowRedeemButton] = useState(false);
  const [location, setLocation] = useState();
  const timeOutCallback = useCallback(
    () => setTimer((currTimer) => currTimer - 1),
    []
  );
  const walletBalance = useSelector((state) => state.pointWallet.walletBalance);
  const pointsConversion = useSelector(
    (state) => state.redemptionData.pointConversion
  );
  const cashConversion = useSelector(
    (state) => state.redemptionData.cashConversion
  );
  const storedLocation = useSelector((state) => state.userLocation.location);
  const redemptionFrom = useSelector(
    (state) => state.redemptionData.redemptionFrom
  );
  const dispatch = useDispatch();
  console.log(
    "Point conversion and cash conversion data",
    cashConversion,
    walletBalance,
    storedLocation,
    redemptionFrom
  );
  const [
    verifyOtpForNormalUseFunc,
    {
      data: verifyOtpForNormalUseData,
      error: verifyOtpForNormalUseError,
      isLoading: verifyOtpForNormalUseIsLoading,
      isError: verifyOtpForNormalUseIsError,
    },
  ] = useVerifyOtpForNormalUseMutation();

  const [
    redeemSchemeApiFunc,
    {
      data: redeemSchemeApiData,
      error: redeemSchemeApiError,
      isLoading: redeemSchemeApiIsLoading,
      isError: redeemSchemeApiIsError,
    },
  ] = useRedeemSchemeApiMutation();
  const [
    redeemGiftsFunc,
    {
      data: redeemGiftsData,
      error: redeemGiftsError,
      isLoading: redeemGiftsIsLoading,
      isError: redeemGiftsIsError,
    },
  ] = useRedeemGiftsMutation();
  const [
    redeemCashbackFunc,
    {
      data: redeemCashbackData,
      error: redeemCashbackError,
      isLoading: redeemCashbackIsLoading,
      isError: redeemCashbackIsError,
    },
  ] = useRedeemCashbackMutation();

  const [addCashToBankWalletFunc,{
    data:addCashToBankWalletData,
    error:addCashToBankWalletError,
    isLoading:addCashToBankWalletIsLoading,
    isError:addCashToBankWalletIsError
  }] = useAddCashToBankWalletMutation()

  const [
    addCashToBankFunc,
    {
      data: addCashToBankData,
      error: addCashToBankError,
      isError: addCashToBankIsError,
      isLoading: addCashToBankIsLoading,
    },
  ] = useAddCashToBankMutation();

  const [
    getOtpforVerificationFunc,
    {
      data: getOtpforVerificationData,
      error: getOtpforVerificationError,
      isLoading: getOtpforVerificationIsLoading,
      isError: getOtpforVerificationIsError,
    },
  ] = useGetLoginOtpForVerificationMutation();

  const [
    createCouponRequestFunc,
    {
      data: createCouponRequestData,
      error: createCouponRequestError,
      isLoading: createCouponRequestIsLoading,
      isError: createCouponRequestIsError,
    },
  ] = useCreateCouponRequestMutation();

  const type = route.params.type;
  const selectedAccount = route.params?.selectedAccount;
  const brand_product_code = route.params?.brand_product_code;
  const couponCart = route.params?.couponCart;
  const schemeType = route.params?.schemeType;
  const schemeID = route.params?.schemeID;
  const { t } = useTranslation();

  console.log("couponCart", schemeID, schemeType);

  const handleCashbackRedemption = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        "Credentials successfully loaded for user " + credentials.username
      );
      const token = credentials.username;
      if(redemptionFrom !="Wallet")
      {
        const params = {
          token: token,
          body: {
            platform_id: 1,
            platform: "mobile",
            points: pointsConversion,
            remarks: "demo",
            state: location?.state === undefined ? "N/A" : location?.state,
            district:
              location?.district === undefined ? "N/A" : location?.district,
            city: location?.city === undefined ? "N/A" : location?.city,
            lat: location?.lat === undefined ? "N/A" : location?.lat,
            log: location?.lon === undefined ? "N/A" : location?.lon,
            active_beneficiary_account_id: selectedAccount,
            redemptionFrom: redemptionFrom,
          },
        };
        console.log("addCashToBankFunc", params);
      addCashToBankFunc(params);
      }
      else{
        const params = {
          token: token,
          body: {
            platform_id: 1,
            platform: "mobile",
            cash: walletBalance,
            remarks: "demo",
            state: location?.state === undefined ? "N/A" : location?.state,
            district:
              location?.district === undefined ? "N/A" : location?.district,
            city: location?.city === undefined ? "N/A" : location?.city,
            lat: location?.lat === undefined ? "N/A" : location?.lat,
            log: location?.lon === undefined ? "N/A" : location?.lon,
            active_beneficiary_account_id: selectedAccount,
            redemptionFrom: redemptionFrom,
          },
        };
        console.log("addCashToBankWalletFunc", params);
        addCashToBankWalletFunc(params);
      }
      
      
    }
  };

  useEffect(()=>{
    if(addCashToBankWalletData)
    {
      console.log("addCashToBankWalletData",addCashToBankWalletData)
      setSuccess(true);
      setMessage(addCashToBankWalletData.message);
    }
    else if(addCashToBankWalletError)
    {
      console.log("addCashToBankWalletError",addCashToBankWalletError)
      setError(true);
      setMessage(addCashToBankWalletError?.data?.message);
    }
  },[addCashToBankWalletData,addCashToBankWalletError])

  useEffect(() => {
    if (redeemSchemeApiData) {
      console.log("redeemSchemeApiData", redeemSchemeApiData);
    } else if (redeemSchemeApiError) {
      console.log("redeemSchemeApiError", redeemSchemeApiError);
      
    }
  }, [redeemSchemeApiData, redeemSchemeApiError]);

  useEffect(() => {
    timer > 0 && setTimeout(timeOutCallback, 1000);
  }, [timer, timeOutCallback]);

  useEffect(async() => {
    // check if there is stored location
    // if not present keep the previous location
    if (Object.keys(storedLocation).length == 0) {
      const getCurrLocation = getCurrentLocation()
      setLocation(getCurrLocation)
    } else {
      setLocation(storedLocation);
    }
    // -----------------------------------------
  }, []);

  useEffect(() => {
    if (redeemCashbackData) {
      setShowRedeemButton(false);
      console.log("redeemCashbackData", redeemCashbackData);
      if (redeemCashbackData.success) {
        handleCashbackRedemption();
      }
      // setSuccess(true)
      // setMessage(redeemCashbackData.message)
    } else if (redeemCashbackError) {
      console.log("redeemCashbackError", redeemCashbackError);
      setShowRedeemButton(false);
      setError(true);
      setMessage(redeemCashbackError.data.message);
    }
  }, [redeemCashbackData, redeemCashbackError]);

  useEffect(() => {
    if (createCouponRequestData) {
      console.log("createCouponRequestData", createCouponRequestData);
      setSuccess(true);
      setMessage(createCouponRequestData.message);
    } else if (createCouponRequestError) {
      console.log("createCouponRequestError", createCouponRequestError);
      setError(true);
      setMessage(createCouponRequestError.data?.message);
    }
  }, [createCouponRequestData, createCouponRequestError]);

  useEffect(() => {
    if (addCashToBankData) {
      console.log("addCashToBankData", addCashToBankData);
      setSuccess(true);
      setMessage(addCashToBankData.message);
      dispatch(setCashConversionF(0));
      dispatch(setRedemptionFrom(""));
    } else if (addCashToBankError) {
      console.log("addCashToBankError", addCashToBankError);
      setError(true);
      setMessage(addCashToBankError.data?.message);
    }
  }, [addCashToBankData, addCashToBankError]);

  useEffect(() => {
    if (verifyOtpForNormalUseData) {
      console.log("Verify Otp", verifyOtpForNormalUseData);
      if (verifyOtpForNormalUseData.success) {
        setShowRedeemButton(true);
      }
    } else if (verifyOtpForNormalUseError) {
      console.log("verifyOtpForNormalUseError", verifyOtpForNormalUseError);
      setError(true);
      setShowRedeemButton(false)
      setMessage(t("Please Enter The Correct OTP"));
    }
  }, [verifyOtpForNormalUseData, verifyOtpForNormalUseError]);

  useEffect(() => {
    if (redeemGiftsData) {
      console.log("redeemGiftsData", redeemGiftsData);
      setSuccess(true);
      setMessage(redeemGiftsData.message);
      setShowRedeemButton(false);
    } else if (redeemGiftsError) {
      console.log("redeemGiftsError", redeemGiftsError);
      setMessage(redeemGiftsError.data.message);
      setError(true);
      setShowRedeemButton(false);
    }
  }, [redeemGiftsError, redeemGiftsData]);

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";
  const cart = useSelector((state) => state.cart.cart);
  const address = useSelector((state) => state.address.address);
  const userData = useSelector((state) => state.appusersdata.userData);

  console.log("cart and address", cart, address, userData);
  useEffect(() => {
    if (getOtpforVerificationData) {
      console.log("getOtpforVerificationData", getOtpforVerificationData);
    } else if (getOtpforVerificationError) {
      console.log("getOtpforVerificationError", getOtpforVerificationError);
      setError(true);
      setMessage(getOtpforVerificationError?.data?.message);
    }
  }, [getOtpforVerificationData, getOtpforVerificationError]);

  const getOtpFromComponent = (value) => {
    if (value.length === 6) {
      setOtp(value);
      console.log("From Verify Otp", value);
      // setShowRedeemButton(false);
      handleOtpSubmission(value);
    }
  };

  const handleOtpSubmission = (otp) => {
    const mobile = userData.mobile;
    const name = userData.name;
    const user_type_id = userData.user_type_id;
    const user_type = userData.user_type;
    const type = "redemption";

    verifyOtpForNormalUseFunc({
      mobile,
      name,
      otp,
      user_type_id,
      user_type,
      type,
    });
  };
  const modalClose = () => {
    setError(false);
    setSuccess(false);
  };
  const finalGiftRedemption = async () => {
    setShowRedeemButton(false);
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        "Credentials successfully loaded for user " + credentials.username
      );
      const token = credentials.username;
      if (type === "Gift") {
        let tempID = [];
        cart &&
          cart.map((item, index) => {
            tempID.push(item.gift_id);
          });
        console.log("tempID", tempID, userData, address);

        if (schemeType == "yearly") {
          const data = {
            user_type_id: String(userData.user_type_id),
            user_type: userData.user_type,
            platform_id: 1,
            platform: "mobile",
            gift_ids: tempID,
            approved_by_id: "1",
            app_user_id: String(userData.id),
            remarks: "demo",
            type: "point",
            address_id: address.id,
          };
          const params = {
            token: token,
            data: data,
          };
          redeemGiftsFunc(params);
        } else {
          const data = {
            scheme_id: schemeID,
            address: address,
            platform_id: 1,
            platform: Platform.OS,
            gift_ids: tempID,
          };
          const params = {
            token: token,
            data: data,
          };
          redeemSchemeApiFunc(params);
        }
      } else if (type === "Cashback") {
        
          handleCashbackRedemption();
        
      } else if (type === "Coupon") {
        const params = {
          data: {
            name: userData.name,
            email:
              userData.email == null
                ? "appgenuinemark@gmail.com"
                : userData.email == undefined
                ? "appgenuinemark@gmail.com"
                : userData.email,
            mobile: userData.mobile,
            brand_product_code: brand_product_code,
            user_type_id: userData.user_type_id,
            user_type: userData.user_type,
            platform_id: 1,
            platform: "mobile",
            app_user_id: userData.id,
            state: location?.state == undefined ? "N/A" : location?.state,
            district:
              location?.district == undefined ? "N/A" : location?.district,
            city: location?.city == undefined ? "N/A" : location?.city,
            lat: location?.lat == undefined ? "N/A" : location?.lat,
            log: location?.lon == undefined ? "N/A" : location?.lon,
            denomination: cart[0]?.denomination,
          },
          token: token,
        };
        createCouponRequestFunc(params);
        console.log("Coupon params", params);
      }
    }
  };

  const handleOtpResend = () => {
    if (!timer) {
      setTimer(60);
      getMobile(mobile);
    }
    setShowRedeemButton(false);
  };
  const getMobile = (data) => {
    console.log("mobile number from mobile textinput", data);
    setMobile(data);
    const reg = "^([0|+[0-9]{1,5})?([6-9][0-9]{9})$";
    const mobReg = new RegExp(reg);
    if (mobReg.test(data)) {
      if (data !== undefined) {
        if (data.length === 10) {
          const user_type = userData.user_type;
          const user_type_id = userData.user_type_id;
          const name = userData.name;
          const params = {
            mobile: data,
            name: name,
            user_type: user_type,
            user_type_id: user_type_id,
            type: "redemption",
          };
          getOtpforVerificationFunc(params);

          Keyboard.dismiss();
        }
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          height: "10%",
          width: "100%",
          backgroundColor: ternaryThemeColor,
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          marginBottom: 20,
          // marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={{ height: 20, width: 20, marginLeft: 10 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{ height: 20, width: 20, resizeMode: "contain" }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>

        <PoppinsTextMedium
          style={{ fontSize: 20, color: "#ffffff", marginLeft: 10 }}
          content={t("Verify OTP")}
        ></PoppinsTextMedium>

        {error && (
          <ErrorModal
            modalClose={modalClose}
            message={message}
            openModal={error}
            // navigateTo="Passbook"
          ></ErrorModal>
        )}
        {success && (
          <MessageModal
            modalClose={modalClose}
            title={"Thanks"}
            message={message}
            openModal={success}
            navigateTo="RedeemedHistory"
          ></MessageModal>
        )}
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          backgroundColor: ternaryThemeColor,
          padding: 20,
          marginBottom: 60,
          marginTop: 20,
        }}
      >
        <PoppinsTextMedium
          style={{ color: "white", fontSize: 16 }}
          content={t("OTP has been sent to your registered mobile number")}
        ></PoppinsTextMedium>
      </View>
      <TextInputRectangularWithPlaceholder
        placeHolder="Mobile No"
        handleData={getMobile}
        maxLength={10}
        editable={false}
        value={userData.mobile}
      ></TextInputRectangularWithPlaceholder>

      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <OtpInput
          getOtpFromComponent={getOtpFromComponent}
          color={"white"}
        ></OtpInput>
        <PoppinsTextMedium
          content={t("Enter OTP")}
          style={{ color: "black", fontSize: 20, fontWeight: "800" }}
        ></PoppinsTextMedium>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
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
            <Text style={{ color: ternaryThemeColor, marginLeft: 4 }}>
              {timer}
            </Text>
          </View>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: ternaryThemeColor, marginTop: 10 }}>
              {t("Didn't recieve any Code")}?
            </Text>

            {timer === 0 && (
              <Text
                onPress={() => {
                  handleOtpResend();
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
            )}
          </View>
        </View>
      </View>
      {showRedeemButton && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            position: "absolute",
            bottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              finalGiftRedemption();
            }}
            style={{
              height: 50,
              width: 140,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: ternaryThemeColor,
              borderRadius: 4,
            }}
          >
            <PoppinsTextMedium
              content={t("redeem")}
              style={{ color: "white", fontSize: 20, fontWeight: "700" }}
            ></PoppinsTextMedium>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default OtpVerification;
