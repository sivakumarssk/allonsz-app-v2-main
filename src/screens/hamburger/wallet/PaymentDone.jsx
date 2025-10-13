import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomStatusBar from "../../custom_screens/CustomStatusBar";
import NavBack from "../../custom_screens/NavBack";
import PrimaryButton from "../../custom_screens/PrimaryButton";
import { useNavigation } from "@react-navigation/native";

const PaymentDone = () => {
  const navigation = useNavigation();
  return (
    <>
      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <NavBack></NavBack>

      <View className="text-center h-[120px] justify-center items-center">
        <Text>Image</Text>
      </View>

      <View className="w-[90%] mx-auto">
        <Text className="text-primary font-montmedium font-normal text-center text-[20px] leading-[24px] tracking-widest">
          Payment Successfully done
        </Text>
        <View className="my-9">
          <View className="flex flex-row items-center my-[6px]">
            <Text className="text-[#444444] font-montmedium font-normal text-[14px] leading-[17px] w-[50%]">
              Amount transferred:{" "}
            </Text>
            <Text className="text-bigText font-montmedium font-bold text-[14px] leading-[17px]">
              10000
            </Text>
          </View>
          <View className="flex flex-row items-center my-[6px]">
            <Text className="text-[#444444] font-montmedium font-normal text-[14px] leading-[17px] w-[50%]">
              Receiver :
            </Text>
            <Text className="text-bigText font-montmedium font-bold text-[14px] leading-[17px]">
              Travels
            </Text>
          </View>
          <View className="flex flex-row items-center my-[6px]">
            <Text className="text-[#444444] font-montmedium font-normal text-[14px] leading-[17px] w-[50%]">
              Acc no :
            </Text>
            <Text className="text-bigText font-montmedium font-bold text-[14px] leading-[17px]">
              12445454874844498
            </Text>
          </View>
          <View className="flex flex-row items-center my-[6px]">
            <Text className="text-[#444444] font-montmedium font-normal text-[14px] leading-[17px] w-[50%]">
              Bank name :
            </Text>
            <Text className="text-bigText font-montmedium font-bold text-[14px] leading-[17px]">
              KVB Bank
            </Text>
          </View>
          <View className="flex flex-row items-center my-[6px]">
            <Text className="text-[#444444] font-montmedium font-normal text-[14px] leading-[17px] w-[50%]">
              Transaction Date :
            </Text>
            <Text className="text-bigText font-montmedium font-bold text-[14px] leading-[17px]">
              12/05/2023
            </Text>
          </View>
        </View>
        <View className="my-5">
          <PrimaryButton>Download receipt</PrimaryButton>
        </View>
      </View>

      <Pressable onPress={() => navigation.navigate("Home")}>
        <Text className="text-[#797979] font-montmedium font-normal tracking-widest text-[14px] leading-[17px] text-center mt-9">
          Back To Home
        </Text>
      </Pressable>
    </>
  );
};

export default PaymentDone;

const styles = StyleSheet.create({});
