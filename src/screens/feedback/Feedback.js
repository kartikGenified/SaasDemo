import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useSelector } from 'react-redux';
import FeedbackTextArea from '../../components/feedback/FeedbackTextArea';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import ButtonWithPlane from '../../components/atoms/buttons/ButtonWithPlane';
import StarRating from 'react-native-star-rating';
import FeedbackModal from '../../components/feedback/FeedbackModal';
import { useAddFeedbackMutation } from '../../apiServices/feedbackApi/FeedbackApi';
import * as Keychain from 'react-native-keychain';
import ErrorModal from '../../components/modals/ErrorModal';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
const Feedback = ({ navigation }) => {

    //states
    const [starCount, setStarCount] = useState(0);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false)
    const [error, setError] = useState(false);
    const[message, setMessage] = useState("");
  const userData = useSelector(state => state.appusersdata.userData)

    const userName = useSelector(state => state.appusersdata.name);
    const gifUri = Image.resolveAssetSource(require('../../../assets/gif/loader2.gif')).uri;

    const {t} = useTranslation();

    const [feedback, setFeedback] = useState("")


    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';


    const [addFeedbackFunc, {
        data: addFeedbackData,
        error: addFeedbackError,
        isError: addFeedbackIsError,
        isLoading: addFeedbackIsLoading
    }] = useAddFeedbackMutation()

    const onStarRatingPress = (rating) => {
        setStarCount(rating);
    };

    const showSuccessModal = () => {
        onSubmit();

    };

    const hideSuccessModal = () => {
        setIsSuccessModalVisible(false);
        navigation.navigate("Dashboard")
    };

    const handleFeedbackChange = (text) => {
        // console.log(feedback)
        setFeedback(text);
    };


    const onSubmit = async () => {
        const credentials = await Keychain.getGenericPassword();

        let obj = {
            token: credentials.username,
            body: {
                "feedback": feedback,
                "rating": starCount + "",
                "platform_id": "1",
                "platform": Platform.OS,
                "name":userName
                }
        }
        if(feedback != "" && starCount != 0){
            setFeedback("")
            addFeedbackFunc(obj)
            
        }
        else{
            setError(true);
            setMessage(t("Please fill all fields"))
        }
    }

    useEffect(()=>{
        if(addFeedbackData?.success){
            console.log("addFeedbackData",addFeedbackData.success)
            setFeedback(" ")
            setStarCount(0)
            setIsSuccessModalVisible(true)
        }
        if(addFeedbackError){
            console.log("addFeedbackError",addFeedbackError)
            setError(true)
        }
        
    },[addFeedbackData, addFeedbackError])

   

    return (
        <View style={[styles.container, { backgroundColor: ternaryThemeColor }]}>

            {/* Navigator */}
            <View
                style={{
                    height: '10%',
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

                <PoppinsTextMedium style={{ fontSize: 20, color: '#ffffff', marginTop: 5, position: 'absolute', left: 60, fontWeight:'bold'}} content={t("Feedback")}></PoppinsTextMedium>


            </View>
            {/* navigator */}

            <ScrollView contentContainerStyle={{height:'100%',width:'100$'}}>
            <View  style={{ backgroundColor: '#ffffff', flex: 1, borderTopRightRadius: 30, borderTopLeftRadius: 30,height:'100%' }}>
                
                <View style={styles.marginTopTen}>
                    <Image
                        style={styles.feedbackImage}
                        source={require('../../../assets/images/feed_back.png')}
                    />
                </View>

                <View>
                    <View style={{ alignItems: 'center' }}>
                        <View>
                            <PoppinsTextMedium style={{ marginRight: 10, fontSize: 16, color: '#58585a', marginLeft: 30, marginTop: 20 }} content={t("Please Rate")}></PoppinsTextMedium>
                        </View>

                        <View style={styles.StarRating}>
                            <StarRating
                                disabled={false}
                                maxStars={5}
                                rating={starCount}
                                selectedStar={(rating) => onStarRatingPress(rating)}
                                fullStarColor={'gold'}
                                starSize={40}
                            />
                        </View>
                        <View>
                            <PoppinsTextMedium style={{ marginRight: 10, fontSize: 16, color: '#58585a', marginLeft: 30 }} content={t("Comment/ Suggestions?")}></PoppinsTextMedium>
                        </View>
                    </View>
                </View>

                

                    <View >
                        <FeedbackTextArea onFeedbackChange={handleFeedbackChange} placeholder={t("Write your feedback here") }/>
                        
                    </View>

                <View style={{ marginHorizontal: '20%' }}>
                            <ButtonWithPlane title={t("submit" )}navigate="" parmas={{}} type={"feedback"} onModalPress={showSuccessModal}></ButtonWithPlane>
                        </View>
            </View>
            </ScrollView>

            <FeedbackModal isVisible={isSuccessModalVisible} user={userData.name} onClose={hideSuccessModal} />
            {
            addFeedbackIsLoading &&  <FastImage
            style={{ width: 100, height: 100, alignSelf: 'center', marginTop: '60%' }}
            source={{
              uri: gifUri, // Update the path to your GIF
              priority: FastImage.priority.normal
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          }
            {error && <ErrorModal  warning ={true} modalClose={()=>{setError(false)}} message={message} openModal={error}></ErrorModal>}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    navigator: {
        height: 50,
        width: '100%',
        backgroundColor: 'transparent',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 10,
    },
    navigatorIcon: {
        height: 20,
        width: 20,
        position: 'absolute',
        marginTop: 10,
    },
    navigatorImage: {
        height: 20,
        width: 20,
        resizeMode: 'contain',
    },
    marginTopTen: {
        marginTop: 20,
        alignItems:'center',
        justifyContent:'center'
    },
    feedbackImage: {
        height: 160,
        width: '90%',
        resizeMode: 'contain',
       
    },
    feedbackText: {
        color: '#58585a',
        fontSize: 15,
        fontWeight: '400',
    },
    StarRating: {
        marginTop: 10,
        marginBottom: 30
    },
    FeedbackStars: {},
});

export default Feedback;