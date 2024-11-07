// internetSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const internetSlice = createSlice({
  name: 'internet',
  initialState: {
    isConnected: true,
    isSlow: false, // Assuming initially connected
  },
  reducers: {
    setInternetConnection: (state, action) => {
      state.isConnected = action.payload;
    },
    setSlowNetwork: (state, action) => {
      state.isSlow = action.payload;
    },
  },
});

export const { setInternetConnection, setSlowNetwork } = internetSlice.actions;

export default internetSlice.reducer;
