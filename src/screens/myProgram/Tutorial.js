import React, { useEffect, useState } from 'react';
import {View, StyleSheet,TouchableOpacity,Image,ScrollView, Dimensions, Linking} from 'react-native';
import Video from 'react-native-video';
import { useSelector } from 'react-redux';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useGetAppVideoMutation } from '../../apiServices/video/VideoApi';
import * as Keychain from 'react-native-keychain';
import Logo from 'react-native-vector-icons/AntDesign'
import moment from 'moment';
import FastImage from 'react-native-fast-image';

const Tutorial = ({navigation}) => {
  const [videoData, setVideoData] = useState()
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
    const height = Dimensions.get('window').height

    const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loader.gif')).uri;


    const [appVideoFunc, {
      data:appVideoData, 
      error:appVideoError,
      isLoading:appVideoIsLoading,
      isError:appVideoIsError
    }] = useGetAppVideoMutation()

    useEffect(()=>{
      const getToken=async()=>{
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log(
            'Credentials successfully loaded for user ' + credentials.username
          );
          const token = credentials.username
          let parmas = {
            token:token,
            type:"tutorial"
          }
          appVideoFunc(parmas)
        }
      }
      getToken()
     
     
    },[])

    useEffect(()=>{
      if(appVideoData)
      {
        console.log("appVideoData",appVideoData)
        setVideoData(appVideoData.body)
      }
      else if(appVideoError)
      {
        console.log("appVideoError",appVideoError)
      }
    },[appVideoData,appVideoError])

  const VideoComp=(props)=>{
    const video = props.video
    const title = props.title
    const type = props.type
    const date = props.date
    return(
      <TouchableOpacity onPress={()=>{Linking.openURL(video)}} style={{height:180,width:'40%',borderRadius:10,backgroundColor:'white',elevation:10,margin:20,alignItems:'center',justifyContent:'flex-end'}}>
       <View style={{width:'100%',backgroundColor:"#DDDDDD",alignItems:"center",justifyContent:'center',height:'50%'}}>
        <Logo name="youtube" size={60} color="red"></Logo>
       </View>

        <View style={{backgroundColor:'black',width:'100%',alignItems:'flex-start',height:'50%',justifyContent:"center"}}>
        <PoppinsTextMedium style={{color:'white',fontSize:13,marginLeft:8}} content = {`Title : ${title.substring(0,16)}`}></PoppinsTextMedium>
        <PoppinsTextMedium style={{color:'white',fontSize:13,marginLeft:8}} content = {`Type : ${type}`}></PoppinsTextMedium>
        <PoppinsTextMedium style={{color:'white',fontSize:13,marginBottom:6,marginLeft:8}} content = {`Date : ${moment(date).format("DD MMM YYYY")}`}></PoppinsTextMedium>
        
        </View>
      
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
          height: '10%',
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
          content="Video"
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
          minHeight:height-100,
          marginTop: 10,
          alignItems: 'flex-start',
          // justifyContent: 'center',
          width: '100%',
          paddingBottom: 40,
          flexDirection:"row",
          flexWrap:'wrap'

        }}>
          {
            videoData && videoData.map((item,index)=>{
              return(
                <VideoComp key ={index} title={item.title} type={item.type} video={item.link} date={item.updated_at}></VideoComp>
              )
            })
          }

{appVideoIsLoading &&
              <FastImage
                   style={{ width: 50, height: "10%", marginTop:'70%', marginLeft:'40%' }}
                   source={{
                       uri: gifUri, // Update the path to your GIF
                       priority: FastImage.priority.normal,
                   }}
                   resizeMode={FastImage.resizeMode.contain}
               />
          }

          
            
            
        </View>
        </ScrollView>
      
        </View>

    );
}


export default Tutorial;