import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  productData:{},
  productMrp:null,
  scanningType:null
}

export const productDataSlice = createSlice({
  name: 'productData',
  initialState,
  reducers: {
    
    
    setProductData: (state, action) => {
        state.productData = action.payload
      },
    setProductMrp: (state, action) => {
        state.productMrp = action.payload
      },
    setScanningType : (state,action)=>{
      state.scanningType = action.payload
    }

  },
})

// Action creators are generated for each case reducer function
export const { setProductData,setProductMrp,setScanningType} = productDataSlice.actions

export default productDataSlice.reducer