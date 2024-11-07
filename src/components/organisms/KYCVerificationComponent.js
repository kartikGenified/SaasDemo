// import React from 'react';
// import {View, StyleSheet, TouchableOpacity,Image,Platform} from 'react-native';
// import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
// import { useSelector } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';

// const KYCVerificationComponent = (props) => {
//     const title = props.title
//     const buttonTitle = props.buttonTitle
//     const navigation = useNavigation()
//     const secondaryThemeColor = useSelector(
//         state => state.apptheme.secondaryThemeColor,
//       )
//         ? useSelector(state => state.apptheme.secondaryThemeColor)
//         : '#FF9B00';
//     const ternaryThemeColor = useSelector(
//             state => state.apptheme.ternaryThemeColor,
//           )
//             ? useSelector(state => state.apptheme.ternaryThemeColor)
//             : 'grey';

//     const platformFontWeight = Platform.OS === 'ios' ? '500' :'700'
//     const platformFontSize = Platform.OS === 'ios' ? 14 :16

//     return (
//         <View style={{...styles.container,backgroundColor:secondaryThemeColor}}>
//             <View style={{width:'60%',height:'100%',alignItems:'center',justifyContent:'center'}}>
//                 <PoppinsTextMedium style={{fontWeight:platformFontWeight,fontSize:platformFontSize}} content={title}></PoppinsTextMedium>
//                 <TouchableOpacity onPress={()=>{navigation.navigate('Verification')}} style={{...styles.button,backgroundColor:ternaryThemeColor}}>
//                 <PoppinsTextMedium style={{color:'white'}} content={buttonTitle}></PoppinsTextMedium>
//                 </TouchableOpacity>
//             </View>
//             <View style={{width:"40%",height:'100%',alignItems:'flex-end',justifyContent:'flex-end'}}>
//         <Image style={{height:56,width:120,resizeMode:'contain',marginBottom:4,marginRight:10}} source={require('../../../assets/images/kyc.png')}></Image>
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
// container:{
//     flexDirection:"row",
//     alignItems:"center",
//     justifyContent:"center",
//     height:90,
//     width:'90%',
//     borderRadius:20,
//     marginTop:20,
    
    
    
// },
// button:{
//     height:30,
//     width:'80%',
//     padding:4,
//     alignItems:"center",
//     justifyContent:"center",
//     marginTop:4,
//     borderRadius:16,
    
// }

// })

// export default KYCVerificationComponent;


import React from 'react';
import {View, StyleSheet, TouchableOpacity,Image,Platform} from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const KYCVerificationComponent = (props) => {
    const title = props?.title
    const buttonTitle = props?.buttonTitle
    const navigation = useNavigation()
    const secondaryThemeColor = useSelector(
        state => state.apptheme.secondaryThemeColor,
      )
        ? useSelector(state => state.apptheme.secondaryThemeColor)
        : '#FF9B00';
    const ternaryThemeColor = useSelector(
            state => state.apptheme.ternaryThemeColor,
          )
            ? useSelector(state => state.apptheme.ternaryThemeColor)
            : 'grey';

    const platformFontWeight = Platform.OS === 'ios' ? '500' :'700'
    const platformFontSize = Platform.OS === 'ios' ? 14 :16

    return (
        <View style={{...styles.container,backgroundColor:secondaryThemeColor}}>
            <View style={{width:'60%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <PoppinsTextMedium style={{fontWeight:platformFontWeight,fontSize:platformFontSize}} content={title}></PoppinsTextMedium>
                <TouchableOpacity onPress={()=>{navigation.navigate('Verification')}} style={{...styles.button,backgroundColor:ternaryThemeColor}}>
                <PoppinsTextMedium style={{color:'white'}} content={buttonTitle}></PoppinsTextMedium>
                </TouchableOpacity>
            </View>
            <View style={{width:"40%",height:'100%',alignItems:'flex-end',justifyContent:'flex-end'}}>
        <Image style={{height:56,width:120,resizeMode:'contain',marginBottom:4,marginRight:10}} source={require('../../../assets/images/kyc.png')}></Image>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
container:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"center",
    height:90,
    width:'90%',
    borderRadius:10,
    marginTop:20,
    
    
    
},
button:{
    height:30,
    width:'80%',
    padding:4,
    alignItems:"center",
    justifyContent:"center",
    marginTop:4,
    borderRadius:10,
    
}

})

export default KYCVerificationComponent;