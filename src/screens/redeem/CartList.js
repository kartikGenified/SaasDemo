import React, { useEffect, useState } from 'react';
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
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import { useRedeemGiftsMutation } from '../../apiServices/gifts/RedeemGifts';
import * as Keychain from 'react-native-keychain';
import ErrorModal from '../../components/modals/ErrorModal';
import SuccessModal from '../../components/modals/SuccessModal';
import MessageModal from '../../components/modals/MessageModal';
import { useDispatch } from 'react-redux';
import { additem } from '../../../redux/slices/rewardCartSlice';
import { useTranslation } from 'react-i18next';

const CartList = ({ navigation, route }) => {
  const [cart, setCart] = useState(route.params.cart);
  const [cartId, setCartId] = useState([])

  const [showSubmitButtons, setShowSubmitButtons] = useState(false)
  const [message, setMessage] = useState();
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false)

  const dispatch = useDispatch();

  const {t} =useTranslation();

  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';

  const secondaryThemeColor = useSelector(
    state => state.apptheme.secondaryThemeColor,
  )
    ? useSelector(state => state.apptheme.secondaryThemeColor)
    : '#FFB533';
  const userData = useSelector(state => state.appusersdata.userData);
  const schemeType = route.params?.schemeType
  const schemeID = route.params?.schemeID
  console.log('userdata', route.params.cart);
  const height = Dimensions.get('window').height

  console.log("cart is",route.params.cart)

  const modalClose = () => {
    setError(false);
    setSuccess(false)
  };

  const handleGiftRedemption = async () => {
    if(cart.length===0)
    {
      setError(true)
      setMessage(t("Cart cannot be empty"))
    }
    else{
      let tempID = []
      cart && cart.map((item, index) => {
        tempID.push(((item.gift_id)))
      })
      console.log("tempID", tempID)
      dispatch(additem(cart))
  
     
        navigation.replace("ListAddress", {
          schemeType:schemeType,
          cart: cart,
          schemeID:schemeID
        })
    }
       // const credentials = await Keychain.getGenericPassword();
    // if (credentials) {
    //   console.log(
    //     'Credentials successfully loaded for user ' + credentials.username
    //   );
    //   const token = credentials.username
    //   const data = {
    //     "user_type_id": String(userData.user_type_id),
    //     "user_type": userData.user_type,
    //     "platform_id": 1,
    //     "platform": "mobile",
    //     "gift_ids": tempID,
    //     "approved_by_id": "1",
    //     "app_user_id": String(userData.id),
    //     "remarks": "demo",
    //     "type": "point"
    //   }
    //   const params = {
    //     token: token,
    //     data: data
    //   }
    //   redeemGiftsFunc(params)
    
    // }
  }

  

  const RedeemButton = () => {
    const [showLoading, setShowLoading] = useState(true)
    const [redeem, setRedeem] = useState(false);

    const handleTimeout = () => {
      setTimeout(() => {
        setShowLoading(false)
        setShowSubmitButtons(true)
      }, 2000)
    }
    console.log('Redeem', redeem, showLoading);

    return (
      <TouchableOpacity
        onPress={() => {
          if(cart.length===0)
          {
            setError(true)
            setMessage("Cart cannot be empty")
          }
          else{
            setRedeem(true);

            handleTimeout()
          } 
         
        }}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: ternaryThemeColor,
          height: 50,
          width: '90%',
          borderRadius: 10,
          flexDirection: 'row',

          marginBottom: 20
        }}>
        {!redeem && (
          <>
            <PoppinsTextMedium
      content={t("Redeem")}
              style={{ color: 'white', fontWeight: '700' }}></PoppinsTextMedium>
            <Image
              style={{
                height: 20,
                width: 20,
                resizeMode: 'contain',
                marginLeft: 10,
              }}
              source={require('../../../assets/images/whiteArrowRight.png')}></Image>
          </>
        )}
        {showLoading && redeem && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                height: 8,
                width: 8,
                borderRadius: 4,
                backgroundColor: 'white',
                margin: 4,
              }}></View>
            <View
              style={{
                height: 8,
                width: 8,
                borderRadius: 4,
                backgroundColor: 'white',
                margin: 4,
              }}></View>
            <View
              style={{
                height: 8,
                width: 8,
                borderRadius: 4,
                backgroundColor: 'white',
                margin: 4,
              }}></View>
            <View
              style={{
                height: 8,
                width: 8,
                borderRadius: 4,
                backgroundColor: 'white',
                margin: 2,
              }}></View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const ConfirmAndCancelButton = () => {
    // navigation.navigate("ListAddress",{})
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: 80,
          backgroundColor: '#EEEEEE',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
        onPress={()=>{
          navigation.goBack()
        }}
          style={{
            height: 50,
            width: '46%',
            backgroundColor: '#CD0505',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
          }}>
          <PoppinsTextMedium
            style={{ color: 'white', fontWeight: '700' }}
            content={t("Cancel")}></PoppinsTextMedium>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { handleGiftRedemption() }}
          style={{
            height: 50,
            width: '46%',
            backgroundColor: ternaryThemeColor,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 10,
            borderRadius: 6,
          }}>
          <PoppinsTextMedium
            style={{ color: 'white', fontWeight: '700' }}
            content={t("Confirm")}></PoppinsTextMedium>
        </TouchableOpacity>
      </View>
    );
  };
  const CoinsConsumed = () => {
    const [pointsConsumed, setPointsConsumed] = useState()

    useEffect(() => {
      let temp = 0;
      cart && cart.map((item) => {
        temp = Number(item.points) + temp;
      })
      setPointsConsumed(temp)
    }, [cart])
    return (
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          height: 40,
          borderTopWidth: 1,
          borderColor: "#DDDDDD",

        }}>
 <PoppinsTextMedium style={{ color: '#292626', fontSize: 16, fontWeight: '700' }} content={`${t("Total Points Consumed")} :`}></PoppinsTextMedium>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',

          }}>
          <Image
            style={{ height: 30, width: 30, resizeMode: 'contain' }}
            source={require('../../../assets/images/reward.png')}></Image>
          <PoppinsTextMedium style={{ color: 'black', fontSize: 16, fontWeight: '700' }} content={pointsConsumed}></PoppinsTextMedium>

        </View>
      </View>
    );
  };
  const handleDelete = data => {

    console.log("delete ", data)
    let tempCount = 0;
    const temp = [...cart];
    for (var i = 0; i < temp.length; i++) {
      if (temp[i].id === data.id) {
        tempCount++;
        if (tempCount === 1) {
          temp.splice(i, 1);
        }
      }
    }

    setCart(temp);
    console.log('temp', cart);
  };
  const RewardsBox = props => {
    const image = props.image;
    const points = props.points;
    const product = props.product;
    const category = props.category;
    return (
      <TouchableOpacity
        onPress={() => {
          //   navigation.navigate('CartList');
        }}
        style={{
          height: 120,
          width: '90%',
          alignItems: 'center',
          justifyContent: 'flex-start',
          borderWidth: 0.6,
          borderColor: '#EEEEEE',
          backgroundColor: '#FFFFFF',
          margin: 10,
          marginTop: 10,
          elevation: 4,
          borderRadius: 10
        }}>
        <View
          style={{
            height: '40%',
            width: '100%',
            backgroundColor: secondaryThemeColor,
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'row',
          }}>
          <View
            style={{
              height: 50,
              width: 60,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 0.4,
              borderColor: '#DDDDDD',
              backgroundColor: 'white',
              marginLeft: 20,
              top: 14,
            }}>
            <Image
              style={{ height: 46, width: 56, resizeMode: 'center' }}
              source={{ uri: image }}></Image>
          </View>
          <LinearGradient
            style={{
              height: 30,
              padding: 4,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              borderRadius: 4,
              position: 'absolute',
              right: 60,
            }}
            colors={['#FF9100', '#E4C52B']}>
            <Image
              style={{ height: 20, width: 20, resizeMode: 'contain' }}
              source={require('../../../assets/images/coin.png')}></Image>
            <PoppinsTextMedium
              style={{
                fontSize: 12,
                color: 'white',
                fontWeight: '700',
                marginLeft: 10,
              }}
              content={`${t("Points")} : ${points}`}></PoppinsTextMedium>
          </LinearGradient>
          <TouchableOpacity
            onPress={() => {
              handleDelete(props.data);
            }}
            style={{
              height: 30,
              width: 30,
              backgroundColor: '#CD0505',
              position: 'absolute',
              right: 20,
              borderRadius: 4,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{ height: 28, width: 28, resizeMode: 'contain' }}
              source={require('../../../assets/images/delete.png')}></Image>
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: '60%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 4,
          }}>
          <PoppinsTextMedium
            style={{ color: 'black', fontSize: 11, width: '90%', marginLeft: 4 }}
            content={product}></PoppinsTextMedium>
          <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'center',
              marginTop: 4,
              marginLeft: 4,
            }}>
            <PoppinsTextMedium
              style={{ color: '#919191', fontSize: 11, width: '90%' }}
              content={category}></PoppinsTextMedium>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: ternaryThemeColor,
        height: '100%',


      }}>
      {error && (
        <ErrorModal
          modalClose={modalClose}
          message={message}
          openModal={error}
          warning= {true}
          ></ErrorModal>
      )}
      {success && (
        <MessageModal
          modalClose={modalClose}
          message={message}
          openModal={success}
          
        ></MessageModal>
      )}
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexDirection: 'row',
          width: '100%',

          height: '10%',
          marginLeft: 20,


        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            setCart([])
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
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <PoppinsTextMedium
            content={t("Redeem Points")}
            style={{
              marginLeft: 10,
              fontSize: 16,
              fontWeight: '700',
              color: 'white',
            }}></PoppinsTextMedium>
        </View>
      </View>

      <View
        style={{
          height: '90%',
          width: '100%',
          borderTopRightRadius: 40,
          borderTopLeftRadius: 40,
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: 'white',

        }}>

        {cart && cart.length !== 0 &&
          <FlatList
            data={cart}
            style={{ width: '100%', marginTop: 20, marginBottom: 20 }}
            contentContainerStyle={{
              width: '100%', marginLeft: 10, marginBottom: 20, borderTopRightRadius: 40,
              borderTopLeftRadius: 40,
            }}
            renderItem={({ item, index }) => {

              return (
                <RewardsBox

                  data={item}
                  key={index}
                  product={item.name}
                  category={item.catalogue_name}
                  points={item.points}
                  image={item.images[0]}></RewardsBox>
              );
            }}
            keyExtractor={(item, index) => index}
          />
        }
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',

            width: '100%',

          }}>
          {!showSubmitButtons && <RedeemButton></RedeemButton>}
          {showSubmitButtons && <CoinsConsumed></CoinsConsumed>}
          {showSubmitButtons && <ConfirmAndCancelButton></ConfirmAndCancelButton>}
        </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({});

export default CartList;