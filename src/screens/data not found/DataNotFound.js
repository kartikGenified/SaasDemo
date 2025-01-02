import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import ButtonNavigateArrow from '../../components/atoms/buttons/ButtonNavigateArrow';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const DataNotFound = () => {
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';
        const navigation = useNavigation()
        const {t} = useTranslation()

    const handleButton=()=>{
    navigation.navigate("Dashboard")
    }
    return (
        <View style={{alignItems:'center',justifyContent:"center",height:'100%',width:'100%',backgroundColor:'white'}}>
            <Image style={{height:200,width:200,resizeMode:'center'}} source={require('../../../assets/images/dataNotFound.png')}></Image>
            <PoppinsText content={t("No Data Found")} style={{color:'black',fontWeight:'700',fontSize:20}}></PoppinsText>
            <PoppinsTextMedium content={t("Data is empty")} style={{color:'#676767',fontWeight:'500',fontSize:14}}></PoppinsTextMedium>
            <View style={{marginTop:40}}>
            <ButtonNavigateArrow style={{color:'white',fontSize:18}} backgroundColor={ternaryThemeColor} handleOperation={handleButton} content={t("Back to Dashboard")}></ButtonNavigateArrow>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({})

export default DataNotFound;