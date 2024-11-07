import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';
import PoppinsText from '../electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';

const PointsDataBox = props => {
  const points = props.points;
  const header = props.header;
  const data = props.data;
  return (
    <View
      style={{
        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        width: 150,
        borderRadius: 14,
        elevation: 2,
        backgroundColor: '#F9FBFE',
      }}>
      
      <View
        style={{
          height: 50,
          width: 50,
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth:1,borderColor:'#DDDDDD'
        }}>
        <PoppinsTextMedium
          style={{color: 'black', fontSize: 10,fontWeight:'700'}}
          content={points}></PoppinsTextMedium>
      </View>
      <View
        style={{
          width: '70%',
          alignItems: 'center',
          justifyContent: 'center',
         
        }}>
        <Text style={{color: 'black', fontSize: 12, fontWeight: '400'}}>
          {header}
        </Text>
        <PoppinsTextMedium
          style={{fontSize: 12, fontWeight: '600'}}
          content={data}></PoppinsTextMedium>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default PointsDataBox;
