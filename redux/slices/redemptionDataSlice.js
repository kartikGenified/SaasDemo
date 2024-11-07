import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  pointConversion:'',
  cashConversion:'',
  redemptionFrom :''
}

export const redemptionDataSlice = createSlice({
  name: 'redemptionData',
  initialState,
  reducers: {
    
    setPointConversionF:(state,action)=>{
        state.pointConversion= action.payload
    },
    setCashConversionF:(state,action)=>{
        state.cashConversion = action.payload
    },
    setRedemptionFrom:(state,action)=>{
      state.redemptionFrom = action.payload
  }
  },
})

// Action creators are generated for each case reducer function
export const { setCashConversionF,setPointConversionF,setRedemptionFrom } = redemptionDataSlice.actions

export default redemptionDataSlice.reducer