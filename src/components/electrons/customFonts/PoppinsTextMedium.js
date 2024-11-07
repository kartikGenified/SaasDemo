import React from 'react';
import {View, StyleSheet,Text} from 'react-native';

const PoppinsTextMedium = (props) => {

    const content=props.content 
    const style = props.style
    return (
        <Text style={{...style,fontFamily:'Poppins-medium',textAlign:"center"}}>
            {content}
        </Text>
    );
}

const styles = StyleSheet.create({})

export default PoppinsTextMedium;
