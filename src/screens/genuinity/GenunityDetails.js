//import liraries
import React, { Component, } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions, Linking, ToastAndroid } from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import PoppinsTextLeftMedium from '../../components/electrons/customFonts/PoppinsTextLeftMedium';
import { useSelector } from 'react-redux';

const height = Dimensions.get('window').height

// create a component
const GenunityDetails = ({ navigation, route }) => {
    const productData = route.params?.productData

    console.log("product data gdetails", productData);    

    const uriImage = productData.products?.[0]?.images?.[0];
    // console.log("uriImage",uriImage)
    // const website = "";

    const productVideo = "";

    const facebook = "";
    const twitter = "";
    const insta = "";
    const youtube = "";

    const socials = useSelector(
        state => state.apptheme.socials,
    );

    const website = useSelector(
        state => state.apptheme.website,
    );

    console.log("usshss", socials,website)
      

    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';

        const showToast = () => {
            ToastAndroid.show(`Video Not Available : ${productData.products?.[0]?.product_id}`, ToastAndroid.LONG);
          };




    return (

        // Navigator
        <View
            style={{
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                backgroundColor: ternaryThemeColor,
                height: '100%',
            }}>
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    width: '100%',
                    marginTop: 10,
                    height: '10%',
                    marginLeft: 20,
                }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Dashboard')
                    }}>
                    <Image
                        style={{
                            height: 24,
                            width: 24,
                            resizeMode: 'contain',
                            marginLeft: 10,
                        }}
                        source={require('../../../assets/images/blackBack.png')}></Image>
                </TouchableOpacity>
                <PoppinsTextMedium
                    content="Genuinity Details"
                    style={{
                        marginLeft: 10,
                        fontSize: 16,
                        fontWeight: '700',
                        color: 'white',
                    }}></PoppinsTextMedium>
            </View>
            <ScrollView style={{ width: '100%', height: '90%' }}>


                <View
                    style={{
                        borderTopRightRadius: 30,
                        borderTopLeftRadius: 30,
                        backgroundColor: 'white',
                        minHeight: height - 100,
                        marginTop: 10,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '100%',
                        paddingBottom: 40,
                    }}>
                    <View
                        style={{
                            marginTop: 40,
                            width: '100%',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            flexWrap: 'wrap',
                            flexDirection: 'row'
                        }}>

                        <ScrollView style={styles.container}>
                            {/* Card */}
                            {/* header */}

                            <View style={styles.card}>
                                {/* Image in the center */}
                                <View style={styles.centeredImage}>
                                    {
                                    productData.products?.[0]?.images?.[0]!==undefined ? 
                                      <Image
                                      source={{ uri: uriImage }} // Replace with your image source
                                      style={styles.centeredImage}
                                  />
                                  :
                                  <Text style={{color:"black", alignSelf:'center',fontWeight:'800'}}>NO IMAGE</Text>
                                    }
                                  
                                </View>

                                {/* Image at the top-right corner */}
                                <View style={styles.topRightImage}>
                                    <Image
                                        source={require('../../../assets/images/genuineLogo.png')} // Replace with your image source
                                        style={styles.topRightImageStyle}
                                    />
                                </View>
                            </View>
                            {/* Card */}

                            {/* Product Details */}
                            <View style={{ marginTop: 20, marginLeft: 16 }}>
                                <PoppinsTextLeftMedium style={{ color: 'black', fontSize: 15, fontWeight: '800', }} content={`Product Name : ${productData.products?.[0]?.name}`}></PoppinsTextLeftMedium>
                                <PoppinsTextLeftMedium style={{ color: '#353535', fontSize: 14, fontWeight: '600', marginTop: 5 }} content={`Code : ${productData.products?.[0]?.product_code}`}></PoppinsTextLeftMedium>
                                <PoppinsTextLeftMedium style={{ color: '#353535', fontSize: 12, fontWeight: '600', marginTop: 10 }} content={`${productData.products?.[0]?.description}`}></PoppinsTextLeftMedium>

                            </View>

                            <View style={{
                                // height: 160,
                                width: "100%",
                                // alignSelf: 'center',
                                justifyContent: 'space-around',
                                marginTop: 30,
                                flexDirection: 'row',
                                backgroundColor: 'white', // Card background color
                                // borderRadius: 10, // Adjust as needed
                                overflow: 'hidden', // Clip contents to the card's boundaries
                                padding: 10, // Adjust padding as needed
                            }}>
                                {/* <TouchableOpacity>
                                    <Image
                                        source={require('../../../assets/images/brochure.png')} // Replace with your image source
                                        style={styles.middleLogo}
                                    />
                                    <PoppinsTextMedium style={{ color: '#353535', fontSize: 12, fontWeight: '800', marginTop: 5 }} content={`BROCHURE`}></PoppinsTextMedium>

                                </TouchableOpacity> */}

                              {productData.products?.[0]?.video &&  <TouchableOpacity onPress={()=>{
                                   productData.products?.[0]?.video ? Linking.openURL(productData.products?.[0]?.video) : showToast()
                                }}>
                                    <Image
                                        source={require('../../../assets/images/productVideo.png')} // Replace with your image source
                                        style={styles.middleLogo}
                                    />
                                    
                                    <PoppinsTextMedium style={{ color: '#353535', fontSize: 14, fontWeight: '800', marginTop: 5,  }} content={`PRODUCT VIDEO`}></PoppinsTextMedium>

                                </TouchableOpacity>}

                                

                                <TouchableOpacity onPress={()=>{Linking.openURL(website)}}>
                                    <Image
                                        source={require('../../../assets/images/website.png')} // Replace with your image source
                                        style={styles.middleLogo}
                                    />
                                    <PoppinsTextMedium style={{ color: '#000000', fontSize: 14, fontWeight: '800', marginTop: 5 }} content={`WEBSITE`}></PoppinsTextMedium>

                                </TouchableOpacity>


                            </View>

                            <View>
                                <PoppinsTextMedium style={{ color: '#010101', fontSize: 20, fontWeight: '800', marginTop: 40 }} content={t("FOLLOW US ON")}></PoppinsTextMedium>

                                <View style={{ width: "80%", alignSelf: 'center', marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                    {socials.facebook!=='' && <TouchableOpacity onPress={()=>{Linking.openURL("https://"+socials.facebook)}}>
                                        <Image
                                            source={require('../../../assets/images/fb.png')} // Replace with your image source
                                            style={styles.middleLogo}
                                        />
                                    </TouchableOpacity>}

                                    {socials.twitter!== '' &&<TouchableOpacity onPress={()=>{
                                        Linking.openURL("https://"+socials.twitter)
                                    }}>
                                        <Image
                                            source={require('../../../assets/images/twitter.png')} // Replace with your image source
                                            style={styles.middleLogo}
                                        />
                                    </TouchableOpacity>}

                                    {socials.instagram!=='' && <TouchableOpacity onPress={()=>{
                                        Linking.openURL("https://"+socials.instagram)
                                    }}>
                                        

                                        <Image
                                            source={require('../../../assets/images/insta.png')} // Replace with your image source
                                            style={styles.middleLogo}
                                        />
                                    </TouchableOpacity>}

                                    {socials.youtube!=="" && <TouchableOpacity onPress={()=>{
                                        Linking.openURL("https://"+socials.youtube)
                                    }}>

                                        <Image
                                            source={require('../../../assets/images/youtube.png')} // Replace with your image source
                                            style={styles.middleLogo}
                                        />
                                    </TouchableOpacity>}


                                </View>

                            </View>

                        </ScrollView>
                    </View>
                </View>
            </ScrollView>
        </View>

    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0000"
    },
    card: {
        height: 209,
        width: "90%",
        alignSelf: 'center',
        marginTop: 10,
        backgroundColor: 'white', // Card background color
        borderRadius: 10, // Adjust as needed
        overflow: 'hidden', // Clip contents to the card's boundaries
        padding: 10, // Adjust padding as needed
    },
    centeredImage: {
        // flex: 1,
        alignSelf: 'center',
        justifyContent: 'center',
        width: '80%',
        height: '100%',

    },
    centeredImageStyle: {
        width: 165,
        height: 165,
        // Other styling for the centered image
    },
    topRightImage: {
        position: 'absolute',
        top: 0, // Adjust the top position for top-right corner
        right: 0, // Adjust the right position for top-right corner
    },
    topRightImageStyle: {
        width: 54,
        height: 54,
        margin: 10
        // Other styling for the top-right image
    },
    middleLogo: {
        width: 80,
        height: 85,
        margin: 10,
        // Other styling for the top-right image

    }
});

//make this component available to the app
export default GenunityDetails;