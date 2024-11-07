import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const FlipAnimation = ({ direction, duration, comp: Component, style, ...props }) => {
    const flipAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animatedLoop = Animated.loop(
            Animated.timing(flipAnimation, {
                toValue: 1,
                duration: duration || 3000,
                useNativeDriver: true,
            })
        );

        animatedLoop.start();

        return () => animatedLoop.stop();
    }, [flipAnimation, duration]);

    const interpolateFlipping = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const transformStyle = () => {
        if (direction === 'horizontal') {
            return { transform: [{ rotateY: interpolateFlipping }] };
        } else if (direction === 'vertical') {
            return { transform: [{ rotateX: interpolateFlipping }] };
        }
        return {};
    };

    return (
        <View style={style} {...props}>
            <Animated.View style={[styles.container, transformStyle()]}>
                <Component />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        perspective: 1000,
    },
});

export default FlipAnimation;
