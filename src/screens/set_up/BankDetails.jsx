import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { verify_BANKDETAILS } from "../../Network/ApiCalling";

import PrimaryInput from "../custom_screens/PrimaryInput";
import PrimaryButton from "../custom_screens/PrimaryButton";
import Loader from "../custom_screens/Loader";
import CustomStatusBar from "../custom_screens/CustomStatusBar";

import AsyncStorage_Calls from "../../utils/AsyncStorage_Calls";
import { setKYCStatus } from "../redux/action/KYCverify";
import BackToLogin from "../custom_screens/BackToLogin";
import { bankSchema } from "../../Network/Schema";

const BankDetails = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const toast = useToast();

  const token = useSelector((state) => state.login.token);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (values) => {
    // console.log("email vaidate>>>", values);

    try {
      setLoading(true);
      const res = await verify_BANKDETAILS(values, token);
      // console.log("msg>??>>", res.data);

      const responseData = res.data;

      if (res.status === 200) {
        const status = responseData.data.status;
        console.log("status", status);
        //for Invaild Account Number and Both are invaild
        if (res && res.data) {
          // console.log("res.data1", responseData.data.status);
          if (responseData?.data?.status && responseData?.data?.status === 0) {
            // console.log("data1", responseData?.data.msg);

            if (responseData?.data?.msg) {
              toast.hideAll();
              toast.show(responseData?.data?.msg, {
                type: "danger",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
              });
            } else if (responseData.data?.msg?.status) {
              toast.hideAll();
              toast.show(responseData.data?.msg?.status, {
                type: "danger",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
              });
            }
            //for Invaild IFSC code and both correct
          } else if (
            responseData?.data?.result?.status &&
            responseData.data.result.status === 0
          ) {
            // console.log("data2");
            toast.hideAll();
            toast.show(responseData?.data?.msg.status, {
              type: "danger",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          } else {
            // console.log("else part");
            setTimeout(() => {
              navigation.navigate("SetUpSucces", {
                previousScreen: "BankVerificationScreen",
              });
            }, 500);
          }
        } else {
          // console.error("Unexpected response structure:", res);
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
    } catch (err) {
      // console.log("Error in the Email Register", err);
      if (err) {
        if (err.response) {
          const status = err.response.status;
          // console.log(
          //   "Error responses in the Email Register",
          //   err.response.data
          // );
          if (status === 400) {
            console.log("Error With 400.");
          } else if (status === 422) {
            console.log("422 error", err.response.data);
            if (err.response.data.error) {
              toast.hideAll();
              toast.show(err.response.data.error, {
                type: "danger",
                placement: "top",
                duration: 4000,
                offset: 30,
                // style: { marginTop: 28 },
                animationType: "slide-in",
              });
            } else if (err.response.data.message) {
              toast.hideAll();
              toast.show(err.response.data.message, {
                type: "danger",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
              });
            } else {
              toast.hideAll();
              toast.show("Request failed. Please try again later.", {
                type: "danger",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
              });
            }
          } else if (status === 301) {
            console.log("301 error", err.response.data);
          } else if (status === 401) {
            console.log("401 error", err.response.data);
          } else if (status === 404) {
            console.log("404 error", err.response.data);
          } else if (status === 500) {
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
      }
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
      // bank_name: "",
      // branch: "",
      account_no: "",
      // account_type: "",
      ifsc_code: "",
    },
    validationSchema: bankSchema,
    onSubmit,
  });

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View className="w-[90%] mx-auto justify-center mt-[60px] mb-[40px]">
          <Text className="font-montmedium font-bold text-[34px] leading-[34px] tracking-wider text-bigText w-[70%] pt-1">
            Bank details
          </Text>
        </View>
        <ScrollView>
          <View className="w-[90%] mx-auto">
            {/* <PrimaryInput
              label={"Bank Name"}
              placeholder={"Enter Your Bank Name"}
              keyboardType={"default"}
              autoCapitalize={"words"}
              value={values.bank_name}
              onBlur={handleBlur("bank_name")}
              onChangeText={(value) => {
                setFieldTouched("bank_name", true, true);
                handleChange("bank_name")(value);
              }}
              error={
                touched.bank_name && errors.bank_name ? errors.bank_name : null
              }
            /> */}

            {/* <PrimaryInput
              label={"Branch"}
              placeholder={"Enter Your Branch"}
              keyboardType={"default"}
              value={values.branch}
              onBlur={handleBlur("branch")}
              onChangeText={(value) => {
                setFieldTouched("branch", true, true);
                handleChange("branch")(value);
              }}
              error={touched.branch && errors.branch ? errors.branch : null}
            /> */}

            <PrimaryInput
              label={"Account number"}
              star={true}
              placeholder={"XXXXXXXXXXXX"}
              keyboardType={"default"}
              inputMode={"numeric"}
              maxLength={18}
              value={values.account_no}
              onBlur={handleBlur("account_no")}
              onChangeText={(value) => {
                const filteredValue = value.replace(/[^0-9]/g, "");

                setFieldTouched("account_no", true, true);
                handleChange("account_no")(filteredValue);
              }}
              error={
                touched.account_no && errors.account_no
                  ? errors.account_no
                  : null
              }
            />

            {/* <PrimaryInput
              label={"Account Type"}
              placeholder={"Enter Your Account Type (Saving / Current )"}
              keyboardType={"default"}
              value={values.account_type}
              onBlur={handleBlur("account_type")}
              onChangeText={(value) => {
                setFieldTouched("account_type", true, true);
                handleChange("account_type")(value);
              }}
              error={
                touched.account_type && errors.account_type
                  ? errors.account_type
                  : null
              }
            /> */}

            <PrimaryInput
              label={"IFSC CODE"}
              star={true}
              placeholder={"AAAA0BBBBBB"}
              keyboardType={"default"}
              maxLength={11}
              autoCapitalize={"characters"}
              value={values.ifsc_code}
              onBlur={handleBlur("ifsc_code")}
              onChangeText={(value) => {
                const emojiRegex =
                  /[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

                const filteredValue = value
                  .toUpperCase()
                  .replace(/[^A-Z0-9\s]/g, "")
                  .replace(emojiRegex, "")
                  .replace(/\s/g, "");

                setFieldTouched("ifsc_code", true, true);
                handleChange("ifsc_code")(filteredValue);
              }}
              error={
                touched.ifsc_code && errors.ifsc_code ? errors.ifsc_code : null
              }
            />

            <View className="my-9">
              <PrimaryButton
                onPress={() => {
                  handleSubmit();
                  // navigation.navigate("SetUpSucces");
                }}
              >
                Next
              </PrimaryButton>
            </View>

            <BackToLogin />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default BankDetails;

const styles = StyleSheet.create({});
