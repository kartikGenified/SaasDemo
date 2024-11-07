import React,{useRef,useEffect} from 'react';
import {View, StyleSheet,Animated} from 'react-native';

const AnimatedDots = (props) => {
    const color = props.color
    const moveFirstDotAnim = useRef(new Animated.Value(0)).current
    const moveSecondDotAnim = useRef(new Animated.Value(0)).current
    const moveThirdDotAnim = useRef(new Animated.Value(0)).current
    const moveFourthDotAnim = useRef(new Animated.Value(0)).current

    useEffect(()=>{
        Animated.sequence([
            Animated.timing(moveFirstDotAnim, {
                toValue: 20,
                duration: 1000,
                useNativeDriver: false,
              }),
              Animated.timing(moveFirstDotAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: false,
              })
        ]).start();

          setTimeout(() => {
            Animated.sequence([
            Animated.timing(moveSecondDotAnim, {
                toValue: 20,
                duration: 1000,
                useNativeDriver: false,
              }),
              Animated.timing(moveSecondDotAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: false,
              })
            ]).start();
          }, 200);
         
          setTimeout(() => {
            Animated.sequence([
                Animated.timing(moveThirdDotAnim, {
                    toValue: 20,
                    duration: 1000,
                    useNativeDriver: false,
                  }),
                  Animated.timing(moveThirdDotAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: false,
                  })
            ])
            .start();
          }, 400);
          
          setTimeout(() => {
            Animated.sequence([
                Animated.timing(moveFourthDotAnim, {
                    toValue: 20,
                    duration: 1000,
                    useNativeDriver: false,
                  }),
                  Animated.timing(moveFourthDotAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: false,
                  })
            ])
            .start();
          }, 600);
         
          
    },[moveFirstDotAnim,moveSecondDotAnim,moveThirdDotAnim,moveFourthDotAnim])


    return (
       
                <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",height:10,width:100}}>
                <Animated.View style={{height:10,width:10,borderRadius:5,backgroundColor:color,margin:4,marginTop:moveFirstDotAnim}}></Animated.View>
                <Animated.View style={{height:10,width:10,borderRadius:5,backgroundColor:color,margin:4,marginTop:moveSecondDotAnim}}></Animated.View>
                <Animated.View style={{height:10,width:10,borderRadius:5,backgroundColor:color,margin:4,marginTop:moveThirdDotAnim}}></Animated.View>
                <Animated.View style={{height:10,width:10,borderRadius:5,backgroundColor:color,margin:4,marginTop:moveFourthDotAnim}}></Animated.View>
            </View>
            
    );
}

const styles = StyleSheet.create({})

export default AnimatedDots;
