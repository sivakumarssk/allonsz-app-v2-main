import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomStatusBar from "../../custom_screens/CustomStatusBar";
import NavBack from "../../custom_screens/NavBack";
import PrimaryButton from "../../custom_screens/PrimaryButton";
import LottieView from "lottie-react-native";

const RTCSucces = ({ route }) => {
  const { code } = route.params || {};
  return (
    <>
      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <NavBack></NavBack>

      <View className="text-center justify-center items-center">
        <LottieView
          source={require("../../../styles/images/Right_Animation.json")}
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

      <View className="w-[90%] mx-auto">
        <Text className="font-montmedium text-primary text-[22px] font-bold leading-[26px] w-[90%] mx-auto text-center my-6">
          🎉 Success! Your request to change the referral code has been
          successfully sent!
        </Text>

        <Text className="font-montmedium text-smallText text-[12px] font-normal leading-[14px] text-center">
          Your new referral code: {code} 💳
        </Text>

        <View className="my-6">
          <PrimaryButton>Back</PrimaryButton>
        </View>
      </View>
    </>
  );
};

export default RTCSucces;

const styles = StyleSheet.create({});
