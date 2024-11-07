import React, {useState,useEffect} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import { useSelector } from 'react-redux';
import  Icon  from 'react-native-vector-icons/MaterialIcons';

const SuccessModal = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
    useEffect(()=>{
      if(props.openModal===true)
    {
        setModalVisible(true)
    }
    else{
        setModalVisible(false)
    }
    },[])
    const closeModal=()=>{
      setModalVisible(!modalVisible)
      props.modalClose()
    }


  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          props.modalClose()
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Success</Text>
            <Icon name="tick" size={100} color="red"></Icon>

            <Text style={{...styles.modalText,fontSize:20,fontWeight:'600'}}>{props.message}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => closeModal()}>
              <Text style={styles.textStyle}>Hide</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
    borderRadius: 20,
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
  },
});

export default SuccessModal;