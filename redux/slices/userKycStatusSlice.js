import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  kycData:{},
  kycCompleted:false
  
}

export const userKycStatusSlice = createSlice({
  name: 'kycDataSlice',
  initialState,
  reducers: {
    
    
    setKycData: (state, action) => {
        state.kycData = action.payload
      },
      setKycCompleted: (state, action) => {
        state.kycCompleted = true
      },
  },
})

// Action creators are generated for each case reducer function
export const { setKycData,setKycCompleted} = userKycStatusSlice.actions

export default userKycStatusSlice.reducer