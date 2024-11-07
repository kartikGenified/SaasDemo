import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  canMapUsers:[]
  
}

export const userMappingSlice = createSlice({
  name: 'userMapping',
  initialState,
  reducers: {
    
    setCanMapUsers: (state, action) => {
        console.log("dispatched location is",action.payload)
      state.canMapUsers = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setCanMapUsers} = userMappingSlice.actions

export default userMappingSlice.reducer