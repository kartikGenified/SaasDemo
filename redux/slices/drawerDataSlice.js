import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  drawerData:{},
 
  
}

export const drawerDataSlice = createSlice({
  name: 'drawerData',
  initialState,
  reducers: {
    
    
    setDrawerData: (state, action) => {
        state.drawerData = action.payload
      },
   
  },
})

// Action creators are generated for each case reducer function
export const { setDrawerData} = drawerDataSlice.actions

export default drawerDataSlice.reducer