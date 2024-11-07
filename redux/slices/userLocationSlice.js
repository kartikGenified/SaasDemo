import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  location:{},
  locationEnabled:false,
  locationPermissionStatus:false
  
}

export const userLocationSlice = createSlice({
  name: 'userLocation',
  initialState,
  reducers: {
    
    setLocation: (state, action) => {
        console.log("dispatched location is",action.payload)
      state.location = action.payload
    },
    setLocationEnabled: (state, action)=>{
      state.locationEnabled = action.payload
    },
    setLocationPermissionStatus:(state, action)=>{
      state.locationPermissionStatus = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setLocation, setLocationEnabled, setLocationPermissionStatus} = userLocationSlice.actions

export default userLocationSlice.reducer