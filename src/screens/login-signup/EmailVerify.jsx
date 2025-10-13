import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  BackHandler,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { reSend_OTP, verify_OTP } from "../../Network/ApiCalling";
import { useNavigation } from "@react-navigation/native";
import { OtpInput } from "react-native-otp-entry";
import { useToast } from "react-native-toast-notifications";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import PrimaryButton from "../custom_screens/PrimaryButton";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import Loader from "../custom_screens/Loader";

const EmailVerify = ({ route }) => {
  const { email, status } = route.params;
  // console.log("email :", email, " status", status);

  const toast = useToast();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const [ApiError, setApiError] = useState("");
  const [otpEntry, setOtpEntry] = useState("");

  const otpRef = useRef(null);

  const onBackPress = () => {
    // Prevent going back by default
    handleNavigation();
    return true; // Returning true prevents the default back behavior
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, []);

  const handleNavigation = (direction) => {
    // console.log("direction", direction);
    Alert.alert(
      "Confirmation Needed",
      "The email appears to be incorrect. Do you want to go back and fix it?",
      [
        { text: "Cancel", style: "cancel" }, // Keep the user on the screen
        {
          text: "Go Back",
          onPress: () => {
            BackHandler.removeEventListener("hardwareBackPress", onBackPress);
            navigation.goBack();
          }, // Navigate back
        },
      ]
    );
  };

  const handleVerify = async (otp) => {
    // console.log("vaidate>>>", email, otp);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("otp", otp);

    try {
      setLoading(true);
      const res = await verify_OTP(formData);
      // console.log(">>>>", res);
      if (res.status === 200) {
        // console.log("msg verify otp:", res.data.msg);

        toast.hideAll();
        toast.show(res.data.msg, {
          type: "success",
          placement: "top",
          duration: 4000,
          offset: 30,
          style: { marginTop: 28 },
          animationType: "slide-in",
        });

        // if (status === "Forgot_password") {
        navigation.navigate("CreatePassword", {
          token: res.data.token,
          FromStatus: status,
        });

        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        // } else if (status === "Create_Account") {
        //   navigation.navigate("NewPassword", {
        //     token: res.data.token,
        //     FromStatus: status,
        //   });
        // }

        setTimeLeft("");
        setIsResendEnabled("");

        if (otpRef.current) {
          otpRef.current.clear();
          setOtpEntry("");
        }
      }
    } catch (err) {
      console.log(
        "Error in the Email Verify",
        err.response.status,
        "||",
        err.response.data
      );

      if (err) {
        if (err.response) {
          const status = err.response.status;

          // console.log("Error responses in the Email verify", err.response.data);
          if (status === 400) {
            console.log("Error With 400.");
          } else if (status === 422) {
            // console.log("422 error>>", err.response.data);

            if (otpRef.current) {
              otpRef.current.clear();
              setOtpEntry("");
            }

            toast.hideAll();
            toast.show(err.response.data.error, {
              type: "danger",
              placement: "top",
              duration: 4000,
              offset: 30,
              style: { marginTop: 28 },
              animationType: "slide-in",
            });

            setApiError(err.response.data.error);
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
              style: { marginTop: 28 },
              animationType: "slide-in",
            });
          }
        } else if (err.request) {
          // console.log("No Response Received From the Server.");
          if (err.request.status === 0) {
            console.log("error in request ", err.request.status);
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

  const handleResend = async () => {
    console.log("resend", email);

    setTimeLeft(120);
    setIsResendEnabled(false);

    if (otpRef.current) {
      otpRef.current.clear();
      setOtpEntry("");
    }

    const formData = new FormData();
    formData.append("email", email);
    try {
      setLoading(true);
      const res = await reSend_OTP(formData);
      // console.log(">>>>", res);
      if (res.status === 200) {
        // console.log("msg resend otp:", res.data.msg);

        toast.hideAll();
        toast.show("OTP sent successfully", {
          type: "success",
          placement: "top",
          duration: 4000,
          offset: 30,
          style: { marginTop: 28 },
          animationType: "slide-in",
        });
      }
    } catch (err) {
      // console.log("Error in the resend", err.response.data);
      if (err) {
        if (err.response) {
          const status = err.response.status;
          // console.log(
          //   "Error responses in the resend verify",
          //   err.response.data
          // );
          if (status === 400) {
            console.log("Error With 400.");
          } else if (status === 422) {
            console.log("422 error..???:", err.response.data);
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
            style: { marginTop: 28 },
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
    const sanitizedOtp = otp.replace(/[.,\s-]/g, "");

    if (ApiError) {
      setApiError(!ApiError);
    }

    setOtpEntry(sanitizedOtp);

    // Update ref value if available
    if (otpRef.current) {
      otpRef.current.setValue(sanitizedOtp);
    }
    // console.log("OTP is length:", otp.length);
  };

  const handleFilled = (otp) => {
    console.log("OTP is complete:", otp);
    // handleVerify(otp);
  };

  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
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
            style={{ flex: 0.4 }}
          >
            <Text className="font-montmedium font-bold text-[34px] leading-[34px] tracking-wider text-bigText mt-[60px] mb-[20px] pt-1">
              Verification Code
            </Text>
            <Text className="font-popmedium font-normal text-[13px] leading-[18px] text-smallText mb-3">
              We have sent the verification code to your Email ID
            </Text>
            <Pressable
              className="flex flex-row items-center"
              onPress={() => {
                if (status === "Forgot_password") {
                  // navigation.navigate("ChangePassword");
                  handleNavigation("ChangePassword");
                } else {
                  handleNavigation("EmailRegister");
                  // navigation.navigate("EmailRegister");
                }
              }}
            >
              <Text className="font-montmedium font-normal text-[13.5px] leading-[26px] text-bigText pt-[2px] pr-[2px]">
                {email}
              </Text>
              <FontAwesome6 name="edit" size={16} color="black" />
            </Pressable>
          </View>
          <View className="w-[55%] mx-auto">
            <OtpInput
              ref={otpRef}
              numberOfDigits={4}
              focusColor="green"
              // value={otpEntry}
              focusStickBlinkingDuration={500}
              // onTextChange={handleOtpChange}
              onFilled={handleFilled}
              type="numeric"
              textInputProps={{
                accessibilityLabel: "One-Time Password",
                onChangeText: handleOtpChange,
                onKeyPress: (event) => {
                  if (/[.,\s-]/.test(event.nativeEvent.key)) {
                    event.preventDefault(); // Prevent invalid characters from being typed
                  }
                },
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
          <TouchableOpacity
            onPress={() => {
              if (isResendEnabled) {
                handleResend();
              }
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
          </TouchableOpacity>
          <View className="w-[80%] mx-auto my-6">
            <PrimaryButton
              onPress={() => {
                if (otpEntry.length > 0 && otpEntry.length < 4) {
                  toast.hideAll();
                  toast.show("OTP must be 4 digits long", {
                    type: "danger",
                    placement: "top",
                    duration: 4000,
                    offset: 30,
                    style: { marginTop: 28 },
                    animationType: "slide-in",
                  });
                } else if (otpEntry.length === 0) {
                  toast.hideAll();
                  toast.show("OTP is required", {
                    type: "danger",
                    placement: "top",
                    duration: 4000,
                    offset: 30,
                    style: { marginTop: 28 },
                    animationType: "slide-in",
                  });
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

export default EmailVerify;

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
