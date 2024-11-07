import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  warrantyForm:{},
  warrantyFormId:''
}

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    
    
    setWarrantyForm: (state, action) => {
        state.warrantyForm = action.payload
      },
      setWarrantyFormId: (state, action) => {
        state.warrantyFormId = action.payload
      },
  },
})

// Action creators are generated for each case reducer function
export const { setWarrantyForm, setWarrantyFormId} = formSlice.actions

export default formSlice.reducer