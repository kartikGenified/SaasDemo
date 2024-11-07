import React from 'react';
import {View, StyleSheet,Dimensions,TouchableOpacity,Image} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import ButtonProceed from '../../components/atoms/buttons/ButtonProceed';

const GenuineProduct = ({navigation,route}) => {
  const buttonThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : '#ef6110';
// const productList=route.params.productList
const workflowProgram = route.params.workflowProgram
// console.log("Workflow",workflowProgram)
  const height = Dimensions.get('window').height;
  
  const handleWorkflowNavigation=()=>{
    console.log("scccess")

    if(workflowProgram[0]==="Static Coupon")
    {
    
    navigation.navigate('CongratulateOnScan',{
      workflowProgram:workflowProgram.slice(1),
      rewardType:"Static Coupon"
    })
    }
    else if (workflowProgram[0]==="Points On Product")
    {
      // console.log(workflowProgram.slice(1))
    navigation.navigate('CongratulateOnScan',{
      workflowProgram:workflowProgram.slice(1),
      rewardType:'Points On Product'
    })

    }
    else if (workflowProgram[0]==="Cashback")
    {
      // console.log(workflowProgram.slice(1))
    navigation.navigate('CongratulateOnScan',{
      workflowProgram:workflowProgram.slice(1),
      rewardType:'Cashback'
    })

    }
    else if (workflowProgram[0]==="Wheel")
    {
      // console.log(workflowProgram.slice(1))
    navigation.navigate('CongratulateOnScan',{
      workflowProgram:workflowProgram.slice(1),
      rewardType:'Wheel'
    })

    }
    else if (workflowProgram[0]==="Warranty")
    {
    navigation.navigate('ActivateWarranty',{
      workflowProgram:workflowProgram.slice(1)
    })


    }
    else{
    navigation.navigate('Genuinity',{
      workflowProgram:workflowProgram.slice(1)
    })



    }

  }
    return (
        <View style={{height:"100%",width:'100%',alignItems:"center",justifyContent:"center",backgroundColor:buttonThemeColor}}>
        <View style={{height:'10%',width:'100%',alignItems:'center',justifyContent:"center",position:'absolute',top:0}}>
        <TouchableOpacity
        style={{height:20,width:20,position:"absolute",left:10}}
        onPress={() => {
          navigation.goBack();
        }}>
        <Image
          style={{height: 20, width: 20, resizeMode: 'contain'}}
          source={require('../../../assets/images/blackBack.png')}></Image>
      </TouchableOpacity>
        <PoppinsTextMedium style={{fontSize:16,fontWeight:'700',color:"white",position:"absolute" ,left:60}} content="Genuine Product"></PoppinsTextMedium>
        </View>
        
    <View style={{height:'90%',width:'100%',backgroundColor:'white',borderTopRightRadius:30,borderTopLeftRadius:30,position:"absolute",bottom:0,alignItems:'center',justifyContent:"flex-start"}}>
        <Image style={{height:100,width:100,resizeMode:"contain",marginTop:100,marginBottom:20}} source={require('../../../assets/images/genuine.png')}></Image>
        <PoppinsText style={{color:'black',fontSize:22}}  content="Genuine Product"></PoppinsText>
        <View style={{height:120,width:'90%',borderWidth:1,borderStyle:'dotted',borderColor:"#85BFF1",borderRadius:10,alignItems:"center",justifyContent:"center",marginTop:20,backgroundColor:'#EBF3FA'}}>
        <PoppinsTextMedium style={{color:'#494A4B',fontSize:20,fontWeight:"700"}} content="Please note that you are registered with us. This is a genuine product."></PoppinsTextMedium>
        </View>
        <ButtonProceed handleOperation={handleWorkflowNavigation} style={{color:"white",fontSize:18}} content="Ok"></ButtonProceed>
        </View>
        </View>

    );
}

export default GenuineProduct


