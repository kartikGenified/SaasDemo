import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, FlatList, ImageBackground, TextInput, Button, ScrollView, Platform, Linking,Alert} from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import * as Keychain from 'react-native-keychain';
import { useGetWarrantyByAppUserIdMutation } from '../../apiServices/workflow/warranty/ActivateWarrantyApi';
import moment from 'moment';
import ButtonNavigate from '../../components/atoms/buttons/ButtonNavigate';
import { Text } from 'react-native-svg';
import BottomModal from '../../components/modals/BottomModal';
import RectangularUnderlinedDropDown from '../../components/atoms/dropdown/RectangularUnderlinedDropDown';
import { useClaimWarrantyMutation } from '../../apiServices/workflow/warranty/ClaimWarrantyApi';
import FeedbackTextArea from '../../components/feedback/FeedbackTextArea';
import ImageInput from '../../components/atoms/input/ImageInput';
import ImageInputWithUpload from '../../components/atoms/input/ImageInputWithUpload';
import ButtonRectangle from '../../components/atoms/buttons/ButtonRectangle';
import { useUploadSingleFileMutation } from '../../apiServices/imageApi/imageApi';
import Icon from 'react-native-vector-icons/Feather';
import Close from 'react-native-vector-icons/Ionicons';
import ErrorModal from '../../components/modals/ErrorModal';
import ModalWithBorder from '../../components/modals/ModalWithBorder';
import { useTranslation } from 'react-i18next';


