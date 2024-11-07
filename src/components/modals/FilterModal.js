import React, { Component,useState } from 'react';
import { View, Text, StyleSheet,TouchableOpacity } from 'react-native';
import InputDate from '../atoms/input/InputDate';
import PoppinsTextLeftMedium from '../electrons/customFonts/PoppinsTextLeftMedium';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import BottomModal from './BottomModal';
import { useSelector } from 'react-redux';

// create a component
const FilterModal = ({modalClose, message, openModal,handleFilter,comp}) => {

    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';

      
    console.log("comp",comp)
   

    return (
            <BottomModal
                modalClose={modalClose}
                message={message}
                canGoBack = {true}
                openModal={openModal}
                handleFilter={handleFilter}
                comp={comp}></BottomModal>
      
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

//make this component available to the app
export default FilterModal;