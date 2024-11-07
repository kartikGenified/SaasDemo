import React from 'react';
import { Text, Linking } from 'react-native';

const HyperlinkText = ({ text }) => {
  const renderHyperlinks = () => {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split the text into parts based on the URL regex
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        // If the part is a URL, render it as a clickable link
        return (
          <Text
            key={index}
            style={{ color: 'blue', textDecorationLine: 'underline' }}
            onPress={() => Linking.openURL(part)}
          >
            {part}
          </Text>
        );
      }

      // Otherwise, render the regular text
      return(
        <Text style={{color:'black'}}> {part}</Text>
      ) 
    });
  };

  return <Text>{renderHyperlinks()}</Text>;
};

export default HyperlinkText;
