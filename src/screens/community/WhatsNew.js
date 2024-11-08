//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { useGetAllMediaMutation } from '../../apiServices/mediaApi/GetMediaApi';
import * as Keychain from 'react-native-keychain';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import FastImage from 'react-native-fast-image';
import DataNotFound from '../data not found/DataNotFound';
import { useTranslation } from 'react-i18next';

// create a component
const WhatsNew = ({ navigation }) => {

    const [categories, setCategories] = useState();
    const [media, setMedia] = useState();

    const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loader2.gif')).uri;

    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';

        const {t} = useTranslation()

    const [getMediafunc, {
        data: getMediaData,
        error: getMediaError,
        isError: mediaIsError,
        isLoading: mediaIsLoading
    }] = useGetAllMediaMutation()

    const [getCategoryMediafunc, {
        data: getCatMediaData,
        error: getCatMediaError,
        isError: catMediaIsError,
        isLoading: catMediaIsLoading
    }] = useGetAllMediaMutation()


    //useEffect
    useEffect(() => {
        fetchMediaData();
    }, [])

    useEffect(() => {
        if (getMediaData) {
            console.log("getMediaData", getMediaData);
            if(getMediaData.success && getMediaData.body.length!==0)
            {
                getCategories(getMediaData.body)
                setMedia(getMediaData.body);
            }
            else{
                setMedia([])
            }
           

        }
        else {
            console.log("getMediaError", getMediaError)
        }

    }, [getMediaData, getMediaError])

    const fetchMediaData = async () => {
        const credentials = await Keychain.getGenericPassword();
        let obj = {
            token: credentials.username,
            isAll: true
        }
        getMediafunc(obj)
    }

    const fetchCategoryMedia = async (item) => {
        const credentials = await Keychain.getGenericPassword();
        let obj = {
            token: credentials.username,
            isAll: false,
            type: item
        }
        // getMediafunc(obj)
        getCategoryMediafunc(obj)
    }

    const getCategories = (data) => {
        console.log("getCategoryData", getCategories)
        const categoryData = data.map((item, index) => {
            return item.type.trim();
        });
        const set = new Set(categoryData);
        const tempArray = Array.from(set);
        console.log("tempArray", tempArray);
        setCategories(tempArray);
    };

    const handlePress = (itm) => {
        // console.log("item pressed", itm)
        // fetchCategoryMedia(itm)

    }

    const handlePressAll = () => {
        getMediaData && setMedia(getMediaData.body)
    }

    const FilterComp = (props) => {
        const [color, setColor] = useState("#F0F0F0");
        const [selected, setSelected] = useState(false);

        const title = props.title;

        const togglebox = () => {
            setSelected(!selected);

            console.log("selected", selected);


        };

        useEffect(() => {
            if (selected) {
                filterData()
                setColor(ternaryThemeColor)
            }
        }, [selected])


        const filterData = () => {
            if (selected === true) {
                const temp = [...getMediaData.body];
                const filteredArray = temp.filter((item, index) => {
                    console.log("From filter", item.type, title);
                    return item.type === title;
                });
                console.log("filteredArray", filteredArray);
                setMedia(filteredArray)
                props.handlePress(filteredArray);
            } else {

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
                    backgroundColor: selected ? ternaryThemeColor : '#80808030',
                    // backgroundColor: ternaryThemeColor,
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
        <View>
            {/* Navigator */}
            <View
                style={{
                    height: 50,
                    width: '100%',
                    backgroundColor: ternaryThemeColor,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    // marginTop: 10,
                }}>
                <TouchableOpacity
                    style={{ height: 20, width: 20, position: 'absolute', left: 20, marginTop: 10 }}
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Image
                        style={{ height: 20, width: 20, resizeMode: 'contain', marginTop: 5 }}
                        source={require('../../../assets/images/blackBack.png')}></Image>
                </TouchableOpacity>

                <PoppinsTextMedium style={{ fontSize: 20, color: '#ffffff', marginTop: 10, position: 'absolute', left: 60 }} content={t("What's New")}></PoppinsTextMedium>


            </View>
            {/* navigator */}

            <ScrollView
                contentContainerStyle={{
                    alignItems: "center",
                    // justifyContent: "center",
                    marginLeft: 20,
                    paddingRight: 20,
                    marginTop: 10,
                    flexDirection: "row",
                    // backgroundColor:'blue',
                }}
                horizontal={true}
                style={{

                }}
            >
                <FilterComp
                    handlePress={handlePressAll}
                    title="All"
                ></FilterComp>

                {console.log("categories", categories)}
                {categories &&
                    categories.map((item, index) => {
                        return (
                            <FilterComp
                                handlePress={() => handlePress(item)}
                                key={index}
                                title={item}
                            ></FilterComp>
                        );
                    })}
            </ScrollView>

            {/* Showing Data */}
            {console.log("the media", media)}


            <View style={{ height: '100%' }}>

                {mediaIsLoading &&
                    <View style={{height:'100%'}}>
                        <FastImage
                            style={{ width: 50, height: 50, alignItems: 'center', marginLeft: '45%', marginTop: '60%' }}
                            source={{
                                uri: gifUri, // Update the path to your GIF
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                    </View>

                }
                {
                    media  &&
                        <FlatList
                        style={{height:'100%'}}
                            data={media}
                            renderItem={({ item }) =>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, height: 120, backgroundColor: "#80808020", borderRadius: 10, marginHorizontal: 10, }}>
                                    {console.log("itm", item)}
                                    <View style={{ borderRadius: 100, borderColor: 'black', height: 50, borderWidth: 1, width: 50, marginLeft: 10, marginRight: 20, padding: 2,alignItems:'center',justifyContent:'center' }}>
                                        <Image
                                            style={{ height: '70%', width: '70%', resizeMode: 'contain' }}
                                            source={{ uri: item?.images[0] }}></Image>
                                    </View>

                                    <View style={{ flexDirection: 'column', width: '80%' }}>
                                        <PoppinsTextLeftMedium style={{ color: 'black', fontWeight: '600' }} content={`${item.title}`}></PoppinsTextLeftMedium>

                                        <PoppinsTextLeftMedium style={{ marginTop: 5, color:'black' }} content={`${item.description}`}></PoppinsTextLeftMedium>

                                    </View>

                                </View>
                            }
                            keyExtractor={item => item.id}
                        />

                       

                        


                }
                {
                    media && media.length===0 && <DataNotFound />
                }



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
        // backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default WhatsNew;