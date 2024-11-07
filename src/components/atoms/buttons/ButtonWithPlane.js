import React,{useState} from 'react';
import { View, StyleSheet, TouchableOpacity, Image, } from 'react-native';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const ButtonWithPlane = (props) => {
  const [isClicked, setIsClicked] = useState(false)
    const navigation = useNavigation()
    const navigate = props.navigate
    const title = props.title
    const type = props.type
    const params = props.params
    console.log("------------->", props)
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
    )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';

        const handleButtonPress = () => {
            if(!isClicked){
                console.log("hello")
                type !== "feedback" ? navigation.navigate(navigate, params) :  props.onModalPress()
              setIsClicked(true);
            }
           setTimeout(() => {
            setIsClicked(false);
           }, 1000);
            console.log("buttonpressed");
          };
    return (
        <TouchableOpacity onPress={() => {
            handleButtonPress()

        }} style={{ height: 60, width: 200, backgroundColor: ternaryThemeColor, alignItems: "center", justifyContent: 'center', flexDirection: 'row', borderRadius: 4, marginLeft: 10, marginTop: 50 }}>
            <Image style={{ height: 30, width: 30, resizeMode: 'contain' }} source={require('../../../../assets/images/plane.png')}></Image>
            <PoppinsTextMedium content={title} style={{ fontSize: 18, fontWeight: '800', color: 'white', marginLeft: 10 }}></PoppinsTextMedium>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({})

export default ButtonWithPlane;