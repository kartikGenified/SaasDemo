import React from 'react';
import {View, StyleSheet} from 'react-native';
import { useSelector } from 'react-redux';
import PoppinsText from '../electrons/customFonts/PoppinsText';

const CongratulationActionBox = (props) => {
    const primaryColor=props.primaryColor
    const secondaryColor = props.secondaryColor
    const title = props.title
    const data = props.data
    return (
        <View style={{height:90,width:150,alignItems:'center',justifyContent:"center",borderRadius:10,margin:10,opacity:0.8}}>
            <View style={{height:'50%',width:'100%',backgroundColor:primaryColor,alignItems:'center',justifyContent:"center",borderTopLeftRadius:10,borderTopRightRadius:10}}>
            <PoppinsText style={{fontSize:16,color:'white',fontWeight:'800',textAlign:'center'}} content ={title}></PoppinsText></View>
            
            <View style={{height:'50%',width:'100%',backgroundColor:secondaryColor,alignItems:'center',justifyContent:"center",borderTopWidth:0.8,borderBottomRightRadius:10,borderBottomLeftRadius:10,borderColor:"white"}}>
            <PoppinsText style={{fontSize:16,color:'white',fontWeight:'800',textAlign:'center'}} content ={data}></PoppinsText>

            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({})

export default CongratulationActionBox;
