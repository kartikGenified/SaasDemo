import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cart:{},
  giftRedemptionFrom:''
}

export const rewardCartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    
    additem:(state,action)=>{
        state.cart= action.payload
    },
    addGiftRedemptionFrom:(state,action) =>{
      state.giftRedemptionFrom = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { additem, addGiftRedemptionFrom } = rewardCartSlice.actions

export default rewardCartSlice.reducer