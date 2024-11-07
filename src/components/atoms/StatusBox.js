import React from 'react';
import {View, StyleSheet} from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';



const StatusBox = (props) => {
    const {t} = useTranslation();
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';
        const status = props.status
    return (
        <View style={{padding:14,borderWidth:1,borderStyle:"dashed",backgroundColor:ternaryThemeColor,alignItems:"center",justifyContent:"center",borderRadius:4,opacity:0.9,marginTop:30}}>
            <PoppinsTextMedium style={{color:'white',fontSize:16,fontWeight:'800'}} content={`${t("Status")} : ${status}`}></PoppinsTextMedium>
        </View>
    );
}

const styles = StyleSheet.create({})

export default StatusBox;
