import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import { useTranslation } from 'react-i18next';

const ScannedListItem = props => {
  const index = props.index;
  const serialNo = props.serialNo;
  const productName = props.productName;
  const productCode = props.productCode;
  const batchCode = props.batchCode;
  const unique_code = props.unique_code

  const {t} = useTranslation()
  

  return (
    <View style={styles.container}>
      <View style={{width: '10%'}}>
        <View
          style={{
            height: 30,
            width: 30,
            borderRadius: 15,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <PoppinsTextMedium style={{color:'white',fontSize:16}} content={index+1}></PoppinsTextMedium>
        </View>
      </View>
      <View style={{width: '76%'}}>
        <PoppinsTextMedium
        style={{color:'black',fontSize:14,fontWeight:'600'}}
          content={`${t("Serial No :")} ${serialNo}, ${t("Product Name")} : ${productName}, ${t("Product Code")} : ${productCode}`}></PoppinsTextMedium>
      </View>
      <View style={{width: '10%',marginLeft:4}}>
        <TouchableOpacity
        onPress={()=>{
            props.handleDelete(unique_code)
        }}
          style={{
            height: 30,
            width: 30,
            borderRadius: 15,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            style={{height: 30, width: 30, resizeMode: 'contain'}}
            source={require('../../../assets/images/delete.png')}></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '94%',
    minHeight: 80,
    maxHeight: 140,
    borderRadius: 8,
    marginTop: 10,
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 10,
    shadowColor: '#76758a',
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor:"white",
    marginBottom:10
  },
});

export default ScannedListItem;