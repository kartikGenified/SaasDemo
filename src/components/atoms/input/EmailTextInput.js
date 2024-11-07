import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Keyboard } from "react-native";
import PoppinsTextMedium from "../../electrons/customFonts/PoppinsTextMedium";
import PoppinsTextLeftMedium from "../../electrons/customFonts/PoppinsTextLeftMedium";
import { useTranslation } from "react-i18next";

const EmailTextInput = (props) => {
  const [value, setValue] = useState(props.value);
  const [isValidEmailState, setIsValidEmailState] = useState(true);
  const [maxLength, setMaxLength] = useState(
    props.maxLength ? props.maxLength : 100
  );
  const [keyboardShow, setKeyboardShow] = useState(false);
  const placeHolder = props.placeHolder;
  const label = props.label;
  let displayText = props.placeHolder
  const required = props.jsonData.required
  props.required === undefined ? props.jsonData.required : props.required;

  const {t} =useTranslation()

  Keyboard.addListener("keyboardDidShow", () => {
  
    console.log("Keyboard Visible")

  });
  Keyboard.addListener("keyboardDidHide", () => {
    if(placeHolder==="email")
    {
    handlekeyboardHide("text")

    }
    console.log("Keyboard Hidden")

  });
  const isValidEmail = (text) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(text);
  };

  if(displayText=="email" || "Email"){
      displayText =  "Email"
  }
  
const handlekeyboardHide=(text)=>{
    console.log("call form addListner",text)
    let tempJsonData = { ...props.jsonData, value: value };
    // console.log("tempJsonData", tempJsonData);
    // console.log("is valid ", isValidEmail(value));
        if(value!==undefined)
        {
            if (isValidEmail(value)) {
                props.handleData(tempJsonData);
                setIsValidEmailState(true);
              } 
              else {
                props.handleData(tempJsonData)
                setIsValidEmailState(false);
                console.log("inside else statement",isValidEmailState)
              }
        }
     
    console.log("keyboard visible",isValidEmail(value),  placeHolder);
}

//   useEffect(() => {
//     let tempJsonData = { ...props.jsonData, value: value };
//     console.log("tempJsonData", tempJsonData);
//     console.log("is valid ", isValidEmail(value));
//     if (props.value !== undefined) {
//       if (isValidEmail(value)) {
//         props.handleData(tempJsonData);
//         setIsValidEmailState(true)

//       } else {
//         setIsValidEmailState(false);
//         props.handleData(tempJsonData);
//       }
//     }
//     console.log("keyboard visible", keyboardShow, placeHolder);
//   }, [props.value]);

  const handleInput = (text) => {
    setValue(text);
    if (text.length === 0) {
      setIsValidEmailState(true);
    }
    // props.handleData(value)
  };

  

  const handleInputEnd = () => {
    if(value)
    {
        if (value.length === 0) {
            setIsValidEmailState(true);
          }
          let tempJsonData = { ...props.jsonData, value: value };
          console.log(tempJsonData);
          if (isValidEmail(value)) {
            props.handleData(tempJsonData);
            setIsValidEmailState(true)
          } else {
            setIsValidEmailState(false);
            props.handleData(tempJsonData);
          }
    }
    
  };

  return (
    <View
      style={{ width: "86%", alignItems: "center", justifyContent: "center" }}
    >
      <View
        style={{
          height: 60,
          width: "100%",
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
            content={t(displayText)}
          ></PoppinsTextMedium>
        </View>
        <TextInput
          maxLength={maxLength}
          onSubmitEditing={(text) => {
            handleInputEnd();
          }}
          onEndEditing={(text) => {
            handleInputEnd();
          }}
          style={{
            height: 50,
            width: "100%",
            alignItems: "center",
            justifyContent: "flex-start",
            fontWeight: "500",
            marginLeft: 24,
            color: "black",
            fontSize: 16,
          }}
          placeholderTextColor="grey"
          onChangeText={(text) => {
            handleInput(text);
          }}
          value={value}
          placeholder={required ? `${placeHolder} *` : `${placeHolder}`}
        ></TextInput>
      </View>
      {isValidEmailState===false && (
        <PoppinsTextLeftMedium
          style={{ color: "red", marginBottom: 5 }}
          content="Please enter a valid email"
        ></PoppinsTextLeftMedium>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default EmailTextInput;
