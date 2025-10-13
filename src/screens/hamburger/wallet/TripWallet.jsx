import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomStatusBar from "../../custom_screens/CustomStatusBar";
import NavBack from "../../custom_screens/NavBack";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import PrimaryButton from "../../custom_screens/PrimaryButton";
import { useNavigation } from "@react-navigation/native";

const TripWallet = ({ route }) => {
  const { Amount } = route.params || {};

  const navigation = useNavigation();
  return (
    <>
      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <NavBack>Trip Wallet</NavBack>

      <View className="bg-[#ffffff83] rounded-xl w-[80%] mx-auto mt-9">
        <View className="relative mt-4">
          <Image
            source={require("../../../styles/images/hamburgerMenu/Frame.png")}
            className="w-full h-auto"
            resizeMode="contain"
          />
          <View className="absolute inset-0 p-9 w-full">
            <Text className="text-[#fff] font-bold font-montmedium text-[24px] leading-[26px] mt-2">
              Wallet Money
            </Text>
            <View className="flex flex-row mt-3">
              <FontAwesome name="rupee" size={23} color="white" />
              <Text className="text-[#fff] font-bold font-montmedium text-[25px] leading-[25px] ml-2">
                {Amount}
              </Text>
            </View>
            <Text className="text-[#fff] font-bold font-montmedium text-[18px] leading-[25px] my-3">
              Duration: 34 Months
            </Text>
            <Pressable>
              <View className="bg-smallText rounded-lg w-[60%] mx-auto mt-6">
                <Text className="text-[#fff] font-semibold font-montmedium text-[16px] leading-[24px] tracking-widest text-center p-2">
                  View Details
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View className="w-[90%] mx-auto mt-5 mb-3">
          <Text className="font-montmedium font-semibold text-[18px] leading-[24px] tracking-widest text-primary mb-2">
            Trip Wallet
          </Text>
          <Text className="font-montmedium font-normal text-[15px] leading-[20px] tracking-widest text-smallText">
            If you want to withdraw money send request
          </Text>
        </View>
      </View>

      <View className="w-[80%] mx-auto my-9">
        <PrimaryButton
          onPress={() => {
            navigation.navigate("RTTWalletMoney");
          }}
        >
          Request to transfer wallet money
        </PrimaryButton>
      </View>
    </>
  );
};

export default TripWallet;

const styles = StyleSheet.create({});
