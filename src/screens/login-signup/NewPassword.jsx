import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryInput from "../custom_screens/PrimaryInput";
import PrimaryButton from "../custom_screens/PrimaryButton";

const NewPassword = ({ route }) => {
  const { token, FromStatus } = route.params;
  // console.log("in Chnage old account password>>>", token, FromStatus);
  return (
    <>
      <SafeAreaView style={{ flex: 1 }}>
        <View className="w-[90%] mx-auto justify-center mt-[130px] mb-[40px]">
          <Text className="font-montmedium font-bold text-[34px] leading-[34px] tracking-wider text-bigText w-[60%]">
            New password
          </Text>
        </View>
        <View className="w-[90%] mx-auto">
          <PrimaryInput
            label={"Enter New Password"}
            placeholder={"Enter new password"}
            keyboardType={"default"}
            maxLength={10}
            //   extrastyles={styles.extrastyles1}
            //   setIsFocus={setIsFocus}
            //   value={phoneNumber}
            //   onChangeText={handlePhoneNumber}
            //   error={errors.phoneNumber ? errors.phoneNumber : null}
          />
          <PrimaryInput
            label={"Re-type Password"}
            placeholder={"password"}
            keyboardType={"email-address"}
            maxLength={10}
            //   extrastyles={styles.extrastyles1}
            //   setIsFocus={setIsFocus}
            //   value={phoneNumber}
            //   onChangeText={handlePhoneNumber}
            //   error={errors.phoneNumber ? errors.phoneNumber : null}
          />
        </View>
        <View className="w-[90%] mx-auto mt-[20px]">
          <PrimaryButton>Change</PrimaryButton>
        </View>
      </SafeAreaView>
    </>
  );
};

export default NewPassword;

const styles = StyleSheet.create({});
