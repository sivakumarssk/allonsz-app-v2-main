import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OtpInput } from "react-native-otp-entry";
import { useNavigation } from "@react-navigation/native";
import PrimaryButton from "../custom_screens/PrimaryButton";

const MobilepwdVerify = () => {
  // not using this file
  const navigation = useNavigation();
  const handleOtpChange = (otp) => {
    console.log("Entered OTP:", otp);
  };
  const handleFilled = (otp) => {
    console.log("OTP is complete:", otp);
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View className="w-[90%] mx-auto justify-center" style={{ flex: 0.4 }}>
          <Text className="font-montmedium font-bold text-[34px] leading-[34px] tracking-wider text-bigText mt-[60px] mb-[20px] ">
            Verification code
          </Text>
          <Text className="font-popmedium font-normal text-[13px] leading-[18px] text-smallText mb-3">
            We have sent the verification code to your mobile number
          </Text>
        </View>
        <View>
          <OtpInput
            numberOfDigits={4}
            focusColor="green"
            focusStickBlinkingDuration={500}
            onTextChange={handleOtpChange}
            onFilled={handleFilled}
            textInputProps={{
              accessibilityLabel: "One-Time Password",
            }}
            theme={{
              containerStyle: styles.container,
              pinCodeContainerStyle: styles.pinCodeContainer,
              pinCodeTextStyle: styles.pinCodeText,
              // focusStickStyle: styles.focusStick,
              // focusedPinCodeContainerStyle: styles.activePinCodeContainer,
            }}
          />
        </View>
        <Pressable onPress={() => console.log("resend")} className="py-6">
          <Text className="font-montmedium font-semibold text-[14px] leading-[16px] text-[#B6B6B6] text-center">
            Resend Code
          </Text>
        </Pressable>
        <View className="w-[80%] mx-auto my-6">
          <PrimaryButton
            onPress={() => {
              navigation.navigate("NewPassword");
            }}
          >
            Next
          </PrimaryButton>
        </View>
      </SafeAreaView>
    </>
  );
};

export default MobilepwdVerify;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    marginHorizontal: "auto",
    gap: 12,
  },
  pinCodeContainer: {
    borderRadius: 8,
    height: 55,
  },
  pinCodeText: {
    // fontFamily: "Poppins-Medium",
    color: "green",
  },
  focusStick: {},
  activePinCodeContainer: {},
});
