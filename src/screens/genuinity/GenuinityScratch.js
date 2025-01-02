import React, {useState,useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  ActivityIndicator
} from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import {useSelector} from 'react-redux';
import ButtonOval from '../../components/atoms/buttons/ButtonOval';
import ErrorModal from '../../components/modals/ErrorModal';
import axios from 'axios';
import {useClaimGenuinityMutation,useCheckGenuinityMutation } from '../../apiServices/workflow/genuinity/GetGenuinityApi';
import * as Keychain from'react-native-keychain'
import { useTranslation } from 'react-i18next';
const GenuinityScratch = ({navigation,route}) => {
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [token, setToken] = useState()
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const platform = Platform.OS==='ios' ? "2" : "1"
  const qrData = useSelector(state=>state.qrData.qrData)
  const userData = useSelector(state=>state.appusersdata.userData)
  const workflowProgram = route.params.workflowProgram
  const location = useSelector(state=>state.userLocation.location)
  const {t} = useTranslation()
  const [claimGenuinityFunc,{
    data:claimGenuinityData,
    error:claimGenuinityError,
    isLoading:claimGenuinityIsLoading,
    isError:claimGenuinityIsError
  }] =useClaimGenuinityMutation()

  

  // console.log("Qr data", qrData)
  const modalClose = () => {
    setError(false);
  };

  useEffect(()=>{
    if(claimGenuinityData)
    {
      console.log("response from",claimGenuinityData)
      if(claimGenuinityData.success === true)
      {
        navigation.navigate('Genuinity',{workflowProgram:workflowProgram})
      }
    }
    else if(claimGenuinityError){
      // console.log("Error",claimGenuinityError)
      claimGenuinityError && setError(true)
      claimGenuinityError && setMessage(claimGenuinityError.data.message)
    }
  },[claimGenuinityData,claimGenuinityError])

  const handleWorkflowNavigation=()=>{
    console.log("scccess")

    if(workflowProgram[0]==="Static Coupon")
    {
    
    navigation.navigate('CongratulateOnScan',{
      workflowProgram:workflowProgram.slice(1),
      rewardType:"Static Coupon"
    })
    }
    else if (workflowProgram[0]==="Points On Product")
    {
      // console.log(workflowProgram.slice(1))
    navigation.navigate('CongratulateOnScan',{
      workflowProgram:workflowProgram.slice(1),
      rewardType:'Points On Product'
    })

    }
    else if (workflowProgram[0]==="Cashback")
    {
      // console.log(workflowProgram.slice(1))
    navigation.navigate('CongratulateOnScan',{
      workflowProgram:workflowProgram.slice(1),
      rewardType:'Cashback'
    })

    }
    else if (workflowProgram[0]==="Wheel")
    {
      // console.log(workflowProgram.slice(1))
    navigation.navigate('CongratulateOnScan',{
      workflowProgram:workflowProgram.slice(1),
      rewardType:'Wheel'
    })

    }
    else if (workflowProgram[0]==="Warranty")
    {
    navigation.navigate('ActivateWarranty',{
      workflowProgram:workflowProgram.slice(1)
    })


    }
    else{
    navigation.navigate('Genuinity',{
      workflowProgram:workflowProgram.slice(1)
    })



    }

  }
  

  useEffect(()=>{

    const getDashboardData=async()=>{
      try {
          // Retrieve the credentials
          const credentials = await Keychain.getGenericPassword();
          if (credentials) {
            console.log(
              'Credentials successfully loaded for user ' + credentials.username
            );
            const token = credentials.username
            
            setToken(token)
            console.log(token)
            
          } else {
            console.log('No credentials stored');
          }
        } catch (error) {
          console.log("Keychain couldn't be accessed!", error);
        }
  }
  getDashboardData()
    
},[])
   

  const ScratchCodeBox = () => {
    const [value, setValue] = useState();
    const handleOperation = () => {
      console.log("Scratch code button pressed")
      const data = {
        scratch_code: qrData.scratch_code,
        app_user_id: userData.id,
        user_type_id: userData.user_type_id,
        user_type: userData.user_type,
        product_id: Number(qrData.id),
        product_code: qrData.product_code,
        platform_id: Number(platform),
        pincode: location.postcode===undefined ? "N/A":location.postcode,
        platform: 'mobile',
        state: location.state===undefined ? "N/A":location.state,
        district: location.district===undefined ? "N/A":location.district,
        city: location.city===undefined ? "N/A":location.city,
        area: location.city===undefined ? "N/A":location.city,
        known_name: location.county===undefined ? "N/A":location.county,
        lat: location.lat===undefined ? "N/A":String(location.lat),
        log: location.lon===undefined ? "N/A":String(location.lon),
      };
      // const data = {
      //   scratch_code: qrData.scratch_code,
      //   app_user_id: userData.id,
      //   user_type_id: userData.user_type_id,
      //   user_type: userData.user_type,
      //   product_id: Number(qrData.id),
      //   product_code: qrData.product_code,
      //   platform_id: Number(platform),
      //   pincode:"248001",
      //   platform: 'mobile',
      //   state: "Uttrakhand",
      //   district: "asdasd",
      //   city: "sadasdas",
      //   area: "sadsadasd",
      //   known_name: "sadasdasd",
      //   lat: "123.1231",
      //   log: "23123.2323",
      // };
      console.log(typeof data.log,typeof data.lat,typeof data.known_name,typeof data.area,typeof data.city,typeof data.district,typeof data.state,typeof data.platform,typeof data.pincode)
      if (value) {
        console.log('pressed');
         token && claimGenuinityFunc({token,data})
        // navigation.navigate('Genuinity');
      } 
      // else {
      //   setError(true);
      //   setMessage('Scratch Code Could Not Be Empty');
      // }
      // console.log(data)
    };
    return (
      <View
        style={{
          width: '86%',
          height: 240,
          borderWidth: 1,
          borderColor: ternaryThemeColor,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          backgroundColor: 'white',
        }}>
        <PoppinsText
          style={{fontSize: 22, color: '#494A4B'}}
          content="Scratch Code"></PoppinsText>
        <View
          style={{
            height: 52,
            width: '80%',
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#DDDDDD',
            marginTop: 10,
            marginBottom: 10,
          }}>
          <TextInput
            placeholder="Enter Scratch Code"
            placeholderTextColor="#A5A6A8"
            value ={value}
            onChangeText={(text)=>{setValue(text)}}
            style={{
              height: 50,
              width: '80%',
              backgroundColor: 'white',
              marginLeft: 10,
            }}></TextInput>
        </View>
        <ButtonOval
          handleOperation={handleOperation}
          content={t("Submit")}
          style={{
            padding: 8,
            paddingLeft: 20,
            paddingRight: 20,
            color: 'white',
          }}></ButtonOval>
      </View>
    );
  };
  return (
    <View style={{backgroundColor: '#F0F0F0', width: '100%', height: '100%'}}>
      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}></ErrorModal>
      )}
     <View
        style={{
          height: '10%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
        }}>
        <TouchableOpacity
          style={{height: 20, width: 20, position: 'absolute', left: 10}}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{height: 20, width: 20, resizeMode: 'contain'}}
            source={require('../../../assets/images/blackBack.png')}></Image>
        </TouchableOpacity>
        <PoppinsTextMedium
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: '#353535',
            position: 'absolute',
            left: 60,
          }}
          content="Genuine Product"></PoppinsTextMedium>
      </View>
      <View
        style={{
          height: '90%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          bottom: 0,
        }}>
        <ScratchCodeBox></ScratchCodeBox>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default GenuinityScratch;
