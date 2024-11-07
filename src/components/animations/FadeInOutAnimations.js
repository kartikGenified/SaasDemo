import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const FadeInOutAnimations = (props) => {
  const fadeInOutAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeInOutAnimation, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(fadeInOutAnimation, { toValue: 0, duration: 1000, useNativeDriver: true }),
      Animated.timing(fadeInOutAnimation, { toValue: 1, duration: 1000, useNativeDriver: true }),

    ]).start();
  }, [fadeInOutAnimation]);

  return (
    <Animated.View style={{ opacity: fadeInOutAnimation, ...props.style }}>
      {<props.comp />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({});

export default FadeInOutAnimations;
