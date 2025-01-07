
import React,{useState,useEffect} from 'react';
import {View, StyleSheet,TextInput,Modal,Pressable,Text,Image,Keyboard} from 'react-native';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';
import { useVerifyGstMutation } from '../../../apiServices/verification/GstinVerificationApi';
import ZoomImageAnimation from '../../animations/ZoomImageAnimation';

const TextInputGST = (props) => {
    const [value,setValue] = useState()
    const [modalVisible, setModalVisible] = useState(false);
    const [keyboardShow, setKeyboardShow] = useState(false);

    const placeHolder = props.placeHolder
    const required = props.required
  const label = props.label
    const [verifyGstFunc,{
        data:verifyGstData,
        error:verifyGstError,
        isLoading:verifyGstIsLoading,
        isError:verifyGstIsError
      }]= useVerifyGstMutation()

    console.log("Aadhar TextInput")
    Keyboard.addListener('keyboardDidShow',()=>{
      setKeyboardShow(true)
  })
Keyboard.addListener('keyboardDidHide',()=>{
      setKeyboardShow(false)
  })
    useEffect(()=>{
        if(value?.length===15)
        {
          const data = {
            "gstin":value,
    
        }
        verifyGstFunc(data)
          console.log(data)
        }
      },[value])
      
      useEffect(()=>{handleInputEnd()},[keyboardShow])

      useEffect(()=>{
        if(verifyGstData)
        {
        console.log("verifyGstData",verifyGstData)
        if(verifyGstData.success)
        {
          
        setModalVisible(true)
        }
        
        }
        else if(verifyGstError)
        {
        console.log("verifyGstError",verifyGstError)
        }
        },[verifyGstData,verifyGstError])
        
    const handleInput=(text)=>{
        setValue(text)
        // props.handleData(value)
       
    }
    
    const handleInputEnd=()=>{
        let tempJsonData ={...props.jsonData,"value":value}
        console.log(tempJsonData)
        props.handleData(tempJsonData)
    }

    return (
        <View style={{height:60,width:'86%',borderWidth:1,borderColor:'#DDDDDD',alignItems:"center",justifyContent:"center",backgroundColor:'white',margin:10}}>
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
            <ZoomImageAnimation style={{marginBottom:20}} zoom={100} duration={1000}  image={require('../../../../assets/images/greenTick.png')}></ZoomImageAnimation>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
            <View style={{alignItems:"center",justifyContent:'center',backgroundColor:'white',position:"absolute",top:-15,left:16}}>
                <PoppinsTextMedium style={{color:"#919191",padding:4,fontSize:18}} content = {label}></PoppinsTextMedium>
            </View>
            <TextInput maxLength={12} onSubmitEditing={(text)=>{handleInputEnd()}} onEndEditing={(text)=>{handleInputEnd()}} style={{height:50,width:'100%',alignItems:"center",justifyContent:"flex-start",fontWeight:'500',marginLeft:24,color:'black',fontSize:16}} placeholderTextColor="grey" onChangeText={(text)=>{handleInput(text)}} value={value} placeholder={required ? `${placeHolder} *`: `${placeHolder}`}></TextInput>
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
      borderRadius:4,
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
      fontSize:18,
      color:'black',
      fontWeight:'600'
    },
  });

export default TextInputGST;