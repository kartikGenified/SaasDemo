// import { createSlice } from '@reduxjs/toolkit';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { useNavigation } from '@react-navigation/native';
// // Initial state
// const initialState = {
//   isAuthenticated: false,
//   user: null,
// };
// // const navigation = useNavigation()
// // Slice
// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     loginSuccess(state, action) {
//       state.isAuthenticated = true;
//       state.user = action.payload;
//     },
//     logoutSuccess(state) {
//       console.log("loglout success  detected")
//       const handleLogout = async () => {

//         try {
//           await AsyncStorage.removeItem('loginData')
//           // navigation.reset({ index: '0', routes: [{ name: 'SelectUser' }] })
//         } catch (e) {
//           console.log("error deleting loginData", e)
//         }
    
//         console.log('Done.')
    
//       }
//       handleLogout()
//       state.isAuthenticated = false;
//       state.user = null;
//     },
//   },
// });

// export const { loginSuccess, logoutSuccess } = authSlice.actions;

// export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logoutSuccess(state) {
      console.log("trying to log out from the application")
      const navigation = useNavigation(); // Access navigation object
      
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

export default authSlice.reducer;
