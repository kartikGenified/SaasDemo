import { createSlice } from '@reduxjs/toolkit'

const initialState = {
 firstScan:false,
 registrationBonus:0
  
}

export const scanningSlice = createSlice({
  name: 'scanning',
  initialState,
  reducers: {
    
    
    setFirstScan: (state, action) => {
        state.firstScan = action.payload
      },
      setRegistrationBonusFirstScan:(state,action)=>{
        state.registrationBonus = action.payload
      }
  },
})

// Action creators are generated for each case reducer function
export const { setFirstScan,setRegistrationBonusFirstScan} = scanningSlice.actions

export default scanningSlice.reducer