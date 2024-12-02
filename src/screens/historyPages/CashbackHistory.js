
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useSelector } from "react-redux";
import * as Keychain from "react-native-keychain";
import { useFetchCashbackEnteriesOfUserMutation, useFetchUserCashbackByAppUserIdMutation } from "../../apiServices/workflow/rewards/GetCashbackApi";
import DataNotFound from "../data not found/DataNotFound";
import AnimatedDots from "../../components/animations/AnimatedDots";
import { useGetCashTransactionsMutation, useGetRedeemptionListMutation } from "../../apiServices/cashback/CashbackRedeemApi";
import moment from "moment";
import { useIsFocused } from '@react-navigation/native';
import { useGetWalletBalanceMutation } from "../../apiServices/cashback/CashbackRedeemApi";
import Wallet from 'react-native-vector-icons/Entypo'
import { useTranslation } from "react-i18next";
import { useCashPerPointMutation, useFetchUserPointsMutation } from "../../apiServices/workflow/rewards/GetPointsApi";
import ErrorModal from "../../components/modals/ErrorModal";

const CashbackHistory = ({ navigation }) => {
  const [showNoDataFound, setShowNoDataFound] = useState(false);
  const [totalCashbackEarned, setTotalCashbackEarned] = useState(0)
  const [displayData, setDisplayData] = useState(false)
  const [minRedemptionPoints, setMinRedemptionPoints] = useState()
  const [pointBalance, setPointBalance] = useState()
  const [redemptionStartData, setRedemptionStartDate]  = useState()
  const [redemptionEndDate, setRedemptionEndDate] = useState()
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false)
  const [navigateTo, setNavigateTo] = useState()

  const focused = useIsFocused()

  const userId = useSelector((state) => state.appusersdata.userId);
  const userData = useSelector((state) => state.appusersdata.userData);

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "#FFB533";

  console.log(userId);
  
  const {t} = useTranslation();

  // const [fetchCashbackEnteriesFunc, {
  //     data: fetchCashbackEnteriesData,
  //     error: fetchCashbackEnteriesError,
  //     isLoading: fetchCashbackEnteriesIsLoading,
  //     isError: fetchCashbackEnteriesIsError
  // }] = useFetchCashbackEnteriesOfUserMutation()

  const [userPointFunc, {
    data: userPointData,
    error: userPointError,
    isLoading: userPointIsLoading,
    isError: userPointIsError
  }] = useFetchUserPointsMutation()

  const [cashPerPointFunc,{
    data:cashPerPointData,
    error:cashPerPointError,
    isLoading:cashPerPointIsLoading,
    isError:cashPerPointIsError
  }] = useCashPerPointMutation()

  const [
    getCashTransactionsFunc,
    {
      data: getCashTransactionsData,
      error: getCashTransactionsError,
      isLoading: getCashTransactionsIsLoading,
      isError: getCashTransactionsIsError,
    },
  ] = useFetchCashbackEnteriesOfUserMutation();

  const [getRedemptionListFunc,{
    data:getRedemptionListData,
    error:getRedemptionListError,
    isError:getRedemptionListIsError,
    isLoading:getRedemptionListIsLoading
  }] = useGetRedeemptionListMutation()
  

  const [fetchCashbackEnteriesFunc, {
    data: fetchCashbackEnteriesData,
    error: fetchCashbackEnteriesError,
    isLoading: fetchCashbackEnteriesIsLoading,
    isError: fetchCashbackEnteriesIsError
  }] = useGetCashTransactionsMutation()



  // useEffect(() => {
  //   const getData = async () => {
  //     const credentials = await Keychain.getGenericPassword();
  //     if (credentials) {
  //       console.log(
  //         "Credentials successfully loaded for user " + credentials.username
  //       );
  //       const token = credentials.username;
  //       // const params = { token: token, appUserId: userData.id };
  //       const params = { token: token, appUserId: userData.id };
  //       getCashTransactionsFunc(cashparams);
  //       fetchCashbackEnteriesFunc(params)
  //     }
  //   };
  //   getData();
  // }, []);

  useEffect(()=>{
    fetchPoints()

  },[focused])

  useEffect(()=>{
    if(cashPerPointData)
    {
        console.log("cashPerPointData",cashPerPointData)
        if(cashPerPointData.success)

        {
          const temp = cashPerPointData?.body
          setRedemptionStartDate(temp?.redeem_start_date)
          setRedemptionEndDate(temp?.redeem_end_date)
          setMinRedemptionPoints(temp?.min_point_redeem)
        }
    }
    else if(cashPerPointError){
        console.log("cashPerPointError",cashPerPointError)
        
    }
  },[cashPerPointData,cashPerPointError])

  useEffect(() => {
    if (userPointData) {
      console.log("userPointData", userPointData)
      if(userPointData.success)
      {
      setPointBalance(userPointData.body.point_balance)

      }
    }
    else if (userPointError) {
      console.log("userPointError", userPointError)
    }

  }, [userPointData, userPointError])
  useEffect(() => {
    const getData = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );
        const token = credentials.username;
        // const params = { token: token, appUserId: userData.id };
        const cashparams = {token:token, userId:userData.id}

        const params = { token: token, appUserId: userData.id };

        getRedemptionListFunc(cashparams);
        fetchCashbackEnteriesFunc(params)
      }
    };
    getData();
  }, [focused ]);

