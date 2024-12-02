//import liraries
import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { useGetAllMediaMutation, useGetMediaByIdQuery } from '../../apiServices/mediaApi/GetMediaApi';
import * as Keychain from 'react-native-keychain';
import { useGetSupportQueriesByIdMutation } from '../../apiServices/supportQueries/supportQueriesApi';
import DataNotFound from '../../screens/data not found/DataNotFound';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import Plus from 'react-native-vector-icons/AntDesign';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
// create a component
const QueryList = ({ navigation }) => {
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';

    const userData = useSelector(state => state.appusersdata.userData)
    console.log("Userdata", userData)

    const [getQueryfunc, {
        data: getQueryData,
        error: getQueryError,
        isError: QueryIsError,
        isLoading: QueryIsLoading
    }] = useGetSupportQueriesByIdMutation()

    const fetchQueries = async () => {
        const credentials = await Keychain.getGenericPassword();
        let obj = {
            token: credentials.username,
            body: {
                created_by_id: userData.id
            }
        }
        getQueryfunc(obj)
    }

    useEffect(() => {
        fetchQueries();
    }, [])

    useEffect(() => {
        if (getQueryData) {
            console.log("getQueryData", JSON.stringify(getQueryData))
        }
        else {
            console.log("getQueryError", getQueryError)
        }
    }, [getQueryData, getQueryError])



    const ListItem = (item) => {
        console.log("listItem", item)
        return (
            <View style={{
                shadowColor: 'rgba(0, 0, 0, 1)',
                shadowOpacity: 0.5,
                shadowRadius: 5,
                shadowOffset: {
                    height: 19,
                    width: 8,
                },
                borderWidth:1,
                borderColor:ternaryThemeColor,
                borderRadius:10,
                backgroundColor: 'white',
                elevation: 15,
                padding: 30,
                marginTop:20,
                marginHorizontal:15,
                
            }}>
                <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'center', }}>
                    <PoppinsTextLeftMedium style={{ color: ternaryThemeColor, fontWeight: '800', fontSize: 18 }} content={item?.data?.type}></PoppinsTextLeftMedium>

                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between',width:'100%' }}>
                <View style={{width:'70%' }}>

                <View style={{ marginTop: 10, flexDirection: 'row', }}>
                    <PoppinsTextLeftMedium style={{ color: 'black', fontSize: 15, fontWeight: '800' }} content={"Name:  "}></PoppinsTextLeftMedium>
                    <PoppinsTextLeftMedium style={{ color: 'black', fontSize: 15, fontWeight: '600' }} content={item?.data?.name}></PoppinsTextLeftMedium>
                </View>

                <View style={{ marginTop: 10, flexDirection: 'row', flexWrap: 'wrap' }}>
                    <PoppinsTextLeftMedium style={{ color: 'black', fontSize: 15, fontWeight: '800' }} content={"Query: "}></PoppinsTextLeftMedium>
                    <PoppinsTextLeftMedium style={{ color: 'black', fontSize: 15, fontWeight: '600' }} content={item?.data?.short_description}></PoppinsTextLeftMedium>
                </View>

                <View style={{ marginTop: 10, flexDirection: 'row', flexWrap: 'wrap' }}>
                    <PoppinsTextLeftMedium style={{ color: 'black', fontSize: 15, fontWeight: '800' }} content={"Description: "}></PoppinsTextLeftMedium>
                    <PoppinsTextLeftMedium style={{ color: 'black', fontSize: 15, fontWeight: '600' }} content={item?.data?.long_description}></PoppinsTextLeftMedium>
                </View>
                </View>
                {item?.data?.status =="2" && <View style={{alignItems:'center',justifyContent:'center',width:'30%'}}>
                <Image style={{ height: 40, width: 40, marginTop: 30 }} source={require('../../../assets/images/greenTick.png')} />
                <PoppinsTextLeftMedium style={{ color: 'black', fontSize: 15, fontWeight: '800' }} content="Resolved"></PoppinsTextLeftMedium>

                    </View>}
                {item?.data?.status =="1" &&
                <View style={{alignItems:'center',justifyContent:'center'}}>
                                 <Image style={{ height: 32, width: 32, marginTop: 30 }} source={require('../../../assets/images/cancel.png')} />
                <PoppinsTextLeftMedium style={{ color: 'black', fontSize: 15, fontWeight: '800' }} content="Active"></PoppinsTextLeftMedium>

                    </View>
    }
</View>

               

                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ marginTop: 10, flexDirection: 'row' }}>
                        <PoppinsTextLeftMedium style={{ color: 'black', fontSize: 15, fontWeight: '800' }} content={"User Type: "}></PoppinsTextLeftMedium>
                        <PoppinsTextLeftMedium style={{ color: 'black', fontSize: 15, fontWeight: '600' }} content={item?.data?.user_type}></PoppinsTextLeftMedium>
                    </View>

                   

                </View>



            </View>
        )
    }

    return (
        <View style={styles.container}>
            {/* Navigator */}
            <View
                style={{
                    height: 60,
                    width: '100%',
                    backgroundColor: ternaryThemeColor,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    // marginTop: 10,
                }}>
                <TouchableOpacity
                    style={{ height: 20, width: 20, position: 'absolute', left: 20, marginTop: "4%" }}
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Image
                        style={{ height: 20, width: 20, resizeMode: 'contain' }}
                        source={require('../../../assets/images/blackBack.png')}></Image>
                </TouchableOpacity>

                <PoppinsTextMedium style={{ fontSize: 20, fontWeight:'bold', color: '#ffffff', marginTop: "3%", position: 'absolute', left: 50 }} content={"Query List"}></PoppinsTextMedium>


            </View>
            {/* navigator */}

            <View>
                {getQueryData?.body?.supportQueriesList &&
                    <FlatList
                        data={getQueryData?.body?.supportQueriesList}
                        maxToRenderPerBatch={10}
                        initialNumToRender={10}
                        renderItem={({ item }) => (
                            <ListItem
                                data={item}
                            ></ListItem>
                        )}
                        keyExtractor={(item, index) => index}
                    />
                   
                }
                {
                    getQueryData?.body?.supportQueriesList?.length===0 && <DataNotFound></DataNotFound>
                }

            </View>
            <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 10, right: 20 }}>
          <PoppinsText content="Add Issue" style={{ color: ternaryThemeColor, fontSize: 16 }}></PoppinsText>
          <TouchableOpacity onPress={() => { navigation.navigate('SupportQueries') }} style={{ backgroundColor: '#DDDDDD', height: 60, width: 60, borderRadius: 30, alignItems: "center", justifyContent: 'center', marginLeft: 10 }}>

            <Plus name="pluscircle" size={50} color={ternaryThemeColor}></Plus>
          </TouchableOpacity>
        </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'

    },
});

//make this component available to the app
export default QueryList;