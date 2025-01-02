import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Modal,TouchableOpacity ,Image} from "react-native";
import { useDeleteDataMutation } from "../../apiServices/deleteData/deleteDataApi";
import * as Keychain from 'react-native-keychain';
import { useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const DeleteModal = (props) => {
  const [modalVisible, setModalVisible] = useState();
  const navigation = useNavigation()
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";
    const userData = useSelector(state => state.appusersdata.userData)
    console.log("userdata",userData)

  const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loader.gif')).uri;
    const [deleteDataFunc, {
        data: deleteDataData,
        error: deleteDataError,
        isLoading: deleteDataIsLoading,
        isError: deleteDataIsError
      }] = useDeleteDataMutation()

      const handleLogout=async()=>{
    
        try {
          await AsyncStorage.removeItem('loginData')
          navigation.reset({ index: '0', routes: [{ name: 'Splash' }] })
        } catch(e) {
          console.log("error deleting loginData",e)
        }
      
        console.log('Done.')
      
    }
  
    useEffect(()=>{
        if(deleteDataData)
        {
            if(deleteDataData.status==200)
            {
                handleLogout()
            }
            console.log("deleteDataData",deleteDataData)
        }
        else if(deleteDataError)
        {
            console.log("deleteDataError",deleteDataError)
        }
    },[deleteDataData,deleteDataError])

  useEffect(() => {
    setModalVisible(props.modalVisible);
  }, [props.modalVisible]);

  console.log("props.modalVisible", props.modalVisible);

  const deleteData=async()=>{
    const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    console.log(
      'Credentials successfully loaded for user ' + credentials.username
    );
    const token = credentials.username
    deleteDataFunc({token:token,id:userData.id})
  }

  }

  const hideModal=()=>{
    props.hideModal();
    setModalVisible(false);
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible && modalVisible}
      onRequestClose={() => {
        hideModal()
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text
            style={{
              color: ternaryThemeColor,
              fontSize: 28,
              fontWeight: "600",
            }}
          >
            {t("Delete Data")}
          </Text>
          <Text
            style={{
              color: ternaryThemeColor,
              fontSize: 18,
              fontWeight: "500",
              textAlign: "center",
              marginTop: 30,
            }}
          >
            {t("Are you sure you want to delete your profile and all the data associated to it ?")}
          </Text>
          {!deleteDataIsLoading && <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-evenly',width:'100%',marginTop:30}}>
          <TouchableOpacity
            style={{ height: 36,paddingLeft:10,paddingRight:10, borderRadius: 4,backgroundColor:'grey' }}
            onPress={() => {
                hideModal()
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 24,
                fontWeight: "600",
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ height: 36, paddingLeft:10,paddingRight:10, borderRadius: 4,backgroundColor:'grey' }}
            onPress={() => {
                deleteData()
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 24,
                fontWeight: "600",
              }}
            >
              {t("Delete")}
            </Text>
          </TouchableOpacity>
          </View>}
          {
            deleteDataIsLoading &&  <FastImage
            style={{ width: 100, height: 100, alignSelf: 'center', marginTop: '60%' }}
            source={{
              uri: gifUri, // Update the path to your GIF
              priority: FastImage.priority.normal
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          }
          {deleteDataData && deleteDataData.status==200 &&  <Text
            style={{
              color: ternaryThemeColor,
              fontSize: 16,
              fontWeight: "500",
              textAlign: "center",
              marginTop: 30,
            }}
          >
            {t("Profile Deleted Successfully!!")}
          </Text>}
          {
            deleteDataError && <Text
            style={{
              color: ternaryThemeColor,
              fontSize: 16,
              fontWeight: "500",
              textAlign: "center",
              marginTop: 30,
            }}
          >
            {t("There was a prolem in deleting your profile.")}
          </Text>
          }
          
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  modalView: {
    padding: 40,
    margin: 10,
    backgroundColor: "#ECFCFC",
    borderRadius: 20,

    alignItems: "center",
    shadowColor: "#000",
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
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default DeleteModal;