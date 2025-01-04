import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image,
  ScrollView,
  FlatList,
  Alert,
  Linking,
  PermissionsAndroid,
  AppState,
  ActivityIndicator,
  ToastAndroid,
  Vibration,
  BackHandler,
  Modal,
} from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ScannedListItem from "../../components/atoms/ScannedListItem";
import * as Keychain from "react-native-keychain";
import { useVerifyQrMutation } from "../../apiServices/qrScan/VerifyQrApi";
import ErrorModal from "../../components/modals/ErrorModal";
import ButtonProceed from "../../components/atoms/buttons/ButtonProceed";
import { useAddQrMutation } from "../../apiServices/qrScan/AddQrApi";
import { useSelector, useDispatch } from "react-redux";
import { setQrData, setQrIdList } from "../../../redux/slices/qrCodeDataSlice";
import { useCheckGenuinityMutation } from "../../apiServices/workflow/genuinity/GetGenuinityApi";
import { useCheckWarrantyMutation } from "../../apiServices/workflow/warranty/ActivateWarrantyApi";
import { useGetProductDataMutation } from "../../apiServices/product/productApi";
import {
  setProductData,
  setProductMrp,
  setScanningType,
} from "../../../redux/slices/getProductSlice";
import { useAddBulkQrMutation } from "../../apiServices/bulkScan/BulkScanApi";
import { slug } from "../../utils/Slug";
import MessageModal from "../../components/modals/MessageModal";
import ModalWithBorder from "../../components/modals/ModalWithBorder";
import Close from "react-native-vector-icons/Ionicons";
import RNQRGenerator from "rn-qr-generator";
import {
  useCashPerPointMutation,
  useFetchUserPointsHistoryMutation,
} from "../../apiServices/workflow/rewards/GetPointsApi";
import FastImage from "react-native-fast-image";
import {
  setFirstScan,
  setRegistrationBonusFirstScan,
} from "../../../redux/slices/scanningSlice";

