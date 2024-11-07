import React from 'react';
import {View, StyleSheet,TouchableOpacity} from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
const ScannedDetailsBox = (props) => {
  const colorShades = useSelector(state=>state.apptheme.colorShades)

    const lastScannedDate = props.lastScannedDate
    const scanCount = props.scanCount
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : '#FFB533';

        const {t} = useTranslation()
      
    return (
        <View style={{height:70,width:'90%',alignItems:'center',justifyContent:'center',flexDirection:'row',backgroundColor:"#EEEEEE",borderRadius:10,marginBottom:20,borderWidth:1,borderColor:'#DDDDDD'}}>
        <View style={{width:'50%',alignItems:'center',justifyContent:'center',borderRightWidth:2,borderColor:'#DDDDDD'}}>
        <PoppinsTextMedium style={{color:'black',fontSize:16,fontWeight:'600'}} content={t("Last Scanned Date")}></PoppinsTextMedium>
        <PoppinsTextMedium style={{color:'black',fontSize:16,fontWeight:'600'}} content={lastScannedDate}></PoppinsTextMedium>

        </View>
        <View style={{width:'50%',alignItems:'center',justifyContent:'center'}}>
        <PoppinsTextMedium style={{color:'black',fontSize:16,fontWeight:'600'}} content={t("Scan Count")}></PoppinsTextMedium>
        <PoppinsTextMedium style={{color:'black',fontSize:16,fontWeight:'600'}} content={scanCount}></PoppinsTextMedium>
        </View>
        </View>
    );
}

const styles = StyleSheet.create({})

export default ScannedDetailsBox;
