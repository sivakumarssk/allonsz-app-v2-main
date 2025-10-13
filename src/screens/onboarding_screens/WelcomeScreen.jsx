import React from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../custom_screens/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { insert } from "formik";
import { RFValue } from "react-native-responsive-fontsize";

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <>
      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View
            className="rounded-bl-[120px] overflow-hidden w-[100%]"
            style={[{ flex: 0.65 }]}
          >
            <Image
              source={require("../../../assets/welcomeimage.jpeg")}
              style={{ marginTop: -insets.top }}
            />
          </View>
          <View
            className="w-[85%] mx-auto flex justify-center items-center"
            style={{ flex: 0.25 }}
          >
            <Text
              style={{ fontSize: RFValue(24) }}
              className="font-montmedium font-semibold leading-[36px] text-center text-[#1B1E28]"
            >
              Life is short and the world is{" "}
              <Text className="text-[#44689C]">wide</Text>
            </Text>
            <Text
              style={{ fontSize: RFValue(14) }}
              className="text-smallText font-Gill font-medium leading-[24px] text-center mt-3"
            >
              At Friends tours and travel, we customize reliable and trutworthy
              educational tours to destinations all over the world
            </Text>
          </View>
          <View
            style={{ flex: 0.1 }}
            className="w-[85%] mx-auto flex justify-center"
          >
            <PrimaryButton
              onPress={async () => {
                navigation.replace("Login");
                try {
                  await AsyncStorage.setItem("hasLaunched", "true");
                } catch (error) {
                  console.error("Failed to save data to AsyncStorage", error);
                }
              }}
            >
              Get Started
            </PrimaryButton>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({});
