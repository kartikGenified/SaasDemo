import react, {useState, useEffect} from 'react';
import {View, Text, Image,StyleSheet} from 'react-native';



const ProgressBar = (props) => {
  console.log("Progress bar",props.data);
  const data = props.data;
  const gap = 100 / data.length;

  const getProgressFromMilestone = () => {
    for (var i = data.length - 1; i >= 0; i--) {
      if (data[i].achieved === '1') {
        return gap * i + 5;
      }
      else{
        return 0;
      }
    }
  };
  const progress = getProgressFromMilestone();
  console.log('Progress', progress);
  const Triangle = (props) => {
    return <View style={[styles.triangleDown, props.style]} />;
  };
  
 
  return (
    <View
      style={{
        height: 100,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop:100
      }}>
      <View
        style={{
          height: 10,
          width: '90%',
          backgroundColor: '#E6E6E6',
          position: 'absolute',
          top: 0,
          borderRadius:10
        }}></View>
      <View
        style={{
          height: 10,
          width: `${progress}%`,
          backgroundColor: 'red',
          position: 'absolute',
          borderRadius: 10,
          left: 18,
          top: 0,
        }}></View>
      {data && data.map((item, index) => {
        const achieved = item.achieved;
        const image = item.image;
        // console.log(image)
        return (
          <View
            key={index}
            style={{
              height: 100,
              width: '20%',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              left: `${gap * index}%`,
              top: item.achieved==="1" ? -67 : -35,
            }}>
            {item.achieved==="1" && (<View style={{alignItems: 'center', justifyContent: 'center'}}>
              <View style={{height: 50, width: 50, borderRadius:4,}}>
              <Image
                style={{height: 50, width: 50, resizeMode:'contain'}}
                source={require('../../../assets/images/box.png')}></Image>
              </View>
              <Triangle style={styles.triangleDown} />
            </View>)}
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                backgroundColor: achieved === '1' ? 'red' : 'white',
              }}></View>
            <Text style={{marginTop: 4, fontWeight: '800',color:'black'}}>
              {item.threshold / 1000}k
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
   
        
        triangleDown: {
            transform: [{ rotate: "180deg" }],
            width: 0,
          height: 0,
          backgroundColor: "transparent",
          borderStyle: "solid",
          borderLeftWidth: 10,
          borderRightWidth: 10,
          borderBottomWidth: 16,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: "#DDDDDD",
          
          },
     
})

export default ProgressBar;