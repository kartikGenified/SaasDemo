import { createSlice } from '@reduxjs/toolkit'

const initialState = {
 terms:"",
 policy:""
  
}

export const termsPolicySlice = createSlice({
  name: 'termsPolicy',
  initialState,
  reducers: {
    
    
    setTerms: (state, action) => {
        state.terms = action.payload
      },
      setPolicy:(state,action)=>{
        state.policy = action.payload
      }
  },
})

// Action creators are generated for each case reducer function
export const { setTerms,setPolicy} = termsPolicySlice.actions

export default termsPolicySlice.reducer