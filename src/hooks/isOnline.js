import { useState,useEffect } from "react";
import { addEventListener } from "@react-native-community/netinfo";

 export const isOnline=()=> {
    
    // Subscribe
    const unsubscribe = addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    if(state.isConnected===false)
    {
       return false
    }
    else
    {
        return true
    }

   
    });
    
   return unsubscribe();
}