import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { useSelector } from 'react-redux';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import TextInputRectangleMandatory from '../../components/atoms/input/TextInputRectangleMandatory';
import TextInputRectangle from '../../components/atoms/input/TextInputRectangle';
import TextInputNumericRectangle from '../../components/atoms/input/TextInputNumericRectangle';
import InputDate from '../../components/atoms/input/InputDate';
import ImageInput from '../../components/atoms/input/ImageInput';
import ButtonOval from '../../components/atoms/buttons/ButtonOval';
import ProductList from '../../components/molecules/ProductList';
import {  useUploadSingleFileMutation } from '../../apiServices/imageApi/imageApi';
import { useActivateWarrantyMutation } from '../../apiServices/workflow/warranty/ActivateWarrantyApi';
import * as Keychain from 'react-native-keychain';
import moment from 'moment';
import ModalWithBorder from '../../components/modals/ModalWithBorder';
import Icon from 'react-native-vector-icons/Feather';
import Close from 'react-native-vector-icons/Ionicons';
import { createIconSetFromFontello } from 'react-native-vector-icons';
import ErrorModal from '../../components/modals/ErrorModal';
import FastImage from 'react-native-fast-image';
import { gifUri } from '../../utils/GifUrl';
import PrefilledTextInput from '../../components/atoms/input/PrefilledTextInput';
import { useTranslation } from 'react-i18next';

