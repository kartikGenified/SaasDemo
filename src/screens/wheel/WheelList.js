//import liraries
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import WheelCard from '../../components/wheel/WheelCard';
import { useGetAllWheelHistoryMutation } from '../../apiServices/workflow/rewards/GetWheelApi';
import * as Keychain from 'react-native-keychain';
import { useSelector } from 'react-redux';



// create a component
const WheelList = ({ navigation }) => {

    const [getAllWheelHistoryFunc, {
        data: getAllWheelHistoryData,
        error: getAllWheelHistoryError,
        isLoading: getAllWheelHistoryIsLoading,
        isError: getAllWheelHistoryIsError
    }] = useGetAllWheelHistoryMutation()

    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';

    const dummyData = [
        {
            "id": 2,
            "app_user_id": 6,
            "app_user_name": "Harshita",
            "user_type": "retailer",
            "user_type_id": 2,
            "wc_id": 1,
            "w_id": 1,
            "qr_id": "26",
            "status": "1",
            "created_at": "2023-10-20T06:22:38.466Z",
            "created_by_id": 6,
            "created_by_name": "Harshita",
            "updated_at": "2023-10-20T06:22:38.466Z",
            "updated_by_id": 6,
            "updated_by_name": "Harshita"
        },
        {
            "id": 3,
            "app_user_id": 6,
            "app_user_name": "Harshita",
            "user_type": "retailer",
            "user_type_id": 2,
            "wc_id": 1,
            "w_id": 1,
            "qr_id": "80",
            "status": "1",
            "created_at": "2023-10-20T06:22:55.388Z",
            "created_by_id": 6,
            "created_by_name": "Harshita",
            "updated_at": "2023-10-20T06:22:55.388Z",
            "updated_by_id": 6,
            "updated_by_name": "Harshita"
        },
        {
            "id": 4,
            "app_user_id": 6,
            "app_user_name": "Harshita",
            "user_type": "retailer",
            "user_type_id": 2,
            "wc_id": 1,
            "w_id": 1,
            "qr_id": "79",
            "status": "1",
            "created_at": "2023-10-20T06:23:07.693Z",
            "created_by_id": 6,
            "created_by_name": "Harshita",
            "updated_at": "2023-10-20T06:23:07.693Z",
            "updated_by_id": 6,
            "updated_by_name": "Harshita"
        },
      
    ]


    useEffect(() => {
        getToken()
    }, [])

    const getToken = async () => {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
            console.log(
                'Credentials successfully loaded for user ' + credentials.username
            );
            const token = credentials.username
            const params = { token: token }
            getAllWheelHistoryFunc(params)

        }
    }


    useEffect(() => {
        if (getAllWheelHistoryData) {
            console.log("getAllWheelHistoryData", getAllWheelHistoryData)
        }
        else if (getAllWheelHistoryError) {
            console.log("getAllWheelHistoryError", getAllWheelHistoryError)
        }
    }, [getAllWheelHistoryData, getAllWheelHistoryError])

    return (
        <View style={[styles.container, {backgroundColor:ternaryThemeColor}]}>
   
            {/* Navigator */}
            <View
                style={{
                    height: 50,
                    width: '100%',
                    backgroundColor: 'transparent',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    flexDirection: 'row',
                    marginTop: 10,
                }}>
                <TouchableOpacity
                    style={{ height: 20, width: 20, position: 'absolute', left: 20, marginTop: 10 }}
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <Image
                        style={{ height: 20, width: 20, resizeMode: 'contain' }}
                        source={require('../../../assets/images/blackBack.png')}></Image>
                </TouchableOpacity>

                <PoppinsTextMedium style={{ fontSize: 20, color: '#ffffff', marginTop: 5, position: 'absolute', left: 60 }} content={"Wheel"}></PoppinsTextMedium>
                <PoppinsTextMedium style={{ fontSize: 20, color: '#ffffff', marginTop: 5, position: 'absolute', left: 60 }} content={"FeedBack"}></PoppinsTextMedium>


            </View>
            {/* navigator */}

            {/* content */}
            <View style={styles.viewContent}>
                
                    <FlatList
                        data={dummyData}
                        contentContainerStyle={{width:'100%',marginTop:20,}}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        renderItem={({ item }) => (
                            <WheelCard/>
                        )}

                    ></FlatList>
                    
            </View>


        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
     
    },
    viewContent: {
        backgroundColor: "#ffffff",
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        height:'100%'
    }
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: '#2c3e50',
    // },
});

//make this component available to the app
export default WheelList;
