// internetMiddleware.js
import { setInternetConnection } from '../slices/internetSlice';
import NetInfo from '@react-native-community/netinfo';

const internetMiddleware = store => {
  const handleConnectivityChange = isConnected => {
    store.dispatch(setInternetConnection(isConnected));
  };

  NetInfo.addEventListener(handleConnectivityChange);
  
  return next => action => {
    return next(action);
  };
};

export default internetMiddleware;
