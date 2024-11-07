import React,{useRef,useEffect, useState} from 'react';
import {View, StyleSheet,TouchableOpacity,Image,Animated,Dimensions,Text} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Bell from 'react-native-vector-icons/FontAwesome';
import {useSelector, useDispatch} from 'react-redux';
import { useNavigation,DrawerActions } from '@react-navigation/core';
import { BaseUrl } from '../../utils/BaseUrl';
import RotateViewAnimation from '../animations/RotateViewAnimation';
import FadeInOutAnimations from '../animations/FadeInOutAnimations';
import Tooltip from "react-native-walkthrough-tooltip";
import AsyncStorage from '@react-native-async-storage/async-storage';


const DrawerHeader = () => {
    const navigation = useNavigation()
    const[walkThrough, setWalkThrough] = useState(false)
    const dispatch = useDispatch();
    
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';
    const icon = useSelector(state => state.apptheme.icon)
        ? useSelector(state => state.apptheme.icon)
        : require('../../../assets/images/demoIcon.png');

    const stepId = useSelector((state) => state.walkThrough.stepId);

        //asynch storage data saving
        const storeData = async () => {
            try {
              await AsyncStorage.setItem('isAlreadyWalkedThrough', "true" );
              const value = await AsyncStorage.getItem("isAlreadyIntroduced");
            console.log("isAlreadyWalkedThrough",value)
            } catch (e) {
              // saving error
              console.log("error",e)
    
            }
          };

    useEffect(() => {
        // console.log("workflow", workflow, )
        if(stepId==3){
            setWalkThrough(true)
        }
      }, [stepId]);

      const handleNextStep = () => {
        setWalkThrough(false);
        storeData()
        
      };
    
      const handleSkip = () => {
        // dispatch(setStepId(0)); // Reset or handle skip logic
        // dispatch(setAlreadyWalkedThrough(true)); // Mark walkthrough as completed
        setWalkThrough(false);
      };
    
    
    const BellComponent =()=>{
        return(
            <TouchableOpacity style={{height:30,width:30}} onPress={()=>{navigation.navigate("Notification")}} >
            <Bell name="bell" size={30} color={ternaryThemeColor}></Bell>
        </TouchableOpacity>
        )
    }
    return (
        <View style={{height:60,width:'100%',flexDirection:"row",alignItems:"center",marginBottom:20,backgroundColor:"white"}}>
                <Tooltip
                  isVisible={walkThrough}
                  content={
                    <View style={{ alignItems: "center" }}>
                      <Text
                        style={{
                          color: "black",
                          textAlign: "center",
                          marginBottom: 10,
                          fontWeight: "bold",
                        }}
                      >
                        Check Drawer Menu for more options
                      </Text>
                      <View style={{ flexDirection: "row" }}>
                        {/* <TouchableOpacity
                          style={{
                            backgroundColor: ternaryThemeColor,
                            paddingVertical: 5,
                            paddingHorizontal: 15,
                            borderRadius: 5,
                            marginRight: 12,
                          }}
                          onPress={() => handleSkip()}
                        >
                          <Text style={{ color: "white" }}>Skip</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity
                          style={{
                            backgroundColor: ternaryThemeColor,
                            paddingVertical: 5,
                            paddingHorizontal: 15,
                            borderRadius: 5,
                          }}
                          onPress={() => handleNextStep()}
                        >
                          <Text style={{ color: "white", fontWeight:'bold' }}>Finish</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  }
                  placement="right"
                  animated={true}
                  onClose={() => setWalkThrough(false)}
                  tooltipStyle={{ borderRadius: 30 }}
                  contentStyle={{ backgroundColor: "white", minHeight: 80, borderWidth:2, borderRadius:10, borderColor:ternaryThemeColor }}
                >
                    <TouchableOpacity onPress={()=>{navigation.dispatch(DrawerActions.toggleDrawer());}} style={{marginLeft:10}}>
            <Icon name="bars" size={30} color={ternaryThemeColor}></Icon>
            </TouchableOpacity>
                </Tooltip>
         
            <Image style={{height:60,width:80,resizeMode:"contain",marginLeft:10}} source={{uri: icon}}></Image>
           
                <RotateViewAnimation outputRange={["0deg","30deg", "-30deg","0deg"]} inputRange={[0,1,2,3]} comp={BellComponent} style={{height:30,width:30,position:'absolute',right:30}}>
                    
                </RotateViewAnimation>
                {/* <FadeInOutAnimations comp = {BellComponent}></FadeInOutAnimations> */}
                {/* <BellComponent></BellComponent> */}
           
            
            
            
        </View>
    );
}

const styles = StyleSheet.create({})

export default DrawerHeader;