useEffect(()=>{
  if(getRedemptionListData)
  {
    console.log("getRedemptionListData",JSON.stringify(getRedemptionListData))
  }
  else if(getRedemptionListError){
    console.log("getRedemptionListError",getRedemptionListError)
  }
},[getRedemptionListData,getRedemptionListError])

  useEffect(() => {
    if (fetchCashbackEnteriesData) {
      let cashback = 0
      console.log(
        "fetchCashbackEnteriesData",
        JSON.stringify(fetchCashbackEnteriesData)
      );
      if (fetchCashbackEnteriesData.body) {
        for (var i = 0; i < fetchCashbackEnteriesData.body?.data?.length; i++) {

          if (fetchCashbackEnteriesData.body.data[i].approval_status === "1") {
            cashback = cashback + Number(fetchCashbackEnteriesData.body.data[i].cash)
            console.log("fetchCashbackEnteriesData", fetchCashbackEnteriesData.body.data[i].cash)
          }
        }
        setTotalCashbackEarned(cashback)
      }

    } else if (fetchCashbackEnteriesError) {
      console.log("fetchCashbackEnteriesError", fetchCashbackEnteriesError);
    }
  }, [fetchCashbackEnteriesData, fetchCashbackEnteriesError]);


  const fetchPoints = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      userId: userData.id,
      token: token
    }
    userPointFunc(params)
    cashPerPointFunc(token)

  }

  const modalClose = () => {
    setError(false);
    setSuccess(false)
    
  };

  const handleRedeemButtonPress = () => {
      
   
    
      
      if((Number(new Date(redemptionStartData).getTime()) <= Number(new Date().getTime()) ) &&  ( Number(new Date().getTime()) <= Number(new Date(redemptionEndDate).getTime())) )
      {
        
        console.log("correct redemption date",new Date().getTime(),new Date(redemptionStartData).getTime(),new Date(redemptionEndDate).getTime())
      
        console.log("cashPerPointData",cashPerPointData)
        navigation.navigate('RedeemCashback',{redemptionFrom:"Wallet"})
      
     
      }
      else{
        setError(true)
      setMessage("Redemption window starts from "+ moment(redemptionStartData).format("DD-MMM-YYYY") + " and ends on " +  moment(redemptionEndDate).format("DD-MMM-YYYY"))
      setNavigateTo("CashbackHistory")

      }
    

  }

  const Header = () => {
    return (
      <View
        style={{
          height: 40,
          width: "100%",
          backgroundColor: "#DDDDDD",
          alignItems: "center",
          justifyContent: "center",
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
          content="Cashback Ledger"
        ></PoppinsTextMedium>
        {/* <View style={{ position: "absolute", right: 20 }}>
          <Image style={{ height: 22, width: 22, resizeMode: "contain" }} source={require('../../../assets/images/settings.png')}></Image>
          <Image
            style={{ height: 22, width: 22, resizeMode: "contain" }}
            source={require("../../../assets/images/list.png")}
          ></Image>
        </View> */}
      </View>
    );
  };
  const CashbackListItem = (props) => {
    const amount = props.items.cash;
    console.log("amount details", props);
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("CashbackDetails", { "data": props.items });
        }}
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          borderBottomWidth: 1,
          borderColor: "#DDDDDD",
          padding: 4,
          height: 150,
          flexDirection: 'row'
        }}
      >
        <View
          style={{
            width: "80%",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: 8
          }}
        >
          {console.log("item of item", props)}
          <PoppinsTextMedium
            style={{ color:   (props.items.approval_status === "2") ? "red" : props.items.approval_status === "3" ? "orange" : "green", fontWeight: "600", fontSize: 16 }}
            
            content={
             props.items.approval_status === "2"
                ? "Declined from the panel"
                :    props.items.approval_status === "3" ? "Pending from the panel" : "Accepted from panel"

             
            }
          ></PoppinsTextMedium>
          {props.items.approval_status != "2" &&  <PoppinsTextMedium
            style={{ color:   (props.items.status === "0") ? "red" : props.items.tatus === "2" ? "orange" :(props.items.status === "0") && "green", fontWeight: "600", fontSize: 16 }}
            
            content={
             props.items.status === "0"
                ? "Declined from the Bank"
                :    props.items.status === "2" ? "Pending at the Bank" : props.items.status==1 && "Accepted by Bank"

             
            }
          ></PoppinsTextMedium>}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "center",
              marginTop: 4,
            }}
          >
            <Image
              style={{ height: 30, width: 30, resizeMode: "contain" }}
              source={require("../../../assets/images/greenRupee.png")}
            ></Image>
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
                marginLeft: 10,
              }}
            >
              <PoppinsTextMedium
                style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                content={`To :  ${props.items?.bene_details?.name} `}
              ></PoppinsTextMedium>
              <PoppinsTextMedium
                style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                content={`Transfer mode : ${props.items?.transfer_mode} `}
              ></PoppinsTextMedium>
              <PoppinsTextMedium
                style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                content={` ${props.items?.transfer_mode} :  ${props.items?.transfer_mode == "upi" ? props.items?.bene_details?.vpa : props.items?.bene_details?.bankAccount}  `}
              ></PoppinsTextMedium>

                {
                   props.items?.bene_details?.ifsc &&
                   <PoppinsTextMedium
                   style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                   content={`IFSC :  ${props.items?.transfer_mode !== "upi" &&  props.items?.bene_details?.ifsc}  `}
                 ></PoppinsTextMedium>
   
                }
           
              <PoppinsTextMedium
                style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                content={
                  moment(props.items.transaction_on).format("DD-MMM-YYYY") +
                  " " +
                  moment(props.items.transaction_on).format("HH:mm a")
                }
              ></PoppinsTextMedium>
            </View>
          </View>
        </View>
        <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <PoppinsTextMedium style={{ color: 'black' }} content={"₹ " + props.items.cash}></PoppinsTextMedium>
        </View>
      </TouchableOpacity>
    );
  };

  const WalletBar = (props) => {
    const amount = props.items.cash;
    console.log("amount details", props);
    return (
      <View
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          width: "100%",
          borderBottomWidth: 1,
          borderColor: "#DDDDDD",
          padding: 4,
          borderWidth:1,
          height: 100,
          flexDirection: 'row'
        }}
      >
        <View
          style={{
            width: "100%",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: 8
          }}
        >
          {console.log("item of item", props)}

          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "center",
              marginTop: 4,
            }}
          >
            <Image
              style={{ height: 30, width: 30, resizeMode: "contain" }}
              source={require("../../../assets/images/greenRupee.png")}
            ></Image>
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
                marginLeft: 10,
              }}
            >
              <PoppinsTextMedium
                style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                content={`Points Consumed :  ${props.items?.points} `}
              ></PoppinsTextMedium>
              <PoppinsTextMedium
                style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                content={`Cashback amount : ₹ ${props.items?.cashbacks} `}
              ></PoppinsTextMedium>
              

               
           
              <PoppinsTextMedium
                style={{ color: "black", fontWeight: "600", fontSize: 14 }}
                content={
                  moment(props.items.created_at).format("DD-MMM-YYYY") +
                  " " +
                  moment(props.items.created_at).format("HH:mm a")
                }
              ></PoppinsTextMedium>
            </View>
          </View>
        </View>
        {/* <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <PoppinsTextMedium style={{ color: 'black' }} content={"₹ " + props.items?.cashbacks}></PoppinsTextMedium>
        </View> */}
      </View>
    );
  };

  const WalletComponent=()=>{
    const [
      getWalletBalanceFunc,
      {
        data: getWalletBalanceData,
        error: getWalletBalanceError,
        isLoading: getWalletBalanceIsLoading,
        isError: getWalletBalanceIsError,
      },
    ] = useGetWalletBalanceMutation();

    useEffect(() => {
      const getData = async () => {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log(
            "Credentials successfully loaded for user " + credentials.username
          );
          const token = credentials.username;
          const params = { token: token, appUserId: userData.id };
  
          getWalletBalanceFunc(params)
        }
      };
      getData();
    }, []);
    
  
    useEffect(()=>{
      if(getWalletBalanceData)
      {
        console.log("getWalletBalanceData",getWalletBalanceData)
      }
      else if(getWalletBalanceError)
      {
        console.log("getWalletBalanceError",getWalletBalanceError)
      }
    },[getWalletBalanceData,getWalletBalanceError])

    return (
      <View style={{width:'100%',padding:12,alignItems:'center',justifyContent:'center',backgroundColor:'white',borderBottomWidth:1,borderColor:"#DDDDDD",elevation:2,flexDirection:'row'}}>
        <View style={{width:'60%',alignItems:'flex-start',justifyContent:'center',flexDirection:'row'}}>
        <PoppinsTextMedium style={{fontSize:16,fontWeight:"bold",color:'grey',marginLeft:10}} content={t("wallet balance")}></PoppinsTextMedium>
        <PoppinsTextMedium style={{fontSize:16,fontWeight:'bold',color:'black',marginLeft:10}} content={getWalletBalanceData?.body?.cashback_balance}></PoppinsTextMedium>

        </View>
        {getWalletBalanceData?.body?.cashback_balance &&
        <View style={{width:'40%',alignItems:'center',justifyContent:'flex-start'}}>
          <TouchableOpacity onPress={()=>{
            handleRedeemButtonPress()
          }} style={{height:30,width:100,backgroundColor:ternaryThemeColor,alignItems:'center',justifyContent:'center',borderRadius:10}}>
            <PoppinsTextMedium style={{fontSize:16,fontWeight:'bold',color:'white'}} content={t("redeem")}></PoppinsTextMedium>
          </TouchableOpacity>
        </View>
    } 
      </View>
    )
  }
  return (
    <View style={{ alignItems: "center", justifyContent: "flex-start",height:'100%' }}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          width: "100%",
          marginTop: 10,
          height: '5%',
          marginLeft: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Passbook")
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
          content={t("cashback history")}
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: "800",
            color: "#171717",
          }}
        ></PoppinsTextMedium>
        {/* <TouchableOpacity style={{ marginLeft: 160 }}>
                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../assets/images/notificationOn.png')}></Image>
                </TouchableOpacity> */}
      </View>
      <View
        style={{
          padding: 14,
          alignItems: "flex-start",
          justifyContent: "flex-start",
          width: "100%",
          height:'8%'
        }}
      >
        <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center',marginTop:14 }}>
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: "contain",

            }}
            source={require("../../../assets/images/wallet.png")}
          ></Image>
          <PoppinsTextMedium
            style={{
              marginLeft: 10,
              fontSize: 16,
              fontWeight: "700",
              color: "#6E6E6E",
            }}
            content={t("total cashback earned") + totalCashbackEarned }
          ></PoppinsTextMedium>
          {/* <PoppinsText style={{ marginLeft: 10, fontSize: 34, fontWeight: '600', color: 'black' }} content={fetchCashbackEnteriesData?.body?.total != undefined ?  `${fetchCashbackEnteriesData?.body?.total}` : <AnimatedDots color={'black'}/>}></PoppinsText> */}
        </View>

        {/* <PoppinsTextMedium style={{marginLeft:10,fontSize:20,fontWeight:'600',color:'#6E6E6E'}} content="Cashback"></PoppinsTextMedium> */}
        {/* <PoppinsTextMedium
          style={{
            marginLeft: 10,
            fontSize: 20,
            fontWeight: "600",
            color: "#6E6E6E",
          }}
          content="Cashbacks are now instantly credited"
        ></PoppinsTextMedium> */}

      </View>
      {/* <Header></Header> */}
      <WalletComponent></WalletComponent>
      <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',height:40}}>
        <TouchableOpacity onPress={()=>{
          setDisplayData(true)
        }} style={{alignItems:"center",justifyContent:'center',width:'50%',borderColor:ternaryThemeColor,borderBottomWidth:displayData ? 2: 0,height:'100%'}}>
          <PoppinsTextMedium style={{color:'black'}} content={t("Transactions")}></PoppinsTextMedium>
        </TouchableOpacity>
        <View style={{height:'100%',width:2,backgroundColor:"#DDDDDD"}}></View>
        <TouchableOpacity onPress={()=>{
          setDisplayData(false)
        }} style={{alignItems:"center",justifyContent:'center',width:'50%',borderColor:ternaryThemeColor,borderBottomWidth:!displayData ? 2: 0,height:'100%'}}>
        <PoppinsTextMedium style={{color:'black'}} content={t("Wallet")}></PoppinsTextMedium>
        </TouchableOpacity>
      </View>
      {
        fetchCashbackEnteriesData?.body?.count === 0  && getRedemptionListData?.body?.total===0 && <View style={{ width: '100%',height:'80%' }}>
          <DataNotFound></DataNotFound>
        </View>
      }


      {displayData && fetchCashbackEnteriesData && <FlatList
        initialNumToRender={20}
        contentContainerStyle={{
          alignItems: "flex-start",
          justifyContent: "center",
          
        }}
        style={{ width: "100%"}}
        data={fetchCashbackEnteriesData?.body?.data}
        renderItem={({ item, index }) => (
          <CashbackListItem items={item}></CashbackListItem>
        )}
        keyExtractor={(item, index) => index}
      />}
      {!displayData && getRedemptionListData && <FlatList
        initialNumToRender={20}
        contentContainerStyle={{
          alignItems: "flex-start",
          justifyContent: "center",
          
        }}
        style={{ width: "100%"}}
        data={getRedemptionListData?.body?.data}
        renderItem={({ item, index }) => (
          <WalletBar items={item}></WalletBar>
        )}
        keyExtractor={(item, index) => index}
      />}
      
      {error && navigateTo && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
          navigateTo={navigateTo}
          ></ErrorModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          message={message}
          openModal={success}></MessageModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default CashbackHistory;