import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '../src/apiServices/baseApi';
import { setupListeners } from '@reduxjs/toolkit/query';
import internetMiddleware from './middleware/internetMiddleware';
import appUserSlice from './slices/appUserSlice';
import appThemeSlice from './slices/appThemeSlice';
import appUserDataSlice from './slices/appUserDataSlice';
import appWorkflowSlice from './slices/appWorkflowSlice';
import formSlice from './slices/formSlice';
import qrCodeDataSlice from './slices/qrCodeDataSlice';
import getProductSlice from './slices/getProductSlice';
import userLocationSlice from './slices/userLocationSlice';
import rewardCartSlice from './slices/rewardCartSlice';
import userKycStatusSlice from './slices/userKycStatusSlice';
import pointSharingSlice from './slices/pointSharingSlice';
import redemptionAddressSlice from './slices/redemptionAddressSlice';
import redemptionDataSlice from './slices/redemptionDataSlice';
import fcmTokenSlice from './slices/fcmTokenSlice';
import userMappingSlice from './slices/userMappingSlice';
import internetSlice from './slices/internetSlice';
import scanningSlice from './slices/scanningSlice';
import pointWalletSlice from './slices/pointWalletSlice';
import dashboardDataSlice from './slices/dashboardDataSlice';
import authSlice from './slices/authSlice';
import termsPolicySlice from './slices/termsPolicySlice';
import drawerDataSlice from './slices/drawerDataSlice';
import cameraStatusSlice from './slices/cameraStatusSlice';
import appLanguageSlice from './slices/appLanguageSlice';
import walkThroughSlice from './slices/walkThroughSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    appusers: appUserSlice,
    apptheme: appThemeSlice,
    appusersdata: appUserDataSlice,
    appWorkflow: appWorkflowSlice,
    form: formSlice,
    qrData: qrCodeDataSlice,
    productData: getProductSlice,
    userLocation: userLocationSlice,
    cart: rewardCartSlice,
    kycDataSlice: userKycStatusSlice,
    pointSharing: pointSharingSlice,
    address: redemptionAddressSlice,
    redemptionData: redemptionDataSlice,
    fcmToken: fcmTokenSlice,
    userMapping: userMappingSlice,
    internet: internetSlice,
    scanning : scanningSlice,
    pointWallet:pointWalletSlice,
    walkThrough:walkThroughSlice,
    cameraStatus:cameraStatusSlice,
    dashboardData:dashboardDataSlice,
    auth:authSlice,
    termsPolicy:termsPolicySlice,
    drawerData: drawerDataSlice,
    cameraStatus:cameraStatusSlice,
    appLanguage:appLanguageSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, internetMiddleware), // Include networkMiddleware
});

setupListeners(store.dispatch);

export default store;
