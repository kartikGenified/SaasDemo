import React, { useEffect, useState } from 'react';
import { View, Modal, Text, StyleSheet } from 'react-native';

const InternetModal = (props) => {
  const [modalVisible, setModalVisible] = useState(false)
  const Comp = props.comp
  const visible = props.visible

  useEffect(()=>{
    setModalVisible(props.visible)
  },[visible])

  console.log("internet modal visible", visible)
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible} // You can replace this with your state variable indicating whether the modal should be shown or not
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Comp></Comp>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default InternetModal;
