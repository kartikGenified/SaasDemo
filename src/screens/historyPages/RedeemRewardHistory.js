import React,{useEffect, useState} from 'react';
import {View, StyleSheet,TouchableOpacity,Image,ScrollView,FlatList, ImageBackground, Text} from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import RedeemRewardDataBox from '../../components/molecules/RedeemRewardDataBox';
import PointsDataBox from '../../components/molecules/PointsDataBox';
import { useFetchUserPointsHistoryMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import { useGetAllRedeemedCouponsMutation } from '../../apiServices/workflow/rewards/GetCouponApi';
import { useFetchGiftsRedemptionsOfUserMutation } from '../../apiServices/workflow/RedemptionApi';
import { useFetchCashbackEnteriesOfUserMutation } from '../../apiServices/workflow/rewards/GetCashbackApi';
import moment from 'moment';
import RedeemRewardDataBoxLong from '../../components/molecules/RedeemRewardDataBoxLong';
import ProgressBar from '../../components/miscellaneous/ProgressBar';
import RedeemRewardDataBoxWithoutImage from '../../components/molecules/RedeemRewardDataBoxWithoutImage';
import { useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import PlatinumModal from '../../components/platinum/PlatinumModal';
import { useGetActiveMembershipMutation } from '../../apiServices/membership/AppMembershipApi';
import { t } from 'i18next';

const RedeemRewardHistory = ({navigation}) => {
    const [showCoupons, setShowCoupons] = useState(false)
    const [showWheel, setShowWheel] = useState(false)
    const [showPoints, setShowPoints] = useState(false)
    const [showCashback, setShowCashback] = useState(false)
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false)
    const [membership, setMemberShip] = useState('')

    const userData = useSelector(state=>state.appusersdata.userData)
    const workflowProgram = useSelector(state => state.appWorkflow.program);
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';

    useEffect(()=>{
        if(workflowProgram.includes("Static Coupon") || workflowProgram.includes("static coupon"))
        {
            setShowCoupons(true)
        }
         if(workflowProgram.includes("Wheel") || workflowProgram.includes("wheel"))
        {
            setShowWheel(true)
        }
         if(workflowProgram.includes("Points On Product") || workflowProgram.includes("points on product"))
        {
            setShowPoints(true)
        }
         if(workflowProgram.includes("Cashback") || workflowProgram.includes("cashback"))
        {
            setShowCashback(true)
        }

    },[])
    const [fetchUserPointsHistoryFunc,{
        data:fetchUserPointsHistoryData,
        error:fetchUserPointsHistoryError,
        isLoading:fetchUserPointsHistoryLoading,
        isError:fetchUserPointsHistoryIsError
    }]= useFetchUserPointsHistoryMutation()

    const [getAllRedeemedFunc,{
        data:getAllRedeemedData,
        error:getAllRedeemedError,
        isLoading:getAllRedeemedIsLoading,
        isError:getAllRedeemedIsError
    }] = useGetAllRedeemedCouponsMutation()

    const [getActiveMembershipFunc, {
        data: getActiveMembershipData,
        error: getActiveMembershipError,
        isLoading: getActiveMembershipIsLoading,
        isError: getActiveMembershipIsError
      }] = useGetActiveMembershipMutation()
    const [fetchCashbackEnteriesFunc,{
        data:fetchCashbackEnteriesData,
        error:fetchCashbackEnteriesError,
        isLoading:fetchCashbackEnteriesIsLoading,
        isError:fetchCashbackEnteriesIsError
    }] =useFetchCashbackEnteriesOfUserMutation()

    const [
        FetchGiftsRedemptionsOfUser,
        {
          data: fetchGiftsRedemptionsOfUserData,
          isLoading: fetchGiftsRedemptionsOfUserIsLoading,
          isError: fetchGiftsRedemptionsOfUserIsError,
          error: fetchGiftsRedemptionsOfUserError,
        },
      ] = useFetchGiftsRedemptionsOfUserMutation();
      
      const [userPointFunc,{
        data:userPointData,
        error:userPointError,
        isLoading:userPointIsLoading,
        isError:userPointIsError
    }]= useFetchUserPointsMutation()

    useEffect(()=>{
        if(userPointData)
        {
            console.log("userPointData",userPointData)
        }
        else if(userPointError)
        {
            console.log("userPointError",userPointError)
        }
    
    },[userPointData,userPointError])

    useEffect(() => {
        if (getActiveMembershipData) {
          console.log("getActiveMembershipData", JSON.stringify(getActiveMembershipData))
          setMemberShip(getActiveMembershipData.body?.tier.name)
        }
        else if (getActiveMembershipError) {
          console.log("getActiveMembershipError", getActiveMembershipError)
        }
      }, [getActiveMembershipData, getActiveMembershipError])

      useEffect(() => {
        (async () => {
            const credentials = await Keychain.getGenericPassword();
            const token =credentials.username;
          const userId = userData.id
    
          FetchGiftsRedemptionsOfUser({
            token: token,
            userId:userId,
            type: "1",
            
          });
          const params={token:token,userId:userId}
          fetchCashbackEnteriesFunc(params)
          getAllRedeemedFunc({
            token:token
        })
        })();
      }, []);
      useEffect(()=>{
        if(fetchGiftsRedemptionsOfUserData)
        {
            console.log("fetchGiftsRedemptionsOfUserData",fetchGiftsRedemptionsOfUserData.body.userPointsRedemptionList)
        }
        else if(fetchGiftsRedemptionsOfUserError)
        {
            console.log("fetchGiftsRedemptionsOfUserIsLoading",fetchGiftsRedemptionsOfUserError)
        }
      },[fetchGiftsRedemptionsOfUserData,fetchGiftsRedemptionsOfUserError])
   
    useEffect(()=>{
        if(getAllRedeemedData)
    {
        console.log("getAllRedeemedData",getAllRedeemedData.body.data)
    }
    else if(getAllRedeemedError){
        console.log("getAllRedeemedError",getAllRedeemedError)
    }
},[getAllRedeemedError,getAllRedeemedData])
    useEffect(()=>{
        fetchPoints()
        getMembership()
    },[])
  const userId = useSelector(state => state.appusersdata.id);

    const fetchPoints=async()=>{
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.username;
        console.log("userId",userId)
        const params ={userId:userId,
        token:token}
        fetchUserPointsHistoryFunc(params)
        userPointFunc(params)

    }
    useEffect(()=>{
        if(fetchUserPointsHistoryData)
        {
            console.log("fetchUserPointsHistoryData",fetchUserPointsHistoryData.body.data)
        }
        else if(fetchUserPointsHistoryError)
        {
            console.log("fetchUserPointsHistoryError",fetchUserPointsHistoryError)
        }

    },[fetchUserPointsHistoryData,fetchUserPointsHistoryError])
    const name = userData.name
   
    console.log(showCashback,showCoupons,showPoints,showWheel)
    useEffect(()=>{
        if(fetchCashbackEnteriesData)
        {
            console.log("fetchCashbackEnteriesData",fetchCashbackEnteriesData.body.data)
        }
        else if(fetchCashbackEnteriesError)
        {
            console.log("fetchCashbackEnteriesError",fetchCashbackEnteriesError)
        }
    },[fetchCashbackEnteriesData,fetchCashbackEnteriesError])

    const hideSuccessModal = () => {
        setIsSuccessModalVisible(false);
      };
  
      const showSuccessModal = () => {
        setIsSuccessModalVisible(true);
        console.log("hello")
      };

    const getMembership = async () => {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log(
            'Credentials successfully loaded for user ' + credentials.username
          );
          const token = credentials.username
          getActiveMembershipFunc(token)
        }
      }
    const DreamGiftComponent =()=>{
        const milestoneData = {"campaign": null, "data": ["https://paramount-dev.genefied.co/uploads/dashboard-banners/1692253456.3752-134428.jpg", "https://paramount-dev.genefied.co/uploads/dashboard-banners/1692170724.6659-716345.jpg", "https://paramount-dev.genefied.co/uploads/dashboard-banners/1692168073.1434-51908.jpg", "https://paramount-dev.genefied.co/uploads/dashboard-banners/1692167976.6234-134428.jpg", "https://paramount-dev.genefied.co/uploads/dashboard-banners/1691221267.6337-63217.jpg", "https://paramount-dev.genefied.co/uploads/dashboard-banners/banner-small.png"], "message": "Fetched banner successfully", "milestones": [{"achieved": "1", "image": "https://www.shreesaiholidays.in/wp-content/uploads/2018/01/Goa.png", "name": "Goa (Pkg for 1) (3N/4D)", "threshold": "1000"}, {"achieved": "0", "image": "https://www.shreesaiholidays.in/wp-content/uploads/2018/01/Goa.png", "name": "Goa (Pkg for 2) (3N/4D)", "threshold": "1500"}, {"achieved": "0", "image": "https://i.pinimg.com/originals/9d/54/91/9d5491d5c9b42b9f097af7bd014ac083.jpg", "name": "Bangkok (Pkg for 2) (3N/4D)", "threshold": "2200"}, {"achieved": "0", "image": "https://traveldivaishnavi.com/wp-content/uploads/2018/02/Dubai-5D4N-Package-1-675x460.jpg", "name": "Dubai (Pkg for 2) (3N/4D)", "threshold": "3000"}], "pointData": {"amount_redeemed": 0, "qr_count": 0}, "status": "200", "unread_notification_count": "2", "user": {"aadhaar": "393856466133", "aadhaar_image": null, "aadhaar_verified": "1", "address": "MCF 1753, Gali-43, Faridabad Sector 22, Faridabad Sector 22, Faridabad, Faridabad, Haryana, India, 121005", "address_2": null, "alt_mobile": null, "auth_token": "TdAbU4qyw7ZxJEgFkHfsc35WaVD0u1jSzOo2R8CXQKhvNrPnmp", "city": null, "code": "RT00001", "created_on": "2023-09-22 11:29:00", "district": null, "dob": null, "email": "mitesh.kumar@genuinemark.org", "est_date": null, "fcm_token": "fcmtokeforretailer", "gender": null, "gst_image": null, "gstin": "08AAACP0969Q1ZS", "id": "1", "is_mobile_verified": "1", "mobile": "9811732568", "mpin": null, "name": "Mitesh", "pancard": "", "pancard_image": null, "pancard_verified": "1", "password": "12345", "pincode": null, "platform": null, "profile_image": null, "remarks": null, "shop_image": null, "shop_name": "PARAMOUNT COMMUNICATIONS LIMITED", "state": null, "status": "4", "updated_on": "2023-09-22 12:04:34", "user_type": "2"}}
        return(
            <View style={{height:140,width:'100%',alignItems:"center",justifyContent:'center',flexDirection:'row',borderWidth:1,borderColor:'#DDDDDD'}}>
                <View style={{height:'100%',width:'74%',alignItems:"center",justifyContent:"center",marginTop:20}}>
                <ProgressBar data={milestoneData.milestones}></ProgressBar>
                </View>
                <View style={{height:'100%',width:'26%',alignItems:"center",justifyContent:"center",borderLeftWidth:1,borderColor:'#DDDDDD'}}>
                    <Image style={{height:60,width:60,resizeMode:"contain"}} source={require('../../../assets/images/gift.png')}></Image>
                    <PoppinsTextMedium style={{color:'black',fontSize:16,fontWeight:'700'}} content="Dream"></PoppinsTextMedium>
                </View>
            </View>
        )
    }
    const CashbackProductList=()=>{
        return(
            <View style={{alignItems:"center",justifyContent:"center",flexDirection:"row",height:100,width:'100%',backgroundColor:"white",marginTop:10,borderTopWidth:1,borderColor:'#DDDDDD',borderStyle:'dashed'}}>
                <View style={{alignItems:"center",justifyContent:"center"}}>
                <Image style={{height:60,width:60,resizeMode:"contain",marginLeft:10}} source={require('../../../assets/images/cashbackPoints.png')}></Image>
                </View>
             
               {fetchCashbackEnteriesData && <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
        data={fetchCashbackEnteriesData.body.data}
        initialNumToRender={10}
      
        renderItem={({item,index}) => {
            console.log("Redeem",item)
            return(
                <RedeemRewardDataBoxWithoutImage header="Credited To Balance" data={moment(item.created_at).format("DD MMM YYYY")} points={item.cashback}></RedeemRewardDataBoxWithoutImage>
                
                )
        }}
        keyExtractor={item => item.id}
      />}
  
            </View>
        )
    }
    const RedeemedProductList=()=>{
        return(
            <View style={{alignItems:"center",justifyContent:"center",flexDirection:"row",height:100,width:'100%',backgroundColor:"white",marginTop:10,borderTopWidth:1,borderColor:'#DDDDDD',borderStyle:'dashed'}}>
                <View style={{alignItems:"center",justifyContent:"center"}}>
                <Image style={{height:60,width:60,resizeMode:"contain",marginLeft:10}} source={require('../../../assets/images/magicBox.png')}></Image>
                </View>
             
               {fetchGiftsRedemptionsOfUserData && <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
        data={fetchGiftsRedemptionsOfUserData.body.userPointsRedemptionList}
        initialNumToRender={10}
      
        renderItem={({item,index}) => {
            console.log("Redeem",item)
            return(
                <RedeemRewardDataBoxLong type="Uri" header={item.gift.gift[0].name} data={moment(item.created_at).format("DD MMM YYYY")} image={item.gift.gift[0].images[0]}></RedeemRewardDataBoxLong>
                
                )
        }}
        keyExtractor={item => item.id}
      />}
  
            </View>
        )
    }

    const EarnedPointList=()=>{
        return(
            <View style={{alignItems:"center",justifyContent:"center",flexDirection:"row",height:100,width:'100%',backgroundColor:"white",marginTop:10}}>
                <View style={{alignItems:"center",justifyContent:"center"}}>
                <Image style={{height:80,width:80,resizeMode:"contain"}} source={require('../../../assets/images/coinBag.png')}></Image>
                </View>
             
               {fetchUserPointsHistoryData && <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
        data={fetchUserPointsHistoryData.body.data}
        initialNumToRender={10}
       
        renderItem={({item,index}) => {
            console.log(index+1,item)
            return(
                <PointsDataBox header={t("points earned")} data={moment(item.created_at).format("DD MMM YYYY")} points={item.points}></PointsDataBox>
            
                )
        }}
        keyExtractor={item => item.id}
      />}
  
            </View>
        )
    }

    const CouponList=(props)=>{
      

        const Coupon=(props)=>{
            const earnedOn = props.earnedOn
            const couponName = props.couponName
            const couponCode = props.couponCode
            const expiresOn = props.expiresOn
            return(
                <ImageBackground resizeMode='stretch' style={{height:120,width:240,alignItems:"center",justifyContent:"center",marginTop:10}} source={require('../../../assets/images/voucherBackground.png')}>
                <PoppinsTextMedium style={{color:'#FB774F',fontSize:11,position:'absolute',top:0,right:20}} content ={`Earned on ${earnedOn}`}></PoppinsTextMedium>
            <View style={{flexDirection:'row',alignItems:"center",justifyContent:"center"}}>
                <View style={{height:50,width:50,borderRadius:25,borderWidth:1,alignItems:"center",justifyContent:"center",borderColor:'#DDDDDD'}}>
                    <Image style={{height:30,width:30,borderRadius:15,resizeMode:"contain"}} source={require('../../../assets/images/voucher1.png')}></Image>
                </View>
                <View style={{alignItems:"flex-start",justifyContent:"center",marginLeft:10}}>
                    <PoppinsTextMedium style={{color:'black',fontWeight:'700',fontSize:12}} content={couponName}></PoppinsTextMedium>
                    <View style={{alignItems:"center",justifyContent:"center",flexDirection:"row"}}>
                    <PoppinsTextMedium style={{color:'#DDDDDD',fontWeight:'700',fontSize:12}} content={`Code : ${couponCode}`}></PoppinsTextMedium>

                    </View>

                </View>
            </View>
            <View style={{width:"90%",borderTopWidth:1,borderStyle:'dashed',borderColor:'#DDDDDD',marginTop:10,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                <View style={{padding:4,alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:'#D42727',borderStyle:'dashed',marginTop:10,width:'70%'}}>
                    <PoppinsTextMedium style={{fontSize:10}} content ={`Expires on ${expiresOn}`}></PoppinsTextMedium>
                </View>
                <Image style={{height:20,width:20,marginTop:10,marginLeft:10,resizeMode:'contain',transform:[{rotate:'180deg'}]}} source={require('../../../assets/images/blackBack.png')}></Image>
            </View>
            </ImageBackground>
            )
        }

        return(
            <View style={{alignItems:"center",justifyContent:"center",padding:10,backgroundColor:"#F1F1F1",borderColor:'#DDDDDD'}}>
                {getAllRedeemedData && <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
        data={getAllRedeemedData.body.data}
        initialNumToRender={10}
       
        renderItem={({item,index}) => {
            console.log(index+1,item)
            return(
                <Coupon earnedOn={moment(item.created_at).format("DD MMM YYYY")} couponName={item.brand} expiresOn={moment(item.expire_date).format("DD MMM YYYY")} couponCode={item.coupon_code}></Coupon>
            
                )
        }}
        keyExtractor={item => item.id}
      />}
            </View>
            
        )
    }

    return (
        <ScrollView>
        <View style={{backgroundColor:"white"}}>
             <View style={{height:200,width:'100%',backgroundColor:ternaryThemeColor,alignItems:"flex-start",justifyContent:'flex-start'}}>
            
            <View style={{alignItems:"center",justifyContent:"flex-start",flexDirection:"row",width:'100%',marginTop:10,height:40,marginLeft:20}}>
                <TouchableOpacity onPress={()=>{navigation.goBack()}}>
            <Image style={{height:30,width:30,resizeMode:'contain'}} source={require('../../../assets/images/blackBack.png')}></Image>
                </TouchableOpacity>
            <PoppinsTextMedium content ={t("Redeem rewards")} style={{marginLeft:10,fontSize:18,fontWeight:'700',color:'white'}}></PoppinsTextMedium>
            {/* <TouchableOpacity style={{marginLeft:'50%'}}>
            <Image style={{height:30,width:30,resizeMode:'contain'}} source={require('../../../assets/images/notificationOn.png')}></Image>
            </TouchableOpacity> */}
            </View>
                {/* name and membership */}
            {/* --------------------------- */}
            <View style={{flexDirection:"row",height:50,width:'100%',alignItems:"center",justifyContent:"flex-start"}}>
                <PoppinsText content={name} style={{color:'white',fontSize:20,marginLeft:20}}></PoppinsText>
                {
                getActiveMembershipData && <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft:4
              }}>
              <Image
                style={{ height: 16, width: 16, resizeMode: 'contain' }}
                source={require('../../../assets/images/reward.png')}></Image>
              <TouchableOpacity onPress={
                showSuccessModal
              }>
                <PoppinsTextMedium
                  style={{ color: 'white', fontSize: 14 ,marginLeft:2}}
                  content={membership}></PoppinsTextMedium>
              </TouchableOpacity>

            </View>
            }
                <PlatinumModal isVisible={isSuccessModalVisible} onClose={hideSuccessModal} getActiveMembershipData={getActiveMembershipData} />

                </View>
            <View style={{alignItems:"flex-start",justifyContent:"center",width:'100%',top:10}}>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
           {showCoupons &&
            <RedeemRewardDataBox header="My Vouchers"  data="5000" image={require('../../../assets/images/voucher1.png')} ></RedeemRewardDataBox>}
           {showCashback && <RedeemRewardDataBox navigation = {navigation} header="Cashback"  data="5000" image={require('../../../assets/images/cashback.png')} ></RedeemRewardDataBox>}
            {showPoints && userPointData &&  <RedeemRewardDataBox navigation = {navigation} header={t("earned points")}  data={userPointData.body.point_earned} image={require('../../../assets/images/points.png')} ></RedeemRewardDataBox>}
           {showWheel &&  <RedeemRewardDataBox navigation = {navigation} header="Total Spins"  data="5000" image={require('../../../assets/images/wheel.png')} ></RedeemRewardDataBox>
           }

            {showPoints && userPointData &&  <RedeemRewardDataBox navigation = {navigation} header={t("points balance")}  data={userPointData.body.point_balance} image={require('../../../assets/images/points.png')} ></RedeemRewardDataBox>}

            {showPoints && userPointData &&  <RedeemRewardDataBox navigation = {navigation} header={t("Redeem Points")}  data={userPointData.body.point_redeemed} image={require('../../../assets/images/points.png')} ></RedeemRewardDataBox>}

            {showPoints && userPointData &&  <RedeemRewardDataBox navigation = {navigation} header={t("Reserved Points")}  data={userPointData.body.point_reserved} image={require('../../../assets/images/points.png')} ></RedeemRewardDataBox>}


            </ScrollView>

            </View>
            
            </View>
            {showPoints && <EarnedPointList></EarnedPointList>}
            
            {showCoupons && <CouponList couponName="Zomato" couponCode="Yummy123" earnedOn="23 Sep 2023"></CouponList>}
            <RedeemedProductList ></RedeemedProductList>
            {/* <DreamGiftComponent></DreamGiftComponent> */}
            {showCashback && <CashbackProductList></CashbackProductList>}
        </View>

        
        
        </ScrollView>
    );
}

const styles = StyleSheet.create({})

export default RedeemRewardHistory;