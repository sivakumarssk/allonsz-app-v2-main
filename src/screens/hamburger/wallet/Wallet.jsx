import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomStatusBar from "../../custom_screens/CustomStatusBar";
import NavBack from "../../custom_screens/NavBack";
import { TouchableOpacity } from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

const Wallet = () => {
  const navigation = useNavigation();
  return (
    <>
      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <NavBack>Wallet</NavBack>

      <View className="w-[90%] mx-auto mt-9">
        <TouchableOpacity
          className="flex flex-row justify-between items-center my-[14px] w-full"
          onPress={() => {
            navigation.navigate("RechareWallet");
          }}
        >
          <View className="flex flex-row items-center">
            <View className="mr-3">
              <Fontisto name="wallet" size={24} color="black" />
            </View>
            <Text className="text-bigText font-montmedium font-semibold text-[16px] leading-[22px]">
              Recharge the wallet
            </Text>
          </View>
          <View className="mr-1">
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>
        </TouchableOpacity>
        {/*  */}
        <TouchableOpacity
          className="flex flex-row justify-between items-center my-[14px] w-full"
          onPress={() => {
            navigation.navigate("TripWallet");
          }}
        >
          <View className="flex flex-row items-center">
            <View className="mr-3">
              {/* <Image
                source={require("../../../styles/images/hamburgerMenu/Travel.png")}
              /> */}
              <MaterialIcons name="flight-takeoff" size={24} color="black" />
            </View>
            <Text className="text-bigText font-montmedium font-semibold text-[16px] leading-[22px]">
              View Trip Wallet
            </Text>
          </View>
          <View className="mr-1">
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Wallet;

const styles = StyleSheet.create({});
