import React, { useEffect, useState,useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Text,
  ScrollView,
  Dimensions,
} from "react-native";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useFetchAllQrScanedListMutation } from "../../apiServices/qrScan/AddQrApi";
import { useSelector } from "react-redux";
import * as Keychain from "react-native-keychain";
import { useFetchUserPointsMutation } from "../../apiServices/workflow/rewards/GetPointsApi";
import { useAllUserPointsEntryMutation } from "../../apiServices/workflow/rewards/GetPointsApi";
import moment from "moment";
import BottomModal from "../../components/modals/BottomModal";
import FastImage from "react-native-fast-image";
import InputDate from "../../components/atoms/input/InputDate";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import FilterModal from "../../components/modals/FilterModal";
import { useTranslation } from "react-i18next";

const ScannedHistory = ({ navigation }) => {
  const [distinctDateArr, setDistinctDateArr] = useState();
  const [scannedListData, setScannedListData] = useState([]);
  const [limit, setLimit] = useState(20)

  const gifUri = Image.resolveAssetSource(
    require("../../../assets/gif/loader.gif")
  ).uri;

  const [
    fetchAllQrScanedList,
    {
      data: fetchAllQrScanedListData,
      isLoading: fetchAllQrScanedListIsLoading,
      error: fetchAllQrScanedListError,
      isError: fetchAllQrScanedListIsError,
    },
  ] = useFetchAllQrScanedListMutation();

  const [
    userPointFunc,
    {
      data: userPointData,
      error: userPointError,
      isLoading: userPointIsLoading,
      isError: userPointIsError,
    },
  ] = useFetchUserPointsMutation();

  const list = useRef(null)
  const qrData = useSelector((state) => state.qrData.qrData);
  const userId = useSelector((state) => state.appusersdata.userId);
  const id = useSelector((state) => state.appusersdata.id);
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";
  const noData = Image.resolveAssetSource(
    require("../../../assets/gif/noData.gif")
  ).uri;

  const {t} = useTranslation()

  let startDate, endDate;
  const userData = useSelector((state) => state.appusersdata.userData);
  useEffect(() => {
    if (userPointData) {
      console.log("userPointData", userPointData);
    } else if (userPointError) {
      console.log("userPointError", userPointError);
    }
  }, [userPointData, userPointError]);

  useEffect(() => {
    fetchPoints();
  }, []);
  useEffect(() => {
    (async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      let queryParams = `?user_type_id=${userData.user_type_id}&app_user_id=${userData.id}&limit=${limit}`;
      if (startDate && endDate) {
        queryParams += `&from_date=${moment(startDate).format(
          "YYYY-MM-DD"
        )}&to_date=${moment(endDate).format("YYYY-MM-DD")}`;
      } else if (startDate) {
        queryParams += `&from_date=${moment(startDate).format(
          "YYYY-MM-DD"
        )}`;
      }

      console.log("queryParams", queryParams);

      fetchAllQrScanedList({
        token: token,

        query_params: queryParams,
      });
    })();
  }, []);
  useEffect(()=>{
    (async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      let queryParams = `?user_type_id=${userData.user_type_id}&app_user_id=${userData.id}&limit=${limit}`;
      if (startDate && endDate) {
        queryParams += `&from_date=${moment(startDate).format(
          "YYYY-MM-DD"
        )}&to_date=${moment(endDate).format("YYYY-MM-DD")}`;
      } else if (startDate) {
        queryParams += `&from_date=${moment(startDate).format(
          "YYYY-MM-DD"
        )}`;
      }

      console.log("queryParams", queryParams);

      fetchAllQrScanedList({
        token: token,

        query_params: queryParams,
      });
    })();
  },[limit])

  useEffect(() => {
    if (fetchAllQrScanedListData) {
      console.log(
        "fetchAllQrScanedListData",
        fetchAllQrScanedListData.body
      );
      fetchDates(fetchAllQrScanedListData.body.data);
    } else if (fetchAllQrScanedListError) {
      console.log("fetchAllQrScanedListError", fetchAllQrScanedListError);
    }
  }, [fetchAllQrScanedListData, fetchAllQrScanedListError]);

  const fetchScannedHistoryData=(start,end)=>{

    (async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      console.log("Start End",start,end)
      let queryParams = `?user_type_id=${userData.user_type_id}&app_user_id=${userData.id}&limit=${limit}`;
      if (start && end) {
        queryParams += `&from_date=${moment(start).format(
          "YYYY-MM-DD"
        )}&to_date=${moment(end).format("YYYY-MM-DD")}`;
      } else if (start) {
        queryParams += `&from_date=${moment(start).format(
          "YYYY-MM-DD"
        )}`;
      }

      console.log("queryParams", queryParams);

      fetchAllQrScanedList({
        token: token,

        query_params: queryParams,
      });
    })();
  }
  const fetchPoints = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      userId: id,
      token: token,
    };
    userPointFunc(params);
  };

  const fetchDataAccToFilter=()=>{
    
    console.log("fetchDataAccToFilter",startDate,endDate)
    if(startDate && endDate)
    {
      if(new Date(endDate).getTime() < new Date(startDate).getTime())
      {
        alert(t("Kindly enter proper end date"))
        startDate=undefined
        endDate=undefined
      }
      else {
        fetchScannedHistoryData(startDate,endDate)
      }
      
    }
    else{
      alert(t("Kindly enter a valid date"))
      startDate=undefined
      endDate=undefined
    }
  }
 
    var currentOffset = 0;
  const fetchDates = (data) => {
    console.log("fetching dates : " ,data)
    const dateArr = [];
    let tempArr = [];
    let tempData = [];
    data.map((item, index) => {
      dateArr.push(moment(item.scanned_at).format("DD-MMM-YYYY"));
    });
    const distinctDates = Array.from(new Set(dateArr));
    // console.log("distinctDates", distinctDates);

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
    // console.log("tempArr", JSON.stringify(tempArr));
  };

  var count = 0;
  

  const onFilter = (data, type) => {
    console.log("submitted", data, type);

    if (type === "start") {
      startDate = data
    }
    if (type === "end" ) {
      
        endDate = data 
      
    }
    console.log("start date and end date",startDate,endDate)
  };

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
            style={{ color: "black", fontSize: 14, width:100 }}
            content={t("earned points")}
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
              style={{ color: "black", }}
              content={userPointData.body.point_redeemed}
            ></PoppinsText>
          )}
          <PoppinsTextMedium
            style={{ color: "black", fontSize: 14 , width:100}}
            content={t("points redeemed")}
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
            style={{ color: "black", fontSize: 14, width:100 }}
            content={t("reserved points")}

          ></PoppinsTextMedium>
        </View>
      </View>
    );
  };

  const Header = () => {
    const [openBottomModal, setOpenBottomModal] = useState(false);
    const [message, setMessage] = useState();
    const modalClose = () => {
      setOpenBottomModal(false);
    };

    const ModalContent = (props) => {
      const [startDate, setStartDate] = useState();
      const [endDate, setEndDate] = useState();

      const handleStartDate = (startdate) => {
        console.log("start date", startdate)
        setStartDate(startdate?.value);
        props.handleFilter(startdate?.value, "start");
      };

      const handleEndDate = (enddate) => {
        console.log("end date", enddate?.value)
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
            alignItems:'center'
          }}
        >
          <PoppinsTextLeftMedium
            content={t("Filter Scanned Data")}
            style={{
              color: "black",
              marginTop: 20, 
              fontWeight: "bold",
            }}
          ></PoppinsTextLeftMedium>
          <TouchableOpacity onPress={()=>{setOpenBottomModal(false)}} style={{height:40,width:40,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10}}>
            <Image style={{height:30,width:30,resizeMode:'contain'}} source={require('../../../assets/images/cancel.png')}></Image>
          </TouchableOpacity>
          <View style={{width:'100%'}}>
            <InputDate data={t("Start Date")} handleData={handleStartDate} />
          </View>
          <View style={{width:'100%'}}>
            <InputDate data={t("End Date")} handleData={handleEndDate} />
          </View>
          <TouchableOpacity
            onPress={()=>{
              fetchDataAccToFilter(startDate,endDate)
            }}
            style={{
              backgroundColor: ternaryThemeColor,
              marginHorizontal: 50,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
              borderRadius: 10,
              paddingLeft:10,
              paddingRight:10
            }}
          >
            <PoppinsTextMedium
              content={t("submit")}
              style={{ color: "white", fontSize: 20 }}
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
        {openBottomModal && (
          <FilterModal
            modalClose={modalClose}
            message={message}
            openModal={openBottomModal}
            handleFilter={onFilter}
            comp={ModalContent}
          ></FilterModal>
        )}

        <PoppinsTextMedium
          style={{
            marginLeft: 20,
            fontSize: 16,
            position: "absolute",
            left: 10,
            color:'black'
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
      </View>
    );
  };
  const ListItem = (props) => {
    const description = props.description;
    const productCode = props.productCode;
    const time = props.time;
    const amount = props.amount;
    const data = props.data;
    const visibleCode = props.data?.batch_running_code

    const image = data.images !== null ? data.images[0] : null;
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ScannedDetails", { data: data });
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          margin: 4,
          width: "100%",
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            height: 70,
            width: 70,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            borderColor: "#DDDDDD",
            backgroundColor:ternaryThemeColor,
            marginLeft:20
          }}
        >
          {image !== null && (
            <Image
              style={{ height: 60, width: 60, resizeMode: "contain" }}
              source={{ uri: image=='' ? null : image }}
            ></Image>
          )}
        </View>
        <View
          style={{
            alignItems: "flex-start",
            justifyContent: "center",
            marginLeft: 10,
            width: Dimensions.get('window').width-90,
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
            style={{ fontWeight: "400", fontSize: 12, color: "black" }}
            content={`Product Code : ${productCode}`}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            style={{ fontWeight: "400", fontSize: 12, color: "black" }}
            content={`Visible Code : ${visibleCode}`}
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
        {amount ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 10,
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
        ) : (
          <View style={{ width: 100 }}></View>
        )}
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100%",
        backgroundColor: "white",
      }}
    >
      {fetchAllQrScanedListData && (
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
              content={t("scanned history")}
            
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
              content={t("you have")}
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
              content={t("point balance")}

            ></PoppinsTextMedium>

            <DisplayEarnings></DisplayEarnings>
          </View>
          <Header></Header>

          {scannedListData.length == 0 && (
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

          {fetchAllQrScanedListData.length!==0 && 
            <FlatList
            ref={list}
            // onRefresh={()=>{

            // }}
          //   onScroll={(event) => {
          //     let direction = event.nativeEvent.contentOffset.y > currentOffset ? 'down' : 'up';
          //     currentOffset = event.nativeEvent.contentOffset.y;
          //     console.log(direction); // up or down accordingly
          //     console.log(event)
          // }}
          onEndReached={()=>{
            if(fetchAllQrScanedListData)
            {
              if(limit<fetchAllQrScanedListData.body.total)
            {
               setLimit(limit+50)
            }
            }
            
          }}
              data={scannedListData}
              maxToRenderPerBatch={10}
              initialNumToRender={10}
              renderItem={({ item, index }) => (
                <View
                  style={{
                    alignItems: "flex-start",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "flex-start",
                      paddingBottom: 10,
                      marginTop: 20,
                      marginLeft: 20,
                    }}
                  >
                    <PoppinsTextMedium
                      style={{ color: "black", fontSize: 16 }}
                      content={item.date}
                    ></PoppinsTextMedium>
                  </View>
                  <FlatList
                  
                    data={item.data}
                    maxToRenderPerBatch={10}
                    initialNumToRender={10}
                    renderItem={({ item }) => (
                      <ListItem
                        data={item}
                        description={item.product_name}
                        productCode={item.product_code}
                        batch_running_code={item.batch_running_code}
                        time={moment(item.scanned_at).format("HH:mm a")}
                      ></ListItem>
                    )}
                    keyExtractor={(item, index) => index}
                  />
                </View>
              )}
              keyExtractor={(item, index) => index}
            />
          }
        </>
      )}

      {/* {
        fetchAllQrScanedListIsLoading && <FastImage
          style={{ width: 100, height: 100, alignSelf: 'center', marginTop: '50%' }}
          source={{
            uri: gifUri, // Update the path to your GIF
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      } */}
    </View>
  );
};

const styles = StyleSheet.create({});

export default ScannedHistory;