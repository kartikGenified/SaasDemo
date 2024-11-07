import React,{useState,useEffect} from 'react';
import {View, StyleSheet,TextInput,TouchableOpacity} from 'react-native';
import DatePicker from 'react-native-date-picker'
import DateIcon from 'react-native-vector-icons/MaterialIcons'
import PoppinsText from '../../electrons/customFonts/PoppinsText';
import moment from 'moment';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';

const InputDateProfile = (props) => {
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState(false)
    console.log(moment(date).format('YYYY-MM-DD'))
    const data =props.data
    const label = props.label
    const title = props.title
    console.log("date from component",date)
    const handleInputEnd=(date,title)=>{
      
      console.log(date,title)
      
      props.handleData(date,title)
  }

    return (
        <TouchableOpacity onPress={()=>{
            setOpen(true)
        }} style={{height:54,width:'86%',backgroundColor:'#0000000D',borderRadius:2,borderColor:'#DDDDDD',alignItems:'center',justifyContent:"center",flexDirection:'row',margin:20}}>
           
           <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',position:'absolute',left:20}}>
            <PoppinsTextMedium style={{color:'black',marginRight:10,}} content ={`${label} :`}></PoppinsTextMedium>
           {selected ? (<PoppinsTextMedium style={{color:'black',width:100}} content={moment(date).format('DD/MM/YYYY')}></PoppinsTextMedium>) : (<PoppinsTextMedium style={{color:'black',width:100}} content={data===null ? "Please select date":moment(date).format('DD/MM/YYYY')}></PoppinsTextMedium>)
            
          }
           </View>
            <View style={{position:"absolute",right:10}}>
            <DateIcon name="date-range" color="#DDDDDD" size={30}></DateIcon>
            </View>
            <DatePicker
        modal
        maximumDate={new Date()}
        open={open}
        date={date}
        mode='date'
        onConfirm={(date) => {
          setSelected(true)
          setOpen(false)
          setDate(date)
          handleInputEnd(date,title)
        }}
        onCancel={() => {
          setOpen(false)
          setSelected(false)
        }}
      />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({})

export default InputDateProfile;
