import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
const initialState = {
  primaryThemeColor:'',
  secondaryThemeColor:'',
  ternaryThemeColor:'',
  buttonThemeColor:'',
  icon:'',
  iconDrawer:'',
  otpLogin:[],
  passwordLogin:[],
  colorShades:{},
  kycOptions:{},
  isOnlineVerification:false,
  socials:{},
  website:'',
  customerSupportMobile:'',
  customerSupportMail:'',
  extraFeatures:{}


}




export const appThemeSlice = createSlice({
  name: 'apptheme',
  initialState,
  reducers: {
    
    setPrimaryThemeColor: (state, action) => {
      state.primaryThemeColor = action.payload
    },
    setSecondaryThemeColor:(state, action) =>{
        state.secondaryThemeColor = action.payload
    },
    setTernaryThemeColor:(state, action)=>{
      state.ternaryThemeColor = action.payload
  },
    setIcon:(state, action)=>{
        state.icon = action.payload
    },
    setIconDrawer:(state, action)=>{
      state.icon = action.payload
  },
  setOptLogin:(state, action)=>{
    state.otpLogin = action.payload
  },
  setPasswordLogin:(state, action)=>{
    state.passwordLogin = action.payload
  },
  setButtonThemeColor:(state,action)=>{
    state.buttonThemeColor = action.payload
  },
  setColorShades:(state, action)=>{
    state.colorShades = action.payload
  },
  setKycOptions:(state,action)=>{
    state.kycOptions = action.payload
  },
  setIsOnlineVeriification:(state,action)=>{
    state.isOnlineVerification = true
  },
  setSocials:(state,action)=>{
    state.socials = action.payload
  },
  setWebsite:(state, action)=>{
    state.website = action.payload
  },
  setCustomerSupportMobile:(state,action)=>{
    state.customerSupportMobile = action.payload
  },
  setCustomerSupportMail:(state,action)=>{
    state.customerSupportMail = action.payload
  },
  setExtraFeatures:(state,action)=>{
    state.extraFeatures = action.payload
  }
  
  },
  
})

// Action creators are generated for each case reducer function
export const { setPrimaryThemeColor, setSecondaryThemeColor, setTernaryThemeColor ,setIcon,setIconDrawer,setOptLogin,setPasswordLogin,setButtonThemeColor,setColorShades, setKycOptions,setIsOnlineVeriification, setSocials, setWebsite, setCustomerSupportMail, setCustomerSupportMobile,setExtraFeatures} = appThemeSlice.actions

export default appThemeSlice.reducer