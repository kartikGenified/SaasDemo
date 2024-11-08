
import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Linking } from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import { useProductInstallationVideoMutation } from '../../apiServices/installationVideo/InstallationVideoApi';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import DataNotFound from '../data not found/DataNotFound';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';

// create a component
const InstallationVideo = ({ navigation }) => {

    const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loader2.gif')).uri;

    const {t} = useTranslation()

    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';

    const [getVediofunc, {
        data: getVideoData,
        error: getVideoError,
        isError: videoIsError,
        isLoading: videoIsLoading
    }] = useProductInstallationVideoMutation();


    useEffect(() => {
        fetchVideoFunc();
    }, [])

    useEffect(() => {
        if (getVideoData) {
            console.log("getVideoData", getVideoData)
        }
        else {
            console.log("getVideoError", getVideoError)
        }
    }, [getVideoData, getVideoError])


    const fetchVideoFunc = async () => {
        const credentials = await Keychain.getGenericPassword();

        const token = credentials.username

        getVediofunc(token)
    }


    return (
        <View style={styles.container}>
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
                    style={{ height: 20, width: 20, position: 'absolute', left: 20, marginTop: 15 }}
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Image
                        style={{ height: 20, width: 20, resizeMode: 'contain' }}
                        source={require('../../../assets/images/blackBack.png')}></Image>
                </TouchableOpacity>

                <PoppinsTextMedium style={{ fontSize: 20, color: '#ffffff', marginTop: 10, position: 'absolute', left: 50 }} content={t("Installation Video")}></PoppinsTextMedium>

            </View>
            {/* navigator */}
            {videoIsLoading &&
                <FastImage
                    style={{ width: 50, height: "100%", alignItems:'center', marginLeft:'45%' }}
                    source={{
                        uri: gifUri, // Update the path to your GIF
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            }


            {/* Screen */}
            {getVideoData?.body?.data.length > 0 && 
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <FlatList
                        data={getVideoData?.body?.data}
                        renderItem={({ item }) =>
                            <TouchableOpacity onPress={() => {
                                Linking.openURL(item?.link)
                            }} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, height: 120, backgroundColor: "#80808010", borderRadius: 10, borderWidth: 1, borderColor: '#80808030', marginHorizontal: 10, justifyContent: 'space-between', padding: 10, }}>
                                <View>
                                    <PoppinsTextLeftMedium style={{ color: 'black', fontWeight: 'bold', padding: 10 }} content={`Title:   ${item.name}`}></PoppinsTextLeftMedium>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    Linking.openURL(item?.link)
                                }} style={{ padding: 20, borderWidth: 1, borderColor: 'red', width: 200, alignItems: 'center', borderRadius: 10 }}>
                                    <Image style={{ height: 50, width: 50 }} source={require('../../../assets/images/youtube.png')} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        }
                        keyExtractor={item => item.id}
                    />
                </View>
               
            }
            {
                getVideoData?.body?.data.length=== 0 && <DataNotFound></DataNotFound>
            }

            
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
export default InstallationVideo;