const WarrantyDetails = ({ navigation, route }) => {

    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    // const [claimText, setClaimText] = useState("");
    const [modal, setModal] = useState(false);
    const [token, setToken] = useState(null);
    const [claimModal, setClaimModal] = useState(false);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {t} = useTranslation()
    let claimText = "";

    const warrantyStart = route.params.data.created_at
    const warrantyEnd = route.params.data.end_date
    const warrantyId = route.params.data.id
    const data = route.params.data
    console.log("data form warranty details page", data)

    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';

    const secondaryThemeColor = useSelector(
        state => state.apptheme.secondaryThemeColor,
    )
        ? useSelector(state => state.apptheme.secondaryThemeColor)
        : '#FFB533';

    const [
        uploadImageFunc,
        {
            data: uploadImageData,
            error: uploadImageError,
            isLoading: uploadImageIsLoading,
            isError: uploadImageIsError,
        },
    ] = useUploadSingleFileMutation();

    const [
        createWarrantyClaim,
        { data: warrantyClaimData, error: warantyClaimError },
    ] = useClaimWarrantyMutation();


    useEffect(() => {

        const getDashboardData = async () => {
            try {
                // Retrieve the credentials
                const credentials = await Keychain.getGenericPassword();
                if (credentials) {
                    console.log(
                        'Credentials successfully loaded for user ' + credentials.username
                    );
                    const token = credentials.username

                    setToken(token)
                    console.log(token)

                } else {
                    console.log('No credentials stored');
                }
            } catch (error) {
                console.log("Keychain couldn't be accessed!", error);
            }
        }
        getDashboardData()

    }, [])

    useEffect(() => {
        if (uploadImageData) {
            console.log("upload image data", uploadImageData)
            if (uploadImageData.success) {

                const tempData = {
                    warranty_id: String(data.id),
                    description: "claimText",
                    images: [uploadImageData.body?.[0]?.filename],
                    platform_id: Platform.OS == "Android" ? 2 : 3,
                    platform: Platform.OS,
                };
                console.log(" claim warranty data", tempData)
                createWarrantyClaim({ body: tempData, token: token })


            }
        }
        else if (uploadImageError) {
            console.log("uploadImageError", uploadImageError)
        }
    }, [uploadImageData, uploadImageError])

    useEffect(() => {
        if (warrantyClaimData) {

            if (warrantyClaimData.success) {

                console.log("warrantyClaimData succsess", warrantyClaimData);
                navigation.navigate("WarrantyClaimDetails", { warrantyItemData: data, afterClaimData: warrantyClaimData })


                setClaimModal(true)
                setMessage(warrantyClaimData.message)


            }
        }
        else if (warantyClaimError) {
            console.log("warantyClaimError", warantyClaimError)
            setError(true)
            setMessage(warantyClaimError?.data.message)
        }

    }, [, warrantyClaimData, warantyClaimError])




    console.log("data of item", data)


    const CommentTextArea = ({ placeholder, style }) => {
        const [text, setText] = useState("");

        useEffect(() => {
            claimText = text
        }, [text])

        return (
            <View style={[styles.container, style]} behavior="padding" enabled>
                <TextInput
                    multiline
                    placeholder={placeholder}
                    placeholderTextColor="#808080"
                    style={styles.textInput}
                    onChangeText={(text) => { setText(text) }}
                    value={text}
                />
            </View>
        );
    };

    const modalClose = () => {
        setModal(false)
    }

    const modalCloseSuccess = () => {
        setClaimModal(false)

    }








    const ClickToReport = () => {
        return (
            <View style={{ alignItems: "center", justifyContent: 'center', width: "100%", position: "absolute", bottom: 10 }}>
                <PoppinsTextMedium style={{ color: 'black', fontSize: 16, fontWeight: '700' }} content="Issue with this ?"></PoppinsTextMedium>
                <TouchableOpacity onPress={() => { navigation.navigate("ReportAndIssue", { data: data }) }} style={{ height: 50, width: 180, backgroundColor: "#D10000", alignItems: "center", justifyContent: "center", borderRadius: 4, marginTop: 6 }}>
                    <PoppinsTextMedium style={{ color: 'white', fontSize: 16 }} content="Click here to report"></PoppinsTextMedium>
                </TouchableOpacity>
            </View>
        )
    }
    const ScannedDetailsProductBox = (props) => {
        const productName = data.product_name
        // const productSerialNumber = props.product_code
        const productCode = data.product_code
        return (
            <View style={{ height: 200, width: '100%', backgroundColor: '#F7F7F7', alignItems: "center", justifyContent: 'center', padding: 16, marginTop: 90 }}>
                <View style={{ height: 154, width: 154, borderRadius: 10, borderWidth: 1, backgroundColor: 'white', position: "absolute", top: -74, borderColor: '#DDDDDD', alignItems: "center", justifyContent: "center" }}>
                 {data.product_images?.[0] ?   <Image style={{ height: 100, width: 100,resizeMode:'contain' }} source={{ uri: data.product_images?.[0] }}></Image> : <PoppinsTextMedium style={{color:'black', fontWeight:'800'}} content="NO IMAGE"></PoppinsTextMedium>} 
                </View>
                <View style={{ alignItems: "flex-start", justifyContent: "center", position: "absolute", bottom: 10, left: 20, color: 'black' }}>
                    <PoppinsTextMedium style={{ margin: 4, fontSize: 18, fontWeight: '700', color: 'black' }} content={`${t("Product Name")} : ${productName}`}></PoppinsTextMedium>
                    <PoppinsTextMedium style={{ margin: 4, fontSize: 18, fontWeight: '700', color: 'black' }} content={`${t("Product Code")} : ${productCode}`}></PoppinsTextMedium>
                    {/* <PoppinsTextMedium style={{margin:4,fontSize:18,fontWeight:'700'}} content={`Product S.No : ${productSerialNumber}`}></PoppinsTextMedium> */}
                </View>


            </View>
        )
    }

    const ModalSuccess = () => {

        return (
            <View style={{ width: '100%', alignItems: "center", justifyContent: "center" }}>
                <View style={{ marginTop: 30, alignItems: 'center', maxWidth: '80%' }}>
                    <Icon name="check-circle" size={53} color={ternaryThemeColor} />
                    <PoppinsTextMedium style={{ fontSize: 27, fontWeight: '600', color: ternaryThemeColor, marginLeft: 5, marginTop: 5 }} content={`${t("Success")} ! !`}></PoppinsTextMedium>

                    <View style={{ marginTop: 10, marginBottom: 30 }}>
                        <PoppinsTextMedium style={{ fontSize: 16, fontWeight: '600', color: "#000000", marginLeft: 5, marginTop: 5, }} content={message}></PoppinsTextMedium>
                    </View>

                    {/* <View style={{ alignItems: 'center', marginBottom: 30 }}>
                    <ButtonOval handleOperation={modalWithBorderClose} backgroundColor="#000000" content="OK" style={{ color: 'white', paddingVertical: 4 }} />
                  </View> */}

                </View>

                <TouchableOpacity style={[{
                    backgroundColor: ternaryThemeColor, padding: 6, borderRadius: 5, position: 'absolute', top: -10, right: -10,
                }]} onPress={() => setClaimModal(false)} >
                    <Close name="close" size={17} color="#ffffff" />
                </TouchableOpacity>

            </View>
        )


    }

    const ModalContent = () => {
        console.log("the data item", data)
        const [imageData, setImageData] = useState(null);


        const handleChildComponentData = data => {
            console.log("from image input", data);
            setImageData(data)
            // Update the responseArray state with the new data

        };

        const onSubmit = () => {

            if (imageData?.uri && claimText != "") {
                console.log("image uri", imageData?.uri)
                setIsLoading(true);
                const imageDataTemp = {
                    uri: imageData.uri,
                    name: imageData.uri.slice(0, 10),
                    type: 'image/png',
                };
                const uploadFile = new FormData();
                uploadFile.append('image', imageDataTemp);

                
                setModal(!modal);
                const getToken = async () => {
                    const credentials = await Keychain.getGenericPassword();
                    const token = credentials.username;
        
                    uploadImageFunc({ body: uploadFile,token:token });
                }
        
                getToken()

            }
            else {
                setError(true);
                setMessage(t("Please fill all fields"));
            }



            // navigation.navigate("WarrantyClaimDetails")
        }
        return (
            <ScrollView style={{ height: 560, width: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                {/* <TouchableOpacity style={[styles.closeButton,]} onPress={()=>{setModal(!modal)}}>
                    <Icon name="close" size={27} color="#ffffff" />
                </TouchableOpacity> */}
                {/* <View>
                    <View style={{ alignSelf: 'center', borderWidth: 1, marginTop: 20, width: 100 }}>

                    </View>
                </View> */}



                <View style={{ marginHorizontal: 20, marginTop: 30, borderRadius: 10, alignItems: 'flex-start', padding: 10, }}>
                    <View style={{ backgroundColor: '#EBF3FA', width: '100%', padding: 20, borderWidth: 1, borderColor: '#85BFF1', borderRadius: 10, borderStyle: 'dotted' }}>
                        <View style={{ flexDirection: 'row', marginLeft: 10, }}>
                            <PoppinsTextMedium content={`${t("Product Name")} :`} style={{ color: 'black' }}></PoppinsTextMedium>
                            <PoppinsTextMedium content={`${data?.product_name}`} style={{ color: 'black' }}></PoppinsTextMedium>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10 }}>
                            <PoppinsTextMedium content={`${t("Product Code")} :`} style={{ color: 'black', fontWeight: '600' }}></PoppinsTextMedium>
                            <PoppinsTextMedium content={`${data?.product_code}`} style={{ color: 'black', fontWeight: '600' }}></PoppinsTextMedium>
                        </View>
                    </View>





                    <View style={{ backgroundColor: '#EBF3FA', marginTop: 30, width: '100%', }}>
                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                            {imageData && <Image style={{ height: 150, width: 200, resizeMode: "contain", margin: 20 }} source={{ uri: imageData.uri }}></Image>}
                            <ImageInputWithUpload
                                // jsonData={item}
                                handleData={handleChildComponentData}
                                // key={index}
                                data={"image"}
                                action="Select File"></ImageInputWithUpload>
                        </View>
                    </View>

                    <View style={{ marginTop: 20, width: '100%', }}>
                        <CommentTextArea style={{ borderColor: '#808080', borderBottomWidth: 0.3, }} placeholder={t("Write The Product Claim")} />
                    </View>


                </View>

                <View style={{ marginHorizontal: 50, height: 70, marginTop: 20 }}>
                    <ButtonRectangle backgroundColor="#FB774F" content={t("Submit")} style={{ fontSize: 18, }} handleOperation={onSubmit} />
                </View>

            </ScrollView>
        )
    }
    return (
        <View style={{ alignItems: "center", justifyContent: "flex-start", backgroundColor: "white", height: '100%' }}>

            <View style={{ alignItems: "center", justifyContent: "flex-start", flexDirection: "row", width: '100%', marginTop: 10, height: 40, marginLeft: 20 }}>
                <TouchableOpacity onPress={() => {
                    navigation.goBack()
                }}>
                    <Image style={{ height: 24, width: 24, resizeMode: 'contain', marginLeft: 10 }} source={require('../../../assets/images/blackBack.png')}></Image>

                </TouchableOpacity>
                <PoppinsTextMedium content={t("Warranty Details")} style={{ marginLeft: 10, fontSize: 16, fontWeight: '600', color: '#171717' }}></PoppinsTextMedium>
                {/* <TouchableOpacity style={{ marginLeft: 160 }}>      
                    <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../assets/images/notificationOn.png')}></Image>
                </TouchableOpacity> */}
            </View>
            <ScannedDetailsProductBox></ScannedDetailsProductBox>


            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <PoppinsTextMedium style={{ color: 'black', fontSize: 18 }} content={`${t("Warranty Start")} : ${moment(warrantyStart).format('DD MMM YYYY')}`}></PoppinsTextMedium>
                <PoppinsTextMedium style={{ color: 'black', fontSize: 18, marginTop: 4 }} content={`${t("Warranty End")} : ${moment(warrantyEnd).format('DD MMM YYYY')}`}></PoppinsTextMedium>
                <View style={{ padding:8, width: 240, alignItems: "center", justifyContent: "center", borderWidth: 1, borderStyle: 'dashed', backgroundColor: ternaryThemeColor, borderRadius: 4, marginTop: 50 }}>
                    <PoppinsTextMedium style={{ color: 'white', fontSize: 18, marginTop: 4 }} content={`${t("Warranty Id")} : ${warrantyId}`}></PoppinsTextMedium>
                </View>
            </View>
            <TouchableOpacity onPress={()=>{  
            if(data.warranty_pdf!==undefined && data.warranty_pdf!==null && data.warranty_pdf!=="" )
                        {
                        Linking.openURL(data.warranty_pdf)
                        }
                        else{
                            Alert.alert(t("Sorry for the inconvenience"),t("Warranty PDF is not available yet kindly contact the support team"))
                        }
                        }} style={{ padding:8, width: 240, alignItems: "center", justifyContent: "center", backgroundColor: "#91B406", marginTop: 20, borderRadius: 4 }}>
                <PoppinsTextMedium style={{ color: 'white', fontSize: 18, marginTop: 4 }} content={t("Download Warranty")}></PoppinsTextMedium>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setModal(true) }} style={{ padding:8, width: 240, alignItems: "center", justifyContent: "center", backgroundColor: "#353535", marginTop: 20, borderRadius: 4 }}>
                <PoppinsTextMedium style={{ color: 'white', fontSize: 18, marginTop: 4 }} content={t("Claim Warranty/View Claim")}></PoppinsTextMedium>
            </TouchableOpacity>
            {/* <ClickToReport></ClickToReport> */}

            {modal &&
                <BottomModal
                    modalClose={modalClose}
                    // message={message}
                    canGoBack={true}
                    openModal={modal}
                    comp={ModalContent} ></BottomModal>}

            <ModalWithBorder
                modalClose={modalCloseSuccess}
                message={message}
                openModal={claimModal}
                navigateTo="WarrantyClaimDetails"
                parameters={{ warrantyItemData: data, afterClaimData: warrantyClaimData }}
                comp={ModalSuccess}></ModalWithBorder>


            {error && (
                <ErrorModal
                    modalClose={() => setError(false)}
                    message={message}
                    openModal={error}
                ></ErrorModal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    textInput: {
        height: 100,
        fontSize: 16,
        // alignSelf: 'flex-start',
        // textAlignVertical: 'center',
        paddingBottom: 20,
        color: '#000000'
    },
    closeButton: {
        padding: 10,
        backgroundColor: 'red',
        borderRadius: 30,
        position: 'absolute',
        top: -20,
        right: -10,
    },

    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
})

export default WarrantyDetails;