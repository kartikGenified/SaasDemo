import React,{useState,useEffect} from 'react';
import {View, StyleSheet,TextInput,Keyboard} from 'react-native';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';

const PincodeEditProfileTextInput = (props) => {
    const [value,setValue] = useState(props.value)
    const [maxLength, setMaxLength] = useState(props.maxLength ? props.maxLength : 100)
    const [keyboardShow, setKeyboardShow] = useState(false)
   
    const required = props.required ===undefined ? props.jsonData.required : props.required

    const placeHolder = props.placeHolder
    const label = props.label
   
    Keyboard.addListener('keyboardDidShow',()=>{
        setKeyboardShow(true)
    })
    Keyboard.addListener('keyboardDidHide',()=>{
        setKeyboardShow(false)
    })
    useEffect(()=>{
        handleInputEnd()
    },[keyboardShow])

    useEffect(()=>{
        props.handleData(props.value,placeHolder)
        console.log("value textinput",props.value)
    },[props.value])
    const handleInput=(text)=>{
        setValue(text)

        if(text.length===6)
        {
            props.handleFetchPincode(text)
        //     let tempJsonData ={...props.jsonData,"value":text}
        // console.log(tempJsonData)

        props.handleData(text,placeHolder)
        }
        // props.handleData(value)
       
    }
    
    const handleInputEnd=()=>{
       
        props.handleData(value,placeHolder)
    }

    return (
        <View style={{height:60,width:'90%',borderBottomWidth:1,borderColor:'#DDDDDD',alignItems:"center",justifyContent:"center",backgroundColor:'white',marginTop:10}}>
            <View style={{alignItems:"center",justifyContent:'center',backgroundColor:'white',position:"absolute",top:-15,left:14}}>
                <PoppinsTextMedium style={{color:"#919191",fontSize:18}} content = {label}></PoppinsTextMedium>
            </View>
            <TextInput keyboardType='numeric' maxLength={maxLength} onSubmitEditing={(text)=>{handleInputEnd()}} onEndEditing={(text)=>{handleInputEnd()}} style={{height:50,width:'100%',alignItems:"center",justifyContent:"flex-start",fontWeight:'500',marginLeft:24,color:'black',fontSize:16}} placeholderTextColor="grey" onChangeText={(text)=>{handleInput(text)}} value={value} placeholder={required ? `${placeHolder} *` : `${placeHolder}`}></TextInput>
        </View>
    );
}

const styles = StyleSheet.create({})

export default PincodeEditProfileTextInput;
