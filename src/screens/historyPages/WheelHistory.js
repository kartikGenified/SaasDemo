import React,{useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import { useGetAllWheelHistoryMutation } from '../../apiServices/workflow/rewards/GetWheelApi';
import * as Keychain from 'react-native-keychain';


const WheelHistory = () => {

    const [getWheelHistoryFunc,{
        data:getWheelHistoryData,
        error:getWheelHistoryError,
        isLoading:getWheelHistoryIsLoading,
        isError:getWheelHistoryIsError
    }] = useGetAllWheelHistoryMutation()


    useEffect(()=>{
        const getData=async()=>{
            const credentials = await Keychain.getGenericPassword();
            if (credentials) {
              console.log(
                'Credentials successfully loaded for user ' + credentials.username
              );
              const token = credentials.username
            getWheelHistoryFunc({token:token})

        }
    }
    getData()
    },[])
    useEffect(()=>{
        if(getWheelHistoryData){
            console.log("getWheelHistoryData",getWheelHistoryData)
        }
        else if(getWheelHistoryError)
        {
            console.log("getWheelHistoryError",getWheelHistoryError)
        }
    
    },[getWheelHistoryData,getWheelHistoryError])


    return (
        <View>
            
        </View>
    );
}

const styles = StyleSheet.create({})

export default WheelHistory;
