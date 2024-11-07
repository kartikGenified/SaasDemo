import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  dashboardData:{},
  banner:[]
  
}

export const dashboardDataSlice = createSlice({
  name: 'dashboardData',
  initialState,
  reducers: {
    
    
    setDashboardData: (state, action) => {
        state.dashboardData = action.payload
      },
    setBannerData: (state, action) => {
        state.banner = action.payload
      },
  },
})

// Action creators are generated for each case reducer function
export const { setDashboardData,setBannerData} = dashboardDataSlice.actions

export default dashboardDataSlice.reducer