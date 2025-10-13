import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";

import { LoginSchema } from "../../Network/Schema";
import { valid_login } from "../../Network/ApiCalling";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/action/loginAction";
import { useToast } from "react-native-toast-notifications";

import Loader from "../custom_screens/Loader";
import PrimaryInput from "../custom_screens/PrimaryInput";
import PrimaryButton from "../custom_screens/PrimaryButton";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import AsyncStorage_Calls from "../../utils/AsyncStorage_Calls";

const Login = () => {
  const toast = useToast();

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [APIerrors, setAPIerrors] = useState({
    emailId: "",
    password: "",
  });

  const checkUserStatus = async () => {
    // console.log("lets see the user status");
  };

  const [pswd, setPswd] = useState(true);

  const onSubmit = async (values) => {
    // console.log("values>>>>", values);

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    try {
      setLoading(true);
      const res = await valid_login(formData);
      // console.log(">>>>", res);
      if (res.status === 200) {
        // console.log("token", res.data.token);

        toast.hideAll();
        toast.show("Login successful! Ready to explore?", {
          type: "success",
          placement: "top",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });

        var token = res.data.token;

        checkUserStatus();

        AsyncStorage_Calls.setTokenJWT(
          "Token",
          JSON.stringify(token),
          function (res, status) {
            if (status) {
              // console.log("Async storage lo set");
              dispatch(setToken(token)); //setToken redux
            }
          }
        );
      }
    } catch (err) {
      // console.log("error this", err.response.data);
      // if (err) {
      if (err.response) {
        const status = err.response.status;
        const message = err.response.data.error;

        if (err.response.status === 400) {
          console.log("Error With 400.");
        } else if (err.response.status === 422) {
          if (
            err.response.data.error === "This email is not registered with us!"
          ) {
            // touched.email = true;
            setAPIerrors((prev) => ({
              ...prev,
              emailId: err.response.data.error,
            }));
          } else if (err.response.data.error === "Invalid Password !!") {
            // touched.password = true;
            setAPIerrors((prev) => ({
              ...prev,
              password: err.response.data.error,
            }));
          } else {
            // console.log("error ekadey", err.response.data);
          }
        } else if (err.response.status === 301) {
          console.log("Error 301");
        } else if (err.response.status === 401) {
          console.log("Error 401");
        } else if (err.response.status === 404) {
          // console.log("Error 404", err.response);
          toast.hideAll();
          toast.show("Oops! Something went wrong—please try again", {
            type: "warning",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });
        } else if (err.response.status === 500) {
          // console.log("Internal Server Error", err.message);
          Alert.alert(
            "Internal Server Error",
            "Please Check your Internet Connection"
          );
        } else {
          // console.log("An error occurred response.>>");
          toast.hideAll();
          toast.show("Oops! Something went wrong—please try again", {
            type: "warning",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });
        }
      } else if (err.request) {
        // console.log("No Response Received From the Server.");
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
      // }
    } finally {
      setLoading(false);
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
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit,
  });

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="white"
        translucent
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        >
          {/* <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }}
          > */}
          <View>
            <Image
              source={require("../../../assets/favicon.png")}
              className="w-[300px] h-[300px]"
            />
          </View>
          <View className="w-[80%]">
            <PrimaryInput
              label={"Email Id"}
              placeholder={"Enter email id"}
              keyboardType={"email-address"}
              maxLength={200}
              value={values.email}
              onBlur={handleBlur("email")}
              onChangeText={(value) => {
                const emojiRegex =
                  /[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

                const invalidCharRegex =
                  /[+!#$%^&*_\\\ ,;:\\\"()\[\]<>~`|•√π÷×§∆}{=°¢¥€✓/]| \.{2,}/g;

                const trimmedValue = value
                  .toLowerCase()
                  .replace(emojiRegex, "")
                  .replace(invalidCharRegex, "")
                  .replace(/^[^A-Za-z0-9]+/, "")
                  .replace(/\s/g, "");

                // setFieldTouched("email", true, true);
                handleChange("email")(trimmedValue);
                setAPIerrors((prev) => ({
                  ...prev,
                  emailId: null,
                }));
              }}
              error={
                APIerrors.emailId // Show API error if it exists
                  ? APIerrors.emailId
                  : touched.email && errors.email // Else show Formik error
                  ? errors.email
                  : null // No errors
              }
            />
            <PrimaryInput
              label={"Password"}
              placeholder={"Enter Password"}
              keyboardType={"default"}
              value={values.password}
              maxLength={16}
              onBlur={handleBlur("password")}
              onChangeText={(value) => {
                const emojiRegex =
                  /[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

                const trimmedValue = value
                  .replace(emojiRegex, "")
                  .replace(/\s/g, "")
                  .replace(/^[^A-Za-z]+/, "");

                // setFieldTouched("password", true, true);
                handleChange("password")(trimmedValue);

                setAPIerrors((prev) => ({
                  ...prev,
                  password: null,
                }));
              }}
              error={
                APIerrors.password // Show API error if it exists
                  ? APIerrors.password
                  : touched.password && errors.password // Else show Formik error
                  ? errors.password
                  : null // No errors
              }
              isSecure={pswd}
              passwordIcons={true}
              onPressIcon={() => {
                setPswd(!pswd);
              }}
            />
            <View className="flex items-end mb-6">
              <TouchableOpacity
                onPress={() => navigation.navigate("ChangePassword")}
              >
                <Text className="font-montmedium font-semibold text-[12px] leading-[14px]">
                  Forgot password ?
                </Text>
              </TouchableOpacity>
            </View>
            <PrimaryButton
              // direction={"SetupProfile"}
              onPress={handleSubmit}
            >
              Login
            </PrimaryButton>
          </View>
          <View className="flex-row my-5">
            <Text className="font-montmedium font-normal leading-[17px] text-[14px] text-smallText">
              Dont have a account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                // console.log("clicked");
                navigation.navigate("EmailRegister");
              }}
            >
              <Text className="font-montmedium font-semibold leading-[17px] text-[14px] text-black">
                Create account
              </Text>
            </TouchableOpacity>
          </View>
          {/* </View> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({});
