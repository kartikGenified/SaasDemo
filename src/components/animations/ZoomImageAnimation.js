import React,{useRef,useEffect} from 'react';
import {View, StyleSheet,Animated} from 'react-native';
const ZoomImageAnimation = (props) => {
    
    const zoomAnimations = useRef(new Animated.Value(50)).current;
    const duration = props.duration
    const zoom = props.zoom
    const image  = props.image
    useEffect(() => {
       Animated.sequence([
        Animated.timing(zoomAnimations, { toValue: zoom, duration: duration,useNativeDriver:false }).start(),
        // Animated.timing(zoomAnimations, { toValue: 100, duration: duration,useNativeDriver:false }).start()


       ])
          
      }, [zoomAnimations]);

    return (
        <Animated.Image source={image} style={{height:zoomAnimations,width:zoomAnimations, ...props.style}}>
            
        </Animated.Image>
    );
}

const styles = StyleSheet.create({})

export default ZoomImageAnimation;
