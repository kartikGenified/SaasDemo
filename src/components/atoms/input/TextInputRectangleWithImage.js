import React,{useState,useEffect} from 'react';
import {View, StyleSheet,TextInput,Image} from 'react-native';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';
const TextInputRectangleWithImage = (props) => {
    const [value,setValue] = useState()
    const placeHolder = props.placeHolder
    const image =props.image
    const required = props.required
    const handleInput=(text)=>{
        setValue(text)
       
    }
    const handleInputEnd=()=>{
        let tempJsonData ={...props.jsonData,"value":value}
        console.log(tempJsonData)
        props.handleData(tempJsonData)
    }

    return (
        <View style={{height:50,width:'86%',borderWidth:1,borderColor:'#DDDDDD',alignItems:"center",justifyContent:"center",backgroundColor:'white',margin:10}}>
            <View style={{alignItems:"center",justifyContent:'center',backgroundColor:'white',position:"absolute",top:-15,left:16}}>
                <PoppinsTextMedium style={{color:"black",padding:4}} content = {placeHolder}></PoppinsTextMedium>
            </View>
            <Image style={{height:30,width:30,resizeMode:'contain'}} source={image}></Image>
            <TextInput onEndEditing={(text)=>{handleInputEnd()}} style={{height:50,width:'90%',alignItems:"center",justifyContent:"flex-start",fontWeight:'500',marginLeft:20,color:'black'}} placeholderTextColor="grey" onChangeText={(text)=>{handleInput(text)}} value={value} placeholder={required ? `${placeHolder} *` : `${placeHolder}`}></TextInput>
        </View>
    );
}

const styles = StyleSheet.create({})

export default TextInputRectangleWithImage;
