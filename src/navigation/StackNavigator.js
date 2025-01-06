import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Introduction from '../screens/common/Introduction';
import SelectLanguage from '../screens/common/SelectLanguage';
import SelectUser from '../screens/common/SelectUser';
import OtpLogin from '../screens/login/OtpLogin';
import PasswordLogin from '../screens/login/PasswordLogin';
import VerifyOtp from '../screens/login/VerifyOtp';
import RegisterUser from '../screens/register/RegisterUser';
import Dashboard from '../screens/dashboard/Dashboard';
import DrawerNavigator from './DrawerNavigator';
import QrCodeScanner from '../screens/camera/QrCodeScanner';
import CongratulateOnScan from '../screens/Rewards/CongratulateOnScan';
import ActivateWarranty from '../screens/waranty/ActivateWarranty';
import Genuinity from '../screens/genuinity/Genuinity';
import GenuineProduct from '../screens/genuinity/GenuineProduct';
import Notification from '../screens/notification/Notification';
import GenuinityScratch from '../screens/genuinity/GenuinityScratch';
import Profile from '../screens/profile/Profile';
import EditProfile from '../screens/profile/EditProfile';
import Passbook from '../screens/passbook/Passbook';
import ScannedHistory from '../screens/historyPages/ScannedHistory';
import PointHistory from '../screens/historyPages/PointHistory';
import RedeemedHistory from '../screens/historyPages/RedeemedHistory';
import CashbackHistory from '../screens/historyPages/CashbackHistory';
import CouponHistory from '../screens/historyPages/CouponHistory';
import ScannedDetails from '../screens/historyPages/ScannedDetails';
import RedeemedDetails from '../screens/historyPages/RedeemedDetails';
import CashbackDetails from '../screens/historyPages/CashbackDetails';
import CouponDetails from '../screens/historyPages/CouponDetails';
import WheelHistory from '../screens/historyPages/WheelHistory';
import WarrantyHistory from '../screens/historyPages/WarrantyHistory';
import WarrantyDetails from '../screens/historyPages/WarrantyDetails';
import RedeemRewardHistory from '../screens/historyPages/RedeemRewardHistory';
import AddBankAccountAndUpi from '../screens/payments/AddBankAccountAndUpi';
import RedeemGifts from '../screens/redeem/RedeemGifts';
import CartList from '../screens/redeem/CartList';
import Verification from '../screens/verification/Verification';
import RedeemCashback from '../screens/redeem/RedeemCashback';
import BasicInfo from '../screens/register/BasicInfo';
import AddBankDetails from '../screens/payments/AddBankDetails';
import AddUpi from '../screens/payments/AddUpi';
import BankAccounts from '../screens/payments/BankAccounts';
import ReferAndEarn from '../screens/ReferAndEarn/ReferAndEarn';
import MyBonus from '../screens/ReferAndEarn/MyBonus';
import HelpAndSupport from '../screens/helpAndSupport/HelpAndSupport';
import ProductCatalogue from '../screens/product catalogue/ProductCatalogue';
import PdfComponent from '../screens/pdf/PdfComponent';
import VideoPage from '../screens/video/VideoPage';
import VideoGallery from '../screens/video/VideoGallery';
import ImageGallery from '../screens/image/ImageGallery';
import ReportAndIssue from '../screens/reportAnIssue/ReportAndIssue';
import Feedback from '../screens/feedback/Feedback';
import Scheme from '../screens/scheme/Scheme';
import WheelList from '../screens/wheel/WheelList';
import SpinWheel from '../screens/wheel/SpinWheel';
import DataNotFound from '../screens/data not found/DataNotFound';
import Splash from '../screens/common/Splash';
import ScanAndRedirectToWarranty from '../screens/waranty/ScanAndRedirectToWarranty';
import ScanAndRedirectToGenuinity from '../screens/genuinity/ScanAndRedirectToGenuinity';
import GiftCatalogue from '../screens/giftCatalogue/GiftCatalogue';
import GenunityDetails from '../screens/genuinity/GenunityDetails';
import SharedPointsHistory from '../screens/historyPages/SharedPointsHistory';
import AddUser from '../screens/addUser/AddUser';
import WarrantyClaimDetails from '../screens/waranty/WarrantyClaimDetails';
import ListUsers from '../screens/addUser/ListUsers';
import ListAddress from '../screens/address/ListAddress';
import AddAddress from '../screens/address/AddAddress';
import ProductCategory from '../screens/productCategories/ProductCategory';
import WhatsNew from '../screens/community/WhatsNew';
import InstallationVideo from '../screens/knowledgeHub/InstallationVideo';
import TierDetails from '../screens/community/TierDetails';
import OtpVerification from '../screens/verification/OtpVerification';
import FAQ from '../screens/myProgram/FAQ';
import Tutorial from '../screens/myProgram/Tutorial';
import AddedUserScanList from '../screens/addUser/AddedUserScanList';
import RequestAppointment from '../screens/requestAppointment/RequestAppointment';
import SupportQueries from '../screens/helpAndSupport/SupportQueries';
import QueryList from '../screens/queryList/QueryList';
import PreviousTransactionHistory from '../screens/historyPages/PreviousTransactionHistory';
import RedeemCoupons from '../screens/redeem/RedeemCoupons';
import CouponCartList from '../screens/redeem/CouponCartList';
import EnableLocationScreen from '../screens/location/EnableLocationScreen';
import EnableCameraScreen from '../screens/camera/EnableCameraScreen';
import SchemeItems from '../screens/scheme/SchemeItems';
import ForgetPassword from '../screens/login/ForgotPassword';
import MpinSetupScreen from '../screens/mpin/MpinSetupScreen';
import MpinValidationScreen from '../screens/mpin/MpinValidationScreen';
import ForgotMpin from '../screens/mpin/ForgotMpin';

