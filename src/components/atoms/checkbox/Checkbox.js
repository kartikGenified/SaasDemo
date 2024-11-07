import React, { useState } from 'react';
import { View, Text, TouchableWithoutFeedback, Image } from 'react-native';
// import { Image } from 'react-native-svg';

function Checkbox({CheckBoxData}) {
  const [isChecked, setIsChecked] = useState(false);

  const toggleCheckbox = () => {
    CheckBoxData(!isChecked);
    setIsChecked(!isChecked);
  };

  return (
    <TouchableWithoutFeedback onPress={toggleCheckbox}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            width: 25,
            height: 25,
            borderRadius: 2,
            borderWidth: 2,
            borderColor: 'black',
            // backgroundColor: isChecked ? 'black' : 'white',
          }}
        />
        <View>
        {isChecked &&  <Image style={{height:15, width:15, marginLeft:-20}} source={require('../../../../assets/images/blueChecked.png')}/>}  
        </View>
    
      </View>
    </TouchableWithoutFeedback>
  );
}

export default Checkbox;