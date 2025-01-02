import React, {useState,useEffect} from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View,BackHandler} from 'react-native';
import { useSelector } from 'react-redux';
import  Icon  from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
const MessageModal = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
  const {t} = useTranslation()
    
    const navigation = useNavigation()
    const navigateTo = props.navigateTo
    const params = props.params
    console.log(navigateTo,params)
    useEffect(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true)
      return () => backHandler.remove()
    }, [])
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
    setModalVisible(false)
    props.modalClose()
    navigateTo && navigation.replace(navigateTo,params)
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
         navigateTo &&  navigation.replace(navigateTo)
        }}>
        <View style={styles.centeredView}>
          <View style={{...styles.modalView,borderWidth:3,borderColor:'#2FBA7E'}}>
          <Icon name="cloud-done" size={100} color="#2FBA7E"></Icon>
          <Text style={{color:'black',fontSize:24,fontWeight:'600'}}>{t("Success")}</Text>
          <Text style={{...styles.modalText,fontSize:18,fontWeight:'500', color:'black',marginTop:20}}>{props.message}</Text>
            <Pressable
              style={{...styles.button,backgroundColor:'#2FBA7E',width:240}}
              onPress={() => closeModal()}>
              <Text style={styles.textStyle}>{t("Okay")}</Text>
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
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  modalView: {
  
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 60,
    paddingTop:10,
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
    position:"absolute",
   
  },
  button: {
    borderRadius: 30,
    padding: 14,
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
    color:'black'
  },
});

export default MessageModal;