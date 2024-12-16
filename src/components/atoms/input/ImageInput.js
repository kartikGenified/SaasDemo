import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import PoppinsTextMedium from "../../electrons/customFonts/PoppinsTextMedium";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import * as Keychain from "react-native-keychain";
import { useUploadSingleFileMutation } from "../../../apiServices/imageApi/imageApi";
import FastImage from "react-native-fast-image";
import { gifUri } from "../../../utils/GifUrl";
import { loader } from "../../../utils/HandleClientSetup";
import { Image as RNCompressor } from "react-native-compressor"; // Import for compression

const ImageInput = (props) => {
  const [image, setImage] = useState();
  const [loading, setLoading] = useState();
  const data = props.data;
  const action = props.action;

  const gifUri = Image.resolveAssetSource(loader).uri;

  const [
    uploadImageFunc,
    {
      data: uploadImageData,
      error: uploadImageError,
      isLoading: uploadImageIsLoading,
      isError: uploadImageIsError,
    },
  ] = useUploadSingleFileMutation();

  useEffect(() => {
    if (uploadImageData) {
      let tempJsonData = {
        ...props.jsonData,
        value: uploadImageData?.body?.fileLink,
      };
      props.handleData(tempJsonData);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [uploadImageData, uploadImageError]);

  const handleOpenImageGallery = async () => {
    const result = await launchImageLibrary();
    if (!result.assets || !result.assets[0]) return;

    const selectedImage = result.assets[0];
    setImage(selectedImage);

    // Compress the image
    const compressedImageUri = await RNCompressor.compress(selectedImage.uri, {
      compressionMethod: "auto",
      quality: 0.5, // Set quality (0-1) for lossy compression
      maxWidth: 1080, // Optional: specify max width
      maxHeight: 1080, // Optional: specify max height
    });

    const imageDataTemp = {
      uri: compressedImageUri,
      name: selectedImage.fileName || "compressed_image",
      type: selectedImage.type || "image/jpeg",
    };

    const uploadFile = new FormData();
    uploadFile.append("image", imageDataTemp);

    const getToken = async () => {
      const credentials = await Keychain.getGenericPassword();
      const token = credentials.username;
      setLoading(true);
      uploadImageFunc({ body: uploadFile, token: token });
    };

    getToken();
  };

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
      }}
    >
      {(image && !uploadImageIsLoading) && (
        <Image
          style={{ width: 200, height: 200, resizeMode: "center" }}
          source={{ uri: image.uri }}
        ></Image>
      )}
         {(uploadImageIsLoading )&& (
        <View>
          <FastImage
            style={{ width: 60, height: 60, alignSelf: "center" }}
            source={{
              uri: gifUri,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <Text style={{ color: "black" }}>Uploading Image, Please Wait</Text>
        </View>
      )}
      <TouchableOpacity
        onPress={() => {
          handleOpenImageGallery();
        }}
        style={{
          flexDirection: "row",
          width: "86%",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          height: 50,
          borderColor: "#DDDDDD",
          marginTop: 20,
        }}
      >
        <View
          style={{
            width: "60%",
            height: 50,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {image ? (
            <PoppinsTextMedium
              style={{ color: "black" }}
              content={image.fileName?.slice(0, 20) || "Selected Image"}
            ></PoppinsTextMedium>
          ) : (
            <PoppinsTextMedium
              style={{ color: "black" }}
              content={data}
            ></PoppinsTextMedium>
          )}
        </View>
        <View
          style={{
            width: "40%",
            height: 50,
            backgroundColor: "#D6D6D6",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PoppinsTextMedium
            style={{ color: "black" }}
            content={action}
          ></PoppinsTextMedium>
        </View>
      </TouchableOpacity>
      {/* {(loading  )&& (
        <View>
          <FastImage
            style={{ width: 60, height: 60, alignSelf: "center" }}
            source={{
              uri: gifUri,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
          <Text style={{ color: "black" }}>Uploading Image, Please Wait</Text>
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({});

export default ImageInput;
