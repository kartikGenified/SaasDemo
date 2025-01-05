import React, { useDeferredValue, useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions, ScrollView, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetFormMutation } from '../../apiServices/workflow/GetForms';
import * as Keychain from 'react-native-keychain';
import TextInputRectangle from '../../components/atoms/input/TextInputRectangle';
import TextInputNumericRectangle from '../../components/atoms/input/TextInputNumericRectangle';
import InputDate from '../../components/atoms/input/InputDate';
import ImageInput from '../../components/atoms/input/ImageInput';
import TextInputAadhar from '../../components/atoms/input/TextInputAadhar';
import TextInputPan from '../../components/atoms/input/TextInputPan';
import TextInputGST from '../../components/atoms/input/TextInputGST';
import PrefilledTextInput from '../../components/atoms/input/PrefilledTextInput';
import PincodeTextInput from '../../components/atoms/input/PincodeTextInput';
import DropDownRegistration from '../../components/atoms/dropdown/DropDownRegistration';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useRegisterUserByBodyMutation } from '../../apiServices/register/UserRegisterApi';
import { useGetLocationFromPinMutation } from '../../apiServices/location/getLocationFromPincode';
import { useIsFocused } from '@react-navigation/native';
import ErrorModal from '../../components/modals/ErrorModal';
import MessageModal from '../../components/modals/MessageModal';
import { useCreateUserMappingMutation } from '../../apiServices/userMapping/userMappingApi';
import { useGetFormAccordingToAppUserTypeFormIdMutation } from '../../apiServices/workflow/GetForms';
import ListUsers from './ListUsers';
import { useTranslation } from 'react-i18next';

