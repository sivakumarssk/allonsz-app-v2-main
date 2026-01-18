import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import CustomStatusBar from "../custom_screens/CustomStatusBar";
import PrimaryInput from "../custom_screens/PrimaryInput";
import NavBack from "../custom_screens/NavBack";
import { useSelector } from "react-redux";
import {
  get_ProfileDetails,
  UPDATE_profile,
  verify_BANKDETAILS,
} from "../../Network/ApiCalling";
import Loader from "../custom_screens/Loader";
import { useFormik } from "formik";

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Entypo from "@expo/vector-icons/Entypo";
import PrimaryButton from "../custom_screens/PrimaryButton";
import { useToast } from "react-native-toast-notifications";
import { RFValue } from "react-native-responsive-fontsize";
import { bankSchema } from "../../Network/Schema";
import LottieView from "lottie-react-native";

const ProfileDetails = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [UserDetails, setUserDetails] = useState("");
  const [BankDetails, setBankDetails] = useState("");
  const [AadharDetails, setAadharDetails] = useState("");
  const [panDetails, setpanDetails] = useState("");

  const [modalVisible, setmodalVisible] = useState(false);

  const [showTick, setShowTick] = useState(false);

  const token = useSelector((state) => state.login.token);

  useEffect(() => {
    if (BankDetails?.msg) {
      setFieldValue("account_no", BankDetails.msg["Bank Account Number"]);
      setFieldValue("ifsc_code", BankDetails.msg["IFSC Code"]);
    }
  }, [BankDetails]);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async (isLoaded = false) => {
    try {
      if (!isLoaded) {
        setLoading(true);
      }
      const res = await get_ProfileDetails(token);
      // console.log(">>>>", res);
      if (res.status === 200) {
        // console.log("resData ||", res.data.user.pincode);
        const result = res.data.user;
        // If combo_wallet is in wallet_breakdown, merge it into user object for consistency
        if (res.data.wallet_breakdown?.combo_wallet !== undefined) {
          result.combo_wallet = res.data.wallet_breakdown.combo_wallet;
        }
        setUserDetails(result);

        const Bank_Details = JSON.parse(result.bank_details);
        console.log("Bank_Details", Bank_Details);
        setBankDetails(Bank_Details);

        const Aadhar_Details = JSON.parse(result.aadhar_details);
        console.log("Aaadhar_Details", Aadhar_Details);
        const dynamicKey = Object.keys(Aadhar_Details)[0];
        // console.log(Aadhar_Details[dynamicKey]?.msg[0]?.data);
        const decoded_details = Aadhar_Details[dynamicKey]?.msg[0]?.data;
        setAadharDetails(decoded_details);

        const Pan_Details = JSON.parse(result.pan_details);
        // console.log("Pan_Details", Pan_Details);
        setpanDetails(Pan_Details);
      }
    } catch (err) {
      // console.log("error", err.response.data);
      if (err) {
        if (err.response) {
          if (err.response.status === 400) {
            console.log("Error With 400.");
          } else if (err.response.status === 422) {
            // console.log("Error With 422.");
            toast.hideAll();
            toast.show("Oops! Something missing — please try again", {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          } else if (err.response.status === 301) {
            console.log("Error with 301");
          } else if (err.response.status === 401) {
            console.log("Error with 401");
          } else if (err.response.status === 404) {
            console.log("Error with 404");
          } else if (err.response.status === 500) {
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
            // console.log("error in request ",error.request.status)
            Alert.alert(
              "No Network Found",
              "Please Check your Internet Connection"
            );
          }
        } else {
          // console.log("Error in Setting up the Request.");
          toast.hideAll();
          toast.show(
            "Oops! Something went wrong at sever side — please try again",
            {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            }
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };

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
            setShowTick(true);
            getDetails(true);
            // setTimeout(() => {
            //   setmodalVisible(false);
            // }, 2000);
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

  const [isSecure, setIsSecure] = useState(false);

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
      account_no: "",
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

      <NavBack>Profile Details</NavBack>

      <ScrollView>
        <View className="w-[90%] mx-auto mb-5">
          <View className="flex flex-row justify-between items-center ">
            <Text className="text-bigText mt-6 mb-2 font-semibold text-[28px] leading-[34px] tracking-widest">
              My Profile
            </Text>
            {/* <Pressable
              onPress={() => {
                setmodalVisible(true);
              }}
            >
              <FontAwesome5 name="user-edit" size={24} color="black" />
            </Pressable> */}
          </View>

          <View>
            <PrimaryInput
              label={"First Name"}
              readOnly={true}
              value={UserDetails?.first_name || ""}
            />
            <PrimaryInput
              label={"Last Name"}
              readOnly={true}
              value={UserDetails?.last_name || ""}
            />
            <PrimaryInput
              label={"User Name"}
              readOnly={true}
              value={UserDetails?.username || ""}
            />
            <PrimaryInput
              label={"Email Id"}
              readOnly={true}
              value={UserDetails?.email || ""}
            />
            <PrimaryInput
              label={"Phone Number"}
              readOnly={true}
              value={UserDetails?.phone || ""}
            />
            <PrimaryInput
              label={"Gender"}
              readOnly={true}
              value={UserDetails?.gender || ""}
            />
            <PrimaryInput
              label={"Country"}
              readOnly={true}
              value={UserDetails?.country?.name || ""}
            />
            <PrimaryInput
              label={"State"}
              readOnly={true}
              value={UserDetails?.state?.name || ""}
            />
            <PrimaryInput
              label={"District"}
              readOnly={true}
              value={UserDetails?.district?.name || ""}
            />
            <PrimaryInput
              label={"Mandal"}
              readOnly={true}
              value={UserDetails?.mandal?.name || ""}
            />
            <PrimaryInput
              label={"Address"}
              readOnly={true}
              value={UserDetails?.address || ""}
            />
            <PrimaryInput
              label={"Pin Code"}
              readOnly={true}
              value={UserDetails?.pincode?.toString() || ""}
            />
            <PrimaryInput
              label={"Upliner ID"}
              readOnly={true}
              value={UserDetails?.referal_id || ""}
            />
            <PrimaryInput
              label={"Unique ID"}
              readOnly={true}
              value={UserDetails?.referal_code || ""}
            />
          </View>

          {/* Combo Wallet Section */}
          <View>
            <Text className="text-bigText mt-6 mb-2 font-semibold text-[28px] leading-[34px] tracking-widest">
              Combo Wallet
            </Text>
          </View>
          <View className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <PrimaryInput
              label={"Combo Wallet Balance"}
              readOnly={true}
              value={`₹${parseFloat(UserDetails?.combo_wallet || 0).toFixed(2)}`}
            />
            <View className="mt-2 mb-2">
              <Text className="text-smallText font-montmedium text-[12px] leading-[18px]">
                Eligibility Status:{" "}
                {UserDetails?.combo_wallet_eligible_for_withdrawal ? (
                  <Text className="text-[#4CAF50] font-semibold">
                    ✓ Eligible for withdrawal (4+ direct downlines)
                  </Text>
                ) : (
                  <Text className="text-[#FF9800] font-semibold">
                    ⚠ Not eligible for withdrawal (Need 4 direct downlines)
                  </Text>
                )}
              </Text>
            </View>
          </View>

          <View>
            <Text className="text-bigText mt-6 mb-2 font-semibold text-[28px] leading-[34px] tracking-widest">
              Aadhar details
            </Text>
          </View>
          <View>
            <PrimaryInput
              label={"Aadhar Number"}
              readOnly={true}
              value={UserDetails?.aadhar_no || ""}
            />
            {/* {console.log(Object.keys(AadharDetails)[0])} */}
            <PrimaryInput
              label={"Date Of Birth"}
              readOnly={true}
              // value={AadharDetails?.msg?.DOB || ""}
              value={AadharDetails?.dob || ""}
            />
            <PrimaryInput
              label={"Care Of (C/O)"}
              readOnly={true}
              value={AadharDetails?.co || ""}
            />
            <PrimaryInput
              label={"Village/Town/City"}
              readOnly={true}
              // value={AadharDetails?.msg?.["Village/Town/City"] || ""}
              value={AadharDetails?.address || ""}
            />
          </View>
          <View>
            <Text className="text-bigText mt-6 mb-2 font-semibold text-[28px] leading-[34px] tracking-widest">
              Pan details
            </Text>
          </View>
          <View>
            <PrimaryInput
              label={"Pan Number"}
              readOnly={true}
              value={panDetails?.msg?.panNumber || ""}
            />
          </View>
          <View className="flex flex-row justify-between items-center ">
            <Text
              style={{ fontSize: RFValue(24) }}
              className="text-bigText mt-6 mb-2 font-semibold text -[28px] leading-[34px] tracking-widest"
            >
              Bank details
            </Text>
            <Pressable
              className="flex justify-center items-center mt-[10px] mr-1"
              onPress={() => {
                setmodalVisible(true);
              }}
            >
              <FontAwesome6 name="edit" size={20} color="black" />
            </Pressable>
          </View>
          <View>
            {/* <Text>{BankDetails?.msg["Account Holder Name"]}</Text> */}
            <PrimaryInput
              label={"Account Holder Name"}
              readOnly={true}
              value={BankDetails?.msg?.["Account Holder Name"] || ""}
            />
            <PrimaryInput
              label={"Account number"}
              readOnly={true}
              value={
                // BankDetails?.result?.msg?.accountNo ||
                BankDetails?.msg?.["Bank Account Number"] || ""
              }
            />

            <PrimaryInput
              label={"Bank Name"}
              readOnly={true}
              value={BankDetails?.msg?.["Bank Name"] || ""}
            />
            <PrimaryInput
              label={"Branch"}
              readOnly={true}
              value={BankDetails?.msg?.["Bank Branch - Address"]?.Branch || ""}
            />

            <PrimaryInput
              label={"IFSC CODE"}
              readOnly={true}
              value={
                // BankDetails?.result?.msg?.ifsc ||
                BankDetails?.msg?.["IFSC Code"] || ""
              }
            />
          </View>
        </View>
      </ScrollView>

      {/* <Modal */}
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <CustomStatusBar
          barStyle="dark-content"
          backgroundColor="#44689C"
          // translucent
        />
        <TouchableWithoutFeedback
          onPress={() => {
            // setmodalVisible(false);
          }}
        >
          <View className="flex-1 justify-center items-center bg-[#0000005e]">
            <TouchableWithoutFeedback
              onPress={() => {
                // console.log("clicked");
              }}
            >
              <View className="bg-white w-[80%] rounded py-3 px-5">
                {!showTick ? (
                  <>
                    <View className="relative">
                      <Text className="text-center font-montmedium font-semibold text-[18px]">
                        Update Bank Details
                      </Text>
                      <Pressable
                        className="absolute -top-[6px] -right-[15px] p-2"
                        onPress={() => {
                          setmodalVisible(false);
                        }}
                      >
                        <Entypo name="cross" size={24} color="black" />
                      </Pressable>
                    </View>
                    <PrimaryInput
                      label={"Account number"}
                      star={true}
                      placeholder={"XXXXXXXXXXXX"}
                      keyboardType={"default"}
                      inputMode={"numeric"}
                      extrastyles={"mt-4"}
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
                    <PrimaryInput
                      label={"IFSC CODE"}
                      star={true}
                      placeholder={"AAAA0BBBBBB"}
                      keyboardType={"default"}
                      extrastyles={"-mt-2"}
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
                        touched.ifsc_code && errors.ifsc_code
                          ? errors.ifsc_code
                          : null
                      }
                    />
                    <View className="mb-2">
                      <PrimaryButton onPress={() => handleSubmit()}>
                        Update
                      </PrimaryButton>
                    </View>
                  </>
                ) : (
                  <View className="my-4 mx-auto">
                    <LottieView
                      source={require("../../styles/images/Right_Animation.json")}
                      autoPlay
                      loop={false}
                      speed={0.5} // Speed up the animation
                      onAnimationFinish={() => {
                        setmodalVisible(false);
                        setShowTick(false);
                      }}
                      style={{
                        width: 200,
                        height: 200,
                      }}
                    />
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default ProfileDetails;

const styles = StyleSheet.create({});
