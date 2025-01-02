import React, { Component, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useSelector } from "react-redux";
import RectanglarUnderlinedTextInput from "../../components/atoms/input/RectanglarUnderlinedTextInput";
import RectangularUnderlinedDropDown from "../../components/atoms/dropdown/RectangularUnderlinedDropDown";
import FeedbackTextArea from "../../components/feedback/FeedbackTextArea";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
import {
  useGetFormAccordingToAppUserTypeFormIdMutation,
  useGetFormMutation,
} from "../../apiServices/workflow/GetForms";
import * as Keychain from "react-native-keychain";
import PrefilledTextInput from "../../components/atoms/input/PrefilledTextInput";
import TextInputAadhar from "../../components/atoms/input/TextInputAadhar";
import TextInputPan from "../../components/atoms/input/TextInputPan";
import TextInputGST from "../../components/atoms/input/TextInputGST";
import TextInputNumericRectangle from "../../components/atoms/input/TextInputNumericRectangle";
import ImageInput from "../../components/atoms/input/ImageInput";
import InputDate from "../../components/atoms/input/InputDate";
import DropDownRegistration from "../../components/atoms/dropdown/DropDownRegistration";
import TextInputRectangle from "../../components/atoms/input/TextInputRectangle";
import { useRequestAppointmentMutation } from "../../apiServices/requestAppointment/requestAppointmentApi";
import ErrorModal from "../../components/modals/ErrorModal";
import MessageModal from "../../components/modals/MessageModal";
import { useTranslation } from "react-i18next";

