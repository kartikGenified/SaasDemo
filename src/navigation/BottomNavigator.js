import React, { useEffect, useState } from "react";
import { View, Text, Platform, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "../screens/dashboard/Dashboard";
import Gift from "react-native-vector-icons/AntDesign";
import Qrcode from "react-native-vector-icons/AntDesign";
import Book from "react-native-vector-icons/AntDesign";
import { useSelector, useDispatch } from "react-redux";
import Wave from "../../assets/svg/bottomDrawer.svg";
import PoppinsTextMedium from "../components/electrons/customFonts/PoppinsTextMedium";
import BookOpen from "react-native-vector-icons/Entypo";
import { useTranslation } from "react-i18next";
import FlipAnimation from "../components/animations/FlipAnimation";
import Tooltip from "react-native-walkthrough-tooltip";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setStepId,
  setAlreadyWalkedThrough,
} from "../../redux/slices/walkThroughSlice";
import { needWalkedThrough } from "../utils/HandleClientSetup";

const Tab = createBottomTabNavigator();

//custom bottom drawer

function BottomNavigator({ navigation }) {
  const [requiresLocation, setRequiresLocation] = useState(false);
  const [walkthrough, setWalkThrough] = useState(false);
  const [step3, setStep3] = useState(false);

  const dispatch = useDispatch();
  const stepId = useSelector((state) => state.walkThrough.stepId);
  


  const { t } = useTranslation();

  const locationSetup = useSelector((state) => state.appusers.locationSetup);
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";
  const userData = useSelector((state) => state.appusersdata.userData);
  const workflow = useSelector((state) => state.appWorkflow.program);

  const platformFontWeight = Platform.OS === "ios" ? "400" : "800";
  console.log("workflow", workflow, userData);

  let isAlreadyWalkedThrough ;


   useEffect(() => {
    const getData = async () => {
      isAlreadyWalkedThrough = await AsyncStorage.getItem("isAlreadyWalkedThrough");
      console.log("isAlreadyWalkedThrough",isAlreadyWalkedThrough)
      if( workflow.includes("Points On Product")){
        console.log("isAlreadyWalkThrough", isAlreadyWalkedThrough, stepId);
        if ( !(isAlreadyWalkedThrough =="true") && stepId === 0 && needWalkedThrough) {
          setWalkThrough(true);
        } else if (stepId == 2) {
          setStep3(true);
        } else {
          setWalkThrough(false);
        }
      }
  }
  getData()



   
  }, [stepId]);

  const handleNextStep = () => {
    setWalkThrough(false);
    setStep3(false)
    console.log("stepIdddd", stepId)
    //step 1
    dispatch(setStepId(stepId + 1)); // Move to the next step
  };

  const handlePrevStep = () => {
    setWalkThrough(false);
    setStep3(false)
    dispatch(setStepId(stepId - 1)); // Move to the next step
  };

  const handleSkip = () => {
    dispatch(setStepId(0)); // Reset or handle skip logic
    dispatch(setAlreadyWalkedThrough(true)); // Mark walkthrough as completed
    setWalkThrough(false);
    setStep3(false)
  };

  useEffect(() => {
    if (locationSetup) {
      if (Object.keys(locationSetup)?.length != 0) {
        setRequiresLocation(true);
      }
    }
  }, [locationSetup]);

  return (
    <Tab.Navigator
      tabBar={() => (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            backgroundColor: "#F7F7F7",
          }}
        >
          <Wave style={{ top: 10 }} width={100}></Wave>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              height: 60,
              backgroundColor: "white",
              width: "100%",
            }}
          >
            {  console.log("workflow", workflow, )}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("GiftCatalogue");
              }}
              style={{ alignItems: "center", position: "absolute", left: 30 }}
            >
              <Gift name="gift" size={24} color={ternaryThemeColor}></Gift>
              <PoppinsTextMedium
                style={{
                  marginTop: 4,
                  fontSize: 12,
                  fontWeight: platformFontWeight,
                  color: "black",
                }}
                content={t("Gift Catalogue")}
              ></PoppinsTextMedium>
            </TouchableOpacity>
            {/* ozone change */}
            {(userData?.user_type).toLowerCase() !== "dealer" &&
            (userData?.user_type).toLowerCase() !== "sales" ? (
              <TouchableOpacity
                onPress={() => {
                  Platform.OS == "android"
                    ? navigation.navigate("EnableCameraScreen")
                    : requiresLocation
                    ? navigation.navigate("EnableLocationScreen", {
                        navigateTo: "QrCodeScanner",
                      })
                    : navigation.navigate("QrCodeScanner");
                }}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                {/* <Qrcode name="qrcode" size={24} color={ternaryThemeColor}></Qrcode> */}

                <FlipAnimation
                  direction="horizontal"
                  duration={1400}
                  comp={() => {
                    return (
                      <Qrcode
                        name="qrcode"
                        size={24}
                        color={ternaryThemeColor}
                      ></Qrcode>
                    );
                  }}
                />
                <Tooltip
                  isVisible={walkthrough}
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
                        Scan QR Code to Start Scanning
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
                  tooltipStyle={{ borderRadius: 30, }}
                  contentStyle={{ backgroundColor: "white", minHeight: 100, borderWidth:2, borderRadius:10, borderColor:ternaryThemeColor }}
                >
                  <PoppinsTextMedium
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      fontWeight: Platform.OS === "ios" ? "400" : "800",
                      color: "black",
                    }}
                    content="Scan QR"
                  />
                  
                </Tooltip>
              </TouchableOpacity>
            ) : (
              workflow?.includes("Genuinity") && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("ScanAndRedirectToGenuinity");
                  }}
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  {/* <Qrcode name="qrcode" size={24} color={ternaryThemeColor}></Qrcode> */}
                  <FlipAnimation
                    direction="horizontal"
                    duration={1400}
                    comp={() => {
                      return (
                        <Qrcode
                          name="qrcode"
                          size={24}
                          color={ternaryThemeColor}
                        ></Qrcode>
                      );
                    }}
                  />
                   <PoppinsTextMedium style={{marginTop:4,fontSize:12,fontWeight:platformFontWeight,color:'black'}} content={t("Check Genuinity")}></PoppinsTextMedium>
                </TouchableOpacity>
              )
            )}
            {(userData?.user_type).toLowerCase() !== "sales" && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Passbook");
                }}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  right: 30,
                }}
              >
                  <Book name="book" size={24} color={ternaryThemeColor}></Book>

                <Tooltip
                  isVisible={step3}
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
                       Click on passbook to check points
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
                          onPress={() => handlePrevStep()}
                        >
                          <Text style={{ color: "white" }}>Prev</Text>
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
                  placement="top"
                  animated={true}
                  onClose={() => setStep3(false)}
                  tooltipStyle={{ borderRadius: 30 }}
                  contentStyle={{ backgroundColor: "white", minHeight: 100, borderWidth:2, borderRadius:10, borderColor:ternaryThemeColor }}
                >

                  <PoppinsTextMedium
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      fontWeight: platformFontWeight,
                      color: "black",
                    }}
                    content={t("passbook")}
                  ></PoppinsTextMedium>
                </Tooltip>
              </TouchableOpacity>
            )}

            {(userData?.user_type).toLowerCase() == "sales" && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ProductCatalogue");
                }}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  right: 20,
                }}
              >
                <BookOpen
                  name="open-book"
                  size={24}
                  color={ternaryThemeColor}
                ></BookOpen>
 <PoppinsTextMedium style={{marginTop:4,fontSize:12,fontWeight:platformFontWeight,color:'black'}} content={t("Product Catalogue")}></PoppinsTextMedium>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    >
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: () => (
            <Home name="home" size={24} color={ternaryThemeColor}></Home>
          ),
        }}
        name="DashboardBottom"
        component={Dashboard}
      />
    </Tab.Navigator>
  );
}

export default BottomNavigator;
