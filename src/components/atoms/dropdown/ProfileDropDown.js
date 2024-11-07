import React, { useEffect, useState } from 'react';
import {View, StyleSheet,Text,Image,TouchableOpacity,FlatList,ScrollView} from 'react-native';

const ProfileDropDown = (props) => {
    const [selected, setSelected] = useState(props.header)
    const [showList, setShowList] = useState(false)
    const [topMargin, setTopMargin] = useState(0)
    const data = props.data
    const name = props.title
    console.log("Options",data)
    const handleSelect=(data)=>{
        // console.log(data)
        setSelected(data)
        setShowList(false)
        console.log("data from dropdown",data,name)
        props.handleData(data,name)
    }
    const handleOpenList=()=>{
        setShowList(!showList)
        
    }
    const SelectableDropDownComponent=(props)=>{
        const title = props.title
        
        return(
            <TouchableOpacity onPress={()=>{
                handleSelect(title)
            }} style={{alignItems:"flex-start",justifyContent:"center",width:'90%',height:40,borderBottomWidth:1,borderColor:'#DDDDDD'}}>
                <Text style={{color:'black',fontSize:16}}>{title}</Text>                
            </TouchableOpacity>
        )
    }
    return (
        <View style={{backgroundColor:"white",width:'90%',borderBottomWidth:1,borderColor:'#DDDDDD',alignItems:"center",justifyContent:'center',marginTop:10,marginBottom:10,marginLeft:10}}>
            <TouchableOpacity onPress={()=>{handleOpenList()}} style={{flexDirection:"row",width:'100%',alignItems:"center",justifyContent:'center',height:40,borderBottomWidth:1,borderColor:'#DDDDDD'}}>
                <Text style={{color:'black',fontSize:16,position:"absolute",left:10,top:10}}>{selected}</Text>
                <Image style={{height:14,width:14,resizeMode:"contain",position:"absolute",right:10,top:10}} source={require('../../../../assets/images/arrowDown.png')}></Image>
            </TouchableOpacity>
            
            {showList && <ScrollView style={{width:'100%',minHeight:100}}>
                <View style={{alignItems:"center",justifyContent:"center",width:"100%"}}>
            {
                data.map((item,index)=>{
                    // console.log(item)
                    return(
                        <SelectableDropDownComponent key ={index} title={item}></SelectableDropDownComponent>
                    )
                })
            }
            </View>
            </ScrollView>}
        </View>
    );
}

const styles = StyleSheet.create({})

export default ProfileDropDown;
