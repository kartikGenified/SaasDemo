import React from 'react';
import {View, StyleSheet} from 'react-native';

const Dot = (props) => {
    const primaryColor = props.primaryColor
    const secondaryColor = props.secondaryColor
    const selected = props.selected

    return (
        <View style={{...styles.componentStyle,backgroundColor:selected ? secondaryColor : primaryColor,}}>
            
        </View>
    );
}

const styles = StyleSheet.create({
    componentStyle:{height:10,width:10,borderRadius:5, margin:2,borderWidth:0.2,borderColor:'grey' }
})

export default Dot;
