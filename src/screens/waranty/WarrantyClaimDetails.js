import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

// create a component
const WarrantyClaimDetails = ({ navigation, route }) => {

    const warrantyItemData = route.params.warrantyItemData;
    const afterClaimData = route.params.afterClaimData;

    console.log("after claim data", afterClaimData)

    const {t} = useTranslation()
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )


    return (
        <View style={styles.container}>
            <ScrollView style={{width:"100%"}}>
            {/* header */}
            <View style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row", width: '100%', marginTop: 10, height: 40, marginLeft: 20 }}>
                <TouchableOpacity onPress={() => {
                    navigation.goBack()
                }}>
                    <Image style={{ height: 24, width: 24, resizeMode: 'contain', marginLeft: 10 }} source={require('../../../assets/images/blackBack.png')}></Image>

                </TouchableOpacity>
                <PoppinsTextMedium content="Warranty Claim Details" style={{ marginLeft: 10, fontSize: 16, fontWeight: '600', color: '#171717' }}></PoppinsTextMedium>
                {/* <TouchableOpacity style={{ marginLeft: 180 }}>
                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../assets/images/notificationOn.png')}></Image>
                </TouchableOpacity> */}
            </View>
            {/* header */}

            <View style={styles.imageView}>
                <Image source={require('../../../assets/images/warrantyReport.png')} style={{ height: 82, width: 75 }} />
            </View>
            <View style={{ marginTop: 18, }}>
                <PoppinsTextMedium content="Dear User" style={{ fontWeight: 'bold', fontSize: 24, color: 'black' }} />
            </View>
            <View style={{ marginTop: 18, paddingHorizontal: 20 }}>
                <PoppinsTextMedium content={t("Thank You For Submitting Your details.")} style={{ fontWeight: '600', fontSize: 18, color: ternaryThemeColor }} />
                <PoppinsTextMedium content={t("We will get back to you soon.")} style={{ fontWeight: '600', fontSize: 18, color: ternaryThemeColor }} />
            </View>

            <View style={{ marginTop: 20 }}>
                <PoppinsTextMedium content={`Claim Date : ${moment(afterClaimData?.body?.claim_date).format('YYYY-MM-DD')}`} style={{ fontWeight: '700', fontSize: 20, color: ternaryThemeColor }} />
            </View>

            <View style={{
                marginTop: 50,
                paddingTop: 10,
                paddingBottom: 20,
                width: '90%',
                marginBottom: 10,
                borderWidth: 1,
                borderRadius: 10,
                borderStyle: 'dashed',
                borderColor: '#85BFF1',
                alignSelf: 'center'
            }}>
                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row',width:'100%' }}>
                    <PoppinsTextMedium content={t("Product Name")} style={{ fontWeight: '700', fontSize: 18, color: "#474747",width:'40%' }} />
                    <PoppinsTextMedium content={`${warrantyItemData?.product_name}`} style={{ fontWeight: '700', fontSize: 18, color: "#474747",width:'55%' }} />
                </View>

                <View style={{ marginHorizontal: 20, marginTop: 10, flexDirection: 'row' }}>
                    <PoppinsTextMedium content={t("Prdoduct Code")} style={{ fontWeight: '700', fontSize: 18, color: "#474747" }} />
                    <PoppinsTextMedium content={`${warrantyItemData?.product_code}`} style={{ fontWeight: '700', fontSize: 20, color: "#474747" }} />
                </View>


                <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                    <PoppinsTextLeftMedium content={t("Product Damage")} style={{ fontWeight: '700', fontSize: 18, color: ternaryThemeColor, }} />
                </View>
                <View style={{ marginHorizontal: 20, justifyContent: 'flex-start', }}>
                    <PoppinsTextLeftMedium style={{ fontWeight: '400', fontSize: 17, color: ternaryThemeColor, textAlign: 'left' }} content={`${warrantyItemData?.description}`} ></PoppinsTextLeftMedium>
                </View>
             

            </View>

            {/* {
                fetchAllQrScanedListIsLoading && <FastImage
                    style={{ width: 100, height: 100, alignSelf: 'center', marginTop: '50%' }}
                    source={{
                        uri: gifUri, // Update the path to your GIF
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            } */}

</ScrollView>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',

    },
    imageView: {
        marginTop: 76,
        alignSelf: 'center',

    }
});

//make this component available to the app
export default WarrantyClaimDetails;