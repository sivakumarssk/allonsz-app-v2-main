import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import CustomStatusBar from "../../custom_screens/CustomStatusBar";
import NavBack from "../../custom_screens/NavBack";
import PrimaryButton from "../../custom_screens/PrimaryButton";
import { useNavigation } from "@react-navigation/native";

const RechargeWallet = () => {
  const navigation = useNavigation();
  return (
    <>
      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <NavBack>Recharge the wallet</NavBack>

      <View className="w-[88%] mx-auto my-3">
        <Text className="font-popmedium font-normal text-[16px] leading-[24px] text-bigText mt-9">
          Amount
        </Text>
        <View className="bg-[#EDFCFF] rounded flex flex-row justify-between items-center px-3 py-4 mt-6">
          <TextInput
            placeholder=""
            value="10000"
            keyboardType="number-pad"
            maxLength={20}
            // onChangeText={onChangeText}
            className="font-popmedium font-normal text-[14px] leading-[21px] text-bigText"
          />
          <Text className="font-popmedium font-normal text-[17px] leading-[24px] text-bigText">
            INR
          </Text>
        </View>
      </View>
      <View className="w-[90%] mx-auto mt-[45px]">
        <PrimaryButton
          onPress={() => {
            navigation.navigate("PaymentDone");
          }}
        >
          Confirm Payment
        </PrimaryButton>
      </View>
    </>
  );
};

export default RechargeWallet;

const styles = StyleSheet.create({});
