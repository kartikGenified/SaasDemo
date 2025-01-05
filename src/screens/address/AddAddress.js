import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useSelector, useDispatch } from "react-redux";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import { useGetLocationFromPinMutation } from "../../apiServices/location/getLocationFromPincode";
import Geolocation from "@react-native-community/geolocation";
import PincodeTextInput from "../../components/atoms/input/PincodeTextInput";
import PrefilledTextInput from "../../components/atoms/input/PrefilledTextInput";
import * as Keychain from "react-native-keychain";
import { useAddAddressMutation } from "../../apiServices/userAddress/UserAddressApi";
import MessageModal from "../../components/modals/MessageModal";
import ErrorModal from "../../components/modals/ErrorModal";
import { useIsFocused } from "@react-navigation/native";
import { getCurrentLocation } from "../../utils/getCurrentLocation"; 
import { GoogleMapsKey } from "@env";
import { useTranslation } from "react-i18next";

const AddAddress = ({ navigation }) => {
  const [message, setMessage] = useState();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [responseArray, setResponseArray] = useState([]);
  const [fieldIsEmpty, setFieldIsEmpty] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [location, setLocation] = useState();
  const {t} = useTranslation()
  const dispatch = useDispatch();
  const focused = useIsFocused();
  const [
    getLocationFromPincodeFunc,
    {
      data: getLocationFormPincodeData,
      error: getLocationFormPincodeError,
      isLoading: getLocationFormPincodeIsLoading,
      isError: getLocationFromPincodeIsError,
    },
  ] = useGetLocationFromPinMutation();
  const [
    addAddressFunc,
    {
      data: addAddressData,
      error: addAddressError,
      isLoading: addAddressIsLoading,
      isError: addAddressIsError,
    },
  ] = useAddAddressMutation();

  useEffect(() => {
    setHideButton(false);
  }, [focused]);

  useEffect(() => {
    if (addAddressData) {
      console.log("addAddressData", addAddressData);
      if (addAddressData.success) {
        setHideButton(false);
        setSuccess(true);
        setMessage(addAddressData.message);
      }
    } else if (addAddressError) {
      console.log("addAddressError", addAddressError);
      setError(true);
      setHideButton(false);
      setMessage(t("Address can't be added"));
    }
  }, [addAddressData, addAddressError]);

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";

  useEffect(async() => {
    const getCurrLocation = await getCurrentLocation()
    setLocation(getCurrLocation)
    dispatch(setLocation(getCurrLocation))
  }, []);

  useEffect(() => {
    if (getLocationFormPincodeData) {
      console.log("getLocationFormPincodeData", getLocationFormPincodeData);
      if (getLocationFormPincodeData.success) {
        const address =
          getLocationFormPincodeData.body[0].office +
          ", " +
          getLocationFormPincodeData.body[0].district +
          ", " +
          getLocationFormPincodeData.body[0].state +
          ", " +
          getLocationFormPincodeData.body[0].pincode;
        let locationJson = {
          lat: "N/A",
          lon: "N/A",
          address: address,
          city: getLocationFormPincodeData?.body[0]?.district,
          district: getLocationFormPincodeData?.body[0]?.division,
          state: getLocationFormPincodeData?.body[0]?.state,
          country: "N/A",
          postcode: getLocationFormPincodeData?.body[0]?.pincode,
        };
        console.log(locationJson);
        setLocation(locationJson);
      }
    } else if (getLocationFormPincodeError) {
      console.log("getLocationFormPincodeError", getLocationFormPincodeError);
      setError(true);
      setMessage(t("Please enter a valid pincode"));
    }
  }, [getLocationFormPincodeData, getLocationFormPincodeError]);

  const handleChildComponentData = (data) => {
    console.log("from text input", data);

    // Update the responseArray state with the new data
    setResponseArray((prevArray) => {
      const existingIndex = prevArray.findIndex(
        (item) => item?.name === data?.name
      );

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

  const handleFetchPincode = (data) => {
    console.log("pincode is", data);
    getLocationFromPinCode(data);
  };
  const modalClose = () => {
    setError(false);
    setSuccess(false);
  };

  const getLocationFromPinCode = async (pin) => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        "Credentials successfully loaded for user " + credentials.username
      );
      const token = credentials.username;
      const params = {
        pincode: pin,
        token: token,
      };
      getLocationFromPincodeFunc(params);
    }
  };
  const addAddress = async () => {
    let check = false;
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        "Credentials successfully loaded for user " + credentials.username
      );
      const token = credentials.username;
      if (responseArray.length !== 0) {
        console.log("response array", responseArray);
        let address = "";
        let data = {};
        for (var i = 0; i < responseArray.length; i++) {
          if (i !== 0) {
            address = address + ", " + responseArray[i].value;
          } else {
            address = address + responseArray[i].value;
          }
        }
        data["address"] = address;
        // console.log("address", address,responseArray);
        for (var i = 0; i < responseArray.length; i++) {
          if (responseArray[i].name === "state") {
            data["state"] = responseArray[i]?.value;
          } else if (responseArray[i].name === "city") {
            data["city"] = responseArray[i]?.value;
          } else if (responseArray[i].name === "district") {
            data["district"] = responseArray[i]?.value;
          } else if (responseArray[i].name === "postcode") {
            data["pincode"] = responseArray[i]?.value;
          } else if (responseArray[i].name === "houseNumber") {
            if (responseArray[i]?.value === undefined) {
              check = true;
            }
          } else if (responseArray[i].name === "street") {
            if (responseArray[i].value === undefined) {
              check = true;
            }
          }
        }
        console.log(data);
        const params = {
          token: token,
          data: data,
        };
        console.log("addAddressFunc",params)
        !check && addAddressFunc(params);
        !check && setHideButton(true);
        check && alert("fields cant be empty");
      } else {
        console.log("response Array is empty");
      }
    }
  };

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        flex: 1,
        backgroundColor: "white",
      }}
    >
      {/* Navigator */}
      <View
        style={{
          height: "10%",
          width: "100%",
          backgroundColor: ternaryThemeColor,
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",

          // marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={{ height: 20, width: 20, marginLeft: 10 }}
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
          style={{ fontSize: 20, color: "#ffffff", marginLeft: 10 }}
          content={t("Add Address")}
        ></PoppinsTextMedium>
      </View>
      {/* navigator */}
      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
        ></ErrorModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          title={"Thanks"}
          message={message}
          openModal={success}
          navigateTo="ListAddress"
        ></MessageModal>
      )}
      {
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <PrefilledTextInput
            jsonData={{
              label: "House Number",
              maxLength: "100",
              name: "houseNumber",
              options: [],
              required: true,
              type: "text",
            }}
            handleData={handleChildComponentData}
            placeHolder={"House Number"}
            label={"House Number"}
          ></PrefilledTextInput>

          <PrefilledTextInput
            jsonData={{
              label: "Street",
              maxLength: "100",
              name: "street",
              options: [],
              required: true,
              type: "text",
            }}
            handleData={handleChildComponentData}
            placeHolder={"Street"}
            label={"Street"}
          ></PrefilledTextInput>

          <PincodeTextInput
            jsonData={{
              label: "PostCode",
              maxLength: "100",
              name: "postcode",
              options: [],
              required: true,
              type: "text",
            }}
            handleData={handleChildComponentData}
            handleFetchPincode={handleFetchPincode}
            placeHolder={"PostCode"}
            value={location?.postcode}
            label={"PostCOde"}
            maxLength={6}
          ></PincodeTextInput>
          <PrefilledTextInput
            jsonData={{
              label: "City",
              maxLength: "100",
              name: "city",
              options: [],
              required: true,
              type: "text",
            }}
            handleData={handleChildComponentData}
            placeHolder={"City"}
            value={location?.city}
            label={"City"}
            isEditable={false}
          ></PrefilledTextInput>

          <PrefilledTextInput
            jsonData={{
              label: "District",
              maxLength: "100",
              name: "district",
              options: [],
              required: true,
              type: "text",
            }}
            handleData={handleChildComponentData}
            placeHolder={"District"}
            value={location?.district}
            label={"District"}
            isEditable={false}
          ></PrefilledTextInput>
          <PrefilledTextInput
            jsonData={{
              label: "State",
              maxLength: "100",
              name: "state",
              options: [],
              required: true,
              type: "text",
            }}
            handleData={handleChildComponentData}
            placeHolder={"State"}
            value={location?.state}
            label={"State"}
            isEditable={false}
          ></PrefilledTextInput>

          {!hideButton && (
            <TouchableOpacity
              onPress={() => {
                addAddress();
              }}
              style={{
                width: 300,
                height: 50,
                backgroundColor: ternaryThemeColor,
                marginTop: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PoppinsTextMedium
                style={{ color: "white", fontWeight: "800", fontSize: 18 }}
                content={t("Submit")}
              ></PoppinsTextMedium>
            </TouchableOpacity>
          )}
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({});

export default AddAddress;