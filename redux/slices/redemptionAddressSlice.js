import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  address:{}
}

export const redemptionAddressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    
    addAddress:(state,action)=>{
        state.address= action.payload
    },
    
  },
})

// Action creators are generated for each case reducer function
export const { addAddress } = redemptionAddressSlice.actions

export default redemptionAddressSlice.reducer