import React, { Children } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import Ionicons from "@expo/vector-icons/Ionicons";

const PrimaryShare = ({ children, onPress, present }) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <View
          className={`flex-row items-center border-[1px] focus:border-black rounded-[5px] w-[90%] my-2 mx-auto ${
            present ? "bg-primary" : ""
          }`}
        >
          <View className="w-full mx-auto">
            <Text
              className={`text-center font-normal text-[16px] leading-[20px] py-[12px] uppercase ${
                present ? "text-white" : "text-[#4F4F4F]"
              }`}
            >
              {children}
            </Text>
          </View>
          <View className="mr-1">
            {present ? (
              <>
                <Ionicons name="checkmark-circle" size={24} color="white" />
              </>
            ) : (
              ""
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PrimaryShare;

const styles = StyleSheet.create({});
