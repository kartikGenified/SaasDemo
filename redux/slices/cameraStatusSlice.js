import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cameraPermissionStatus:false,
  cameraStatus:false

  
}

export const cameraStatusSlice = createSlice({
  name: 'cameraStatus',
  initialState,
  reducers: {
    
    setCameraPermissionStatus: (state, action) => {
      state.cameraPermissionStatus = action.payload
    },
    setCameraStatus:(state, action) =>{
        state.cameraStatus = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const {setCameraPermissionStatus, setCameraStatus } = cameraStatusSlice.actions

export default cameraStatusSlice.reducer