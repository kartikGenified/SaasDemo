import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, ImageBackground, Linking,Alert } from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import { useGetWarrantyByAppUserIdMutation } from '../../apiServices/workflow/warranty/ActivateWarrantyApi';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import FilterModal from '../../components/modals/FilterModal';
import DataNotFound from '../data not found/DataNotFound';
import InputDate from '../../components/atoms/input/InputDate';
import { useTranslation } from 'react-i18next';


const WarrantyHistory = ({ navigation }) => {
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';
    const [
        getWarrantyListFunc, {
            data: getWarrantylistData,
            error: getWarrantylistError,
            isLoading: getWarrantylistIsLoading,
            isError: getWarrantylistIsError
        }
    ] = useGetWarrantyByAppUserIdMutation()

    const {t} = useTranslation();

    const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loader.gif')).uri;
    const noData = Image.resolveAssetSource(require('../../../assets/gif/noData.gif')).uri;
    let startDate,endDate



    useEffect(() => {
        const getData = async () => {
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
                console.log(
                    'Credentials successfully loaded for user ' + credentials.username
                );
                const token = credentials.username
                getWarrantyListFunc({ token: token })
            }
        }
        getData()
    }, [])

    useEffect(() => {
        if (getWarrantylistData) {
            console.log("getWarrantylistData", JSON.stringify(getWarrantylistData))

        }
        else if (getWarrantylistError) {
            console.log("getWarrantylistError", getWarrantylistError)
        }
    }, [getWarrantylistData, getWarrantylistError])
    const fetchDataAccToFilter=()=>{
    
        console.log("fetchDataAccToFilter",startDate,endDate)
        if(startDate && endDate)
        {
          if(new Date(endDate).getTime() < new Date(startDate).getTime())
          {
            alert(t("Kindly enter proper end date"))
            startDate=undefined
            endDate=undefined
          }
          else {
            console.log("fetchDataAccToFilter")
          }
          
        }
        else{
          alert(t("Kindly enter a valid date"))
          startDate=undefined
          endDate=undefined
        }
      }
    const Header = () => {
        const [openBottomModal, setOpenBottomModal] = useState(false)
        const [message, setMessage] = useState()
        const modalClose = () => {
            setOpenBottomModal(false);
        };

        const onFilter = (data, type) => {
            console.log("submitted", data, type)

            if (type === "start") {
                startDate = data
            }
            if (type === "end") {
                endDate = data
            }
        }

        const ModalContent = (props) => {
            const [startDate, setStartDate] = useState("")
            const [endDate, setEndDate] = useState("")





            const handleStartDate = (startdate) => {
                // console.log("start date", startdate)
                setStartDate(startdate?.value)
                props.handleFilter(startdate?.value, "start")
            }

            const handleEndDate = (enddate) => {
                // console.log("end date", enddate?.value)
                setEndDate(enddate?.value)
                props.handleFilter(enddate?.value, "end")
            }
            return (
                <View style={{ height: 320, backgroundColor: 'white', width: '100%', borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>

                    {/* {openBottomModal && <FilterModal
                        modalClose={modalClose}
                        message={message}
                        openModal={openBottomModal}
                        handleFilter={onFilter}
                        comp={ModalContent}></FilterModal>} */}

                    <PoppinsTextMedium content="Date Filter" style={{ color: 'black', marginTop: 20, fontWeight: 'bold',alignSelf:"center" }}></PoppinsTextMedium>
                    <TouchableOpacity onPress={()=>{setOpenBottomModal(false)}} style={{height:40,width:40,alignItems:'center',justifyContent:'center',position:'absolute',top:10,right:10}}>
            <Image style={{height:30,width:30,resizeMode:'contain'}} source={require('../../../assets/images/cancel.png')}></Image>
          </TouchableOpacity>
                    <View>
                        <InputDate data={t("Start Date")} handleData={handleStartDate} />

                    </View>
                    <View>
                        <InputDate data={t("End Date")} handleData={handleEndDate} />
                    </View>
                    <TouchableOpacity onPress={() => { fetchDataAccToFilter() }} style={{ backgroundColor: ternaryThemeColor, marginHorizontal: 50, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 10, borderRadius: 10 }}>
                        <PoppinsTextMedium content={t("SUBMIT")} style={{ color: 'white', fontSize: 20, borderRadius: 10, }}></PoppinsTextMedium>
                    </TouchableOpacity>

                </View>
            )
        }

        return (
            <View style={{ height: 40, width: '100%', backgroundColor: '#DDDDDD', alignItems: "center", flexDirection: "row", marginTop: 20 }}>

                <PoppinsTextMedium style={{ marginLeft: 20, fontSize: 16, position: "absolute", left: 10, color:'black' }} content="Date Filter"></PoppinsTextMedium>

                <TouchableOpacity onPress={() => { setOpenBottomModal(!openBottomModal), setMessage("BOTTOM MODAL") }} style={{ position: "absolute", right: 20 }}>
                    <Image style={{ height: 22, width: 22, resizeMode: "contain" }} source={require('../../../assets/images/settings.png')}></Image>
                </TouchableOpacity>

                {openBottomModal && <FilterModal
                    modalClose={modalClose}
                    message={message}
                    openModal={openBottomModal}
                    handleFilter={onFilter}
                    comp={ModalContent}></FilterModal>}

            </View>
        )
    }


    const DisplayEarnings = () => {
        
        var activated = 0
        var pending = 0
        if (getWarrantylistData) {
            getWarrantylistData && getWarrantylistData.body.map((item, index) => {
                if (item.status === "1" || item.status==="3") {
                    activated++
                }
                if(item.status==="2")
                {
                    pending++
                }
            })
            
        }

        return (
            <View style={{ alignItems: "center", justifyContent: "center", width: '100%', marginTop: 20 }}>
                <View style={{ alignItems: "center", justifyContent: "center", position: "absolute", left: 40, top: 0 }}>

                    <PoppinsText style={{ color: "black", fontSize: 16 }} content={t("Warranty")}></PoppinsText>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20 }}>

                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        {getWarrantylistData && <PoppinsText style={{ color: "black" }} content={activated}></PoppinsText>}
                        <PoppinsTextMedium style={{ color: "black", fontSize: 14 }} content={t("Activated")}></PoppinsTextMedium>
                    </View>
                    <View style={{ alignItems: "center", justifyContent: "center", marginLeft: 40 }}>
                        {getWarrantylistData && <PoppinsText style={{ color: "black" }} content={pending}></PoppinsText>}
                        <PoppinsTextMedium style={{ color: "black", fontSize: 14 }} content={t("Pending")}></PoppinsTextMedium>
                    </View>
                    <Image style={{ height: 80, width: 80, resizeMode: "contain", marginLeft: 40 }} source={require('../../../assets/images/boxReward.png')}></Image>
                </View>
            </View>
        )
    }

    const WarrantyList = (props) => {
        const warrantyTillDate = props.date == (null || undefined) ? "Date can't be fetched" : props.date
        const productName = props.productName
        const warrantyStatus = props.warrantyStatus
        const item = props.data
        console.log("WarrantyList",item)
        const image = item?.product_images!=(null||undefined) ? item?.product_images[0] : undefined
        return (
            <View style={{ width: "90%", height: 150, borderRadius: 20, backgroundColor: '#F2F2F2', elevation: 6, margin: 20 }}>
                <ImageBackground resizeMode='contain' style={{ position: "absolute", height: 100, width: 100, right: 10, top: -20, alignItems: "center", justifyContent: "center" }} source={require('../../../assets/images/blueEnvelope.png')}>
                    <PoppinsTextMedium style={{ fontSize: 11, color: 'white' }} content={t("Warranty Till")}></PoppinsTextMedium>
                    <PoppinsTextMedium style={{ fontSize: 12, color: 'white' }} content={moment(warrantyTillDate).format("DD MMM YYYY")}></PoppinsTextMedium>
                </ImageBackground>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: '60%',backgroundColor:'#F2F2F2' }}>
                    {image ? <Image style={{ height: 60, width: 60, resizeMode: 'contain' }} source={{uri:image}}></Image> : <Image style={{ height: 60, width: 60, resizeMode: 'contain' }} source={require('../../../assets/images/box.png')}></Image>  }
                    <View style={{ alignItems: 'flex-start', justifyContent: "center", marginLeft: 8,width:'80%' }}>
                        <PoppinsTextMedium style={{ color: 'black' }} content={`${t("Product Name")} : `}></PoppinsTextMedium>
                        <PoppinsTextMedium style={{ color: 'black', fontWeight: '700', marginTop: 2 }} content={productName}></PoppinsTextMedium>
                        <PoppinsTextMedium style={{ color: 'black', marginTop: 4 }} content={t("Warranty Status")}></PoppinsTextMedium>
                        <PoppinsTextMedium style={{ color: 'black', marginTop: 2, fontWeight: '700' }} content={warrantyStatus}></PoppinsTextMedium>


                    </View>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", position: "absolute", bottom: 10, left: 20 }}>
                    <TouchableOpacity onPress={()=>{
                        if(item.warranty_pdf!==undefined && item.warranty_pdf!==null && item.warranty_pdf!=="" )
                        {
                        Linking.openURL(item.warranty_pdf)
                        }
                        else{
                            Alert.alert(t("Sorry for the inconvenience"),t("Warranty PDF is not available yet kindly contact the support team"))
                        }
                    }} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <Image style={{ height: 20, width: 20, resizeMode: "contain" }} source={require('../../../assets/images/greenDownload.png')}></Image>
                        <PoppinsTextMedium style={{ color: '#353535', fontWeight: "700", marginLeft: 4 }} content={t("Download Warranty")}></PoppinsTextMedium>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('WarrantyDetails', { data: props.data })
                    }} style={{ backgroundColor: '#3B6CE9', height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", padding: 10, flexDirection: 'row', marginLeft: 30 }}>
                        <Image style={{ height: 20, width: 20, resizeMode: "contain" }} source={require('../../../assets/images/eye.png')}></Image>
                        <PoppinsTextMedium style={{ marginLeft: 4, color: "white", fontWeight: "700", fontSize: 12 }} content={t("View Details")}></PoppinsTextMedium>
                        <View style={{ height: 30, width: 30, borderRadius: 15, backgroundColor: "white", alignItems: "center", justifyContent: "center", marginLeft: 4 }}>
                            <Image style={{ height: 20, width: 20, resizeMode: "contain", transform: [{ rotate: '180deg' }] }} source={require('../../../assets/images/blackBack.png')}></Image>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={{ alignItems: "center", justifyContent: "flex-start", backgroundColor: "white" }}>
            <View style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row", width: '100%', marginTop: 10, height: 40, marginLeft: 20 }}>
                <TouchableOpacity onPress={() => {
                    navigation.goBack()
                }}>
                    <Image style={{ height: 24, width: 24, resizeMode: 'contain', marginLeft: 10 }} source={require('../../../assets/images/blackBack.png')}></Image>

                </TouchableOpacity>
                <PoppinsTextMedium content={t("Warranty List")} style={{ marginLeft: 10, fontSize: 16, fontWeight: '600', color: '#171717' }}></PoppinsTextMedium>
                {/* <TouchableOpacity style={{ marginLeft: 160 }}>
                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../assets/images/notificationOn.png')}></Image>
                </TouchableOpacity> */}
            </View>
            <DisplayEarnings></DisplayEarnings>
            {/* <Header></Header> */}

            {
                !getWarrantylistData  && <FastImage
                    style={{ width: 100, height: 100, alignSelf: 'center', marginTop: '50%' }}
                    source={{
                        uri: gifUri, // Update the path to your GIF
                        priority: FastImage.priority.normal,
                    }}
                    resizeMode={FastImage.resizeMode.contain}
                />
            }


            {
                getWarrantylistData && getWarrantylistData.length == 0 &&
                <View>

                    <FastImage
                        style={{ width: 100, height: 100, alignSelf: 'center', marginTop: '50%' }}
                        source={{
                            uri: noData, // Update the path to your GIF
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />

                    <PoppinsTextMedium style={{ color: '#808080', fontWeight: 'bold', marginTop:-10}} content={t("NO DATA")}></PoppinsTextMedium>




                </View>


            }

            {getWarrantylistData && getWarrantylistData?.body?.length > 0 ? <FlatList
                data={getWarrantylistData.body}
                style={{ width: '100%' }}
                contentContainerStyle={{ width: '100%', paddingBottom: 300 }}
                renderItem={({ item, index }) => {
                    console.log(index + 1, item)
                    return (
                        <WarrantyList data={item} date={item.end_date} warrantyTillDate={item.end_date} productName={item.product_name} warrantyStatus={item.status === "1" ? t("Activated") : item.status === "2" ? "Not Activated" : "Claimed"} ></WarrantyList>

                    )
                }}
                keyExtractor={item => item.id}
            />

            :
            <View style={{marginBottom:'100%'}}>
          <DataNotFound/>

            </View>
        }



      





        </View>
    );
}

const styles = StyleSheet.create({})

export default WarrantyHistory;