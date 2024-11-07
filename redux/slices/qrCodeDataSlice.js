import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  qrData:{},
  qrIdList : []
  
}

export const qrDataSlice = createSlice({
  name: 'qrData',
  initialState,
  reducers: {
    
    
    setQrData: (state, action) => {
        state.qrData = action.payload
      },

    setQrIdList : (state, action) =>{
      state.qrIdList = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setQrData, setQrIdList} = qrDataSlice.actions

export default qrDataSlice.reducer