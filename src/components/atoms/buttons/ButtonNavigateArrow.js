import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import PoppinsText from "../../electrons/customFonts/PoppinsText";
import AnimatedDots from "../../animations/AnimatedDots";
import { useIsFocused } from "@react-navigation/native";

const ButtonNavigateArrow = (props) => {
  const [isClicked, setIsClicked] = useState(false)
  const backgroundColor = props.backgroundColor;
  // prop to manipulate background color of button
  const style = props.style;
  const isChecked = props.isChecked;
  const isLoading = props.isLoading

  // prop to navigate to another page
  const content = props.content;

  console.log(props.success);

  const focus = useIsFocused()

  useEffect(()=>{

  },[focus])



  const handleButtonPress = () => {
    if (!isClicked) {
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
      disabled={props.isLoading}
      onPress={() => {
        handleButtonPress();
      }}
      style={{
        padding: 14,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isChecked ? backgroundColor : "#808080",
        margin: 10,
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: "row",
        width: "60%",
      }}
    >
      {
        isLoading ?
          <AnimatedDots color={'white'} /> :
          <PoppinsText style={style} content={content}></PoppinsText>

      }


      <Image
        style={{ height: 20, width: 20, resizeMode: "contain", marginLeft: 20 }}
        source={require("../../../../assets/images/whiteArrowRight.png")}
      ></Image>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default ButtonNavigateArrow;