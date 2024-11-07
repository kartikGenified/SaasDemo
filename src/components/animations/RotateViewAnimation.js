import React,{useRef,useEffect} from 'react';
import {View, StyleSheet,Animated} from 'react-native';

const RotateViewAnimation = (props) => {
    
    const rotateAnimation = useRef(new Animated.Value(0)).current;
    const inputRange = props.inputRange
    const outputRange = props.outputRange
    
    useEffect(() => {
        
          Animated.sequence([
            Animated.timing(rotateAnimation, { toValue: 1, duration: 3000, useNativeDriver: true }),
            Animated.timing(rotateAnimation, { toValue: 2, duration: 3000, useNativeDriver: true }),
            Animated.timing(rotateAnimation, { toValue: 3, duration: 3000, useNativeDriver: true })
        ]).start();
      }, [rotateAnimation]);
      const interpolateRotating = rotateAnimation.interpolate({
        inputRange:inputRange ,
        outputRange:outputRange ,
      });
    return (
        <Animated.View style={{transform:[{rotate:interpolateRotating}], ...props.style}}>
            {<props.comp></props.comp>}
        </Animated.View>
    );
}

const styles = StyleSheet.create({})

export default RotateViewAnimation;
