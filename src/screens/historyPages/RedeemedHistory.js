import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, Modal, Pressable, Text, ScrollView } from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import { useFetchGiftsRedemptionsOfUserMutation } from '../../apiServices/workflow/RedemptionApi';
import * as Keychain from 'react-native-keychain';
import { useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import ErrorModal from '../../components/modals/ErrorModal';
import MessageModal from '../../components/modals/MessageModal';
import FastImage from 'react-native-fast-image';
import FilterModal from '../../components/modals/FilterModal';
import { useCashPerPointMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import { useGetkycStatusMutation } from '../../apiServices/kyc/KycStatusApi';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import InputDate from '../../components/atoms/input/InputDate';
import { useTranslation } from 'react-i18next';

const RedeemedHistory = ({ navigation }) => {
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false)
  const [redemptionStartData, setRedemptionStartDate]  = useState()
  const [redemptionEndDate, setRedemptionEndDate] = useState()
  const [showKyc, setShowKyc] = useState(true)
  const [minRedemptionPoints, setMinRedemptionPoints] = useState()
  const [redeemedListData, setRedeemedListData] = useState([])
  const [redemptionWindowEligibility, setRedemptionWindowEligibility] = useState(true)
  const [navigateTo, setNavigateTo] = useState()
  const [pointBalance, setPointBalance] = useState()
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const userData = useSelector(state => state.appusersdata.userData)
  const userId = useSelector(state => state.appusersdata.userId);
  
  const appUserData = useSelector(state=>state.appusers.value)
  const id = useSelector(state => state.appusersdata.id);
  const focused = useIsFocused()
  const fetchPoints = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    const params = {
      userId: id,
      token: token
    }
    userPointFunc(params)

  }
  console.log("appUserData",appUserData)
  const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loader.gif')).uri;
  const noData = Image.resolveAssetSource(require('../../../assets/gif/noData.gif')).uri;
  let startDate,endDate
  const [
    FetchGiftsRedemptionsOfUser,
    {
      data: fetchGiftsRedemptionsOfUserData,
      isLoading: fetchGiftsRedemptionsOfUserIsLoading,
      isError: fetchGiftsRedemptionsOfUserIsError,
      error: fetchGiftsRedemptionsOfUserError,
    },
  ] = useFetchGiftsRedemptionsOfUserMutation();

  const [getKycStatusFunc, {
    data: getKycStatusData,
    error: getKycStatusError,
    isLoading: getKycStatusIsLoading,
    isError: getKycStatusIsError
  }] = useGetkycStatusMutation()

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

  const {t} = useTranslation();

  useEffect(() => {
    if (getKycStatusData) {
      console.log("getKycStatusData", getKycStatusData)
      if (getKycStatusData.success) {
        const tempStatus = Object.values(getKycStatusData.body)        
        setShowKyc(tempStatus.includes(false))
      }
    }
    else if (getKycStatusError) {
      console.log("getKycStatusError", getKycStatusError)
    }
  }, [getKycStatusData, getKycStatusError])


  useEffect(() => {
    fetchPoints()
    if(appUserData!==undefined)
    {
     const influencerRedemptionCategories =  appUserData.filter((item)=>{
        return item.name===userData.user_type
      })
      console.log("influencerRedemptionCategories",influencerRedemptionCategories)
      if(influencerRedemptionCategories.length!==0)
      {
        setRedemptionStartDate(influencerRedemptionCategories[0].redeem_start_date)
        setRedemptionEndDate(influencerRedemptionCategories[0].redeem_end_date)
      }
      else{
        setRedemptionWindowEligibility(false)
      }
     
    }
  }, [focused])

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
    (async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      const userId = userData.id
      cashPerPointFunc(token)
      getKycStatusFunc(token)
      FetchGiftsRedemptionsOfUser({
        token: token,
        userId: userId,
        type: "1",

      });
    })();
  }, [focused]);

  useEffect(() => {
    if (fetchGiftsRedemptionsOfUserData) {
      console.log("fetchGiftsRedemptionsOfUserData", JSON.stringify(fetchGiftsRedemptionsOfUserData))
      fetchDates(fetchGiftsRedemptionsOfUserData.body.userPointsRedemptionList)
   
    }
    else if (fetchGiftsRedemptionsOfUserError) {
      console.log("fetchGiftsRedemptionsOfUserIsLoading", fetchGiftsRedemptionsOfUserError)
    }
  }, [fetchGiftsRedemptionsOfUserData, fetchGiftsRedemptionsOfUserError])

  

  const fetchDates = (data) => {
    const dateArr = []
    let tempArr = []
    let tempData = []
    data.map((item, index) => {
      dateArr.push(moment(item.created_at).format("DD-MMM-YYYY"))
    })
    const distinctDates = Array.from(new Set(dateArr))
    console.log("distinctDates", distinctDates)

    distinctDates.map((item1, index) => {
      tempData = []
      data.map((item2, index) => {
        if (moment(item2.created_at).format("DD-MMM-YYYY") === item1) {
          tempData.push(item2)
        }
      })
      tempArr.push({
        "date": item1,
        "data": tempData
      })
    })
    setRedeemedListData(tempArr)
    console.log("tempArr", JSON.stringify(tempArr))
  }
  const modalClose = () => {
    setError(false);
    setSuccess(false)
    
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
        console.log("fetchDataAccToFilter")
      }
      
    }
    else{
      alert(t("Kindly enter a valid date"))
      startDate=undefined
      endDate=undefined
    }
  }

  const DisplayEarnings = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleRedeemButtonPress = () => {
      
      if (Number(userPointData.body.point_balance) <= 0 ) {
        setError(true)
        setMessage(t("Sorry you don't have enough points."))
        setNavigateTo("RedeemedHistory")
      }
    
      else if(Number(minRedemptionPoints)>Number(pointBalance))
      {
        console.log("Minimum Point required to redeem is",minRedemptionPoints)
        setError(true)
        setMessage(`${t("Minimum Point required to redeem is")} ${minRedemptionPoints}`)
        setNavigateTo("RedeemedHistory")

      }
      else {
        
        if((Number(new Date(redemptionStartData).getTime()) <= Number(new Date().getTime()) ) &&  ( Number(new Date().getTime()) <= Number(new Date(redemptionEndDate).getTime())) )
        {
          
        if(!showKyc)
        {

          setModalVisible(true)
        }
        else{
          console.log("correct redemption date sadghasgd",new Date().getTime(),new Date(redemptionStartData).getTime(),new Date(redemptionEndDate).getTime())

          setError(true)
          setMessage(t("KYC not completed yet"))
          setNavigateTo("Verification")
        }
        }
        else{
          console.log("correct redemption date",new Date().getTime(),new Date(redemptionStartData).getTime(),new Date(redemptionEndDate).getTime(),"hello")

          setError(true)
        setMessage(`${t("Redemption window starts from ")} ${moment(redemptionStartData).format("DD-MMM-YYYY")}  ${t(" and ends on ")}  ${moment(redemptionEndDate).format("DD-MMM-YYYY")}`)
        // setMessage("hello")
        // setNavigateTo("RedeemedHistory")

        }
      }

    }
    return (
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {

            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image style={{ height: 80, width: 80, marginTop: 20 }} source={require('../../../assets/images/gift1.png')}></Image>
              <PoppinsTextMedium style={{ color: 'black', width: 300, marginTop: 20 }} content={t("Do you want to redeem your points with an amazing gift or cashback")}></PoppinsTextMedium>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20,width:'100%'}}>
                <TouchableOpacity onPress={() => {
                  console.log("gift")
                  setModalVisible(false)
                  navigation.navigate('RedeemGifts',{schemeType : "yearly"})

                }} style={{ alignItems: "center", justifyContent: "center", backgroundColor: '#0E2659', flexDirection: "row", height: 40, width: 100, borderRadius: 10 }}>
                  <Image style={{ height: 20, width: 20, resizeMode: "contain" }} source={require('../../../assets/images/giftWhite.png')}></Image>
                  <PoppinsTextMedium style={{ color: 'white', marginLeft: 10 }} content={t("Gift")}></PoppinsTextMedium>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  console.log("Coupons")
                  setModalVisible(false)
                  navigation.navigate('RedeemCoupons')

                }} style={{ alignItems: "center", justifyContent: "center", backgroundColor: ternaryThemeColor, flexDirection: "row", height: 40, width: 100, borderRadius: 10 }}>
                  <Image style={{ height: 20, width: 20, resizeMode: "contain" }} source={require('../../../assets/images/giftWhite.png')}></Image>
                  <PoppinsTextMedium style={{ color: 'white', marginLeft: 10 }} content={t("Coupons")}></PoppinsTextMedium>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  console.log("cashback")
                  setModalVisible(false)
                  navigation.navigate('RedeemCashback')
                }} style={{ alignItems: "center", justifyContent: "center", backgroundColor: '#0E2659', flexDirection: "row", height: 40, width: 120, borderRadius: 10 }}>
                  <Image style={{ height: 20, width: 20, resizeMode: "contain" }} source={require('../../../assets/images/giftWhite.png')}></Image>
                  <PoppinsTextMedium style={{ color: 'white', marginLeft: 10 }} content={t("Cashback")}></PoppinsTextMedium>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </Modal>
        {userPointData && <View style={{ alignItems: "center", justifyContent: "center" }}>
          <PoppinsText style={{ color: "black" }} content={userPointData.body.point_earned}></PoppinsText>
          <PoppinsTextMedium style={{ color: "black", fontSize: 14, width:100 }} content={t("lifetime earnings")}></PoppinsTextMedium>
        </View>
  }
        {userPointData  && <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
          <PoppinsText style={{ color: "black" }} content={userPointData.body.point_redeemed}></PoppinsText>
          <PoppinsTextMedium style={{ color: "black", fontSize: 14, width:100 }} content={t("lifetime burns")}></PoppinsTextMedium>
        </View>
  } 
        {userPointData && <TouchableOpacity onPress={() => {
          handleRedeemButtonPress()
        }} style={{ borderRadius: 2, height: 40, width: 100, backgroundColor: "#FFD11E", alignItems: "center", justifyContent: "center", marginLeft: 20 }}>
          <PoppinsTextMedium style={{ color: 'black' }} content={t("redeem")}></PoppinsTextMedium>
        </TouchableOpacity>}
      </View>
    )
  }

  const Header = () => {
    const [openBottomModal, setOpenBottomModal] = useState(false)
    const [message, setMessage] = useState()
    const modalClose = () => {
      setOpenBottomModal(false);
    };

    const onFilter = (data, type) => {
      console.log("submitted", data, type)

      if (type === "start") {
        startDate = data
      }
      if (type === "end") {
        endDate = data
      }
    }

    const ModalContent = (props) => {
      const [startDate, setStartDate] = useState("")
      const [endDate, setEndDate] = useState("")





      const handleStartDate = (startdate) => {
        // console.log("start date", startdate)
        setStartDate(startdate?.value)
        props.handleFilter(startdate?.value, "start")
      }

      const handleEndDate = (enddate) => {
        // console.log("end date", enddate?.value)
        setEndDate(enddate?.value)
        props.handleFilter(enddate?.value, "end")
      }
      return (
        <View style={{ height: 320, backgroundColor: 'white', width: '100%', borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>

         
         
          <PoppinsTextLeftMedium content="Date Filter" style={{ color: 'black', marginTop: 20, marginLeft: '35%', fontWeight: 'bold' }}></PoppinsTextLeftMedium>
          <TouchableOpacity onPress={()=>{setOpenBottomModal(false)}} style={{height:40,width:40,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10}}>
            <Image style={{height:30,width:30,resizeMode:'contain'}} source={require('../../../assets/images/cancel.png')}></Image>
          </TouchableOpacity>
          <View>
            <InputDate data={t("Start Date")} handleData={handleStartDate} />

          </View>
          <View>
            <InputDate data={t("End Date")} handleData={handleEndDate} />
          </View>
          <TouchableOpacity onPress={() => { fetchDataAccToFilter() }} style={{ backgroundColor: ternaryThemeColor, marginHorizontal: 50, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 10, borderRadius: 10 }}>
            <PoppinsTextMedium content={t("SUBMIT")} style={{ color: 'white', fontSize: 20, borderRadius: 10, }}></PoppinsTextMedium>
          </TouchableOpacity>

        </View>
      )
    }

    return (
      <View style={{ height: 40, width: '100%', backgroundColor: '#DDDDDD', alignItems: "center", flexDirection: "row", marginTop: 20 }}>

        <PoppinsTextMedium style={{ marginLeft: 20, fontSize: 16, position: "absolute", left: 10 }} content="Redeemed Ledger"></PoppinsTextMedium>

        <TouchableOpacity onPress={() => { setOpenBottomModal(!openBottomModal), setMessage("BOTTOM MODAL") }} style={{ position: "absolute", right: 20 }}>
          <Image style={{ height: 22, width: 22, resizeMode: "contain" }} source={require('../../../assets/images/settings.png')}></Image>
        </TouchableOpacity>

        {openBottomModal && <FilterModal
          modalClose={modalClose}
          message={message}
          openModal={openBottomModal}
          handleFilter={onFilter}
          comp={ModalContent}></FilterModal>}

      </View>
    )
  }


  const ListItem = (props) => {
    const data = props.data
    const description = data.gift.gift[0].name
    const productCode = props.productCode
    const time = props.time
    const productStatus = props.productStatus
    const amount = props.amount
    const image = data.gift.gift[0].images[0]
    console.log("data from listItem", data.gift.gift[0])
    return (
      <TouchableOpacity onPress={() => {
        navigation.navigate('RedeemedDetails', { data: data })
      }} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10, width: "100%", marginBottom: 10 }}>
        <View style={{ height: 70, width: 70, alignItems: "center", justifyContent: "center", borderRadius: 10, borderWidth: 1, borderColor: '#DDDDDD', right: 10 }}>
          <Image style={{ height: 50, width: 50, resizeMode: "contain" }} source={{ uri:image }}></Image>
        </View>
        <View style={{ alignItems: "flex-start", justifyContent: "center", marginLeft: 0, width: 160 }}>
          <PoppinsTextMedium style={{ fontWeight: '600', fontSize: 16, color: 'black', textAlign: 'auto' }} content={description}></PoppinsTextMedium>
          <View style={{ backgroundColor: ternaryThemeColor, alignItems: 'center', justifyContent: "center", borderRadius: 4, padding: 3, paddingLeft: 5, paddingRight: 5 }}>
            <PoppinsTextMedium style={{ fontWeight: '400', fontSize: 12, color: 'white' }} content={`${t("Product Status :")} ${productStatus}`}></PoppinsTextMedium>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 4 }}>
            <Image style={{ height: 14, width: 14, resizeMode: "contain" }} source={require('../../../assets/images/clock.png')}></Image>
            <PoppinsTextMedium style={{ fontWeight: '200', fontSize: 12, color: 'grey', marginLeft: 4 }} content={time}></PoppinsTextMedium>

          </View>
        </View>
        <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 40 }}>

          <PoppinsTextMedium style={{ color: ternaryThemeColor, fontSize: 18, fontWeight: "700" }} content={` - ${amount}`}></PoppinsTextMedium>
          <PoppinsTextMedium style={{ color: "grey", fontSize: 14 }} content="PTS"></PoppinsTextMedium>

        </View>
      </TouchableOpacity>
    )
  }
  return (
    <View style={{ alignItems: "center", justifyContent: "flex-start", width: '100%', height: '100%', backgroundColor: "white" }}>
      

      <View style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row", width: '100%', marginTop: 10, height: 40, marginLeft: 20 }}>
        <TouchableOpacity onPress={() => {
          navigation.goBack()
        }}>
          <Image style={{ height: 24, width: 24, resizeMode: 'contain', marginLeft: 10 }} source={require('../../../assets/images/blackBack.png')}></Image>

        </TouchableOpacity>
        <PoppinsTextMedium content={t("redeemed history")} style={{ marginLeft: 10, fontSize: 16, fontWeight: '600', color: '#171717' }}></PoppinsTextMedium>
        <TouchableOpacity style={{ marginLeft: 160 }}>
          {/* <Image style={{height:30,width:30,resizeMode:'contain'}} source={require('../../../assets/images/notificationOn.png')}></Image> */}
        </TouchableOpacity>
      </View>
      <View style={{ padding: 14, alignItems: "flex-start", justifyContent: "flex-start", width: "100%" }}>
        <PoppinsTextMedium style={{ marginLeft: 10, fontSize: 20, fontWeight: '600', color: '#6E6E6E' }} content={t("you have")}></PoppinsTextMedium>
        <Image style={{ position: 'absolute', right: 0, width: 117, height: 82, marginRight: 23, marginTop: 20 }} source={require('../../../assets/images/reedem2.png')}></Image>

        {userPointData &&
          <PoppinsText style={{ marginLeft: 10, fontSize: 34, fontWeight: '600', color: '#373737' }} content={userPointData.body.point_balance}></PoppinsText>
        }
        <PoppinsTextMedium style={{ marginLeft: 10, fontSize: 20, fontWeight: '600', color: '#6E6E6E' }}  content={t("balance points")}></PoppinsTextMedium>
      </View>
      <DisplayEarnings></DisplayEarnings>
      {/* <Header></Header> */}
     
        
          <FlatList
                  
          data={redeemedListData}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          renderItem={({ item,index }) => (
            
              <View key={index} style={{ alignItems: "center", justifyContent: "center", width: '100%' }} >

                <View style={{ alignItems: "flex-start", justifyContent: "center", paddingBottom: 10, marginTop: 20, marginLeft: 20, width: '100%' }}>
                  <PoppinsTextMedium style={{ color: 'black', fontSize: 16 }} content={(item.date)}></PoppinsTextMedium>

                </View>

                {
                  item.data.map((item, index) => {
                    return (
                      <View key={index}>
                        <ListItem data={item} productStatus={item.gift_status} description={item.gift} productCode={item.product_code} amount={item.points} time={moment(item.created_at).format('HH:MM a')} />

                      </View>


                    )
                  })
                }
              </View>
            
          )}
          keyExtractor={(item, index) => index}
        />
          {/* // redeemedListData && redeemedListData.map((item, index) => {
          //   return (
          //     <View key={index} style={{ alignItems: "center", justifyContent: "center", width: '100%' }} >

          //       <View style={{ alignItems: "flex-start", justifyContent: "center", paddingBottom: 10, marginTop: 20, marginLeft: 20, width: '100%' }}>
          //         <PoppinsTextMedium style={{ color: 'black', fontSize: 16 }} content={(item.date)}></PoppinsTextMedium>

          //       </View>

          //       {
          //         item.data.map((item, index) => {
          //           return (
          //             <View key={index}>
          //               <ListItem data={item} description={item.gift} productCode={item.product_code} amount={item.points} time={moment(item.created_at).format('HH:MM')} />

          //             </View>


          //           )
          //         })
          //       }
          //     </View>
          //   )

          // }) */}
     {/* {error  && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
          ></ErrorModal>
      )} */}
      {error  && (
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

      {
        fetchGiftsRedemptionsOfUserIsLoading &&
        <FastImage
          style={{ width: 100, height: 100, alignSelf: 'center', marginTop: '50%' }}
          source={{
            uri: gifUri, // Update the path to your GIF
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      }
  {/* {console.log("fetchGiftsRedemptionsOfUserData body", redeemedListData)} */}
      {
        redeemedListData.length == 0 &&
        <View>

        <FastImage
          style={{ width: 180, height: 180,marginBottom:-10}}
          source={{
            uri: noData, // Update the path to your GIF
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
          <PoppinsTextMedium style={{ color: '#808080',  fontWeight: 'bold' ,marginBottom:200  }} content="NO DATA"></PoppinsTextMedium>
    </View>


      }

    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 240,
    backgroundColor: 'white',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,

    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default RedeemedHistory;