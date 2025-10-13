import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import React from "react";
import CustomStatusBar from "../../custom_screens/CustomStatusBar";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import Constants from "expo-constants";

const AboutApp = () => {
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
              Platform.OS === "android" ? "mt-[15px] " : "mt-[65px]"
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

      <View className="flex-1 bg-white justify-center items-center">
        <Image
          source={require("../../../../assets/favicon.png")}
          style={{ width: 300, height: 300, marginTop: -30 }}
        />
        <Text className="mt-5 font-montregular text-gray-400 tracking-wide">
          App Version
        </Text>
        <Text className="text-gray-400 font-montregular tracking-widest">
          Version -{Constants.expoConfig.version}
        </Text>
      </View>
    </>
  );
};

export default AboutApp;

const styles = StyleSheet.create({});
