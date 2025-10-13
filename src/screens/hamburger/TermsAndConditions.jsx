import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import WebView from "react-native-webview";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const TermsAndConditions = () => {
  const navigation = useNavigation();
  return (
    <>
      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#44689C"
        // translucent
      />

      <View className="bg-[#44689C]">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            className={`flex flex-row items-center w-[93%] mx-auto pb-2 ${
              Platform.OS === "android" ? "mt-[15px]" : "mt-[65px]"
            }`}
          >
            <View className="bg-[#24BAEC45] rounded-full">
              <MaterialIcons
                name="keyboard-arrow-left"
                size={28}
                color="white"
              />
            </View>
            <View className="ml-[10px]">
              <Text className="font-montmedium font-semibold text-white text-[16px] leading-[22px]">
                Allons-Z
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <WebView
        style={styles.container}
        source={{ uri: "https://allons-z.com/termsnadconditions" }}
        injectedJavaScript={`
            document.body.style.fontSize = '16px';
            document.body.style.padding = '0px';
            document.body.style.marginBottom = '20px';
            document.body.style.lineHeight = '1.6';
            true; // Note: This is required for the injected JS to execute properly
        `}
      />
    </>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({});
