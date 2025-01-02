import React,{useState,useEffect} from 'react';
import {View, StyleSheet,TextInput,Modal,Pressable,Text,Image,Keyboard} from 'react-native';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';
import { useSendAadharOtpMutation } from '../../../apiServices/verification/AadharVerificationApi';
import { useVerifyAadharMutation } from '../../../apiServices/verification/AadharVerificationApi';
import ZoomImageAnimation from '../../animations/ZoomImageAnimation';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';

const TextInputAadhar = (props) => {
    const [value,setValue] = useState()
    const [otp, setOtp] = useState()
    const [modalVisible, setModalVisible] = useState(false);
    const [otpSent, setOtpSent] = useState(false)
    const [showOtp, setShowOtp] = useState(false)
    const [aadharVerified, setAadharVerified] =  useState(false)
    const [aadharExists, setAadharExists] = useState(false)
    const [keyboardShow, setKeyboardShow] = useState(false)
    const [showLoading, setShowLoading] = useState(false)
    const {t}  = useTranslation() 

    const placeHolder = props.placeHolder
    const required = props.required
    let displayText = props.placeHolder

    if(displayText == "Aadhar" || displayText== "aadhar"){
      displayText = "Aadhar"
    }

  const label = props.label
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
    const gifUri = Image.resolveAssetSource(require('../../../../assets/gif/loader.gif')).uri;
    Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardShow(true);
    });
    Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardShow(false);
    });
    const [sendAadharOtpFunc,{
        data:sendAadharOtpData,
        error:sendAadharOtpError,
        isLoading:sendAadharOtpIsLoading,
        isError:sendAadharOtpIsError
      }]= useSendAadharOtpMutation()

      const [verifyAadharFunc,{
        data:verifyAadharData,
        error:verifyAadharError,
        isLoading:verifyAadharIsLoading,
        isError:verifyAadharIsError
      }]= useVerifyAadharMutation()

    console.log("Aadhar TextInput")

    useEffect(()=>{
      if(value)
      {
        if(value.length===12)
      {
        
        
        const data = {
          "aadhaar_number":value
      }
      setShowLoading(true)
      sendAadharOtpFunc(data)
        
       
      }
      else{
        setShowOtp(false)
      }
      }
      
    
     },[value])
     useEffect(()=>{
        if(otp)
        {
            if(otp.length===6)
            {
              
                const data={
                    "ref_id":sendAadharOtpData.body.ref_id,
                  "otp":otp
                  }
                  verifyAadharFunc(data)
                  setShowLoading(true)
            }
            else
            {
              props.notVerified(true)
            }
        }
     },[otp])
     useEffect(()=>{
        if(sendAadharOtpData)
        {
        console.log("sendAadharOtpData",sendAadharOtpData)
        // setRefId(sendAadharOtpData.body.ref_id)
        if(sendAadharOtpData.success)
        {
          console.log("success")
          setOtpSent(true)
          setShowOtp(true)
          setShowLoading(false)
          props.notVerified(true)
        }
        }
        else if(sendAadharOtpError)
        {
        console.log("sendAadharOtpError",sendAadharOtpError)
          setShowLoading(false)
          setAadharExists(true)
          props.notVerified(true)
        
        }
        
        },[sendAadharOtpData,sendAadharOtpError])

        useEffect(()=>{
            if(verifyAadharData)
            {
              console.log("verifyAadharData",verifyAadharData)
              if(verifyAadharData.success)
              {
              setModalVisible(true)
              setShowLoading(false)
              setAadharVerified(true)
              props.notVerified(false)
              }
            }
            else if(verifyAadharError){
              console.log("verifyAadharError",verifyAadharError)
              props.notVerified(true)
              setShowLoading(false)

            }
            },[verifyAadharError,verifyAadharData])

            useEffect(()=>{
              handleInputEnd()
          },[keyboardShow])

    const handleInput=(text)=>{
        setValue(text)
        // props.handleData(value)
       
    }
    
    const handleInputEnd=()=>{
        let tempJsonData ={...props.jsonData,"value":value}
        console.log(tempJsonData)
        props.handleData(tempJsonData)
    }

    return (
        <View style={{alignItems:"center",justifyContent:"center",width:'100%'}}>
            <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
         
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{t("Aadhar Verified Succesfully")}</Text>
            <ZoomImageAnimation style={{marginBottom:20}} zoom={100} duration={1000}  image={require('../../../../assets/images/greenTick.png')}></ZoomImageAnimation>
            {/* <Image style={{height:60,width:60,margin:20}} source={require('../../../../assets/images/greenTick.png')}></Image> */}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
            <View style={{height:60,width:'86%',borderWidth:1,borderColor:'#DDDDDD',alignItems:"center",justifyContent:"center",backgroundColor:'white',margin:10,flexDirection:'row'}}>
            
            
            <View style={{alignItems:"center",justifyContent:'center',backgroundColor:'white',position:"absolute",top:-15,left:16}}>
                <PoppinsTextMedium style={{color:"#919191",padding:4,fontSize:18}} content = {t(label)}></PoppinsTextMedium>
            </View>
            <TextInput maxLength={12} onSubmitEditing={(text)=>{handleInputEnd()}} onEndEditing={(text)=>{handleInputEnd()}} style={{height:50,width:'80%',alignItems:"center",justifyContent:"center",fontWeight:'500',color:'black',fontSize:16,position:'absolute',left:14}} placeholderTextColor="grey" onChangeText={(text)=>{handleInput(text)}} value={value} placeholder={required ?  `${placeHolder} *` : `${placeHolder}`}></TextInput>
            {aadharVerified && <View style={{alignItems:'center',justifyContent:'center',width:'20%',position:'absolute',right:0}}>
              <Image style={{height:30,width:30,resizeMode:'contain'}} source={require('../../../../assets/images/greenTick.png')}></Image>
            </View>}
        </View>
        {
          aadharExists &&  <View style={{width:'100%',alignItems:'flex-start',justifyContent:'center'}}>
          <PoppinsTextMedium style={{color:ternaryThemeColor,padding:4,fontSize:14,marginLeft:24}} content = {sendAadharOtpError?.data?.message}></PoppinsTextMedium>
        </View>
        }
        {
          otpSent && 
          
          <View style={{width:'100%',alignItems:'flex-start',justifyContent:'center'}}>
            <PoppinsTextMedium style={{color:ternaryThemeColor,padding:4,fontSize:14,marginLeft:24}} content ={t("OTP Sent")}></PoppinsTextMedium>
          </View>

        }
      
       {showOtp  && <View style={{height:60,width:'86%',borderWidth:1,borderColor:'#DDDDDD',alignItems:"center",justifyContent:"center",backgroundColor:'white',margin:10}}>
        
        <View style={{alignItems:"center",justifyContent:'center',backgroundColor:'white',position:"absolute",top:-15,left:16}}>
            <PoppinsTextMedium style={{color:"#919191",padding:4,fontSize:18}} content = "OTP"></PoppinsTextMedium>
        </View>
        <TextInput maxLength={6} keyboardType='numeric'  style={{height:50,width:'100%',alignItems:"center",justifyContent:"flex-start",fontWeight:'500',marginLeft:24,color:'black',fontSize:16}} placeholderTextColor="grey" onChangeText={(text)=>{setOtp(text)}} value={otp} placeholder={`One time password *`}></TextInput>
    
      {(verifyAadharIsLoading || sendAadharOtpIsLoading || showLoading) && <FastImage
          style={{ width: 30, height: 30, alignSelf: 'center',position:'absolute',right:10 }}
          source={{
            uri: gifUri, // Update the path to your GIF
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />}
      
    </View>}
    {
          verifyAadharError && <View style={{width:'100%',alignItems:'flex-start',justifyContent:'center'}}>
          <PoppinsTextMedium style={{color:"red",padding:4,fontSize:14,marginLeft:24}} content = {verifyAadharError?.data?.Error?.message}></PoppinsTextMedium>
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
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
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
      borderRadius:4,
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
      fontSize:16,
      color:'black',
      fontWeight:'600'
    },
  });

export default TextInputAadhar;