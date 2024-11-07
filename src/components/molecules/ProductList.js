import React from 'react';
import {View, StyleSheet} from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import PoppinsText from '../electrons/customFonts/PoppinsText';

const ProductList = props => {
  const list = props.list;
  console.log('Size of the array is', list);
  const length = list.length;
  return (
   <View style={{width:"100%",alignItems:'flex-start',justifyContent:"center",marginLeft:50,marginTop:20}}>
    <PoppinsText style={{marginTop:8,fontSize:16}} content="Product List"></PoppinsText>
    <View 
      style={{flexDirection: 'row',borderBottomWidth:1,width:'80%',paddingBottom:8,borderColor:'#DDDDDD',marginBottom:10}}>

    {list.map((item, index) => {
    return (
        <View key={index}>
            {
                index ===length - 1 ? (
                    <PoppinsTextMedium
                      style={{color: 'black', fontSize: 16,fontWeight:'500'}}
                      content={item}></PoppinsTextMedium>
                  ) : (
                    <PoppinsTextMedium
                      style={{color: 'black', fontSize: 16,fontWeight:'500'}}
                      content={`${item},`}></PoppinsTextMedium>
                  )
            }
        </View>
          
        
     
    );
  })}
  </View>
   </View>
  )
  
};

const styles = StyleSheet.create({});

export default ProductList;
