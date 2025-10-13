import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryInput from "../custom_screens/PrimaryInput";
import PrimaryButton from "../custom_screens/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import { verify_PAN } from "../../Network/ApiCalling";
import { PAN_verificationSchema } from "../../Network/Schema";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../custom_screens/Loader";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import AsyncStorage_Calls from "../../utils/AsyncStorage_Calls";
import { setKYCStatus } from "../redux/action/KYCverify";
import { useToast } from "react-native-toast-notifications";
import BackToLogin from "../custom_screens/BackToLogin";

const PanCard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.login.token);

  const [ApiError, setApiError] = useState({
    number: "",
    name: "",
    dob: "",
  });

  const onSubmit = async (values) => {
    // console.log(">>>>Values>>>", values);

    const formData = new FormData();
    formData.append("pan_no", values.pan_no);
    formData.append("name", values.name);
    formData.append("dob", values.dob);

    try {
      setLoading(true);
      const res = await verify_PAN(formData, token);
      // console.log(">>>>", res);
      if (res.status === 200) {
        // console.log("msg verify otp:", res.data);
        if (res.data.data.msg === "Record not found") {
          toast.hideAll();
          toast.show(res.data.data.msg, {
            type: "danger",
            placement: "top",
            duration: 4000,
            offset: 30,
            style: { marginTop: 28 },
            animationType: "slide-in",
          });
        } else {
          // console.log("successfully", res.data);
          AsyncStorage_Calls.setTokenJWT(
            "userKYC",
            "step-3:PANVerificationDone",
            function (res, status) {
              if (status) {
                // console.log("Async storage lo set userKYC step3:", status);
                dispatch(setKYCStatus("step-3:PANVerificationDone"));

                // navigation.navigate("BankDetails");
              } else {
                console.log("Error in the Storage Step3");
              }
            }
          );

          setTimeout(() => {
            navigation.navigate("BankDetails");
          }, 1500);
        }
      }
    } catch (err) {
      // console.log("Error in the pan Verify", err.response.status);
      // if (err) {
      if (err.response) {
        const status = err.response.status;

        // console.log("Error responses in the pan verify", err.response.data);
        if (status === 400) {
          if (err.response.data.status === "error") {
            toast.hideAll();
            toast.show(err.response.data.data.msg, {
              type: "danger",
              placement: "top",
              duration: 4000,
              offset: 30,
              style: { marginTop: 28 },
              animationType: "slide-in",
            });
          }
        } else if (status === 422) {
          console.log("422 error", err.response.data);
          if (err.response.data.message === "Invalid date of birth") {
            setApiError((prev) => ({
              ...prev,
              dob: "Invalid date of birth",
            }));
          } else if (err.response.data.message === "Invalid name") {
            setApiError((prev) => ({
              ...prev,
              name: "Invalid name",
            }));
          } else {
            toast.hideAll();
            toast.show(err.response.data.message || err.response.data.error, {
              type: "danger",
              placement: "top",
              duration: 4000,
              offset: 30,
              style: { marginTop: 28 },
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
          // console.log("Internal Server Error", err.response.data.data.msg);
          // if (err.response.data.data.msg) {
          // toast.hideAll();
          // toast.show(err.response.data.data.msg, {
          //   type: "danger",
          //   placement: "top",
          //   duration: 4000,
          //   offset: 30,
          //   style: { marginTop: 28 },
          //   animationType: "slide-in",
          // });
          Alert.alert(
            "Internal Server Error",
            "Please Check your Internet Connection"
          );
          // }
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
      // }
    } finally {
      setLoading(false);
    }
  };

  const formatDateInput = (value) => {
    const cleanValue = value.replace(/\D/g, "");

    // Split into parts for day, month, and year
    const day = cleanValue.slice(0, 2);
    const month = cleanValue.slice(2, 4);
    const year = cleanValue.slice(4, 8);

    // Construct the formatted string
    if (cleanValue.length <= 2) return day;
    if (cleanValue.length <= 4) return `${day}/${month}`;
    return `${day}/${month}/${year}`;
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
      pan_no: "",
      name: "",
      dob: "",
    },
    validationSchema: PAN_verificationSchema,
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

      <SafeAreaView style={{ flex: 1 }}>
        <View className="w-[90%] mx-auto justify-center">
          <Text className="font-montmedium font-bold text-[32px] leading-[34px] tracking-wider text-bigText w-[60%] mt-[60px] mb-[20px] ">
            PAN Number
          </Text>

          <Text className="font-popmedium font-normal text-[13px] leading-[18px] text-smallText">
            Enter your PAN number to register your account
          </Text>
          <View className="">
            <PrimaryInput
              label={"PAN Number"}
              star={true}
              placeholder={"ABCDE1234F"}
              keyboardType={"default"}
              autoCapitalize={"characters"}
              maxLength={10}
              value={values.pan_no}
              onBlur={handleBlur("pan_no")}
              onChangeText={(value) => {
                const emojiRegex =
                  /[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

                const FilterValue = value
                  .toUpperCase()
                  .replace(emojiRegex, "")
                  .replace(/[^A-Z0-9]/g, "")
                  .replace(/\s/g, "");

                setFieldTouched("pan_no", true, true);

                handleChange("pan_no")(FilterValue);
                setApiError((prev) => ({
                  ...prev,
                  number: null,
                }));
              }}
              error={
                ApiError.number
                  ? ApiError.number
                  : touched.pan_no && errors.pan_no
                  ? errors.pan_no
                  : null
              }
            />
            <PrimaryInput
              label={"Date Of Birth"}
              placeholder={"DD/MM/YYYY"}
              star={true}
              keyboardType={"numeric"}
              value={values.dob}
              maxLength={10}
              onBlur={handleBlur("dob")}
              onChangeText={(value) => {
                const digitsOnly = value.replace(/\D/g, "");

                const formattedValue = formatDateInput(digitsOnly);
                setFieldTouched("dob", true, true);
                handleChange("dob")(formattedValue);

                setApiError((prev) => ({
                  ...prev,
                  dob: null,
                }));
              }}
              error={
                ApiError.dob
                  ? ApiError.dob
                  : touched.dob && errors.dob
                  ? errors.dob
                  : null
              }
            />

            <PrimaryInput
              label={"Name"}
              star={true}
              placeholder={"Enter name as Per your Pan card"}
              keyboardType={"default"}
              autoCapitalize={"characters"}
              value={values.name}
              onBlur={handleBlur("name")}
              onChangeText={(value) => {
                const emojiRegex =
                  /[\uD800-\uDBFF][\uDC00-\uDFFF]|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

                const FilterValue = value
                  .toUpperCase()
                  .replace(emojiRegex, "")
                  .replace(/[^A-Z\s]/g, "")
                  .replace(/^[^A-Za-z]+/, "")
                  .replace(/ {2,}/g, " ");

                // const filteredValue = value
                // .replace(emojiRegex, "")
                // .replace(/^[^A-Za-z]+/, "")
                // .replace(/[^A-Za-z ]/g, "")

                setFieldTouched("name", true, true);
                handleChange("name")(FilterValue);

                setApiError((prev) => ({
                  ...prev,
                  name: null,
                }));
              }}
              error={
                ApiError.name
                  ? ApiError.name
                  : touched.name && errors.name
                  ? errors.name
                  : null
              }
            />
          </View>
          <View className="my-6 ">
            <PrimaryButton
              onPress={() => {
                // navigation.navigate("BankDetails");
                handleSubmit();
              }}
            >
              Next
            </PrimaryButton>
          </View>
          <BackToLogin />
        </View>
      </SafeAreaView>
    </>
  );
};

export default PanCard;

const styles = StyleSheet.create({});
