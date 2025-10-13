import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity, Platform } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const NavReferral = ({ children }) => {
  const navigation = useNavigation();
  return (
    <>
      <View
        className={`flex flex-row justify-between w-[90%] mx-auto mb-4 ${
          Platform.OS === "android" ? "mt-[26px]" : "mt-[65px]"
        }`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View className="flex flex-row items-center  ">
            <View className="bg-[#24BAEC33] rounded-full">
              <MaterialIcons
                name="keyboard-arrow-left"
                size={28}
                color="black"
              />
            </View>
            <View className="ml-[10px]">
              <Text className="font-montmedium font-semibold text-[16px] leading-[22px]">
                {children}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <View>
          <Pressable
            onPress={() => {
              navigation.navigate("Packages");
            }}
          >
            <Text className="font-montmedium font-extrabold text-[13px] leading-[17px] underline text-bigText ">
              Upgrade version
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default NavReferral;

const styles = StyleSheet.create({});
