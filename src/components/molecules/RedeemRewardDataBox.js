import React from 'react';
import {View, StyleSheet,Image,Text,TouchableOpacity} from 'react-native';
import PoppinsText from '../electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import { useNavigation } from '@react-navigation/native';
const RedeemRewardDataBox = (props) => {
    const navigation = useNavigation()
    const image = props.image
    const header = props.header
    const data=props.data
    
    const handleNavigation=()=>{
        console.log(header)
        if(header==="Cashback")
        {
            navigation.navigate("CashbackHistory")
        }
        else if(header==="Earned Points")
        {
            navigation.navigate("RedeemedHistory")
        }
        else if(header === "My Vouchers"){
            navigation.navigate("CouponHistory")
        }
        else if(header ==="Total Spins")
        {
            navigation.navigate("WheelHistory")
        }
    }

    return (
        <TouchableOpacity onPress={()=>{handleNavigation()}} style={{height:70,flexDirection:"row",alignItems:"center",justifyContent:"center",padding:10,margin:10,borderWidth:1,borderColor:'#DDDDDD',width:160,borderRadius:14,elevation:2,backgroundColor:"white"}}>
            <View style={{width:50,alignItems:"center",justifyContent:"center",height:50,borderRadius:25,borderWidth:1,borderColor:'#DDDDDD'}}>
            <Image source={image} style={{height:32,width:32,resizeMode:'contain'}}></Image>
            </View>
            <View style={{width:'70%',alignItems:"center",justifyContent:"center",marginTop:10}}>
                <Text style={{color:"black",fontSize:12,fontWeight:'400'}}>{header}</Text>
                <PoppinsText style={{fontSize:18,fontWeight:'600',color:'black'}} content={data}></PoppinsText>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({})

export default RedeemRewardDataBox;
