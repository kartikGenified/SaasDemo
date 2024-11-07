import React,{useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import PoppinsText from '../../electrons/customFonts/PoppinsText';
import {useNavigation} from '@react-navigation/native';
import { useSelector } from 'react-redux';

const ButtonRectangle = props => {
  const [isClicked, setIsClicked] = useState(false)
  const navigation = useNavigation();
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const backgroundColor = props.backgroundColor ? props.backgroundColor : ternaryThemeColor
  // prop to manipulate background color of button
  const style = props.style;
  // prop to manipulate text color of button
  const navigateTo = props.navigateTo;
  // prop to navigate to another page
  const content = props.content;
  // prop to display text inside the button
  
  const handleButtonPress = () => {
    if(!isClicked){
      props.handleOperation();
      setIsClicked(true);
    }
   setTimeout(() => {
    setIsClicked(false);
   }, 1000);
    console.log("buttonpressed");
  };

  

  return (
    <TouchableOpacity
      onPress={() => {
       handleButtonPress()
      }}
      style={{
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: backgroundColor,
        margin: 10,
        paddingLeft: 60,
        paddingRight: 60,
        borderRadius:2
      }}>
      <PoppinsText style={style} content={content}></PoppinsText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default ButtonRectangle;
