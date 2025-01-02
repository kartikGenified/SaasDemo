import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, Keyboard } from "react-native";
import PoppinsTextMedium from "../../electrons/customFonts/PoppinsTextMedium";
import PoppinsTextLeftMedium from "../../electrons/customFonts/PoppinsTextLeftMedium";
import { useTranslation } from "react-i18next";

const EmailTextInput = (props) => {
  const { value, maxLength, placeholder, label, jsonData, handleData } = props;
  const { t } = useTranslation();

  console.log("email text input", label)

  const [inputValue, setInputValue] = useState(value || ""); // Initialize with provided value or empty string
  const [isValidEmail, setIsValidEmail] = useState(true);

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  // Function to validate email
  const validateEmail = (text) => emailRegex.test(text);

  // Handle text input change
  const handleInputChange = (text) => {
    setInputValue(text);
    if (text.length === 0) {
      setIsValidEmail(true); // Reset email validity on empty input
    }
  };

  // Handle input submission/end
  const handleInputEnd = () => {
    if (inputValue) {
      const isValid = validateEmail(inputValue);
      setIsValidEmail(isValid);

      const updatedJsonData = { ...jsonData, value: inputValue };
      handleData(updatedJsonData);
    }
  };

  // Keyboard listeners for additional behavior
  useEffect(() => {
    const keyboardShowListener = Keyboard.addListener("keyboardDidShow", () => {
      console.log("Keyboard Visible");
    });
    const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      if (placeholder === "email") {
        handleInputEnd();
      }
      console.log("Keyboard Hidden");
    });

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [inputValue]);

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        {/* Label */}
        {label && (
          <View style={styles.labelWrapper}>
            <PoppinsTextMedium
              style={styles.labelText}
              content={t(placeholder || label)}
            />
          </View>
        )}

        {/* TextInput */}
        <TextInput
          maxLength={maxLength || 100} // Use default of 100 if maxLength not provided
          onSubmitEditing={handleInputEnd}
          onEndEditing={handleInputEnd}
          style={styles.textInput}
          placeholder={jsonData?.required ? `${label.toLowerCase()} *` : label.toLowerCase()}
          placeholderTextColor="#D3D3D3"
          onChangeText={handleInputChange}
          value={inputValue}
        />
      </View>

      {/* Validation Error */}
      {!isValidEmail && (
        <PoppinsTextLeftMedium
          style={styles.errorText}
          content={t("Please enter a valid email")}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "86%",
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrapper: {
    height: 60,
    width: "100%",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    margin: 10,
  },
  labelWrapper: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    position: "absolute",
    top: -15,
    left: 16,
  },
  labelText: {
    color: "#919191",
    padding: 4,
    fontSize: 18,
  },
  textInput: {
    height: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    fontWeight: "500",
    marginLeft: 24,
    color: "black",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 5,
  },
});

export default EmailTextInput;
