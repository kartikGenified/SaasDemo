import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  TouchableOpacity,
  Image,
  Button,
  BackHandler,
  PanResponder,
  Animated,
  Text,
} from "react-native";
import MenuItems from "../../components/atoms/MenuItems";
import { BaseUrl } from "../../utils/BaseUrl";
import * as Keychain from "react-native-keychain";
import DashboardMenuBox from "../../components/organisms/DashboardMenuBox";
import Banner from "../../components/organisms/Banner";
import DrawerHeader from "../../components/headers/DrawerHeader";
import DashboardDataBox from "../../components/molecules/DashboardDataBox";
import KYCVerificationComponent from "../../components/organisms/KYCVerificationComponent";
import DashboardSupportBox from "../../components/molecules/DashboardSupportBox";
import { useGetWorkflowMutation } from "../../apiServices/workflow/GetWorkflowByTenant";
import { useGetFormMutation } from "../../apiServices/workflow/GetForms";
import { useSelector, useDispatch } from "react-redux";
import { useGetkycStatusMutation } from "../../apiServices/kyc/KycStatusApi";
import { setKycData } from "../../../redux/slices/userKycStatusSlice";
import { useIsFocused } from "@react-navigation/native";
import {
  setPercentagePoints,
  setShouldSharePoints,
} from "../../../redux/slices/pointSharingSlice";
import { useExtraPointEnteriesMutation } from "../../apiServices/pointSharing/pointSharingApi";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import {
  useFetchUserPointsHistoryMutation,
  useFetchUserPointsMutation,
} from "../../apiServices/workflow/rewards/GetPointsApi";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import { setQrIdList } from "../../../redux/slices/qrCodeDataSlice";
import CampaignVideoModal from "../../components/modals/CampaignVideoModal";
import { useGetActiveMembershipMutation } from "../../apiServices/membership/AppMembershipApi";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import PlatinumModal from "../../components/platinum/PlatinumModal";
import { useFetchAllQrScanedListMutation } from "../../apiServices/qrScan/AddQrApi";
import FastImage from "react-native-fast-image";
import ScannedDetailsBox from "../../components/organisms/ScannedDetailsBox";
import moment from "moment";
import AnimatedDots from "../../components/animations/AnimatedDots";
import analytics from "@react-native-firebase/analytics";
import messaging from "@react-native-firebase/messaging";
import Close from "react-native-vector-icons/Ionicons";
import ModalWithBorder from "../../components/modals/ModalWithBorder";
import ErrorModal from "../../components/modals/ErrorModal";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { needCaimpaign, needRandomRedeemPoint } from "../../utils/HandleClientSetup";
import { useGetAppCampaignMutation } from "../../apiServices/campaign/CampaignApi";
import Tooltip from "react-native-walkthrough-tooltip";
import {
  setStepId,
  setAlreadyWalkedThrough,
} from "../../../redux/slices/walkThroughSlice";

import PointBox from "../../components/organisms/PointBox";
import { useCurrentDateTime } from "../../hooks/customHooks/useDate";

