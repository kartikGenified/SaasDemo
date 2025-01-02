import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Linking,
  TextInput,
} from "react-native";
import Video from "react-native-video";
import { useDispatch, useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useGetAppVideoMutation } from "../../apiServices/video/VideoApi";
import * as Keychain from "react-native-keychain";
import Logo from "react-native-vector-icons/MaterialIcons";
import moment from "moment";
import RectangularUnderlinedDropDown from "../../components/atoms/dropdown/RectangularUnderlinedDropDown";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import ButtonWithPlane from "../../components/atoms/buttons/ButtonWithPlane";
import { useAddIssueMutation } from "../../apiServices/addIssue/AddIssueApi";
import { slug } from "../../utils/Slug";
import ModalWithBorder from "../../components/modals/ModalWithBorder";
import Icon from "react-native-vector-icons/Feather";
import ErrorModal from "../../components/modals/ErrorModal";
import Close from "react-native-vector-icons/Ionicons";

const ReportAndIssue = ({ navigation, route }) => {
  const [description, setDescription] = useState("");
  const [imageArray, setImageArray] = useState([]);
  const [message, setMessage] = useState("");
  const [successmodal, setSuccessModal] = useState(false);
  const [error, setError] = useState(false);

  const userData = useSelector((state) => state.appusersdata.userData);
  const slug = slug;

  const dispatch = useDispatch();

  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";
  const location = useSelector((state) => state.userLocation.location);
  const height = Dimensions.get("window").height;
  const data = route.params.productData;
  console.log("data in report", data, userData, location);
  const productName = data?.product_code;
  const visibleCode = data?.batch_running_code;
  const qrId = route.params?.qrId;

  const [
    addIssueFunc,
    {
      data: addIssueData,
      error: addIssueError,
      isLoading: addIssueLoading,
      isError: addIssueIsError,
    },
  ] = useAddIssueMutation();

  useEffect(() => {
    if (addIssueData) {
      console.log("addIssueData", addIssueData);
      if (addIssueData.success) {
        setMessage(addIssueData.message);
        setSuccessModal(true);
      }
    } else if (addIssueError) {
      console.log("addIssueError", addIssueError);
      setError(true);
      setMessage(addIssueError.data.message);
    }
  }, [addIssueData, addIssueError]);

  const getReason = (data) => {
    console.log(data);
  };
  const getPictures = async () => {
    const result = await launchImageLibrary();
    2;
    console.log(result?.assets?.[0].uri);
    let temp = [...imageArray];
    temp.push(result.assets[0].uri);
    setImageArray(temp);
  };
  const deleteImages = (data) => {
    console.log("image to delete", data);
    let temp = [...imageArray];
    const filteredArray = temp.filter((item, index) => {
      return String(item) !== String(data);
    });
    console.log("filteredArray", filteredArray);
    setImageArray(filteredArray);
  };

  const submitData = () => {
    let obj = {
      data: {
        mobile: userData.mobile,
        name: userData.name,
        qr_id: Number(data.id),
        user_type_id: userData.user_type_id,
        user_type: userData.user_type,
        desc: description,
        type: "point",
        pincode: location?.postcode == undefined ? "N/A" : location?.postcode,
        state: location?.state == undefined ? "N/A" : location?.state,
        district: location?.district == undefined ? "N/A" : location?.district,
        city: location?.city == undefined ? "N/A" : location?.city,
        lat: String(location?.lat == undefined ? "N/A" : location?.lat),
        log: String(location?.lon == undefined ? "N/A" : location?.lon),
      },

      tenant_id: slug,
      token: userData.token,
    };
    console.log("Report an issue ", JSON.stringify(obj));

    addIssueFunc(obj);
  };

  // console.log(imageArray)

  const ShowImage = (props) => {
    const image = props.image;
    // console.log(image)
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: 200,
          width: 180,
          backgroundColor: "white",
          elevation: 8,
          margin: 10,
          borderRadius: 10,
        }}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            top: -10,
            right: -10,
            height: 40,
            width: 40,
          }}
          onPress={() => {
            deleteImages(image);
          }}
        >
          <Logo name="cancel" size={40} color="red"></Logo>
        </TouchableOpacity>
        <Image
          style={{ height: "86%", width: "86%", resizeMode: "contain" }}
          source={{ uri: image }}
        ></Image>
      </View>
    );
  };

  const onSuccess = () => {
    setSuccessModal(false);
    setTimeout(() => {
      navigation.navigate("Dashboard");
    }, 1000);
  };

  const ModalSuccess = () => {
    return (
      <View
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ marginTop: 30, alignItems: "center", maxWidth: "80%" }}>
          <Icon name="check-circle" size={53} color={ternaryThemeColor} />
          <PoppinsTextMedium
            style={{
              fontSize: 27,
              fontWeight: "600",
              color: ternaryThemeColor,
              marginLeft: 5,
              marginTop: 5,
            }}
            content={"Success ! !"}
          ></PoppinsTextMedium>

          <View style={{ marginTop: 10, marginBottom: 30 }}>
            <PoppinsTextMedium
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#000000",
                marginLeft: 5,
                marginTop: 5,
              }}
              content={message}
            ></PoppinsTextMedium>
          </View>

          {/* <View style={{ alignItems: 'center', marginBottom: 30 }}>
                <ButtonOval handleOperation={modalWithBorderClose} backgroundColor="#000000" content="OK" style={{ color: 'white', paddingVertical: 4 }} />
              </View> */}
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
          onPress={() => onSuccess()}
        >
          <Close name="close" size={17} color="#ffffff" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        backgroundColor: ternaryThemeColor,
        height: "100%",
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          flexDirection: "row",
          width: "100%",
          marginTop: 10,
          height: "10%",
          marginLeft: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: "contain",
              marginLeft: 10,
            }}
            source={require("../../../assets/images/blackBack.png")}
          ></Image>
        </TouchableOpacity>
        <PoppinsTextMedium
          content={t("Report And Issue")}
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: "700",
            color: "white",
          }}
        ></PoppinsTextMedium>
      </View>
      <ScrollView style={{ width: "100%", height: "90%" }}>
        <View
          style={{
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            backgroundColor: "white",
            minHeight: height - 100,
            marginTop: 10,
            alignItems: "flex-start",
            justifyContent: "flex-start",
            width: "100%",
            paddingBottom: 40,
          }}
        >
          <PoppinsTextMedium
            style={{
              marginLeft: 20,
              marginTop: 20,
              fontWeight: "700",
              color: "#55595A",
              fontSize: 16,
            }}
            content={`Product Code : ${productName}`}
          ></PoppinsTextMedium>
          <PoppinsTextMedium
            style={{
              marginLeft: 20,
              marginTop: 4,
              fontWeight: "700",
              color: "#55595A",
              fontSize: 16,
            }}
            content={`Visible Code : ${visibleCode}`}
          ></PoppinsTextMedium>

          {/* <RectangularUnderlinedDropDown style={{ marginLeft: 10 }} header="Select a reason" data={["1", "2", "3", "4"]} handleData={getReason}></RectangularUnderlinedDropDown> */}
          <View
            style={{
              width: "90%",
              borderBottomWidth: 2,
              borderColor: "#DDDDDD",
              height: 80,
              marginLeft: 20,
              marginTop: 30,
            }}
          >
            <TextInput
              onChangeText={(val) => {
                setDescription(val);
              }}
              value={description}
              multiline={true}
              placeholder="Write / Describe the claim issue"
              style={{
                height: "100%",
                width: "100%",
                borderRadius: 10,
                color: "black",
              }}
            ></TextInput>
          </View>
          {/* <View style={{ alignItems: "center", justifyContent: 'center', flexDirection: 'row', width: '90%', marginLeft: 10, height: 40, marginTop: 20 }}>
            <PoppinsTextMedium style={{ color: '#58585A', position: 'absolute', left: 10 }} content="Upload the product image" ></PoppinsTextMedium>
            <TouchableOpacity onPress={() => { getPictures() }} style={{ position: "absolute", right: 10, height: 40, width: 40, }}>
              <Image style={{ height: 40, width: 40, resizeMode: 'contain' }} source={require('../../../assets/images/clip.png')}></Image>

            </TouchableOpacity>
          </View> */}
          {/* <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: 260 }}>
            <ScrollView style={{ width: '100%', marginTop: 20 }} showsHorizontalScrollIndicator={false} horizontal={true}>
              {imageArray && imageArray.map((item, index) => {
                return (
                  <ShowImage key={index} image={item}></ShowImage>
                )
              })}
            </ScrollView>
          </View> */}
          <View style={{ alignItems: "center", width: "100%", marginTop: -10 }}>
            <ButtonWithPlane
              title={t("Submit")}
              type="feedback"
              onModalPress={submitData}
            ></ButtonWithPlane>
          </View>
        </View>

        {successmodal && (
          <ModalWithBorder
            modalClose={() => {
              setSuccessModal(false), setMessage("");
            }}
            message={message}
            openModal={successmodal}
            navigateTo="Dashboard"
            // parameters={{ warrantyItemData: data, afterClaimData: warrantyClaimData }}
            comp={ModalSuccess}
          ></ModalWithBorder>
        )}

        {error && (
          <ErrorModal
            modalClose={() => {
              setError(false), setMessage("");
            }}
            // productData={verifyQrData.body}
            message={message}
            // isReportable={true}
            openModal={error}
          ></ErrorModal>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ReportAndIssue;