const Stack = createNativeStackNavigator()

const StackNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                
            <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="Splash" component={Splash}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="WhatsNew" component={WhatsNew}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="CouponCartList" component={CouponCartList}></Stack.Screen>
                
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="RedeemCoupons" component={RedeemCoupons}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="EnableCameraScreen" component={EnableCameraScreen}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="PreviousTransactionHistory" component={PreviousTransactionHistory}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="SupportQueries" component={SupportQueries}></Stack.Screen>
                       <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="ForgetPassword" component={ForgetPassword}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="QueryList" component={QueryList}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="AddedUserScanList" component={AddedUserScanList}></Stack.Screen>
                
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="FAQ" component={FAQ}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="RequestAppointment" component={RequestAppointment}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="Tutorial" component={Tutorial}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="TierDetails" component={TierDetails}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="OtpVerification" component={OtpVerification}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="InstallationVideo" component={InstallationVideo}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="ProductCategory" component={ProductCategory}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="EnableLocationScreen" component={EnableLocationScreen}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="AddUser" component={AddUser}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="AddAddress" component={AddAddress}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="ListAddress" component={ListAddress}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="ListUsers" component={ListUsers}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="GenunityDetails" component={GenunityDetails}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="WarrantyClaimDetails" component={WarrantyClaimDetails}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="SharedPointsHistory" component={SharedPointsHistory}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="GiftCatalogue" component={GiftCatalogue}></Stack.Screen>
                    <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="MpinSetupScreen" component={MpinSetupScreen}></Stack.Screen>
                                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="MpinValidationScreen" component={MpinValidationScreen}></Stack.Screen>
                                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="ForgotMpin" component={ForgotMpin}></Stack.Screen>
                
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="ScanAndRedirectToGenuinity" component={ScanAndRedirectToGenuinity}></Stack.Screen>
            <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="ScanAndRedirectToWarranty" component={ScanAndRedirectToWarranty}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="Introduction" component={Introduction}></Stack.Screen>

                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="Feedback" component={Feedback}></Stack.Screen>

                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="Profile" component={Profile}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="SpinWheel" component={SpinWheel}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="WheelList" component={WheelList}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="DataNotFound" component={DataNotFound}></Stack.Screen>
                {/* <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="Feedback" component={Feedback}></Stack.Screen> */}
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="BasicInfo" component={BasicInfo}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="Scheme" component={Scheme}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="ImageGallery" component={ImageGallery}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="ReportAndIssue" component={ReportAndIssue}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="VideoPage" component={VideoPage}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="VideoGallery" component={VideoGallery}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="PdfComponent" component={PdfComponent}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="ProductCatalogue" component={ProductCatalogue}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="HelpAndSupport" component={HelpAndSupport}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="MyBonus" component={MyBonus}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="ReferAndEarn" component={ReferAndEarn}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="BankAccounts" component={BankAccounts}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="EditProfile" component={EditProfile}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="AddUpi" component={AddUpi}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="AddBankDetails" component={AddBankDetails}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="RedeemedDetails" component={RedeemedDetails}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="RedeemCashback" component={RedeemCashback}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="Verification" component={Verification}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="CartList" component={CartList}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="RedeemGifts" component={RedeemGifts}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="AddBankAccountAndUpi" component={AddBankAccountAndUpi}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="RedeemRewardHistory" component={RedeemRewardHistory}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="WarrantyDetails" component={WarrantyDetails}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="WarrantyHistory" component={WarrantyHistory}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="RedeemedHistory" component={RedeemedHistory}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="WheelHistory" component={WheelHistory}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="CouponDetails" component={CouponDetails}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="CashbackDetails" component={CashbackDetails}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="ScannedDetails" component={ScannedDetails}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="CouponHistory" component={CouponHistory}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="CashbackHistory" component={CashbackHistory}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="PointHistory" component={PointHistory}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="ScannedHistory" component={ScannedHistory}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="Passbook" component={Passbook}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="GenuinityScratch" component={GenuinityScratch}></Stack.Screen>

                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="ActivateWarranty" component={ActivateWarranty}></Stack.Screen>

                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="Notification" component={Notification}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="GenuineProduct" component={GenuineProduct}></Stack.Screen>

                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="Genuinity" component={Genuinity}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="CongratulateOnScan" component={CongratulateOnScan}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="QrCodeScanner" component={QrCodeScanner}></Stack.Screen>

                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="SelectLanguage" component={SelectLanguage}></Stack.Screen>

                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="SelectUser" component={SelectUser}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="OtpLogin" component={OtpLogin}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="SchemeItems" component={SchemeItems}></Stack.Screen>
                
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="PasswordLogin" component={PasswordLogin}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="VerifyOtp" component={VerifyOtp}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="RegisterUser" component={RegisterUser}></Stack.Screen>
                <Stack.Screen options={
                    {
                        headerShown: false
                    }
                } name="Dashboard" component={DrawerNavigator}></Stack.Screen>

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default StackNavigator

