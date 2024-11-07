import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  stepId:0,
  isAlreadyWalkedThrough:false,
}

export const walkThroughSlice = createSlice({
  name: 'walkThrough',
  initialState,
  reducers: {
    setStepId: (state, action) => {
      console.log("stepId",action.payload)
      state.stepId = action.payload
    },
    setAlreadyWalkedThrough: (state, action) => {
        console.log("isAlreadyWalkedThrough",action.payload)
        state.isAlreadyWalkedThrough = action.payload
      }
  },
})

// Action creators are generated for each case reducer function
export const {setStepId,setAlreadyWalkedThrough} = walkThroughSlice.actions

export default walkThroughSlice.reducer