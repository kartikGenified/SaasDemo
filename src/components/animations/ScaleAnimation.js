//import liraries
import React, { Component, useRef } from 'react';
import { View, Text, StyleSheet, Animated, } from 'react-native';

// create a component
const ScaleAnimation = ({comp}) => {

    const scale = useRef(new Animated.Value(0)).current

    return (
        <View style={styles.container}>
            <Text>ScaleAnimation</Text>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default ScaleAnimation;
