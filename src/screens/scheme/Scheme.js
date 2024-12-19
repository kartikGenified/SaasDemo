import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Linking,
  Text,
} from "react-native";
import Video from "react-native-video";
import { useSelector } from "react-redux";
import PoppinsTextMedium from "../../components/electrons/customFonts/PoppinsTextMedium";
import { useCheckActiveSchemeMutation,useCheckAllSchemeMutation } from "../../apiServices/scheme/GetSchemeApi";
import * as Keychain from "react-native-keychain";
import Logo from "react-native-vector-icons/AntDesign";
import moment from "moment";
import DatePicker from "react-native-date-picker";
import PoppinsTextLeftMedium from "../../components/electrons/customFonts/PoppinsTextLeftMedium";
export default function Scheme({ navigation }) {
  const [scheme, setScheme] = useState([]);
  const [getAllScheme, setGetAllScheme] = useState([])
  const [gifts, setGifts] = useState([]);
  const [activeScheme, setActiveScheme] = useState()
  const [selectedGifts, setSelectedGifts] = useState();
  const [categories, setCategories] = useState();
  const [highlightWidthPrevious, setHighlightWidthPrevious] = useState(false);
  const [selected, setSelected] = useState(false);
  const secondaryThemeColor = useSelector(
    (state) => state.apptheme.secondaryThemeColor
  );
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const location = useSelector((state) => state.userLocation.location);
    console.log("Location Data from redux state", location)
  const height = Dimensions.get("window").height;

  const [checkAllSchemeFunc,{
    data:checkAllSchemeData,
    error:checkAllSchemeError,
    isLoading:checkAllSchemeIsLoading,
    isError:checkAllSchemeIsError
  }] = useCheckAllSchemeMutation()

  const [
    checkActiveSchemeFunc,
    {
      data: checkActiveSchemeData,
      error: checkActiveSchemeError,
      isLoading: checkActiveSchemeIsLoading,
      isError: checkActiveSchemeIsError,
    },
  ] = useCheckActiveSchemeMutation();

  const schemeData = {
    status: 200,
    success: true,
    message: "All Scheme Data",
    body: [
      {
        id: 6,
        name: "Second Test Scheme",
        user_types: [3, 2],
        states: ["Delhi", "Uttarkhand", "Haryana"],
        gift_catalogue_id: 2,
        scheme_start: "2024-07-01",
        scheme_end: "2024-07-25",
        redeem_start: "2024-07-01",
        redeem_end: "2024-07-31",
        type: "1",
        products: [],
        image:
          "https://genefied-saas-partner-staging.s3.ap-south-1.amazonaws.com/1720604602806-387774581RUMBA.jpg",
        pdf: "https://genefied-saas-partner-staging.s3.ap-south-1.amazonaws.com/1720617280204-657186004Terms-and-Conditions---JQR.pdf",
        status: "2",
        created_at: "2024-07-11T07:45:10.477Z",
        created_by_id: 1,
        created_by_name: "lyra",
        updated_at: "2024-07-11T07:45:10.477Z",
        updated_by_id: 1,
        updated_by_name: "lyra",
        scheme_wallet_id: "490",
        app_user_id: 443,
        user_type_id: 2,
        user_type: "retailer",
        wallet_status: "3",
        point_earned: "0.00",
        point_redeemed: "0.00",
        point_balance: "0.00",
        point_expired: "0.00",
        gift_catalogue: [
          {
            catalogue_id: 2,
            catalogue_name: "new Bata",
            catalogue_type: "point",
            user_types: [2],
            id: 3,
            name: "Combo Voucher",
            brand: "Bata",
            points: 3,
            value: 3,
            images: [
              "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261406795-222877395.png",
            ],
            created_at: "2024-03-21T06:36:11.303Z",
            created_by_name: "Bata",
          },
          {
            catalogue_id: 2,
            catalogue_name: "new Bata",
            catalogue_type: "point",
            user_types: [2],
            id: 2,
            name: "Voucher",
            brand: "Bata",
            points: 2,
            value: 2,
            images: [
              "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261376761-588744604.png",
            ],
            created_at: "2024-03-21T06:36:11.303Z",
            created_by_name: "Bata",
          },
          {
            catalogue_id: 2,
            catalogue_name: "new Bata",
            catalogue_type: "point",
            user_types: [2],
            id: 1,
            name: "Bata Card",
            brand: "Bata",
            points: 1,
            value: 1,
            images: [
              "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261342488-442000408.jpg",
            ],
            created_at: "2024-03-21T06:36:11.303Z",
            created_by_name: "Bata",
          },
        ],
      },
      {
        id: 8,
        name: "Faltu Test Scheme",
        user_types: [2, 3],
        states: ["Delhi", "Uttar Pradesh"],
        gift_catalogue_id: 2,
        scheme_start: "2024-07-01",
        scheme_end: "2024-07-25",
        redeem_start: "2024-07-26",
        redeem_end: "2024-07-31",
        type: "1",
        products: [],
        image:
          "https://genefied-saas-partner-staging.s3.ap-south-1.amazonaws.com/1720604602806-387774581RUMBA.jpg",
        pdf: "https://genefied-saas-partner-staging.s3.ap-south-1.amazonaws.com/1720617280204-657186004Terms-and-Conditions---JQR.pdf",
        status: "1",
        created_at: "2024-07-12T07:37:13.599Z",
        created_by_id: 1,
        created_by_name: "lyra",
        updated_at: "2024-07-12T07:37:13.599Z",
        updated_by_id: 1,
        updated_by_name: "lyra",
        scheme_wallet_id: "978",
        app_user_id: 443,
        user_type_id: 2,
        user_type: "retailer",
        wallet_status: "3",
        point_earned: "0.00",
        point_redeemed: "0.00",
        point_balance: "0.00",
        point_expired: "0.00",
        gift_catalogue: [
          {
            catalogue_id: 2,
            catalogue_name: "new Bata",
            catalogue_type: "point",
            user_types: [2],
            id: 3,
            name: "Combo Voucher",
            brand: "Bata",
            points: 3,
            value: 3,
            images: [
              "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261406795-222877395.png",
            ],
            created_at: "2024-03-21T06:36:11.303Z",
            created_by_name: "Bata",
          },
          {
            catalogue_id: 2,
            catalogue_name: "new Bata",
            catalogue_type: "point",
            user_types: [2],
            id: 2,
            name: "Voucher",
            brand: "Bata",
            points: 2,
            value: 2,
            images: [
              "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261376761-588744604.png",
            ],
            created_at: "2024-03-21T06:36:11.303Z",
            created_by_name: "Bata",
          },
          {
            catalogue_id: 2,
            catalogue_name: "new Bata",
            catalogue_type: "point",
            user_types: [2],
            id: 1,
            name: "Bata Card",
            brand: "Bata",
            points: 1,
            value: 1,
            images: [
              "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261342488-442000408.jpg",
            ],
            created_at: "2024-03-21T06:36:11.303Z",
            created_by_name: "Bata",
          },
        ],
      },
      {
        id: 8,
        name: "Expired Test Scheme",
        user_types: [2, 3],
        states: ["Uttar Pradesh"],
        gift_catalogue_id: 2,
        scheme_start: "2024-07-01",
        scheme_end: "2024-07-25",
        redeem_start: "2024-07-26",
        redeem_end: "2024-07-31",
        type: "1",
        products: [],
        image:
          "https://genefied-saas-partner-staging.s3.ap-south-1.amazonaws.com/1720604602806-387774581RUMBA.jpg",
        pdf: "https://genefied-saas-partner-staging.s3.ap-south-1.amazonaws.com/1720617280204-657186004Terms-and-Conditions---JQR.pdf",
        status: "1",
        created_at: "2024-07-12T07:37:13.599Z",
        created_by_id: 1,
        created_by_name: "lyra",
        updated_at: "2024-07-12T07:37:13.599Z",
        updated_by_id: 1,
        updated_by_name: "lyra",
        scheme_wallet_id: "978",
        app_user_id: 443,
        user_type_id: 2,
        user_type: "retailer",
        wallet_status: "3",
        point_earned: "0.00",
        point_redeemed: "0.00",
        point_balance: "0.00",
        point_expired: "0.00",
        gift_catalogue: [
          {
            catalogue_id: 2,
            catalogue_name: "new Bata",
            catalogue_type: "point",
            user_types: [2],
            id: 3,
            name: "Combo Voucher",
            brand: "Bata",
            points: 3,
            value: 3,
            images: [
              "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261406795-222877395.png",
            ],
            created_at: "2024-03-21T06:36:11.303Z",
            created_by_name: "Bata",
          },
          {
            catalogue_id: 2,
            catalogue_name: "new Bata",
            catalogue_type: "point",
            user_types: [2],
            id: 2,
            name: "Voucher",
            brand: "Bata",
            points: 2,
            value: 2,
            images: [
              "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261376761-588744604.png",
            ],
            created_at: "2024-03-21T06:36:11.303Z",
            created_by_name: "Bata",
          },
          {
            catalogue_id: 2,
            catalogue_name: "new Bata",
            catalogue_type: "point",
            user_types: [2],
            id: 1,
            name: "Bata Card",
            brand: "Bata",
            points: 1,
            value: 1,
            images: [
              "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261342488-442000408.jpg",
            ],
            created_at: "2024-03-21T06:36:11.303Z",
            created_by_name: "Bata",
          },
        ],
      },
      {
        id: 8,
        name: "Expired Test Scheme",
        user_types: [2, 3],
        states: ["Uttar Pradesh"],
        gift_catalogue_id: 2,
        scheme_start: "2024-07-01",
        scheme_end: "2024-07-12",
        redeem_start: "2024-07-17",
        redeem_end: "2024-07-31",
        type: "1",
        products: [],
        image:
          "https://genefied-saas-partner-staging.s3.ap-south-1.amazonaws.com/1720604602806-387774581RUMBA.jpg",
        pdf: "https://genefied-saas-partner-staging.s3.ap-south-1.amazonaws.com/1720617280204-657186004Terms-and-Conditions---JQR.pdf",
        status: "1",
        created_at: "2024-07-12T07:37:13.599Z",
        created_by_id: 1,
        created_by_name: "lyra",
        updated_at: "2024-07-12T07:37:13.599Z",
        updated_by_id: 1,
        updated_by_name: "lyra",
        scheme_wallet_id: "978",
        app_user_id: 443,
        user_type_id: 2,
        user_type: "retailer",
        wallet_status: "3",
        point_earned: "0.00",
        point_redeemed: "0.00",
        point_balance: "0.00",
        point_expired: "0.00",
        gift_catalogue: [
          {
            catalogue_id: 2,
            catalogue_name: "new Bata",
            catalogue_type: "point",
            user_types: [2],
            id: 3,
            name: "Combo Voucher",
            brand: "Bata",
            points: 3,
            value: 3,
            images: [
              "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261406795-222877395.png",
            ],
            created_at: "2024-03-21T06:36:11.303Z",
            created_by_name: "Bata",
          },
          {
            catalogue_id: 2,
            catalogue_name: "new Bata",
            catalogue_type: "point",
            user_types: [2],
            id: 2,
            name: "Voucher",
            brand: "Bata",
            points: 2,
            value: 2,
            images: [
              "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261376761-588744604.png",
            ],
            created_at: "2024-03-21T06:36:11.303Z",
            created_by_name: "Bata",
          },
          {
            catalogue_id: 2,
            catalogue_name: "new Bata",
            catalogue_type: "point",
            user_types: [2],
            id: 1,
            name: "Bata Card",
            brand: "Bata",
            points: 1,
            value: 1,
            images: [
              "https://genefied-saas-partner.s3.ap-south-1.amazonaws.com/uploads/image-1704261342488-442000408.jpg",
            ],
            created_at: "2024-03-21T06:36:11.303Z",
            created_by_name: "Bata",
          },
        ],
      },
    ],
  };
  

  useEffect(()=>{
    if(checkActiveSchemeData)
    {
      console.log("checkActiveSchemeData",checkActiveSchemeData)
    }
    else if(checkActiveSchemeError)
    {
      console.log("checkActiveSchemeError",checkActiveSchemeError)
    }
  },[checkAllSchemeData,checkAllSchemeError])


  useEffect(()=>{
    
      const currentScheme = schemeData?.body?.filter((item,index)=>{
        if(((new Date(item.scheme_start).getTime()< new Date().getTime()) && ( new Date().getTime()< new Date(item.scheme_end).getTime())))
        return item
      })
      setActiveScheme(currentScheme)
      console.log("current scheme", currentScheme)
  },[checkActiveSchemeError,checkActiveSchemeData])

  useEffect(() => {
    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        console.log(
          "Credentials successfully loaded for user " + credentials.username
        );
        const token = credentials.username;
        checkActiveSchemeFunc(token);
      }
    };
    getToken();
  }, []);

  useEffect(() => {
    if (checkActiveSchemeData) {
      console.log(
        "checkActiveSchemeData",
        JSON.stringify(checkActiveSchemeData)
      );
      if (checkActiveSchemeData.success) {
        setScheme(checkActiveSchemeData.body.scheme);
        setGifts(checkActiveSchemeData.body.gifts);
        getCategories(checkActiveSchemeData.body.gifts);
        setSelectedGifts(checkActiveSchemeData.body.gifts);
      }
    } else if (checkActiveSchemeError) {
      console.log("checkActiveSchemeError", checkActiveSchemeError);
    }
  }, [checkActiveSchemeData, checkActiveSchemeError]);

  const getCategories = (data) => {
    const categoryData = data.map((item, index) => {
      return item.brand.trim();
    });
    const set = new Set(categoryData);
    const tempArray = Array.from(set);
    setCategories(tempArray);
  };

  const handlePress = (data) => {
    setSelectedGifts(data);
    setSelected(true);
  };

  const FilterSchemeComponent = () => {
    const [selectedDataStart, setSelectedDataStart] = useState(new Date());
    const [selectedDataEnd, setSelectedDataEnd] = useState(new Date());

    const [openStart, setOpenStart] = useState(false);
    const [openEnd, setOpenEnd] = useState(false);


    return (
      <View style={{alignItems:'center',justifyContent:'center' ,width:'100%',flexDirection:'row',marginBottom:10}}>
        <View
          style={{
           padding:10,
            width: "44%",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection:'row'
          }}
        >
          <PoppinsTextMedium
            content={`Start Date ${moment(selectedDataStart).format("MM/YYYY")}`}
            style={{ width: "60%", fontSize: 16, fontWeight: "700" }}
          ></PoppinsTextMedium>
          <TouchableOpacity
            style={{
              backgroundColor: ternaryThemeColor,
              paddingLeft: 10,
              borderRadius: 6,
              paddingRight: 10,
              padding: 6,
              marginTop:10,
              marginLeft:10
            }}
            onPress={() => {
              setOpenStart(!openStart);
            }}
          >
            <DatePicker
              modal
              mode="date"
              open={openStart}
              date={selectedDataStart}
              onConfirm={(date) => {
                setOpenStart(false);
                setSelectedDataStart(date);
              }}
              onCancel={() => {
                setOpenStart(false);
              }}
            />
            <PoppinsTextMedium
              style={{ color: "white", fontWeight: "700" }}
              content=" Select"
            ></PoppinsTextMedium>
          </TouchableOpacity>
        </View>
        <View
          style={{
            padding:10,
            width: "44%",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection:'row',
            borderLeftWidth:1,
            marginLeft:10
          }}
        >
          <PoppinsTextMedium
            content={`End Date ${moment(selectedDataEnd).format("MM/YYYY")}`}
            style={{ width: "60%", fontSize: 16, fontWeight: "700" }}
          ></PoppinsTextMedium>
          <TouchableOpacity
            style={{
              backgroundColor: ternaryThemeColor,
              paddingLeft: 10,
              borderRadius: 6,
              paddingRight: 10,
              padding: 6,
              marginTop:10,
              marginLeft:10
            }}
            onPress={() => {
              setOpenEnd(!openEnd);
            }}
          >
            <DatePicker
              modal
              mode="date"
              open={openEnd}
              date={selectedDataEnd}
              onConfirm={(date) => {
                setOpenEnd(false);
                setSelectedDataEnd(date);
              }}
              onCancel={() => {
                setOpenEnd(false);
              }}
            />
            <PoppinsTextMedium
              style={{ color: "white", fontWeight: "700" }}
              content=" Select"
            ></PoppinsTextMedium>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const SchemeComponent = (props) => {
    const image = props.image;
    const name = props.name;
    const worth = props.worth;
    const earnedPoints = props?.data?.point_earned;
    const coin = props.coin;
    return (
      <View
        style={{
          width: "90%",
          borderWidth: 0.2,
          borderColor: "#DDDDDD",
          elevation: 10,
          height: 240,
          backgroundColor: secondaryThemeColor,
          borderRadius: 20,
          marginTop: 20,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            width: "36%",
            height: "100%",
            borderBottomWidth: 1,
            borderColor: "#DDDDDD",
            alignItems: "center",
            justifyContent: 'flex-start',
          }}
        >
          <View
            style={{
              height: 100,
              width: 100,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "white",
              marginTop:20
            }}
          >
            <Image
              style={{
                height: 100,
                width: 100,
                resizeMode: "contain",
                borderRadius: 10,
              }}
              source={{ uri: props.data?.image }}
            ></Image>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width:'100%',
              marginTop: 20,
             
            }}
          >
            <TouchableOpacity
              disabled = {!props.data.states?.includes(location.state)}
              onPress={() => {
                if((new Date(props.data.redeem_start).getTime() <= new Date().getTime()) && (new Date().getTime() <= new Date(props.data.redeem_end).getTime()))
                {
                  navigation.navigate("RedeemGifts",{
                    schemeType:'quaterly',
                    schemeGiftCatalogue:props.data?.gift_catalogue,
                    schemeID:props.data?.id
                  })
                }
                else { 
                  console.log("redemption window is not open", new Date(props.data.redeem_start).getTime(), new Date().getTime(), )
                  alert(`${t("Redemption window will start at")} ${props.data.redeem_start} ${t("and will end at")} ${props.data.redeem_end}`)
                }
                
              }}
              style={{
                height: 40,
                width: "90%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: props.data.states?.includes(location.state) ? "#D4B01C" : "#D5D4D3",
                borderRadius: 20,
              }}
            >
              <PoppinsTextMedium
                content="Redeem"
                style={{ color: props.data.states?.includes(location.state)? "white" : 'black', fontWeight: "800", fontSize: 15 }}
              ></PoppinsTextMedium>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { navigation.navigate("PdfComponent", { pdf: props.data?.pdf })}}
              style={{
                height: 40,
                width: "90%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: ternaryThemeColor,
                borderRadius: 20,
                marginLeft: 10,
                marginTop:10
              }}
            >
              <PoppinsTextMedium
                content="View"
                style={{ color: "white", fontWeight: "800", fontSize: 15 }}
              ></PoppinsTextMedium>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            width: "60%",
            height: "100%",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            marginTop: 30,
            marginLeft: 10,
          }}
        >
          <PoppinsTextMedium
            style={{ color: "white", fontSize: 16, fontWeight: "700" }}
            content={name}
          ></PoppinsTextMedium>

          <View
            style={{
              width: "90%",
              marginTop: 20,
              alignItems: "flex-start",
              justifyContent: "flex-start",
              borderBottomWidth: 1,
              borderColor: "white",
              flexDirection: "row",
            }}
          >
            <PoppinsTextLeftMedium
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: "500",
                width: "70%",
                textAlign: "left",
              }}
              content={`${name} Earned Points `}
            ></PoppinsTextLeftMedium>
            <Text style={{ textAlign: "left" }}></Text>
            <PoppinsTextMedium
              style={{
                color: "white",
                fontSize: 14,
                fontWeight: "500",
                width: "30%",
              }}
              content={earnedPoints}
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              width: "90%",
              marginTop: 10,
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "row",
            }}
          >
            <PoppinsTextLeftMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
                
                textAlign: "left",
              }}
              content={"Scheme Start Date"}
            ></PoppinsTextLeftMedium>
            <PoppinsTextMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
                marginLeft:10
              }}
              content={props.data?.scheme_start}
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              width: "90%",
              marginTop: 10,
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "row",
            }}
          >
            <PoppinsTextLeftMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
                
                textAlign: "left",
              }}
              content={"Scheme End Date"}
            ></PoppinsTextLeftMedium>
            <PoppinsTextMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
                marginLeft:10
              }}
              content={props.data?.scheme_end}
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              width: "90%",
              marginTop: 10,
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "row",
            }}
          >
            <PoppinsTextLeftMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
                
                textAlign: "left",
              }}
              content={"Redemption Start Date"}
            ></PoppinsTextLeftMedium>
            <PoppinsTextMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
                marginLeft:10
              }}
              content={props.data?.redeem_start}
            ></PoppinsTextMedium>
          </View>
          <View
            style={{
              width: "90%",
              marginTop: 10,
              alignItems: "flex-start",
              justifyContent: "flex-start",
              flexDirection: "row",
            }}
          >
            <PoppinsTextLeftMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
               
                textAlign: "left",
              }}
              content={"Redemption End Date"}
            ></PoppinsTextLeftMedium>
            <PoppinsTextMedium
              style={{
                color: "white",
                fontSize: 12,
                fontWeight: "500",
                marginLeft:10
              }}
              content={props.data?.redeem_end}
            ></PoppinsTextMedium>
          </View>
          <View style={{width:'100%',height:40,alignItems:'flex-start',justifyContent:'flex-start',flexDirection:'row',marginTop:10}}>
          <PoppinsTextMedium content="Applicable States :" style={{color:'white',fontSize:10}}></PoppinsTextMedium>

            {props?.data?.states?.map((item,index)=>{
              if(index ==props?.data?.states?.length-1)
              {
                return(
                  <PoppinsTextMedium content={`${item} `} style={{color:'white',fontSize:10}}></PoppinsTextMedium>
                )
              }
              else{
                return(
                  <PoppinsTextMedium content={`${item}, `} style={{color:'white',fontSize:10}}></PoppinsTextMedium>
                )
              }
              
            })}
          </View>
          
        </View>
      </View>
    );
  };
  const handleCurrentData=()=>{
    const currentScheme = schemeData?.body?.filter((item,index)=>{
      if(((new Date(item.scheme_start).getTime()< new Date().getTime()) && ( new Date().getTime()< new Date(item.scheme_end).getTime())))
      return item
    })
    setActiveScheme(currentScheme)
    console.log("current scheme", currentScheme)
  }
  const handlePreviousData=()=>{
    const currentScheme = schemeData?.body?.filter((item,index)=>{
      if((( new Date().getTime()> new Date(item.scheme_end).getTime())))
      return item
    })
    setActiveScheme(currentScheme)
    console.log("current scheme", currentScheme)
  }

  const FilterComp = (props) => {
    const [color, setColor] = useState("#F0F0F0");
    const [selected, setSelected] = useState(props.selected);
    const title = props.title;
    const togglebox = () => {
      setSelected(!selected);
      console.log("selected", selected);

      if (!selected) {
        const temp = [...gifts];
        const filteredArray = temp.filter((item, index) => {
          console.log("From filter", item.brand, title);
          return item.brand === title;
        });
        console.log("filteredArray", filteredArray);
        // setSelectedGifts(filteredArray)
        props.handlePress(filteredArray);
      }
    };
    console.log("selected", selected);
    return (
      <TouchableOpacity
        onPress={() => {
          togglebox();
        }}
        style={{
          minWidth: 60,
          height: 40,
          padding: 10,
          backgroundColor: selected ? secondaryThemeColor : "#F0F0F0",
          alignItems: "center",
          justifyContent: "center",
          margin: 10,
          borderRadius: 4,
        }}
      >
        <PoppinsTextMedium
          style={{ fontSize: 12, color: selected ? "white" : "black" }}
          content={title}
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
          height: 30,
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
          content="Scheme"
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
          minHeight: height - 30,
          marginTop: 10,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            height: 50,
            width: "90%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            borderBottomWidth: 1,
            borderColor: "#DDDDDD",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setHighlightWidthPrevious(false);
              handleCurrentData()
            }}
            style={{
              width: "50%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: highlightWidthPrevious ? 0 : 3,
              borderColor: ternaryThemeColor,
            }}
          >
            <PoppinsTextMedium
              style={{ color: "grey", fontSize: 16, fontWeight: "600" }}
              content="Current"
            ></PoppinsTextMedium>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setHighlightWidthPrevious(true);
              handlePreviousData()
            }}
            style={{
              width: "50%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              borderBottomWidth: highlightWidthPrevious ? 3 : 0,
              borderColor: ternaryThemeColor,
            }}
          >
            <PoppinsTextMedium
              style={{ color: "grey", fontSize: 16, fontWeight: "600" }}
              content="Previous"
            ></PoppinsTextMedium>
          </TouchableOpacity>
        </View>
        
        {/* <FilterSchemeComponent></FilterSchemeComponent> */}
        <ScrollView style={{ width: "100%",marginBottom:100 }}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* {gifts &&
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
              })} */}
            {activeScheme &&
              activeScheme.map((item, index) => {
                return (
                  <SchemeComponent
                    data = {item}
                    key={index}
                    name={item.name}
                    worth={"10000"}
                    coin={10}
                    image={""}
                    earnedPoints={100}
                  ></SchemeComponent>
                );
              })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
