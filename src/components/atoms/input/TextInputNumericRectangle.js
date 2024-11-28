import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Keyboard } from "react-native";
import PoppinsTextMedium from "../../electrons/customFonts/PoppinsTextMedium";
import { useTranslation } from "react-i18next";
import PoppinsTextLeftMedium from "../../electrons/customFonts/PoppinsTextLeftMedium";

const TextInputNumericRectangle = (props) => {
  const [value, setValue] = useState(props.value);
  const placeHolder = props.placeHolder;
  const maxLength = props.maxLength;
  const label = props.label;
  const required =
    props.required === undefined ? props.jsonData.required : props.required;
  let displayText = props.placeHolder;

  const isEditable = props.isEditable;
  console.log("label", isEditable, displayText);

  const { t } = useTranslation();

  if (displayText == "mobile") {
    displayText = t("mobile no");
  }

  useEffect(() => {
    if (props.value !== undefined) {
      let tempJsonData = { ...props.jsonData, value: props.value };
      console.log(tempJsonData);
      props.handleData(tempJsonData);
    }

    // Add listener for keyboard dismissal
    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      handleInputEnd();
    });

    // Cleanup listener on component unmount
    return () => {
      keyboardHideListener.remove();
    };
  }, [props.value]);

  const handleInput = (text) => {
    setValue(text);
    let tempJsonData = { ...props.jsonData, value: text }; // Update value directly
    console.log(tempJsonData);
    props.handleData(tempJsonData);
  };

  const handleInputEnd = () => {
    let tempJsonData = { ...props.jsonData, value: value };
    console.log(tempJsonData);
    props.handleData(tempJsonData);
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
          content={displayText}
        ></PoppinsTextMedium>
        {/* {required && (
          <PoppinsTextLeftMedium
            style={{ position:'absolute', fontSize:20, right:-10, top:10, color:'red'}}
            content={"*"}
          ></PoppinsTextLeftMedium>
        )} */}
      </View>
      <TextInput
        maxLength={maxLength}
        onEndEditing={() => {
          handleInputEnd();
        }}
        keyboardType="numeric"
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
        editable={isEditable === false ? isEditable : true}
        placeholderTextColor="#D3D3D3"
        onChangeText={(text) => {
          handleInput(text);
        }}
        value={value}
        placeholder={required ? `${displayText} *` : `${displayText}`}
      ></TextInput>
    </View>
  );
};

const styles = StyleSheet.create({});

export default TextInputNumericRectangle;
