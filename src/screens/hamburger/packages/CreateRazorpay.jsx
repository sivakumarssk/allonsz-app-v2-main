import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import CustomStatusBar from "../../custom_screens/CustomStatusBar";
import NavBack from "../../custom_screens/NavBack";
import PrimaryButton from "../../custom_screens/PrimaryButton";
import { useSelector } from "react-redux";
import {
  Create_Razorpay_Order,
  Verify_Razorpay_Order,
} from "../../../Network/ApiCalling";
import RazorpayCheckout from "react-native-razorpay";
import Loader from "../../custom_screens/Loader";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";

const CreateRazorpay = ({ route }) => {
  const { packageId, packagePrice } = route.params || {};
  // console.log("packageId", packageId);

  const toast = useToast();

  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.login.token);

  // i need to handle Razorypay Issues
  const handlePayment = async (option) => {
    console.log("handlePayment", option);

    const options={
      description:option.description,
      order_id:option.order_id,
      image:"",
      currency:"INR",
      key:option?.key,
      amount:option?.amount,  
      name:option.prefill.name,
      prefill: {
        contact: option.prefill.contact,
        email: option.prefill.email,
        name: option.prefill.name,
      },
      theme: {
        color: option.theme.color,
      }
    }
   
    // await RazorpayCheckout.open(options)
    //   .then((data) => {
    //     //handleSuccess
    //     // console.log("Success in the Razory", data);
    //     handleVerifyRazorpayOrder(data);
    //   })
    //   .catch((error) => {
    //     console.log("error in reazorpay", error);
    //   });

    setTimeout(async () => {
      try {
        // console.log("Opening Razorpay with options:", options);
        const data = await RazorpayCheckout.open(options);
        handleVerifyRazorpayOrder(data);
      } catch (error) {
        console.log("Error in Razorpay:", error);
        toast.hideAll();
        toast.hideAll();
        toast.show("Payment canceled. Let us know if you need help!", {
          type: "warning",
          placement: "top",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      
      }
    }, 1000); 
  
  };

  const handleVerifyRazorpayOrder = async (data) => {
    console.log("hello");
    try {
      setLoading(true);
      const res = await Verify_Razorpay_Order(data, token);
      if (res.status === 200) {
        const result = res.data;
        // console.log("result", result);
        // setPackDetails(result);
        toast.hideAll();
        toast.show(result.message, {
          type: "success",
          placement: "top",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });

        setTimeout(() => {
          navigation.navigate("Packages");
        }, 800);
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
            toast.show("Oops! Something went wrong—please try again", {
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

  const handleCreateRazorpayOrder = async () => {
    // console.log("values", packageId, token);
    try {
      setLoading(true);
      const res = await Create_Razorpay_Order(packageId, token);
      if (res.status === 200) {
        const result = res.data;
        // console.log("result", result);
        // setPackDetails(result);
        handlePayment(res.data.data);
      }
    } catch (err) {
      console.log("error", err.response.data);
      if (err) {
        if (err.response) {
          const status = err.response.status;
          const message = err.response.data.error;

          if (err.response.status === 400) {
            console.log("Error With 400.");
          } else if (err.response.status === 422) {
            // console.log("Error With 422. in pay");
            toast.hideAll();
            toast.show(message, {
              type: "success",
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
          console.log("No Response Received From the Server.");
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

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <NavBack></NavBack>

      <View className="w-[88%] mx-auto my-3">
        <Text className="font-popmedium font-normal text-[16px] leading-[24px] text-bigText mt-9">
          Amount
        </Text>
        <View className="bg-[#EDFCFF] rounded flex flex-row justify-between items-center px-3 py-4 mt-6">
          <TextInput
            value={packagePrice}
            className="font-popmedium font-normal text-[14px] leading-[21px] text-bigText"
          />
          <Text className="font-popmedium font-normal text-[17px] leading-[24px] text-bigText">
            INR
          </Text>
        </View>
      </View>
      <View className="w-[90%] mx-auto mt-[45px]">
        <PrimaryButton
          onPress={() => {
            // navigation.navigate("PaymentDone");
            handleCreateRazorpayOrder();
          }}
        >
          Confirm Payment
        </PrimaryButton>
      </View>
    </>
  );
};

export default CreateRazorpay;

const styles = StyleSheet.create({});
