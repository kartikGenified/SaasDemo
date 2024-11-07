import React,{useRef,useEffect} from 'react';
import {View, StyleSheet,Animated} from 'react-native';
const ZoomViewAnimations = (props) => {
    
    const zoomAnimations = useRef(new Animated.Value(0)).current;
    const duration = props.duration
    const zoom = props.zoom
    useEffect(() => {
       Animated.sequence([
        Animated.timing(zoomAnimations, { toValue: zoom, duration: duration,useNativeDriver:false }).start(),
        Animated.timing(zoomAnimations, { toValue: 100, duration: duration,useNativeDriver:false }).start()


       ])
          
      }, [zoomAnimations]);

    return (
        <Animated.View style={{height:zoomAnimations,width:zoomAnimations, ...props.style}}>
            {<props.comp></props.comp>}
        </Animated.View>
    );
}

const styles = StyleSheet.create({})

export default ZoomViewAnimations;
