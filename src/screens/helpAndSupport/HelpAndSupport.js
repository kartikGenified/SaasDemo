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
  Text,
  Linking,
} from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import * as Keychain from 'react-native-keychain';
import {useSelector} from 'react-redux';
import { useTranslation } from 'react-i18next';

const HelpAndSupport = ({navigation}) => {
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';

    const {t} = useTranslation()

  const supportMobile = useSelector(state=>state.apptheme.customerSupportMobile)
  const supportMail = useSelector(state=>state.apptheme.customerSupportMail)
  console.log(supportMail,supportMobile)
    return (
        <View
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: "white",
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
          content={t("Help And Support")}
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '700',
            color: 'black',
          }}></PoppinsTextMedium>
      </View>
            <View style={{alignItems:'center',justifyContent:'center',width:'100%',height:'40%'}}>
              <Image style={{height:300,width:300,resizeMode:"contain"}} source={require('../../../assets/images/customerSupportnew.png')}></Image>
            </View>
          <View style={{width:'100%',borderTopRightRadius:30,borderTopLeftRadius:30,backgroundColor:ternaryThemeColor,alignItems:'center',justifyContent:'flex-start',height:'60%'}}>
            <TouchableOpacity onPress={()=>{Linking.openURL(`mailto:${supportMail}`)}} style={{width:'90%',alignItems:'center',justifyContent:'center',paddingBottom:20,borderBottomWidth:1,borderColor:'#DDDDDD',marginTop:10}}>
              <View style={{height:60,width:60,borderRadius:30,alignItems:"center",justifyContent:"center"}}>
                <Image style={{height:40,width:40,resizeMode:"contain"}} source={require('../../../assets/images/whitemail.png')}></Image>
              </View>
              <PoppinsTextMedium
          content={t("Mail us")}
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
          }}></PoppinsTextMedium>
          <PoppinsTextMedium
          content={supportMail}
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
          }}></PoppinsTextMedium>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{Linking.openURL(`tel:${supportMobile}`)}} style={{width:'90%',alignItems:'center',justifyContent:'center',paddingBottom:20,borderBottomWidth:1,borderColor:'#DDDDDD',marginTop:10}}>
              <View style={{height:60,width:60,borderRadius:30,alignItems:"center",justifyContent:"center"}}>
                <Image style={{height:40,width:40,resizeMode:"contain"}} source={require('../../../assets/images/whitemobile.png')}></Image>
              </View>
              <PoppinsTextMedium
          content={t("Call us")}
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
          }}></PoppinsTextMedium>
          <PoppinsTextMedium
          content={supportMobile}
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
          }}></PoppinsTextMedium>
            </TouchableOpacity>
          </View>
        </View>
    );
}

const styles = StyleSheet.create({})

export default HelpAndSupport;