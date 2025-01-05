import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  TextInput,
} from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import {useSelector} from 'react-redux';
import ButtonNavigate from '../../components/atoms/buttons/ButtonNavigate';
import moment from 'moment';
import Clipboard from '@react-native-clipboard/clipboard';
import { useTranslation } from 'react-i18next';

const CouponDetails = ({navigation,route}) => {
    const [copiedText, setCopiedText] = useState('');

  
    const data = route.params.data
    const approvalStatus = data.approval_status
    const couponTitle = data.brand_product_code;
  const validDate = moment(data.expire_date).format("DD MMM YYYY");
  const couponCode = data.brand_product_code
  const {t} = useTranslation()
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
    console.log(data)

    const copyToClipboard = () => {
        Clipboard.setString(couponCode);
      };


      console.log("Coupon Code data",data)
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%',
      }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          width: '100%',
          marginTop: 10,
          height: 40,
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
          content="Coupon Details"
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '600',
            color: '#171717',
          }}></PoppinsTextMedium>
        {/* <TouchableOpacity style={{marginLeft: 160}}>
          <Image
            style={{height: 30, width: 30, resizeMode: 'contain'}}
            source={require('../../../assets/images/notificationOn.png')}></Image>
        </TouchableOpacity> */}
      </View>
      <View
        style={{alignItems: 'center', justifyContent: 'center', width: '100%'}}>
        <ImageBackground
          source={require('../../../assets/images/celebrationBackground.png')}
          style={{
            height: 300,
            width: '90%',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
          resizeMode="contain">
          <Image
            style={{height: 140, width: 140, resizeMode: 'contain'}}
            source={require('../../../assets/images/voucher1.png')}></Image>
          <PoppinsTextMedium
            style={{color: 'black', fontSize: 24, fontWeight: '700'}}
            content={couponTitle}></PoppinsTextMedium>
          
        </ImageBackground>

        {/* coupon -------------------------------------- */}
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <PoppinsTextMedium
            style={{
              color: '#353535',
              fontSize: 20,
              fontWeight: '700',
              marginTop: 10,
            }}
            content="Brand Name"></PoppinsTextMedium>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              width:'90%',
              marginTop:20
            }}>
            <View style={{height:60,width:'65%',borderWidth:1,borderStyle:'dashed',borderColor:ternaryThemeColor,alignItems:"center",justifyContent:"center"}}>
           <PoppinsTextMedium style={{color:'#353535',fontSize:20,fontWeight:'700'}} content={approvalStatus == "2" ? couponCode: "---------"}></PoppinsTextMedium>
            </View>
            <TouchableOpacity onPress={()=>{
                copyToClipboard()
            }} style={{height:60,width:'35%',backgroundColor:ternaryThemeColor,alignItems:"center",justifyContent:"center"}}>
                <PoppinsTextMedium style={{color:'white',fontSize:20,fontWeight:'700'}} content ="Copy"></PoppinsTextMedium>
            </TouchableOpacity>
          </View>
        </View>
        {/* ----------------------------------------- */}
        {/* <View style={{alignItems:"center",justifyContent:'center',marginTop:20}}>
            <PoppinsTextMedium style={{color:'black',fontSize:18}} content ="How to use"></PoppinsTextMedium>
            <PoppinsTextMedium style={{color:ternaryThemeColor,fontSize:18,textDecorationLine: 'underline'}} content ="Term & Condition"></PoppinsTextMedium>
            
        </View> */}
        
      </View>
      <View style={{alignItems:"center",justifyContent:"center",marginTop:20,position:"absolute",bottom:10,borderTopWidth:1,borderColor:'#DDDDDD',width:'90%',paddingTop:10}}>
      <PoppinsTextMedium style={{color:"black",fontSize:18,fontWeight:"700"}} content={t("Issue With This ?")}></PoppinsTextMedium>
      <ButtonNavigate navigateTo="SupportQueries" style={{color:"white"}}  content ={t("Click Here To Report")} backgroundColor="#D10000"></ButtonNavigate>
            
            </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default CouponDetails;
