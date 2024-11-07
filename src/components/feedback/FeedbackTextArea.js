import React from 'react';
import { useState } from 'react';
import { View, TextInput, StyleSheet, KeyboardAvoidingView } from 'react-native';

const FeedbackTextArea = ({ onFeedbackChange, placeholder }) => {
 

  const handleFeedbackChange = (text) => {
   
    onFeedbackChange(text); // Send feedback to the parent component
  };



  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      enabled
    >
      <TextInput
        multiline
        placeholderTextColor='#808080'
        placeholder={placeholder ? placeholder : "Write Here"}
        style={styles.textInput}
        onChangeText={handleFeedbackChange}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    marginHorizontal: 16,
    elevation: 4,
  },
  textInput: {
    height: 114,
    fontSize: 16,
    color:'#000000',
    textAlign:"left",
    textAlignVertical:'top'
    
  },
});

export default FeedbackTextArea;