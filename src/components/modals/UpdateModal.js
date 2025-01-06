import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, Modal, TouchableOpacity, Text, Linking } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useSelector } from "react-redux";
const UpdateModal = (props) => {

    const [modalVisible, setModalVisible] = useState(false)

    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
    
    const closeModal = () => {
        props.modalClose()
        setModalVisible(!modalVisible)
      }

      useEffect(() => {
        if (props.openModal === true) {
          setModalVisible(true)
        }
        else {
          setModalVisible(false)
        }
      }, [])

    useEffect(()=>{
        setModalVisible(true)
    },[])

  return (
    <Modal
    
      animationType="slide"
      transparent={true}
      visible={modalVisible} // You can replace this with your state variable indicating whether the modal should be shown or not
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
        <Text style={{color:"black",fontSize:18,fontWeight:'600',textAlign:'center',marginBottom:20}}>
                Please Update
            </Text>
        <Icon name ="system-update" size={50} color={ternaryThemeColor}></Icon>
        <Text style={{color:ternaryThemeColor,fontSize:18,fontWeight:'600',textAlign:'center',marginTop:10}}>
                Kindly update the app to resume scanning
            </Text>
        <View style={{marginTop:40,alignItems:'center',justifyContent:'center',flexDirection:'row',width:'100%'}}>
        {/* <TouchableOpacity onPress={()=>{
            setModalVisible(false)
        }} style={{height:50,width:100,alignItems:'center',justifyContent:'center',backgroundColor:ternaryThemeColor,borderRadius:10}}>
            <Text style={{color:"white",fontSize:18,fontWeight:'600'}}>
                Cancel
            </Text>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={()=>{
             Linking.openURL(
                "https://play.google.com/store/apps/details?id=com.genefied.expolo"
              )
        }} style={{height:50,width:100,alignItems:'center',justifyContent:'center',backgroundColor:ternaryThemeColor,borderRadius:10}}>
            <Text style={{color:"white",fontSize:18,fontWeight:'600'}}>
                Update
            </Text>
        </TouchableOpacity>
        </View>
        
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
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
    
  },
  modalView: {

    backgroundColor: 'white',
    borderRadius: 20,
    width:'90%',
    padding: 60,
    paddingTop:30,
    paddingBottom:40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth:3,
    borderColor:'#c43b3d'
   
  },
  button: {
    borderRadius: 30,
    padding: 14,
    elevation: 2,
    marginTop: 10
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },

  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize:16
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
export default UpdateModal;
