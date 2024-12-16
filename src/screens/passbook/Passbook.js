import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableOpacity, Text } from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import RewardBox from '../../components/molecules/RewardBox';
import { useGetActiveMembershipMutation } from '../../apiServices/membership/AppMembershipApi';
import * as Keychain from 'react-native-keychain';
import PlatinumModal from '../../components/platinum/PlatinumModal';
import { useGetPointSharingDataMutation } from '../../apiServices/pointSharing/pointSharingApi';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import { useTranslation } from 'react-i18next';
import { neededHistory } from '../../utils/HandleClientSetup';

const Passbook = ({ navigation }) => {
    const [warrantyOptionEnabled, setWarrantyOptionEnabled] = useState(false)
    const [couponOptionEnabled, setCouponOptionEnabled] = useState(false)
    const [cashbackOptionEnabled, setCashbackOptionEnabled] = useState(false)
    const [wheelOptionEnabled, setWheelOptionEnabled] = useState(false)
    const [pointsOptionEnabled, setPointsOptionEnabled] = useState(false)
    const [PlatinumModalOpen, setPlatinumModal] = useState(false)
    const [listView, setListView] = useState(true)

    const shouldSharePoints = useSelector(state => state.pointSharing.shouldSharePoints)

    const { t } = useTranslation();

    const [getPointSharingFunc, {
        data: getPointSharingData,
        error: getPointSharingError,
        isLoading: getPointSharingIsLoading,
        isError: getPointSharingIsError
    }] = useGetPointSharingDataMutation()




    const [getActiveMembershipFunc, {
        data: getActiveMembershipData,
        error: getActiveMembershipError,
        isLoading: getActiveMembershipIsLoading,
        isError: getActiveMembershipIsError
    }] = useGetActiveMembershipMutation();

    const [pointSharing, setPointSharing] = useState(false)
    const colors = ["blue", "red", "green"]


    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';
    const userData = useSelector(state => state.appusersdata.userData)

    console.log('userdata', userData)
    const workflowProgram = useSelector(state => state.appWorkflow.program);
    const pointSharingData = useSelector(state => state.pointSharing.pointSharing)
    console.log("pointSharingData", JSON.stringify(pointSharingData),workflowProgram)
    const name = userData.name
    const membership = getActiveMembershipData && getActiveMembershipData.body?.tier.name;


    const getOptionsAccordingToWorkflow = () => {
        if (workflowProgram.includes('Warranty')) {
            setWarrantyOptionEnabled(true)
        }
        if (workflowProgram.includes('Static Coupon')) {
            setCouponOptionEnabled(true)
        }
        if (workflowProgram.includes('Points On Product')) {
            setPointsOptionEnabled(true)
        }
        if (workflowProgram.includes('Cashback')) {
            setCashbackOptionEnabled(true)
        }
        if (workflowProgram.includes('Wheel')) {
            setWheelOptionEnabled(true)
        }

    }
    useEffect(() => {
        getOptionsAccordingToWorkflow()
        getMembership()
    }, [])

    useEffect(() => {
        (async () => {
            const credentials = await Keychain.getGenericPassword();
            const token = credentials.username;
            const params = {
                token: token,
                id: String(userData.id),
                cause: "registration_bonus"
            }
            getPointSharingFunc(params)

        })();
    }, []);


    useEffect(() => {
        if (getPointSharingData) {
            console.log("getPointSharingData", JSON.stringify(getPointSharingData))

        }
        else if (getPointSharingError) {
            console.log("getPointSharingError", getPointSharingError)
        }
    }, [getPointSharingData, getPointSharingError])


    const checkForPointSharing = () => {
        if (pointSharingData.is_point_sharing_bw_user) {
            setPointSharing(Object.keys(pointSharingData.point_sharing_bw_user.user).includes(userData.user_type))
            console.log("pointSharingData list", pointSharingData.point_sharing_bw_user.user)
        }
    }
    const getMembership = async () => {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
            console.log(
                'Credentials successfully loaded for user ' + credentials.username
            );
            const token = credentials.username
            getActiveMembershipFunc(token)
        }
    }

    const closePlatinumModal = () => {
        setPlatinumModal(false)
    }

    useEffect(() => {
        getOptionsAccordingToWorkflow()
        checkForPointSharing()
    }, [])

    useEffect(() => {
        if (getActiveMembershipData) {
            console.log("getActiveMembershipData", JSON.stringify(getActiveMembershipData))
        }
        else if (getActiveMembershipError) {
            console.log("getActiveMembershipError", getActiveMembershipError)
        }
    }, [getActiveMembershipData, getActiveMembershipError])

    const NavigateTO = (props) => {
        const title = props.title
        const visibleTitle = props.visibleTitle
        const discription = props.discription
        const image = props.image
        const navigateToPages = (data) => {

            console.log("navigateToPages", data)
            if (data === "Scanned History") {
                navigation.navigate('ScannedHistory')
            }
            else if (data === "Points History") {
                navigation.navigate('PointHistory')

            }
            else if (data === "Redeemed History") {
                navigation.navigate('RedeemedHistory')

            }
            else if (data === "Cashback History") {
                navigation.navigate('CashbackHistory')

            }
            else if (data === "Coupon History") {
                navigation.navigate('CouponHistory')

            }
            else if (data === "Wheel History") {
                navigation.navigate('WheelHistory')

            }

            else if (data === "Warranty History") {
                navigation.navigate('WarrantyHistory')

            }
            else if (data === "Previous Transaction History") {
                console.log("PreviousTransactionHistory")
                navigation.navigate('PreviousTransactionHistory')

            }
            else if (data === "Shared Point History") {
                navigation.navigate('SharedPointsHistory')

            }
        }


        return (
            <TouchableOpacity onPress={() => {
                navigateToPages(title)
            }} style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", borderBottomWidth: 1, width: '100%', borderColor: '#EEEEEE', padding: 6, paddingTop: 8, paddingBottom: 8 }}>
                <View style={{ height: 44, width: 44, alignItems: "center", justifyContent: "center", borderRadius: 4, borderColor: ternaryThemeColor, borderWidth: 1, marginLeft: 10 }}>
                    <Image style={{ height: 26, width: 26, resizeMode: "contain" }} source={image}></Image>
                </View>
                <View style={{  width: 210, alignItems: "flex-start", justifyContent: "center", marginLeft: 14 }}>
                    <PoppinsText style={{ color: 'black', fontSize: 14 }} content={visibleTitle}></PoppinsText>
                    <PoppinsTextMedium style={{ color: 'grey', fontSize: 12, textAlign: 'left' }} content={discription}></PoppinsTextMedium>
                </View>
                <TouchableOpacity onPress={() => {
                    navigateToPages(title)
                }} style={{ marginLeft: 20 }}>
                    <Image style={{ height: 22, width: 22, resizeMode: "contain" }} source={require('../../../assets/images/goNext.png')}></Image>
                </TouchableOpacity>

            </TouchableOpacity>
        )
    }

    const GridVIew = (props) => {
        const title = props.title
        const discription = props.discription
        const image = props.image
        const navigateToPages = (data) => {

            console.log("navigateToPages",data)
            
            if (data === "Scanned History") {
                navigation.navigate('ScannedHistory')
            }
            else if (data === "Points History") {
                navigation.navigate('PointHistory')

            }
            else if (data === "Redeemed History") {
                navigation.navigate('RedeemedHistory')

            }
            else if (data === "Cashback History") {
                navigation.navigate('CashbackHistory')

            }
            else if (data === "Coupon History") {
                navigation.navigate('CouponHistory')

            }
            else if (data === "Wheel History") {
                navigation.navigate('WheelHistory')

            }
            else if (data === "Warranty History") {
                navigation.navigate('WarrantyHistory')

            }
            else if (data === "Shared Point History") {
                navigation.navigate('SharedPointsHistory')

            }
            else if (data === "Previous Transaction History") {
                navigation.navigate('PreviousTransactionHistory')

            }
        }


        return (
            <View>
                <TouchableOpacity onPress={() => {
                    navigateToPages(title)
                }} style={{ flexDirection: "column", borderWidth: 2, width: 70, height: 70, borderColor: ternaryThemeColor, padding: 6, marginTop: 15, marginHorizontal: 22, alignItems: 'center' }}>
                    <View style={{ height: 44, width: 44, alignItems: "center", justifyContent: "center", }}>
                        <Image style={{ height: 40, width: 40, resizeMode: "contain", }} source={image}></Image>
                    </View>
                </TouchableOpacity>

                <View style={{ width: 80, marginTop: 6, alignSelf: 'center' }}>
                    <PoppinsTextMedium style={{ color: 'black', fontWeight: '800', fontSize: 14, textAlign: 'center' }} content={title}></PoppinsTextMedium>
                </View>
            </View>

        )
    }



    return (
        <ScrollView style={{ height: '100%', width: '100%', flex: 1 }}>
            <View style={{ alignItems: "center", height: '100%', width: "100%", backgroundColor: "white", paddingBottom: 100, }}>

                {/* coloured header */}
                <View style={{ height: 250, width: '100%', backgroundColor: ternaryThemeColor, alignItems: "flex-start", justifyContent: 'flex-start' }}>

                    <View style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row", width: '100%', marginTop: 10, height: 40, marginLeft: 20 }}>
                        <TouchableOpacity onPress={() => { navigation.navigate("Dashboard") }}>
                            <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../assets/images/blackBack.png')}></Image>
                        </TouchableOpacity>
                        <PoppinsTextMedium content={t("Passbook" )}style={{ marginLeft: 10, fontSize: 18, fontWeight: '700', color: 'white' }}></PoppinsTextMedium>
                        {/* <TouchableOpacity style={{marginLeft:'50%'}}>
            <Image style={{height:30,width:30,resizeMode:'contain'}} source={require('../../../assets/images/notificationOn.png')}></Image>
            </TouchableOpacity> */}
                    </View>
                    {/* name and membership */}
                    {/* --------------------------- */}
                    <View style={{ flexDirection: "row", height: 50, width: '100%', alignItems: "center", justifyContent: "flex-start" }}>
                        <PoppinsText content={name} style={{ color: 'white', fontSize: 20, marginLeft: 20 }}></PoppinsText>
                        <View style={{ height: 20, width: 2, backgroundColor: "white", marginLeft: 10 }}></View>

                        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                            setPlatinumModal(true)
                        }}>
                            <Image style={{ height: 20, width: 20, resizeMode: 'contain', marginLeft: 10 }} source={require('../../../assets/images/reward.png')}></Image>
                            <PoppinsTextMedium style={{ color: "white" }} content={membership}></PoppinsTextMedium>
                        </TouchableOpacity>

                    </View>
                    {workflowProgram?.length !== 0 && <View style={{ alignItems: "center", justifyContent: "center", width: '100%', }}>
                        <RewardBox ></RewardBox>

                    </View>}

                    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                        <View style={{ backgroundColor: 'white' }}>
                            {userData && <TouchableOpacity style={{ backgroundColor: ternaryThemeColor, padding: 10, borderRadius: 5, width: 120, alignItems: 'center', }} onPress={() => { navigation.navigate("RedeemedHistory") }}>
                                <PoppinsTextLeftMedium style={{ color: 'white', fontWeight: '800' }} content="Redeem"  ></PoppinsTextLeftMedium>
                            </TouchableOpacity>}
                        </View>
                    </View>
                
                </View>
{/* 
                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                        <View style={{ backgroundColor: ternaryThemeColor, }}>
                            {userData && <TouchableOpacity style={{ backgroundColor: ternaryThemeColor, padding: 10, borderRadius: 5, width: 120, alignItems: 'center', }} onPress={() => { navigation.navigate("RedeemedHistory") }}>
                                <PoppinsTextLeftMedium style={{ color: 'white', fontWeight: '800' }} content={t("redeem")}  ></PoppinsTextLeftMedium>
                            </TouchableOpacity>}
                        </View>
                    </View> */}

                {/* options----------------------------- */}

                {
                    listView &&
                    <View style={{ width: '90%', alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 20, marginTop: 100 }}>

                        <View style={{ width: '100%', height: 50, flexDirection: "row", alignItems: "center", justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEEEEE' }}>
                            <View style={{width:'70%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                            {(getPointSharingData?.body?.total !== "0") ? <PoppinsTextMedium style={{ color: ternaryThemeColor, fontWeight: 'bold', position: 'absolute', left: 10 }} content={`${t("registration bonus")}: ${getPointSharingData?.body?.data?.[0]?.points ? getPointSharingData?.body?.data?.[0]?.points + "Points" : "loading"} `}></PoppinsTextMedium >
                                : <PoppinsTextMedium style={{ fontWeight: 'bold', position: 'absolute', left: 10 }} content={t("what do you want to do")}></PoppinsTextMedium>
                            }
                            </View>
                            
                            <View style={{ flexDirection: 'row', position: 'absolute', right: 20,width:'20%'}}>

                                <TouchableOpacity style={{ backgroundColor: listView ? ternaryThemeColor : 'white', marginRight: 10, paddingHorizontal: 7, paddingVertical: 4 }} onPress={() => {
                                    setListView(true)
                                }}>
                                    <Image style={{ height: 15, width: 15, resizeMode: 'contain', }} source={require('../../../assets/images/listwhite.png')}></Image>

                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    setListView(!listView)
                                }}>
                                    <Image style={{ height: 20, width: 20, resizeMode: 'contain', }} source={require('../../../assets/images/grid.png')}></Image>

                                </TouchableOpacity>

                            </View>
                        </View>

                        {
                            pointsOptionEnabled && neededHistory.includes("points") &&
                            <NavigateTO visibleTitle={t("points history")} title={"Points History"} discription={t("list of points redeemed by you")} image={require('../../../assets/images/coinStack.png')}></NavigateTO>
                        }

                        {/* ozone change */}
                        {userData.user_type !== "dealer" && neededHistory.includes("scanned") &&  <NavigateTO visibleTitle={t("scanned history")} title={"Scanned History"} discription={t('list of products scanned by you')} image={require('../../../assets/images/scannedHistory.png')}></NavigateTO>}

                      {neededHistory.includes("redeemed") &&   <NavigateTO visibleTitle={t("redeemed history")} title="Redeemed History" discription={t("list of products redeemed by you")} image={require('../../../assets/images/redeemed_icon.png')}></NavigateTO>}
                        { neededHistory.includes("cashback") &&<NavigateTO visibleTitle={t("cashback history")} title="Cashback History" discription={t("list of cashback claimed by you")} image={require('../../../assets/images/cashbackBlack.png')}></NavigateTO>}
                        {
                            // couponOptionEnabled &&
                            neededHistory.includes("coupon") &&
                            <NavigateTO visibleTitle={t("coupon history")} title="Coupon History" discription={t("list of coupons redeemed by you")} image={require('../../../assets/images/scannedHistory.png')}></NavigateTO>
                        }
                        {/* {
                warrantyOptionEnabled &&  */}
                       { neededHistory.includes("warranty") && <NavigateTO visibleTitle = {t("warranty history")} title={"Warranty History"} discription={t("list of warranty claimed by you")} image={require('../../../assets/images/warranty_icon.png')}></NavigateTO>}
                        {/* } */}
                       
                        {
                            cashbackOptionEnabled && neededHistory.includes("cashback") &&
                            <NavigateTO visibleTitle={t("cashback history")} title="Cashback History" discription={t("list of cashback claimed by you")}  image={require('../../../assets/images/cashbackBlack.png')}></NavigateTO>
                        }

                        {
                            wheelOptionEnabled && neededHistory.includes("wheel") &&
                            <NavigateTO visibleTitle={t("wheel history")} title="Wheel History" discription="" image={require('../../../assets/images/scannedHistory.png')}></NavigateTO>

                        }
                        {
                            neededHistory.includes("shared") &&
                            pointSharing && <NavigateTO visibleTitle={t("shared point history")} title="Shared Point History" discription=" list of shared points recieved by you" image={require('../../../assets/images/shared_point.png')}></NavigateTO>
                        }
                        <NavigateTO visibleTitle={t("previous transaction history")} title="Previous Transaction History" discription=" Previous transaction done by you" image={require('../../../assets/images/coinStack.png')}></NavigateTO>

                    </View>
                }

                {/* GridVIew */}
                {
                    !listView &&

                    <View style={{ width: '90%', borderWidth: 1, borderColor: '#EEEEEE', borderRadius: 20, marginTop: 100, alignItems: 'center' }}>

                        <View style={{ width: '100%', height: 50, flexDirection: "row", alignItems: "center", justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEEEEE' }}>
                            {(getPointSharingData?.body?.total !== "0") ? <PoppinsTextMedium style={{ color: ternaryThemeColor, fontWeight: 'bold', position: 'absolute', left: 20 }} content={`Registration Bonus : ${getPointSharingData?.body?.data?.[0]?.points ? getPointSharingData?.body?.data?.[0]?.points + "Points" : "loading"} `}></PoppinsTextMedium >
                                : <PoppinsTextMedium style={{ fontWeight: 'bold', position: 'absolute', left: 20 }} content="What do you want to do?"></PoppinsTextMedium>
                            }
                            <View style={{ flexDirection: 'row', position: 'absolute', right: 20 }}>

                                <TouchableOpacity style={{ backgroundColor: listView ? ternaryThemeColor : 'white', marginRight: 10 }} onPress={() => {
                                    setListView(true)
                                }}>
                                    <Image style={{ height: 20, width: 20, resizeMode: 'contain', paddingHorizontal: 10 }} source={require('../../../assets/images/list.png')}></Image>

                                </TouchableOpacity>

                                <TouchableOpacity style={{ backgroundColor: ternaryThemeColor, borderWidth: 1, borderColor: ternaryThemeColor }}>
                                    <Image style={{ height: 20, width: 20, resizeMode: 'contain', }} source={listView ? require('../../../assets/images/grid.png') : require('../../../assets/images/gridwhite.png')}></Image>

                                </TouchableOpacity>



                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                            {
                                pointsOptionEnabled &&
                                <GridVIew title={t("points history")} discription=" list of points redeemed by you" image={require('../../../assets/images/coinStack.png')}></GridVIew>

                            }
                            {/* ozone change */}

                            {userData.user_type !== "dealer" && <GridVIew title={t("scanned history")} discription="" image={require('../../../assets/images/scannedHistory.png')}></GridVIew>}
                            <GridVIew title={t("redeemed history")}  discription=" list of products redeemed by you" image={require('../../../assets/images/redeemed_icon.png')}></GridVIew>
                            <GridVIew title={t("cashback history")} discription=" list of cashback redeemed by you" image={require('../../../assets/images/cashbackBlack.png')}></GridVIew>
                            {
                                couponOptionEnabled &&
                                <GridVIew title={t("Coupon History")} discription=" list of coupons redeemed by you" image={require('../../../assets/images/scannedHistory.png')}></GridVIew>
                            }
                            {/* {
                warrantyOptionEnabled &&  */}
                            <GridVIew title={t("warranty history")} discription=" list of warranty redeemed by you" image={require('../../../assets/images/warranty_icon.png')}></GridVIew>
                            {/* } */}
                           
                            {
                                cashbackOptionEnabled &&
                                <GridVIew title={t("cashback history")} discription=" list of cashback redeemed by you" image={require('../../../assets/images/scannedHistory.png')}></GridVIew>

                            }
                            {
                                // couponOptionEnabled &&
                                <GridVIew title={t("Coupon History")} discription=" list of coupons redeemed by you" image={require('../../../assets/images/scannedHistory.png')}></GridVIew>
                            }
                            {
                                wheelOptionEnabled &&
                                <GridVIew title="Wheel History" discription=" list of wheel spinned by you" image={require('../../../assets/images/scannedHistory.png')}></GridVIew>

                            }
                            {
                                pointSharing && <GridVIew title="Shared Point History" discription=" list of shared points recieved by you" image={require('../../../assets/images/shared_point.png')}></GridVIew>
                            }
                            <GridVIew title={t("Previous Transaction History")} discription=" list of previous transaction done by you" image={require('../../../assets/images/coinStack.png')}></GridVIew>

                        </View>
                    </View>
                }

                {/* ----------------------------------- */}
            </View>
            {/* modals */}
            {PlatinumModalOpen && <PlatinumModal isVisible={PlatinumModalOpen} onClose={closePlatinumModal} getActiveMembershipData={getActiveMembershipData} />}

        </ScrollView>

    );
}

const styles = StyleSheet.create({})

export default Passbook;