//import liraries
import React, { Component, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";



const DisplayPoints = (props) => {

const [value, setValue] = useState(props.pointBalance) 
const [valueArr, setValueArr] = useState([])
const [width,setWidth] = useState(15)
const [timer, setTimer] = useState(3)

    useEffect(()=>{
    var val = props.pointBalance
    const size = String(val).length
    const min = 0;
    const max = val;
    const intervalID = setInterval(() => {
       const tempRandom =   Math.trunc(Math.random()* (max-min)+min)
       const tempRandomLen = String(tempRandom).length
       if(tempRandom<Number(val) && size == tempRandomLen)
       {
        setValue(tempRandom)
       }
    // setValue()
    console.log("tempRandom",tempRandom)
    }, 1);

    setTimeout(() => {
        clearInterval(intervalID)
        setValue(props.pointBalance)
    }, 1000);

    },[props.pointBalance])

    useEffect(()=>{
        var temp =[];
        var val = value;
        console.log("useeffect values",val)
        const str = String(val)
        if(str.length>5)
            {
                setWidth(10)
            }
        if(str.length>8)
            {
                setWidth(8)
            }
        console.log("gsadashdjsbjdhascdcd", width)
       
        
        if(val == 0)
            {
                temp.push('0');
            }
        while(val!=0)
            {
                let dig = val%10;
                temp.push(String(dig))
                val = val/10;
                val = Math.trunc(val)
                console.log("useeffect", dig,val)
            }
            console.log("value converted to array:", temp)
            temp.reverse()

            if(str.length==1)
                {
                    temp.unshift('0')
                    temp.unshift('0')

                }
            if(str.length==2)
                {
                    temp.unshift('0')

                }
            setValueArr(temp)
            // setValueArr(temp.reverse())
    },[value])

const PointBo = (props) => {
    return (
          <View style={{alignItems:'center',justifyContent:'center',borderWidth:2,width:`${width}%`,borderRadius:6,margin:3}}>
          <Text style={{fontSize:18, color:'black'}}>{props.val}</Text>
      </View>
    );
  };
// create a component

  return (
    <View style={{alignItems:'center',justifyContent:'center',flexDirection:'row',height:'100%',width:'100%'}}>
        {
            valueArr.map((val, index) => {
              return (
               
                    <PointBo val={val}></PointBo>
                
              );
            })  // end of map function
        }
       </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: "100%",
    height: 60,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'black',
  },
});

//make this component available to the app
export default DisplayPoints;
