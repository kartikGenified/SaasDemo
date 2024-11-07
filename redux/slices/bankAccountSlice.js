import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedAccount:{},

  
}

export const bankAccountSlice = createSlice({
  name: 'bankAccount',
  initialState,
  reducers: {
    
    setSelectedAccount: (state, action) => {
      state.selectedAccount = action.payload
    },
    
  },
})

// Action creators are generated for each case reducer function
export const {setSelectedAccount } = bankAccountSlice.actions

export default bankAccountSlice.reducer