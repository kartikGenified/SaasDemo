import React, {useState,useEffect} from 'react';
import {SafeAreaView, Text, View,StyleSheet} from 'react-native';
import { useSelector } from 'react-redux';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';



const CELL_COUNT = 6;

const OtpInput = (propData) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const buttonThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : '#ef6110';
    const primaryThemeColor = useSelector(
      state => state.apptheme.primaryThemeColor,
    )
      ? useSelector(state => state.apptheme.primaryThemeColor)
      : '#FF9B00';
  useEffect(() => {
    if(
      value.length===6
    )
    {
      // console.log(value)
      propData.getOtpFromComponent(value)
    }
  }, [value]);
  
  return (
    <SafeAreaView style={styles.root}>
      
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({index, symbol, isFocused}) => (
          <View
            // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, isFocused && {...styles.focusCell,borderBlockColor:primaryThemeColor,
            borderBottomWidth: 2,},{borderBottomColor: buttonThemeColor,
            borderBottomWidth: 1,}]}>
            <Text style={{...styles.cellText, color: buttonThemeColor,}}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles =  StyleSheet.create({
    root: {padding: 4, height: 80},
    title: {textAlign: 'center', fontSize: 30},
    codeFieldRoot: {
      marginTop: 10,
      width: 300,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    cellRoot: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      
    },
    cellText: {
     
      fontSize: 30,
      textAlign: 'center',
    },
    focusCell: {
      
    },
  });

export default OtpInput;