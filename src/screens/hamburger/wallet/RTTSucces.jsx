import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomStatusBar from "../../custom_screens/CustomStatusBar";
import NavBack from "../../custom_screens/NavBack";
import PrimaryButton from "../../custom_screens/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";

const RTTSucces = () => {
  const navigation = useNavigation();
  return (
    <>
      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <NavBack></NavBack>
      <View className="justify-center items-center" style={{ flex: 0.8 }}>
        <View className="text-center  justify-center items-center">
          <LottieView
            source={require("../../../styles/images/Right_Animation.json")}
            autoPlay
            loop={false}
            speed={1.5} // Speed up the animation
            // onAnimationFinish={() => console.log("Animation finished")}
            style={{
              width: 250,
              height: 250,
            }}
          />
        </View>

        <View className="w-[85%] mx-auto">
          <Text className="font-montmedium text-primary text-[22px] font-bold leading-[26px] w-[90%] mx-auto text-center my-6">
            All set! Your withdrawal request has been submitted successfully
          </Text>
          {/* <Text className="font-montmedium text-primary text-[22px] font-bold leading-[26px] w-[90%] mx-auto text-center my-6">
            Your request has been sent. We’ll notify you once it’s processed
          </Text> */}

          <Text className="font-montmedium text-smallText text-[12px] font-normal leading-[14px] text-center">
            Your request has been sent. We’ll notify you once it’s processed
          </Text>

          <View className="my-6">
            <PrimaryButton
              onPress={() => {
                navigation.goBack();
              }}
            >
              Back
            </PrimaryButton>
          </View>
        </View>
      </View>
    </>
  );
};

export default RTTSucces;

const styles = StyleSheet.create({});
