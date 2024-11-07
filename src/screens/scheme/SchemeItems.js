import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import {useCheckActiveSchemeMutation} from '../../apiServices/scheme/GetSchemeApi';
import * as Keychain from 'react-native-keychain';
import Logo from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
export default function SchemeItems({navigation}) {
    const [scheme, setScheme] = useState([])
    const [gifts, setGifts] = useState([])
    const [selectedGifts, setSelectedGifts] = useState()
    const [categories, setCategories] =useState()
    const [selected, setSelected] = useState(false)
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const height = Dimensions.get('window').height;
  const [
    checkActiveSchemeFunc,
    {
      data: checkActiveSchemeData,
      error: checkActiveSchemeError,
      isLoading: checkActiveSchemeIsLoading,
      isError: checkActiveSchemeIsError,
    },
  ] = useCheckActiveSchemeMutation();

useEffect(()=>{
    const getToken=async()=>{
        const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    console.log(
      'Credentials successfully loaded for user ' + credentials.username
    );
    const token = credentials.username
    checkActiveSchemeFunc(token)
  }

    }
    getToken()
},[])

useEffect(()=>{
    if(checkActiveSchemeData){
        console.log("checkActiveSchemeData",JSON.stringify(checkActiveSchemeData))
        if(checkActiveSchemeData.success)
        {
            setScheme(checkActiveSchemeData.body.scheme)
            setGifts(checkActiveSchemeData.body.gifts)
            getCategories(checkActiveSchemeData.body.gifts)
            setSelectedGifts(checkActiveSchemeData.body.gifts)
        }
    }
    else if(checkActiveSchemeError){
        console.log("checkActiveSchemeError",checkActiveSchemeError)
    }
},[checkActiveSchemeData,checkActiveSchemeError])

    const getCategories=(data)=>{
        
       const categoryData= data.map((item,index)=>{
           return (item.brand).trim()
        })
        const set = new Set(categoryData)
        const tempArray = Array.from(set)
        setCategories(tempArray)
    }

    const handlePress=(data)=>{
        setSelectedGifts(data)
        setSelected(true)
    }

  const SchemeComponent = props => {
    const image = props.image;
    const name = props.name;
    const worth = props.worth;
    const coin = props.coin;
    return (
      <View
        style={{
          width: '44%',
          borderWidth: 0.2,
          borderColor: '#DDDDDD',
          elevation: 6,
          height: 200,
          backgroundColor: 'white',
          borderRadius: 4,
          margin:10,alignItems:"center",justifyContent:"center"
        }}>
        <View
          style={{
            width: '90%',
            height: '50%',
            borderBottomWidth: 1,
            borderColor: '#DDDDDD',
          }}>
          <Image
            style={{height: '100%', width: '100%', resizeMode: 'contain'}}
            source={{uri: image}}></Image>
        </View>
        <View
          style={{
            width: '90%',
            height: '50%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <PoppinsTextMedium
            style={{color: 'black', fontSize: 15,fontWeight:"800"}}
            content={name}></PoppinsTextMedium>
          <PoppinsTextMedium
            style={{color: 'grey', fontSize: 14,fontWeight:"700"}}
            content={`Worth Rs : ${worth} INR`}></PoppinsTextMedium>
          <PoppinsTextMedium
            style={{color: 'black', fontSize: 14,fontWeight:"700"}}
            content={`Coin : ${coin}`}></PoppinsTextMedium>
        </View>
      </View>
    );
  };

  const FilterComp = props => {
    const [color, setColor] = useState('#F0F0F0');
    const [selected, setSelected] = useState(props.selected );
    const title = props.title;
    const togglebox = () => {
      setSelected(!selected);
      console.log("selected",selected)

      if(!selected)
      {
        const temp = [...gifts]
        const filteredArray =  temp.filter((item,index)=>{
            console.log("From filter",item.brand,title)
                return item.brand===title
            
        })
        console.log("filteredArray",filteredArray)
        // setSelectedGifts(filteredArray)
        props.handlePress(filteredArray)
      }
    };
    console.log('selected', selected);
    return (
      <TouchableOpacity
        onPress={() => {
          togglebox();
        }}
        style={{
          minWidth: 60,
          height: 40,
          padding: 10,
          backgroundColor: selected ? ternaryThemeColor : '#F0F0F0',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 10,
          borderRadius: 4,
        }}>
        <PoppinsTextMedium
          style={{fontSize: 12, color: selected ? 'white' : 'black'}}
          content={title}></PoppinsTextMedium>
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
          content="Scheme"
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
          }}></PoppinsTextMedium>
      </View>

      <View
        style={{
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          backgroundColor: 'white',
          minHeight: height - 100,
          marginTop: 10,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          paddingBottom: 40,
        }}>
           <View style={{height:100,width:'100%',alignItems:'center',justifyContent:'center'}}>
           <ScrollView
           contentContainerStyle={{alignItems:'center',justifyContent:'center',marginLeft:20}}
        horizontal={true}
          style={{
            width:'100%',
            
          }}>
            {
                categories && categories.map((item,index)=>{
                    return(
          <FilterComp selected={selected} handlePress={handlePress} key={index} title={item}></FilterComp>

                    )

                })
            }
        </ScrollView>
           </View>
       
           <ScrollView style={{width:'100%',height:'100%'}}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            
          }}>
           

            
            {
                gifts && gifts.map((item,index)=>{
                    return(
          <SchemeComponent key={index} name={item.name} worth={item.value} coin={item.points} image={item.images[0]}></SchemeComponent>
                    )
                })
            }
        </View>
        </ScrollView>
      </View>
    </View>
  );
}
