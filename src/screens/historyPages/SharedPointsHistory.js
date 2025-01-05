import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Text,
  ScrollView,
} from "react-native";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useFetchAllQrScanedListMutation } from "../../apiServices/qrScan/AddQrApi";
import { useSelector } from "react-redux";
import * as Keychain from "react-native-keychain";
import { useFetchUserPointsMutation } from "../../apiServices/workflow/rewards/GetPointsApi";
import { useGetPointSharingDataMutation } from "../../apiServices/pointSharing/pointSharingApi";
import moment from "moment";
import BottomModal from "../../components/modals/BottomModal";
import FastImage from "react-native-fast-image";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import FilterModal from "../../components/modals/FilterModal";
import InputDate from "../../components/atoms/input/InputDate";
import { t } from "i18next";

const SharedPointsHistory = ({ navigation }) => {
  const [distinctDateArr, setDistinctDateArr] = useState();
  const [scannedListData, setScannedListData] = useState([]);
  const gifUri = Image.resolveAssetSource(
    require("../../../assets/gif/loader.gif")
  ).uri;
  const noData = Image.resolveAssetSource(
    require("../../../assets/gif/noData.gif")
  ).uri;

  const [
    getPointSharingFunc,
    {
      data: getPointSharingData,
      error: getPointSharingError,
      isLoading: getPointSharingIsLoading,
      isError: getPointSharingIsError,
    },
  ] = useGetPointSharingDataMutation();

  const [
    userPointFunc,
    {
      data: userPointData,
      error: userPointError,
      isLoading: userPointIsLoading,
      isError: userPointIsError,
    },
  ] = useFetchUserPointsMutation();

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";
  const qrData = useSelector((state) => state.qrData.qrData);
  const userId = useSelector((state) => state.appusersdata.userId);
  const id = useSelector((state) => state.appusersdata.id);

  const userData = useSelector((state) => state.appusersdata.userData);
  let startDate, endDate;

  useEffect(() => {
    if (userPointData) {
      console.log("userPointData", userPointData);
    } else if (userPointError) {
      console.log("userPointError", userPointError);
    }
  }, [userPointData, userPointError]);

  const toDate = undefined;
  var fromDate = undefined;
  useEffect(() => {
    fetchPoints();
  }, []);
  useEffect(() => {
    (async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      const params = {
        token: token,
        id: String(userData.id),
        cause: "points_sharing",
      };
      console.log("params", params);
      getPointSharingFunc(params);
    })();
  }, []);

  useEffect(() => {
    if (getPointSharingData) {
      console.log("getPointSharingData", JSON.stringify(getPointSharingData));
    } else if (getPointSharingError) {
      console.log("getPointSharingError", getPointSharingError);
    }
  }, [getPointSharingData, getPointSharingError]);

  const fetchDataAccToFilter = () => {
    console.log("fetchDataAccToFilter", startDate, endDate);
    if (startDate && endDate) {
      if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
        alert(t("Kindly enter proper end date"));
        startDate = undefined;
        endDate = undefined;
      } else {
        console.log("fetchDataAccToFilter");
      }
    } else {
      alert(t("Kindly enter a valid date"));
      startDate = undefined;
      endDate = undefined;
    }
  };

  const fetchPoints = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      userId: id,
      token: token,
    };
    userPointFunc(params);
  };

  const fetchDates = (data) => {
    const dateArr = [];
    let tempArr = [];
    let tempData = [];
    data.map((item, index) => {
      dateArr.push(moment(item.scanned_at).format("DD-MMM-YYYY"));
    });
    const distinctDates = Array.from(new Set(dateArr));
    console.log("distinctDates", distinctDates);

    distinctDates.map((item1, index) => {
      tempData = [];
      data.map((item2, index) => {
        if (moment(item2.scanned_at).format("DD-MMM-YYYY") === item1) {
          tempData.push(item2);
        }
      });
      tempArr.push({
        date: item1,
        data: tempData,
      });
    });
    setScannedListData(tempArr);
    console.log("tempArr", JSON.stringify(tempArr));
  };
  var count = 0;

  const DisplayEarnings = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const handleRedeemButtonPress = () => {
      if (Number(userPointData.body.point_balance) <= 0) {
        setError(true);
        setMessage(t("Sorry you don't have enough points."));
      } else {
        setModalVisible(true);
      }
    };
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
          marginLeft: 20,
        }}
      >
        <View style={{ alignItems: "center" }}>
          {userPointData && (
            <PoppinsText
              style={{ color: "black" }}
              content={userPointData.body.point_earned}
            ></PoppinsText>
          )}
          <PoppinsTextMedium
            style={{ color: "black", fontSize: 14 }}
            content="Points Earned"
          ></PoppinsTextMedium>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          {userPointData && (
            <PoppinsText
              style={{ color: "black" }}
              content={userPointData.body.point_redeemed}
            ></PoppinsText>
          )}
          <PoppinsTextMedium
            style={{ color: "black", fontSize: 14 }}
            content="Points Redeemed"
          ></PoppinsTextMedium>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 20,
          }}
        >
          {userPointData && (
            <PoppinsText
              style={{ color: "black" }}
              content={userPointData.body.point_reserved}
            ></PoppinsText>
          )}
          <PoppinsTextMedium
            style={{ color: "black", fontSize: 14 }}
            content={t("reserved points")}
          ></PoppinsTextMedium>
        </View>
      </View>
    );
  };

  //header
  const Header = () => {
    const [openBottomModal, setOpenBottomModal] = useState(false);
    const [message, setMessage] = useState();
    const modalClose = () => {
      setOpenBottomModal(false);
    };

    const onFilter = (data, type) => {
      console.log("submitted", data, type);

      if (type === "start") {
        startDate = data;
      }
      if (type === "end") {
        endDate = data;
      }
    };

    const ModalContent = (props) => {
      const [startDate, setStartDate] = useState("");
      const [openBottomModal, setOpenBottomModal] = useState(false);
      const [endDate, setEndDate] = useState("");

      const handleStartDate = (startdate) => {
        // console.log("start date", startdate)
        setStartDate(startdate?.value);
        props.handleFilter(startdate?.value, "start");
      };

      const handleEndDate = (enddate) => {
        // console.log("end date", enddate?.value)
        setEndDate(enddate?.value);
        props.handleFilter(enddate?.value, "end");
      };
      return (
        <View
          style={{
            height: 320,
            backgroundColor: "white",
            width: "100%",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        >
          {openBottomModal && (
            <FilterModal
              modalClose={modalClose}
              message={message}
              openModal={openBottomModal}
              handleFilter={onFilter}
              comp={ModalContent}
            ></FilterModal>
          )}

          <PoppinsTextLeftMedium
            content={t("Date Filter")}
            style={{
              color: "black",
              marginTop: 20,
              
              fontWeight: "bold",
              alignSelf:"center"

            }}
          ></PoppinsTextLeftMedium>
          <View>
            <InputDate data={t("Start Date")} handleData={handleStartDate} />
          </View>
          <View>
            <InputDate data={t("End Date")} handleData={handleEndDate} />
          </View>
          <TouchableOpacity
            onPress={() => {
              fetchDataAccToFilter();
            }}
            style={{
              backgroundColor: ternaryThemeColor,
              marginHorizontal: 50,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
              borderRadius: 10,
            }}
          >
            <PoppinsTextMedium
              content={t("SUBMIT")}
              style={{ color: "white", fontSize: 20, borderRadius: 10 }}
            ></PoppinsTextMedium>
          </TouchableOpacity>
        </View>
      );
    };

    return (
      <View
        style={{
          height: 40,
          width: "100%",
          backgroundColor: "#DDDDDD",
          alignItems: "center",
          flexDirection: "row",
          marginTop: 20,
        }}
      >
        <PoppinsTextMedium
          style={{
            marginLeft: 20,
            fontSize: 16,
            position: "absolute",
            left: 10,
            color: "black",
          }}
          content={t("Date Filter")}
        ></PoppinsTextMedium>

        <TouchableOpacity
          onPress={() => {
            setOpenBottomModal(!openBottomModal), setMessage("BOTTOM MODAL");
          }}
          style={{ position: "absolute", right: 20 }}
        >
          <Image
            style={{ height: 22, width: 22, resizeMode: "contain" }}
            source={require("../../../assets/images/settings.png")}
          ></Image>
        </TouchableOpacity>

        {openBottomModal && (
          <FilterModal
            modalClose={modalClose}
            message={message}
            openModal={openBottomModal}
            handleFilter={onFilter}
            comp={ModalContent}
          ></FilterModal>
        )}
      </View>
    );
  };

  const ListItem = (props) => {
    const description = props.description;
    const productCode = props.productCode;
    const time = props.time;
    const day = props.day
    const name = props.name;
    const mobile = props.mobile;
    const amount = props.amount;
    const data = props.data;
    const image = props.image;
    // console.log("data", data)
    // const image = data.images !== null ? data.images[0] : null
    return (
      <TouchableOpacity
        onPress={() => {
          // navigation.navigate('ScannedDetails', { data: data })
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          backgroundColor: "white",
          marginTop: 10,
          borderBottomWidth: 1,
          borderColor: "#DDDDDD",
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            height: 70,
            width: "20%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            borderColor: "#DDDDDD",
          }}
        >
          {image !== null && (
            <Image
              style={{ height: 60, width: 60, resizeMode: "contain" }}
              source={{ uri:image }}
            ></Image>
          )}
        </View>
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "center",
            width: "50%",
          }}
        >
          <PoppinsTextMedium
            style={{
              fontWeight: "600",
              fontSize: 14,
              textAlign: "auto",
              color: "black",
            }}
            content={description}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            style={{ fontWeight: "400", fontSize: 12 }}
            content={`${t("Product Code")} : ${productCode}`}
          ></PoppinsTextMedium>

          <PoppinsTextMedium
            style={{ color: "#91B406", fontSize: 12, color: "grey" }}
            content={`${t("Scanned By")} : ${name}`}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            style={{ color: "#91B406", fontSize: 12, color: "grey" }}
            content={`${t("Mobile Number")} : ${mobile}`}
          ></PoppinsTextMedium>
           <PoppinsTextMedium
            style={{ color: "#91B406", fontSize: 12, color: "grey" }}
            content={`${t("Date")} : ${day}`}
          ></PoppinsTextMedium>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              color: "black",
            }}
          >
            <Image
              style={{ height: 14, width: 14, resizeMode: "contain" }}
              source={require("..s/../../assets/images/clock.png")}
            ></Image>
            <PoppinsTextMedium
              style={{
                fontWeight: "200",
                fontSize: 12,
                marginLeft: 4,
                color: "black",
              }}
              content={time}
            ></PoppinsTextMedium>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            width: "30%",
          }}
        >
          <Image
            style={{ height: 20, width: 20, resizeMode: "contain" }}
            source={require("../../../assets/images/wallet.png")}
          ></Image>

          <PoppinsTextMedium
            style={{ color: "#91B406", fontSize: 16, color: "black" }}
            content={` + ${amount}`}
          ></PoppinsTextMedium>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100%",
        backgroundColor: "#ffffff",
      }}
    >
      {getPointSharingData && (
        <>
          <View
            style={{
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "row",
              width: "100%",
              marginTop: 10,
              height: 40,
              marginLeft: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
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
            <PoppinsTextMedium
              content={t("Shared Point History")}
              style={{
                marginLeft: 10,
                fontSize: 16,
                fontWeight: "600",
                color: "#171717",
              }}
            ></PoppinsTextMedium>
            <TouchableOpacity style={{ marginLeft: 160 }}>
              {/* <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../assets/images/notificationOn.png')}></Image> */}
            </TouchableOpacity>
          </View>
          <View
            style={{
              padding: 14,
              alignItems: "flex-start",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            <PoppinsTextMedium
              style={{
                marginLeft: 10,
                fontSize: 20,
                fontWeight: "600",
                color: "#6E6E6E",
              }}
              content={t("You Have")}
            ></PoppinsTextMedium>

            {userPointData && (
              <PoppinsText
                style={{
                  color: "black",
                  marginLeft: 10,
                  fontSize: 24,
                  fontWeight: "600",
                }}
                content={userPointData.body.point_balance}
              ></PoppinsText>
            )}
            <Image
              style={{
                position: "absolute",
                right: 0,
                width: 82,
                height: 98,
                marginRight: 23,
                marginTop: 20,
              }}
              source={require("../../../assets/images/scanned.png")}
            ></Image>

            <PoppinsTextMedium
              style={{
                marginLeft: 10,
                fontSize: 20,
                fontWeight: "600",
                color: "#6E6E6E",
              }}
              content={t("Point Balance")}
            ></PoppinsTextMedium>

            {/* <DisplayEarnings></DisplayEarnings> */}
          </View>
          {/* <Header></Header> */}
          <ScrollView contentContainerStyle={{ width: "100%" }}>
            {getPointSharingData.body.data &&
              getPointSharingData.body.data.map((item, index) => {
                console.log("item?.images[0]",item?.images)
                return (
                  <ListItem
                    image={item?.images===null ?  null :item?.images[0]   }
                    name={item.name}
                    mobile={item.mobile}
                    key={item.id}
                    data={item}
                    description={item.product_name}
                    productCode={item.product_code}
                    time={moment(item.created_at).format("HH:mm a")}
                    day={moment(item.created_at).format("DD-MMM-YYYY")}
                    amount={item.points}
                  ></ListItem>
                );
              })}
          </ScrollView>
        </>
      )}

      {getPointSharingIsLoading && (
        <FastImage
          style={{
            width: 100,
            height: 100,
            alignSelf: "center",
            marginTop: "50%",
          }}
          source={{
            uri: gifUri, // Update the path to your GIF
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      )}

      {getPointSharingData && getPointSharingData.body.data.length == 0 && (
        <View>
          <FastImage
            style={{
              width: 180,
              height: 180,
              alignSelf: "center",
              marginTop: "30%",
            }}
            source={{
              uri: noData, // Update the path to your GIF
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <PoppinsTextMedium
            style={{ color: "#808080", marginTop: -20, fontWeight: "bold" }}
            content="NO DATA"
          ></PoppinsTextMedium>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default SharedPointsHistory;