import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SlideAnimation = ({ direction, duration, comp: Component, distance, style, ...props }) => {
    const slideAnimation = useRef(new Animated.Value(0)).current;
    const [layout, setLayout] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (layout.width > 0 && layout.height > 0) {
            console.log("Starting animation with layout:", layout);
            Animated.timing(slideAnimation, {
                toValue: 1,
                duration: duration || 2000,
                useNativeDriver: true,
            }).start(() => {
                console.log("Animation completed with value:", slideAnimation);
            });
        }
    }, [layout, slideAnimation, duration]);

    const getOutputRange = () => {
        const defaultDistance = direction === 'left' || direction === 'right' ? layout.width : layout.height;
        const slideDistance = distance !== undefined ? distance : defaultDistance;

        switch (direction) {
            case 'left':
                return [slideDistance, 0];
            case 'right':
                return [-slideDistance, 0];
            case 'up':
                return [slideDistance, 0];
            case 'down':
                return [-slideDistance, 0];
            default:
                return [0, 0];
        }
    };

    const interpolateSliding = slideAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: getOutputRange(),
    });

    const transformStyle = () => {
        switch (direction) {
            case 'left':
            case 'right':
                return { transform: [{ translateX: interpolateSliding }] };
            case 'up':
            case 'down':
                return { transform: [{ translateY: interpolateSliding }] };
            default:
                return {};
        }
    };

    return (
        <View
            onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                if (width > 0 && height > 0) {
                    console.log(`Layout: width=${width}, height=${height}`);
                    setLayout({ width, height });
                }
            }}
            style={[style, { overflow: 'hidden' }]}
            {...props}
        >
            <Animated.View style={transformStyle()}>
                <Component />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({});

export default SlideAnimation;
