import React,{useRef,useEffect} from 'react';
import {View, StyleSheet, Image,Animated} from 'react-native';
import { useSelector } from 'react-redux';

const Genuinity = ({navigation,route}) => {
    const zoomAnim = useRef(new Animated.Value(100)).current;
    const workflowProgram = route.params.workflowProgram
    const productData = route.params?.productData
    const isGenuinityOnly = useSelector(state=>state.appWorkflow.isGenuinityOnly)
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
      else if(workflowProgram[0]==="Genuinity"){
      navigation.navigate('Genuinity',{
        workflowProgram:workflowProgram.slice(1)
      })
  
      
  
      }
      else if(productData!==undefined){
        navigation.replace("GenunityDetails",{productData:productData})
      }
      else{
        
        navigation.navigate('Dashboard')
      }
  
    }
    const zoomIn = () => {  
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(zoomAnim, {
          toValue: 200,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      };
      useEffect(()=>{
        zoomIn()
        setTimeout(() => { 
          if(isGenuinityOnly)
          {
          console.log(GenuineProduct)
          navigation.navigate("GenuineProduct",{workflowProgram:workflowProgram})
          }
          else{
            handleWorkflowNavigation()
          }
        }, 1000);
      },[])

    return (
        <View style={{alignItems:"center",justifyContent:'center',flex:1}}>
            <Animated.Image style={{height:zoomAnim,width:zoomAnim,resizeMode:'contain'}} source={require('../../../assets/images/genuine.png')}></Animated.Image>
        </View>
    );
}

const styles = StyleSheet.create({})

export default Genuinity;