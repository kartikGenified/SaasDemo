import React from 'react';
import {WebView} from 'react-native-webview';



const SvgComponent = (props) => {
  const {uri, height, width} = props;
  const html = `
  <div>
   <img width="100%" height="100%"src="${uri}"/>
  </div>
  `;
  return (
    <WebView
      source={{html: html}}
      javaScriptEnabled={true}
      style={{height, width}}
    />
  );
};

export default SvgComponent;