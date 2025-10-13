import React, { createContext, useContext, useState, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";

// Create the NetworkContext
export const NetworkContext = createContext();

// Custom hook to use the NetworkContext
export const useNetwork = () => useContext(NetworkContext);

// NetworkProvider component
export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(null); // Initial state as `null`
  const [networkType, setNetworkType] = useState(null);

  // const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setNetworkType(state.type);
    });

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  // if (isConnected === false) {
  // navigation.replace("Home");
  // } else if (isConnected) {
  // navigation.replace("Home"); // Redirect back to main screen
  // }
  // }, [isConnected, navigation]);

  // Avoid rendering children until network state is determined
  if (isConnected === null) {
    return null;
  }

  return (
    <NetworkContext.Provider value={{ isConnected, networkType }}>
      {children}
    </NetworkContext.Provider>
  );
};
