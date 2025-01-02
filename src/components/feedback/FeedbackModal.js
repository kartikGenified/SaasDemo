import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';


// create a component
const FeedbackModal = ({ isVisible, onClose, user }) => {
    const {t} = useTranslation()
    return (
        <Modal
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Image
                        style={{ height: 30, width: 30, resizeMode: 'contain' }}
                        source={require('../../../assets/images/userGreen.png')}></Image>
                    <PoppinsTextMedium style={{ fontSize: 22, fontWeight: '600', color: '#7BC143', fontWeight: 'bold', marginTop: 10 }} content={"Dear " + user}></PoppinsTextMedium>

                    <View>
                        <PoppinsTextMedium style={{ fontSize: 22, fontWeight: '600', color: '#000000', marginTop: 20, marginHorizontal: 20 }} type={"feedback"} content={t("Thank You for submitting your feedback")}></PoppinsTextMedium>
                    </View>

                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Icon name="close" size={27} color="#ffffff" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};


// define your styles
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        width: 338,
        height: 232,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    successText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    closeButton: {
        padding:10,
        backgroundColor: '#E60707',
        borderRadius: 30,
        position: 'absolute',
        top: -10,
        right:-10,
    },
  
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});


//make this component available to the app
export default FeedbackModal;