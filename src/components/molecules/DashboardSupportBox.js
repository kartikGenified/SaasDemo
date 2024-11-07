import React from 'react';
import {View, StyleSheet,Image,Platform, TouchableOpacity} from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import { useNavigation } from '@react-navigation/native';
const DashboardSupportBox = (props) => {
    const navigation = useNavigation()
   const image = props?.image 
   const backgroundColor = props?.backgroundColor
   const title= props.title
   const text = props?.text
   const borderColor =props?.borderColor
    const fontWeight =Platform.OS==='ios' ? '400' : '800'
    const fontSize =Platform.OS==='ios' ? 10 : 12

    // console.log("text support",text)

const handleNavigation=()=>{
    if(text==="Feedback"){
        navigation.navigate('Feedback')
    }
    else if(text ==="Rewards")
    {
        navigation.navigate('RedeemRewardHistory')
    }
    else if(text ==="Customer Support")
    {
        navigation.navigate('HelpAndSupport')
    }
}

    return (
        <TouchableOpacity onPress={()=>{handleNavigation()}}  style={{height:140,width:'28%',margin:8,borderTopLeftRadius:100,borderTopRightRadius:100,borderBottomRightRadius:10,borderBottomLeftRadius:10,backgroundColor:backgroundColor,alignItems:"center",justifyContent:"center",borderWidth:0.4,borderColor:borderColor}}>
            <View style={{height:80,width:80,borderRadius:40,backgroundColor:"white",alignItems:"center",justifyContent:"center",marginBottom:10}}>
                <Image style={{height:80,width:80,resizeMode:'contain'}} source={image}></Image>
            </View>
            <PoppinsTextMedium style={{fontSize:fontSize,fontWeight:fontWeight,color:'black'}} content={title}></PoppinsTextMedium>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({})

export default DashboardSupportBox;
