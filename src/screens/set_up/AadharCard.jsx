import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useFormik } from "formik";
import {
  get_aadhar_validation_link,
  SEND_aadharotp,
  validate_aadhar,
} from "../../Network/ApiCalling";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";

import PrimaryInput from "../custom_screens/PrimaryInput";
import PrimaryButton from "../custom_screens/PrimaryButton";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import Loader from "../custom_screens/Loader";
import BackToLogin from "../custom_screens/BackToLogin";
import { AADHAR_verificationSchema } from "../../Network/Schema";
import AsyncStorage_Calls from "../../utils/AsyncStorage_Calls";
import { setKYCStatus } from "../redux/action/KYCverify";
import WebView from "react-native-webview";

const AadharCard = () => {
  const navigation = useNavigation();
  const toast = useToast();

  const dispatch = useDispatch();

  const token = useSelector((state) => state.login.token);

  const [loading, setLoading] = useState(false);

  const [generatedURL, setGeneratedURL] = useState(null);
  const [clearedNumber, setclearedNumber] = useState(null);
  const [tsTransId, setTsTransId] = useState(null);

  const [ApiAadharError, setApiAadharError] = useState(null);

  // const onSubmit = async (values) => {
  //   // console.log(">>>", values, token);
  //   // console.log("in the send aadhar otp API");
  //   try {
  //     setLoading(true);
  //     const res = await SEND_aadharotp(values, token);
  //     // console.log(">>>>", res.data.countries);
  //     if (res.status === 200) {
  //       // console.log("otp response$$$$:", res.data);

  //       toast.show(res.data.data.msg, {
  //         type: "success",
  //         placement: "top",
  //         duration: 4000,
  //         offset: 30,
  //         animationType: "slide-in",
  //       });

  //       navigation.navigate("AadharVerify", {
  //         aadhar_no: values.aadhar_no,
  //         tsTransId: res.data.data.tsTransId,
  //       });
  //       // setMandalData(res.data.mandals);
  //     }
  //   } catch (err) {
  //     // console.log("Error all state", err.response.data);
  //     if (err) {
  //       if (err.response) {
  //         const status = err.response.status;

  //         if (status === 400) {
  //           // console.log("Error With 400 %%%", err.response.data.message);
  //           toast.show(
  //             err.response.data.message || "please check aadhar number",
  //             {
  //               type: "danger",
  //               placement: "top",
  //               duration: 4000,
  //               offset: 30,
  //               animationType: "slide-in",
  //             }
  //           );
  //         } else if (status === 422) {
  //           // console.log("422 error", err.response.data.error);
  //           if (err.response.data.error) {
  //             toast.show(err.response.data.error, {
  //               type: "danger",
  //               placement: "top",
  //               duration: 4000,
  //               offset: 30,
  //               animationType: "slide-in",
  //             });
  //           }
  //           if (err.response.data.data.msg) {
  //             toast.show(err.response.data.data.msg, {
  //               type: "danger",
  //               placement: "top",
  //               duration: 4000,
  //               offset: 30,
  //               animationType: "slide-in",
  //             });
  //           }
  //         } else if (status === 301) {
  //           console.log("301 error", err.response.data);
  //         } else if (status === 401) {
  //           toast.show("Technical issue detected. Please try again later", {
  //             type: "warning",
  //             placement: "top",
  //             duration: 4000,
  //             offset: 30,
  //             animationType: "slide-in",
  //           });
  //         } else if (status === 404) {
  //           console.log("404 error", err.response.data);
  //         } else if (status === 500) {
  //           Alert.alert(
  //             "Internal Server Error",
  //             "Please Check your Internet Connection"
  //           );
  //         } else {
  //           // console.log("An error occurred response.>>");
  //           toast.show("Oops! Something happened — please try again", {
  //             type: "warning",
  //             placement: "top",
  //             duration: 4000,
  //             offset: 30,
  //             animationType: "slide-in",
  //           });
  //         }
  //       } else if (err.request) {
  //         // console.log("No Response Received From the Server.");
  //         if (err.request.status === 0) {
  //           Alert.alert(
  //             "No Network Found",
  //             "Please Check your Internet Connection"
  //           );
  //         }
  //       } else {
  //         // console.log("Error in Setting up the Request.");
  //         toast.show("Oops! Something went wrong—please try again", {
  //           type: "warning",
  //           placement: "top",
  //           duration: 4000,
  //           offset: 30,
  //           animationType: "slide-in",
  //         });
  //       }
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onSubmit = async (values) => {
    let cleanedAadharNo = "";
    if (typeof values === "string") {
      cleanedAadharNo = values.replace(/-/g, "");
    } else if (typeof values === "object" && values.aadhar_no) {
      cleanedAadharNo = values.aadhar_no.replace(/-/g, "");
    }

    if (cleanedAadharNo) {
      // console.log("rey edhi aadhar number++", cleanedAadharNo);
      setclearedNumber(cleanedAadharNo);
    }

    try {
      setLoading(true);
      const res = await get_aadhar_validation_link(values, token);
      // console.log("API Response:", res);
      if (res.status === 200) {
        console.log("setGeneratedURL $$$$:", res.data);

        setGeneratedURL(res.data.data.data.url);
        setTsTransId(res.data.data.ts_trans_id);
        // navigation.navigate("AadharVerify", {
        //   aadhar_no: values.aadhar_no,
        //   tsTransId: res.data.data.tsTransId,
        // });
      }
    } catch (err) {
      console.log("Error all state in Aadhar card", err.response.data.data);
      if (err) {
        if (err.response) {
          const status = err.response.status;

          if (status === 400) {
            // console.log("Error With 400 %%%", err.response.data.message);
            toast.hideAll();
            toast.show("please check aadhar number toaster 1", {
              type: "danger",
              placement: "top",
              duration: 4000,
              offset: 30,
              style: { marginTop: 28 },
              animationType: "slide-in",
            });
          } else if (status === 422) {
            // console.log("422 error", err.response.data.error);
            setApiAadharError(err.response.data.error);
            // err.response.data.data.status=1049 data.msg=""
          } else if (status === 301) {
            console.log("301 error", err.response.data);
          } else if (status === 401) {
            // console.log("401 error", err.response.data);
            toast.hideAll();
            toast.show("Technical issue detected. Please try again later", {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 30,
              style: { marginTop: 28 },
              animationType: "slide-in",
            });
          } else if (status === 404) {
            console.log("404 error", err.response.data);
          } else if (status === 500) {
            console.log("500 error", err.response.data);
            Alert.alert(
              "Internal Server Error",
              "Please Check your Internet Connection"
            );
          } else {
            // console.log("An error occurred response.>>");
            toast.hideAll();
            toast.show("Oops! Something happened — please try again", {
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
      aadhar_no: "",
    },
    validationSchema: AADHAR_verificationSchema,
    onSubmit,
  });

  const handleShouldStartLoad = (request) => {
    console.log("uri,", request.url);

    // request.url.includes(
    //   "truthscreen.com/eaadhaarDigilocker/digi_callback_uri"
    // ) ||

    if (
      request.url === "https://www.truthscreen.com/EaadhaarDigilocker/thankyou"
    ) {
      setTimeout(() => {
        handleDigiVerify(); // Ensure function runs first
        setGeneratedURL(null);
        return false; // Prevent WebView from loading after 2.5 seconds
      }, 1000);

      // navigation.goBack();
      // return false; // Prevent WebView from loading the page
    }

    return true;
  };

  const handleDigiVerify = async () => {
    try {
      setLoading(true);
      const res = await validate_aadhar(tsTransId, token);
      console.log(">>>>inDigi", res.data);
      if (res.status === 200) {
        // console.log("msg verify otp:", res.data.data.msg);

        toast.hideAll();
        toast.show("Aadhaar Verified! Your identity is secure..!", {
          type: "success",
          placement: "top",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
          style: { marginTop: 28 },
        });

        AsyncStorage_Calls.setTokenJWT(
          "userKYC",
          "step-2:AadharVerificationDone",
          function (res, status) {
            if (status) {
              // console.log("Async storage lo set userKYC step2--->", status);
              dispatch(setKYCStatus("step-2:AadharVerificationDone"));
            } else {
              console.log("Error in AsyncStorage:");
            }
          }
        );

        setTimeout(() => {
          navigation.navigate("PanCard");
        }, 1500);
      }
    } catch (err) {
      console.log("Error in the aadhar digi Verify", err.response.data);
      toast.hideAll();
      toast.show("Your Aadhaar is not verified. Please verify again.", {
        type: "danger",
        placement: "top",
        duration: 4000,
        offset: 30,
        // style: { marginTop: 28 },
        animationType: "slide-in",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />
      {generatedURL ? (
        // Render WebView if URL is available
        <WebView
          style={styles.container}
          source={{ uri: generatedURL }}
          injectedJavaScript={`
            document.body.style.fontSize = '20px';
            document.body.style.padding = '0px';
            document.body.style.marginBottom = '20px';
            document.body.style.lineHeight = '1.6';
            document.getElementById("aadhaar_1").value =${clearedNumber};
            true;
          `}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
        />
      ) : (
        <SafeAreaView style={{ flex: 1 }}>
          <View className="w-[90%] mx-auto justify-center">
            <Text className="font-montmedium font-bold text-[32px] leading-[34px] tracking-wider text-bigText w-[60%] mt-[60px] mb-[20px] pt-1">
              Aadhar Card
            </Text>

            <Text className="font-popmedium font-normal text-[13px] leading-[18px] text-smallText">
              Enter your aadhar number to register your account
            </Text>
            <View className="">
              <PrimaryInput
                placeholder={"xxxx-xxxx-xxxx"}
                keyboardType={"number-pad"}
                maxLength={14}
                inputMode={"numeric"}
                value={values.aadhar_no}
                onBlur={handleBlur("aadhar_no")}
                onChangeText={(value) => {
                  const digitsOnly = value.replace(/\D/g, "");
                  const formattedValue = digitsOnly.replace(
                    /(\d{4})(?=\d)/g,
                    "$1-"
                  );
                  // console.log(formattedValue);
                  setFieldTouched("aadhar_no", true, true);
                  handleChange("aadhar_no")(formattedValue);

                  setApiAadharError(null);
                }}
                error={
                  ApiAadharError
                    ? ApiAadharError
                    : touched.aadhar_no && errors.aadhar_no
                    ? errors.aadhar_no
                    : null
                }
              />
            </View>
            <Text className="font-popmedium font-normal text-[13px] leading-[18px] text-smallText w-[80%] mx-auto text-center mt-[25px]">
              OTP will be sent to the phone number linked with aadhar card
            </Text>
            <View className="my-6 pt-3">
              <PrimaryButton
                // direction={"AadharVerify"}
                onPress={() => handleSubmit()}
              >
                Send OTP
              </PrimaryButton>
            </View>
            <BackToLogin />
          </View>

          {/* <View className="flex items-end absolute bottom-9 right-5">
            <Pressable
              onPress={() => {
                console.log("Skip");
                AsyncStorage_Calls.setTokenJWT(
                  "userKYC",
                  "step-2:AadharVerificationDone",
                  function (res, status) {
                    if (status) {
                      // console.log("Async storage lo set userKYC step2--->", status);
                      dispatch(setKYCStatus("step-2:AadharVerificationDone"));
                    } else {
                      console.log("Error in AsyncStorage:");
                    }
                  }
                );

                setTimeout(() => {
                  navigation.navigate("PanCard");
                }, 1500);
              }}
            >
              <Text className="pr-5 underline text-[#44699c] text-[16px] lowercase">
                {`Skip>>`}
              </Text>
            </Pressable>
          </View> */}
        </SafeAreaView>
      )}
    </>
  );
};

export default AadharCard;

const styles = StyleSheet.create({});
