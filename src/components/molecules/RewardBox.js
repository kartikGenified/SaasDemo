import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import RewardSquare from '../atoms/RewardSquare';
import { useSelector } from 'react-redux';
import { useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import * as Keychain from 'react-native-keychain';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';

const RewardBox = () => {
    const workflow = useSelector(state => state.appWorkflow.program)
    const id = useSelector(state => state.appusersdata.id);

    const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loader2.gif')).uri;
    const {t} = useTranslation();


    const [userPointFunc, {
        data: userPointData,
        error: userPointError,
        isLoading: userPointIsLoading,
        isError: userPointIsError
    }] = useFetchUserPointsMutation();

    useEffect(() => {
        fetchPoints()
    }, []);

    const fetchPoints = async () => {
        const credentials = await Keychain.getGenericPassword();
        const token = credentials.username;
        const params = {
            userId: id,
            token: token
        }
        userPointFunc(params)
    }

    useEffect(() => {
        if (userPointData) {
            console.log("userPointData", userPointData)
        }
        else if (userPointError) {
            console.log("userPointError", userPointError)
        }

    }, [userPointData, userPointError])


    console.log(workflow)
    return (
        <View style={{ padding: 4, width: '100%', borderRadius: 14, elevation: 4, backgroundColor: 'white', height: 170 }}>


            {userPointIsLoading &&
                <FastImage
                    style={{ width: 100, height: 100, alignSelf: 'center', marginTop: 20 }}
                    source={{
                        uri: gifUri, // Update the path to your GIF
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            }

            <ScrollView contentContainerStyle={{ }} style={{width:'100%'   }} showsHorizontalScrollIndicator={false} horizontal={true}>
                {
                    workflow.includes("Static Coupon") && <RewardSquare color="#FFE2E6" image={require('../../../assets/images/voucher.png')} title="My Coupons"></RewardSquare>
                }
                {
                    workflow.includes("Cashback") && <RewardSquare color="#FFF4DE" image={require('../../../assets/images/cashback.png')} title="Cashback"></RewardSquare>
                }

                {
                    workflow.includes("Wheel") && <RewardSquare color="#FFE2E6" image={require('../../../assets/images/cashback.png')} title="Spin Wheel"></RewardSquare>

                }

                {
                    workflow.includes("Points On Product") && userPointData && <RewardSquare amount={userPointData.body.point_earned} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("earned points")}></RewardSquare>
                }
                {
                    workflow.includes("Points On Product") && userPointData && <RewardSquare amount={userPointData.body.point_redeemed} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("redeemed points")}></RewardSquare>
                }
                {
                    workflow.includes("Points On Product") && userPointData && <RewardSquare amount={userPointData.body.point_balance} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("balance points")}></RewardSquare>
                }
                {
                    workflow.includes("Points On Product") && userPointData && <RewardSquare amount={userPointData.body.point_reserved} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("reserved points")}></RewardSquare>
                }
                {
                    workflow.includes("Points On Product") && userPointData && <RewardSquare amount={((Number(userPointData.body.point_reserved) + Number(userPointData.body.point_balance)).toFixed(2))} color="#DCFCE7" image={require('../../../assets/images/points.png')} title={t("Total Points")}></RewardSquare>
                }
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({})

export default RewardBox;