import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { useInternetSpeedContext } from "../../Contexts/useInternetSpeedContext";
import InternetModal from "../../components/modals/InternetModal";
import {
  Camera,
  useCameraDevice,
  useCameraDevices,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import scanDelay from "../../utils/ScannedDelayUtil";
import UpdateModal from "../../components/modals/UpdateModal";
import { scannerType } from "../../utils/HandleClientSetup";

const QrCodeScanner = ({ navigation, route }) => {
  const [zoom, setZoom] = useState(0);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [zoomText, setZoomText] = useState("1");
  const [flash, setFlash] = useState(false);
  const [update, setUpdate] = useState(false);
  const [scannerKey, setScannerKey] = useState(0);
  const [addedQrList, setAddedQrList] = useState([]);
  const [success, setSuccess] = useState(false);
  const [cameraAccessMessage, setCameraAccessMessage] = useState("");
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [animationModal, setAnimationModal] = useState(false);
  const [isDuplicateQr, setIsDuplicateQr] = useState(new Set());
  const [savedToken, setSavedToken] = useState();
  const [qr_id, setQr_id] = useState();
  const [isSlowInternet, setIsSlowInternet] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [fetchLocation, setFetchLocation] = useState(false);
  const [helpModal, setHelpModal] = useState(false);
  const [isReportable, setIsReportable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [locationGranted, setLocationGranted] = useState(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [showProceed, setShowProceed] = useState(false);
  const userId = useSelector((state) => state.appusersdata.userId);
  const userData = useSelector((state) => state.appusersdata.userData);
  const userType = useSelector((state) => state.appusersdata.userType);
  const userName = useSelector((state) => state.appusersdata.name);
  const cameraPermissionStatus = useSelector(
    (state) => state.cameraStatus.cameraPermissionStatus
  );
  const cameraStatus = useSelector((state) => state.cameraStatus.cameraStatus);
  const locationEnabledd = useSelector(
    (state) => state.userLocation.locationEnabled
  );
  const locationPermissionStatus = useSelector(
    (state) => state.userLocation.locationPermissionStatus
  );
  const workflowProgram = useSelector((state) => state.appWorkflow.program);
  const location = useSelector((state) => state.userLocation.location);
  const currentVersion = useSelector((state) => state.appusers.app_version);
  const focused = useIsFocused();
  const device = useCameraDevice("back");

  const { responseTime, loading } = useInternetSpeedContext();
  console.log("workflowProgram", workflowProgram);
  console.log(
    cameraPermissionStatus,
    cameraStatus,
    locationEnabledd,
    locationPermissionStatus
  );
  const requiresLocation = route.params?.requiresLocation;
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";
  const gifUriLoading = Image.resolveAssetSource(
    require("../../../assets/gif/loader2.gif")
  ).uri;

  const gifUriCheck = Image.resolveAssetSource(
    require("../../../assets/gif/checkAnimated3.gif")
  ).uri;

  const dispatch = useDispatch();
  // console.log('Workflow Program is ',location);
  let addedqr = [];

  const isFocused = useIsFocused();
  // let isActive = isFocused  === "active"

  const { t } = useTranslation();
  // console.log("Selector state",useSelector((state)=>state.appusersdata.userId))

  // mutations ----------------------------------------
  const [
    verifyQrFunc,
    {
      data: verifyQrData,
      error: verifyQrError,
      isLoading: verifyQrIsLoading,
      isError: verifyQrIsError,
    },
  ] = useVerifyQrMutation();

  const [
    checkGenuinityFunc,
    {
      data: checkGenuinityData,
      error: checkGenuinityError,
      isLoading: checkGenuinityIsLoading,
      isError: checkGenuinityIsError,
    },
  ] = useCheckGenuinityMutation();

  const [
    checkWarrantyFunc,
    {
      data: checkWarrantyData,
      error: checkWarrantyError,
      isLoading: checkWarrantyIsLoading,
      isError: checkWarrantyIsError,
    },
  ] = useCheckWarrantyMutation();

  const [
    productDataFunc,
    {
      data: productDataData,
      error: productDataError,
      isLoading: productDataIsLoading,
      isError: productDataIsError,
    },
  ] = useGetProductDataMutation();

  const [
    addBulkQrFunc,
    {
      data: addBulkQrData,
      error: addBulkQrError,
      isLoading: addBulkQrIsLoading,
      isError: addBulkQrIsError,
    },
  ] = useAddBulkQrMutation();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (addBulkQrData) {
      // console.log("addBulkQrData",addBulkQrData)
      if (addBulkQrData.success) {
        setTimeout(() => {
          setShowProceed(true);
        }, 1200);
        // isFirstScan && checkFirstScan()
        if (checkGenuinityData) {
          if (checkGenuinityData?.body) {
            // console.log("check warranty data",checkWarrantyData)
            if (checkWarrantyError) {
              if (checkWarrantyError?.data?.body) {
                setTimeout(() => {
                  handleWorkflowNavigation("Genuinity+", "Warranty");
                }, 1000);
              } else {
                setTimeout(() => {
                  handleWorkflowNavigation("Genuinity+");
                }, 1000);
              }
            } else if (checkWarrantyData) {
              if (checkWarrantyData?.body) {
                setTimeout(() => {
                  handleWorkflowNavigation("Genuinity+", "Warranty");
                }, 1000);
              } else {
                setTimeout(() => {
                  handleWorkflowNavigation("Genuinity+");
                }, 1000);
              }
            }
          } else {
            if (checkWarrantyError) {
              if (checkWarrantyError?.data?.body) {
                setTimeout(() => {
                  handleWorkflowNavigation("Warranty");
                }, 1000);
              } else {
                handleWorkflowNavigation();
              }
            } else if (checkWarrantyData) {
              if (checkWarrantyData?.body) {
                setTimeout(() => {
                  handleWorkflowNavigation("Warranty");
                }, 1000);
              } else {
                setTimeout(() => {
                  handleWorkflowNavigation();
                }, 1000);
              }
            } else {
              setTimeout(() => {
                handleWorkflowNavigation();
              }, 1000);
            }
          }
        } else if (checkWarrantyError) {
          if (checkWarrantyError?.data?.body) {
            if (checkGenuinityData) {
              if (checkGenuinityData?.body) {
                setTimeout(() => {
                  handleWorkflowNavigation("Genuinity+", "Warranty");
                }, 1000);
              } else {
                setTimeout(() => {
                  handleWorkflowNavigation("Warranty");
                }, 1000);
              }
            }
          }
        } else {
          // console.log("else")

          setTimeout(() => {
            handleWorkflowNavigation();
          }, 1000);
        }
      }
    } else if (addBulkQrError) {
      // console.log("addBulkQrError",addBulkQrError)
      setTimeout(() => {
        setShowProceed(true);
      }, 1200);

      if (addBulkQrError.data) {
        if (addBulkQrError.status == 400) {
          setUpdate(true);
          setMessage(addBulkQrError.data?.message);
        } else {
          setError(true);
          setMessage(addBulkQrError.data?.message);
        }
      }
    }
  }, [addBulkQrData, addBulkQrError]);

  useEffect(() => {
    if (checkGenuinityData) {
      console.log("genuinity check", checkGenuinityData);
    } else if (checkGenuinityError) {
      if (checkGenuinityError.status == 401) {
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
        setMessage(t("Unable to check warranty status of this QR"));
      }
      // console.log('Error', checkGenuinityError);
    }
  }, [checkGenuinityData, checkGenuinityError]);

  useEffect(() => {
    if (checkWarrantyData) {
      console.log("warranty check", checkWarrantyData);
    } else if (checkWarrantyError) {
      if (checkWarrantyError.status == 401) {
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
        setMessage(t("Unable to check warranty status of this QR"));
      }
      // console.log('warranty Error', checkWarrantyError);
    }
  }, [checkWarrantyData, checkWarrantyError]);

  useEffect(() => {
    if (productDataData) {
      const form_type = "2";
      const token = savedToken;
      console.log("Product Data is ", productDataData?.body);

      if (productDataData?.body?.products.length !== 0) {
        if (productDataData?.body?.products[0].points_active === "2") {
          setError(true);
          setMessage(t("Reward is not activated for this product"));
        } else {
          const body = {
            product_id: productDataData?.body?.products[0].product_id,
            qr_id: qr_id,
          };
          // console.log("productdata",body)
          dispatch(setProductData(productDataData?.body?.products[0]));

          workflowProgram.includes("Warranty") &&
            checkWarrantyFunc({ form_type, token, body });
          setTimeout(() => {
            setShowProceed(true);
          }, 1000);
        }
      } else {
        setError(true);
        setMessage(t("Product data not available."));
        if (addedQrList.length === 1) {
          setShowProceed(false);
        } else {
          setShowProceed(true);
        }
      }
    } else if (productDataError) {
      if (productDataError.status == 401) {
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
        // console.log('pr Error', productDataError);
        setError(true);
        setMessage(productDataError?.data?.Error?.message);
      }
    }
  }, [productDataData, productDataError]);
  // ----------------------------------------------------
  const height = Dimensions.get("window").height;
  const platform = Platform.OS === "ios" ? "1" : "2";
  const platformMargin = Platform.OS === "ios" ? -60 : -160;
  const toDate = undefined;
  var fromDate = undefined;

  useEffect(() => {
    if (Object.keys(location).length == 0) {
      setLocationGranted(false);
    } else {
      setLocationGranted(true);
    }
  }, [location]);

  useEffect(() => {
    console.log(
      "Location and camera status",
      cameraPermissionStatus,
      cameraStatus,
      locationEnabled,
      locationPermissionStatus
    );
  }, [cameraPermissionStatus, cameraStatus]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
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

  useEffect(() => {
    refreshScanner();
  }, []);

  // checking for response time
  useEffect(() => {
    console.log("responseTime", responseTime);
    if (responseTime > 4000) {
      setIsSlowInternet(true);
    }
    if (responseTime < 4000) {
      setIsSlowInternet(false);
    }
  }, [responseTime]);

  useEffect(() => {
    if (verifyQrData) {
      console.log("Verify qr data", verifyQrData?.body);
      setAnimationModal(true);
      setTimeout(() => {
        setAnimationModal(false);
      }, 2000);
      setIsLoading(false);
      dispatch(setProductMrp(verifyQrData?.body?.qr));

      // let qrStatus,statusCode;

      // if(verifyQrData?.body?.qr!==undefined)
      // {
      //   qrStatus = verifyQrData.body?.qr?.qr_status == undefined
      //   statusCode = verifyQrData?.status;

      //  if (qrStatus === "1") {
      //    addQrDataToList(verifyQrData.body.qr);
      //  }
      // }
      // else{
      //   dispatch(setProductMrp(verifyQrData?.body))
      //   qrStatus = verifyQrData.body?.qr_status == undefined
      //   statusCode = verifyQrData?.status;

      //  if (qrStatus === "1") {
      //    addQrDataToList(verifyQrData.body);
      //  }
      // }

      // if (qrStatus === "2") {
      //   if (statusCode === 201) {
      //     setError(true);
      //     setMessage(verifyQrData.message);
      //   } else if (statusCode === 202) {
      //     setIsReportable(true);
      //     setError(true);
      //     setMessage(verifyQrData.message);
      //   } else if (statusCode === 200) {
      //     setError(true);
      //     setMessage(verifyQrData.message);
      //   }
      // }
    } else if (verifyQrError) {
      setIsLoading(false);
      if (verifyQrError === undefined) {
        setError(true);
        setMessage(t("This QR is not activated yet"));
      } else {
        setError(true);
        setMessage(verifyQrError.data?.message);
      }
      // console.log('Verify qr error', verifyQrError?.data?.Error);
    }
  }, [verifyQrData, verifyQrError]);

  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "pink" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: "400",
        }}
      />
    ),

    error: ({ text1, props }) => (
      <View
        style={{
          height: 60,
          width: "70%",
          backgroundColor: ternaryThemeColor,
          borderWidth: 1,
          borderColor: ternaryThemeColor,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontWeight: "800" }}>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    ),
  };

  const modalClose = () => {
    setError(false);
    setSuccess(false);
    setIsReportable(false);
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const codeScanner = useCodeScanner({
    codeTypes: scannerType == "bar" ? ["code-128"] : ["qr"],
    onCodeScanned: debounce((codes) => {
      console.log(`Scanned ${codes.length} codes!`, codes[0]?.value);
      scanDelay(codes[0]?.value, () => {
        Vibration.vibrate([1000, 1000, 1000]);
        onSuccess(codes[0]?.value);
      });
    }, 100), // Debounce time: adjust as needed
  });

  const onSuccess = async (e) => {
    console.log("Qr data is ------", e);
    console.log("addedQrListIs", addedQrList);
    console.log("isDuplicateQr", isDuplicateQr);

    if (e === undefined) {
      setError(true);
      setMessage(t("Please scan a valid QR"));
    } else {
      const verifyQR = async (data) => {
        console.log("qrDataVerifyQR", data);
        if (data?.unique_code != undefined) {
          try {
            // Retrieve the credentials
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
              setSavedToken(credentials?.username);
              const token = credentials?.username;

              const response = await verifyQrFunc({ token, data });
              console.log("verifyQrFunc", response);
              if (response?.data) {
                console.log("Verify qr data", JSON.stringify(response));
                if (response?.data?.body == null) {
                  setError(true);
                  setMessage(t("Can't get product data"));
                  setAnimationModal(false);
                }

                const qrStatus =
                  response?.data.body?.qr?.qr_status == undefined
                    ? response?.data.body?.qr_status
                    : response?.data.body?.qr?.qr_status;
                const statusCode = response?.data?.status;
                const verifiedQrData =
                  response?.data.body.qr == undefined
                    ? response?.data.body
                    : response?.data.body.qr;
                if (qrStatus === "1") {
                  await addQrDataToList(verifiedQrData);
                }

                if (qrStatus === "2") {
                  const updatedDuplicateQr = new Set(isDuplicateQr);
                  updatedDuplicateQr.delete(String(data?.unique_code));

                  setIsDuplicateQr(updatedDuplicateQr);

                  if (statusCode === 201) {
                    setError(true);
                    setMessage(response?.data.message);
                  } else if (statusCode === 202) {
                    setIsReportable(true);
                    setError(true);
                    setMessage(response?.data.message);
                  } else if (statusCode === 200) {
                    setError(true);
                    setMessage(response?.data.message);
                  }
                }
              } else {
                const updatedDuplicateQr = new Set(isDuplicateQr);
                updatedDuplicateQr.delete(String(data?.unique_code));

                setIsDuplicateQr(updatedDuplicateQr);
                console.log("response error", response.error.data.message);

                setError(true);
                setMessage(response.error.data.message);
              }
            }
          } catch (error) {}
        } else {
          setError(true);
          setMessage(t("Invalid QR"));
        }
      };
      console.log("data from gallery", e);
      let qrData = e?.split("=")[1];

      let requestData = {};

      if (qrData?.split("-").length === 1) {
        requestData["unique_code"] = `ozone-${qrData}`;
        qrData = `ozone-${qrData}`;
      } else if (qrData?.split("-").length === 2) {
        requestData["unique_code"] = qrData;
      }

      console.log("onSuccess qrData", qrData);
      // Check for duplicate QR code

      if (isDuplicateQr.has(qrData)) {
        console.log("duplicate code exists");
        Toast.show({
          type: "error",
          text1: "This QR is already added to the list",
          position: "bottom",
          visibilityTime: 1000,
          autoHide: true,
        });

        return;
      }

      verifyQR(requestData);

      let duplicateQrSet = new Set(isDuplicateQr);
      duplicateQrSet.add(qrData);
      setIsDuplicateQr(duplicateQrSet);
    }
  };

  // add qr to the list of qr--------------------------------------

  const addQrDataToList = async (data) => {
    setIsLoading(false);
    const qrId = data.id;
    setQr_id(qrId);

    const productCode = data?.product_code;

    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      // console.log(
      //   'Credentials successfully loaded for user ' + credentials?.username, data
      // );
      const token = credentials?.username;

      workflowProgram.includes("Genuinity" || "Genuinity+") &&
        checkGenuinityFunc({ qrId, token });
      productDataFunc({ productCode, userType, token });
    }
    addedqr = addedQrList;
    // console.log("addQrDataToList",addedqr,data)

    if (addedqr.length === 0) {
      //  setAddedQrList([...addedqr, data]);
      addedqr.push(data);
    } else {
      const existingObject = addedqr.find(
        (obj) => obj?.unique_code === data?.unique_code
      );
      // console.log("existingObject",existingObject,data)
      if (!existingObject) {
        // setAddedQrList([...addedqr, data]);
        addedqr.push(data);
      } else {
        setError(true);
        setAnimationModal(false);
        setMessage(t("Sorry This QR is already added to the list"));
      }
    }
    console.log(
      "Adding qr to list chekcing duplicate and list",
      addedQrList,
      isDuplicateQr
    );
    setAddedQrList(addedqr);
    return addedqr;
  };
  // --------------------------------------------------------

  // delete qr from list of qr-------------------------------------
  const deleteQrFromList = (code) => {
    try {
      const updatedList = addedQrList.filter(
        (item) => item?.unique_code !== code
      );
      setAddedQrList(updatedList);

      const updatedDuplicateQr = new Set(isDuplicateQr);
      updatedDuplicateQr.delete(String(code));
      setIsDuplicateQr(updatedDuplicateQr);
    } catch (e) {
      console.log("Exception in deleting QR", e);
    }
  };

  // --------------------------------------------------------

  // function to handle workflow navigation-----------------------
  const handleWorkflowNavigation = (item1, item2, item3) => {
    if (addedQrList.length > 1) {
      dispatch(setScanningType("Bulk"));
    } else {
      dispatch(setScanningType("Single"));
    }
    // console.log('success');
    // console.log("Items are",item1, item2, item3);

    const itemsToRemove = [item1, item2, item3];
    const updatedWorkflowProgram = workflowProgram.filter(
      (item) => !itemsToRemove.includes(item)
    );

    if (updatedWorkflowProgram[0] === "Static Coupon") {
      // console.log(updatedWorkflowProgram.slice(1));
      navigation.navigate("CongratulateOnScan", {
        workflowProgram: updatedWorkflowProgram.slice(1),
        rewardType: updatedWorkflowProgram[0],
      });
    } else if (updatedWorkflowProgram[0] === "Warranty") {
      // console.log(updatedWorkflowProgram.slice(1));
      navigation.navigate("ActivateWarranty", {
        workflowProgram: updatedWorkflowProgram.slice(1),
        rewardType: updatedWorkflowProgram[0],
      });
    } else if (
      updatedWorkflowProgram[0] === "Points On Product" ||
      updatedWorkflowProgram[0] === "Cashback" ||
      updatedWorkflowProgram[0] === "Wheel"
    ) {
      // console.log(updatedWorkflowProgram.slice(1));
      navigation.navigate("CongratulateOnScan", {
        workflowProgram: updatedWorkflowProgram.slice(1),
        rewardType: updatedWorkflowProgram[0],
      });
    } else if (updatedWorkflowProgram[0] === "Genuinity+") {
      // console.log(updatedWorkflowProgram.slice(1));
      navigation.navigate("GenuinityScratch", {
        workflowProgram: updatedWorkflowProgram.slice(1),
        rewardType: updatedWorkflowProgram[0],
      });
    } else if (updatedWorkflowProgram[0] === "Genuinity") {
      // console.log(updatedWorkflowProgram.slice(1));
      navigation.navigate("Genuinity", {
        workflowProgram: updatedWorkflowProgram.slice(1),
        rewardType: updatedWorkflowProgram[0],
      });
    } else {
      // console.log("You have completed the workflow")
    }
  };

  // --------------------------------------------------------
  //check if warranty is claimed
  // useEffect(() => {
  //   if (checkWarrantyData) {
  //     console.log("Check Warranty Is Already Claimed",checkWarrantyData.body);

  //   } else {
  //     console.log(checkWarrantyError);
  //   }
  // }, [checkWarrantyData, checkWarrantyError]);
  // --------------------------------------------------------

  // getting verify qr data --------------------------

  // --------------------------------------------------------

  // handle camera functions --------------------------------------

  const handleFlash = () => {
    setFlash(!flash);
  };

  const handleZoom = () => {
    if (zoom === 2) {
      setZoom(1);
      setZoomText("1");
    } else {
      setZoom(2);
      setZoomText("2");
    }
  };

  const refreshScanner = () => {
    setScannerKey((prevKey) => prevKey + 1);
  };

  const handleOpenImageGallery = async () => {
    const result = await launchImageLibrary({ selectionLimit: 20 });
    console.log("handleOpenImageGalleryresult", result);
    setIsLoading(true);
    if (result?.assets) {
      const detectedQRCodes = [];

      for (let i = 0; i < result?.assets.length; i++) {
        // console.log("RNQRGenerator", result?.assets[i]?.uri);

        try {
          const response = await RNQRGenerator.detect({
            uri: result?.assets[i]?.uri,
          });

          const { values } = response;
          const requestData = values.length > 0 ? values[0] : null;

          if (requestData) {
            console.log("handleOpenImageGalleryresultrequestData", requestData);
            detectedQRCodes.push(requestData);
          } else {
            // console.log('No QR code detected in the image');
          }
        } catch (error) {
          // console.log('Error detecting QR code in image', error);
        }
      }

      // Process all detected QR codes after the loop completes
      detectedQRCodes.forEach((data) => {
        onSuccess(data);
      });
    }
  };

  // --------------------------------------------------------

  // function to call add qr api -------------------------------

  const handleAddQr = () => {
    const token = savedToken;

    const addedQrID = addedQrList.map((item, index) => {
      return item.id;
    });
    const params = {
      token: token,
      data: {
        qrs: addedQrID,
        platform_id: 1,
        name: userData?.name,
        app_version: currentVersion,
        scan_type: "Point on product",
      },
    };
    setAnimationModal(true);
    setTimeout(() => {
      setAnimationModal(false);
    }, 3500);

    setShowProceed(false);
    addBulkQrFunc(params);
    dispatch(setQrIdList(addedQrID));
    dispatch(setQrData(addedQrList));
    // console.log(addedQrID,params)
  };
  // --------------------------------------------------------
  const helpModalComp = () => {
    return (
      <View
        style={{
          width: 340,
          height: 320,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={{ height: 370, width: 390 }}
          source={require("../../../assets/images/howToScan.png")}
        ></Image>
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
          onPress={() => setHelpModal(false)}
        >
          <Close name="close" size={17} color="#ffffff" />
        </TouchableOpacity>
      </View>
    );
  };

  const locationStatus = (status) => {
    console.log(
      "location status recieved from enable location screen ",
      status
    );
    setLocationEnabled(status);
  };

  const SlowInternetComp = () => {
    return (
      <View
        style={{ alignItems: "center", justifyContent: "center", width: "90%" }}
      >
        <Text style={{ color: "black" }}>
          Slow Internet Connection Detected
        </Text>
        <Text style={{ color: "black" }}>
          Please check your internet connection.{" "}
        </Text>
      </View>
    );
  };

  // console.log("device",device)

  return (
    <>
      {/* <QRCodeScanner
        key={scannerKey}
          onRead={onSuccess}
          reactivate={true}
          vibrate={true}
          checkAndroid6Permissions={true}
          reactivateTimeout={2000}
          fadeIn={true}
          flashMode={
            !flash
              ? RNCamera.Constants.FlashMode.off
              : RNCamera.Constants.FlashMode.torch
          }
          customMarker={
            <View
              style={{ height: "100%", width: "100%", flexDirection: "row" }}
            >
              <View
                style={{
                  height: "36%",
                  width: "80%",
                  position: "absolute",
                  top: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  left: 0,
                }}
              >
                <PoppinsText
                  style={{
                    fontSize: 20,
                    color: "white",
                    position: "absolute",
                    right: 0,
                    top: 0,
                  }}
                  content="Scan Product QR Code"
                ></PoppinsText>
                <View
                  style={{
                    backgroundColor: "transparent",
                    borderWidth: 4,
                    borderColor: "#305CB8",
                    height: 200,
                    width: 240,
                    borderRadius: 20,
                    position: "absolute",
                    right: 0,
                    top: 40,
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <View
                    style={{
                      height: 40,
                      width: 80,
                      backgroundColor: "#58585A",
                      borderRadius: 20,
                      marginBottom: 8,
                      flexDirection: "row",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setHelpModal(true);
                      }}
                      style={{
                        backgroundColor: "black",
                        height: 34,
                        width: 34,
                        borderRadius: 17,
                        position: "absolute",
                        left: 5,
                        top: 3,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        style={{ height: 16, width: 16, resizeMode: "contain" }}
                        source={require("../../../assets/images/qrQuestionMark.png")}
                      ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        handleZoom();
                      }}
                      style={{
                        backgroundColor: "black",
                        height: 34,
                        width: 34,
                        borderRadius: 17,
                        position: "absolute",
                        right: 5,
                        top: 3,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ fontSize: 14, color: "#FB774F" }}>
                        {zoomText}X
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View
                style={{
                  width: "20%",
                  height: "36%",
                  position: "absolute",
                  right: 0,
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Dashboard");
                  }}
                  style={{ height: 34, width: 34, margin: 10, left: 20 }}
                >
                  <Image
                    style={{ height: 34, width: 34, resizeMode: "contain" }}
                    source={require("../../../assets/images/qrCancel.png")}
                  ></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleFlash();
                  }}
                  style={{ height: 44, width: 44, margin: 20 }}
                >
                  <Image
                    style={{ height: 44, width: 44, resizeMode: "contain" }}
                    source={require("../../../assets/images/qrTorch.png")}
                  ></Image>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleOpenImageGallery();
                  }}
                  style={{ height: 44, width: 44, margin: 20 }}
                >
                  <Image
                    style={{ height: 44, width: 44, resizeMode: "contain" }}
                    source={require("../../../assets/images/qrGallery.png")}
                  ></Image>
                </TouchableOpacity>
              </View>
            </View>
          }
          showMarker={true}
          cameraStyle={{ height: "100%" }}
          cameraProps={{ zoom: zoom }}
          bottomContent={
            <View
              style={{
                height: height - 100,
                backgroundColor: "white",
                width: "100%",
                top: platformMargin,
                borderRadius: 30,
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
             

              {isLoading && (
                <FastImage
                  style={{ width: 60, height: 60, alignSelf: "center" }}
                  source={{
                    uri: gifUri, // Update the path to your GIF
                    priority: FastImage.priority.normal,
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                />
              )}
              {addedQrList.length === 0 ? (
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <ScrollView
                    contentContainerStyle={{
                      alignItems: "center",
                      justifyContent: "center",
                      width: "80%",
                      marginTop: 60,
                    }}
                  >
                    <Image
                      style={{ height: 300, width: 300, resizeMode: "contain" }}
                      source={require("../../../assets/images/qrHowTo.png")}
                    ></Image>
                    <PoppinsTextMedium
                      style={{ color: "grey", fontWeight: "700", fontSize: 20 }}
                      content={t(
                        "Please start scanning by pointing the camera towards the QR Code"
                      )}
                    ></PoppinsTextMedium>
                  </ScrollView>
                </View>
              ) : (
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FlatList
                    style={{ width: "100%", height: 300 }}
                    data={addedQrList}
                    renderItem={({ item, index }) => (
                      <View
                        style={{
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ScannedListItem
                          handleDelete={deleteQrFromList}
                          unique_code={item.unique_code}
                          index={index}
                          serialNo={item.batch_running_code}
                          productName={item.name}
                          productCode={item.product_code}
                          batchCode={item.batch_code}
                        ></ScannedListItem>
                      </View>
                    )}
                    keyExtractor={(item) => item.id}
                  />
                </View>
              )}
              {error  && (
                <ErrorModal
                  modalClose={modalClose}
                  productData={verifyQrData?.body?.qr}
                  message={message}
                  isReportable={isReportable}
                  openModal={error}
                ></ErrorModal>
              )}
              {success && (
                <MessageModal
                  modalClose={modalClose}
                  title="Success"
                  message={message}
                  openModal={success}
                ></MessageModal>
              )}
              {showProceed && (
                <ButtonProceed
                  handleOperation={handleAddQr}
                  style={{ color: "white" }}
                  content="Proceed"
                  navigateTo={"QrCodeScanner"}
                ></ButtonProceed>
              )}

              {helpModal && (
                <ModalWithBorder
                  modalClose={() => {
                    setHelpModal(!helpModal);
                  }}
                  // message={message}
                  openModal={helpModal}
                  // navigateTo="WarrantyClaimDetails"
                  // parameters={{ warrantyItemData: data, afterClaimData: warrantyClaimData }}
                  comp={helpModalComp}
                ></ModalWithBorder>
              )}


              {isSlowInternet && <InternetModal visible={isSlowInternet} comp = {SlowInternetComp} /> }

            </View>
          }
        /> */}

      {device != null  && (
        <View style={{ height: "100%", width: "100%" }}>
          <Camera
            codeScanner={codeScanner}
            focusable={true}
            exposure={0}
            zoom={zoom}
            // frameProcessor={frameProcessor}
            // frameProcessorFps={5}
            style={{ height: "40%" }}
            device={device}
            isActive={cameraEnabled}
            torch={flash ? "on" : "off"}
            // format={}
          ></Camera>

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              position: "absolute",
              top: 0,
              right: 0,
            }}
          >
            <View
              style={{
                height: "36%",
                width: "80%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PoppinsTextMedium
                style={{
                  fontSize: 20,
                  color: "white",
                  marginLeft: 75,
                  marginBottom: 30,
                }}
                content="Scan Product QR Code"
              ></PoppinsTextMedium>
              <View
                style={{
                  backgroundColor: "transparent",
                  borderWidth: 4,
                  borderColor: "#305CB8",
                  height: 200,
                  width: 240,
                  alignSelf: "center",
                  position: "absolute",
                  right: 0,
                  top: 60,

                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <View
                  style={{
                    height: 40,
                    width: 80,
                    backgroundColor: "#58585A",
                    borderRadius: 20,
                    marginBottom: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setHelpModal(true);
                    }}
                    style={{
                      backgroundColor: "black",
                      height: 34,
                      width: 34,
                      borderRadius: 17,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      style={{
                        height: 16,
                        width: 16,
                        resizeMode: "contain",
                        alignSelf: "center",
                      }}
                      source={require("../../../assets/images/qrQuestionMark.png")}
                    ></Image>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleZoom();
                    }}
                    style={{
                      backgroundColor: "black",
                      height: 34,
                      width: 34,
                      borderRadius: 17,
                      marginLeft: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ fontSize: 14, color: "#FB774F" }}>
                      {zoomText}X
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={{
                width: "20%",
                height: "36%",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Dashboard");
                }}
                style={{ height: 34, width: 34, margin: 10, left: 20 }}
              >
                <Image
                  style={{ height: 34, width: 34, resizeMode: "contain" }}
                  source={require("../../../assets/images/qrCancel.png")}
                ></Image>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleFlash();
                }}
                style={{ height: 44, width: 44, margin: 20, marginTop: 80 }}
              >
                <Image
                  style={{ height: 44, width: 44, resizeMode: "contain" }}
                  source={require("../../../assets/images/qrTorch.png")}
                ></Image>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleOpenImageGallery();
                }}
                style={{ height: 44, width: 44, margin: 20 }}
              >
                <Image
                  style={{ height: 44, width: 44, resizeMode: "contain" }}
                  source={require("../../../assets/images/qrGallery.png")}
                ></Image>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              height: "60%",
              backgroundColor: "white",
              width: "100%",
              // top: platformMargin,
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            {error && (
              <ErrorModal
                modalClose={modalClose}
                productData={verifyQrData?.body?.qr}
                message={message}
                warning={!isReportable ? true : false}
                isReportable={isReportable}
                openModal={error}
              ></ErrorModal>
            )}

            {success && (
              <MessageModal
                modalClose={modalClose}
                title="Success"
                message={message}
                openModal={success}
              ></MessageModal>
            )}

            {addedQrList.length === 0 ? (
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                {console.log("addede QRLIST", addedQrList)}
                <ScrollView
                  contentContainerStyle={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: "80%",
                    marginTop: 60,
                  }}
                >
                  <Image
                    style={{ height: 300, width: 300, resizeMode: "contain" }}
                    source={require("../../../assets/images/qrHowTo.png")}
                  ></Image>
                </ScrollView>
              </View>
            ) : (
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  // backgroundColor:'red'
                }}
              >
                {console.log("addede QRLIST", addedQrList)}
                <FlatList
                  style={{ width: "100%", height: "80%" }}
                  data={addedQrList}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ScannedListItem
                        listSize={addedQrList.length}
                        handleDelete={deleteQrFromList}
                        unique_code={item.unique_code}
                        index={index}
                        serialNo={item.batch_running_code}
                        productName={item.name}
                        productCode={item.product_code}
                        batchCode={item.batch_code}
                      ></ScannedListItem>
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                />

                {showProceed && (
                  <View style={{ marginBottom: 60 }}>
                    <ButtonProceed
                      handleOperation={handleAddQr}
                      style={{ color: "white", fontSize: 16 }}
                      // content="Proceed"
                      content={"Proceed"}
                      navigateTo={"QrCodeScanner"}
                    ></ButtonProceed>
                  </View>
                )}
              </View>
            )}
            <Toast config={toastConfig} />
          </View>
          {}

          {helpModal && (
            <ModalWithBorder
              modalClose={() => {
                setHelpModal(!helpModal);
              }}
              // message={message}
              openModal={helpModal}
              // navigateTo="WarrantyClaimDetails"
              // parameters={{ warrantyItemData: data, afterClaimData: warrantyClaimData }}
              comp={helpModalComp}
            ></ModalWithBorder>
          )}
          {animationModal && (
            <View style={{}}>
              <Modal
                transparent={true}
                animationType="fade"
                visible={true}
                onRequestClose={() => setAnimationModal(false)} // Close modal on back press
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <FastImage
                      style={styles.gifStyle}
                      source={{
                        uri: gifUriCheck,
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  </View>
                </View>
              </Modal>
            </View>
          )}

          {verifyQrIsLoading && (
            <View style={{}}>
              <Modal
                transparent={true}
                animationType="fade"
                visible={true}
                onRequestClose={() => setAnimationModal(false)} // Close modal on back press
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <FastImage
                      style={styles.gifStyle}
                      source={{
                        uri: gifUriLoading,
                        priority: FastImage.priority.normal,
                      }}
                      resizeMode={FastImage.resizeMode.contain}
                    />
                  </View>
                </View>
              </Modal>
            </View>
          )}
          
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: "#777",
  },
  textBold: {
    fontWeight: "500",
    color: "#000",
  },
  buttonText: {
    fontSize: 21,
    color: "black",
  },
  buttonTouchable: {
    padding: 16,
  },
});

export default QrCodeScanner;
