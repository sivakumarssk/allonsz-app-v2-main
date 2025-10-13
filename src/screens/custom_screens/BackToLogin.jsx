import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import AsyncStorage_Calls from "../../utils/AsyncStorage_Calls";
import { setToken } from "../redux/action/loginAction";
import { useDispatch } from "react-redux";

const BackToLogin = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    // console.log("clicked logout functionc");
    AsyncStorage_Calls.RemoveTokenJWT("Token", function (res, status) {
      if (status) {
        // console.log("Async storage lo set", status);
        dispatch(setToken(null));
      } else {
        console.log("else", res);
      }
    });
  };

  const handleAlert = () => {
    Alert.alert(
      "Confirm your action",
      "Are you sure? Logging out will take you back to the start.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout canceled"),
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: handleLogout,
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View>
      <Pressable onPress={handleAlert}>
        <Text className="text-[#44689C] text-[12px] pb-[2px] font-montmedium text-center mb-2">
          {/* Ready to try again? Back to Login. */}
          Missed something? Back to your account now.
        </Text>
      </Pressable>
    </View>
  );
};

export default BackToLogin;

const styles = StyleSheet.create({});
