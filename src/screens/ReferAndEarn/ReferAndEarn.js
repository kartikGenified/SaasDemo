import React, { useEffect, useId, useState } from 'react';
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
  Linking
} from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import * as Keychain from 'react-native-keychain';
import { useSelector } from 'react-redux';
import BottomModal from '../../components/modals/BottomModal';
import Cancel from 'react-native-vector-icons/MaterialIcons'
import ButtonRectangle from '../../components/atoms/buttons/ButtonRectangle';
import Whatsapp from 'react-native-vector-icons/FontAwesome'
import Error from 'react-native-vector-icons/Feather'
import Facebook from 'react-native-vector-icons/Entypo'
import Share from 'react-native-share';
import { useFetchProfileMutation } from '../../apiServices/profile/profileApi';
import { useIsFocused } from '@react-navigation/native';

const ReferAndEarn = ({ navigation }) => {
  const [openBottomInvitationModal, setOpenBottomInvitationModal] = useState(false)
  const [openBottomReferModal, setOpenBottomReferModal] = useState(false)


  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const primaryThemeColor = useSelector(
    state => state.apptheme.primaryThemeColor,
  )
    ? useSelector(state => state.apptheme.primaryThemeColor)
    : '#FF9B00';

  const focused = useIsFocused()

  useEffect(() => {
    if (fetchProfileData) {
      console.log('fetchProfileData', fetchProfileData.body);
    } else if (fetchProfileError) {
      console.log('fetchProfileError', fetchProfileError);
    }
  }, [fetchProfileData, fetchProfileError]);

  const [
    fetchProfileFunc,
    {
      data: fetchProfileData,
      error: fetchProfileError,
      isLoading: fetchProfileIsLoading,
      isError: fetchProfileIsError,
    },
  ] = useFetchProfileMutation();
  useEffect(() => {
    const fetchData = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          'Credentials successfully loaded for user ' + credentials.username,
        );
        const token = credentials.username;

        fetchProfileFunc(token);


      }
    };
    fetchData();

  }, []);
  const height = Dimensions.get('window').height;
  const rewardAmount = 50;
  const referalCode = fetchProfileData ? fetchProfileData.body.referral_code : "N/A";
  const modalInvitationClose = () => {
    setOpenBottomInvitationModal(false);
  };
  const modalReferClose = () => {
    setOpenBottomReferModal(false);
  };

  const handleProceedButton = () => {
    // setOpenBottomReferModal(true)
    const options = {
      title: "Refer And Earn",
      url: `Please use this code for reference : ${referalCode}`
    }
    Share.open(options)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  }

  const ReferModalContent = () => {
    return (
      <View style={{ alignItems: "center", justifyContent: 'center', width: '100%', marginTop: 20, marginBottom: 20 }}>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: '100%', padding: 10 }}>
          <PoppinsTextMedium style={{ color: '#171717', fontSize: 16, marginRight: 40, fontWeight: '700' }} content="Share Your Referral"></PoppinsTextMedium>
          <TouchableOpacity onPress={() => { setOpenBottomReferModal(false) }}>
            <Cancel style={{ marginLeft: 120 }} name="cancel" size={30} color={ternaryThemeColor}></Cancel>
          </TouchableOpacity>
        </View>
        <View style={{ width: '90%', backgroundColor: '#DDDDDD', flexDirection: 'row', marginTop: 20, padding: 20, borderRadius: 4, alignItems: 'center', justifyContent: 'space-evenly' }}>
          <TouchableOpacity onPress={async () => {

            Linking.openURL(`https://wa.me/?text=Please Use this Code To refer : ${referalCode}}`).then((res) => console.log(res)).catch((e) => { console.log(e) });

          }} style={{ height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
            <Whatsapp name="whatsapp" size={30} color="green"></Whatsapp>
            <PoppinsTextMedium style={{ color: 'green', marginTop: 4, fontWeight: '600', fontSize: 12 }} content="WhatsApp"></PoppinsTextMedium>
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => {

            Linking.openURL(`sms:`).then((res) => console.log(res)).catch((e) => { console.log(e) });

          }} style={{ height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
            <Error name="message-square" size={30} color="#FF9100"></Error>
            <PoppinsTextMedium style={{ color: '#FF9100', marginTop: 4, fontWeight: '600', fontSize: 12 }} content="SMS"></PoppinsTextMedium>
          </TouchableOpacity>
          <TouchableOpacity onPress={async () => {

            Linking.openURL('fb://page/').then((res) => console.log(res)).catch((e) => { console.log(e) });

          }} style={{ height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
            <Facebook name="facebook" size={30} color="blue"></Facebook>
            <PoppinsTextMedium style={{ color: 'blue', marginTop: 4, fontWeight: '600', fontSize: 12 }} content="Facebook"></PoppinsTextMedium>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  const InvitationRules = () => {
    return (
      <View style={{ alignItems: "center", justifyContent: 'center', width: '100%' }}>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: '100%', padding: 10 }}>
          <PoppinsTextMedium style={{ color: '#171717', fontSize: 16, marginRight: 40, fontWeight: '700' }} content="Invitation Rules"></PoppinsTextMedium>
          <TouchableOpacity onPress={() => { setOpenBottomInvitationModal(false) }}>
            <Cancel style={{ marginLeft: 120 }} name="cancel" size={30} color={ternaryThemeColor}></Cancel>
          </TouchableOpacity>

        </View>
        <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 20, right: 10 }}>
          <View style={{ height: 180, width: 1, borderColor: '#7C7979', borderStyle: 'dotted', borderWidth: 1 }}></View>
          <View style={{ alignItems: "center", justifyContent: 'center', right: 6 }}>
            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: '#7C7979' }}></View>
              <PoppinsTextMedium style={{ color: "#171717", marginLeft: 10, width: 280 }} content="Lorem Ipsum is simply dummy text of the printing and typesetting industry."></PoppinsTextMedium>

            </View>
            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
              <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: '#7C7979' }}></View>
              <PoppinsTextMedium style={{ color: "#171717", marginLeft: 10, width: 280 }} content="Lorem Ipsum is simply dummy text of the printing and typesetting industry."></PoppinsTextMedium>

            </View>
            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
              <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: '#7C7979' }}></View>
              <PoppinsTextMedium style={{ color: "#171717", marginLeft: 10, width: 280 }} content="Lorem Ipsum is simply dummy text of the printing and typesetting industry."></PoppinsTextMedium>

            </View>
            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
              <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: '#7C7979' }}></View>
              <PoppinsTextMedium style={{ color: "#171717", marginLeft: 10, width: 280 }} content="Lorem Ipsum is simply dummy text of the printing and typesetting industry."></PoppinsTextMedium>

            </View>
          </View>

        </View>


      </View>
    )
  }


  return (


    <View
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: ternaryThemeColor,
        height: height,
      }}>
      {openBottomInvitationModal && <BottomModal
        modalClose={modalInvitationClose}
        openModal={openBottomInvitationModal}
        comp={InvitationRules}></BottomModal>}
      {openBottomReferModal && <BottomModal
        modalClose={modalReferClose}
        openModal={openBottomReferModal}
        comp={ReferModalContent}></BottomModal>}
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
          content="Refer & Earn"
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
          }}></PoppinsTextMedium>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("MyBonus")
          }}
          style={{
            borderRadius: 4,
            flexDirection: 'row',
            borderColor: 'white',
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 4,
            position: 'absolute',
            right: 30,
          }}>
          <PoppinsTextMedium
            style={{ color: 'white', fontSize: 16 }}
            content="My Bonus"></PoppinsTextMedium>
          <Image
            style={{
              height: 20,
              width: 20,
              resizeMode: 'contain',
              marginLeft: 10,
            }}
            source={require('../../../assets/images/whiteArrowRight.png')}></Image>
        </TouchableOpacity>
      </View>
      <ScrollView style={{ width: '100%' }}>

        <View
          style={{
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            backgroundColor: 'white',
            height: '90%',
            marginTop: 10,
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
          }}>
          <Image
            style={{ width: '90%', height: 160, marginTop: 20 }}
            source={require('../../../assets/images/referAndEarn.png')}></Image>
          <PoppinsText
            style={{
              color: 'black',
              fontSize: 18,
              fontWeight: '700',
              width: '80%',
            }}
            content="Refer to your friend and Get a Point"></PoppinsText>
          <View
            style={{
              width: '80%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <PoppinsText
              style={{ color: 'black', fontSize: 18, fontWeight: '700' }}
              content="Reward of"></PoppinsText>
            <Image
              style={{ height: 14, width: 14, resizeMode: 'contain', margin: 4 }}
              source={require('../../../assets/images/coin.png')}></Image>
            <PoppinsText
              style={{ color: '#FF9100', fontSize: 18, fontWeight: '700' }}
              content={`${rewardAmount} Points`}></PoppinsText>
          </View>
          <PoppinsTextMedium
            style={{ color: '#525252', fontSize: 15, width: '80%', marginTop: 20 }}
            content="Share this link with your friend and after they install, both of you will get 50 points rewards."></PoppinsTextMedium>
          <TouchableOpacity
            style={{
              padding: 10,
              borderColor: '#CDCDCD',
              borderWidth: 1,
              borderStyle: 'dashed',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 4,
              marginTop: 20,
            }}>
            <PoppinsTextMedium
              style={{
                color: 'black',
                fontSize: 20,
                fontWeight: '700',
                marginRight: 20,
              }}
              content={referalCode}></PoppinsTextMedium>
            <Icon name="copy-sharp" size={20} color={ternaryThemeColor}></Icon>
          </TouchableOpacity>
          <View
            style={{
              width: '84%',
              borderColor: '#DDDDDD',
              borderTopWidth: 1,
              marginTop: 20,
            }}>
            <PoppinsTextMedium
              style={{
                color: '#525252',
                fontSize: 14,
                fontWeight: '500',
                marginTop: 10
              }}
              content="To understand how referral works."></PoppinsTextMedium>
            <TouchableOpacity onPress={() => { setOpenBottomInvitationModal(!openBottomInvitationModal) }}>
              <PoppinsTextMedium
                style={{
                  color: ternaryThemeColor,
                  fontSize: 14,
                  fontWeight: '700',

                }}
                content="View Invitation Rules"></PoppinsTextMedium>
            </TouchableOpacity>

            <View style={{ height: 100, borderRadius: 10, width: '100%', alignItems: "center", justifyContent: "center", flexDirection: "row", backgroundColor: "#F2F3F5", marginTop: 20 }}>
              <View style={{ alignItems: "center", justifyContent: "center", position: "absolute", left: 20 }}>
                <Icon name="copy-sharp" size={20} color="#7C7979"></Icon>
                <PoppinsTextMedium style={{ color: "#7C7979", marginTop: 6, fontSize: 12 }} content="Copy Link"></PoppinsTextMedium>
              </View>
              <View style={{ alignItems: "center", justifyContent: "center", position: "absolute", left: 110 }}>
                <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={require('../../../assets/images/circularTickGrey.png')}></Image>
                <PoppinsTextMedium style={{ color: "#7C7979", marginTop: 6, width: 100, fontSize: 12 }} content="Friend Registered Successfully"></PoppinsTextMedium>
              </View>
              <View style={{ alignItems: "center", justifyContent: "center", position: "absolute", left: 230 }}>
                <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={require('../../../assets/images/coinStack.png')}></Image>
                <PoppinsTextMedium style={{ color: "#7C7979", marginTop: 6, width: 100, fontSize: 12 }} content="Earn Points Rewards"></PoppinsTextMedium>
              </View>
            </View>
          </View>
          <View style={{ alignItems: "center", justifyContent: 'center', marginTop: 40, width: '100%', backgroundColor: "white", paddingBottom: 20 }}>
            <ButtonRectangle handleOperation={handleProceedButton} style={{ color: 'white' }} backgroundColor="#171717" content="Refer Friend"></ButtonRectangle>

          </View>
        </View>
      </ScrollView>
    </View>

  );
};

const styles = StyleSheet.create({});

export default ReferAndEarn;