//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import Plus from 'react-native-vector-icons/AntDesign';
import { useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import * as Keychain from 'react-native-keychain';
import { useFetchAllQrScanedListMutation } from '../../apiServices/qrScan/AddQrApi';
import { FlatList } from 'react-native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';


// create a component
const AddedUserScanList = ({ navigation, route }) => {
  const [scannedListData, setScannedListData] = useState([]);

  const {t} = useTranslation()

    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        

    const data = route.params.data;

    const [userPointFunc, {
        data: userPointData,
        error: userPointError,
        isLoading: userPointIsLoading,
        isError: userPointIsError
    }] = useFetchUserPointsMutation();

    const [
        fetchAllQrScanedList,
        {
            data: fetchAllQrScanedListData,
            isLoading: fetchAllQrScanedListIsLoading,
            error: fetchAllQrScanedListError,
            isError: fetchAllQrScanedListIsError,
        },
    ] = useFetchAllQrScanedListMutation();



    useEffect(() => {
        console.log("AddedUserScanList", data)
        fetchPoints();
    }, [])

    useEffect(() => {
        (async () => {
            const credentials = await Keychain.getGenericPassword();
            const token = credentials.username;
            const fromDate = data?.created_at;
            let toDate;
            let queryParams = `?user_type_id=${data.mapped_user_type_id}&app_user_id=${data.mapped_app_user_id}`;
            if (fromDate && toDate) {
                queryParams += `&from_date=${moment(fromDate).format(
                    "YYYY-MM-DD"
                )}&to_date=${moment(toDate).format("YYYY-MM-DD")}`;
            } else if (fromDate) {
                queryParams += `&from_date=${fromDate}`;
            }

            console.log("queryParams", queryParams);

            fetchAllQrScanedList({
                token: token,
                query_params: queryParams,
            });
        })();
    }, []);

    useEffect(() => {
        if (fetchAllQrScanedListData) {
          console.log(
            "fetchAllQrScanedListData",
            fetchAllQrScanedListData.body.data
          );
          fetchDates(fetchAllQrScanedListData.body.data);
        } else if (fetchAllQrScanedListError) {
          console.log("fetchAllQrScanedListError", fetchAllQrScanedListError);
        }
      }, [fetchAllQrScanedListData, fetchAllQrScanedListError]);

    useEffect(() => {
        if (userPointData) {
            console.log("userPointData", userPointData)
        } else {
            console.log("userPointError", userPointError)
        }
    }, [userPointData, userPointError])

    const fetchPoints = async () => {
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.username;
        const params = {
            userId: data.mapped_app_user_id,
            token: token
        }
        userPointFunc(params)
    }

    const ListItem = (props) => {
        const description = props.description;
        const productCode = props.productCode;
        const time = props.time;
        const amount = props.amount;
        const data = props.data;
    
        const image = data.images !== null ? data.images[0] : null;
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ScannedDetails", { data: data });
            }}
            style={{
              flexDirection: "row",
            //   alignItems: "center",
            //   justifyContent: "center",
              margin: 4,
              width: "100%",
              backgroundColor: "white",
            }}
          >
            <View
              style={{
                height: 70,
                width: 70,
                alignItems: "center",
                // justifyContent: "center",
                borderRadius: 10,
                borderColor: "#DDDDDD",
              }}
            >
              {image !== null && (
                <Image
                  style={{ height: 60, width: 60, resizeMode: "contain" }}
                  source={{ uri: image }}
                ></Image>
              )}
            </View>
            <View
              style={{
                alignItems: "flex-start",
                justifyContent: "center",
                marginLeft: 10,
                width: 200,
              }}
            >
              <PoppinsTextMedium
                style={{
                  fontWeight: "600",
                  fontSize: 14,
                  textAlign: "auto",
                  color: "black",
                }}
                content={description}
              ></PoppinsTextMedium>
              <PoppinsTextMedium
                style={{ fontWeight: "400", fontSize: 12, color: "black" }}
                content={`${t("Product Code")} : ${productCode}`}
              ></PoppinsTextMedium>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                }}
              >
                <Image
                  style={{ height: 14, width: 14, resizeMode: "contain" }}
                  source={require("..s/../../assets/images/clock.png")}
                ></Image>
                <PoppinsTextMedium
                  style={{
                    fontWeight: "200",
                    fontSize: 12,
                    marginLeft: 4,
                    color: "black",
                  }}
                  content={time}
                ></PoppinsTextMedium>
              </View>
            </View>
            {amount ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 10,
                }}
              >
                <Image
                  style={{ height: 20, width: 20, resizeMode: "contain" }}
                  source={require("../../../assets/images/wallet.png")}
                ></Image>
                <PoppinsTextMedium
                  style={{ color: "#91B406", fontSize: 16, color: "black" }}
                  content={` + ${amount}`}
                ></PoppinsTextMedium>
              </View>
            ) : (
              <View style={{ width: 100 }}></View>
            )}
          </TouchableOpacity>
        );
      };


    const fetchDates = (data) => {
        const dateArr = [];
        let tempArr = [];
        let tempData = [];
        data.map((item, index) => {
            dateArr.push(moment(item.scanned_at).format("DD-MMM-YYYY"));
        });
        const distinctDates = Array.from(new Set(dateArr));
        console.log("distinctDates", distinctDates);

        distinctDates.map((item1, index) => {
            tempData = [];
            data.map((item2, index) => {
                if (moment(item2.scanned_at).format("DD-MMM-YYYY") === item1) {
                    tempData.push(item2);
                }
            });
            tempArr.push({
                date: item1,
                data: tempData,
            });
        });
        setScannedListData(tempArr);
        console.log("tempArr", JSON.stringify(tempArr));
    };


    return (
        <View style={styles.container}>
            {/* Navigator */}
            <View
                style={{
                    height: '10%',
                    width: '100%',
                    backgroundColor: ternaryThemeColor,
                    alignItems:'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    
                }}>
                <TouchableOpacity
                    style={{ height: 20, width: 20, marginLeft:10 }}
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Image
                        style={{ height: 20, width: 20, resizeMode: 'contain' }}
                        source={require('../../../assets/images/blackBack.png')}></Image>
                </TouchableOpacity>

                <PoppinsTextMedium style={{ fontSize: 20, color: '#ffffff',marginLeft:10}} content={t("Added User Scanned List")}></PoppinsTextMedium>


            </View>
            {/* navigator */}

            <View style={{height:'90%',  width: '100%',alignItems:"flex-start", justifyContent: 'flex-start', paddingTop: 30 }}>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginLeft: 10, height:'20%'}}>
                    <View style={styles.box2}>
                        <Image style={styles.boxImage2} source={require('../../../assets/images/points.png')}></Image>
                        <View style={{ alignItems: 'center' }}>
                            <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '800', fontSize: 20, }} content={` ${userPointData?.body?.point_earned}`} ></PoppinsTextLeftMedium>

                            <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '600' }} content={t(`Earned Points`)} ></PoppinsTextLeftMedium>

                        </View>
                    </View>

                    <View style={styles.box2}>
                        <Image style={styles.boxImage2} source={require('../../../assets/images/points.png')}></Image>
                        <View style={{ alignItems: 'center' }}>
                            <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '800', fontSize: 20, }} content={`${userPointData?.body?.point_redeemed}`}></PoppinsTextLeftMedium>


                            <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '600' }} content={t(`Point Redeemed`)} ></PoppinsTextLeftMedium>

                        </View>
                    </View>

                    <View style={styles.box2}>
                        <Image style={styles.boxImage2} source={require('../../../assets/images/points.png')}></Image>
                        <View style={{ alignItems: 'center' }}>
                            {/* <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '800', fontSize: 20, }} content={` ${inactive}`}></PoppinsTextLeftMedium> */}

                            <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '800', fontSize: 20, }} content={` ${userPointData?.body?.point_balance}`} ></PoppinsTextLeftMedium>

                            <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '600' }} content={t(`Point Balance`)} ></PoppinsTextLeftMedium>

                        </View>
                    </View>


                    <View style={styles.box2}>
                        <Image style={styles.boxImage2} source={require('../../../assets/images/points.png')}></Image>
                        <View style={{ alignItems: 'center' }}>
                            {/* <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '800', fontSize: 20, }} content={` ${inactive}`}></PoppinsTextLeftMedium> */}

                            <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '800', fontSize: 20, }} content={` ${userPointData?.body?.point_reserved}`} ></PoppinsTextLeftMedium>

                            <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '600' }} content={t(`Reserved Points`)} ></PoppinsTextLeftMedium>

                        </View>
                    </View>


                    <View style={styles.box2}>
                        <Image style={styles.boxImage2} source={require('../../../assets/images/points.png')}></Image>
                        <View style={{ alignItems: 'center' }}>
                            {/* <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '800', fontSize: 20, }} content={` ${inactive}`}></PoppinsTextLeftMedium> */}

                            <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '800', fontSize: 20, }} content={String(Number(userPointData?.body?.point_reserved) + Number(userPointData?.body?.point_earned)).substring(0, 6)} ></PoppinsTextLeftMedium>

                            <PoppinsTextLeftMedium style={{ marginLeft: 5, color: 'black', fontWeight: '600' }} content={t(`Total Points`)} ></PoppinsTextLeftMedium>

                        </View>
                    </View>






                </ScrollView>

     
                    {/* {userList && userList?.body?.map((item, index) => {
                        return (
                            <UserListComponent userType={item.mapped_user_type} name={item.mapped_app_user_name} mobile={item.mapped_app_user_mobile} key={index} index={index} status={item.status} item={item}></UserListComponent>
                        )
                    })} */}
            

                
                {
                <FlatList
                    data={scannedListData}
                    maxToRenderPerBatch={10}
                    initialNumToRender={10}
                    contentContainerStyle={{alignItems:'center',justifyContent:'center'}}
                    style={{height:'80%',width:'100%'}}
                    renderItem={({ item, index }) => (
                        <View
                            style={{
                                // alignItems: "flex-start",
                                // justifyContent: "center",
                                width: "100%",
                            }}
                        >
                            <View
                                style={{
                                    // alignItems: "center",
                                    // justifyContent: "flex-start",
                                    paddingBottom: 10,
                                    marginTop: 20,
                                    marginLeft: 20,
                                }}
                            >
                                <PoppinsTextMedium
                                    style={{ color: "black", fontSize: 16 }}
                                    content={item.date}
                                ></PoppinsTextMedium>
                            </View>
                            <FlatList
                                data={item.data}
                                maxToRenderPerBatch={10}
                                initialNumToRender={10}
                                renderItem={({ item }) => (
                                    <ListItem
                                        data={item}
                                        description={item.product_name}
                                        productCode={item.product_code}
                                        time={moment(item.scanned_at).format("HH:mm a")}
                                    ></ListItem>
                                )}
                                keyExtractor={(item, index) => index}
                            />
                        </View>
                    )}
                    keyExtractor={(item, index) => index}
                />
            }
            </View>
        </View>


    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        height:'100%',
        width:'100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    box1: {
        height: 125,
        width: 140,
        alignItems: 'center',
        backgroundColor: "#FFF4DE",
        borderRadius: 10,
        // justifyContent: 'center'
        justifyContent: 'space-around',
        padding: 10,
        marginRight: 10
    },
    box2: {
        height: 125,
        width: 140,
        alignItems: 'center',
        backgroundColor: "#DCFCE7",
        borderRadius: 10,
        // justifyContent: 'center'
        justifyContent: 'space-around',
        padding: 10,
        marginRight: 10
    },
    box3: {
        height: 125,
        width: 140,
        alignItems: 'center',
        backgroundColor: "#FFE2E6",
        borderRadius: 10,
        // justifyContent: 'center'
        justifyContent: 'space-around',
        padding: 10,
        marginRight: 10
    },
    boxImage: {
        height: 51,
        width: 72
    },
    boxImage2: {
        height: 39,
        width: 38
    }
});

//make this component available to the app
export default AddedUserScanList;