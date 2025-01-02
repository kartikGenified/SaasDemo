import React, {useEffect, useId, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import {useSelector,useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import * as Keychain from 'react-native-keychain';
import ErrorModal from '../../components/modals/ErrorModal';
import { useCashPerPointMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import { useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import MessageModal from '../../components/modals/MessageModal';
import { setPointConversionF,setCashConversionF, setRedemptionFrom } from '../../../redux/slices/redemptionDataSlice';
import { useCheckBeforeRedeemMutation, useGetWalletBalanceMutation } from '../../apiServices/cashback/CashbackRedeemApi';
import { setWalletBalance } from '../../../redux/slices/pointWalletSlice';
import { useTranslation } from 'react-i18next';

const RedeemCashback = ({navigation,route}) => {
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false)
  const [cashConversion,setCashConversion] = useState()
  const [pointsConversion, setPointsConversion] = useState(1)
  const [walletConversion, setWalletConversion] = useState()

  //checks

  const [isReedemable, setIsReedemable] = useState(null)
  const [perTransationDay, setPerTransactionDay] = useState(null)
  const [maxAmountPerDay, setMaxAmountPerDay] = useState(null)
  const [minAmountRedeem, setMinAmountRedeem] = useState(null)


  const dispatch = useDispatch()
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';

  const secondaryThemeColor = useSelector(
    state => state.apptheme.secondaryThemeColor,
  )
    ? useSelector(state => state.apptheme.secondaryThemeColor)
    : '#FFB533';
  const userData = useSelector(state => state.appusersdata.userData);
  const redemptionFrom = route?.params?.redemptionFrom
  console.log("userData",userData)
  const modalClose = () => {
    setError(false);
  };

  const {t} = useTranslation()

  const [userPointFunc,{
    data:userPointData,
    error:userPointError,
    isLoading:userPointIsLoading,
    isError:userPointIsError
}]= useFetchUserPointsMutation()

const [checkBeforeRedeem, {
  data: checkBeforeRedeemData,
  error: checkBeforeRedeemError,
  isLoading: checkBeforeRedeemIsLoading,
  isError: checkBeforeRedeemIsError
}] = useCheckBeforeRedeemMutation()


  const [cashPerPointFunc,{
    data:cashPerPointData,
    error:cashPerPointError,
    isLoading:cashPerPointIsLoading,
    isError:cashPerPointIsError
  }] = useCashPerPointMutation()

  const [
    getWalletBalanceFunc,
    {
      data: getWalletBalanceData,
      error: getWalletBalanceError,
      isLoading: getWalletBalanceIsLoading,
      isError: getWalletBalanceIsError,
    },
  ] = useGetWalletBalanceMutation();
  

  const points =userPointData?.body?.point_balance;
  const minPointsRedeemed = cashPerPointData?.body?.min_point_redeem
  const maxCashConverted = cashPerPointData?.body?.min_cash_redeem
  const height = Dimensions.get('window').height


  // const redeemCashback = async () => {
  // if(redemptionFrom != "Wallet")
  // {
  //       if(Number(minPointsRedeemed)<=(pointsConversion))
  //   {
  //     console.log("shjadjhashgdhjgasjgd", pointsConversion,points)
  //     if(Number(pointsConversion)>=Number(points))
  //     {
  //       setError(true)
  //     setMessage("You only have "+points+" points")
  //     }
  //     else
  //     {
  //       if(Number(cashConversion)>=Number(maxCashConverted))
  //       {
  //       navigation.replace('BankAccounts',{type:"Cashback"})
  //       }
  //       else{
  //         setError(true)
  //         setMessage(`Minimum cash redemption value is ${maxCashConverted}`)
  //       }
  //     }
  //   }
  //   else{
  //     setError(true)
  //     setMessage("Min Points required to redeem is "+minPointsRedeemed)
  //   }
  // }
  // else{
  //   if(cashConversion<=getWalletBalanceData?.body?.cashback_balance)
  //   {
  //     if(cashConversion == 0)
  //     {
  //       setError(true)
  //       setMessage("Cannot redeem 0 amount")
  //     }
  //     else{
  //     navigation.navigate('BankAccounts',{type:"Cashback"})

  //     }
  //   }
  //   else{
  //     // console.log("cashConversionqwerty",cashConversion)
  //     setError(true)
  //     setMessage("You don't have enough wallet balance kindly redeem using your point")
  //   }
  // }

   

  //   // const credentials = await Keychain.getGenericPassword();
  //   // if (credentials) {
  //   //   console.log(
  //   //     'Credentials successfully loaded for user ' + credentials.username,
  //   //   );
  //   //   const token = credentials.username;
     
  //   // }
  // };
  const redeemCashback = async () => {
    if (redemptionFrom != "Wallet") {
      if (Number(minPointsRedeemed) <= (pointsConversion)) {
        console.log("shjadjhashgdhjgasjgd", pointsConversion, points)
        
        if (Number(pointsConversion) >= Number(points)) {
          setError(true)
          setMessage("You only have " + points + " points")
        }

        if(Number(cashConversion)> Number(isReedemable)){
          setError(true)
          // setMessage("Maximum Amount Trasaction Per Day Is : " + isReedemable)
          setMessage(t("Maximum Amount Per Trasaction  : ") + isReedemable)

          return
        }

        if(Number(minAmountRedeem) >Number(cashConversion)){
          console.log("Checks", minAmountRedeem,cashConversion,Number(minAmountRedeem) ==Number(cashConversion))
          setError(true)
          setMessage(t("Minimum Amount per transaction : ") + minAmountRedeem)
          return
        }
      
        else if(Number(cashConversion) >= Number(maxAmountPerDay)){
          setError(true)
          setMessage(t("Maximum Amount Per Day : ") + maxAmountPerDay)
          return
        }
        else if(!checkBeforeRedeemData.body.data){
          setError(true)
          setMessage(checkBeforeRedeemData.message)
          return
        }
     
        else if(Number(cashConversion)> Number(maxAmountPerDay)){
          setError(true)
          setMessage(t("Maximum Amount Per transaction is: ") + isReedemable)
          return
        }

        else {
          if (Number(cashConversion) >= Number(maxCashConverted)) {
            navigation.replace('BankAccounts', { type: "Cashback" })
            setCashConversion()
          }
          else {
            setError(true)
            setMessage(`${t("Minimum cash redemption value is")} ${maxCashConverted}`)
          }
        }
      }
      else {
        setError(true)
        setMessage(t("Min Points required to redeem : ") + minPointsRedeemed)
      }
    }
    else {
      console.log("cashConversion===>",cashConversion,getWalletBalanceData?.body?.cashback_balance, cashConversion <= getWalletBalanceData?.body?.cashback_balance)

      // (150<=90) false

      if (Number(cashConversion) <= Number(getWalletBalanceData?.body?.cashback_balance)) {
        console.log("cashhhhh", isReedemable, cashConversion)
        if (cashConversion == 0) {
          setError(true)
          setMessage(t("Cannot redeem 0 amount"))
        }
        else {
          if(redemptionFrom!="Wallet")
          {
            dispatch(setRedemptionFrom("Points"))
          navigation.navigate('BankAccounts', { type: "Cashback" })
          setCashConversion("")

          }
          else{
            dispatch(setRedemptionFrom("Wallet"))
          navigation.navigate('BankAccounts', { type: "Cashback" })
          setCashConversion("")

          }
          
        // if(Number(cashConversion) > Number(isReedemable)){
        //   setError(true)
        //   setMessage("Maximum Amount Per Trasaction  : " + isReedemable)
        //   return
        // }
        // else if(Number(cashConversion) >= Number(maxAmountPerDay)){
        //   setError(true)
        //   setMessage("Maximum Amount Per Day  : " + maxAmountPerDay)
        //   return
        // }
        // else if(!checkBeforeRedeemData.body.data){
        //   setError(true)
        //   setMessage(checkBeforeRedeemData.message)
        //   return
        // }
        // if(Number(minAmountRedeem) >= Number(cashConversion)){
        //   setError(true)
        //   setMessage("Minimum Amount per transaction : " + minAmountRedeem)
        //   return
        // }
        // else{
        // }

        }
      }

      else {
        console.log("cashConversionqwerty",cashConversion,getWalletBalanceData?.body?.cashback_balance)
        setError(true)
        setMessage(t("You don't have enough wallet balance kindly redeem using your point"))
      }
    }




    // const credentials = await Keychain.getGenericPassword();
    // if (credentials) {
    //   console.log(
    //     'Credentials successfully loaded for user ' + credentials.username,
    //   );
    //   const token = credentials.username;

    // }
  };
  useEffect(()=>{
    if(getWalletBalanceData)
    {
      console.log("getWalletBalanceData",getWalletBalanceData,redemptionFrom)
      if(getWalletBalanceData.success)
      {
      dispatch(setWalletBalance(Number(getWalletBalanceData?.body?.cashback_balance)))
      redemptionFrom == "Wallet"  && setCashConversion(getWalletBalanceData?.body?.cashback_balance)
      redemptionFrom == "Wallet" && dispatch(setCashConversionF(getWalletBalanceData?.body?.cashback_balance))
      }
    }
    else if(getWalletBalanceError)
    {
      console.log("getWalletBalanceError",getWalletBalanceError)
    }
  },[getWalletBalanceData,getWalletBalanceError])

  useEffect(() => {
    if (cashPerPointData) {
      console.log("cashperpointData ", cashPerPointData,redemptionFrom)
      const conversionFactor = cashPerPointData.body.cash_per_point
      redemptionFrom == "Wallet" ? setCashConversion(getWalletBalanceData?.body?.cashback_balance) : setCashConversion(pointsConversion * conversionFactor)
      redemptionFrom == "Wallet" ? dispatch(setCashConversionF(getWalletBalanceData?.body?.cashback_balance)) : dispatch(setCashConversionF(pointsConversion * conversionFactor))
      setIsReedemable(cashPerPointData.body.max_amount_per_transaction)
      setMaxAmountPerDay(cashPerPointData.body.max_amount_per_day)
      setPerTransactionDay(cashPerPointData.body.max_transaction_per_day)
      setMinAmountRedeem(cashPerPointData.body.min_cash_redeem)
    }
  }, [cashPerPointData, pointsConversion])

  useEffect(()=>{
    if(checkBeforeRedeemData){
      console.log("checkBeforeRedeemData",checkBeforeRedeemData)
    }
    else if(checkBeforeRedeemError){
      console.log("checkBeforeRedeemError",checkBeforeRedeemError)

    }
},[checkBeforeRedeemData, checkBeforeRedeemError])
  
  useEffect(()=>{
    fetchToken(userData.id)
    console.log("userData from useeffect",userData.id)
  },[userData])

  const fetchToken=async(id)=>{
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        'Credentials successfully loaded for user ' + credentials.username,
      );
      const token = credentials.username;
      
      const params = {userId:id,token:token}
      const paramsWallet = { token: token, appUserId: userData.id };

      console.log("params",params)
      cashPerPointFunc(token)
      getWalletBalanceFunc(paramsWallet)
      userPointFunc(params)
      checkBeforeRedeem(params)

    }
  }
  useEffect(()=>{
    if(userPointData)
    {
        console.log("userPointData",JSON.stringify(userPointData))
    }
    else if(userPointError)
    {
        console.log("userPointError",userPointError)
    }

},[userPointData,userPointError])
  
  useEffect(()=>{
    if(cashPerPointData)
    {
        console.log("cashPerPointData",cashPerPointData)
    }
    else if(cashPerPointError){
        console.log("cashPerPointError",cashPerPointError)
        
    }
  },[cashPerPointData,cashPerPointError])

  
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: 'white',
        height: '100%',
      }}>
      <ScrollView style={{width:'100%',height:'100%'}}>

      {error && redemptionFrom!="Wallet" && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
          navigateTo="Passbook"></ErrorModal>
      )}
      {error && redemptionFrom=="Wallet" && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
          navigateTo="CashbackHistory"></ErrorModal>
      )}

      
      {  success && (
          <MessageModal
            modalClose={modalClose}
            message={message}
            openModal={success}></MessageModal>)
      }
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          width: '100%',

          height: '10%',
          position: 'absolute',
          top: 0,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            setCashConversion(0)
          }}>
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: 'contain',
              marginLeft: 10,
            }}
            source={require('../../../assets/images/blackBack.png')}></Image>
        </TouchableOpacity>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <PoppinsTextMedium
            content={t("Redeem Cashback")}
            style={{
              marginLeft: 10,
              fontSize: 16,
              fontWeight: '700',
              color: 'black',
            }}></PoppinsTextMedium>
        </View>
      </View>
        <View style={{alignItems:"center",justifyContent:'center',width:'100%',marginTop:40}}>
      <View
        style={{alignItems: 'center', justifyContent: 'center', marginTop:40}}>
        <Image
          style={{height: 140, width: 140}}
          source={require('../../../assets/images/redeemCashback.png')}></Image>
        <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
         {redemptionFrom!="Wallet" ?
           <View style={{width:'50%',alignItems:'center',justifyContent:'center'}}>
          <PoppinsText
          style={{fontSize: 24, color: 'black', marginTop: 20}}
          content={points}></PoppinsText>
        <PoppinsTextMedium
          content={t("Available Points")}
          style={{
            color: 'black',
            fontWeight: '600',
            marginBottom: 20,
          }}></PoppinsTextMedium>
          </View> : 
          <View style={{width:'60%',alignItems:'center',justifyContent:'center'}}>
          <PoppinsText
          style={{fontSize: 24, color: 'black', marginTop: 20}}
          content="Wallet Balance"></PoppinsText>
        
          </View>
          }
         {redemptionFrom!="Wallet"  ? <View style={{width:'50%',alignItems:'center',justifyContent:'center'}}>
          <PoppinsText
          style={{fontSize: 24, color: 'black', marginTop: 20}}
          content={getWalletBalanceData?.body?.cashback_balance}></PoppinsText>
        <PoppinsTextMedium
          content={t("Wallet Balance")}
          style={{
            color: 'black',
            fontWeight: '600',
            marginBottom: 20,
          }}></PoppinsTextMedium>
          </View> : 
          <View style={{width:'40%',alignItems:'center',justifyContent:'center'}}>
          <PoppinsText
          style={{fontSize: 24, color: 'black', marginTop: 20}}
          content={getWalletBalanceData?.body?.cashback_balance}></PoppinsText>
        
          </View>
          }
        </View>
       {redemptionFrom!=="Wallet" &&  <View><PoppinsTextMedium
          content={t("Convert your Points to Cash")}
          style={{
            color: '#909090',
            fontWeight: '600',
            fontSize: 16,
          }}></PoppinsTextMedium>
        <PoppinsTextMedium
          style={{color: 'black', fontWeight: '600'}}
          content={`${pointsConversion} ${t("Points")} = ${cashConversion} Rupees`}></PoppinsTextMedium></View>}
      </View>
      {redemptionFrom !="Wallet" ? 
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          marginTop: 20,
          paddingTop: 20,
        }}>
        <PoppinsTextMedium
          content={t("Enter Points")}
          style={{
            color: '#909090',
            fontWeight: '600',
            marginBottom: 20,
            position: 'absolute',
            left: 20,
            top: 0,
          }}></PoppinsTextMedium>
        <View
          style={{
            width: '90%',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 0.8,
            borderColor: '#DDDDDD',
            height: 70,
            borderRadius: 10,
            backgroundColor: '#F5F7F9',
            flexDirection: 'row',
            marginTop: 10,
          }}>
          <View
            style={{
              width: '50%',
              alignItems: 'center',
              justifyContent: 'center',
              borderRightWidth: 1,
              borderColor: '#DDDDDD',
              height:60
            }}>
            <PoppinsTextMedium
              content={t("points")}
              style={{
                color: '#909090',
                fontWeight: '600',
                fontSize: 14,
              }}></PoppinsTextMedium>
           <TextInput value={pointsConversion + ""} style={{color:'black',height:50, fontWeight:'bold', fontSize:14,width:'50%'}} onChangeText={(text)=>{setPointsConversion(text),dispatch(setPointConversionF(text))}} placeholder='Enter Points'></TextInput>
          </View>
          <Image
            style={{height: 24, width: 24, resizeMode: 'contain', right: 12}}
            source={require('../../../assets/images/goNext.png')}></Image>
          <View
            style={{
              width: '50%',
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: '#DDDDDD',
              height:60
            }}>
            <PoppinsTextMedium
              content={t("Cash")}
              style={{
                color: '#909090',
                fontWeight: '600',
                fontSize: 14,
                marginBottom:12
              }}></PoppinsTextMedium>
            <PoppinsText
              style={{fontSize: 20, color: 'black'}}
              content={(Math.round(cashConversion * 10) / 10)}></PoppinsText>
          </View>
        </View>

        <View
          style={{
            width: '90%',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom:20
          }}>
          <PoppinsTextMedium
            content={`* ${t("You need minimum")} ${minPointsRedeemed} ${t("points to redeem")}.`}
            style={{
              color: 'black',
              fontWeight: '600',
              marginBottom: 20,
              position: 'absolute',
              left: 0,
              top: 4,
            }}></PoppinsTextMedium>
        </View>
        <View
          style={{
            width: '90%',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom:20,
            marginTop:4
          }}>
          <PoppinsTextMedium
            content={`* ${t("Minimum cash redemption value is")} ${maxCashConverted}. `}
            style={{
              color: 'black',
              fontWeight: '600',
              marginBottom: 20,
              position: 'absolute',
              left: 0,
              top: 4,
            }}></PoppinsTextMedium>
        </View>
      </View> 

      :

      <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginTop: 20,
        paddingTop: 20,
      }}>
      
      <View
        style={{
          width: '96%',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 0.8,
          borderColor: '#DDDDDD',
          height: 80,
          borderRadius: 10,
          backgroundColor: '#F5F7F9',
          flexDirection: 'row',
          marginTop: 10,
        }}>
        <View
          style={{
            width: '60%',
            alignItems: 'center',
            justifyContent: 'center',
            borderRightWidth: 1,
            borderColor: '#DDDDDD',
            height:60
          }}>
          <PoppinsTextMedium
            content={t("Enter Amount")}
            style={{
              color: '#909090',
              fontWeight: '600',
              fontSize: 14,
              position: 'absolute',
              top:-4
              
            }}></PoppinsTextMedium>
         {/* <TextInput value={pointsConversion + ""} style={{color:'black',height:60, fontWeight:'bold', fontSize:16,width:'50%'}} onChangeText={(text)=>{setPointsConversion(text),dispatch(setPointConversionF(text))}} placeholder='Enter Amount'></TextInput> */}
         <PoppinsTextMedium
            content={getWalletBalanceData?.body?.cashback_balance}
            style={{
              color: '#909090',
              fontWeight: '700',
              fontSize: 14,
              marginTop:20
              
            }}></PoppinsTextMedium>
        </View>
        <Image
          style={{height: 24, width: 24, resizeMode: 'contain', right: 12}}
          source={require('../../../assets/images/goNext.png')}></Image>
        <View
          style={{
            width: '40%',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#DDDDDD',
            height:60
          }}>
          <PoppinsTextMedium
            content={t("Cash")}
            style={{
              color: '#909090',
              fontWeight: '600',
              fontSize: 14,
              marginBottom:12
            }}></PoppinsTextMedium>
          <PoppinsText
            style={{fontSize: 18, color: '#A9A9A9'}}
            content={!isNaN(getWalletBalanceData?.body?.cashback_balance) && (getWalletBalanceData?.body?.cashback_balance) }></PoppinsText>
        </View>
      </View>

      
    </View>
      
      }
      {getWalletBalanceData?.body?.cashback_balance && cashConversion!="" && cashConversion && <View style={{alignItems:"center", justifyContent:"center", width:"100%",marginTop:20,marginBottom:20}}>
      <TouchableOpacity
        onPress={() => {
          console.log('redeem'), redeemCashback();
        }}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '90%',
          backgroundColor: ternaryThemeColor,
          borderRadius: 6,
          height: 50,
          flexDirection: 'row',
          marginTop:20
        }}>
        <PoppinsTextMedium
          content={t("redeem now")}
          style={{color: 'white', fontWeight: '600'}}></PoppinsTextMedium>
        <Image
          style={{height: 24, width: 24, resizeMode: 'contain', marginLeft: 10}}
          source={require('../../../assets/images/whiteArrowRight.png')}></Image>
      </TouchableOpacity>
     
      </View>}
      
        </View>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default RedeemCashback;