const ActivateWarranty = ({ navigation, route }) => {
  const [responseArray, setResponseArray] = useState([]);
  const [addressData, setAddressData] = useState();
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const [invoice, setInvoice] = useState();
  const [date, setDate] = useState();
  const[emailRequired,setEmailRequired] = useState(true);

  const activatedData = route.params.activatedData
  const navigationFrom = route.params.from
  
  console.log("route.params 11111",route.params)
  
  console.log("route:Activated" ,route.params?.activatedData)
  const [message, setMessage] = useState();
  const [error, setError] = useState(false)
  const [emailValid, setIsValidEmail] = useState(false)
  const [hideButton, setHideButton] = useState(false)
  const [invoiceNo, setInvoiceNo] = useState()

  const{t} = useTranslation()


  //modal
  const [openModalWithBorder, setModalWithBorder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [
    uploadImageFunc,
    {
      data: uploadImageData,
      error: uploadImageError,
      isLoading: uploadImageIsLoading,
      isError: uploadImageIsError,
    },
  ] = useUploadSingleFileMutation();

  // const gifUri = Image.resolveAssetSource(require('../../../assets/gif/cgloader2.gif')).uri;


  const [
    activateWarrantyFunc,
    {
      data: activateWarrantyData,
      error: activateWarrantyError,
      isLoading: activateWarantyIsLoading,
      isError: activateWarrantyIsError,
    },
  ] = useActivateWarrantyMutation();

  const buttonThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : '#ef6110';
  console.log("date console", date)
  const qrData = useSelector(state => state.qrData.qrData);
  const productData = useSelector(state => state.productData.productData);
  console.log('QR data ---- >', qrData);
  const platform = Platform.OS === 'ios' ? '1' : '2';
  const productList = [];
  productList.push(qrData.created_by_name);
  // const productList=route.params.productList
  const height = Dimensions.get('window').height;
  const form = useSelector(state => state.form.warrantyForm);
  const formTemplateId = useSelector(state => state.form.warrantyFormId);
  const userType = useSelector(state => state.appusersdata.userType);
  const userTypeId = useSelector(state => state.appusersdata.userId);
  const userData = useSelector(state => state.appusersdata.userData)
  const location = useSelector(state => state.userLocation.location)

  console.log("userData", userData);
  const workflowProgram = route.params.workflowProgram;

  useEffect(() => {
    if (uploadImageData) {
      console.log("uploadImageData", uploadImageData);
      const uploadArray = []
      uploadArray.push(uploadImageData.body?.fileLink)

      submitDataWithToken(uploadArray);

      if (uploadImageData.success) {
        console.log(uploadImageData.success)
      }

    } else if(uploadImageError) {
      console.log("uploadImageError",uploadImageError);
      setError(true)
      setMessage(uploadImageError.data?.message)
    }
  }, [uploadImageData, uploadImageError]);

  useEffect(() => {
    if (activateWarrantyData) {
      console.log('activate warranty data is', activateWarrantyData);
      if (activateWarrantyData.success) {
        handleWorkflowNavigation()
        setHideButton(false)
        setModalWithBorder(true);
        setMessage(activateWarrantyData?.message)
      }
      else {
        alert(t("Warranty status false"))
      }
    } else if (activateWarrantyError) {
      if (activateWarrantyError.status === 409) {
        handleWorkflowNavigation()
      }
      console.log("activateWarrantyError", activateWarrantyError);
      setError(true)
      setHideButton(false)
      setMessage(activateWarrantyError.data.message)
    }
    
    // console.log('activate warranty is loading', activateWarantyIsLoading);
    setIsLoading(activateWarantyIsLoading);

  }, [activateWarrantyData, activateWarrantyError, activateWarantyIsLoading]);

  const submitDataWithToken = async data => {
    console.log('image data is', data);

    console.log("ldmdkm")
    if(invoiceNo !== null && invoiceNo !== undefined && invoiceNo !==""){
      try {
        const body = {
          name: name,
          phone: phone,
          warranty_start_date: date,
          warranty_image: data,
          user_type_id: navigationFrom == "verify" ? 1 :userTypeId,
          user_type: navigationFrom == "verify" ? "consumer" : userType,
          product_id: productData.product_id,
          form_template_id: JSON.stringify(formTemplateId),
          platform_id: platform,
          platform:platform == 1 ? "ios" : "android",
          secondary_data: responseArray,
          qr_id:  qrData.id ? qrData.id : qrData[0].id,
          invoice_no:invoiceNo
        }
  
        console.log('body is ------->', JSON.stringify(body));
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log(
            'Credentials successfully loaded for user ' + credentials.username,
          );
  
          const token = credentials.username;
          
          console.log("email valid while submission", emailValid)
          if(emailValid || !emailRequired){
            activateWarrantyFunc({ token, body });
            setHideButton(true)
          }
          else{
            setError(true)
            setMessage(t("Please enter a valid email"))
          }
  
        } else {
          console.log('No credentials stored');
        }
      } catch (error) {
        console.log("Keychain couldn't be accessed!", error);
      }
    }
    else{
      setError(true)
      setMessage(t("Please enter invoice number"))
    }
  
  };

  const ModalContent = () => {
    return (
      <View style={{ width: '100%', alignItems: "center", justifyContent: "center" }}>
        <View style={{ marginTop: 30, alignItems: 'center', maxWidth: '80%' }}>
          <Icon name="check-circle" size={53} color={buttonThemeColor} />
          <PoppinsTextMedium style={{ fontSize: 27, fontWeight: '600', color: buttonThemeColor, marginLeft: 5, marginTop: 5 }} content={t("Success")}></PoppinsTextMedium>

          <View style={{ marginTop: 10, marginBottom: 30 }}>
          <PoppinsTextMedium style={{ fontSize: 16, fontWeight: '600', color: "#000000", marginLeft: 5, marginTop: 5, }} content={t(message)}></PoppinsTextMedium>
          </View>

          {/* <View style={{ alignItems: 'center', marginBottom: 30 }}>
            <ButtonOval handleOperation={modalWithBorderClose} backgroundColor="#000000" content="OK" style={{ color: 'white', paddingVertical: 4 }} />
          </View> */}

        </View>

        <TouchableOpacity style={[{
          backgroundColor: buttonThemeColor, padding: 6, borderRadius: 5, position: 'absolute', top: -10, right: -10,
        }]} onPress={() => {
          setModalWithBorder(false)
        }} >
          <Close name="close" size={17} color="#ffffff" />
        </TouchableOpacity>

      </View>
    )
  }



  const warrantyForm =  form ?  Object.values(form) : [];

  console.log("warrantyForm",warrantyForm)
  console.log(warrantyForm);

 
  useEffect(()=>{
    setEmailRequired( (warrantyForm.filter((item) => item.name == "email" )[0]?.required));
    console.log("emailRequired", emailRequired)
  },[warrantyForm])

  // const handleDataTextInputMandatory = (data) => {
  //     console.log(data)
  // }
  // const handleDataTextInput = (data) => {
  //     console.log(data)
  // }
  // const handleOpenImageGallery = async () => {
  //     const result = await launchImageLibrary();
  // };
  const handleChildComponentData = data => {
    console.log(" from child component", data);

    // Update the responseArray state with the new data
    setResponseArray(prevArray => {
      const existingIndex = prevArray.findIndex(
        item => item?.name === data?.name,
      );
        if(data.name == "mobile")
        {
          const reg = '^([0|+[0-9]{1,5})?([6-9][0-9]{9})$';
          const mobReg = new RegExp(reg)
         
            if(mobReg.test(data?.value))
          {
        
          }
          else{
            console.log("DataValue Mobile", data?.value)
            setError(true)
            setMessage(t("Kindly enter a valid mobile number"))
          }
        }
        
      if (data?.name == "email") {
        if(data?.required==true)
        {
          setEmailRequired(true);
          // console.log('entering')
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          const checkEmail = emailRegex.test(data?.value)
         
          setIsValidEmail(checkEmail);
        
          console.log("check email",emailRegex.test(data?.value))
        }
        else{
          setEmailRequired(false);
          console.log("In else Email" ,data.value)
          if(data.value == "" || data.value == undefined){
            setIsValidEmail(true)
          }
          else{
            // console.log('entering')
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            const checkEmail = emailRegex.test(data?.value)
           
            setIsValidEmail(checkEmail);
          
            console.log("check email",emailRegex.test(data?.value))
          }

        }
       
      }
      

      if (existingIndex !== -1) {
        // If an entry for the field already exists, update the value
        const updatedArray = [...prevArray];
        updatedArray[existingIndex] = {
          ...updatedArray[existingIndex],
          value: data?.value,
        };
        return updatedArray;
      } else {
        // If no entry exists for the field, add a new entry
        return [...prevArray, data];
      }
    });
  };
  


  const handleWarrantyFormSubmission = () => {
    // setIsLoading(true);

    console.log('Response Array Is', JSON.stringify(responseArray),Object.keys(form)!==responseArray.length);
    if(Object.keys(form).length!==responseArray.length)
    {
      console.log("inside if statement")
      setError(true)
      setMessage("Kindly fill all the details to continue")
    }
    else{
      if(emailValid)
      {
        responseArray &&
        responseArray.map(item => {
          if (item.name === 'name' || item.name === 'Name') {
            setName(item.value);
          } else if (item.name === 'phone' || item.name === 'Phone' || item.name === "mobile" || item.name === "Mobile") {

            setPhone(item.value);
          } 
          else if (item.name === 'invoice_no' ) {

            setInvoiceNo(item.value);
          } 

          else if (item.name === 'invoice' || item.name === 'Invoice') {
            console.log('Inside file');
  
            const imageData = {
              uri: item.value,
              name: item.value.slice(0, 10),
              type: 'image/png',
            };
            console.log("imageData------>",imageData)
            const uploadFile = new FormData();
            uploadFile.append('image', imageData);
            // console.log("invoice data",item.value)
            // if(item.value===undefined)
            // {
            //   setError(true)
            //   setMessage("Kindly upload the invoice/bill ")
            // }
            // else{
              const getToken = async () => {
                const credentials = await Keychain.getGenericPassword();
                const token = credentials.username;
                uploadImageFunc({ body: uploadFile,token:token });
               
            }
    
            getToken()
            
  
            // }
          } else if (item.name === 'dop' || item.name === "Date Of Purchase") {
            setDate(item.value);
          }
        });
      }
      else{
        setError(true)
        setMessage("Please enter a valid email")
      }
     
    }
    //    console.log(productData)
  };


  const handleWorkflowNavigation = () => {
    console.log('scccess');

    if (workflowProgram[0] === 'Static Coupon') {
      navigation.navigate('CongratulateOnScan', {
        workflowProgram: workflowProgram.slice(1),
        rewardType: "Static Coupon"
      });
    } else if (workflowProgram[0] === 'Warranty') {
      navigation.navigate('ActivateWarranty', {
        workflowProgram: workflowProgram.slice(1),

      });
    } else if (workflowProgram[0] === 'Points On Product') {
      console.log(workflowProgram.slice(1));
      navigation.navigate('CongratulateOnScan', {
        workflowProgram: workflowProgram.slice(1),
        rewardType: "Points On Product"
      });
    } else if (workflowProgram[0] === 'Cashback') {
      console.log(workflowProgram.slice(1));
      navigation.navigate('CongratulateOnScan', {
        workflowProgram: workflowProgram.slice(1),
        rewardType: 'Cashback'
      });
    } else if (workflowProgram[0] === 'Wheel') {
      console.log(workflowProgram.slice(1));
      navigation.navigate('CongratulateOnScan', {
        workflowProgram: workflowProgram.slice(1),
        rewardType: "Wheel"
      });
    } else if (workflowProgram[0] === 'Genuinity') {
      navigation.navigate('Genuinity', {
        workflowProgram: workflowProgram.slice(1),
      });
    } else {
      setTimeout(() => {
        navigation.navigate('Dashboard');

      }, 1000)
    }
  };

  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: buttonThemeColor,
      }}>
      
      <View
        style={{
          height: '10%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
        }}>
        <TouchableOpacity
          style={{ height: 20, width: 20, position: 'absolute', left: 10 }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{ height: 20, width: 20, resizeMode: 'contain' }}
            source={require('../../../assets/images/blackBack.png')}></Image>
        </TouchableOpacity>
        <PoppinsTextMedium
          style={{
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
            position: 'absolute',
            left: 60,
          }}
          content="Activate Warranty"></PoppinsTextMedium>
      </View>
      <ScrollView
        style={{
          width: '100%',
          height: '90%',
          position: 'absolute',
          bottom: 0,
          flex: 1,
          backgroundColor: 'white',
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
        }}>
          {error && (
        <ErrorModal
          modalClose={() => {
            setError(false)
            setMessage('')
          }}
          message={message}
          openModal={error}></ErrorModal>
      )}
      {/* {success && (
            <MessageModal
              modalClose={modalClose}
              title={modalTitle}
              message={message}
              openModal={success}></MessageModal>)
           } */}
      {openModalWithBorder &&
        <ModalWithBorder
          modalClose={() => {
            setModalWithBorder(false)
            setMessage(false)
          }
          }
          message={message}
          openModal={openModalWithBorder}
          comp={ModalContent}></ModalWithBorder>
      }
        <View
          style={{
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <ProductList list={productList}></ProductList>
          {warrantyForm &&
            warrantyForm.map((item, index) => {
              console.log(item);
              if (item.type === 'text') {
                if (item.name === 'name') {
                  return (
                    <TextInputRectangleMandatory
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      value={navigationFrom == "verify" ? route?.params?.name : userData.name}
                      placeHolder={item.name}>
                      {' '}
                    </TextInputRectangleMandatory>
                  );
                }
                else if ((item.name).trim().toLowerCase() === "city" && location !== undefined) {

                  return (
                    <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      value={location.city}
                    ></PrefilledTextInput>
                  )
                }
                
                else if ((item.name).trim().toLowerCase() === "pincode" && location !== undefined) {
                  return (
                    <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      value={location.postcode}
                    ></PrefilledTextInput>
                  )
                }
                
                else if ((item.name).trim().toLowerCase() === "state" && location !== undefined) {
                  return (
                    <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      value={location.state}
                    ></PrefilledTextInput>
                  )
                }
                else if ((item.name).trim().toLowerCase() === "district" && location !== undefined) {

                  return (
                    <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      value={location.district}
                    ></PrefilledTextInput>
                  )



                } else if (item.name === 'phone' || item.name === "mobile") {
                  return (
                    <TextInputNumericRectangle
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      value={navigationFrom == "verify" ? route?.params.mobile : userData.mobile}
                      label={item.label}
                      maxLength ={10}
                      isEditable={false}
                      placeHolder={item.name}>
                      {' '}
                    </TextInputNumericRectangle>
                  );
                }
                else if (item.name === 'product_name' || item.name === "product_name") {
                  return (
                    <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      placeHolder={item.name}
                      isEditable={false}
                      value={activatedData?.[0]?.created_by_name}
                    ></PrefilledTextInput>
                  );
                }
                else if (item.name === 'product_code' || item.name === "product_code") {
                  return (
                    <PrefilledTextInput
                    jsonData={item}
                    key={index}
                    handleData={handleChildComponentData}
                    placeHolder={item.name}
                    isEditable={false}
                    value={activatedData?.[0]?.product_code}
                  ></PrefilledTextInput>
                  );
                }
                else {
                  return (
                    <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleChildComponentData}
                      label={item.label}
                      placeHolder={item.name}>
                      {' '}
                    </PrefilledTextInput>
                  );
                }
              } else if (item.type === 'file') {
                return (
                  <ImageInput
                    jsonData={item}
                    handleData={handleChildComponentData}
                    key={index}
                    data={item.name}
                    action="Select File"></ImageInput>
                );
              } else if (item.type === 'date') {
                return (
                  <InputDate
                    jsonData={item}
                    handleData={handleChildComponentData}
                    data={item.label}
                    minDate ={moment().subtract(1, 'months').toDate()}
                    key={index}></InputDate>
                );
              }
            })}

            
            
          {
            activateWarantyIsLoading && <FastImage
              style={{ width: 100, height: 100, alignSelf: 'center',position:'absolute', marginTop:'50%' }}
              source={{
                uri: gifUri, // Update the path to your GIF
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
          }
          {
            warrantyForm.length===0 && <PoppinsTextMedium style={{color:"red",fontSize:18}} 
            content ={t("Warranty form not created")}
            ></PoppinsTextMedium>

          }
          {warrantyForm.length!==0 && !hideButton && <ButtonOval
            handleOperation={() => {
              handleWarrantyFormSubmission();
            }}
            content={t("Submit")}
            style={{
              paddingLeft: 30,
              paddingRight: 30,
              padding: 10,
              color: 'white',
              fontSize: 16,
            }}></ButtonOval>}
        </View>



      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ActivateWarranty;