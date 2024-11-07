import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  walletBalance:0,
  pointBalance:0
}

export const pointWalletSlice = createSlice({
  name: 'pointWallet',
  initialState,
  reducers: {
    
    setWalletBalance: (state, action) => {
      state.walletBalance = action.payload
    },
    setPointBalance:(state,action) =>{
        state.pointBalance = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const {setWalletBalance,setPointBalance } = pointWalletSlice.actions

export default pointWalletSlice.reducer