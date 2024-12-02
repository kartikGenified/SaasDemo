import React,{useEffect,useState} from 'react';
import {View, StyleSheet,TouchableOpacity,Image,FlatList} from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { usePreviousTransactionsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import { useSelector } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import moment from 'moment';
import DataNotFound from '../data not found/DataNotFound';
import { dispatchCommand } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

const PreviousTransactionHistory = ({navigation}) => {
    const [displayList, setDisplayList] = useState()
  const userData = useSelector(state => state.appusersdata.userData)

    const [pervioustransactionFunc,{
        data:pervioustransactionData,
        error:pervioustransactionError,
        isLoading:pervioustransactionIsLoading,
        isError:pervioustransactionIsError
    }]= usePreviousTransactionsMutation()

    useEffect(()=>{
        getTransaction()
    },[])

    const {t} = useTranslation();

    useEffect(()=>{
        if(pervioustransactionData)
        {
            setDisplayList(pervioustransactionData.body)
            console.log("pervioustransactionData",pervioustransactionData)
        }
        else if(pervioustransactionError)
        {
            console.log("pervioustransactionError",pervioustransactionError)
        }
    },[pervioustransactionData,pervioustransactionError])

    const getTransaction =async()=>{
        const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    console.log(
      'Credentials successfully loaded for user ' + credentials.username
    );
    const token = credentials.username
    const mobile = userData.mobile
    const data = {mobile:mobile}
    const body ={token:token,data:data}
    pervioustransactionFunc(body)

    }

}

    const ListItem = (props) => {
        const description = props.description;
        const productCode = props.productCode;
        const time = props.time;
        const amount = props.amount;
        const data = props.data;
        const visibleCode = props.visibleCode
    
        // const image = data.images !== null ? data.images[0] : null;
        return (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
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
                justifyContent: "center",
                borderRadius: 10,
                borderColor: "#DDDDDD",
              }}
            >
              
                <Image
                  style={{ height: 60, width: 60, resizeMode: "contain" }}
                  source={require('../../../assets/images/logoOzone.png')}
                ></Image>
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
                content={`Product Code : ${productCode}`}
              ></PoppinsTextMedium>
              <PoppinsTextMedium
                style={{ fontWeight: "400", fontSize: 12, color: "black" }}
                content={`Visible Code : ${visibleCode}`}
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
                  source={require("..s/../../assets/images/Date.png")}
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
    return (
        <View style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
            <View
            style={{
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "row",
              width: "100%",
              marginTop: 10,
              height: 40,
              marginLeft: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Image
                style={{
                  height: 24,
                  width: 24,
                  resizeMode: "contain",
                  marginLeft: 10,
                }}
                source={require("../../../assets/images/blackBack.png")}
              ></Image>
            </TouchableOpacity>
            <PoppinsTextMedium
              content={t("Previous Transaction History")}
              style={{
                marginLeft: 10,
                fontSize: 16,
                fontWeight: "800",
                color: "#171717",
              }}
            ></PoppinsTextMedium>
            <TouchableOpacity style={{ marginLeft: 160 }}>
              {/* <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../assets/images/notificationOn.png')}></Image> */}
            </TouchableOpacity>
          </View>
          <FlatList
            style={{width:'100%',height:'100%'}}
                data={displayList}
                maxToRenderPerBatch={10}
                initialNumToRender={10}
                contentContainerStyle={{backgroundColor:"white",paddingBottom:200}}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                    // console.log(index + 1, item)
                    return (
                        <ListItem  visibleCode = {item["QR Code Visible No"]} type = {item?.cause?.type} image={item?.images ===undefined ? undefined : item?.images[0]} description={item?.product_name} productCode={item["SKU Code"]} amount={item["Total Points Rewarded (100%)"]} status={item?.status} points={item?.points} is_reverted= {item?.is_reverted} date = {item["Transaction Date"]} time={item["Transaction Date"]}/>
                    )
                }}
                keyExtractor={(item,index) => index}
            />
            {
                displayList==undefined &&
                <View style={{position:'absolute',width:'100%',height:'70%'}}>
                 <DataNotFound></DataNotFound>

                </View>
            }
            {
                displayList && displayList.length===0 && 
                <View style={{width:'100%', position:'absolute',height:'70%'}}>
                <DataNotFound></DataNotFound>

               </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({})

export default PreviousTransactionHistory;
