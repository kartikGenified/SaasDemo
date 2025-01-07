import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Modal, Pressable, Text, Image, Keyboard } from 'react-native';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';
import { useVerifyPanMutation } from '../../../apiServices/verification/PanVerificationApi';
import ZoomImageAnimation from '../../animations/ZoomImageAnimation';
import ErrorModal from '../../modals/ErrorModal';
import { useTranslation } from 'react-i18next';
const TextInputPan = (props) => {
  const [value, setValue] = useState()
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState();
  const [keyboardShow, setKeyboardShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [panVerified, setPanVerified] = useState(false)
  const placeHolder = props.placeHolder
  const required = props.required
  let displayText = props.placeHolder

  const label = props.label
  const [verifyPanFunc, {
    data: verifyPanData,
    error: verifyPanError,
    isLoading: verifyPanIsLoading,
    isError: verifyPanIsError
  }] = useVerifyPanMutation()

  const {t} = useTranslation()

  if(displayText=="pan" || displayText == "Pan"){
      displayText = "Pan"
  }

  console.log("Aadhar TextInput")
  Keyboard.addListener('keyboardDidShow', () => {
    setKeyboardShow(true)
  })
  Keyboard.addListener('keyboardDidHide', () => {
    setKeyboardShow(false)
  })
  useEffect(() => {
    if (value) {
      if (value.length === 10) {

        //   const data = {
        //     "name":name,
        //   "pan":pan
        // }

        const data = {
          // "name":"Test2",
          "pan": value
        }
        verifyPanFunc(data)
        console.log(value)
        setValue(value)

      }
    }
  }, [value])



  useEffect(() => {
    if (verifyPanData) {
      console.log("verifyPanData", verifyPanData)
      if (verifyPanData.success) {
        setModalVisible(true)
        setSuccess(true)
        props.panVerified(true)
      }
    }
    else if (verifyPanError) {
      console.log("verifyPanError", verifyPanError)
      setError(true)
      setMessage(verifyPanError.data.message)
    }
  }, [verifyPanData, verifyPanError])
  useEffect(() => { handleInputEnd() }, [keyboardShow])
  const handleInput = (text) => {
    setValue(text)
    // props.handleData(value)

  }
  const modalClose = () => {
    setError(false);
  };
  const handleInputEnd = () => {
    let tempJsonData = { ...props.jsonData, "value": value }
    console.log(tempJsonData)
    props.handleData(tempJsonData)
  }

  return (
    <View style={{ height: 60, width: '86%', borderWidth: 1, borderColor: '#DDDDDD', alignItems: "center", justifyContent: "center", backgroundColor: 'white', margin: 10 }}>
      {error && (
        <ErrorModal
          modalClose={modalClose}

          message={message}
          openModal={error}></ErrorModal>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {

          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Pan Verified Succesfully</Text>
            <ZoomImageAnimation style={{ marginBottom: 20 }} zoom={100} duration={1000} image={require('../../../../assets/images/greenTick.png')}></ZoomImageAnimation>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={{ alignItems: "center", justifyContent: 'center', backgroundColor: 'white', position: "absolute", top: -15, left: 16 }}>
        <PoppinsTextMedium style={{ color: "#919191", padding: 4, fontSize: 18 }} content={t(displayText)}></PoppinsTextMedium>
      </View>
      <View style={{ width: '80%', alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 10 }}></View>
      <TextInput maxLength={10} onSubmitEditing={(text) => { handleInputEnd() }} onEndEditing={(text) => { handleInputEnd() }} style={{ height: 50, width: '100%', alignItems: "center", justifyContent: "flex-start", fontWeight: '500', marginLeft: 24, color: 'black', fontSize: 16 }} placeholderTextColor="grey" onChangeText={(text) => { handleInput(text) }} value={value} placeholder={required ? `${placeHolder} *` : `${placeHolder}`}></TextInput>
      {success && <View style={{ alignItems: 'center', justifyContent: 'center', width: '20%', position: 'absolute', right: 0 }}>
        <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../../assets/images/greenTick.png')}></Image>
      </View>}
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 4,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
    fontWeight: '600'
  },
});

export default TextInputPan;