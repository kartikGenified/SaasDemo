import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Dimensions
} from "react-native";

const ProductCategoryDropDown = (props) => {
  const [selectedBank, setSelectedBank] = useState(props.header);
  const [showList, setShowList] = useState(false);
  const [topMargin, setTopMargin] = useState(0);
  const data = props.data;
  const width = Dimensions.get('window').width
  const handleSelect = (data) => {
    // console.log(data)
    setSelectedBank(data);
    setShowList(false);
    props.handleData(data);
  };
  const handleOpenList = () => {
    setShowList(!showList);
  };
  const SelectableDropDownComponent = (props) => {
    const title = props.title;
    const id = props.id
    return (
      <TouchableOpacity
        onPress={() => {
          handleSelect(title,id);
        }}
        style={{
          alignItems: "flex-start",
          justifyContent: "center",
          width: width-50,
          height: 40,
          borderBottomWidth: 1,
          borderColor: "#DDDDDD",
        }}
      >
        <Text style={{ color: "black", fontSize: 14 }}>{title}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        backgroundColor: "white",
        width: "90%",
        borderBottomWidth: 1,
        borderColor: "#DDDDDD",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
      }}
    >
      <TouchableOpacity
        onPress={() => {
          handleOpenList();
        }}
        style={{
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          height: 40,
          borderBottomWidth: 1,
          borderColor: "#DDDDDD",
        }}
      >
        <Text
          style={{
            color: "black",
            fontSize: 14,
            position: "absolute",
            left: 10,
            top: 10,
          }}
        >
          {selectedBank}
        </Text>
        <Image
          style={{
            height: 14,
            width: 14,
            resizeMode: "contain",
            position: "absolute",
            right: 10,
            top: 10,
          }}
          source={require("../../../../assets/images/arrowDown.png")}
        ></Image>
      </TouchableOpacity>

      {showList && (
       
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              minHeight:100
            }}
          >
          
            {data && (
              <FlatList
              initialNumToRender={20}
              contentContainerStyle={{alignItems:"center",justifyContent:"center"}}
              style={{width:'100%'}}
                data={data}
                renderItem={({ item, index }) => (
                  <SelectableDropDownComponent
                    key={index}
                    title={item.name}
                    id = {item.id}
                  ></SelectableDropDownComponent>
                )}
                keyExtractor={(item) => item.id}
              />
            )}
          </View>
       
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default ProductCategoryDropDown;
