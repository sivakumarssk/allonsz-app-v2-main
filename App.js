import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { Store } from "./src/screens/redux/Store";

import ExploreAllonsz from "./src/screens/ExploreAllonsz";
import { ToastProvider } from "react-native-toast-notifications";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function App() {
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={Store}>
          <ToastProvider
            dangerIcon={
              <MaterialIcons name="dangerous" size={24} color="white" />
            }
            successIcon={
              <MaterialIcons name="check-circle" size={24} color="white" />
            }
            warningIcon={<FontAwesome name="warning" size={24} color="black" />}
            textStyle={{ fontSize: 13 }}
            swipeEnabled={true}
          >
            <SafeAreaProvider>
              <ExploreAllonsz />
            </SafeAreaProvider>
          </ToastProvider>
        </Provider>
      </GestureHandlerRootView>
    </>
  );
}
