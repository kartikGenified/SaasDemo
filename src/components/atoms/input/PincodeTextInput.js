import React,{useState,useEffect} from 'react';
import {View, StyleSheet,TextInput,Keyboard} from 'react-native';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';
import { useTranslation } from 'react-i18next';

const PincodeTextInput = (props) => {
    const [value,setValue] = useState(props.value)
    const [maxLength, setMaxLength] = useState(props.maxLength ? props.maxLength : 100)
    const [keyboardShow, setKeyboardShow] = useState(false)

    let displayText =props.placeHolder

    if(displayText == "pincode" || displayText == "Pincode"){
        displayText = "Pincode"
    }
    console.log("pinnn", displayText)
   
    const required = props.required ===undefined ? props.jsonData.required : props.required
    const {t} = useTranslation()

    const placeHolder = props.placeHolder
    const label = t(props.label)
    const shouldReturnValue = props.shouldReturnValue
    Keyboard.addListener('keyboardDidShow',()=>{
        setKeyboardShow(true)
    })
    Keyboard.addListener('keyboardDidHide',()=>{
        setKeyboardShow(false)
    })

    useEffect(()=>{
    setValue(props.value)
    if(props?.value?.length  == 6)
    {
        handleInput(props.value)
    }
    },[props.value])

    useEffect(()=>{
    handleInputEnd()
    },[keyboardShow])

    const handleInput=(text)=>{
        setValue(text)
        console.log(maxLength,text)
        if(text.length===6 )
        {
        props.handleFetchPincode(text)
        let tempJsonData ={...props.jsonData,"value":text}
        console.log(tempJsonData)
        if(shouldReturnValue)
        props.handleData(value, placeHolder)
        else
        props.handleData(tempJsonData)

        }
        // props.handleData(value)
       
    }
    
    const handleInputEnd=()=>{
        let tempJsonData ={...props.jsonData,"value":value}
        console.log(tempJsonData)
        if(shouldReturnValue)
        props.handleData(value, placeHolder)
        else
        props.handleData(tempJsonData)
    }

    return (
        <View style={{height:60,width:'86%',borderWidth:1,borderColor:'#DDDDDD',alignItems:"center",justifyContent:"center",backgroundColor:'white',margin:10}}>
            <View style={{alignItems:"center",justifyContent:'center',backgroundColor:'white',position:"absolute",top:-15,left:16}}>
                <PoppinsTextMedium style={{color:"#919191",padding:4,fontSize:18}} content = {t(displayText)}></PoppinsTextMedium>
            </View>
            <TextInput keyboardType='numeric' maxLength={maxLength} onSubmitEditing={(text)=>{handleInputEnd()}} onEndEditing={(text)=>{handleInputEnd()}} style={{height:50,width:'100%',alignItems:"center",justifyContent:"flex-start",fontWeight:'500',marginLeft:24,color:'black',fontSize:16}}    placeholderTextColor="#D3D3D3" onChangeText={(text)=>{handleInput(text)}} value={value} placeholder={required ? `${label} *` : `${label}`}></TextInput>
        </View>
    );
}

const styles = StyleSheet.create({})

export default PincodeTextInput;
