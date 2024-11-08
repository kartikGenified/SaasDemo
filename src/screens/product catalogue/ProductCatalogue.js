import React, {useEffect, useId, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions,
  Text,
  Linking,
} from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import * as Keychain from 'react-native-keychain';
import {useSelector} from 'react-redux';
import { useProductCatalogueMutation } from '../../apiServices/productCatalogue/productCatalogueApi';
import Pdf from 'react-native-pdf';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';

const ProductCatalogue = ({navigation}) => {
    const [catalogueData, setCatalogueData] = useState()
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';

    const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loader2.gif')).uri;


  const [
    productCatalogueFunc,
    {
      data: productCatalogueData,
      error: productCatalogueError,
      isLoading: productCatalogueIsLoading,
      isError: productCatalogueIsError,
    }
  ] = useProductCatalogueMutation();

  const {t} = useTranslation()

  useEffect(()=>{
    const getToken=async(data)=>{

        const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          'Credentials successfully loaded for user ' + credentials.username
        );
        const token = credentials.username
        const params = {
            token :token,
            limit: 100,
            offset: 0,
            }
            productCatalogueFunc(params)
      }
    }
    getToken()
  },[])

  useEffect(()=>{
    if(productCatalogueData)
    {
        console.log("productCatalogueData",productCatalogueData.body.data)
        if(productCatalogueData.success)
        {
            setCatalogueData(productCatalogueData.body.data)
        }

    }
    else if(productCatalogueError){
        console.log("productCatalogueError",productCatalogueError)
    }
  },[productCatalogueData,productCatalogueError])
const height = Dimensions.get('window').height
  const CatalogueItem = props => {
    const image = props.image;
    const title = props.title;
    const pdf = props.pdf
    
    return (
      <TouchableOpacity
      onPress={()=>{
        navigation.navigate('PdfComponent',{pdf:pdf})
      }}
        style={{
          height: 180,
          width: '44%',
          backgroundColor: '#DDDDDD',
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'flex-start',
          margin:10,
          elevation: 10,
        }}>
            
       
          <Image
            style={{height: 140, width: '100%',borderTopRightRadius:20,borderTopLeftRadius:20,resizeMode:'contain'}}
            source={{uri:image}}></Image>
            <View style={{backgroundColor:'white',width:'100%',padding:8,alignItems:'center',justifyContent:'center',position:'absolute',bottom:0,elevation:8,borderBottomRightRadius:20,borderBottomLeftRadius:20}}>
            <PoppinsTextMedium
          style={{color: 'black', fontSize: 17}}
          content={title}></PoppinsTextMedium>
            </View>
       
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: ternaryThemeColor,
        height: '100%',
      }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          width: '100%',
          marginTop: 10,
          height: '10%',
          marginLeft: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: 'contain',
              marginLeft: 10,
            }}
            source={require('../../../assets/images/blackBack.png')}></Image>
        </TouchableOpacity>
        <PoppinsTextMedium
          content={t("Product Catalogue")}
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
          }}></PoppinsTextMedium>
      </View>
      <ScrollView style={{width:'100%',height:'90%'}}>

      
      <View
        style={{
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          backgroundColor: 'white',
          minHeight:height-100,
          marginTop: 10,
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          paddingBottom: 40,
        }}>
        <View
          style={{
            marginTop: 40,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            flexDirection: 'row'
          }}>
            {
                catalogueData && catalogueData.map((item,index)=>{
                    return(
          <CatalogueItem key ={index} title={item.name} image ={item.image} pdf={item.files[0]}></CatalogueItem>

                    )
                })
            }

              {!catalogueData &&
              <FastImage
                   style={{ width: 100, height: 100, alignSelf: 'center',justifyContent:'center', marginTop: '50%', marginLeft:'40%' }}
                   source={{
                       uri: gifUri, // Update the path to your GIF
                       priority: FastImage.priority.normal,
                   }}
                   resizeMode={FastImage.resizeMode.contain}
               />
               }
           

          
        </View>
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ProductCatalogue;