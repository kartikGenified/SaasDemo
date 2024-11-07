//import liraries
import React, { Component, useState , useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,ScrollView } from 'react-native';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import { useFetchAllfaqsMutation } from '../../apiServices/faq/faqApi';
import * as Keychain from 'react-native-keychain';
import DataNotFound from '../data not found/DataNotFound';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';



// create a component
const FAQ = ({ navigation }) => {
    
    const[faqData, setFAQData] = useState(null);
    const[error,setError] = useState(false);

    const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loader.gif')).uri;
    const {t} = useTranslation()

    const [fetchFAQ, {
        data:fetchFAQData, 
        error:FAQError,
        isLoading:FAQIsLoading,
        isError:FAQIsError
      }] = useFetchAllfaqsMutation()
  

   

    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';

    
    
    useEffect(()=>{
        const getToken=async()=>{
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
              console.log(
                'Credentials successfully loaded for user ' + credentials.username
              );
              const token = credentials.username;
              let parmas = {
                token:token,
              }
                fetchFAQ(parmas)
            }
          }
          getToken();
        //   fetchFAQ();
    },[])

    useEffect(()=>{
       if(fetchFAQData){
        setFAQData(fetchFAQData.body.faqList)
        
       }
       else{
        setError(true)
        setFAQData([]);
       }
    },[fetchFAQData, FAQError])



        

    const FaqComp = (props) => {
        const item = props.item
        console.log("FAQ item", item)
        const [queVisible, setQueVisible] = useState(false);
        return (
            <View style={{ marginHorizontal: 20, borderWidth: 1, marginTop: 20, padding: 10, borderRadius: 5, borderColor:"#80808040" }}>
                <TouchableOpacity onPress={() => {
                    setQueVisible(!queVisible)
                }} style={{ flexDirection: 'row' }}>
                    <Image style={{ height: 14, width: 14, resizeMode: "contain", position: "absolute", right: 10, top: 10 }} source={require('../../../assets/images/arrowDown.png')}></Image>
                    <View >
                        <PoppinsTextLeftMedium style={{ fontSize: 20, color: '#000000', fontWeight: '800' }} content={item?.question}></PoppinsTextLeftMedium>
                    </View>
                </TouchableOpacity>


                {queVisible && (
                    <PoppinsTextLeftMedium content={item.answer?.[0]} style={{ fontSize: 14, color: '#808080', fontWeight: '600', marginTop: 10 }}></PoppinsTextLeftMedium>
                )}

            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View
                style={{
                    height: 50,
                    width: '100%',
                    backgroundColor: ternaryThemeColor,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    // marginTop: 10,
                }}>
                <TouchableOpacity
                    style={{ height: 20, width: 20, position: 'absolute', left: 20, marginTop: 10 }}
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Image
                        style={{ height: 20, width: 20, resizeMode: 'contain', marginTop:5 }}
                        source={require('../../../assets/images/blackBack.png')}></Image>
                </TouchableOpacity>

                <PoppinsTextMedium style={{ fontSize: 20, color: '#ffffff', marginTop: 10, position: 'absolute', left: 50 }} content={t("FAQ")}></PoppinsTextMedium>


            </View>

            {FAQIsLoading &&
              <FastImage
                   style={{ width: 50, height: "10%", marginTop:'70%', marginLeft:'40%' }}
                   source={{
                       uri: gifUri, // Update the path to your GIF
                       priority: FastImage.priority.normal,
                   }}
                   resizeMode={FastImage.resizeMode.contain}
               />
          }

          <ScrollView contentContainerStyle={{paddingBottom:20}} style={{width:'100%'}}>
            {
                faqData?.length > 0 && faqData.map((item) => {
                    return (
                        <View key={item.id}>
                            <FaqComp item = {item}></FaqComp>
                        </View>
                    )

                })
            }
            </ScrollView>

          
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default FAQ;