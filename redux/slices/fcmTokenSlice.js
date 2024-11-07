import { createSlice } from '@reduxjs/toolkit'

const initialState = {
 fcmToken:""
  
}

export const fcmTokenSlice = createSlice({
  name: 'fcmToken',
  initialState,
  reducers: {
    
    
    setFcmToken: (state, action) => {
        state.fcmToken = action.payload
      },
  },
})

// Action creators are generated for each case reducer function
export const { setFcmToken} = fcmTokenSlice.actions

export default fcmTokenSlice.reducer