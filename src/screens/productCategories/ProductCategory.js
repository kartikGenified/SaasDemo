import React, { useEffect,useState } from 'react';
import {View, StyleSheet,TouchableOpacity,Image, ScrollView,FlatList,Text} from 'react-native';
import { useSelector } from 'react-redux';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useGetProductCategoryMutation,useGetProductSubCategoryByIdMutation } from '../../apiServices/productCategory/ProductCategoryApi';
import * as Keychain from 'react-native-keychain';
import ProductCategoryDropDown from '../../components/atoms/dropdown/ProductCategoryDropDown';
import { useGetProductLevelMutation } from '../../apiServices/productCategory/ProductCategoryApi';
import FastImage from "react-native-fast-image";
import { useTranslation } from 'react-i18next';


const ProductCategory = ({navigation}) => {
  const [productLevel, setProductLevel] = useState([])
    const [productCategory, setProductCategory] = useState([])
    const [subCategory, setSubCategory] = useState([])
    const [token, setToken] = useState()
    const [loading , setLoading] = useState(true)
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';

        const {t} = useTranslation()

   
    
    const [getProductLevelFunc,{
      data:getProductLevelData,
      error:getProductLevelError,
      isLoading:getProductLevelIsLoading,
      isError:getProductLevelIsError
  }] = useGetProductLevelMutation()

    const gifUri = Image.resolveAssetSource(
      require("../../../assets/gif/loader2.gif")
    ).uri;

    useEffect(()=>{
        getToken()
      setTimeout(() => {
        setLoading(false)
      }, 3000);
       
    },[])

    const getToken=async()=>{
        const credentials = await Keychain.getGenericPassword();
  if (credentials) {
    console.log(
      'Credentials successfully loaded for user ' + credentials.username
    );
    const token = credentials.username
    setToken(token)
    const params={level:"1",token:token}
    getProductLevelFunc(params)
    }
}
   

  

   useEffect(()=>{
    if(getProductLevelData){
        console.log("getProductLevelData",JSON.stringify(getProductLevelData.body))
        // setSubCategory(getProductLevelData.body.data)
        if(getProductLevelData.success)
        {
          const length = getProductLevelData.body.length
          const lastId = getProductLevelData.body[length-1].id
          setProductLevel(getProductLevelData.body)
        }
    }
    else if(getProductLevelError){
        console.log("getProductLevelError",getProductLevelError)
    }
   },[getProductLevelData,getProductLevelError])

   const Node = ({ node, handleShowModal }) => {
    const [showChild, setShowChild] = useState(false)
    return (
      <View style={{marginLeft:10,marginTop:20,zIndex:2,width:'100%'}}  >
        <ScrollView >
        <TouchableOpacity onPress={()=>{
          setShowChild(!showChild)
        }} style={{padding:10,width:'90%',justifyContent:'center',alignItems:'flex-start',borderLeftWidth:1,borderColor:'black',backgroundColor:node.is_master!==0 && ternaryThemeColor,borderRadius:node.is_master!==0 ? 10 : 0}} >
          <Text style={{marginLeft:20,color:node.is_master===0 ? 'black' : "white"}} >{node.name} </Text>
        </TouchableOpacity>
  
        {showChild && node.children && node.children.length > 0 && (
         
          <View style={{width:'100%',height:'100%',marginBottom:20,marginLeft:20}}>
            {node.children.map((childNode) => (
              
                <Node
                key={childNode.id}
                  node={childNode}
                  handleShowModal={handleShowModal}
                />
             
            ))}
          </View>
          
        )}
        </ScrollView>
      </View>
    );
  };
  

  //  const DisplaySubCategoryDetails=(props)=>{
  //   const name = props.name
  //   const category = props.category
  //   const mrp = props.mrp
  //   const productCode = props.productCode
  //   const index = props.index
  //   return(
  //       <View style={{alignItems:"center",justifyContent:"center",padding:4,marginLeft:10,borderWidth:1,borderColor:'#DDDDDD',borderRadius:4,flexDirection:'row',width:'100%',marginTop:10}}>
  //           <View style={{width:'10%',alignItems:"flex-start",justifyContent:'center'}}>
  //               <View style={{height:30,width:30,alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:'#DDDDDD',borderRadius:15}}>
  //                   <PoppinsTextMedium content={index} style={{colo:'black'}}></PoppinsTextMedium>
  //               </View>
  //           </View>
  //           <View style={{width:'80%',alignItems:"flex-start",justifyContent:"center"}}>
  //           <PoppinsTextMedium style={{color:'black',fontSize:14,margin:4}} content={`Product Name : ${name}`}></PoppinsTextMedium>
  //           <PoppinsTextMedium style={{color:'black',fontSize:14,margin:4}} content={`Category Name : ${category}`}></PoppinsTextMedium>
  //           <PoppinsTextMedium style={{color:'black',fontSize:14,margin:4}} content={`Mrp : ₹${mrp}`}></PoppinsTextMedium>
  //           <PoppinsTextMedium style={{color:'black',fontSize:14,margin:4}} content={`Product Code: ${productCode}`}></PoppinsTextMedium>
  //           </View>

  //       </View>
  //   )
  //  }

    return (
        <View style={{alignItems:"center",justifyContent:'flex-start',height:'100%',width:'100%',backgroundColor:ternaryThemeColor,flex:1}}>
        <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          width: '100%',
          marginTop: 10,
          height: '10%',
          marginLeft: 20,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={{
              height: 24,
              width: 24,
              resizeMode: 'contain',
              marginLeft: 10,
            }}
            source={require('../../../assets/images/blackBack.png')}></Image>
        </TouchableOpacity>
        <PoppinsTextMedium
          content={t("Category wise product information")}
          style={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '700',
            color: 'white',
          }}></PoppinsTextMedium>
      </View>       

      <View style={{height:'90%',width:'100%',alignItems:"center",justifyContent:'flex-start',backgroundColor:"white",paddingTop:30}}>
        <View style={{width:"100%",alignItems:"center",justifyContent:'center'}}>
        <PoppinsTextMedium style={{color:'black',marginLeft:30,fontSize:16,fontWeight:'700'}}  content={t("Product Heirarchy")}></PoppinsTextMedium>
        </View>
      {/* {productLevel && <ProductCategoryDropDown header="Select Level" data={productLevel} handleData={getLevel}></ProductCategoryDropDown>}

      {productCategory && <ProductCategoryDropDown header="Select Product" data={productCategory} handleData={getProduct}></ProductCategoryDropDown>}
         */}
        {/* {subCategory && <FlatList
        
        style={{width:'100%',marginBottom:20}}
        contentContainerStyle={{alignItems:"center",justifyContent:'center'}}
        data={subCategory}
        renderItem={({item,index}) => <DisplaySubCategoryDetails index ={index+1} name={item.name} category = {item.category_name} mrp ={item.mrp} productCode={item.product_code} />}
        keyExtractor={(item,index) => item.id}
      />} */}
    
       {productLevel && productLevel.length > 0 ? (
       
          
              <Node
            node={productLevel[0]}
            // onDelete={handleDeleteWrapper}
            // onAddNode={handleAddNode}
            // handleShowModal={handleShowModal}
          />
          
       
          
        ) : (
          loading && (
            <FastImage
          style={{ width: 100, height: 100, alignSelf: 'center', marginTop: '50%' }}
          source={{
            uri: gifUri, // Update the path to your GIF
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
          )
        )}
        </View>
            
        </View>
    );
}

const styles = StyleSheet.create({})

export default ProductCategory;
