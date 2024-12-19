import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import { useSelector } from "react-redux";
import { useFetchAllPushNotificationDumpListByAppUserIdMutation } from "../../apiServices/pushNotification/fetchAllPushNotificationDumpListByAppUserId";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import HyperlinkText from "../../components/electrons/customFonts/HyperlinkText";
import DataNotFound from "../data not found/DataNotFound";
import { useTranslation } from "react-i18next";

const Notification = ({ navigation }) => {

    const [getNotiFunc, {
        data: notifData,
        error: notifError,
        isLoading: isNotifLoading,
        isError: isNotifError
    }] = useFetchAllPushNotificationDumpListByAppUserIdMutation()

    const userData = useSelector(state => state.appusersdata.userData)

    console.log("userData", userData)

    const {t} = useTranslation()


    useEffect(() => {
        const data = {
            app_user_id: userData?.id,
            limit: 50,
            offset: 0,
            token: userData?.token
        }
        getNotiFunc(data);
    }, [])

    useEffect(() => {
        if (notifData) {
            console.log("notifdata", notifData)
        } else {

        }
    }, [notifData, notifError])

    const buttonThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : '#ef6110';
    const height = Dimensions.get('window').height

    const Notificationbar = (props) => {
        console.log("Notificationbar",props.notification)
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center',borderBottomWidth:1,width:'90%',borderColor:'#DDDDDD' }}>
                <View style={{ height: 40, width: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: "#FFE7E7", marginLeft: 20 }}>
                    <Image style={{ width: 20, height: 20 }} source={require('../../../assets/images/noti-small.png')}></Image>
                </View>

                <View style={{ width: '80%', margin: 10,padding:10 }}>
                    <Text style={{ fontWeight: '600', color: 'black' }}>{props.notification}</Text>
                    {/* <Text style={{ color: 'black' }}>{props?.subtitle}</Text> */}
                    {/* <PoppinsTextLeftMedium style={{color:'black', }} content={props?.body}></PoppinsTextLeftMedium> */}
                    <HyperlinkText text={props?.body} />
                </View>
            </View>
        )
    }

    return (
       <View style={{width:'100%',alignItems:'flex-start',justifyContent:'center',backgroundColor: buttonThemeColor }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginLeft: 10,height:'10%' }}>
                <TouchableOpacity onPress={() => {
                    console.log("hello")
                    navigation.goBack()
                }}>
                    <Image style={{ height: 30, width: 30, resizeMode: 'contain', marginRight: 8 }} source={require('../../../assets/images/blackBack.png')}></Image>
                </TouchableOpacity>
                <Text style={{ color: 'white', marginLeft: 10, fontWeight: '500' }}>{t("Notification")}</Text>
            </View>
            <ScrollView style={{ height: '90%', backgroundColor: buttonThemeColor, width:'100%' }}>
            
            <View style={{ paddingBottom: 120, height: height, backgroundColor: 'white', width: '100%', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: 20,alignItems:'center',justifyContent:'center' }}>
                {
                    notifData?.body?.data?.map((item, index) => {
                        return <Notificationbar notification={item?.title} body={item?.body} key={index} ></Notificationbar>

                    })
                }
                 {
                  notifData?.body?.count == "0"  &&
                     <View style={{height:'100%', backgroundColor:'white', }}>
                     <DataNotFound></DataNotFound>
                     </View>

                }
            </View>
        </ScrollView>
       </View>


    )
}

export default Notification