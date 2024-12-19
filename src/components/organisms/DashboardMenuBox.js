import React from 'react';
import {View, StyleSheet,ScrollView,Dimensions,Platform} from 'react-native';
import MenuItems from '../atoms/MenuItems';
import { BaseUrl } from '../../utils/BaseUrl';
import QrCodeScanner from '../../screens/camera/QrCodeScanner';
import { useSelector } from 'react-redux';

const DashboardMenuBox=(props)=>{
    const data = props?.data
    const navigation = props.navigation
    const width = Dimensions.get('window').width
    const requiresLocation = props.requiresLocation
    const handleMenuItemPress=(data)=>{
        if(data.substring(0,4).toLowerCase()==="scan" )
        {
           Platform.OS == 'android' ? navigation.navigate('EnableCameraScreen') : requiresLocation ? navigation.navigate('EnableLocationScreen',{navigateTo:"QrCodeScanner"}) : navigation.navigate("QrCodeScanner")
        }
        else if(data.toLowerCase()==="passbook")
        {
            navigation.navigate("Passbook")
        }
        else if(data.toLowerCase() === "rewards"){
            navigation.navigate('RedeemRewardHistory')
        }
        else if(data.toLowerCase() === "profile"){
            navigation.navigate('Profile')
        }
        else if (data.toLowerCase() === "query list") {
            navigation.navigate('QueryList')
          }
        else if(data.toLowerCase() === "warranty list"){
            navigation.navigate('WarrantyHistory')
        }
        else if(data.toLowerCase() === "faqs" || data.toLowerCase() === "faq" ){
            navigation.navigate('FAQ')
        }
        else if(data.toLowerCase() === "scheme"){
            navigation.navigate("EnableLocationScreen",{navigateTo:"Scheme"})
        }
        else if(data.toLowerCase() === "bank details" || data.toLowerCase() === "bank account"){
            navigation.navigate('BankAccounts')
        }
        else if(data.toLowerCase().substring(0,5) === "check"){
            if(data?.toLowerCase().split(" ")[1]==="genuinity")
            navigation.navigate('ScanAndRedirectToGenuinity')

            else if(data?.toLowerCase().split(" ")[1]==="warranty")
            navigation.navigate('ScanAndRedirectToWarranty')
        }
        else if(data?.toLowerCase().substring(0,8) === "activate"){
            if(data?.toLowerCase().split(" ")[1]==="genuinity")
            navigation.navigate('ScanAndRedirectToGenuinity')
            else if(data?.toLowerCase().split(" ")[1]==="warranty")
            navigation.navigate('ScanAndRedirectToWarranty')
        }
        else if(data.toLowerCase() === "product catalogue"){
            navigation.navigate('ProductCatalogue')
        }
        else if(data.toLowerCase() === "add user"){
            navigation.navigate('ListUsers')
        }
        else if(data.toLowerCase() === "customer support" || data.toLowerCase() === "help and support"){
            navigation.navigate('HelpAndSupport')
        }
        else if(data.toLowerCase() === "report an issue"){
            navigation.navigate('QueryList')
        }
    }

    return(
        <View style={{borderColor:'#DDDDDD',borderRadius:20,borderWidth:1.2,width:width-20,alignItems:"center",justifyContent:"center",backgroundColor:'white',padding:4,marginBottom:30}}>
        <View style={{width:'100%',flexWrap:"wrap",flexDirection:"row",alignItems:"center",justifyContent:'center'}}>
        {
            data.map((item,index)=>{
                return(
                   
                    <MenuItems handlePress={handleMenuItemPress} index ={index} key={index} image={item?.icon} content={item?.name}></MenuItems>
                   
                )
            })
            
        }
        </View>
        </View>
    )
}

export default DashboardMenuBox;
