import React,{useEffect} from 'react';
import { StyleSheet, Dimensions, View, BackHandler} from 'react-native';
import Pdf from 'react-native-pdf';

const PdfComponent = ({route,navigation}) => {
    const pdf = route?.params?.pdf
    const pdfLink = pdf == null ?  "" : pdf
    const source = pdf == null ? { uri: "", cache: true } : { uri: pdfLink, cache: true };

    useEffect(() => {
        const handleBackPress = () => {
            navigation.goBack(); // Navigate back when back button is pressed
            return true; // Prevent default back press behavior
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            handleBackPress
        );

        return () => backHandler.remove(); // Cleanup function to remove the event listener

    }, [navigation]); // Include navigation in the dependency array

    return (
        <View style={styles.container}>
                {pdf!=undefined && pdf!=null && <Pdf
                trustAllCerts={false}
                    source={pdf && source}
                    onLoadComplete={(numberOfPages,filePath) => {
                        console.log(`Number of pages: ${numberOfPages}`);
                    }}
                    onPageChanged={(page,numberOfPages) => {
                        console.log(`Current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    onPressLink={(uri) => {

                       console.log(`Link pressed: ${uri}`);
                    }}
                    style={styles.pdf}/>}
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
        height:Dimensions.get('window').height,
    }
});

export default PdfComponent;
