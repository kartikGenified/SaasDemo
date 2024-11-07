//import liraries
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useGetMembershipMutation } from '../../apiServices/membership/AppMembershipApi';
import * as Keychain from 'react-native-keychain';
import PlatinumModal from '../../components/platinum/PlatinumModal';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';



// create a component
const TierDetails = ({navigation}) => {

    const [membershipArray, setMembershipArray] = useState([]);

    const [getMembershipFunc, {
        data: getMembershipData,
        error: getMembershipError,
        isLoading: getMembershipIsLoading,
        isError: getMembershipIsError
    }] = useGetMembershipMutation()

    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';

    
    const {t} = useTranslation()


    const getMembership = async () => {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
            console.log(
                'Credentials successfully loaded for user ' + credentials.username
            );
            const token = credentials.username
            getMembershipFunc(token)
        }
    }

    useEffect(() => {
        getMembership();
    }, [])

    useEffect(() => {
        if (getMembershipData) {
            console.log("getMembershipData", JSON.stringify(getMembershipData.body))
            setMembershipArray(getMembershipData.body)
        }
        else if (getMembershipError) {
            console.log("getMembershipError", getMembershipError)
        }
    }, [getMembershipData, getMembershipError])

    function formatPurchaseValue(value) {
        const suffixes = ['', 'K', 'L', 'Cr']; // Thousand, Lakh, Crore
      
        let formattedValue = value.toString();
      
        for (let i = suffixes.length - 1; i > 0; i--) {
          const divisor = Math.pow(10, i * 2 + 1); // Adjusted to Indian numbering system
          if (value >= divisor) {
            formattedValue = (value / divisor).toFixed(2) + suffixes[i];
            break;
          }
        }
      
        return formattedValue;
      }

    return (
        <>
            {/* Navigator */}
            <View
                style={{
                    height: '10%',
                    width: '100%',
                    backgroundColor: ternaryThemeColor,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    // marginTop: 10,
                }}>
                <TouchableOpacity
                    style={{ height: 20, width: 20,marginLeft:10}}
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Image
                        style={{ height: 20, width: 20, resizeMode: 'contain' }}
                        source={require('../../../assets/images/blackBack.png')}></Image>
                </TouchableOpacity>

                <PoppinsTextMedium style={{ fontSize: 20, color: '#ffffff',marginLeft:10 }} content={t("Tier Details")}></PoppinsTextMedium>


            </View>
            {/* navigator */}
            <ScrollView horizontal={true} style={styles.container}>

                {getMembershipData?.body.map((itm,index) => {
                    return (
                        <View key={itm.id} >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>

                                    <View style={styles.modalTop}>
                                        <LinearGradient colors={itm.id == 1 ? ["#6b0ce4", "#9B56FE"] : itm.id == 2 ? ["#545E6C", "#9BA2AE"] : itm.id == 3 ? ["#BF133D", "#FB7185"] : itm.id == 4 ? ["#C3420D", "#FA913B"] : ["#6b0ce4", "#9B56FE"]} style={{ height: '100%', width: '100%', borderTopRightRadius: 40, borderTopLeftRadius: 40 }}>
                                            <View style={{ alignItems: 'center', marginTop: 30 }}>
                                                <PoppinsTextMedium style={{ fontSize: 22, fontWeight: '600', color: '#ffffff', fontWeight: 'bold', marginBottom: 20 }} content={itm?.tier?.name}></PoppinsTextMedium>

                                                <View style={styles.circle}>
                                                    <View style={{ alignItems: 'center' }}>
                                                        <Image
                                                            style={{ height: 100, width: 100, resizeMode: 'contain', marginTop: 25 }}
                                                            source={require('../../../assets/images/platinum.png')}></Image>
                                                    </View>

                                                </View>
                                            </View>
                                        </LinearGradient>
                                    </View>

                                    <View style={{ marginTop: 60, borderColor: "#808080" }}>
                                        <ScrollView style={styles.listContainer}>
                                            <View style={styles.flexRow}>
                                                <PoppinsTextMedium
                                                    style={{ color: '#000000', fontSize: 18, fontWeight: '700' }}
                                                    content={"Scan Value"}></PoppinsTextMedium>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <PoppinsTextMedium
                                                        style={{ color: '#000000', fontSize: 18, fontWeight: '600' }}
                                                        content={formatPurchaseValue(itm.range_start) + "-"}></PoppinsTextMedium>
                                                    <PoppinsTextMedium
                                                        style={{ color: '#000000', fontSize: 18, fontWeight: '600' }}
                                                        content={formatPurchaseValue(itm.range_end)}></PoppinsTextMedium>
                                                </View>
                                            </View>

                                            <View style={{ borderWidth: 0.3, borderColor: "#808080", marginTop: 20, }}></View>
                                            <View style={styles.flexRow}>
                                                <PoppinsTextMedium
                                                    style={{ color: '#000000', fontSize: 18, fontWeight: '700' }}
                                                    content={"Scan/ Month"}></PoppinsTextMedium>
                                                
                                <View style={{ flexDirection: 'row' }}>
                                    <PoppinsTextMedium
                                        style={{ color: '#000000', fontSize: 18, fontWeight: '600' }}
                                        content={itm.per_month}></PoppinsTextMedium>
                                </View>

                                            </View>

                                            <View style={{ borderWidth: 0.3, borderColor: "#808080", marginTop: 20, }}></View>

                                            <View style={styles.flexRow}>
                                                <PoppinsTextMedium
                                                    style={{ color: '#000000', fontSize: 18, fontWeight: '700' }}
                                                    content={"Points Multiplier %"}></PoppinsTextMedium>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <PoppinsTextMedium
                                        style={{ color: '#000000', fontSize: 18, fontWeight: '600' }}
                                        content={itm.points}></PoppinsTextMedium>
                                                </View>

                                            </View>

                                            <View style={{ borderWidth: 0.3, borderColor: "#808080", marginTop: 20, }}></View>

                                            <View style={styles.flexRow}>
                                                <PoppinsTextMedium
                                                    style={{ color: '#000000', fontSize: 18, fontWeight: '700' }}
                                                    content={"Gift Discount %"}></PoppinsTextMedium>
                                                
                                <View style={{ flexDirection: 'row' }}>
                                    <PoppinsTextMedium
                                        style={{ color: '#000000', fontSize: 18, fontWeight: '600' }}
                                        content ={itm.gift_discount}></PoppinsTextMedium>
                                </View>

                                            </View>

                                            <View style={{ borderWidth: 0.3, borderColor: "#808080", marginTop: 20, }}></View>

                                            <View style={styles.flexRow}>
                                                <PoppinsTextMedium
                                                    style={{ color: '#000000', fontSize: 18, fontWeight: '700' }}
                                                    content={"Cashback Option"}></PoppinsTextMedium>
                                                
                                <View style={{ flexDirection: 'row' }}>
                                    <PoppinsTextMedium
                                        style={{ color: itm.cashback == true ? "#268F07" : '#000000', fontSize: 18, fontWeight: '600' }}
                                        content={itm.cashback == true ? "Yes" : "No"}></PoppinsTextMedium>
                                </View>

                                            </View>

                                            <View style={{ borderWidth: 0.3, borderColor: "#808080", marginTop: 20, }}></View>

                                        </ScrollView>
                                    </View>

                                    {/* <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Icon name="close" size={20} color="#ffffff" />
                    </TouchableOpacity> */}
                                </View>
                            </View >
                        </View>
                    )
                })}
            </ScrollView>
        </>

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
    modalContainer: {
        flex: 1,
        // justifyContent: 'center',
        marginTop: 30,
        // alignItems: 'center',
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 0.5,
        margin: 10,
        width: 300,
        height: 610,
        borderRadius: 10,
        padding: 20,
    },
    successText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 10,
        backgroundColor: '#0004ec',
        borderRadius: 10,
        position: 'absolute',
        top: -10,
        right: -10,
    },

    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalTop: {
        height: 161,
        width: '100%',
    },
    circle: {
        backgroundColor: "#ffffff",
        height: 147,
        width: 147,
        borderRadius: 90
    },
    listContainer: {
        marginTop: 20,
    },
    flexRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginTop: 20
    }
});

//make this component available to the app
export default TierDetails;