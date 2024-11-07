import React from 'react';
import {View, StyleSheet,Text} from 'react-native';

const PoppinsText = (props) => {

    const content=props.content 
    const style = props.style
    return (
        <Text style={{...style,fontFamily:'Poppins-Bold'}}>
            {content}
        </Text>
    );
}

const styles = StyleSheet.create({})

export default PoppinsText;
