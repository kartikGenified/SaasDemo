import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Dimensions,
  Text,
} from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import {useSelector} from 'react-redux';
import {useAddBankDetailsMutation} from '../../apiServices/bankAccount/AddBankAccount';
import * as Keychain from 'react-native-keychain';
import TextInputRectangularWithPlaceholder from '../../components/atoms/input/TextInputRectangularWithPlaceholder';
import ShowLoadingButtonSmall from '../../components/atoms/buttons/ShowLoadingButtonSmall';
import MessageModal from '../../components/modals/MessageModal';
import ErrorModal from '../../components/modals/ErrorModal';
import BottomModal from '../../components/modals/BottomModal';
import Info from 'react-native-vector-icons/AntDesign';
import {useVerifyPanMutation} from '../../apiServices/verification/PanVerificationApi';
import VerifyUpi from '../../apiServices/bankAccount/VerifyUpi';
import { useDeleteBankMutation } from '../../apiServices/bankAccount/DeleteBankAccount';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const AddUpi = ({navigation}) => {
  const [upi, setUpi] = useState();
  const [message, setMessage] = useState();
  const [data, setData] = useState()
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState();
  const [nameInitialsCapital, setNameInitialsCapital] = useState('');
  const [error, setError] = useState(false);
  const [openBottomModal, setOpenBottomModal] = useState(false);
  const [hidebutton, setHideButton] = useState(false)
  const focused = useIsFocused()
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';

  const [
    deleteBankFunc,
    {
      data: deleteBankData,
      error: deleteBankError,
      isLoading: deleteBankIsLoading,
      isError: deleteBankIsError,
    },
  ] = useDeleteBankMutation();
  const [
    addBankDetailsFunc,
    {
      data: addBankDetailsData,
      error: addBankDetailsError,
      isError: addBankDetailsIsError,
      isLoading: addBankDetailsIsLoading,
    },
  ] = useAddBankDetailsMutation();

  const {t} = useTranslation()

  useEffect(()=>{
    setHideButton(false)
  },[focused])

  useEffect(() => {
    if (addBankDetailsData) {
      console.log('addBankDetailsData', addBankDetailsData);
      if (addBankDetailsData.message === 'Bank Account Created') {
        addBankDetailsData.body.bene_name == null &&
          getInitials(addBankDetailsData.body.bene_details.bene_name);
        setName(addBankDetailsData.body.bene_details.bene_name);
        setData(addBankDetailsData.body)
        setOpenBottomModal(true);
        setMessage(t('UPI Added Successfully'));
        setTimeout(() => {
          setSuccess(false);
          // navigation.navigate("BankAccounts",{refresh:true})
        }, 2000);
        setHideButton(false)
      }
    } else if (addBankDetailsError) {
      console.log('addBankDetailsError', addBankDetailsError);
      setError(true);
      setHideButton(false)
      setMessage(addBankDetailsError.data.message);
    }
  }, [addBankDetailsData, addBankDetailsError]);
  useEffect(()=>{
    if(deleteBankData)
    {
console.log("deleteBankData",deleteBankData)
if(deleteBankData.success)
{
    
}

    }
    else if(deleteBankError)
    {
console.log("deleteBankError",deleteBankError)
    }
},[deleteBankData,deleteBankError])

  const getInitials = name => {
    const initialsArray = name?.split(' ');
    let nameInitialsTemp = '';
    initialsArray.map(item => {
      nameInitialsTemp = nameInitialsTemp + item.charAt(0).toUpperCase();
    });
    console.log('initials', nameInitialsTemp);
    setNameInitialsCapital(nameInitialsTemp);
  };
  
  const deleteData=async(data)=>{
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        'Credentials successfully loaded for user ' + credentials.username
      );
      const token = credentials.username 
      const id = data
        
      const params = {
        token:token,
        id:id
      }
      deleteBankFunc(params)

    }
}
  const modalClose = () => {
    setError(false);
  };
  const submitData = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        'Credentials successfully loaded for user ' + credentials.username,
      );
      const token = credentials.username;
      const data = {
        upi_id: upi,
        transfer_mode: 'upi',
      };
      console.log(data);
      const params = {token: token, data: data};
      console.log(params);
      addBankDetailsFunc(params);
      setHideButton(true)
    }
  };
  const submitUpi = () => {
    console.log(upi);

    submitData();
  };
  const bottomModalClose = () => {
    setOpenBottomModal(false);
  };
  const getUpiId = data => {
    console.log(data);
    setUpi(data);
  };
  const ModalContent = () => {
    return (
      <View
        style={{
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '100%',
          marginTop: 50,
        }}>
        <View
          style={{
            height: 50,
            width: 50,
            borderRadius: 2,
            backgroundColor: ternaryThemeColor,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 20,
          }}>
          {nameInitialsCapital && (
            <PoppinsTextMedium
              style={{color: 'white', fontSize: 22, fontWeight: '700'}}
              content={nameInitialsCapital}></PoppinsTextMedium>
          )}
        </View>
        <View
          style={{
            width: '100%',
            alignItems: 'flex-start',
            justifyContent: 'center',
            borderBottomWidth: 1,
            borderColor: '#DDDDDD',
            paddingBottom: 10,
          }}>
          {nameInitialsCapital && (
            <PoppinsTextMedium
              style={{
                color: '#9A9A9A',
                fontSize: 12,
                fontWeight: '600',
                marginTop: 10,
                marginLeft: 20,
              }}
              content="upi belongs to"></PoppinsTextMedium>
          )}
          {nameInitialsCapital && (
            <PoppinsTextMedium
              style={{
                color: '#353535',
                fontSize: 12,
                fontWeight: '600',
                marginLeft: 20,
              }}
              content={name}></PoppinsTextMedium>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
          }}>
          <Info
            style={{marginLeft: 20}}
            name="infocirlce"
            color={ternaryThemeColor}
            size={20}></Info>
          <Text
            style={{
              color: '#9A9A9A',
              fontSize: 12,
              width: '72%',
              textAlign: 'left',
              marginLeft: 10,
            }}>
            comfirm account details before proceeding.
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            marginTop: 30,
            paddingBottom: 10,
            width: '100%',
          }}>
          <TouchableOpacity
            onPress={() => {
              setOpenBottomModal(false);
              {data && deleteData(data.id)}
            }}
            style={{
              height: 50,
              width: 160,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: 'black',
            }}>
            <PoppinsTextMedium
              style={{color: '#9A9A9A', fontSize: 16, width: '80%'}}
              content="Change"></PoppinsTextMedium>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>{
            setOpenBottomModal(false)
            navigation.navigate("BankAccounts")
          }}
            style={{
              height: 50,
              width: 160,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#171717',
              borderWidth: 1,
              borderColor: 'black',
            }}>
            <PoppinsTextMedium
              style={{color: 'white', fontSize: 16, width: '80%'}}
              content="Confirm"></PoppinsTextMedium>
          </TouchableOpacity>
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
      {error && (
        <ErrorModal
          modalClose={modalClose}
          title="Error"
          message={message}
          openModal={error}></ErrorModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          title="Success"
          message={message}
          openModal={success}></MessageModal>
      )}
      {openBottomModal && (
        <BottomModal
          modalClose={bottomModalClose}
          message={message}
          openModal={openBottomModal}
          comp={ModalContent}></BottomModal>
      )}

      <View
        style={{
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '100%',
          height: '14%',
          marginTop: 10,
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
          content={t("Enter UPI Address")}
          style={{
            fontSize: 22,
            fontWeight: '700',
            color: 'white',
            marginLeft: 30,
          }}></PoppinsTextMedium>
      </View>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          width: '100%',
          backgroundColor: 'white',
          height: '86%',
          paddingTop: 40,
        }}>
        <TextInputRectangularWithPlaceholder
          handleData={getUpiId}
          placeHolder={t("Enter UPI ID")}></TextInputRectangularWithPlaceholder>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <View style={{flexDirection: 'row', position: 'absolute', left: 0}}>
            <PoppinsTextMedium
              style={{color: '#919191', marginLeft: 30}}
              content={t("dont have UPI")}></PoppinsTextMedium>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddBankDetails');
              }}>
              <PoppinsTextMedium
                style={{
                  color: '#2C2C2C',
                  marginLeft: 10,
                  textDecorationLine: 'underline',
                }}
                content={t("add account details")}></PoppinsTextMedium>
            </TouchableOpacity>
          </View>
        </View>
       {!hidebutton && <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 20,
            width: '100%',
          }}>
          <ShowLoadingButtonSmall
            handleData={submitUpi}
            title={t("verify")}></ShowLoadingButtonSmall>
        </View>
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default AddUpi;
