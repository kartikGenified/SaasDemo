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

const MyBonus = ({navigation}) => {
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const referalPoints = 400;

  const BonusItems = props => {
    const number = props.number;
    const date = props.date;
    const points = props.points
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          width:'100%',
          marginBottom:10,
          height:100,borderBottomWidth:1,
          borderColor:'#DDDDDD'
        }}>
        <View
          style={{
            height: 60,
            width: 60,
            borderRadius: 30,
            backgroundColor: '#F7F7F7',
            alignItems: 'center',
            justifyContent: 'center',
            position:"absolute",
            left:20
          }}>
          <Image
            style={{height: 30, width: 30, resizeMode: 'contain'}}
            source={require('../../../assets/images/referal.png')}></Image>
        </View>
        <View
          style={{alignItems: 'center', justifyContent: 'center', height: 30,position:"absolute",left:100}}>
          <PoppinsTextMedium
            content={number}
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: '#474747',
            }}></PoppinsTextMedium>
          <PoppinsTextMedium
            content={date}
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: '#85868A',
            }}></PoppinsTextMedium>
        </View>
        <View style={{alignItems:'center',justifyContent:'center',position:"absolute",right:20}}>
            <View style={{alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                <Image style={{height:20,width:20,resizeMode:"contain"}} source={require('../../../assets/images/coin.png')}></Image>
                <PoppinsTextMedium
            content={`+ ${points}`}
            style={{
                marginLeft:6,
              fontSize: 18,
              fontWeight: '700',
              color: '#FDBC0E',
            }}></PoppinsTextMedium>
            </View>
            <PoppinsTextMedium
            content="Received in"
            style={{
              fontSize: 12,
              fontWeight: '700',
              color: '#8C8C8C',
            }}></PoppinsTextMedium>
        </View>
      </View>
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
          content="My Bonus"
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
          }}></PoppinsTextMedium>
      </View>
      <ScrollView style={{width: '100%'}}>
        <View
          style={{
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            backgroundColor: 'white',
            
            marginTop: 10,
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            paddingBottom:40
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              width: '100%',
              borderBottomWidth: 2,
              borderColor: '#F7F7F7',
              height: 100,
              marginBottom: 20,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                left: 20,
              }}>
              <PoppinsTextMedium
                style={{color: '#6E6E6E', fontSize: 18}}
                content="Refer Points"></PoppinsTextMedium>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{height: 30, width: 30, resizeMode: 'contain'}}
                  source={require('../../../assets/images/coin.png')}></Image>
                <PoppinsTextMedium
                  style={{
                    color: '#373737',
                    fontSize: 30,
                    fontWeight: '800',
                    marginLeft: 10,
                  }}
                  content={referalPoints}></PoppinsTextMedium>
              </View>
            </View>
            <Image
              style={{
                height: 100,
                width: 100,
                resizeMode: 'contain',
                position: 'absolute',
                right: 20,
              }}
              source={require('../../../assets/images/referIcon.png')}></Image>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}>
            <BonusItems date="23 Sept 2023" number="8888888888"></BonusItems>
            <BonusItems date="23 Sept 2023" number="8888888888"></BonusItems>
            <BonusItems date="23 Sept 2023" number="8888888888"></BonusItems>
            <BonusItems date="23 Sept 2023" number="8888888888"></BonusItems>
            <BonusItems date="23 Sept 2023" number="8888888888"></BonusItems>

            <BonusItems date="23 Sept 2023" number="8888888888"></BonusItems>

          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default MyBonus;
