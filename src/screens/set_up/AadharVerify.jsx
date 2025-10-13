import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useNavigation } from "@react-navigation/native";
import { OtpInput } from "react-native-otp-entry";
import { useDispatch, useSelector } from "react-redux";
import { SEND_aadharotp, verifyAadhar_OTP } from "../../Network/ApiCalling";
import { setKYCStatus } from "../redux/action/KYCverify";
import { useToast } from "react-native-toast-notifications";

import PrimaryButton from "../custom_screens/PrimaryButton";
import Loader from "../custom_screens/Loader";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import AsyncStorage_Calls from "../../utils/AsyncStorage_Calls";

const AadharVerify = ({ route }) => {
  const { aadhar_no, tsTransId } = route.params;
  // console.log("tsTransId :", tsTransId);
  // console.log("aadhar_no :", aadhar_no);

  const toast = useToast();
  const otpRef = useRef(null);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [Trans_Id, setTrans_Id] = useState();
  useEffect(() => {
    setTrans_Id(tsTransId);
  }, []);

  const token = useSelector((state) => state.login.token);

  const [loading, setLoading] = useState(false);

  const [ApiError, setApiError] = useState("");
  const [otpEntry, setOtpEntry] = useState("");

  const handleResend = async () => {
    // console.log(">>>", aadhar_no);
    // console.log("in the send aadhar otp API");

    setTimeLeft(120);
    setIsResendEnabled(false);

    if (otpRef.current) {
      otpRef.current.clear();
    }

    try {
      setLoading(true);
      const res = await SEND_aadharotp(aadhar_no, token);
      // console.log(">>>>", aadhar_no);
      if (res.status === 200) {
        // console.log("otp response:", res.data.data.msg);

        toast.hideAll();
        toast.show(res.data.data.msg, {
          type: "success",
          placement: "top",

          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });

        setTrans_Id(res.data.data.tsTransId);
        // setMandalData(res.data.mandals);
      }
    } catch (err) {
      // console.log("Error all state", err.response.data);
      if (err) {
        if (err.response) {
          const status = err.response.status;
          const message = err.response.data.error;
          if (status === 400) {
            console.log("Error With 400%% %%");
          } else if (status === 422) {
            // console.log("422 error", err.response.data.error);

            toast.hideAll();
            toast.show(err.response.data.error, {
              type: "danger",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
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
              animationType: "slide-in",
            });
          } else if (status === 404) {
            console.log("404 error", err.response.data);
          } else if (status === 500) {
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

  const handleVerify = async (otp) => {
    console.log("vaidate>>>|||", tsTransId, otp);

    const formData = new FormData();
    formData.append("otp", otp);
    formData.append("tsTransId", Trans_Id);

    try {
      setLoading(true);

      const res = await verifyAadhar_OTP(formData, token);
      // console.log(">>>>", res.data.data);
      if (res.status === 200) {
        // console.log("msg verify otp:", res.data.data.msg);

        toast.hideAll();
        toast.show("Aadhaar Verified! Your identity is secure..!", {
          type: "success",
          placement: "top",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });

        if (otpRef.current) {
          otpRef.current.clear();
        }

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
      console.log("Error in the Email Verify", err.response.data);
      if (err) {
        if (err.response) {
          const status = err.response.status;
          // console.log("Error responses in the Email verify", err.response.data);
          if (status === 400) {
            console.log("Error With 400! ##");
          } else if (status === 422) {
            // errors.email = message;
            if (otpRef.current) {
              otpRef.current.clear();
            }

            toast.hideAll();
            toast.show(err.response.data.data.msg, {
              type: "danger",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });

            setApiError(err.response.data.data.msg);

            // console.log("422 error", err.response.data);
          } else if (status === 301) {
            console.log("301 error", err.response.data);
          } else if (status === 401) {
            console.log("401 error @@@", err.response.data);
            //look at this once
            toast.hideAll();
            toast.show("Technical issue detected. Please try again later", {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
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
            toast.show("Oops! Something happened —please try again", {
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

  const handleOtpChange = (otp) => {
    // console.log("Entered OTP:", otp);
    if (ApiError) {
      setApiError(!ApiError);
    }
    setOtpEntry(otp);
  };
  const handleFilled = (otp) => {
    // console.log("OTP is complete:", otp);
    handleVerify(otp);
  };

  const [timeLeft, setTimeLeft] = useState(120); // 3 minutes in seconds
  const [isResendEnabled, setIsResendEnabled] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setIsResendEnabled(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

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
          {/* <SafeAreaView style={{ flex: 1 }}> */}
          <View
            className="w-[90%] mx-auto justify-center"
            style={{ flex: 0.45 }}
          >
            <Text className="font-montmedium font-bold text-[34px] leading-[34px] tracking-wider text-bigText mt-[60px] mb-[20px] pt-1">
              Verification code
            </Text>
            <Text className="font-popmedium font-normal text-[13px] leading-[18px] text-smallText mb-3">
              We have sent the verification code to your Phone Number
            </Text>
          </View>
          <View>
            <OtpInput
              ref={otpRef}
              numberOfDigits={6}
              focusColor="green"
              focusStickBlinkingDuration={500}
              onTextChange={handleOtpChange}
              onFilled={handleFilled}
              textInputProps={{
                accessibilityLabel: "One-Time Password",
              }}
              theme={{
                containerStyle: styles.container,
                pinCodeContainerStyle: [
                  styles.pinCodeContainer,
                  { borderColor: ApiError ? "red" : "gray" }, // Add conditional border color here
                ],
                pinCodeTextStyle: styles.pinCodeText,
                // focusStickStyle: styles.focusStick,
                // focusedPinCodeContainerStyle: styles.activePinCodeContainer,
              }}
            />
          </View>
          <Pressable
            onPress={() => {
              handleResend();
              // console.log("resend");
            }}
            className="py-6"
          >
            <Text
              className={`font-montmedium font-semibold text-[14px] leading-[16px]  text-center ${
                isResendEnabled ? "text-[#000000]" : "text-[#B6B6B6]"
              }`}
            >
              {isResendEnabled
                ? `Resend Code`
                : `Resend Code will be available in (${formatTime(timeLeft)})`}
            </Text>
          </Pressable>
          <View className="w-[80%] mx-auto my-6">
            <PrimaryButton
              onPress={() => {
                // navigation.navigate("PanCard");
                if (otpEntry.length < 6) {
                  toast.hideAll();
                  toast.show(
                    "Please enter the 6-digit OTP to complete verification.",
                    {
                      type: "danger",
                      placement: "top",
                      duration: 4000,
                      offset: 30,
                      animationType: "slide-in",
                    }
                  );
                } else {
                  handleVerify(otpEntry);
                }
              }}
            >
              Next
            </PrimaryButton>
          </View>
          {/* </SafeAreaView> */}
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default AadharVerify;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
    marginHorizontal: "auto",

    gap: 12,
  },
  pinCodeContainer: {
    borderRadius: 8,
    height: 55,
  },
  pinCodeText: {
    // fontFamily: "Poppins-Medium",
    color: "green",
  },
  focusStick: {},
  activePinCodeContainer: {},
});
