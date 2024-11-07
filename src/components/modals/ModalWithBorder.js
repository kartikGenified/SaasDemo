import React, { useState, useEffect } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const ModalWithBorder = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const navigation = useNavigation()
  const navigateTo = props.navigateTo
  const Comp = props.comp

  useEffect(() => {
    if (props.openModal === true) {
      console.log("Trying to close the modal")
      setModalVisible(true)
    }
    else {
      setModalVisible(false)
    }
  }, [])
  
  const closeModal = () => {

    setModalVisible(!modalVisible)
    props.modalClose()
    navigateTo && navigation.navigate(navigateTo)
  }



  return (
    
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          closeModal()
        }}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { borderWidth: 3, borderColor: ternaryThemeColor, }]}>
            <Comp></Comp>
          </View>
          </View>
        
      </Modal>
    
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
  modalView: {
    backgroundColor: 'white',
    // marginHorizontal: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    width: '80%',
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
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default ModalWithBorder;