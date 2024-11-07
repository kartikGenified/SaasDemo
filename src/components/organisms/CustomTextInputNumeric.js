
import React, { useState } from 'react';
import {View, StyleSheet,TextInput,Image} from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';

const CustomTextInputNumeric = (props) => {
    const [content, setContent] = useState('')
    const title = props.title
    const image = props.image

    const handleData=(val)=>{
        setContent(val)
        props.sendData(val)
    }

    return (
        <View style={{width:'80%',height:80,marginTop:10,marginBottom:10,alignItems:'flex-start'}}>
        <PoppinsTextMedium style={{color:'white',fontSize:20,fontWeight:'500'}} content={title}></PoppinsTextMedium>
        <View style={{borderBottomWidth:1.4,borderColor:'white',flexDirection:"row",width:"100%"}}>
        <TextInput keyboardType='number-pad' placeholderTextColor='white' onChangeText={(val)=>{handleData(val)}} value={content} style={{width:'80%',height:50,color:'white',fontSize:16}}></TextInput>
        <View style={{alignItems:"center",justifyContent:"center",width:'20%'}}>
        <Image source={image} style={{height:22,width:22,resizeMode:"contain"}}></Image>

        </View>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({})

export default CustomTextInputNumeric;
