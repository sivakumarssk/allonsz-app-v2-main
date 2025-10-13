import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryInput from "../custom_screens/PrimaryInput";
import PrimaryButton from "../custom_screens/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import { useFormik } from "formik";
import { EmailValidationSchema } from "../../Network/Schema";
import { valid_Email } from "../../Network/ApiCalling";
import { useToast } from "react-native-toast-notifications";
import Loader from "../custom_screens/Loader";

const EmailRegister = () => {
  const toast = useToast();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const [ApiErrors, setApiErrors] = useState("");
  // console.log("ApiErrors", ApiErrors);

  const onSubmit = async (values) => {
    // console.log("email vaidate>>>", values);

    const formData = new FormData();
    formData.append("email", values.email);

    try {
      setLoading(true);
      const res = await valid_Email(formData);
      // console.log(">>>>", res);
      if (res.status === 200) {
        // console.log("msg", res.data.msg);

        toast.hideAll();
        toast.show("OTP Sent Successfully", {
          type: "success",
          placement: "top",
          duration: 4000,
          offset: 30,
          style: { marginTop: 28 },
          animationType: "slide-in",
        });

        navigation.navigate("VerifyCode", {
          email: values.email,
          status: "Create_Account",
        });
      }
    } catch (err) {
      // console.log("Error in the Email Register", err.response.data);
      if (err) {
        if (err.response) {
          const status = err.response.status;
          const message = err.response.data.error;
          // console.log(
          //   "Error responses in the Email Register",
          //   err.response.data
          // );
          if (status === 400) {
            console.log("Error With 400.");
          } else if (status === 422) {
            setApiErrors(message);
            console.log("422 error", err.response.data);
          } else if (status === 301) {
            console.log("301 error", err.response.data);
          } else if (status === 401) {
            console.log("401 error", err.response.data);
          } else if (status === 404) {
            console.log("404 error", err.response.data);
          } else if (status === 500) {
            console.log("Internal Server Error", err.message);
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
              style: { marginTop: 28 },
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
            style: { marginTop: 28 },
            animationType: "slide-in",
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   console.log("emailerror:", values.email, errors.email);
  // });

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
    },
    validationSchema: EmailValidationSchema,
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
            backgroundColor: "white",
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        >
          <View className="w-[90%] mx-auto justify-center mt-[45px]">
            <Text className="font-montmedium font-bold text-[34px] leading-[38px] tracking-wider text-bigText w-[60%] mt-[60px] mb-[20px] pt-1">
              Email ID Verification
            </Text>
            <Text className="font-popmedium font-normal text-[13px] leading-[18px] text-smallText my-3">
              Enter your Email Id below.
            </Text>
            <Text className="font-popmedium font-normal text-[13px] leading-[18px] text-smallText">
              We will send a 4 digit verification code to verify your Email
              Address.
            </Text>
          </View>

          <View className="w-[88%] mx-auto mt-[50px]">
            <PrimaryInput
              label={"Email Id"}
              placeholder={"Enter email id"}
              keyboardType={"email-address"}
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

                setFieldTouched("email", true, true);
                handleChange("email")(trimmedValue);
                setApiErrors(null);
              }}
              error={
                ApiErrors
                  ? ApiErrors
                  : touched.email && errors.email
                  ? errors.email
                  : null
              }
            />
            <View className="my-5">
              <PrimaryButton
                onPress={() => {
                  // console.log("clikedd in register", values);
                  // console.log("errors:", errors.email && errors?.email);
                  handleSubmit();
                }}
              >
                Next
              </PrimaryButton>
            </View>
          </View>

          <View className="flex-row justify-center items-center my-5">
            <Text className="font-montmedium font-normal leading-[17px] text-[14px] text-smallText">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                // console.log("clicked");
                navigation.goBack();
              }}
            >
              <Text className="font-montmedium font-semibold leading-[17px] text-[14px] text-black">
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default EmailRegister;

const styles = StyleSheet.create({});
