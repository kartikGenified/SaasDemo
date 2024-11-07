//import liraries
import React, { useState,useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Tooltip from "react-native-walkthrough-tooltip";
import { useDispatch, useSelector } from "react-redux";
import PoppinsTextLeftMedium from "../electrons/customFonts/PoppinsTextLeftMedium";
import { useTranslation } from "react-i18next";
import DisplayPoints from "../atoms/DisplayPoints";
import { useNavigation } from "@react-navigation/native";
import { setStepId } from "../../../redux/slices/walkThroughSlice";
// create a component
const PointBox = (props) => {
    const [pointBalance , setPointBalance] = useState( props.pointBalance)
  const [walkThrough, setWalkThrough] = useState(false);
  const [numberWidth, setNumberWidth] = useState(0);
  const [buttonWidth, setButtonWidth] = useState(0)
  const { t } = useTranslation();
  const navigation = useNavigation()
  const ternaryThemeColor = useSelector(
    (state) => state.apptheme.ternaryThemeColor
  );
  const dispatch = useDispatch();
  const stepId = useSelector((state) => state.walkThrough.stepId);
  
  useEffect(()=>{
    const temp = String(pointBalance)
    console.log("qwertyuisdfzfgasdas",temp)
    if(temp.length<=5)
        {
            setNumberWidth(50)
            setButtonWidth(50)
        }
    if(temp.length>5)
        {
            setNumberWidth(80)
            setButtonWidth(20)
        }
    
  },[pointBalance])

  useEffect(() => {
    // Determine if tooltip should be shown
    const showTooltip = stepId === 1;
    if (showTooltip) {
      setWalkThrough(true);
    }
    else{
      setWalkThrough(false)
    }
  }, [stepId]);


  console.log("widfthsssss",numberWidth,buttonWidth,pointBalance)

  const handleNextStep = () => {
    dispatch(setStepId(stepId + 1)); // Move to the next step
    setWalkThrough(false);
  };
  const handlePrevStep = () => {
    dispatch(setStepId(stepId - 1)); // Move to the next step
    setWalkThrough(false);
  };

  const handleSkip = () => {
    dispatch(setStepId(0)); // Reset or handle skip logic
    dispatch(setAlreadyWalkedThrough(true)); // Mark walkthrough as completed
    setWalkThrough(false);
  };

  const TooltipComp=()=>{
    return (
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
              Redeem Your Points to get Gift or Cashback
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{
                  backgroundColor: ternaryThemeColor,
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                  borderRadius: 5,
                  marginRight: 12,
                }}
                onPress={() => handlePrevStep()}
              >
                <Text style={{ color: "white" }}>Prev</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: "lightgray",
                  paddingVertical: 5,
                  paddingHorizontal: 15,
                  borderRadius: 5,
                  borderColor: ternaryThemeColor,
                  borderWidth: 1,
                }}
                onPress={() => handleNextStep()}
              >
                <Text style={{ color: "black" }}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        placement="left"
        animated={true}
        onClose={() => setWalkThrough(false)}
        tooltipStyle={{ borderRadius: 30 }}
        contentStyle={{
          backgroundColor: "white",
          minHeight: 100,
          borderWidth: 2,
          borderRadius: 10,
          borderColor: ternaryThemeColor,
        }}
      >
        <PoppinsTextLeftMedium
          style={{
            color: "white",
            fontWeight: "800",
            fontSize: 16,
          }}
          content={t("redeem")}
        ></PoppinsTextLeftMedium>
      </Tooltip>
    )
  }

  return (
      <View
        style={{
          backgroundColor: "white",
          marginBottom: 20,
          flexDirection: "row",
          borderColor: "#808080",
          borderWidth: 0.3,
          borderRadius: 10,
          alignItems: "center",
          height: 60,
          width:'100%',
          
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: `${numberWidth}%`,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
            <DisplayPoints pointBalance = {pointBalance ? pointBalance : 0}/>
        </View>

          
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("RedeemedHistory");
            }}
            style={{
              backgroundColor: ternaryThemeColor,
              width:`${buttonWidth}%`,
              // borderRadius: 10,
              // borderTopLeftRadius:10,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              // padding: 6,
            }}
          >
           <TooltipComp></TooltipComp>
          </TouchableOpacity>
        </View>
      
  );
};

// define your styles
const styles = StyleSheet.create({
 
});

//make this component available to the app
export default PointBox;
