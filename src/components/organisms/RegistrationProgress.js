import React, {useEffect, useId, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  Dimensions
} from 'react-native';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';

const RegistrationProgress=(props)=>{

    const showPan = props.showPan
    const showAadhar = props.showAadhar
    const showGst = props.showGst
    const data = props.data
    const width = Dimensions.get('window').width
    const Circle=(props)=>{
      const completed = props.completed
      const color= completed ? 'yellow': 'white'
      const title = props.title
      const index = props.index
      const data = props.data
    const margin =index === 1 ? 20 :  100/data.length
      
      console.log(margin)
      return(
        <View style={{alignItems:"center",justifyContent:'center',paddingLeft:`${margin}%`}}>
          <View style={{height:26,width:26,borderRadius:13,backgroundColor:color,alignItems:'center',justifyContent:'center'}}>
          {completed && <Image source={require('../../../assets/images/tickBlue.png')} style={{height:20,width:20,resizeMode:'center'}}></Image>}
        </View>
        <PoppinsTextMedium style={{color:'white',fontSize:12,marginTop:4}} content ={(title).toUpperCase()}></PoppinsTextMedium>
        </View>
      )
    }

    return(
      <View style={{alignItems:'center',justifyContent:"center",width:"100%"}}>
        <View style={{height:'10%',width:'100%',alignItems:'center',justifyContent:'center'}}>
        <View style={{height:2,width:'80%',backgroundColor:'white'}}></View>
        <View style={{flexDirection:'row',width: '80%',left:4}}>
          {
            data && data.map((item,index)=>{
                return(
                    <Circle data={data} key={index} completed={false} title={item} index={index+1}></Circle>


                )
            })
          }
                {/* <Circle completed={false} title="Business Info" index={2}></Circle>
                <Circle completed={false} title="Manage Address" index={3}></Circle>
                <Circle completed={false} title="Other Info" index={4}></Circle> */}


          
         

        </View>
        </View>
        
        
      </View>
    )
  }

const styles = StyleSheet.create({})

export default RegistrationProgress;
// import React from 'react';
// import { View, StyleSheet } from 'react-native';

// const RegistrationProgress = ({ numberOfMilestones }) => {
//   // Calculate the space between milestones based on the number of milestones
//   const spacing = 100 / (numberOfMilestones - 1);
// console.log(spacing)
//   // Create an array to hold the milestones
//   const milestones = [];

//   // Generate the milestones (white circles)
//   for (let i = 0; i < numberOfMilestones; i++) {
//     milestones.push(
//       <View key={i} style={[styles.circle, { marginLeft: `${i * spacing}%` }]} />
//     );
//   }

//   return (
//     <View style={styles.progressBar}>
//       {milestones}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   progressBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   circle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'white',
//   },
// });

// export default RegistrationProgress;
