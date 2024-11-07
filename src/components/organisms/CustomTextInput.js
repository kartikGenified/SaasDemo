import React, { useState,useEffect } from 'react';
import {View, StyleSheet,TextInput,Image} from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';

const CustomTextInput = (props) => {
    const [content, setContent] = useState('')
    const title = props.title
    const image = props.image

    useEffect(()=>{
        setContent(props.name)
    },[props.name])

    const handleData=(val)=>{
        setContent(val)
        props.sendData(val)
    }

    return (
        <View style={{width:'80%',height:80,marginTop:10,marginBottom:10,alignItems:'flex-start',borderWidth:1,borderColor:'#DDDDDD'}}>
            {/* <View style={{backgroundColor:"white",borderRadius:4,bottom:20}}> */}
        <PoppinsTextMedium style={{color:'black',fontSize:20,fontWeight:'500'}} content={title}></PoppinsTextMedium>
            {/* </View> */}
        <View style={{borderBottomWidth:1.4,borderColor:'#DDDDDD',flexDirection:"row",width:"100%"}}>
        <TextInput placeholderTextColor='black' onChangeText={(val)=>{handleData(val)}} value={content} style={{width:'80%',height:50,color:'black',fontSize:16}}></TextInput>
        <View style={{alignItems:"center",justifyContent:"center",width:'20%'}}>
        <Image source={image} style={{height:22,width:22,resizeMode:"contain"}}></Image>

        </View>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({})

export default CustomTextInput;