// create a component
const RequestAppointment = ({ navigation, route }) => {
  const [formArr, setformArr] = useState([]);
  const [userResponse, setUserResponse] = useState([]);
  const [desc, setDesc] = useState("");
  const [disableButton, setDisableButton] = useState(false)
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const appUserType = route.params?.userType;
  const userId = route.params?.userId;
  const needsApproval = route.params?.needsApproval;

  // console.warn("sadasdasdhjasfgdhfgasf", route.params)
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";

  const [
    getFormFunc,
    {
      data: getFormData,
      error: getFormError,
      isLoading: getFormIsLoading,
      isError: getFormIsError,
    },
  ] = useGetFormAccordingToAppUserTypeFormIdMutation();

  const [
    submitFomrFunc,
    {
      data: submitFormData,
      error: submitFormError,
      isLoading: submitFormIsLoading,
      isError: submitFormIsError,
    },
  ] = useRequestAppointmentMutation();

  useEffect(() => {
    if (submitFormData) {
      console.log("submitFormData", submitFormData);
      if (submitFormData?.success) {
        setSuccess(true);
        setMessage(submitFormData?.message);
      }
    } else if (submitFormError) {
      console.log("submitForm Error", submitFormError);
      setError(true);
      setMessage(submitFormError?.data?.message);
    }
  }, [submitFormData, submitFormError]);

  const userData = useSelector((state) => state.appusersdata.userData);

  console.log("usedata", userData);

  const getReason = (val) => {
    console.log("sel", val);
  };
  const handleFeedbackChange = (val) => {
    setDesc(val);
  };

  useEffect(() => {
    const getForm = async () => {
      try {
        // Retrieve the credentials
        getFormFunc({ formId: "9", AppUserType: appUserType });
      } catch (error) {
        console.log("Keychain couldn't be accessed!", error);
      }
    };
    getForm();
  }, []);

  useEffect(() => {
    if (getFormData) {
      console.log("getFormData", getFormData);
      let obj = Object.values(getFormData?.body?.template);
      setformArr(obj);
      console.log("formarr", formArr, getFormData);
    } else {
      console.log("getFormError", getFormError);
    }
  }, [getFormData, getFormError]);

  const handleData = (data) => {
    console.log("removedValues", data);

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
    let submissionData = [...userResponse];
    let removedValues = submissionData.filter((item, index) => {
      return item.name !== data.name;
    });

    // console.log("removedValues", removedValues);
    removedValues.push({
      value: data.value,
      name: data.name,
    });
    setUserResponse(removedValues);
    console.log("removedValues", removedValues);
  };

  const submitData = () => {
    const inputFormData = {};
    inputFormData["description"] = desc;
    inputFormData["user_type"] = appUserType;
    inputFormData["user_type_id"] = userId;

    for (var i = 0; i < userResponse.length; i++) {
      console.log(userResponse[i]);
      inputFormData[userResponse[i].name] = userResponse[i].value;
    }
    const body = inputFormData;
    console.log("body ENquiry boidy", body);

    submitFomrFunc(body);
  };

  const onCloseModal = () => {
    setError(false);
    setSuccess(false);
    setMessage("");
  };

  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Navigator */}
      <View
        style={{
          height: 50,
          width: "100%",
          backgroundColor: ternaryThemeColor,
          alignItems: "flex-start",
          justifyContent: "center",
          flexDirection: "row",
          // marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={{
            height: 20,
            width: 20,
            position: "absolute",
            left: "4%",
            marginTop: "4%",
          }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{ height: 20, width: 20, resizeMode: "contain" }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>

        <PoppinsTextMedium
          style={{
            fontSize: 20,
            color: "#ffffff",
            marginTop: "3%",
            position: "absolute",
            left: 50,
          }}
          content={t("Request inquiry")}
        ></PoppinsTextMedium>
      </View>
      {/* navigator */}

      <View style={{ marginTop: "20%", alignItems: "center" }}>
        {/* <RectangularUnderlinedDropDown header="Appointment Reason" data={["anfnf", "djdjd"]} handleData={getReason}></RectangularUnderlinedDropDown> */}

        {/* <View style={{ marginTop: 20, width: '100%' }}>
                    <FeedbackTextArea onFeedbackChange={handleFeedbackChange} placeholder={"Write Your Message here"} />
                </View>  */}

        {formArr &&
          formArr?.map((item, index) => {
            if (item.type === "text") {
              if (item.name === "phone" || item.name === "mobile") {
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
                    {" "}
                  </TextInputNumericRectangle>
                );
              } else if (item.name.trim().toLowerCase() === "name") {
                return (
                  <PrefilledTextInput
                    jsonData={item}
                    key={index}
                    handleData={handleData}
                    placeHolder={item.name}
                    required={item.required}
                    label={item.label}
                  ></PrefilledTextInput>
                );
              }
              // }
              else if (item.name === "aadhaar" || item.name === "aadhar") {
                console.log("aadhar");
                return (
                  <TextInputAadhar
                    jsonData={item}
                    key={index}
                    handleData={handleData}
                    placeHolder={item.name}
                    label={item.label}
                    required={item.required}
                  >
                    {" "}
                  </TextInputAadhar>
                );
              } else if (item.name === "pan") {
                console.log("pan");
                return (
                  <TextInputPan
                    jsonData={item}
                    key={index}
                    handleData={handleData}
                    placeHolder={item.name}
                    label={item.label}
                    required={item.required}
                  >
                    {" "}
                  </TextInputPan>
                );
              } else if (item.name === "gstin") {
                console.log("gstin");
                return (
                  <TextInputGST
                    jsonData={item}
                    key={index}
                    handleData={handleData}
                    placeHolder={item.name}
                    required={item.required}
                    label={item.label}
                  >
                    {" "}
                  </TextInputGST>
                );
              } else if (
                item.name.trim().toLowerCase() === "city" &&
                location !== undefined
              ) {
                return (
                  <PrefilledTextInput
                    jsonData={item}
                    key={index}
                    handleData={handleData}
                    placeHolder={item.name}
                    value={location.city}
                    label={item.label}
                    required={item.required}
                  ></PrefilledTextInput>
                );
              } else if (item.name.trim().toLowerCase() === "pincode") {
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
              } else if (
                item.name.trim().toLowerCase() === "state" &&
                location !== undefined
              ) {
                console.log("inside state", item);
                return (
                  <PrefilledTextInput
                    jsonData={item}
                    key={index}
                    handleData={handleData}
                    placeHolder={item.name}
                    value={location.state}
                    label={item.label}
                    required={item.required}
                  ></PrefilledTextInput>
                );
              } else if (
                item.name.trim().toLowerCase() === "district" &&
                location !== undefined
              ) {
                return (
                  <PrefilledTextInput
                    jsonData={item}
                    key={index}
                    handleData={handleData}
                    placeHolder={item.name}
                    value={location.district}
                    label={item.label}
                    required={item.required}
                  ></PrefilledTextInput>
                );
              } else {
                return (
                  <TextInputRectangle
                    jsonData={item}
                    key={index}
                    handleData={handleData}
                    placeHolder={item.name}
                    required={item.required}
                    label={item.label}
                  >
                    {" "}
                  </TextInputRectangle>
                );
              }
            } else if (item.type === "number") {
              if (item.name === "phone" || item.name === "mobile") {
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
                    {" "}
                  </TextInputNumericRectangle>
                );
              }
              if (item.name === "pincode" || item.name === "postcode") {
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
            } else if (item.type === "file") {
              return (
                <ImageInput
                  jsonData={item}
                  handleData={handleData}
                  key={index}
                  data={item.name}
                  label={item.label}
                  required={item.required}
                  action="Select File"
                ></ImageInput>
              );
            } else if (item.type === "date") {
              return (
                <InputDate
                  jsonData={item}
                  handleData={handleData}
                  data={item.label}
                  required={item.required}
                  key={index}
                ></InputDate>
              );
            } else if (item.type === "select") {
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
          })}
          {/* navigation.navigate('PasswordLogin',{needsApproval:needsApproval, userType:userType, userId:userId}) */}

        {error && (
          <ErrorModal
            modalClose={() => {
              onCloseModal();
            }}
            message={message}
            openModal={error}
            
          ></ErrorModal>
        )}

        {success && (
          <MessageModal
            modalClose={() => {
              onCloseModal();
            }}
            title={"Success"}
            message={message}
            openModal={success}
            navigateTo="PasswordLogin"
            params={{
              userType: appUserType,
              userId: userId,
              needsApproval: needsApproval,
            }}
          ></MessageModal>
        )}

        {!disableButton && <TouchableOpacity
          style={{ width: "92%", borderRadius: 15, marginTop: 30 }}
          onPress={() => {
            submitData();
          }}
        >
          <PoppinsTextMedium
             content={t("Request Appointment")}
            style={{
              backgroundColor: ternaryThemeColor,
              height: 50,
              color: "white",
              fontWeight: "800",
              borderRadius: 5,
              textAlignVertical: "center",
            }}
          ></PoppinsTextMedium>
        </TouchableOpacity>}
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: "white",
  },
});

//make this component available to the app
export default RequestAppointment;
