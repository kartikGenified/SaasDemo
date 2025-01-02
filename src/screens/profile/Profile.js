import React, { useEffect, useState, useTransition } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import PoppinsText from "../../components/electrons/customFonts/PoppinsText";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import DisplayOnlyTextInput from "../../components/atoms/DisplayOnlyTextInput";
import { useFetchProfileMutation } from "../../apiServices/profile/profileApi";
import * as Keychain from "react-native-keychain";
import { useGetFormMutation } from "../../apiServices/workflow/GetForms";
import { useGetActiveMembershipMutation } from "../../apiServices/membership/AppMembershipApi";
import { useIsFocused } from "@react-navigation/native";
import PlatinumModal from "../../components/platinum/PlatinumModal";
import Edit from "react-native-vector-icons/Entypo";
import Delete from "react-native-vector-icons/AntDesign";
import moment from "moment";
import FastImage from "react-native-fast-image";
import ModalWithBorder from "../../components/modals/ModalWithBorder";
import Close from "react-native-vector-icons/Ionicons";
import DeleteModal from "../../components/modals/DeleteModal";
import { useTranslation } from "react-i18next";

const Profile = ({ navigation }) => {
  const [formFields, setFormFields] = useState();
  const [formValues, setFormValues] = useState();
  const [showProfilePic, setShowProfilePic] = useState(false);
  const [profileName, setProfileName] = useState(false);
  const [showNoDataFoundMessage, setShowNoDataFoundMessage] = useState(false);
  const [showProfileData, setShowProfileData] = useState(false);
  const [openModalWithBorder, setModalBorder] = useState(false);
  const [profileData, setProfileData] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const kycData = useSelector((state) => state.kycDataSlice.kycData);

  const { t } = useTranslation();

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";
  const userData = useSelector((state) => state.appusersdata.userData);
  console.log("userdata is", userData);
  const focused = useIsFocused();
  const [
    fetchProfileFunc,
    {
      data: fetchProfileData,
      error: fetchProfileError,
      isLoading: fetchProfileIsLoading,
      isError: fetchProfileIsError,
    },
  ] = useFetchProfileMutation();
  const [
    getFormFunc,
    {
      data: getFormData,
      error: getFormError,
      isLoading: getFormIsLoading,
      isError: getFormIsError,
    },
  ] = useGetFormMutation();

  const [
    getActiveMembershipFunc,
    {
      data: getActiveMembershipData,
      error: getActiveMembershipError,
      isLoading: getActiveMembershipIsLoading,
      isError: getActiveMembershipIsError,
    },
  ] = useGetActiveMembershipMutation();

  useEffect(() => {
    // console.log("Form data", formFields, formValues)
    if (formFields !== undefined && formValues !== undefined) {
      setShowProfileData(true);
    }
  }, [formFields, formValues, focused, profileData]);

  useEffect(() => {
    if (getActiveMembershipData) {
      console.log(
        "getActiveMembershipData",
        JSON.stringify(getActiveMembershipData)
      );
    } else if (getActiveMembershipError) {
      // console.log("getActiveMembershipError", getActiveMembershipError)
    }
  }, [getActiveMembershipData, getActiveMembershipError]);

  useEffect(() => {
    if (getFormData) {
      if (getFormData.body.length !== 0) {
        console.log("Form Fields", JSON.stringify(getFormData));

        const filteredData = Object.values(getFormData.body.template).filter(
          (item, index) => {
            if (item.name === "profile_pic" || item.name === "picture") {
              setShowProfilePic(true);
            }
            return item.name !== "profile_pic" || item.name == "picture";
          }
        );

        setFormFields(filteredData);
        filterNameFromFormFields(filteredData);
      } else {
        console.log("no Form");
        setShowNoDataFoundMessage(true);
      }
    } else if (getFormError) {
      console.log("Form Field Error", getFormError);
    } else if (fetchProfileData) {
      console.log("fetchProfileData", fetchProfileData);
      if (fetchProfileData.success) {
        setProfileData(fetchProfileData);
      }
    } else if (fetchProfileError) {
      console.log("fetchProfileError", fetchProfileError);
    }
  }, [
    getFormData,
    getFormError,
    focused,
    fetchProfileData,
    fetchProfileError,
    profileData,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );
        const token = credentials.username;
        const form_type = "6";
        fetchProfileFunc(token);

        getFormFunc({ form_type, token });
      }
    };
    fetchData();
    getMembership();
  }, [focused]);

  useEffect(() => {}, []);

  const getMembership = async () => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      console.log(
        "Credentials successfully loaded for user " + credentials.username
      );
      const token = credentials.username;
      getActiveMembershipFunc(token);
    }
  };

  const deleteID = () => {
    setShowDeleteModal(!showDeleteModal);
  };
  const filterNameFromFormFields = (data) => {
    console.log("filterNameFromFormFields");
    const nameFromFormFields = data.map((item) => {
      if (item.name === "name") {
        setProfileName(true);
      }
      return item.name;
    });
    // console.log(nameFromFormFields);
    filterProfileDataAccordingToForm(nameFromFormFields);
  };

  const filterProfileDataAccordingToForm = (arrayNames) => {
    console.log("inside filterProfileDataAccordingToForm");
    if (profileData) {
      console.log("filterProfileDataAccordingToForm", arrayNames, profileData);

      if (arrayNames) {
        let temparr = [];
        arrayNames.map((item) => {
          temparr.push(profileData.body[item]);
        });
        // console.log("Form Values",temparr)
        setFormValues(temparr);
        console.log(temparr);
      }
    } else {
      console.log("filterProfileDataAccordingToForm profileData empty");
      if (fetchProfileData) {
        setProfileData(fetchProfileData);
      }
    }
  };
  const hideModal = () => {
    setShowDeleteModal(false);
  };

  const name = profileName ? fetchProfileData?.body.name : "";
  const membership =
    getActiveMembershipData && getActiveMembershipData.body?.tier.name;
  const accountVerified = !Object.values(kycData).includes(false);
  const gifUri = Image.resolveAssetSource(
    require("../../../assets/gif/loader.gif")
  ).uri;

  const ProfileBox = (props) => {
    const image = props.image;
    const title = props.title;
    const buttonTitle = props.buttonTitle;

    const handleNavigation = () => {
      if (title === "Payment Methods") {
        navigation.navigate("BankAccounts");
      } else if (title === "Check Passbook") {
        navigation.navigate("Passbook");
      }
      else if (title === "Change Language") {
        navigation.navigate("SelectLanguage",{"from": "profile"});
      }
    };
    return (
      <View
        style={{
          height: 80,
          width: 200,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          borderWidth: 1.4,
          borderColor: ternaryThemeColor,
          borderRadius: 10,
          marginLeft: 10,
          backgroundColor: "white",
          elevation: 10,
        }}
      >
        <View
          style={{
            width: "30%",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <View
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
              alignItems: "center",
              justifyContent: "center",
              borderColor: "#DDDDDD",
              borderWidth: 1,
              marginLeft: 4,
            }}
          >
            <Image
              style={{ height: 30, width: 30, resizeMode: "contain" }}
              source={image}
            ></Image>
          </View>
        </View>
        <View
          style={{
            width: "70%",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <PoppinsTextMedium
            style={{
              color: "black",
              fontWeight: "600",
              marginBottom: 4,
              width: "100%",
            }}
            content={t(title)}
          ></PoppinsTextMedium>
          <TouchableOpacity
            onPress={() => {
              handleNavigation();
            }}
            style={{
              height: 24,
              width: 60,
              borderRadius: 4,
              backgroundColor: ternaryThemeColor,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <PoppinsTextMedium
              style={{ color: "white" }}
              content={t(buttonTitle)}
            ></PoppinsTextMedium>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const GreyBar = () => {
    return (
      <View
        style={{
          width: "100%",
          height: 50,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          backgroundColor: "#F9F9F9",
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: "#DDDDDD",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{ height: 20, width: 20, resizeMode: "contain" }}
            source={require("../../../assets/images/mobileBlack.png")}
          ></Image>
          <PoppinsTextMedium
            style={{ color: "black", marginLeft: 8 }}
            content={fetchProfileData.body?.mobile}
          ></PoppinsTextMedium>
        </View>
        {fetchProfileData.body?.gender !== null && (
          <View
            style={{
              width: 1,
              borderWidth: 0.8,
              borderColor: "#353535",
              height: "30%",
            }}
          ></View>
        )}
        {fetchProfileData.body?.gender !== null && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              style={{ height: 20, width: 20, resizeMode: "contain" }}
              source={require("../../../assets/images/genderBlack.png")}
            ></Image>
            <PoppinsTextMedium
              style={{ color: "black", marginLeft: 8 }}
              content={fetchProfileData.body?.gender}
            ></PoppinsTextMedium>
          </View>
        )}
      </View>
    );
  };
  const ProfileHeader = () => {
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

    const hideSuccessModal = () => {
      setIsSuccessModalVisible(false);
    };

    const showSuccessModal = () => {
      setIsSuccessModalVisible(true);
      console.log("hello");
    };

    return (
      <View style={{ width: "100%" }}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: ternaryThemeColor,
            borderBottomWidth: 0.3,
            borderColor: "white",
            paddingBottom: 40,
          }}
        >
          {showProfilePic && (
            <TouchableOpacity
              style={{
                height: 110,
                width: 110,
                backgroundColor: "white",
                borderRadius: 55,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: "white",
              }}
              onPress={() => {
                setModalBorder(true);
              }}
            >
              {fetchProfileData?.body?.profile_pic ? (
                <Image
                  style={{
                    height: 98,
                    width: 98,
                    resizeMode: "contain",
                    borderRadius: 49,
                  }}
                  source={{ uri: fetchProfileData.body?.profile_pic }}
                ></Image>
              ) : (
                <Image
                  style={{ height: 60, width: 60, resizeMode: "contain" }}
                  source={require("../../../assets/images/userGrey.png")}
                ></Image>
              )}
            </TouchableOpacity>
          )}
          <View
            style={{
              alignItems: "flex-start",
              justifyContent: "center",
              width: 140,
              height: 100,
              marginLeft: 10,
            }}
          >
            <PoppinsText
              style={{ color: "white", fontSize: 20 }}
              content={name}
            ></PoppinsText>
            {membership && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{ height: 16, width: 16, resizeMode: "contain" }}
                  source={require("../../../assets/images/reward.png")}
                ></Image>
                <TouchableOpacity onPress={showSuccessModal}>
                  <PoppinsTextMedium
                    style={{ color: "white", fontSize: 14 }}
                    content={membership}
                  ></PoppinsTextMedium>
                </TouchableOpacity>
              </View>
            )}
            {accountVerified && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Image
                  style={{ height: 16, width: 16, resizeMode: "contain" }}
                  source={require("../../../assets/images/verified.png")}
                ></Image>

                <PoppinsTextMedium
                  style={{ color: "white" }}
                  content="Account Verified"
                ></PoppinsTextMedium>

                <PlatinumModal
                  isVisible={isSuccessModalVisible}
                  onClose={hideSuccessModal}
                  getActiveMembershipData={getActiveMembershipData}
                />
              </TouchableOpacity>
            )}
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 8,
              }}
            >
              <PoppinsTextMedium
                style={{ color: "white" }}
                content={
                  `${t(String(userData.user_type))} ${t("Account")}`}
              ></PoppinsTextMedium>
            </View>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 50,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("EditProfile", {
                  formFields: formFields,
                  formValues: formValues,
                  savedImage: fetchProfileData.body?.profile_pic,
                });
              }}
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: ternaryThemeColor,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Edit name="edit" size={20} color={ternaryThemeColor}></Edit>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                deleteID();
              }}
              style={{
                height: 40,
                width: 40,
                borderRadius: 20,
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: ternaryThemeColor,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Delete
                name="delete"
                size={24}
                color={ternaryThemeColor}
              ></Delete>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const ModalContent = () => {
    return (
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            marginTop: 30,
            alignItems: "center",
            maxWidth: "80%",
            marginBottom: 20,
          }}
        >
          {fetchProfileData ? (
            <Image
              style={{
                height: 300,
                width: 300,
                resizeMode: "contain",
                borderRadius: 200,
              }}
              source={{ uri: fetchProfileData.body?.profile_pic }}
            ></Image>
          ) : (
            <Image
              style={{ height: 200, width: 180, resizeMode: "contain" }}
              source={require("../../../assets/images/userGrey.png")}
            ></Image>
          )}
        </View>

        <TouchableOpacity
          style={[
            {
              backgroundColor: ternaryThemeColor,
              padding: 6,
              borderRadius: 5,
              position: "absolute",
              top: -10,
              right: -10,
            },
          ]}
          onPress={() => setModalBorder(false)}
        >
          <Close name="close" size={25} color="#ffffff" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ ...styles.container, backgroundColor: "white" }}>
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
          style={{ height: 20, width: 20, position: "absolute", left: 20 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{
              height: 20,
              width: 20,
              resizeMode: "contain",
              marginTop: 20,
            }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>
      </View>
      {!showNoDataFoundMessage && <ProfileHeader></ProfileHeader>}
      {fetchProfileData && <GreyBar></GreyBar>}
      {showDeleteModal && (
        <DeleteModal
          hideModal={hideModal}
          modalVisible={showDeleteModal}
        ></DeleteModal>
      )}
      <ScrollView>
        {showProfileData && (
          <>
            <View
              style={{
                borderTopRightRadius: 30,
                borderTopLeftRadius: 30,
                backgroundColor: "white",

                marginTop: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* <ProfileData></ProfileData> */}
              {showProfileData &&
                formFields.map((item, index) => {
                  console.log("showProfileData", item, formValues[index]);
                  if (item.type === "date" || item.type === "Date") {
                    return (
                      <DisplayOnlyTextInput
                        key={index}
                        data={
                          formValues[index] === null ||
                          formValues[index] === undefined
                            ? t("No data available")
                            : moment(formValues[index]).format("DD-MMM-YYYY")
                        }
                        title={
                          item.label == "Date of Registration"
                            ? t("Date of Registration")
                            : item.label == "DOB" ? t("DOB")  : item.label
                        }
                        photo={require("../../../assets/images/eye.png")}
                      ></DisplayOnlyTextInput>
                    );
                  } else {
                    if (item.name.toLowerCase() === "enrollment_date") {
                      return (
                        <DisplayOnlyTextInput
                          key={index}
                          data={
                            formValues[index] === null ||
                            formValues[index] === undefined
                              ? t("No data available")
                              : moment(formValues[index]).format("DD-MMM-YYYY")
                          }
                          title={
                            item.label == "Date of Registration"
                              ? t("Date of Registration")
                              : item.label
                          }
                          photo={require("../../../assets/images/eye.png")}
                        ></DisplayOnlyTextInput>
                      );
                    }
                    return (
                      <DisplayOnlyTextInput
                        key={index}
                        data={
                          formValues[index] === null ||
                          formValues[index] === undefined
                            ? t("No data available")
                            : formValues[index]
                        }
                        title={
                          item.label == "Name"
                            ? t("name")
                            : item.label == "Mobile"
                            ? t("mobile")
                            : item.label == "Email"
                            ? t("Email")
                            : item.label == "Gender"
                            ? t("Gender")
                            : item.label == "DOB"
                            ? t("DOB")
                            : item.label == "Pincode"
                            ? t("Pincode")
                            : item.label == "State"
                            ? t("State")
                            : item.label == "District"
                            ? t("District")
                            : item.label == "City"
                            ? t("City")
                            : item.label == "Aadhaar" 
                            ? t("Aadhar")
                            : item.label == "Pan"
                            ? t("Pan")
                            : item.label == "Salesteam Name"
                            ? t("Salesteam Name")
                            : item.label == "Salesteam Mobile"
                            ? t("Salesteam Mobile")
                            : item.label == "Dealer Name"
                            ? t("Dealer Name")
                            : item.label == "Dealer Mobile"
                            ? t("Dealer Mobile")
                            : item.label == "Date of Registration"
                            ? t("Date of Registration")
                            : item.label
                        }
                        photo={require("../../../assets/images/eye.png")}
                      ></DisplayOnlyTextInput>
                    );
                  }
                })}
            </View>
            {/* ozone specific changes */}
            {userData?.user_type != "sales" && (
              <View
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ScrollView
                horizontal={true}
                  contentContainerStyle={{
                    height: 100,
                   
                    backgroundColor: "white",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    flexDirection: "row",
                    marginTop: 20,
                    paddingRight:20
                  }}
                >
                  <ProfileBox
                    buttonTitle={"Add"}
                    title="Payment Methods"
                    image={require("../../../assets/images/money.png")}
                  ></ProfileBox>
                  <ProfileBox
                    buttonTitle={"Change"}
                    title={"Change Language"}
                    image={require("../../../assets/images/language.png")}
                  ></ProfileBox>
                  <ProfileBox
                    buttonTitle={"View"}
                    title="Check Passbook"
                    image={require("../../../assets/images/passbook_icon.png")}
                  ></ProfileBox>
                </ScrollView>
              </View>
            )}
            {/* ------------------------------- */}
          </>
        )}
        {formFields === undefined && formValues === undefined && (
          <View>
            <FastImage
              style={{
                width: 100,
                height: 100,
                alignSelf: "center",
                marginTop: "60%",
              }}
              source={{
                uri: gifUri, // Update the path to your GIF
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />

            <PoppinsTextMedium
              style={{
                color: "black",
                fontWeight: "600",
                fontSize: 14,
                marginTop: 10,
              }}
              content="Loading"
            ></PoppinsTextMedium>
          </View>
        )}
      </ScrollView>

      {openModalWithBorder && (
        <ModalWithBorder
          modalClose={() => {
            () => setModalBorder(false);
          }}
          // message={message}
          openModal={openModalWithBorder}
          comp={ModalContent}
        ></ModalWithBorder>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    flex: 1,
  },
});

export default Profile;