const AddUser = ({ navigation }) => {
  const [addUserForm, setAddUserForm] = useState()
  const [selectedOption, setSelectedOption] = useState([]);
  const [userResponse, setUserResponse] = useState([])
  const [location, setLocation] = useState()
  const [selectUsers, setSelectUsers] = useState()
  const [userTypeList, setUserTypeList] = useState()
  const [selectedFromDropDown, setSelectedFromDropDown] = useState("")
  const [message, setMessage] = useState();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [modalTitle, setModalTitle] = useState()
  const [keyboardShow, setKeyboardShow] = useState(false)
  const [removedUser, setRemovedUser] = useState()
  const [emailValid, setIsValidEmail] = useState(true);
  const [disableButton, setDisableButton] = useState(false)
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
   const {t} = useTranslation()
  const userData = useSelector(state => state.appusersdata.userData)
  const allUsers = useSelector(state => state.appusers.appUsersData)

  const usersList = useSelector(state => state.userMapping.canMapUsers)
  console.log("userData", userData, allUsers, usersList)
  const height = Dimensions.get('window').height
  const focused = useIsFocused()
  const [getFormFunc, {
    data: getFormData,
    error: getFormError,
    isLoading: getFormIsLoading,
    isError: getFormIsError
  }] = useGetFormMutation();

  const [getLocationFromPincodeFunc, {
    data: getLocationFormPincodeData,
    error: getLocationFormPincodeError,
    isLoading: getLocationFormPincodeIsLoading,
    isError: getLocationFromPincodeIsError
  }] = useGetLocationFromPinMutation()

  const [getFormAccordingToAppUserTypeFormIdFunc, {
    data: getFormAccordingToAppUserTypeFormIdData,
    error: getFormAccordingToAppUserTypeFormIdError,
    isLoading: getFormAccordingToAppUserTypeFormIdIsLoading,
    isError: getFormAccordingToAppUserTypeFormIdIsError
  }] = useGetFormAccordingToAppUserTypeFormIdMutation()

  const [createUserMapping, {
    data: getUserMappingPincodeData,
    error: getuserMappingError,
    isLoading: getuserMappingIsLoading,
    isError: getUserMappingIsError
  }] = useCreateUserMappingMutation()

  const [registerUserFunc, {
    data: registerUserData,
    error: registerUserError,
    isLoading: registerUserIsLoading,
    isError: registerUserIsError
  }] = useRegisterUserByBodyMutation()


  Keyboard.addListener('keyboardDidShow', () => {
    setKeyboardShow(true)
  })
  Keyboard.addListener('keyboardDidHide', () => {
    setKeyboardShow(false)
  })

  var allUsersData = []
  var allUsersList = []

  useEffect(() => {
    let temparr = allUsers
    allUsers.map((item, index) => {
      allUsersData.push({
        "userType": item.user_type,
        "userTypeId": item.user_type_id
      })
      allUsersList.push(item.user_type)
    })

    console.log("allUsersList", allUsersList)
    setSelectUsers(allUsersList)
    setUserTypeList(allUsersData)
    console.log("allUsersData", allUsersData)
    const index = temparr.indexOf(userData.user_type.charAt(0).toUpperCase() + userData.user_type.slice(1))
    console.log("index", index, temparr, userData.user_type)
    // setRemovedUser(temparr.splice(index,1))
    // const arr = temparr.splice(index,1)
    // console.log(arr)
  }, [])

  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      const formId = "7"
      const AppUserType = selectedFromDropDown
      getFormAccordingToAppUserTypeFormIdFunc({ formId, AppUserType })
    }
    getToken()
  }, [focused, selectedFromDropDown])

  useEffect(() => {
    if (getUserMappingPincodeData) {
      console.log("getUserMappingPincodeData", getUserMappingPincodeData)
    }
    else {
      console.log("getuserMappingError", getuserMappingError)
    }
  }, [getUserMappingPincodeData, getuserMappingError])

  useEffect(() => {
    if (registerUserData) {
      console.log("registerUserData", registerUserData)
      if (registerUserData.success) {

        const body = {
          user_type: userData.user_type,
          user_type_id: userData.user_type_id,
          app_user_id: userData.id,
          app_user_name: userData.name,
          app_user_mobile: userData.mobile,
          mapped_user_type: registerUserData.body.user_type,
          mapped_user_type_id: Number(registerUserData.body.user_type_id),
          mapped_app_user_id: registerUserData.body.id,
          mapped_app_user_name: registerUserData.body.name,
          mapped_app_user_mobile: registerUserData.body.mobile,
        };

        console.log("the body", body)
        const getToken = async () => {
          const credentials = await Keychain.getGenericPassword();
          const token = credentials.username;

          let params = {
            token: token,
            body: { "rows": [body] }
          }
          createUserMapping(params)
        }
        getToken()

        setSuccess(true)
        setMessage(registerUserData.message)
        setModalTitle(`Dear ${userData.name}`)



      }
    }
    else if (registerUserError) {
      setError(true)
      if (registerUserError.status === 400) {
        setMessage(t("Kindly fill the form"))

      }
      else if (registerUserError.status === 401) {
        setMessage(t("Your session is not valid"))

      }
      setMessage(registerUserError.data?.message)
      console.log("registerUserError", registerUserError)
    }
  }, [registerUserData, registerUserError])

  useEffect(() => {
    if (getFormAccordingToAppUserTypeFormIdData) {
      if (getFormAccordingToAppUserTypeFormIdData.success && Object.keys(getFormAccordingToAppUserTypeFormIdData.body).length > 0) {
        const template = getFormAccordingToAppUserTypeFormIdData.body.template
        const formTemplate = Object.values(template)
        console.log("getFormAccordingToAppUserTypeFormIdData", formTemplate)

        setAddUserForm(formTemplate)
      }
    }
    else if (getFormAccordingToAppUserTypeFormIdError) {
      console.log("getFormAccordingToAppUserTypeFormIdError", getFormAccordingToAppUserTypeFormIdError)
    }
  }, [getFormAccordingToAppUserTypeFormIdData, getFormAccordingToAppUserTypeFormIdError])


  useEffect(() => {
    if (getLocationFormPincodeData) {
      console.log("getLocationFormPincodeData", getLocationFormPincodeData)
      if (getLocationFormPincodeData.success) {
        setDisableButton(false)
        const address = getLocationFormPincodeData.body[0].office + ", " + getLocationFormPincodeData.body[0].district + ", " + getLocationFormPincodeData.body[0].state + ", " + getLocationFormPincodeData.body[0].pincode
        let locationJson = {

          lat: "N/A",
          lon: "N/A",
          address: address,
          city: getLocationFormPincodeData.body[0].district,
          district: getLocationFormPincodeData.body[0].division,
          state: getLocationFormPincodeData.body[0].state,
          country: "N/A",
          postcode: getLocationFormPincodeData.body[0].pincode


        }
        console.log("location locationJSon", locationJson)
        setLocation(locationJson)
      }
    }
    else if (getLocationFormPincodeError) {
      console.log("getLocationFormPincodeError", getLocationFormPincodeError)
      setError(true)
      setMessage(t("Please enter a valid pincode"))
      setDisableButton(true)
    }
  }, [getLocationFormPincodeData, getLocationFormPincodeError])

  const handleData = (data,title) => {
    console.log("removedValues",data, title);

    let submissionData = [...userResponse];
    let removedValues = submissionData.filter((item, index) => {
      return item.name !== data.name;
    });

    if(data?.name == "mobile")
    {
      const reg = '^([0|+[0-9]{1,5})?([6-9][0-9]{9})$';
      const mobReg = new RegExp(reg)
      if (data?.value?.length === 10) {
        if(mobReg.test(data?.value))
      {
        setDisableButton(false)
      }
      else{
        setDisableButton(true)
        setError(true)
        setMessage(t("Kindly enter a valid mobile number"))
      }
    }
    
  }
    if (data?.name == "email") {
      if(data.required==true)
      {
      console.log('entering')
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const checkEmail = emailRegex.test(data.value)
      setIsValidEmail(checkEmail);
      }
      else{
        if(data.value=="" || data.value ==undefined)
        {
        setIsValidEmail(true)
        }
        else{
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const checkEmail = emailRegex.test(data.value)
      setIsValidEmail(checkEmail);
        }
      }
      
    }


    if (data.name === "user_type") {
      console.log("inside user_type", userTypeList)
      userTypeList.map((item, index) => {
        console.log("item", item)
        if (item.userType === data.value) {
          removedValues.push({
            value: item.userTypeId,
            name: "user_type_id",
          });
        }
      })
    }


  

    // console.log("removedValues", removedValues);
    removedValues.push({
      value: data.value,
      name: data.name,
    });
    setUserResponse(removedValues);
    console.log("removedValues", removedValues);

  };

  const getLocationFromPinCode = async (pin) => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        'Credentials successfully loaded for user ' + credentials.username
      );
      const token = credentials.username
      const params = {
        pincode: pin,
        token: token

      }
      getLocationFromPincodeFunc(params)

    }
  }
  const handleFetchPincode = (data) => {
    console.log("pincode is", data)
    getLocationFromPinCode(data)

  }
  const handleDataFromDropDown = (data) => {
    console.log("handle data", data)
    setSelectedFromDropDown(data?.value)

  }
  const modalClose = () => {
    setError(false);
    setSuccess(false)
  };

  // const handleSubmission = () => {
  //   let user_type_id;
  //   if (selectedFromDropDown !== "") {
  //     for (var i = 0; i < allUsers.length; i++) {
  //       const capitalizedUserType = selectedFromDropDown.charAt(0).toUpperCase() + selectedFromDropDown.slice(1)
  //       if (allUsers[i].name === capitalizedUserType) {
  //         console.log("allUsers", allUsers)
  //         user_type_id = allUsers[i].id
  //       }
  //     }
  //   }
    
  //   const inputFormData = {}
  //   inputFormData["is_approved_needed"] = true;
  //   inputFormData["is_online_verification"] = false;
  //   inputFormData["added_through"] = "app";
  //   inputFormData["added_by_name"] = userData.name
  //   inputFormData["added_by_id"] = userData.user_type_id;
  //   inputFormData["user_type_id"] = user_type_id
  //   inputFormData["user_type"] = selectedFromDropDown

  //   for (var i = 0; i < userResponse.length; i++) {
  //     console.log(userResponse[i])
  //     inputFormData[userResponse[i].name] = userResponse[i].value
  //   }

  //   const body = inputFormData
  //   console.log("emailvalid", emailValid)

  //   if(!emailValid){
  //       setError(true)
  //       setMessage("Please enter a valid email")
  //   }else{
  //     console.log("add user body",body)
  //     registerUserFunc(body)    
  //   }
 
  // }
  const handleSubmission = () => {
    let user_type_id;
    if (selectedFromDropDown !== "") {
        for (var i = 0; i < allUsers.length; i++) {
            const capitalizedUserType = selectedFromDropDown.charAt(0).toUpperCase() + selectedFromDropDown.slice(1);
            if (allUsers[i].name === capitalizedUserType) {
                console.log("allUsers", allUsers);
                user_type_id = allUsers[i].id;
            }
        }
    }

    const inputFormData = {};
    inputFormData["is_approved_needed"] = true;
    inputFormData["is_online_verification"] = false;
    inputFormData["added_through"] = "app";
    inputFormData["added_by_name"] = userData.name;
    inputFormData["added_by_id"] = userData.user_type_id;
    inputFormData["user_type_id"] = user_type_id;
    inputFormData["user_type"] = selectedFromDropDown;
    
    // Check for required fields
    const requiredFields = addUserForm.filter(field => field.required).map(field => field.name);
    const missingFields = requiredFields.filter(field => {
        const fieldValue = userResponse.find(response => response.name === field)?.value;
        return !fieldValue;
    });

    if (missingFields.length > 0) {
        setError(true);
        const fields = missingFields.map((item,index)=>{
          return t(item)
        })
        console.log("fields hello", fields)
        setMessage(`${t("Please fill in the required fields:")} ${(fields).join(', ')}`);
        return;
    }

    for (var i = 0; i < userResponse.length; i++) {
        console.log(userResponse[i]);
        inputFormData[userResponse[i].name] = userResponse[i].value;
    }

    const body = inputFormData;
    console.log("emailvalid", emailValid);

    if (!emailValid) {
        setError(true);
        setMessage(t("Please enter a valid email"));
    } else {
        console.log("add user body", body);
        if(inputFormData["mobile"]?.length<10)
    {
      setError(true)
      setMessage(t("Kindly enter a valid mobile number"))
    }

    else{
      if(inputFormData["pincode"]!=undefined)
      {
        if(inputFormData["pincode"]?.length<6)
        {
          setError(true)
          setMessage(t("Please enter a valid pincode"))
        }
        else{
          registerUserFunc(body);
        }
      }
      else{
        registerUserFunc(body);
      }
      

    }
    }
};


  return (
    <View style={{ height: '100%', width: '100%', alignItems: "center", justifyContent: "center", backgroundColor: ternaryThemeColor, flex: 1 }}>
      {error && (
        <ErrorModal
          modalClose={modalClose}

          message={message}
          openModal={error}></ErrorModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          title={modalTitle}
          message={message}
          openModal={success}
          navigateTo="Dashboard"
        ></MessageModal>
      )}
      <View style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row", width: '100%', marginTop: 20, height: '10%', marginLeft: 20, }}>
        <TouchableOpacity onPress={() => {
          navigation.goBack()
        }}>
          <Image style={{ height: 24, width: 24, resizeMode: 'contain', marginLeft: 10 }} source={require('../../../assets/images/blackBack.png')}></Image>

        </TouchableOpacity>
        <PoppinsTextMedium content={t("Add User")} style={{ marginLeft: 10, fontSize: 16, fontWeight: '600', color: 'white' }}></PoppinsTextMedium>

      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', backgroundColor: 'white', height: '90%', borderTopRightRadius: 30, borderTopLeftRadius: 30, paddingTop: 40 }}>
        {/* <KeyboardAvoidingView style={{width:"100%"}}> */}
        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: "center", justifyContent: "center", }}>
          {usersList.length === 0 && <PoppinsTextMedium content={t("There are no user to select")} style={{ color: 'black', fontSize: 16 }}></PoppinsTextMedium>}
          {usersList.length !== 0 && <DropDownRegistration
            title={selectedOption?.[0]}
            header={selectedOption?.[0] ? selectedOption?.[0] : selectUsers ? selectUsers : ("Select Type")}
            jsonData={{ "label": "UserType", "maxLength": "100", "name": "user_type", "options": [], "required": true, "type": "text" }}
            data={usersList}
            handleData={handleDataFromDropDown}
          ></DropDownRegistration>}

          {addUserForm &&
            addUserForm.map((item, index) => {
              console.log("items in the list are", item)

              if (item.type === 'text') {

                if (item.name === 'phone' || item.name === "mobile") {
                  return (
                    <TextInputNumericRectangle
                      jsonData={item}
                      key={index}
                      maxLength={10}
                      handleData={handleData}
                      placeHolder={item.name}
                      label={item.label}
                      required={item.required}
                      disp={item.name}
                    >
                      {' '}
                    </TextInputNumericRectangle>
                  );

                }
                else if ((item.name).trim().toLowerCase() === "name") {

                  return (
                    <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleData}
                      placeHolder={item.name}
                      required={item.required}
                      label={item.label}
                    ></PrefilledTextInput>
                  )
                }
                // } 

                else if (item.name === 'aadhaar' || item.name === "aadhar") {
                  console.log("aadhar")
                  return (
                    <TextInputAadhar
                      jsonData={item}
                      key={index}
                      handleData={handleData}
                      placeHolder={item.name}
                      label={item.label}
                      required={item.required}
                    >
                      {' '}
                    </TextInputAadhar>
                  );
                }
                else if (item.name === 'pan') {
                  console.log("pan")
                  return (
                    <TextInputPan
                      jsonData={item}
                      key={index}
                      handleData={handleData}
                      placeHolder={item.name}
                      label={item.label}
                      required={item.required}
                    >
                      {' '}
                    </TextInputPan>
                  );
                }
                else if (item.name === 'gstin') {
                  console.log("gstin")
                  return (
                    <TextInputGST
                      jsonData={item}
                      key={index}
                      handleData={handleData}
                      placeHolder={item.name}
                      required={item.required}
                      label={item.label}>
                      {' '}
                    </TextInputGST>
                  );
                }
                else if ((item.name).trim().toLowerCase() === "city" ) {

                  return (
                    <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleData}
                      placeHolder={item.name}
                      value={location?.city}
                      label={item.label}
                      required={item.required}
                      isEditable ={true}
                    ></PrefilledTextInput>
                  )



                }
                else if ((item.name).trim().toLowerCase() === "pincode") {
                  return (
                    <PincodeTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleData}
                      handleFetchPincode={handleFetchPincode}
                      placeHolder={item.name}
                      value={location?.postcode}
                      label={item.label}
                      required={item.required}
                      maxLength={6}
                    ></PincodeTextInput>
                    
                  )
                }

                else if ((item.name).trim().toLowerCase() === "state" ) {
                  console.log("inside state", item)
                  return (
                    <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleData}
                      placeHolder={item.name}
                      value={location?.state}
                      label={item.label}
                      required={item.required}
                      isEditable={false}
                    ></PrefilledTextInput>
                  )
                }
                else if ((item.name).trim().toLowerCase() === "district" ) {

                  return (
                    <PrefilledTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleData}
                      placeHolder={item.name}
                      value={location?.district}
                      label={item.label}
                      required={item.required}
                      isEditable={false}
                    ></PrefilledTextInput>
                  )



                }
                else {
                  return (
                    <TextInputRectangle
                      jsonData={item}
                      key={index}
                      handleData={handleData}
                      placeHolder={item.name}
                      required={item.required}
                      label={item.label}>
                      {' '}
                    </TextInputRectangle>
                  );
                }
              }
              else if (item.type === 'number') {

                if (item.name === 'phone' || item.name === "mobile") {
                  return (
                    <TextInputNumericRectangle
                      jsonData={item}
                      key={index}
                      maxLength={10}
                      handleData={handleData}
                      placeHolder={item.name}
                      label={item.label}
                      required={item.required}
                    >
                      {' '}
                    </TextInputNumericRectangle>
                  );

                }
                if (item.name === 'pincode' || item.name === "postcode") {
                  return (
                    <PincodeTextInput
                      jsonData={item}
                      key={index}
                      handleData={handleData}
                      handleFetchPincode={handleFetchPincode}
                      placeHolder={item.name}
                      label={item.label}
                      required={item.required}
                      maxLength={6}
                    ></PincodeTextInput>
                  );

                }
              }

              else if (item.type === 'file') {
                return (
                  <ImageInput
                    jsonData={item}
                    handleData={handleData}
                    key={index}
                    data={item.name}
                    label={item.label}
                    required={item.required}
                    action="Select File"></ImageInput>
                );
              } else if (item.type === 'date') {
                return (
                  <InputDate
                    jsonData={item}
                    handleData={handleData}
                    data={item.label}
                    required={item.required}
                    key={index}></InputDate>
                );
              }
              else if (item.type === "select") {
                return (
                  <DropDownRegistration
                    key={index}
                    title={item.name}
                    header={item.label}
                    jsonData={item}
                    data={item.options}
                    handleData={handleData}
                  ></DropDownRegistration>
                );
              }
            })

          }

          {
            selectUsers && removedUser &&
            <DropDownRegistration
              title="user_type"
              header="UserType"
              jsonData={{ "label": "UserType", "maxLength": "100", "name": "user_type", "options": [], "required": true, "type": "text" }}
              data={removedUser}
              handleData={handleData}
            ></DropDownRegistration>
          }

          {usersList.length != 0 && !disableButton &&  <TouchableOpacity onPress={() => {
            handleSubmission()
          }} style={{ height: 40, width: 120, borderRadius: 4, backgroundColor: ternaryThemeColor, alignItems: "center", justifyContent: "center", marginBottom: 30 }}>

            <PoppinsTextMedium content={t("Proceed")} style={{ color: 'white', fontSize: 20, }}></PoppinsTextMedium>
          </TouchableOpacity>
          }

        </ScrollView>
        {/* </KeyboardAvoidingView> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({})

export default AddUser;