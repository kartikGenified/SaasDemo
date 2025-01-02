
import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const ShakeViewAnimations = (props) => {
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(shakeAnimation, { toValue: 6, duration: 1000, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: -6, duration: 1000, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 1000, useNativeDriver: true }),
      Animated.timing(shakeAnimation, { toValue: 0, duration: 1000, useNativeDriver: true })
    ]).start();
  }, [shakeAnimation]);

  const interpolateRotating = shakeAnimation.interpolate({
    inputRange: [-6, 6],
    outputRange: ['-6deg', '6deg']
  });

  return (
    <Animated.View style={{ transform: [{ rotate: interpolateRotating }], ...props.style }}>
      {<props.comp />}
    </Animated.View>
  );
}

const styles = StyleSheet.create({});

export default ShakeViewAnimations;

