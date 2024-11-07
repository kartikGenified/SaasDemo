import React,{useState,useEffect} from 'react';
import {View, StyleSheet,TextInput} from 'react-native';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';

const TextInputRectangleMandatory = (props) => {
    const [value,setValue] = useState(props.value)
    const [maxLength, setMaxLength] = useState(props.maxLength ? props.maxLength : 100)
    const placeHolder = props.placeHolder
    const required = props.required ===undefined ? props.jsonData.required : props.required

   useEffect(()=>{
    let tempJsonData ={...props.jsonData,"value":props.value}
        console.log(tempJsonData)
        props.handleData(tempJsonData)
   },[props.value])

    useEffect(()=>{
        if(placeHolder.toLowerCase()==="aadhar")
        {
            setMaxLength(12)
        }
        else if(placeHolder.toLowerCase() ==="pan")
        {
            setMaxLength(10)
        }
        else if(placeHolder.toLowerCase() === "mobile")
        {
            setMaxLength(10)
        }
    },[])

    const handleInput=(text)=>{
        setValue(text)
        // props.handleData(value)
       
    }
    
    const handleInputEnd=()=>{
        let tempJsonData ={...props.jsonData,"value":value}
        console.log(tempJsonData)
        props.handleData(tempJsonData)
    }

    return (
        <View style={{height:60,width:'86%',borderWidth:1,borderColor:'#DDDDDD',alignItems:"center",justifyContent:"center",backgroundColor:'white',margin:10}}>
            <View style={{alignItems:"center",justifyContent:'center',backgroundColor:'white',position:"absolute",top:-15,left:16}}>
                <PoppinsTextMedium style={{color:"black",padding:4,fontSize:16}} content = {placeHolder}></PoppinsTextMedium>
            </View>
            <TextInput maxLength={maxLength} onSubmitEditing={(text)=>{handleInputEnd()}} onEndEditing={(text)=>{handleInputEnd()}} style={{height:50,width:'100%',alignItems:"center",justifyContent:"flex-start",fontWeight:'500',marginLeft:24,color:'black',fontSize:14}} placeholderTextColor="grey" onChangeText={(text)=>{handleInput(text)}} value={value} placeholder={required ? `${placeHolder} *` : `${placeHolder}`}></TextInput>
        </View>
    );
}

const styles = StyleSheet.create({})

export default TextInputRectangleMandatory;
