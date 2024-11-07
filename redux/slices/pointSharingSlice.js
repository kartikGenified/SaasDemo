import { createSlice } from '@reduxjs/toolkit'
import { act } from 'react-test-renderer'

const initialState={
pointSharing:{},
percentagePoints:0,
shouldSharePoints:false,

}

export const pointSharingSlice = createSlice({
    name:'pointSharing',
    initialState,
    reducers : {
        setPointSharing : (state, action)=>{
            state.pointSharing = action.payload
        },
        setPercentagePoints:(state,action)=>{
            state.percentagePoints = action.payload
        },
        setShouldSharePoints:(state,action)=>{
            state.shouldSharePoints = true
        }
    }
})


export const {setPointSharing,setPercentagePoints,setShouldSharePoints} = pointSharingSlice.actions

export default pointSharingSlice.reducer