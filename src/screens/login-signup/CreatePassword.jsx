import React, { useCallback, useState } from "react";
import {
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryInput from "../custom_screens/PrimaryInput";
import Checkbox from "expo-checkbox";
import PrimaryButton from "../custom_screens/PrimaryButton";

import CustomStatusBar from "../custom_screens/CustomStatusBar";
import Loader from "../custom_screens/Loader";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Update_Password } from "../../Network/ApiCalling";
import { passwordValidationSchema } from "../../Network/Schema";
import { useFormik } from "formik";
import { useToast } from "react-native-toast-notifications";

const CreatePassword = ({ route }) => {
  const { token, FromStatus } = route.params;
  // console.log("in passowrd screen>>-->>", FromStatus);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => true; // Prevent going back

      const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        backHandler.remove();
      };
    }, [])
  );

  const openLink = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open link: ", err)
    );
  };

  const [loading, setLoading] = useState(false);

  const toast = useToast();
  // console.log("token", token);

  const navigation = useNavigation();
  const [isChecked, setChecked] = useState({
    first: false,
    second: false,
  });
  const [checkedError, setCheckedError] = useState({
    first: false,
    second: false,
  });

  const [pswd, setPswd] = useState(true);
  const [confirmpswd, setConfirmPswd] = useState(true);

  const onSubmit = async (values) => {
    // console.log("vaidate>>>", email, otp);

    const formData = new FormData();
    formData.append("password", values.password);
    formData.append("password_confirmation", values.confirmPassword);

    if (
      FromStatus === "Forgot_password" ||
      (isChecked.first && isChecked.second)
    ) {
      try {
        setLoading(true);
        const res = await Update_Password(formData, token);
        // console.log(">>>>", res);
        if (res.status === 200) {
          // console.log("Upadted successfully:", res.data.msg);
          if (FromStatus === "Forgot_password") {
            navigation.replace("Login");
          } else {
            navigation.navigate("ThankYouScreen", { token: token });
          }
        }
      } catch (err) {
        // console.log("Error in the Upadtedpsw :", err.response.data);
        if (err) {
          if (err.response) {
            const status = err.response.status;

            // console.log(
            //   "Error responses in the update password",
            //   err.response.data
            // );
            if (status === 400) {
              console.log("Error With 400.");
            } else if (status === 422) {
              // console.log("422 error");
              a;
            } else if (status === 301) {
              console.log("301 error");
            } else if (status === 401) {
              console.log("401 error");
            } else if (status === 404) {
              console.log("404 error");
            } else if (status === 500) {
              console.log("Internal Server Error", err.message);
              Alert.alert(
                "Internal Server Error",
                "Please Check your Internet Connection"
              );
            } else {
              console.log("An error occurred response.>>");
            }
          } else if (err.request) {
            console.log("No Response Received From the Server.");
            if (err.request.status === 0) {
              Alert.alert(
                "No Network Found",
                "Please Check your Internet Connection"
              );
            }
          } else {
            // console.log("Error in Setting up the Request.");
            toast.hideAll();
            toast.show("Oops! Something went wrong—please try again", {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          }
        }
      } finally {
        setLoading(false);
      }
    } else {
      // console.log("All should be clicked", isChecked.first, isChecked.second);
      if (!isChecked.first && !isChecked.second) {
        setCheckedError((prev) => ({ ...prev, first: true, second: true }));
      } else if (!isChecked.first) {
        setCheckedError((prev) => ({ ...prev, first: true }));
      } else if (!isChecked.second) {
        setCheckedError((prev) => ({ ...prev, second: true }));
      }

      if (!isChecked.first || !isChecked.second) {
        toast.hideAll();
        toast.show("Please Check the Terms & Conditions and Privacy Policy", {
          type: "warning",
          placement: "top",
          duration: 4000,
          style: { marginTop: 28, paddingRight: 20 },
          offset: 80,
          animationType: "slide-in",
        });
      }
    }
  };

  const {
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    touched,
    errors,
    resetForm,
    handleBlur,
    setFieldTouched,
  } = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: passwordValidationSchema,
    onSubmit,
  });

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            // justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        >
          <View className="w-[90%] mx-auto mt-[80px]">
            <Text className="font-montmedium font-bold text-[34px] leading-[34px] tracking-wider text-bigText mt-[50px] mb-[50px] pt-1">
              {/* Create new password */}
              {FromStatus === "Create_Account"
                ? "Create New Password"
                : "Change Password"}
            </Text>
            <View>
              <PrimaryInput
                label={"Password"}
                placeholder={"Enter new password"}
                keyboardType={"default"}
                value={values.password}
                maxLength={16}
                onBlur={handleBlur("password")}
                onChangeText={(value) => {
                  const emojiRegex =
                    /[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

                  const trimmedValue = value
                    .replace(emojiRegex, "")
                    .replace(/^[^A-Za-z]+/, "")
                    .replace(/\s/g, "");

                  setFieldTouched("password", true, true);
                  handleChange("password")(trimmedValue);
                }}
                error={
                  touched.password && errors.password ? errors.password : null
                }
                isSecure={pswd}
                passwordIcons={true}
                onPressIcon={() => {
                  setPswd(!pswd);
                }}
                contextMenuHidden={true} // Disables copy-paste
                selectTextOnFocus={false} // Prevents text selection
              />
              <PrimaryInput
                label={"Re-type Password"}
                placeholder={"password"}
                keyboardType={"default"}
                value={values.confirmPassword}
                maxLength={16}
                onBlur={handleBlur("confirmPassword")}
                onChangeText={(value) => {
                  const emojiRegex =
                    /[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

                  const trimmedValue = value
                    .replace(emojiRegex, "")
                    .replace(/^[^A-Za-z]+/, "")
                    .replace(/\s/g, "");

                  setFieldTouched("confirmPassword", true, true);
                  handleChange("confirmPassword")(trimmedValue);
                }}
                error={
                  touched.confirmPassword && errors.confirmPassword
                    ? errors.confirmPassword
                    : null
                }
                isSecure={confirmpswd}
                passwordIcons={true}
                onPressIcon={() => {
                  setConfirmPswd(!confirmpswd);
                }}
                contextMenuHidden={true} // Disables copy-paste
                selectTextOnFocus={false} // Prevents text selection
              />
            </View>

            {FromStatus === "Create_Account" && (
              <View className="my-2">
                <View className="flex-row items-center">
                  <Checkbox
                    style={styles.checkbox}
                    value={isChecked.first}
                    onValueChange={() => {
                      setChecked((prev) => ({
                        ...prev,
                        first: !isChecked.first,
                      }));
                      if (!checkedError.first) {
                        setCheckedError((prev) => ({ ...prev, first: false }));
                      }
                    }}
                    color={
                      isChecked.first
                        ? "#44689C"
                        : checkedError.first
                        ? "#ff0303"
                        : "#bfbfbf"
                    }
                    className="mr-1"
                  />
                  <Text
                    className={`font-montmedium font-light text-[13px] w-[96%] leading-[18px] text-smallText ${
                      isChecked.first
                        ? "text-[#44689C]"
                        : checkedError.first
                        ? "text-[#ff0303]"
                        : "text-smallText"
                    }`}
                  >
                    I agree to receive email updates from Allons-Z
                  </Text>
                </View>
                <View className="flex-row items-center my-3">
                  <Checkbox
                    style={styles.checkbox}
                    value={isChecked.second}
                    onValueChange={() => {
                      setChecked((prev) => ({
                        ...prev,
                        second: !isChecked.second,
                      }));
                      if (!checkedError.second) {
                        setCheckedError((prev) => ({ ...prev, second: false }));
                      }
                    }}
                    color={
                      isChecked.second
                        ? "#44689C"
                        : checkedError.second
                        ? "#ff0303"
                        : "#bfbfbf"
                    }
                    className="mr-1"
                  />
                  <View className="flex flex-row flex-wrap items-center w-[96%]">
                    <Text
                      className={`font-montmedium font-light text-[13px] leading-[18px] ${
                        isChecked.second
                          ? "text-[#44689C]"
                          : checkedError.second
                          ? "text-[#ff0303]"
                          : "text-smallText"
                      }`}
                    >
                      I agree to the Terms & Conditions and Privacy Policy.
                    </Text>
                  </View>
                </View>
              </View>
            )}
            <View className="my-4">
              <PrimaryButton
                // direction={"ThankYouScreen"}
                onPress={handleSubmit}
              >
                {FromStatus === "Forgot_password" ? "Change" : "Sign Up"}
              </PrimaryButton>
            </View>
            {FromStatus === "Create_Account" && (
              <View className="flex-row justify-center items-center my-5">
                <Text className="font-montmedium font-normal leading-[17px] text-[14px] text-smallText">
                  Already registered?{" "}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    // console.log("clicked");
                    navigation.replace("Login");
                  }}
                >
                  <Text className="font-montmedium font-semibold leading-[17px] text-[14px] text-black">
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default CreatePassword;

const styles = StyleSheet.create({});
