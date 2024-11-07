import React, { createContext, useContext } from 'react';
import useInternetSpeed from '../hooks/useInternetSpeed'; // Adjust the path as needed

const InternetSpeedContext = createContext();

export const InternetSpeedProvider = ({ children }) => {
  const { responseTime, loading } = useInternetSpeed();

  return (
    <InternetSpeedContext.Provider value={{ responseTime, loading }}>
      {children}
    </InternetSpeedContext.Provider>
  );
};

export const useInternetSpeedContext = () => useContext(InternetSpeedContext);
