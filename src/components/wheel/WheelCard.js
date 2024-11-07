//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import PoppinsText from '../electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// create a component
const WheelCard = () => {
  
    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../../assets/images/wheelback.png')} resizeMode="cover" style={{ height: 145, width:'100%', backgroundColor: '#223c8c', borderTopRightRadius: 30, borderTopLeftRadius: 30, justifyContent: 'center',alignItems:'center' }}>
               <View style={{backgroundColor:"#223c8c",opacity:0.9,height:'100%',width:'100%',alignItems:"center",justifyContent:'center',borderTopRightRadius: 30, borderTopLeftRadius: 30,}}>
                </View>
               <Image style={{ height: 110, width: 110, alignSelf: 'center',position:"absolute" }} source={require('../../../assets/images/spin.png')}></Image>

            </ImageBackground>

            <View style={{ height: 50, backgroundColor: '#ffffff', elevation: 10, width: '100%', justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
                <TouchableOpacity onPress={navigation.navigate('')}>
                    <View style={{ flexDirection: 'row' }}>
                        <PoppinsTextMedium style={{ fontSize: 16, color: '#000000', fontWeight: 'bold', }} content={"SPIN TO WIN"}></PoppinsTextMedium>
                        <Image style={{ height: 13, width: 17, alignSelf: 'center',}} source={require('../../../assets/images/rightarrow.png')}></Image>
                    </View>
                </TouchableOpacity>

            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        width: '46%',
        marginHorizontal:8,
        marginVertical:10,
        height: 195,
        elevation: 5,
        shadowColor: '#000',
        backgroundColor: "#223c8c",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
});

//make this component available to the app
export default WheelCard;
