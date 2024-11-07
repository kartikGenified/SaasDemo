import React, { useEffect, useId, useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    TextInput,
    ScrollView,
    Dimensions,
    Text
} from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';

const TrackGiftProgessBar = (props) => {
    const data = props.data
    const height = props.height
    const status =props.status

    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';

    const Circle = (props) => {
        const [index, setIndex] = useState(props.index)
        const completed = props.completed
        const color = completed ? 'yellow' : 'white'
        const title = props.title
        
        const data = props.data
        let margin = (index == 0) ? 0 :  100 / (data.length - 1)

        // useEffect(()=>{
        //     if(data.length-1 === index)
        //     {
        //         setIndex(data.length)
        //     }
        // },[index])

        console.log("status", status)
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', top: `${margin * index}%`, position: 'absolute' }}>
                <View style={{ height: 26, width: 26, borderRadius: 13, backgroundColor: status>=index ? ternaryThemeColor:"#808080", alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white' }}>{index}</Text>
                    {completed && <Image source={require('../../../assets/images/tickBlue.png')} style={{ height: 20, width: 20, resizeMode: 'center' }}></Image>}
                </View>
                {/* <PoppinsTextMedium style={{color:'white',fontSize:12,marginTop:4}} content ={(title).toUpperCase()}></PoppinsTextMedium> */}
            </View>
        )
    }

    return (
        <View style={{ height: height, backgroundColor: '#F5F5F5', marginTop: 10, marginLeft: 10 }}>
            <View style={{ height: height }}>
                <View style={{ height: '96%', width: 2, backgroundColor: '#80808060', position: "absolute",left:10 }}></View>
                <View style={{ height: '100%', alignItems: 'center', width: 200 }}>
                    {
                        data && data.map((item, index) => {
                            console.log("item", item)
                            return (
                                <View key={index} style={{ flex: 1, alignItems: 'flex-start', flexDirection: 'row',width:'100%' }}>
                                    
                                        <View style={{ position: "absolute",left:0}}>
                                            <Circle data={data} key={index} completed={false} title={item} index={index}></Circle>

                                        </View>

                                        <View>
                                            <PoppinsTextMedium style={{ color: ternaryThemeColor, fontSize: 15, marginTop: 4,position:"absolute",left:40 }} content={item}></PoppinsTextMedium>

                                        </View>

                                   

                                </View>

                            )
                        })
                    }
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})

export default TrackGiftProgessBar;