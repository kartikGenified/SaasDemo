import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import DatePicker from 'react-native-date-picker';
import DateIcon from 'react-native-vector-icons/MaterialIcons';
import PoppinsTextMedium from '../../electrons/customFonts/PoppinsTextMedium';
import moment from 'moment';


const InputDate = (props) => {
  // Initialize date with the current date
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(false);

  const { data, title, minDate } = props;

  useEffect(() => {
    // Format the current date and send it to the parent component
    const formattedDate = moment(date).format('YYYY/MM/DD');
    console.log("date of today", formattedDate);
    setDate(new Date());
    handleInputEnd(new Date(), title);
  }, []);

  const handleInputEnd = (date, title) => {
    console.log(date, title);
    let tempJsonData = { ...props.jsonData, "value": moment(date).format("YYYY/MM/DD") };
    props.handleData(tempJsonData);
  };

  // console.log("JSSSS",props.jsonData)

  return (
    <TouchableOpacity
      onPress={() => setOpen(true)}
      style={styles.container}
    >
      {selected ? (
        <PoppinsTextMedium style={styles.text} content={moment(date).format('YYYY/MM/DD')} />
      ) : (
        <PoppinsTextMedium style={styles.text} content={data === null ? "Please select date" : moment(date).format('YYYY/MM/DD')} />
      )}
      <View style={styles.icon}>
        <DateIcon name="date-range" color="#DDDDDD" size={30} />
      </View>
      <Text style={{color:'black', marginLeft:"50%"}}>{props?.jsonData?.label}</Text>
      <DatePicker
        modal
        open={open}
        date={date}
        mode='date'
        maximumDate={new Date()}
        minimumDate={minDate ? minDate :null}
        onConfirm={(date) => {
          setSelected(true);
          setOpen(false);
          setDate(date);
          handleInputEnd(date, title);
        }}
        onCancel={() => {
          setOpen(false);
          setSelected(false);
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 54,
    width: '86%',
    backgroundColor: '#0000000D',
    borderRadius: 2,
    borderColor: '#DDDDDD',
    alignItems: 'center',
    justifyContent: "center",
    flexDirection: 'row',
    margin: 20,
  },
  text: {
    position: 'absolute',
    left: 20,
    color: 'black',
  },
  icon: {
    position: "absolute",
    right: 10,
  },
});

export default InputDate;
