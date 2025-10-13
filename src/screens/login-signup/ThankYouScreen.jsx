import LottieView from "lottie-react-native";
import React, { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../custom_screens/PrimaryButton";
import AsyncStorage_Calls from "../../utils/AsyncStorage_Calls";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/action/loginAction";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";
import CustomStatusBar from "../custom_screens/CustomStatusBar";

const ThankYouScreen = ({ route }) => {
  const { token } = route.params;
  console.log("token in ", token);

  const navigation = useNavigation();

  const toast = useToast();
  const dispatch = useDispatch();

  const handleContinue = () => {
    // console.log("clicked continue");

    toast.hideAll();
    toast.show("Login successful! Ready to explore?", {
      type: "success",
      placement: "top",
      duration: 4000,
      offset: 30,
      animationType: "slide-in",
    });

    AsyncStorage_Calls.setTokenJWT(
      "Token",
      JSON.stringify(token),
      function (res, status) {
        if (status) {
          // console.log("Async storage lo set");
          dispatch(setToken(token));
        }
      }
    );
  };
  return (
    <>
      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#44689C"
        translucent
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View
          className="flex justify-center items-center"
          style={{ flex: 0.9 }}
        >
          <View className="my-2">
            <LottieView
              source={require("../../styles/images/Right_Animation.json")}
              autoPlay
              loop={false}
              speed={1.5} // Speed up the animation
              onAnimationFinish={() => console.log("Animation finished")}
              style={{
                width: 250,
                height: 250,
              }}
            />
          </View>
          <View className="w-[80%] mx-auto">
            <Text className="font-montmedium font-bold text-[34px] leading-[34px] tracking-wider text-bigText text-center ">
              Thank you
            </Text>
            <Text className="font-popmedium font-normal text-[13px] leading-[18px] text-smallText text-center my-4">
              Your Email id verification has been completed successfully
            </Text>
          </View>
          <View className="w-[80%] mx-auto my-6">
            <PrimaryButton
              // direction={"CreatePassword"}
              onPress={handleContinue}
              // onPress={() => {
              //   console.log("Navigating to Login");
              //   navigation.replace("Login");
              // }}
            >
              Continue
            </PrimaryButton>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ThankYouScreen;

const styles = StyleSheet.create({});
