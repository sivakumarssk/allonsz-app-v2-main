import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const PrimaryButton = ({ children, onPress, extraFunction, direction }) => {
  const navigation = useNavigation();

  const handlePrmaryButtonPress = () => {
    if (extraFunction) {
      // console.log("extraFunction called");
      extraFunction();
    }
    if (direction) {
      navigation.navigate(direction);
    }
  };

  return (
    <View>
      <TouchableOpacity className="bg-primary rounded-lg" onPress={onPress}>
        <Text className="font-montmedium text-[#FCFDFD] font-semibold text-[16px] leading-[20px] text-center py-3">
          {children}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({});
