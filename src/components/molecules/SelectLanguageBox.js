import React, { useEffect, useState } from 'react';
import {View, StyleSheet, TouchableOpacity,Image} from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';


const SelectLanguageBox = (props) => {
    const [selected, setSelected] = useState(false)
    
    useEffect(()=>{
        const uncheck=(language)=>{
            // console.log("selected language is ",language)
            if(languageEnglish!==language)
            {
                setSelected(false)
            }
        }
        uncheck(props.selectedLanguage)
    },[props.selectedLanguage])
    const languageHindi =props.languageHindi
    const languageEnglish = props.languageEnglish
    const image = props.image
    const setlanguage=()=>{
        setSelected(!selected)
        props.setSelectedLanguage(languageEnglish)
        
    }

    
    

  return (
    <View style={styles.container}>
      <View style={styles.radioBox}>
      <TouchableOpacity onPress={()=>{setlanguage()}} style={styles.radio}>
        {
        selected  &&  <Image style={{height:24,width:24,resizeMode:'contain',borderRadius:12}} source={require('../../../assets/images/tickBlue.png')}></Image>
        }      
        </TouchableOpacity>
      </View>
      <View style={styles.text}>
        <PoppinsTextMedium style={{color:'black',fontSize:22}} content={languageHindi}></PoppinsTextMedium>
        <PoppinsTextMedium style={{color:'black',fontSize:22}} content={languageEnglish}></PoppinsTextMedium>
      </View>
      <View style={styles.image}>
        <Image style={{width:100,height:70,resizeMode:"contain"}} source={image}></Image>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    height: 84,
    flexDirection: 'row',
    alignItems:"center",
    borderRadius:8,
    margin:10
  },
  radioBox:{
    height:'100%',
    width:'20%',
    alignItems:'center',
    justifyContent:"center"
  },
  radio:{
    height:26,
    width:26,
    borderRadius:13,
    backgroundColor:"white",
    borderWidth:1,
    borderColor:'grey'
  },
  text:{
    width:'40%',
    height:"100%",
    alignItems:"flex-start",
    justifyContent:"center",
    marginLeft:10
  },
  image:{
    height:'100%',
    width:'40%',
    alignItems:"center",
    justifyContent:"flex-end"
  }
});

export default SelectLanguageBox;
