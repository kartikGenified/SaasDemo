import GestureRecognizer from 'react-native-swipe-gestures';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import DotHorizontalList from '../molecules/DotHorizontalList';
import { useSelector } from 'react-redux';

const Banner = (props) => {
  const [showImage, setShowImage] = useState(props?.images[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newIndex = (index + 1) % props?.images?.length;
      setIndex(newIndex);
      setShowImage(props?.images[newIndex]);
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [index]);

  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const onSwipeLeft = (gestureState) => {
    const newIndex = (index + 1) % props?.images?.length;
    setIndex(newIndex);
    setShowImage(props?.images[newIndex]);
  };

  const onSwipeRight = (gestureState) => {
    const newIndex = index === 0 ? props?.images?.length - 1 : index - 1;
    setIndex(newIndex);
    setShowImage(props?.images[newIndex]);
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  return (
    <GestureRecognizer
      onSwipeLeft={(state) => onSwipeLeft(state)}
      onSwipeRight={(state) => onSwipeRight(state)}
      config={config}
      style={{
        alignItems:"center",justifyContent:"center"
      }}>
      <View style={{ height: 190, width: '90%',alignItems:"center",justifyContent:"center" }}>
        {showImage && <Image style={{ height: '100%', width: '100%',borderRadius:20,resizeMode:'contain' }} source={{ uri: showImage }} />}
        <View style={{position:"absolute",bottom:10}}>
        <DotHorizontalList no = {props.images.length} primaryColor="white" secondaryColor={ternaryThemeColor} selectedNo = {index} ></DotHorizontalList>
        </View>

      </View>
    </GestureRecognizer>
  );
}

const styles = StyleSheet.create({});

export default Banner;
