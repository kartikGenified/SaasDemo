import React,{useEffect, useId, useState} from 'react';
import {View, StyleSheet,TouchableOpacity,Image,FlatList,ScrollView,Dimensions, Alert} from 'react-native';
import PoppinsText from '../../components/electrons/customFonts/PoppinsText';
import PoppinsTextMedium from '../../components/electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';
import { useAddBankDetailsMutation } from '../../apiServices/bankAccount/AddBankAccount';
import * as Keychain from 'react-native-keychain';
import { useFetchUserPointsMutation } from '../../apiServices/workflow/rewards/GetPointsApi';
import moment from 'moment';
import RectangularUnderlinedDropDown from '../../components/atoms/dropdown/RectangularUnderlinedDropDown';
import RectanglarUnderlinedTextInput from '../../components/atoms/input/RectanglarUnderlinedTextInput';
import ShowLoadingButton from '../../components/atoms/buttons/ShowLoadingButton';
import MessageModal from '../../components/modals/MessageModal';
import { useIsFocused } from '@react-navigation/native';
import ErrorModal from '../../components/modals/ErrorModal';
import { useTranslation } from 'react-i18next';

const AddBankDetails = ({navigation}) => {
    const [message, setMessage] = useState();
    const [success, setSuccess] = useState(false);
    const [hideButton, setHideButton] = useState(false)
  const [error, setError] = useState(false);

  const {t} = useTranslation()
  const focused = useIsFocused()
    const ternaryThemeColor = useSelector(
        state => state.apptheme.ternaryThemeColor,
      )
        ? useSelector(state => state.apptheme.ternaryThemeColor)
        : 'grey';

    const [addBankDetailsFunc,{
        data:addBankDetailsData,
        error:addBankDetailsError,
        isError:addBankDetailsIsError,
        isLoading:addBankDetailsIsLoading
    }] = useAddBankDetailsMutation()    

    useEffect(()=>{
        setHideButton(false)
      },[focused])
      
    useEffect(()=>{
        if(addBankDetailsData){
            console.log("addBankDetailsData",addBankDetailsData)
            if(addBankDetailsData.message==="Bank Account Created")
            {
                setHideButton(false)
                setSuccess(true)
                setMessage("Account Added Successfully")
                setTimeout(() => {
                    setSuccess(false)
                    navigation.navigate("BankAccounts",{refresh:true})
                }, 2000);
            }
        }
        else if(addBankDetailsError)
        {
            console.log("addBankDetailsError",addBankDetailsError)
            setError(true)
            setHideButton(false)
            setMessage(addBankDetailsError.data.message)
            setTimeout(() => {
                setError(false)
                navigation.navigate("BankAccounts",{refresh:true})
            }, 2000);
        }
    },[addBankDetailsData,addBankDetailsError])

    const bankNames=["State Bank Of India","Punjab National Bank","IndusInd Bank","Canara Bank","Axis bank","HDFC Bank"]
    const accountType = [t("Current"),t("Savings")]
    const height = Dimensions.get('window').height
    var selectedBankName = ''
    var selectedIfscCode = ''
    var selectedAccountNumber = ''
    var confirmAccountNumber = ''
    var bankAccountType = ''
    var selectedBeneficiaryName = ''
    var remarks = ''
    var amount = ''



    const getBankName=(data)=>{
        console.log(data)
        selectedBankName=data
    }
    const getBankAccountType=(data)=>{
        console.log(data)
        bankAccountType=data
    }
    const getIfscCode=(data)=>{
        console.log(data)
        selectedIfscCode=data
    }
    const getAccountNumber=(data)=>{
        console.log(data)
        selectedAccountNumber=data
    }
    const getBeneficiaryName=(data)=>{
        console.log(data)
        selectedBeneficiaryName=data
    }
    const getConfirmAccountNumber=(data)=>{
        console.log(data)
        confirmAccountNumber=data
    }
    const getAmount=(data)=>{
        console.log(data)
        amount=data
    }
    const getRemarks=(data)=>{
        console.log(data)
        remarks=data
    }
    const modalClose = () => {
        setError(false);
       
      };
    const submitData=async()=>{
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log(
            'Credentials successfully loaded for user ' + credentials.username,
          );
          const token = credentials.username;
          if(selectedAccountNumber==confirmAccountNumber)
          {
            const data = {
                "bank" : selectedBankName,
                "account_no": selectedAccountNumber,
                "account_holder_name":selectedBeneficiaryName,
                "ifsc": selectedIfscCode,
                "transfer_mode":"banktransfer"
            }
            console.log(data)
            const params = {token:token,
            data:data}
            console.log(params)
            addBankDetailsFunc(params)
            setHideButton(true)
          }
          else{
            alert("Account number and selected account number can't be different")
          }
          
            
        }
        
    }

    const BankDetails=()=>{
        return(
            <View style={{minHeight:180,width:'90%',backgroundColor:'white',borderRadius:20,marginTop:20,marginBottom:20,alignItems:'center',justifyContent:'center'}}>
                <PoppinsTextMedium style={{color:"black",fontWeight:'700'}} content={t("Bank Details")}></PoppinsTextMedium>
                <RectangularUnderlinedDropDown header={t("Select Bank")} data={bankNames} handleData={getBankName}></RectangularUnderlinedDropDown>
                <RectanglarUnderlinedTextInput label ={t("IFSC Code")} handleData={getIfscCode} placeHolder="SBIN0010650" title = {t("IFSC Code")}></RectanglarUnderlinedTextInput>
            </View>
        )
    }
    const AccountDetails=()=>{
        return(
            <View style={{minHeight:320,width:'90%',backgroundColor:'white',borderRadius:20,marginTop:20,marginBottom:20,alignItems:'center',justifyContent:'flex-start'}}>
                <PoppinsTextMedium style={{color:"black",fontWeight:'700',marginTop:20,paddingBottom:20}} content={t("Account Details")}></PoppinsTextMedium>
                <RectanglarUnderlinedTextInput label ={t("Account Number")} handleData={getAccountNumber} placeHolder={t("Enter Account Number")} ></RectanglarUnderlinedTextInput>
                <RectanglarUnderlinedTextInput label ={t("Confirm Account Number")} handleData={getConfirmAccountNumber} placeHolder={t("Confirm Account Number")} ></RectanglarUnderlinedTextInput>
                <RectanglarUnderlinedTextInput label = {t("Beneficiary Name")} handleData={getBeneficiaryName} placeHolder={t("Enter Beneficiary Name")} ></RectanglarUnderlinedTextInput>
                <RectangularUnderlinedDropDown label ={t("Account Type")} header={t("Select Account Type")} data={accountType} handleData={getBankAccountType}></RectangularUnderlinedDropDown>

            </View>
        )
    }
    const TransferDetails=()=>{
        return(
            <View style={{minHeight:140,width:'90%',backgroundColor:'white',borderRadius:20,marginTop:20,marginBottom:20,alignItems:'center',justifyContent:'flex-start',paddingBottom:20}}>
                <PoppinsTextMedium style={{color:"black",fontWeight:'700',marginTop:20}} content="Transfer Details"></PoppinsTextMedium>
                <RectanglarUnderlinedTextInput handleData={getAmount} placeHolder="Enter Amount" ></RectanglarUnderlinedTextInput>
                <RectanglarUnderlinedTextInput handleData={getRemarks} placeHolder="Remarks" ></RectanglarUnderlinedTextInput>
               
            </View>
        )
    }
    return (
        <View style={{alignItems:"center",justifyContent:"center",width:'100%',backgroundColor:ternaryThemeColor,height:'100%'}}>
            {error && (
            <ErrorModal
              modalClose={modalClose}
              message={message}
              openModal={error}></ErrorModal>
          )}
           {success && (
            <MessageModal
              modalClose={modalClose}
              title="Success"
              message={message}
              navigateTo="BankAccounts"
              openModal={success}></MessageModal>
          )}
            <ScrollView style={{width:'100%',height:'100%'}}>
            <View style={{alignItems:"center",justifyContent:"flex-start",flexDirection:"row",width:'100%',marginTop:20,height:30}}>
                <TouchableOpacity onPress={()=>{
                    navigation.goBack()
                }}>
            <Image style={{height:24,width:24,resizeMode:'contain',marginLeft:20}} source={require('../../../assets/images/blackBack.png')}></Image>

                </TouchableOpacity>
            <PoppinsTextMedium content ={t("Add Bank Details")} style={{marginLeft:10,fontSize:16,fontWeight:'700',color:'white'}}></PoppinsTextMedium>
            
            </View>
            
            <View style={{alignItems:"center",justifyContent:'center',borderTopRightRadius:40,borderTopLeftRadius:40,backgroundColor:"#F6F6F6",width:'100%',marginTop:40}}>
                <BankDetails></BankDetails>
                <AccountDetails></AccountDetails>
                 {/* <TransferDetails></TransferDetails> */}
               {!hideButton && <ShowLoadingButton handleData={submitData} title={t("proceed")}></ShowLoadingButton>}
            </View>
            </ScrollView>
            
        </View>
    );
}

const styles = StyleSheet.create({})

export default AddBankDetails;
