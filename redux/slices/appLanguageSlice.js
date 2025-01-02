import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  languages:[],
  selectedLanguage:''
  
}

export const appLanguageSlice = createSlice({
  name: 'appLanguage',
  initialState,
  reducers: {
    
    setLanguage: (state, action) => {
      state.languages = action.payload
    },
    setSelectedLanguage: (state,action) =>{
        state.selectedLanguage = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const {setLanguage, setSelectedLanguage} = appLanguageSlice.actions

export default appLanguageSlice.reducer