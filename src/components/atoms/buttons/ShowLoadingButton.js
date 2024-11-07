import React, { useEffect, useState } from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import { useSelector } from 'react-redux';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';

const ShowLoadingButton = (props) => {
    const [showLoading, setShowLoading] = useState(false)
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';
    
    useEffect(()=>{
        if(showLoading)
        {
            setTimeout(() => {
                setShowLoading(false)
            }, 2000);
        }
    },[showLoading])
    const handleSubmit=()=>{
        props.handleData()
        setShowLoading(!showLoading)
    }
    const Dots=()=>{
        return(
            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",height:10,width:100}}>
            <View style={{height:10,width:10,borderRadius:5,backgroundColor:"white",margin:4}}></View>
            <View style={{height:10,width:10,borderRadius:5,backgroundColor:"white",margin:4}}></View>
            <View style={{height:10,width:10,borderRadius:5,backgroundColor:"white",margin:4}}></View>
            <View style={{height:10,width:10,borderRadius:5,backgroundColor:"white",margin:4}}></View>
        </View>
        )
        
        
    }
const title = props.title
    return (
        <TouchableOpacity onPress={()=>{
            handleSubmit()
        }} style={{alignItems:"center",justifyContent:"center",width:'90%',height:50,backgroundColor:ternaryThemeColor,margin:20,borderRadius:10}}> 
            {!showLoading && <PoppinsTextMedium style={{color:'white',fontSize:16,fontWeight:'700'}} content = {title}></PoppinsTextMedium>}
            {showLoading && <Dots></Dots>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({})

export default ShowLoadingButton;
