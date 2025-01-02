import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Keyboard } from "react-native";
import PoppinsTextMedium from "../../electrons/customFonts/PoppinsTextMedium";
import { useTranslation } from "react-i18next";
const TextInputRectangle = (props) => {
  const [value, setValue] = useState();
  const [keyboardShow, setKeyboardShow] = useState(false);
  const {t} = useTranslation()
  const placeHolder = t(props.placeHolder);
  const label = t(props.label);
  const required = props.required ===undefined ? props.jsonData.required : props.required
console.log("asdhgasghfdghfsaghfcghvasghcghvsaghvchjvasghvchjs",placeHolder)
  Keyboard.addListener("keyboardDidShow", () => {
    setKeyboardShow(true);
  });
  Keyboard.addListener("keyboardDidHide", () => {
    setKeyboardShow(false);
  });
  useEffect(()=>{handleInputEnd()},[keyboardShow])
  const handleInput = (text) => {
    console.log(label)
    setValue(text);
  };
  const handleInputEnd = () => {
    let tempJsonData = { ...props.jsonData, value: value };
    console.log(tempJsonData);
    props.handleData(tempJsonData);
    console.log("Placeholder",placeHolder)
  };

  return (
    <View
      style={{
        height: 50,
        width: "86%",
        borderWidth: 1,
        borderColor: "#DDDDDD",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        margin: 10,
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          position: "absolute",
          top: -15,
          left: 16,
        }}
      >
        <PoppinsTextMedium
          style={{ color: "#919191", padding: 4, fontSize: 18 }}
          content={t(label)}
        ></PoppinsTextMedium>
      </View>
      <TextInput
      
        onEndEditing={(text) => {
          handleInputEnd();
        }}
        style={{
          height: 50,
          width: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
          fontWeight: "500",
          marginLeft: 20,
          color: "black",
          fontSize: 16,
        }}
        placeholderTextColor="grey"
        onChangeText={(text) => {
          handleInput(text);
        }}
        value={value}
        placeholder={required ? `${placeHolder} *` : `${placeHolder} `}
      ></TextInput>
    </View>
  );
};

const styles = StyleSheet.create({});

export default TextInputRectangle;