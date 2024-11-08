import React, { useEffect, useState } from 'react';
import {View, StyleSheet,TouchableOpacity,Image,ScrollView, Dimensions, Linking,Modal,Text} from 'react-native';
import { useSelector } from 'react-redux';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useGetAppGalleryMutation } from '../../apiServices/imageGallery/ImageGalleryApi';
import * as Keychain from 'react-native-keychain';
import moment from 'moment';
import Cancel from 'react-native-vector-icons/MaterialIcons'
import Left from 'react-native-vector-icons/AntDesign'
import Right from 'react-native-vector-icons/AntDesign'
import FastImage from 'react-native-fast-image';
import DataNotFound from '../data not found/DataNotFound';
import { useTranslation } from 'react-i18next';

const ImageGallery = ({navigation}) => {
  const [imageData, setImageData] = useState({})
  const gifUri = Image.resolveAssetSource(
    require("../../../assets/gif/loader2.gif")
  ).uri;
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
    const height = Dimensions.get('window').height

    const {t} = useTranslation()

    const [appGalleryFun, {
      data:appGalleryData, 
      error:appGalleryError,
      isLoading:appGalleryIsLoading,
      isError:appGalleryIsError
    }] = useGetAppGalleryMutation()

    useEffect(()=>{
      const getToken=async()=>{
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log(
            'Credentials successfully loaded for user ' + credentials.username
          );
          const token = credentials.username
          appGalleryFun(token)
        }
      }
      getToken()
     
     
    },[])

    useEffect(()=>{
      if(appGalleryData)
      {
        console.log("appGalleryData",JSON.stringify(appGalleryData))
        if(appGalleryData.success)
        {
            setImageData(Object.values(appGalleryData.body))
        }
        console.log("appGalleryDataimage",imageData)

      }
      else if(appGalleryError)
      {
        console.log("appGalleryError",appGalleryError)
      }
    },[appGalleryData,appGalleryError])


    const DateFilter=()=>{
        return(
            <View style={{flexDirection:"row"}}></View>
        )
    }

  const ImageComp=(props)=>{
    const [modalVisible, setModalVisible] = useState(false);
    const [indexImage, setIndexImage] = useState(0)
    const images = props.image
    const title = props.title
    const type = props.type
    const date = props.date
    console.log(indexImage)
    return(
      <TouchableOpacity onPress={()=>{setModalVisible(true)}} style={{height:180,width:'42%',borderRadius:20,backgroundColor:'white',elevation:10,margin:10,alignItems:'center',justifyContent:'flex-end',borderColor:"#DDDDDD",borderWidth:1}}>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={{position:"absolute",left:4}} onPress={()=>{if(indexImage>0){
setIndexImage(indexImage-1)
            }}}>
            <Left name = "caretleft" size={30} color={ternaryThemeColor} ></Left>

            </TouchableOpacity>
          <Image style={{height:'96%',width:'96%',resizeMode:'contain'}} source={{uri:images[indexImage]}}></Image>
          <TouchableOpacity style={{position:'absolute',right:4}} onPress={()=>{if(images.length-1>indexImage){
setIndexImage(indexImage +1)
          }}}>
          <Right name ="caretright" size={30} color={ternaryThemeColor} ></Right>
          </TouchableOpacity>
          <TouchableOpacity style={{position:"absolute",right:4,top:4}} onPress={()=>{setModalVisible(false)}}>
          <Cancel name="cancel" size={30} color="red" ></Cancel>
          </TouchableOpacity>
           
          </View>
        </View>
      </Modal>
       <View style={{width:'100%',backgroundColor:"#DDDDDD",alignItems:"center",justifyContent:'center',height:'100%',borderRadius:20}}>
        <Image style={{height:"100%",width:"100%",borderRadius:20}} source={{uri:images[indexImage]}}></Image>
       
       </View>
        {/* <View style={{backgroundColor:'black',width:'100%',alignItems:'flex-start',height:'50%',justifyContent:"center"}}>
        <PoppinsTextMedium style={{color:'white',fontSize:13,marginLeft:8}} content = {`Title : ${title}`}></PoppinsTextMedium>
        <PoppinsTextMedium style={{color:'white',fontSize:13,marginLeft:8}} content = {`Type : ${type}`}></PoppinsTextMedium>
        <PoppinsTextMedium style={{color:'white',fontSize:13,marginBottom:6,marginLeft:8}} content = {`Date : ${moment(date).format("DD MMM YYYY")}`}></PoppinsTextMedium>
        
        </View> */}
      
      </TouchableOpacity>
    )
  }

    return (
        <View
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: ternaryThemeColor,
        height: '100%',
      }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          width: '100%',
          marginTop: 10,
          height: '4%',
          marginLeft: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
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
        <PoppinsTextMedium
          content={t("Image Gallery")}
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
          }}></PoppinsTextMedium>
      </View>
      <ScrollView style={{width:'100%',height:'90%'}}>

      
      <View
        style={{
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          backgroundColor: 'white',
          minHeight:height-50,
          marginTop: 20,
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          paddingBottom: 40,
          
          
        }}>
            <View style={{width:'100%',alignItems:"flex-start",justifyContent:'flex-start',flexDirection:'row',flexWrap:'wrap',marginTop:20}}>
            {
            Object.keys(imageData).length > 0  && imageData.map((item,index)=>{
              return(
                <ImageComp key={index} title={item.title} type={item.type} image={item.images} date={item.updated_at}></ImageComp>
              )
            })
            
         
            
         
          }
          {
           !appGalleryIsLoading && Object.keys(imageData).length == 0 && <DataNotFound></DataNotFound>
          
          }
         
         
          
            </View>
          
            <View style={{alignItems:'center',justifyContent:'center'}}>
          {
            appGalleryIsLoading &&  <FastImage
            style={{ width: 100, height: 100, alignSelf: 'center', marginTop: '50%' }}
            source={{
              uri: gifUri, // Update the path to your GIF
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          }
          </View>
            
        </View>
        </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
     
      backgroundColor: 'rgba(52, 52, 52, 0.8)'
    },
    modalView: {
      margin: 10,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 24,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      height:500,
      width:'90%',
      flexDirection:"row",
      justifyContent:"center"
      
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
  
export default ImageGallery;