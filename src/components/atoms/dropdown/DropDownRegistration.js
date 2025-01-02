import React, { useEffect, useState } from 'react';
import {View, StyleSheet,Text,Image,TouchableOpacity,FlatList,ScrollView} from 'react-native';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';
import { useTranslation } from 'react-i18next';

const DropDownRegistration = (props) => {
    const [selected, setSelected] = useState(props.header)
    const [showList, setShowList] = useState(false)
    const [topMargin, setTopMargin] = useState(0)
    const {t} = useTranslation()
    const data = props.data
    console.log("datahgdfgasvdhas",data)
    const name = props.title
    console.log("Options",data)
    const handleSelect=(data)=>{
        // console.log(data)
        setSelected(data)
        setShowList(false)
        let tempJsonData ={...props.jsonData,"value":data}
        console.log(tempJsonData)
        props.handleData(tempJsonData)
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
                <Text style={{color:'black',fontSize:14,textTransform:'capitalize'}}>{t(title)}</Text>                
            </TouchableOpacity>
        )
    }
    return (
        <View style={{backgroundColor:"white",width:'90%',borderBottomWidth:1,borderColor:'#DDDDDD',alignItems:"center",justifyContent:'center',marginTop:10,marginBottom:10,marginLeft:10}}>
            {/* <View style={{width:'100%',alignItems:'flex-start',justifyContent:'center'}}>
            <PoppinsTextMedium style={{color:'black',fontSize:16,marginLeft:10}} content={name}></PoppinsTextMedium>

            </View> */}
            <TouchableOpacity onPress={()=>{handleOpenList()}} style={{flexDirection:"row",width:'100%',alignItems:"center",justifyContent:'center',height:40,borderBottomWidth:1,borderColor:'#DDDDDD'}}>
                <Text style={{color:'black',fontSize:14,position:"absolute",left:10,top:10,color:'black',textTransform:'capitalize'}}>{t(selected)}</Text>
                <Image style={{height:14,width:14,resizeMode:"contain",position:"absolute",right:10,top:10}} source={require('../../../../assets/images/arrowDown.png')}></Image>
            </TouchableOpacity>
            
            {showList && <ScrollView style={{width:'100%',minHeight:100}}>
                <View style={{alignItems:"center",justifyContent:"center",width:"100%"}}>
            { data && 
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

export default DropDownRegistration;