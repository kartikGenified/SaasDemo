import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useUploadImagesMutation } from '../../../apiServices/imageApi/imageApi';
import { useTranslation } from 'react-i18next';

const ImageInputWithUpload = (props) => {
    const [image, setImage] = useState()
    const {t} = useTranslation()
    const data = props.data
    const action = props.action
    // const [
    //     uploadImageFunc,
    //     {
    //         data: uploadImageData,
    //         error: uploadImageError,
    //         isLoading: uploadImageIsLoading,
    //         isError: uploadImageIsError,
    //     },
    // ] = useUploadImagesMutation();

    // useEffect(() => {
    //     if (uploadImageData) {
    //         console.log("uploadImageData", uploadImageData)

    //     }
    //     else if (uploadImageError) {
    //         console.log("uploadImageError", uploadImageError)
    //     }
    // }, [uploadImageData, uploadImageError])

    // Memoize the handleOpenImageGallery function to prevent re-renders
    const handleOpenImageGallery = useCallback(async () => {
        const result = await launchImageLibrary();
        console.log(result);
        console.log(result.assets[0].uri);
        setImage(result.assets[0]);
        const imageData = {
            uri: result.assets[0].uri,
            name: result.assets[0].uri.slice(0, 10),
            type: 'jpg/png',
        };
        props.handleData(imageData);
    }, [props.handleData]);

      // Memoize the image state to prevent re-renders
      const memoizedImage = useMemo(() => image, [image]);


    console.log("imaggg", image)
    return (
        <View style={{ width: '100%', alignItems: "center", justifyContent: "center", backgroundColor: '#EBF3FA',paddingVertical:40, borderWidth: 1, borderColor: '#85BFF1', borderStyle:'dotted' }}>
            <View style={{ alignItems: 'center' }}>
                {!memoizedImage && <Image style={{ height: 33, width: 35, }} source={require('../../../../assets/images/uploadIcon.png')} />}
            </View>

            {memoizedImage && <Image style={{ width: 100, height: 100, resizeMode: "center", marginTop: 40 }} source={{ uri: image.uri }}></Image>}

            <TouchableOpacity onPress={() => {
                handleOpenImageGallery()
            }} style={{ width: '86%',  borderColor: '#DDDDDD', marginTop: 10,height:20 }}>
   <PoppinsTextMedium style={{ color: 'black', alignSelf: 'center', }} content={t("Upload the Product Image")}></PoppinsTextMedium>
            </TouchableOpacity>
            
        </View>
    );
}

const styles = StyleSheet.create({})

export default ImageInputWithUpload;