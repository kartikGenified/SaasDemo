import React,{useEffect,useState} from 'react';
import {View, StyleSheet, SafeAreaView,Alert,Linking, Platform} from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import { store } from './redux/store';
import { Provider } from 'react-redux'
import messaging from '@react-native-firebase/messaging';    
import VersionCheck from 'react-native-version-check';
import Close from 'react-native-vector-icons/Ionicons';
import ModalWithBorder from './src/components/modals/ModalWithBorder';
import NetInfo from "@react-native-community/netinfo";
import { PaperProvider } from 'react-native-paper';
import { InternetSpeedProvider } from './src/Contexts/useInternetSpeedContext';
const App = () => {
  const [notifModal, setNotifModal] = useState(false)
  const [notifData, setNotifData] = useState(null)


  console.log("Version check",JSON.stringify(VersionCheck.getPlayStoreUrl({ packageName: 'com.genefied.expolo' })))
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
         setNotifModal(true)
      setNotifData(remoteMessage?.notification)
      console.log("remote message",remoteMessage)
        });
        
        return unsubscribe;
      }, []);

     
    

      useEffect(() => {
        const checkAppVersion = async () => {
          try {
    const latestVersion = Platform.OS === 'ios'? await fetch(`https://itunes.apple.com/in/lookup?bundleId=com.genefied.expolo`)
                    .then(r => r.json())
                    .then((res) => { return res?.results[0]?.version })
                    : await VersionCheck.getLatestVersion({
                        provider: 'playStore',
                        forceUpdate: true,
                       
                    });
    
            const currentVersion = VersionCheck.getCurrentVersion();
    
            console.log("current verison and new version,",currentVersion, latestVersion)
            if (latestVersion > currentVersion) {
              Alert.alert(
                'Update Required',
    'A new version of the app is available. Please update to continue using the app.',
                [
                  {
                    text: 'Update Now',
                    onPress: () => {
                      Linking.openURL(
                        Platform.OS === 'ios'
                          ? 'https://apps.apple.com/in/app/expolo-%E0%A4%8F%E0%A4%95-%E0%A4%AA%E0%A4%B9%E0%A4%B2-%E0%A4%85%E0%A4%AA%E0%A4%A8-%E0%A4%95-%E0%A4%B8-%E0%A4%A5/id1554075490'
                          : "https://play.google.com/store/apps/details?id=com.genefied.expolo"
                      );
                    },
                  },
                ],
                { cancelable: false }
              );
            } else {
              // App is up-to-date; proceed with the app
            }
          } catch (error) {
            // Handle error while checking app version
            console.error('Error checking app version:', error);
          }
        };
    
        checkAppVersion();
      }, []);
        
      
      

      const notifModalFunc = () => {
        return (
          <View style={{height:130  }}>
            <View style={{ height: '100%', width:'100%', alignItems:'center',}}>
              <View>
              {/* <Bell name="bell" size={18} style={{marginTop:5}} color={ternaryThemeColor}></Bell> */}
    
              </View>
              <PoppinsTextLeftMedium content={notifData?.title ? notifData?.title : ""} style={{ color: ternaryThemeColor, fontWeight:'800', fontSize:20, marginTop:8 }}></PoppinsTextLeftMedium>
          
              <PoppinsTextLeftMedium content={notifData?.title ? notifData?.title : ""} style={{ color: '#000000', marginTop:10, padding:10, fontSize:15, fontWeight:'600' }}></PoppinsTextLeftMedium>
            </View>
    
            <TouchableOpacity style={[{
              backgroundColor: ternaryThemeColor, padding: 6, borderRadius: 5, position: 'absolute', top: -10, right: -10,
            }]} onPress={() => setNotifModal(false)} >
              <Close name="close" size={17} color="#ffffff" />
            </TouchableOpacity>
    
    
    
          </View>
        )
      }
        
    return (
        <Provider store={store}>
          <PaperProvider>
            <InternetSpeedProvider>
        <SafeAreaView style={{flex:1}}>
          
            <StackNavigator>
            {notifModal &&  <ModalWithBorder
            modalClose={() => {
              setNotifModal(false)
            }}
            message={"message"}
            openModal={notifModal}
            comp={notifModalFunc}></ModalWithBorder>}
           
            </StackNavigator>
        </SafeAreaView>
        </InternetSpeedProvider>
        </PaperProvider>
        </Provider>
    );
}

const styles = StyleSheet.create({})

export default App;
