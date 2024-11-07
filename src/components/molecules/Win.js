import React from 'react';
import {View, StyleSheet,Text} from 'react-native';
import PoppinsText from '../electrons/customFonts/PoppinsText';
import ButtonModal from '../atoms/buttons/ButtonModal';
import { useSelector } from 'react-redux';

const Win = (props) => {
    const title = props.title
    const data = props.data
    const ternaryThemeColor = useSelector(
      state => state.apptheme.ternaryThemeColor,
    )
      ? useSelector(state => state.apptheme.ternaryThemeColor)
      : 'grey';
  return <View style={styles.container}>
    <PoppinsText  style={{margin:4,color:ternaryThemeColor,fontSize:18}} content={data}></PoppinsText>

    <PoppinsText style={{color:'black'}} content={title}></PoppinsText>
    {/* <ButtonModal style={{color:'white',fontSize:12}} content="CLick Here To Avial"></ButtonModal> */}
  </View>;
};

const styles = StyleSheet.create({
  container: {
    
    width: 230,
    borderWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#FCC82B',
    backgroundColor: 'white',
    alignItems:"center",
    justifyContent:"center",
    padding:4,
    margin:4
  },
});

export default Win;
