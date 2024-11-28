import React, { useState, useEffect } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View, Image } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Cancel from 'react-native-vector-icons/MaterialIcons'


const ErrorModal = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [warningMode, setWaringMode] = useState(props?.warning)
  const navigation = useNavigation()
  const ternaryThemeColor = useSelector(state => state.apptheme.ternaryThemeColor)
  const productData = props.productData;
  const type = props.type
  const title = props.title
  const navigateTo = props.navigateTo
  const warning = props.warning 

  console.log("product data in report an issue", productData,navigateTo)

  const {t} = useTranslation()

  
  useEffect(() => {
    if (props.openModal === true) {
      setModalVisible(true)
    }
    else {
      setModalVisible(false)
    }
    if(props.warning == true){
      setWaringMode(true)
    }
  }, [])

  useEffect(()=>{
    // navigation.navigate(navigateTo)
  },[navigateTo])
  const closeModal = () => {
   
    
    navigateTo &&  navigation.replace(navigateTo)
    
    props.modalClose()
    setModalVisible(!modalVisible)
  }

  const reportAndNavigate= () => {
    setModalVisible(!modalVisible)
    // props.modalClose()

   productData && navigation.navigate("ReportAndIssue", { productData: productData })

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
          <View style={{ ...styles.modalView,   borderColor:warning? "#E38C27" :'#c43b3d'}}>
            {/* <Image style={{ width: 80, height: 80, resizeMode: 'contain' }} source={require('../../../assets/images/failed.png')}></Image> */}
            <Cancel name="cancel" size = {100} color={warningMode ? "#E38C27" : "#FF3436"}></Cancel>
            {title && <Text style={{ color: warningMode ? "#E38C27" : '#FF5D5D', fontSize: 24, fontWeight: '700' }}>{title}</Text>}
            {!title && <Text style={{ color: warningMode ? "#E38C27" : '#FF5D5D', fontSize: 24, fontWeight: '700' }}>{warning? "Warning" : t("Error")}</Text>}

            <Text style={{ ...styles.modalText, fontSize: 20, fontWeight: '600', color: 'black' }}>{props.message}</Text>
            <Pressable
              style={{ ...styles.button, backgroundColor: warningMode ?"#E38C27": '#FF3436', width: 240 }}
              onPress={() => closeModal()}>
              <Text style={styles.textStyle}>{t("Try Again")}</Text>
            </Pressable>

            {props.isReportable &&
              <Pressable
                style={{ ...styles.button, backgroundColor: warningMode? "#E38C27" :"red", width: 100, marginTop: 10 }}
                onPress={() => reportAndNavigate()}>
                <Text style={styles.textStyle}>Report</Text>
              </Pressable>
            }

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

export default ErrorModal;