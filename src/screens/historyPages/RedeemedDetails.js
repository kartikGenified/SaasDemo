import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import moment from "moment";
import { useSelector } from "react-redux";
import Location from "react-native-vector-icons/EvilIcons";
import Message from "react-native-vector-icons/Feather";
import { useGetRedeemedGiftsStatusMutation } from "../../apiServices/gifts/RedeemGifts";
import * as Keychain from 'react-native-keychain';
import TrackDeliveryModal from "../../components/redeemDetails/TrackDeliveryModal";
import { useTranslation } from "react-i18next";
import ShakeViewAnimations from "../../components/animations/ShakeViewAnimations";

const RedeemedDetails = ({ navigation, route }) => {
  const [status, setStatus] = useState("")
  const height = Dimensions.get("window").height;
  const data = route.params.data;

  const { t } = useTranslation();

  const[trackModal, setTrackModal] = useState(false);
    
  const [redeemedGiftStatusFunc,{
    data:redeemedGiftStatusData,
    error:redeemedGiftStatusError,
    isLoading:redeemedGiftIsLoading,
    isError:redeemedGiftIsError
}]= useGetRedeemedGiftsStatusMutation()

  useEffect(() => {
    if (redeemedGiftStatusData) {
      console.log("redeemedGiftStatusData", redeemedGiftStatusData,data);

      const statArray = (redeemedGiftStatusData.body)
     
      const arr  = Array.from(statArray)
      console.log("Statdata",statArray , arr[1],redeemedGiftStatusData.status)
      setStatus(arr[Number(data.status)])
    } else if (redeemedGiftStatusError) {
      console.log("redeemedGiftStatusError", redeemedGiftStatusError);
    }
  }, [redeemedGiftStatusData, redeemedGiftStatusError]);


  useEffect(()=>{
    const getToken=async()=>{
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          'Credentials successfully loaded for user ' + credentials.username
        );
        const token = credentials.username
        const params = {token:token}
        redeemedGiftStatusFunc(params)
      }
    }
    getToken()
  },[])

  const redeemedDate = moment(data.created_at).format("DD MMM YYYY");
  const redeemedId = data.ref_no;
  const redemptionMode = data.redemption_type === "1" ? "Points" : "N/A";

  console.log("Data RedeemedDetails", data);
  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  )
    ? useSelector((state) => state.apptheme.secondaryThemeColor)
    : "#FFB533";
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";
  const productName = data.gift.gift[0].name;
  const productImage = require("../../../assets/images/box.png");
  const walletPoints = data.points;
  const expectedDeliveryDate = "23 Sep 2023";
  const deliveryStatus = "Approved";
  const image = data.gift.gift[0].images[0];
  const deliveryAddress =
    "69/5, Gali no -2 Sainik Enclave Sector 2, Mohan Garden,Uttam Nagar, New Delhi - 110059";


    const hideSuccessModal =() =>{
        setTrackModal(false)
    }

  const ClickToReport = () => {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          position: "absolute",
          bottom: 10,
        }}
      >
        <PoppinsTextMedium
          style={{ color: "black", fontSize: 16, fontWeight: "700" }}
          content={t("Issue with this ?")}
        ></PoppinsTextMedium>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ReportAndIssue", { data: data });
          }}
          style={{
            height: 50,
            width: 180,
            backgroundColor: "#D10000",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
            marginTop: 6,
          }}
        >
          <PoppinsTextMedium
            style={{ color: "white", fontSize: 16 }}
            content={t("Click here to report")}
          ></PoppinsTextMedium>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100%",
        backgroundColor: "white",
        width: "100%",
      }}
    >
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
          content={t("Redeemed Details")}
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: "800",
            color: "#171717",
          }}
        ></PoppinsTextMedium>
        {/* <TouchableOpacity style={{ marginLeft: 160 }}>
          <Image
            style={{ height: 30, width: 30, resizeMode: "contain" }}
            source={require("../../../assets/images/notificationOn.png")}
          ></Image>
        </TouchableOpacity> */}
      </View>
      <ScrollView style={{ width: "100%", height: "100%" }}>
        <View
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 30,
              marginBottom: 10,
            }}
          >
            <PoppinsTextMedium
              style={{ fontSize: 16, fontWeight: "800", color: "#171717" }}
              content={`${t("Redeem Date")} ${redeemedDate}`}
            ></PoppinsTextMedium>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderStyle: "dashed",
                backgroundColor: secondaryThemeColor,
                padding: 6,
                marginTop: 8,
                marginBottom: 10,
              }}
            >
              <PoppinsTextMedium
                style={{ fontSize: 16, fontWeight: "600", color: "#171717" }}
                content={`Redeem Id:  ${redeemedId}`}
              ></PoppinsTextMedium>
            </View>
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#DDDDDD",
              width: "80%",
              borderRadius:10,
              padding: 10,
            }}
          >
            <ShakeViewAnimations comp ={()=>{
              return(
                <Image
                style={{ height: 280, width: 280, resizeMode: "contain" }}
                source={{ uri: image }}
              ></Image>
              )
            

            }}></ShakeViewAnimations>
         
            <PoppinsTextMedium
              style={{ fontSize: 16, fontWeight: "700", color: "#171717" }}
              content={productName}
            ></PoppinsTextMedium>
          </View>

          {/* grey box ------------------------------- */}
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#F7F7F7",
              width: "100%",
              padding: 10,
            }}
          >
            <PoppinsTextMedium
              style={{ fontSize: 20, fontWeight: "600", color: "#171717" }}
              content={`${t("Redemption Mode")}: ${redemptionMode}`}
            ></PoppinsTextMedium>

            {data.redemption_type !== "1" && (
              <View
                style={{
                  height: 50,
                  width: 140,
                  borderWidth: 1,
                  borderStyle: "dashed",
                  backgroundColor: secondaryThemeColor,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 10,
                  borderRadius: 6,
                  flexDirection: "row",
                }}
              >
                <Image
                  style={{ height: 30, width: 30, resizeMode: "contain" }}
                  source={require("../../../assets/images/points.png")}
                ></Image>
                <PoppinsTextMedium
                  style={{ fontSize: 24, fontWeight: "700", color: "#171717" }}
                  content={walletPoints}
                ></PoppinsTextMedium>
              </View>
            )}
            {/* <PoppinsTextMedium
              style={{
                fontSize: 16,
                fontWeight: "500",
                color: "#171717",
                marginTop: 10,
              }}
              content={`Expected Delivery Date : ${expectedDeliveryDate}`}
            ></PoppinsTextMedium> */}
            <View
              style={{
                height: 50,
                padding: 4,
                borderWidth: 1,
                borderStyle: "dashed",
                backgroundColor: secondaryThemeColor,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
                borderRadius: 6,
                flexDirection: "row",
              }}
            >
              <Image
                style={{ height: 40, width: 40, resizeMode: "contain" }}
                source={require("../../../assets/images/greenTick.png")}
              ></Image>
              <PoppinsTextMedium
                style={{
                  fontSize: 19,
                  fontWeight: "700",
                  color: "#171717",
                  marginLeft: 10,
                }}
                content={`${t("Delivery Status")} : ${status}`}
              ></PoppinsTextMedium>
            </View>
          </View>
          {/* buttons */}
          {/* -------------------------------------------------- */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginTop: 40,
            }}
          >
            <TouchableOpacity
              style={{
                height: 50,
                padding: 8,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                backgroundColor: "#FB774F",
                borderRadius: 4,
                width: "44%",
              }}
              onPress={()=>setTrackModal(true)}
            >
              <Location name="location" size={30} color="white" />
              <PoppinsTextMedium
                style={{ color: "white", fontSize: 14, marginLeft: 4, fontWeight:'bold' }}
                content={t("Track Delivery Status")}
              ></PoppinsTextMedium>
              
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Feedback");
              }}
              style={{
                height: 50,
                padding: 8,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                backgroundColor: "black",
                borderRadius: 4,
                width: "44%",
                marginLeft: 14,
              }}
            >
              <Message name="message-square" size={24} color="white" />
              <PoppinsTextMedium
                style={{ color: "white", fontSize: 14, marginLeft: 10 }}
                content={t("Share Feedback")}
              ></PoppinsTextMedium>
            </TouchableOpacity>
          </View>
          {/* Delivery Address */}
          {/* -------------------------------------------------------------- */}
          {/* <View style={{width:'90%',borderTopWidth:1,borderStyle:'dashed',borderColor:'#DDDDDD',alignItems:"center",justifyContent:"flex-start",marginTop:20}}>
                <PoppinsText style={{color:"black",fontSize:20}} content="Delivery Address"></PoppinsText>
                <PoppinsTextMedium style={{color:'black',fontSize:18,width:'80%',textAlign:'center'}} content={deliveryAddress}></PoppinsTextMedium>
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",marginTop:4}}>
                <PoppinsTextMedium style={{color:ternaryThemeColor,fontSize:18,fontWeight:'700'}} content = "Change Delivery Address? "></PoppinsTextMedium>
                <View style={{height:30,width:30,borderRadius:15,alignItems:"center",justifyContent:"center",borderColor:ternaryThemeColor,borderWidth:1}}>
                <Edit style={{}} name="edit" size={16} color={ternaryThemeColor}></Edit>
                </View>
            </View>
            </View> */}

          {/* click to report ------------------------------------------------------- */}
          {/* <ClickToReport></ClickToReport> */}
          <TrackDeliveryModal isVisible={trackModal}  onClose={hideSuccessModal} trackdata={redeemedGiftStatusData} data={data} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default RedeemedDetails;