const Dashboard = ({ navigation }) => {
  const [dashboardItems, setDashboardItems] = useState();
  const [requiresLocation, setRequiresLocation] = useState(false);
  const [showKyc, setShowKyc] = useState(true);
  const [CampainVideoVisible, setCmpainVideoVisible] = useState(true);
  const [logoutStatus, setLogoutStatus] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [membership, setMembership] = useState();
  const [scanningDetails, seScanningDetails] = useState();
  const [notifModal, setNotifModal] = useState(false);
  const [notifData, setNotifData] = useState(null);
  const [message, setMessage] = useState();
  const [success, setSuccess] = useState(false);
  const [hide, setHide] = useState(true);
  const [campaignData, setCaimpaignData] = useState(null);
  const [showCampaign, setShowCampaign] = useState()
  const [error, setError] = useState(false);
  const [walkThrough, setWalkThrough] = useState(false);
  const stepId = useSelector((state) => state.walkThrough.stepId);
  const { date, time, month, year } = useCurrentDateTime();

  const pointsRef = useRef(0);
  const randomNoRef = useRef(0);

  console.log("timeeeeee", date, time, month, year)

  // const position1 = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // PanResponder for the first component
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }]),
      onPanResponderRelease: () => {
        pan.setOffset({ x: 0, y: 0 });
      },
    })
  ).current;

  const focused = useIsFocused();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.appusersdata.userId);
  const userData = useSelector((state) => state.appusersdata.userData);
  const pointSharingData = useSelector(
    (state) => state.pointSharing.pointSharing
  );
  const dashboardData = useSelector(
    (state) => state.dashboardData.dashboardData
  );
  const bannerArray = useSelector((state) => state.dashboardData.banner);
  const locationSetup = useSelector((state) => state.appusers.locationSetup);

  console.log("Dashboard data is", dashboardData, locationSetup);

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "#FFB533";

  const gifUri = Image.resolveAssetSource(
    require("../../../assets/gif/loader2.gif")
  ).uri;
  // console.log("pointSharingData", JSON.stringify(pointSharingData), userData)
  // console.log("user id is from dashboard", userId)
  //   console.log(focused)
  let startDate, endDate;
  const [
    getActiveMembershipFunc,
    {
      data: getActiveMembershipData,
      error: getActiveMembershipError,
      isLoading: getActiveMembershipIsLoading,
      isError: getActiveMembershipIsError,
    },
  ] = useGetActiveMembershipMutation();

  const [
    getAppCampaign,
    {
      data: getAppCampaignData,
      isLoading: getAppCampaignIsLoading,
      isError: getAppCampaignIsError,
      error: getAppCampaignError,
    },
  ] = useGetAppCampaignMutation();

  const [
    getKycStatusFunc,
    {
      data: getKycStatusData,
      error: getKycStatusError,
      isLoading: getKycStatusIsLoading,
      isError: getKycStatusIsError,
    },
  ] = useGetkycStatusMutation();

  const [
    userPointFunc,
    {
      data: userPointData,
      error: userPointError,
      isLoading: userPointIsLoading,
      isError: userPointIsError,
    },
  ] = useFetchUserPointsMutation();

  const [
    fetchUserPointsHistoryFunc,
    {
      data: fetchUserPointsHistoryData,
      error: fetchUserPointsHistoryError,
      isLoading: fetchUserPointsHistoryLoading,
      isError: fetchUserPointsHistoryIsError,
    },
  ] = useFetchUserPointsHistoryMutation();

  const id = useSelector((state) => state.appusersdata.id);
  const { t } = useTranslation();

  const fetchPoints = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      userId: id,
      token: token,
    };
    userPointFunc(params);
    fetchUserPointsHistoryFunc(params);
  };

  useEffect(() => {
    // Determine if tooltip should be shown
    const showTooltip = stepId === 1;
    if (showTooltip) {
      setWalkThrough(true);
    } else {
      setWalkThrough(false);
    }
  }, [stepId]);

  useEffect(() => {
    if (locationSetup) {
      if (Object.keys(locationSetup)?.length != 0) {
        setRequiresLocation(true);
      }
    }
  }, [locationSetup]);

  useEffect(() => {
    const handleBackPress = () => {
      navigation.goBack(); // Navigate back when back button is pressed
      return true; // Prevent default back press behavior
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );
    fetchPoints();
    dispatch(setQrIdList([]));
    dispatch({ type: "NETWORK_REQUEST" });
    return () => {
      // Ensure backHandler exists and remove the listener
      // console.log("unmounting compionent sajkdahjsdhsaghd")

      if (backHandler) {
        BackHandler.addEventListener("hardwareBackPress", () => false);
      }
    };
  }, [focused, dispatch]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      setNotifModal(true);
      setNotifData(remoteMessage?.notification);
      // console.log("remote message",remoteMessage)
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;

      getAppCampaign(token);
    };

    getToken();
  }, []);

  useEffect(() => {
    if (getAppCampaignData) {
      console.log("getAppCampaignData", getAppCampaignData);
      setHide(getAppCampaignData?.body?.data?.length == 0);
      setCaimpaignData(getAppCampaignData);
    } else if (getAppCampaignError) {
      console.log("getAppCampaignIsError", getAppCampaignIsError);
    }
  }, [getAppCampaignData, getAppCampaignIsError]);

  useEffect(() => {
    if (userPointData) {
      console.log("userPointData", userPointData);
      pointsRef.current = userPointData?.body?.point_balance;
    } else if (userPointError) {
      setError(true);
      setMessage("Can't get user user point data, kindly retry.");
      // console.log("userPointError",userPointError)
    }
  }, [userPointData]);

  useEffect(() => {
    if (fetchUserPointsHistoryData) {
      // console.log("fetchUserPointsHistoryData", JSON.stringify(fetchUserPointsHistoryData))

      if (fetchUserPointsHistoryData?.success) {
        seScanningDetails(fetchUserPointsHistoryData?.body);
      }
    } else if (fetchUserPointsHistoryError) {
      if (fetchUserPointsHistoryError.status == 401) {
        const handleLogout = async () => {
          try {
            await AsyncStorage.removeItem("loginData");
            navigation.navigate("Splash");
            navigation.reset({ index: 0, routes: [{ name: "Splash" }] }); // Navigate to Splash screen
          } catch (e) {
            console.log("error deleting loginData", e);
          }
        };
        handleLogout();
      } else {
        setError(true);
        setMessage("Unable to fetch user point history.");
      }
      // console.log("fetchUserPointsHistoryError", fetchUserPointsHistoryError)
    }
  }, [fetchUserPointsHistoryData, fetchUserPointsHistoryError]);

  useEffect(() => {
    if (getActiveMembershipData) {
      // console.log("getActiveMembershipData", JSON.stringify(getActiveMembershipData))
      if (getActiveMembershipData?.success) {
        setMembership(getActiveMembershipData?.body?.tier.name);
      }
    } else if (getActiveMembershipError) {
      if (getActiveMembershipError.status == 401) {
        const handleLogout = async () => {
          try {
            await AsyncStorage.removeItem("loginData");
            navigation.navigate("Splash");
            navigation.reset({ index: 0, routes: [{ name: "Splash" }] }); // Navigate to Splash screen
          } catch (e) {
            console.log("error deleting loginData", e);
          }
        };
        handleLogout();
      } else {
        // setError(true);
        // setMessage("problem in fetching membership, kindly retry.");
        console.log("getActiveMembershipError", getActiveMembershipError);
      }
    }
  }, [getActiveMembershipData, getActiveMembershipError]);

  useEffect(() => {
    if (getKycStatusData) {
      // console.log("getKycStatusData", getKycStatusData)
      if (getKycStatusData?.success) {
        const tempStatus = Object.values(getKycStatusData?.body);

        setShowKyc(tempStatus.includes(false));

        dispatch(setKycData(getKycStatusData?.body));
      }
    } else if (getKycStatusError) {
      if (getKycStatusError.status == 401) {
        const handleLogout = async () => {
          try {
            await AsyncStorage.removeItem("loginData");
            navigation.navigate("Splash");
            navigation.reset({ index: 0, routes: [{ name: "Splash" }] }); // Navigate to Splash screen
          } catch (e) {
            console.log("error deleting loginData", e);
          }
        };
        handleLogout();
      } else {
        setError(true);
        setMessage("Can't get KYC status kindly retry after sometime.");
      }
      // console.log("getKycStatusError", getKycStatusError)
    }
  }, [getKycStatusData, getKycStatusError]);

  useEffect(() => {
    const keys = Object.keys(pointSharingData?.point_sharing_bw_user.user);
    const values = Object.values(pointSharingData?.point_sharing_bw_user.user);
    const percentageKeys = Object.keys(
      pointSharingData?.point_sharing_bw_user.percentage
    );
    const percentageValues = Object.values(
      pointSharingData?.point_sharing_bw_user.percentage
    );

    let eligibleUser = "";
    let percentage;
    let index;
    for (var i = 0; i < values.length; i++) {
      if (values[i].includes(userData?.user_type)) {
        eligibleUser = keys[i];
        index = percentageKeys.includes(eligibleUser)
          ? percentageKeys.indexOf(eligibleUser)
          : undefined;
        const pointSharingPercent = percentageValues[index];
        // console.log(pointSharingPercent)
        if (percentageKeys.includes(eligibleUser)) {
          dispatch(setPercentagePoints(pointSharingPercent));
          // console.log("On", userData.user_type, "scan", pointSharingPercent, "% Points would be shared with", eligibleUser)
        }
        dispatch(setShouldSharePoints());
      }
    }
  }, []);
  useEffect(() => {
    const getDashboardData = async () => {
      try {
        // Retrieve the credentials
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          // console.log(
          //   'Credentials successfully loaded for user ' + credentials?.username
          // );
          const token = credentials?.username;

          // console.log("token from dashboard ", token)
        } else {
          // console.log('No credentials stored');
        }
      } catch (error) {
        // console.log("Keychain couldn't be accessed!", error);
      }
    };
    getDashboardData();
  }, []);
  useEffect(() => {
    const fetchOnPageActive = async () => {
      try {
        // Retrieve the credentials
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          // console.log(
          //   'Credentials successfully loaded for user ' + credentials?.username
          // );
          const token = credentials?.username;
          // console.log("token from dashboard ", token)

          token && getKycStatusFunc(token);

          getMembership();
        } else {
          // console.log('No credentials stored');
        }
      } catch (error) {
        // console.log("Keychain couldn't be accessed!", error);
      }
    };
    if (focused) {
      fetchOnPageActive();
    }
  }, [focused]);

  // ozone change

  const platformMarginScroll = Platform.OS === "ios" ? 0 : 0;

  const handleNextStep = () => {
    dispatch(setStepId(stepId + 1)); // Move to the next step
    setWalkThrough(false);
  };
  const handlePrevStep = () => {
    dispatch(setStepId(stepId - 1)); // Move to the next step
    setWalkThrough(false);
  };

  const handleSkip = () => {
    dispatch(setStepId(0)); // Reset or handle skip logic
    dispatch(setAlreadyWalkedThrough(true)); // Mark walkthrough as completed
    setWalkThrough(false);
  };

  const getMembership = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      // console.log(
      //   'Credentials successfully loaded for user ' + credentials?.username
      // );
      const token = credentials?.username;
      getActiveMembershipFunc(token);
    }
  };

  const hideSuccessModal = () => {
    setIsSuccessModalVisible(false);
  };

  const showSuccessModal = () => {
    setIsSuccessModalVisible(true);
    // console.log("hello")
  };
  const modalClose = () => {
    setError(false);
  };

  const dontShow=(status)=>{
    console.log("dont show campaign")
    setShowCampaign(status)
  }

  

  const notifModalFunc = () => {
    return (
      <View style={{ width: "100%" }}>
        <View style={{ width: "100%", alignItems: "center", marginTop: 20 }}>
          <View>
            {/* <Bell name="bell" size={18} style={{marginTop:5}} color={ternaryThemeColor}></Bell> */}
          </View>
          <PoppinsTextLeftMedium
            content={notifData?.title ? notifData?.title : ""}
            style={{
              color: ternaryThemeColor,
              fontWeight: "800",
              fontSize: 20,
              marginTop: 8,
            }}
          ></PoppinsTextLeftMedium>

          <PoppinsTextLeftMedium
            content={notifData?.body ? notifData?.body : ""}
            style={{
              color: "#000000",
              marginTop: 10,
              padding: 10,
              fontSize: 15,
              fontWeight: "600",
            }}
          ></PoppinsTextLeftMedium>
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
          onPress={() => setNotifModal(false)}
        >
          <Close name="close" size={17} color="#ffffff" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F7F9FA",
        flex: 1,
        height: "100%",
      }}
    >
      {notifModal && (
        <ModalWithBorder
          modalClose={() => {
            setNotifModal(false);
          }}
          message={"message"}
          openModal={notifModal}
          comp={notifModalFunc}
        ></ModalWithBorder>
      )}

      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
        ></ErrorModal>
      )}

      <ScrollView
        style={{
          width: "100%",
          marginBottom: platformMarginScroll,
          height: "100%",
        }}
      >
        <DrawerHeader></DrawerHeader>
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "flex-start",
            flexDirection: "row",
            marginBottom: 10,
          }}
        >
          <PoppinsTextLeftMedium
            style={{
              color: ternaryThemeColor,
              fontWeight: "bold",
              fontSize: 19,
              marginLeft: 20,
            }}
            content={`${t("welcome")} ${userData?.name}`}
          ></PoppinsTextLeftMedium>
          {getActiveMembershipData?.body !== null && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  backgroundColor: ternaryThemeColor,
                  padding: 4,
                  borderRadius: 4,
                }}
                onPress={showSuccessModal}
              >
                <Image
                  style={{ height: 16, width: 16, resizeMode: "contain" }}
                  source={require("../../../assets/images/reward.png")}
                ></Image>

                <PoppinsTextMedium
                  style={{ color: "white", fontSize: 14 }}
                  content={membership}
                ></PoppinsTextMedium>
              </TouchableOpacity>
            </View>
          )}
          <PlatinumModal
            isVisible={isSuccessModalVisible}
            onClose={hideSuccessModal}
            getActiveMembershipData={getActiveMembershipData}
          />
        </View>
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            height: "90%",
          }}
        >
          <View style={{ height: 200, width: "100%", marginBottom: 20 }}>
            {bannerArray && <Banner images={bannerArray}></Banner>}

            {showCampaign && <CampaignVideoModal dontShow = {dontShow} isVisible={CampainVideoVisible} onClose={()=>{
              setCmpainVideoVisible(false)
            }} />}
          </View>
          {/* Ozone specific change do not show for sales */}
          {userData?.user_type_id !== 13 && userData && !userPointIsLoading && (
            <View
              style={{ width: "90%", alignItems: "center", justifyContent: "" }}
            >
              {/* <PointBox pointBalance ={Math.trunc(Number(userPointData?.body?.point_balance)) } ></PointBox> */}
              {/* <PointBox pointBalance ={Math.trunc(0)} ></PointBox> */}
              {console.log(
                "firstdkdkd",
                Math.trunc(Number(userPointData?.body?.point_balance))
              )}
              {/* <PointBox pointBalance ={Math.trunc(Number(userPointData?.body?.point_balance)) } ></PointBox>  */}
              {needRandomRedeemPoint ?
                <PointBox pointBalance ={Math.trunc(Number(userPointData?.body?.point_balance)) } ></PointBox> 
            :
            <View
            style={{
              width: "90%",
              height: 50,
              backgroundColor: "white",
              marginBottom: 20,
              flexDirection: "row",
              alignItems: "center",
              borderColor: "#808080",
              borderWidth: 0.3,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                width: "42%",
                marginHorizontal: 20,
              }}
            >
              {userPointData?.body?.point_balance ? (
                <View>
                  <PoppinsTextMedium
                    content={`${t("Balance points ")}`}
                    style={{ color: "black", fontWeight: "bold" }}
                  ></PoppinsTextMedium>
                  <PoppinsTextMedium
                    content={`${
                      userPointData?.body?.point_balance
                        ? Math.floor(userPointData?.body?.point_balance)
                        : "loading"
                    }`}
                    style={{ color: "black", fontWeight: "bold" }}
                  ></PoppinsTextMedium>
                </View>
              ) : (
                <AnimatedDots color={"black"} />
              )}

              
            </View>

            <View
              style={{
                height: "100%",
                borderWidth: 0.4,
                color: "#808080",
                opacity: 0.3,
              }}
            >
              <View
                style={{
                  width: "90%",
                  alignItems: "center",
                  justifyContent: "",
                }}
              >
                {/* <PointBox pointBalance ={Math.trunc(Number(userPointData?.body?.point_balance)) } ></PointBox> */}
              </View>
            </View>

            <View style={{ backgroundColor: "white", width: "46%" }}>
              {userData && !userPointIsLoading && (
                <View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: ternaryThemeColor,
                      height: "100%",
                      borderRadius: 5,
                      width: "100%",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      navigation.navigate("RedeemedHistory");
                    }}
                  >
                    <PoppinsTextLeftMedium
                      style={{
                        color: "white",
                        fontWeight: "800",
                        fontSize: 16,
                      }}
                      content={t("redeem")}
                    ></PoppinsTextLeftMedium>
                  </TouchableOpacity>
                  <Tooltip
                    isVisible={walkThrough}
                    content={
                      <View style={{ alignItems: "center" }}>
                        <Text
                          style={{
                            color: "black",
                            textAlign: "center",
                            marginBottom: 10,
                            fontWeight: "bold",
                          }}
                        >
                          Use redeem to use your scanned point
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          <TouchableOpacity
                            style={{
                              backgroundColor: ternaryThemeColor,
                              paddingVertical: 5,
                              paddingHorizontal: 15,
                              borderRadius: 5,
                              marginRight: 12,
                            }}
                            onPress={() => handleSkip()}
                          >
                            <Text style={{ color: "white" }}>Skip</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={{
                              backgroundColor: "lightgray",
                              paddingVertical: 5,
                              paddingHorizontal: 15,
                              borderRadius: 5,
                            }}
                            onPress={() => handleNextStep()}
                          >
                            <Text style={{ color: "black" }}>Next</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    }
                    placement="right"
                    animated={true}
                    onClose={() => setWalkThrough(false)}
                    tooltipStyle={{ borderRadius: 30 }}
                    contentStyle={{
                      backgroundColor: "white",
                      minHeight: 100,
                      borderWidth: 2,
                      borderRadius: 10,
                      borderColor: ternaryThemeColor,
                    }}
                  ></Tooltip>
                </View>
              )}
            </View>
          </View>
            }
            



            </View>
          )}
          {(userData?.user_type).toLowerCase() !== "dealer" ? (
            (userData?.user_type).toLowerCase() !== "sales" ? (
              scanningDetails &&
              scanningDetails?.data.length !== 0 && (
                <ScannedDetailsBox
                  lastScannedDate={moment(
                    scanningDetails?.data[0]?.created_at
                  ).format("DD MMM YYYY")}
                  scanCount={scanningDetails.total}
                ></ScannedDetailsBox>
              )
            ) : (
              <></>
            )
          ) : (
            <></>
          )}
          {/* <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ paddingLeft: 10, paddingRight: 10, paddingBottom: 4 }}>
            <DashboardDataBox header="Total Points"  data="5000" image={require('../../../assets/images/coin.png')} ></DashboardDataBox>
          <DashboardDataBox header="Total Points"  data="5000" image={require('../../../assets/images/coin.png')} ></DashboardDataBox>

          </ScrollView> */}
          {dashboardData && !userPointIsLoading && (
            <DashboardMenuBox
              requiresLocation={requiresLocation}
              navigation={navigation}
              data={dashboardData}
            ></DashboardMenuBox>
          )}
          {userPointIsLoading && (
            <FastImage
              style={{
                width: 100,
                height: 100,
                alignSelf: "center",
                marginTop: 20,
              }}
              source={{
                uri: gifUri, // Update the path to your GIF
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          )}
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            {showKyc && (
              <KYCVerificationComponent
                buttonTitle={t("Complete Your KYC")}
                title={t("Your KYC is not completed")}
              ></KYCVerificationComponent>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            {userData.user_type.toLowerCase() !== "sales" && (
              <DashboardSupportBox
                title={t("rewards")}
                text="Rewards"
                backgroundColor="#D9C7B6"
                borderColor="#FEE8D4"
                image={require("../../../assets/images/reward_dashboard.png")}
              ></DashboardSupportBox>
            )}
            <DashboardSupportBox
              title={t("customer support")}
              text="Customer Support"
              backgroundColor="#BCB5DC"
              borderColor="#E4E0FC"
              image={require("../../../assets/images/support.png")}
            ></DashboardSupportBox>
            <DashboardSupportBox
              title={t("feedback")}
              text="Feedback"
              backgroundColor="#D8C8C8"
              borderColor="#FDDADA"
              image={require("../../../assets/images/feedback.png")}
            ></DashboardSupportBox>
          </View>
          {/* <Button
        title="Add To Basket"
        onPress={async () =>
          await analytics().logEvent('basket', {
            id: 3745092,
            item: 'mens grey t-shirt',
            description: ['round neck', 'long sleeved'],
            size: 'L',
          })
        }
      /> */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Dashboard;
