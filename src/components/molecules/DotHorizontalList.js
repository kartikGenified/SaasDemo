import React from 'react';
import {View, StyleSheet} from 'react-native';
import Dot from '../atoms/Dot';
const DotHorizontalList = (props) => {
    const no = props.no
    const primaryColor = props.primaryColor
    const secondaryColor = props.secondaryColor
    const selectedNo = props.selectedNo
    const uselessArray=[]
    for(var i =0; i<no; i++)
    {
        uselessArray.push('*')
    }
    return (
        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
            {uselessArray.map((item,index)=>{

                return(
                    <Dot key = {index} primaryColor = {primaryColor} secondaryColor = {secondaryColor} selected = {index<=selectedNo} ></Dot>
                )
            })}
        </View>
    );
}

const styles = StyleSheet.create({})

export default DotHorizontalList;
