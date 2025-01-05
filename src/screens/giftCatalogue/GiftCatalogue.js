import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Linking,
} from "react-native";
import Video from "react-native-video";
import { useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useCheckActiveSchemeMutation } from "../../apiServices/scheme/GetSchemeApi";
import * as Keychain from "react-native-keychain";
import Logo from "react-native-vector-icons/AntDesign";
import moment from "moment";
import { useFetchGiftCatalogueByUserTypeAndCatalogueTypeMutation } from "../../apiServices/gifts/GiftApi";
import { useTranslation } from "react-i18next";

export default function GiftCatalogue({ navigation }) {
  const [scheme, setScheme] = useState([]);
  const [gifts, setGifts] = useState([]);
  const [selectedGifts, setSelectedGifts] = useState();
  const [categories, setCategories] = useState();
  const [selected, setSelected] = useState(false);
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  )
    ? useSelector((state) => state.apptheme.ternaryThemeColor)
    : "grey";
  const height = Dimensions.get("window").height;

  const [
    fetchGiftCatalogue,
    { data: giftCatalogueData, error: giftCatalogueError },
  ] = useFetchGiftCatalogueByUserTypeAndCatalogueTypeMutation();

  const {t} = useTranslation()

  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );
        const token = credentials.username;
        fetchGiftCatalogue({
          token: token,
          type: "point",
          limit: 1000,
          offset: 0,
        });
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    if (giftCatalogueData) {
      console.log("fetchGiftCatalogue", JSON.stringify(giftCatalogueData));
      if (giftCatalogueData.success) {
        setScheme(giftCatalogueData?.body);
        setGifts(giftCatalogueData?.body);
        getCategories(giftCatalogueData?.body);
        setSelectedGifts(giftCatalogueData?.body);
      }
    } else if (giftCatalogueError) {
      console.log("giftCatalogueError", giftCatalogueError);
    }
  }, [giftCatalogueData, giftCatalogueError]);


  const handlePressAll=()=>{
    giftCatalogueData && setGifts(giftCatalogueData?.body)
  }

  const getCategories = (data) => {
    const categoryData = data.map((item, index) => {
      return item.brand.trim();
    });
    const set = new Set(categoryData);
    const tempArray = Array.from(set);
    console.log("tempArray", tempArray);
    setCategories(tempArray);
  };

  const handlePress = (data) => {
    console.log("data from filter component is ", data);
    setSelectedGifts(data);
    setGifts(data);
  };

  const SchemeComponent = (props) => {
    const image = props.image;
    const name = props.name;
    const worth = props.worth;
    const coin = props.coin;
    console.log("schemeComponenimages",image)
    return (
      <View
        style={{
          width: "44%",
          borderWidth: 0.2,
          borderColor: "#DDDDDD",
          elevation: 6,
          height: 200,
          backgroundColor: "white",
          borderRadius: 4,
          margin: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: "100%",
            height: "75%",
            borderBottomWidth: 1,
            borderColor: "#DDDDDD",
          }}
        >
          <Image
            style={{ height: "100%", width: "100%", resizeMode: "contain" }}
            source={{ uri: image }}
          ></Image>
        </View>
        <View
          style={{
            width: "90%",
            height: "50%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PoppinsTextMedium
            style={{ color: ternaryThemeColor, fontSize: 14, fontWeight: "700" }}
            content={name?.toUpperCase()}
          ></PoppinsTextMedium>
          {/* <PoppinsTextMedium
            style={{ color: "grey", fontSize: 14, fontWeight: "700" }}
            content={`Worth Rs : ${worth} INR`}
          ></PoppinsTextMedium> */}
          <PoppinsTextMedium
            style={{ color: ternaryThemeColor, fontSize: 14, fontWeight: "700" }}
            content={`${t("Points")} : ${coin}`}
          ></PoppinsTextMedium>
        </View>
      </View>
    );
  };

  const FilterComp = (props) => {
    const [color, setColor] = useState("#F0F0F0");
    const [selected, setSelected] = useState(false);

    const title = props.title;
    const togglebox = () => {
      setSelected(!selected);

      console.log("selected", selected);

      
    };
    
    useEffect(()=>{
      if(selected)
      {
      filterData()
      setColor(ternaryThemeColor)
      }
     
    },[selected])

    const filterData = () => {
      if (selected === true) {
        const temp = [...giftCatalogueData?.body];
        const filteredArray = temp.filter((item, index) => {
          console.log("From filter", item.brand, title);
          return item.brand === title;
        });
        console.log("filteredArray", filteredArray);
        // setSelectedGifts(filteredArray)
        props.handlePress(filteredArray);
      } else {
        setGifts(giftCatalogueData?.body);
        console.log("inside else in filtered component");
      }
    };
    // console.log("selected", selected);
    return (
      <TouchableOpacity
        onPress={() => {
          togglebox();
        }}
        style={{
          minWidth: 60,
          height: 40,
          padding: 10,
          backgroundColor: color,
          alignItems: "center",
          justifyContent: "center",
          margin: 10,
          borderRadius: 4,
        }}
      >
        <PoppinsTextMedium
          style={{ fontSize: 12, color: selected ? "white" : "black" }}
          content={title?.toUpperCase()}
        ></PoppinsTextMedium>
      </TouchableOpacity>
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
          content={t("Gift Catalogue")}
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: "700",
            color: "white",
          }}
        ></PoppinsTextMedium>
      </View>

      <View
        style={{
          borderTopRightRadius: 30,
          borderTopLeftRadius: 30,
          backgroundColor: "white",
          minHeight: height - 100,
          marginTop: 10,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
         
        }}
      >
        <View
          style={{
            height: 100,
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ScrollView
            contentContainerStyle={{
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 20,
              paddingRight:20,
              flexDirection:"row"
            }}
            horizontal={true}
            style={{
              
            }}
          >
           {giftCatalogueData && <FilterComp
                    handlePress={handlePressAll}
                    title={t("All")}
                  ></FilterComp>}
            {categories &&
              categories.map((item, index) => {
                return (
                  <FilterComp
                    handlePress={handlePress}
                    key={index}
                    title={item}
                  ></FilterComp>
                );
              })}
          </ScrollView>
        </View>

        <ScrollView contentContainerStyle={{paddingBottom:200}} style={{ width: "100%" }}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {gifts &&
              gifts.map((item, index) => {
                return (
                  <SchemeComponent
                    key={index}
                    name={item.name}
                    worth={item.value}
                    coin={item.points}
                    image={item.images[0]}
                  ></SchemeComponent>
                );
              })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
