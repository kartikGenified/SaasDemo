import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import StatusBox from '../../components/atoms/StatusBox';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { appIcon } from '../../utils/HandleClientSetup';

const ScannedDetails = ({ navigation, route }) => {
    const { t } = useTranslation();
    const status = t("Success");

    const data = route.params.data;
    const image = data?.images !== null ? data?.images[0] : null;
    const date = data?.scanned_at;

    const ScannedDetailsProductBox = (props) => {
        const productName = data?.product_name;
        const productSerialNumber = data?.product_code;
        const recievedIn = props.recievedIn;
        return (
            <View style={{ height: 180, width: '100%', backgroundColor: '#DDDDDD', alignItems: "center", justifyContent: 'center', padding: 16, marginTop: 120 }}>
                <View style={{ height: 154, width: 154, borderRadius: 10, borderWidth: 1, backgroundColor: 'white', position: "absolute", top: -74, borderColor: '#DDDDDD', alignItems: "center", justifyContent: "center" }}>
                {image ? <Image style={{ height: 90, width: 90, resizeMode: "contain" }} source={{uri:image}}></Image>: <Image style={{ height: 60, width: 60, resizeMode: "contain" }} source={appIcon}></Image>}
                </View>
                <View style={{ alignItems: "flex-start", justifyContent: "center", position: "absolute", bottom: 10, left: 20 }}>
                    <PoppinsTextMedium style={{ margin: 4, fontSize: 18, fontWeight: '700', color: 'black' }} content={t("Product Name") + ` : ${productName}`}></PoppinsTextMedium>
                    <PoppinsTextMedium style={{ margin: 4, fontSize: 18, fontWeight: '700', color: 'black' }} content={t("Product S.No") + ` : ${productSerialNumber}`}></PoppinsTextMedium>
                </View>
            </View>
        );
    };

    const ClickToReport = () => {
        return (
            <View style={{ alignItems: "center", justifyContent: 'center', width: "100%", position: "absolute", bottom: 10 }}>
                <PoppinsTextMedium style={{ color: 'black', fontSize: 16, fontWeight: '700' }} content={t("Issue with this ?")}></PoppinsTextMedium>
                <TouchableOpacity onPress={() => { navigation.navigate("ReportAndIssue", { data: data }) }} style={{ height: 50, width: 180, backgroundColor: "#D10000", alignItems: "center", justifyContent: "center", borderRadius: 4, marginTop: 6 }}>
                    <PoppinsTextMedium style={{ color: 'white', fontSize: 16 }} content={t("Click here to report")}></PoppinsTextMedium>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={{ alignItems: "center", justifyContent: "flex-start", height: '100%' }}>
            <View style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row", width: '100%', marginTop: 10, height: 40, marginLeft: 20 }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Image style={{ height: 24, width: 24, resizeMode: 'contain', marginLeft: 10 }} source={require('../../../assets/images/blackBack.png')}></Image>
                </TouchableOpacity>
                <PoppinsTextMedium content={t("Scanned Details")} style={{ marginLeft: 10, fontSize: 16, fontWeight: '600', color: '#171717', fontWeight:'bold' }}></PoppinsTextMedium>
            </View>
            <StatusBox status={status}></StatusBox>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                    <Image style={{ height: 16, width: 16, resizeMode: 'contain' }} source={require('../../../assets/images/Date.png')}></Image>
                    <PoppinsTextMedium style={{ fontSize: 16, fontWeight: '800', color: 'black', marginLeft: 4 }} content={moment(date).format("DD MMM YYYY")}></PoppinsTextMedium>
                </View>
                <View style={{ width: 2, height: '100%', backgroundColor: "grey", marginLeft: 20 }}></View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginLeft: 10 }}>
                    <Image style={{ height: 16, width: 16, resizeMode: 'contain' }} source={require('../../../assets/images/clock.png')}></Image>
                    <PoppinsTextMedium style={{ fontSize: 16, fontWeight: '800', color: 'black', marginLeft: 4 }} content={moment(date).format("HH:mm A")}></PoppinsTextMedium>
                </View>
            </View>
            <ScannedDetailsProductBox></ScannedDetailsProductBox>
            {/* <ClickToReport></ClickToReport> */}
        </View>
    );
}

const styles = StyleSheet.create({})

export default ScannedDetails;
