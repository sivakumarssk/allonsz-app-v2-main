import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity, Platform } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const NavBack = ({ children }) => {
  const navigation = useNavigation();
  return (
    <>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        {/* <View
          className={`flex flex-row items-center w-[90%] mx-auto ${
            Platform === "android" ? "mt-9" : "mt-[36px]"
          } `}
        > */}
        <View
          className={`flex flex-row items-center w-[90%] mx-auto  ${
            Platform.OS === "android" ? "mt-[26px]" : "mt-[65px]"
          }`}
        >
          <View className="bg-[#24BAEC33] rounded-full">
            <MaterialIcons name="keyboard-arrow-left" size={28} color="black" />
          </View>
          <View className="ml-[10px]">
            <Text className="font-montmedium font-semibold text-[16px] leading-[22px]">
              {children}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default NavBack;

const styles = StyleSheet.create({});
