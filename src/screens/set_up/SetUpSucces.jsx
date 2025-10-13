import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import PrimaryButton from "../custom_screens/PrimaryButton";
import Loader from "../custom_screens/Loader";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import AsyncStorage_Calls from "../../utils/AsyncStorage_Calls";
import { setKYCStatus, setKYCVerified } from "../redux/action/KYCverify";
import { useDispatch } from "react-redux";
import LottieView from "lottie-react-native";

const SetUpSucces = ({ route }) => {
  const { previousScreen } = route.params;
  const navigation = useNavigation();

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View className="justify-center items-center" style={{ flex: 0.9 }}>
          <View className="text-center  justify-center items-center">
            <LottieView
              source={require("../../styles/images/Right_Animation.json")}
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
          <Text className="text-center font-montmedium font-bold text-[22px] leading-[26px] text-primary my-6">
            Success!
          </Text>
          <Text className="text-center font-montmedium font-medium text-[12px] leading-[15px] text-smallText w-[80%] mx-auto">
            Congratulations! You have been successfully authenticated
          </Text>
          <View className="w-[88%] mx-auto my-9">
            <PrimaryButton
              onPress={() => {
                if (previousScreen === "BankVerificationScreen") {
                  AsyncStorage_Calls.setTokenJWT(
                    "userKYC",
                    "step-4:BankVerificationDone",
                    function (res, status) {
                      if (status) {
                        // console.log(
                        //   "Async storage lo set userKYC step4:",
                        //   status
                        // );
                        dispatch(setKYCStatus("step-4:BankVerificationDone"));
                      } else {
                        console.log("Error in the Step4 stroage:>", status);
                      }
                    }
                  );

                  setTimeout(() => {
                    navigation.navigate("ShareMail");
                  }, 800);
                } else if (previousScreen === "ShareDocumentScreen") {
                  AsyncStorage_Calls.setTokenJWT(
                    "KYCVerification",
                    "VERIFIED",
                    function (res, status) {
                      if (status) {
                        // console.log("Async storage lo set userKYC");
                        dispatch(setKYCVerified(true));
                      }
                    }
                  );
                  setTimeout(() => {
                    navigation.navigate("Home");
                  }, 800);
                } else {
                  console.warn("Unexpected previousScreen value:");
                }
              }}
            >
              Continue
            </PrimaryButton>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default SetUpSucces;

const styles = StyleSheet.create({});
