import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import CustomStatusBar from "../../custom_screens/CustomStatusBar";
import NavBack from "../../custom_screens/NavBack";
import PrimaryInput from "../../custom_screens/PrimaryInput";
import PrimaryButton from "../../custom_screens/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { update_RefferealCode } from "../../../Network/ApiCalling";
import Loader from "../../custom_screens/Loader";
import { useToast } from "react-native-toast-notifications";

const RTCRefferealCode = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.login.token);

  const toast = useToast();

  const onSubmit = async (values) => {
    // console.log("values>>>>", values);

    try {
      setLoading(true);
      const res = await update_RefferealCode(values, token);
      console.log(">>>>", res);
      if (res.status === 200) {
        // console.log("token", res.data);

        toast.hideAll();
        toast.show(
          "🌟Your referral code has been successfully updated! 🚀 Share it with friends and unlock exclusive rewards together. ",
          {
            type: "success",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          }
        );

        navigation.navigate("RTCSucces", { code: values.referal_code });
      }
    } catch (err) {
      // console.log("error", err.response.data);
      if (err) {
        if (err.response) {
          const status = err.response.status;
          const message = err.response.data.error;

          if (err.response.status === 400) {
            console.log("Error With 400.");
          } else if (err.response.status === 422) {
            // console.log("Error With 422.");
            toast.hideAll();
            toast.show("Oops! Something went wrong—please try again", {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          } else if (err.response.status === 301) {
            console.log("Error With 301");
          } else if (err.response.status === 401) {
            console.log("Error With 401");
          } else if (err.response.status === 404) {
            console.log("Error With 404");
          } else if (err.response.status === 500) {
            console.log("Internal Server Error");
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
      referal_code: "",
    },
    validationSchema: "",
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

      <NavBack></NavBack>

      <View className="h-[150px] flex justify-center items-center">
        <Text className="font-montmedium font-medium text-[18px] leading-[20px] text-bigText tracking-wider">
          Request to change reffereal Code
        </Text>
      </View>

      <View className="w-[90%] mx-auto mb-9">
        <PrimaryInput
          label={"Enter the New Refferal Code "}
          placeholder={"XXXX"}
          keyboardType={"default"}
          value={values.referal_code}
          onBlur={handleBlur("referal_code")}
          onChangeText={(value) => {
            setFieldTouched("referal_code", true, true);
            handleChange("referal_code")(value);
          }}
          error={
            touched.referal_code && errors.referal_code
              ? errors.referal_code
              : null
          }
        />
      </View>

      <View className="w-[90%] mx-auto">
        <PrimaryButton
          onPress={() => {
            // navigation.navigate("RTCSucces");
            handleSubmit();
          }}
        >
          Send Request
        </PrimaryButton>
      </View>
    </>
  );
};

export default RTCRefferealCode;

const styles = StyleSheet.create({});
