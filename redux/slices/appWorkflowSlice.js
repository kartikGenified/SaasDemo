import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  program:[],
  workflow:'',
  leftProgram:[],
  isGenuinityOnly:false
  
}

export const appWorkflowSlice = createSlice({
  name: 'appWorkflow',
  initialState,
  reducers: {
    
    setProgram: (state, action) => {
      state.program = action.payload
    },
    setWorkflow: (state, action) => {
        state.workflow = action.payload
      },
    setleftProgram:(state, action) =>{
        state.leftProgram = action.payload
    },
    setIsGenuinityOnly:(state)=>{
      state.isGenuinityOnly =true
    }
  },
})

// Action creators are generated for each case reducer function
export const { setProgram,setWorkflow,setleftProgram,setIsGenuinityOnly} = appWorkflowSlice.actions

export default appWorkflowSlice.reducer