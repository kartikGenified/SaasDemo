import React, {useState,useEffect} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import { useSelector } from 'react-redux';
import  Icon  from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
const CustomModal = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
    const navigation = useNavigation()
    const navigateTo = props.navigateTo
    const Comp = props.comp
  useEffect(()=>{
    if(props.openModal===true)
    
    {
      console.log("Trying to close the modal")
        setModalVisible(true)
    }
    else{
        setModalVisible(false)
    }
  },[])
  const closeModal=()=>{
   
    setModalVisible(!modalVisible)
    props.modalClose()
    navigateTo && navigation.navigate(navigateTo)
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
          <Comp></Comp>
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
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  modalView: {
   
    backgroundColor: 'white',
   borderTopLeftRadius:40,
   borderTopRightRadius:40,
    width:'100%',
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

export default CustomModal;