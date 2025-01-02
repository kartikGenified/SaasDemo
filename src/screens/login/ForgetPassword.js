import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { BaseUrl } from '../../utils/BaseUrl';
import LinearGradient from 'react-native-linear-gradient';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import CustomTextInput from '../../components/organisms/CustomTextInput';
import CustomTextInputNumeric from '../../components/organisms/CustomTextInputNumeric';
import ButtonNavigateArrow from '../../components/atoms/buttons/ButtonNavigateArrow';
import { useGetLoginOtpMutation } from '../../apiServices/login/otpBased/SendOtpApi';
import ButtonNavigate from '../../components/atoms/buttons/ButtonNavigate';
import ErrorModal from '../../components/modals/ErrorModal';
import { useGetNameMutation } from '../../apiServices/login/GetNameByMobile';
import TextInputRectangularWithPlaceholder from '../../components/atoms/input/TextInputRectangularWithPlaceholder';
import { useIsFocused } from '@react-navigation/native';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import Checkbox from '../../components/atoms/checkbox/Checkbox';
import { useFetchLegalsMutation } from '../../apiServices/fetchLegal/FetchLegalApi';
import * as Keychain from 'react-native-keychain';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import AlertModal from '../../components/modals/AlertModal';
import crashlytics from '@react-native-firebase/crashlytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TextInputNumericRectangle from '../../components/atoms/input/TextInputNumericRectangle';
import OtpInput from '../../components/organisms/OtpInput';
import TextInputRectangle from '../../components/atoms/input/TextInputRectangle';
import { useEvent } from 'react-native-reanimated';
import { useGetLoginOtpForVerificationMutation } from '../../apiServices/otp/GetOtpApi';
import { useUpdatePasswordForDistributorMutation } from '../../apiServices/login/passwordBased/updatePassword';
import { useGetUserDataMutation } from '../../apiServices/login/GetDataByUid';
import MessageModal from '../../components/modals/MessageModal';
const ForgetPassword = ({navigation,route}) => {
const [userMobile, setUserMobile] = useState()
const [checked, setChecked] = React.useState('first');
const [name, setName] = useState("")
const [newPassword, setNewPassword] = useState("")
const [confirmPassword, setConfirmPassword] = useState("")
const [showOtp, setShowOtp] = useState(false)
const [otpSent, setOtpSent] = useState(false)
const [otpVerified, setOtpVerified] = useState(false)
const [message, setMessage] = useState();
const [success, setSuccess] = useState(false)
const [uid, setUid] = useState("")

    const primaryThemeColor = useSelector(
        state => state.apptheme.primaryThemeColor,
      )
        
  const {t} = useTranslation();

      const secondaryThemeColor = useSelector(
        state => state.apptheme.secondaryThemeColor,
      )
        
      const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        
      const currentVersion = useSelector((state)=>state.appusers.app_version)
    
    
      const icon = useSelector(state => state.apptheme.icon)
        
    
      const buttonThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
      const userType = route.params?.userType
      const userTypeId = route.params?.userTypeId
    console.log("forget password params", userType,userTypeId)

      const [sendOtpFunc, {
        data: sendOtpData,
        error: sendOtpError,
        isLoading: sendOtpIsLoading,
        isError: sendOtpIsError
      }] = useGetLoginOtpForVerificationMutation()

      const [
        getUserDataByUidFunc,
        {
          data: getUserDataByUidData,
          error: getUserDataByUidError,
          isLoading: getUserDataByUidIsLoading,
          isError: getUserDataByUidIsError
        }
      ] = useGetUserDataMutation()

      const [
        updatePassFunc,
        {
          data: updatePasswordData,
          error: updatePasswordError,
          isLoading: updatePasswordLoading,
          isError: updatePasswordIsError,
        },
      ] = useUpdatePasswordForDistributorMutation();

      useEffect(() => {
        if (getUserDataByUidData) {
          console.log("getUserDataByUidData", getUserDataByUidData)
          setUserMobile(getUserDataByUidData.body.mobile)
          const params = { mobile: getUserDataByUidData.body.mobile, name: getUserDataByUidData.body.name, user_type_id: userTypeId, user_type: userType,type:'forgot_password' }
            sendOtpFunc(params)
        }
        else if (getUserDataByUidError) {
          console.log("getUserDataByUidError", getUserDataByUidError)
        }
      }, [getUserDataByUidData, getUserDataByUidError])

      useEffect(()=>{
        if(updatePasswordData)
        {
          console.log("updatePasswordData", updatePasswordData)
          setSuccess(true)
          setMessage(updatePasswordData.message)
        }
        else if(updatePasswordError)
        {
          console.log("UpdatePasswordError", updatePasswordError)
        }
      },[updatePasswordData,updatePasswordError])

      useEffect(() => {
        if (sendOtpData) {
          console.log("sendOtpData", sendOtpData);
          setOtpSent(true);
        }
        else if(sendOtpError) {
          console.log("sendOtpError", sendOtpError)
          alert(t("OTP could not be sent to this number"))
        }
      }, [sendOtpData, sendOtpError])

      useEffect(()=>{
        setOtpSent(false)
        setShowOtp(false)
        setOtpVerified(false)
        setUserMobile()
        setNewPassword("")
        setConfirmPassword("")
        setMessage("")
        setSuccess(false)
        setUid("")
      },[checked])

    const handleChildComponentData=(data)=>{
        console.log("forgot password comp",data)
        if(name)
        if(data.value.length ==10)
        {
            setShowOtp(true)
            setUserMobile(data.value)

        }
        
    }  

    const handleName=(nameData)=>{
    setName(nameData?.value)
    }

    const getOtpFromComponent=(otp)=>{
    console.log("Otp entered is",otp)
        if(otp == sendOtpData.body.otp)
        {
            setOtpVerified(true)
        }
        else{
            alert(t("The OTP you have entered is wrong"))
        }
   
    }

    const changePasswordFunc=()=>{
    
     
          if(newPassword === confirmPassword)
          {
            updatePassFunc({
              data: {
                mobile: userMobile,
                new_password: newPassword,
              },
    
            }); 
          }
          else{
              alert(t("New password and confirm password did not match"))
          }
      

            
          
       
        }

    const handleNewPassword=(data)=>{
        setNewPassword(data.value)
    }

    const handleConfirmPassword=(data)=>{
      setConfirmPassword(data.value)
        
    }

    const getOtp=()=>{
        if(name && userMobile)
        {
            const params = { mobile: userMobile, name: name, user_type_id: userTypeId, user_type: userType,type:'forgot_password' }
            sendOtpFunc(params)
        }
    }

    const handleUserName=(data)=>{
      console.log("username/sap code entered is ", data.value)
      setUid(data.value)
      
    }

    const getUserNameData=()=>{
      getUserDataByUidFunc({"uid":uid})
    }
    const modalClose = () => {
      setSuccess(false);
    };

    return (
    <ScrollView
    contentContainerStyle={styles.container}
    >
      <View style={{
        width: '100%', alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: ternaryThemeColor,
      }}>
        <View
          style={{
            height: 120,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: ternaryThemeColor,
            flexDirection: 'row',

          }}>

          <TouchableOpacity
            style={{ height: 50, alignItems: "center", justifyContent: 'center', position: "absolute", left: 10, top: 20 }}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              style={{ height: 20, width: 20, resizeMode: 'contain' }}
              source={require('../../../assets/images/blackBack.png')}></Image>
          </TouchableOpacity>
          <Image
            style={{
              height: 50,
              width: 100,
              resizeMode: 'contain',
              top: 20,
              position: "absolute",
              left: 50,



            }}
            source={require('../../../assets/images/ozoneWhiteLogo.png')}></Image>


        </View>
        <View
          style={{
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginTop: 10,
            width: '90%'
          }}>
          <PoppinsText
            style={{ color: 'white', fontSize: 24 }}
            content={t("Please select any one option to reset your password")}>
          </PoppinsText>
          <View style={{flexDirection:"row",width:'100%',alignItems:'center',justifyContent:'flex-start'}}>
          <RadioButton
          color='white'
          uncheckedColor='white'
        value="first"
        status={ checked === 'first' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('first')}
      />
      <PoppinsText
            style={{ color: 'white', fontSize: 14,marginRight:20 }}
            content={t("Via UserName")}>
          </PoppinsText>
      <RadioButton
        color='white'
        uncheckedColor='white'
        value="second"
        status={ checked === 'second' ? 'checked' : 'unchecked' }
        onPress={() => setChecked('second')}
      />
      <PoppinsText
            style={{ color: 'white', fontSize: 14 }}
            content={t("Via Mobile Number")}>
          </PoppinsText>
          </View>
        </View>
        </View>
        {success && (
          <MessageModal
            modalClose={modalClose}
            title={t("Thanks")}
            message={message}
            openModal={success}
            navigateTo="SelectUser"
          ></MessageModal>
        )}
        <View style={{backgroundColor:'white',marginTop:30,alignItems:"center"}}>
        {checked == 'first' && <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
         <TextInputRectangle
                      jsonData={{"label": "UserName", "maxLength": "100", "name": "username", "options": [], "required": true, "type": "text"}}
                      handleData={handleUserName}
                      placeHolder={"username"}
                      label={"UserName"}>
                      {' '}
        </TextInputRectangle>
        <TouchableOpacity style={{width:'44%',marginTop: 6, backgroundColor: ternaryThemeColor, alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 5 }} onPress={()=>{
                          getUserNameData()
                        }}>
                          <PoppinsTextLeftMedium style={{ color: 'white', fontWeight: '800', padding: 5 }}content={t("Validate UserName")}></PoppinsTextLeftMedium>
                        </TouchableOpacity>
        </View>}
          {checked == 'second' && <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
        <TextInputRectangle
                      jsonData={{"label": "Name", "maxLength": "100", "name": "name", "options": [], "required": true, "type": "text"}}
                      handleData={handleName}
                      placeHolder={"name"}
                      label={"Name"}>
                      {' '}
        </TextInputRectangle>
        <TextInputNumericRectangle
                            jsonData={{"label": "Mobile", "maxLength": "10", "name": "mobile", "options": [], "required": true, "type": "text"}}
                            maxLength={10}
                            handleData={handleChildComponentData}
                            placeHolder={"mobile"}
                            displayText ={"mobile"}
                            label={"Mobile"}
                            isEditable={true}
                          >
                            {' '}
        </TextInputNumericRectangle>
        </View>}
        

                          {showOtp && <TouchableOpacity style={{width:'30%',marginTop: 6, backgroundColor: ternaryThemeColor, alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 5 }} onPress={()=>{
                          getOtp()
                        }}>
                          <PoppinsTextLeftMedium style={{ color: 'white', fontWeight: '800', padding: 5 }}content={t("get otp")}></PoppinsTextLeftMedium>
                        </TouchableOpacity>}

                        {otpSent && <OtpInput
                            getOtpFromComponent={getOtpFromComponent}
                            color={'white'}></OtpInput>}
                          {otpSent && <PoppinsTextLeftMedium style={{ color: ternaryThemeColor, fontWeight: '800', padding: 5 }}content={t("Enter OTP")}></PoppinsTextLeftMedium>}

        {otpVerified && <TextInputRectangle
                      jsonData={{"label": "Enter New Password", "maxLength": "100", "name": "enter new password", "options": [], "required": true, "type": "text"}}
                      handleData={handleNewPassword}
                      placeHolder={t("Enter New Password")}
                      label={t("Enter New Password")}>
                      {' '}
        </TextInputRectangle>}

        {otpVerified && <TextInputRectangle
                      jsonData={{"label": "Confirm Password", "maxLength": "100", "name": "confirm password", "options": [], "required": true, "type": "text"}}
                      handleData={handleConfirmPassword}
                      placeHolder={t("Confirm Password")}
                      label={t("Confirm Password")}>
                      {' '}
        </TextInputRectangle>}
        {updatePasswordError && 
                          <PoppinsTextLeftMedium style={{ color: 'red', fontWeight: '800', padding: 5,marginTop:10 }}content={updatePasswordError?.data?.message}></PoppinsTextLeftMedium>

        }

        {otpVerified && <TouchableOpacity style={{width:'40%',marginTop: 6, backgroundColor: ternaryThemeColor, alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 5,marginBottom:20 }} onPress={()=>{
                          changePasswordFunc()
                        }}>
                          <PoppinsTextLeftMedium style={{ color: 'white', fontWeight: '800', padding: 5 }}content={t("Update Password")}></PoppinsTextLeftMedium>
                        </TouchableOpacity>}
        </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:{
        minHeight:'100%',
        backgroundColor:'white'
    }
})

export default ForgetPassword;