import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View,ActivityIndicator } from "react-native";
import { Camera, useCameraPermission,useCameraDevice } from "react-native-vision-camera";
import PoppinsTextMedium from "../../electrons/customFonts/PoppinsTextMedium";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { useUploadSingleFileMutation } from "../../../apiServices/imageApi/imageApi";
import * as Keychain from "react-native-keychain";


const CameraInputWithUpload = (props) => {
  const [openCamera, setOpenCamera] = useState(false);
  const [showButton, setShowButton] = useState(false)
  const [capturePressed, setCapturePressed] = useState(false)
  const [loading, setLoading] = useState()
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';

  const navigation = useNavigation();
  const title = props.title
  const jsonData = props.jsonData

  const [
    uploadImageFunc,
    {
      data: uploadImageData,
      error: uploadImageError,
      isLoading: uploadImageIsLoading,
      isError: uploadImageIsError,
    },
  ] = useUploadSingleFileMutation();

  useEffect(() => {
    console.log("hasPermission", hasPermission);
    let timeoutID;
    if(!hasPermission)
    {
        requestPermission()
    }
    else{
       timeoutID = setTimeout(() => {
      setShowButton(true)
        
      }, 2000);
    }


    return (()=>{
      clearTimeout(timeoutID)
    })
  }, [hasPermission]);

  useEffect(() => {
    if (uploadImageData) {
      console.log("uploadImageData",uploadImageData);
      if (uploadImageData.success) {
        setLoading(true)
        let data = {...props.jsonData, value:uploadImageData?.body?.fileLink}
        props.handleData(data)
      }
    } else if(uploadImageError) {
      console.log("uploadImageError",uploadImageError);
    }
  }, [uploadImageData, uploadImageError]);


const captureImage=async()=>{
  try{
const result = await launchCamera({quality:0.9})
console.log("launchCameraOutput",result)
const imageData = {
    uri: result.assets[0]?.uri,
    name: result.assets[0]?.fileName,
    type: result.assets[0]?.type,
  };
  const uploadFile = new FormData();
  uploadFile.append("image", imageData);

  const getToken = async () => {
    const credentials = await Keychain.getGenericPassword();
    const token = credentials.username;
    console.log("uploadImageFunc",JSON.stringify(uploadFile))
    setLoading(false)
    uploadImageFunc({ body: uploadFile});
  };

  getToken();
  }
  catch(e)
  {
    console.log("Exception in Image libray",e)
  }

// console.log("captureImage",photo)
}

  return (
    <View style={{ alignItems: "center", justifyContent: "center", marginBottom:20 ,borderWidth:1, width:'85%', paddingBottom:20, paddingTop:20,borderRadius:10,borderColor:'#DDDDDD'}}>
    <PoppinsTextMedium style={{color:'black',fontSize:18,fontWeight:'700'}} content ={`${title} ${jsonData.required ? "*" : ""}`}></PoppinsTextMedium>
    {loading == false && <ActivityIndicator size={40} color={ternaryThemeColor}></ActivityIndicator>}
    {uploadImageData && <Image style={{height:100,width:100,resizeMode:'contain',marginTop:20}} source={{uri:uploadImageData?.body?.fileLink}}></Image>}
   {!showButton && <ActivityIndicator size={40} color={ternaryThemeColor}></ActivityIndicator>}
   {showButton && <TouchableOpacity onPress={async()=>{
        setCapturePressed(true)
       setTimeout(() => {
        captureImage()
        setCapturePressed(false)
       }, 2000);
       
    }} style={{height:40,width:100,alignItems:'center',justifyContent:'center',borderRadius:10,backgroundColor:capturePressed ? "#DDDDDD":ternaryThemeColor,marginTop:10}}>
        <PoppinsTextMedium content={uploadImageData ? "Recapture":"Capture"} style={{color:'white', fontSize:18}}></PoppinsTextMedium>
    </TouchableOpacity>}
    
    </View>
  );
};

const styles = StyleSheet.create({});

export default CameraInputWithUpload;
