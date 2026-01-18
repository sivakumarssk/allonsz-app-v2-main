import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import CustomStatusBar from "../../custom_screens/CustomStatusBar";
import NavBack from "../../custom_screens/NavBack";
import PrimaryButton from "../../custom_screens/PrimaryButton";
import { useSelector } from "react-redux";
import {
  Create_Razorpay_Order,
  Verify_Razorpay_Order,
  get_ProfileDetails,
} from "../../../Network/ApiCalling";
import RazorpayCheckout from "react-native-razorpay";
import Loader from "../../custom_screens/Loader";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import Constants from "expo-constants";

const CreateRazorpay = ({ route }) => {
  const { packageId, packagePrice } = route.params || {};
  // console.log("packageId", packageId);

  const toast = useToast();

  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [paymentType, setPaymentType] = useState("razorpay"); // "wallet" or "razorpay"
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletBreakdown, setWalletBreakdown] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(false);

  const token = useSelector((state) => state.login.token);

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      setLoadingWallet(true);
      const res = await get_ProfileDetails(token);
      if (res.status === 200) {
        // Use total_amount from wallet_breakdown (includes both withdrawable and non-withdrawable)
        const totalAmount = res.data.wallet_breakdown?.total_amount || res.data.user?.wallet || "0.00";
        setWalletBalance(totalAmount);
        setWalletBreakdown(res.data.wallet_breakdown);
      }
    } catch (err) {
      console.log("Error fetching wallet balance:", err);
    } finally {
      setLoadingWallet(false);
    }
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toFixed(2)}`;
  };

  const isWalletBalanceSufficient = () => {
    if (paymentType !== "wallet") return true;
    
    // IMPORTANT: Combo packages cannot be purchased with combo wallet
    // They can only be purchased with regular wallet or Razorpay
    // Regular wallet includes both withdrawable and non-withdrawable amounts
    // Combo wallet is separate and only for withdrawals
    
    // Use total_amount from wallet_breakdown (regular wallet only)
    const totalBalance = parseFloat(walletBreakdown?.total_amount || walletBalance || 0);
    const price = parseFloat(packagePrice || 0);
    return totalBalance >= price;
  };

  const getWalletBalanceDisplay = () => {
    if (!walletBreakdown) return formatCurrency(walletBalance);
    return formatCurrency(walletBreakdown.total_amount);
  };

  const getInsufficientBalanceMessage = () => {
    if (!walletBreakdown) {
      return `Insufficient wallet balance. Required: ${formatCurrency(packagePrice)}, Available: ${formatCurrency(walletBalance)}`;
    }
    return `Insufficient wallet balance. Required: ${formatCurrency(packagePrice)}, Available: ${formatCurrency(walletBreakdown.total_amount)} (Withdrawable: ${formatCurrency(walletBreakdown.withdrawable_amount)}, Non-withdrawable: ${formatCurrency(walletBreakdown.non_withdrawable_amount)})`;
  };

  // Check if running in Expo Go
  const isExpoGo = () => {
    try {
      // Expo Go runs with executionEnvironment as "storeClient"
      return Constants.executionEnvironment === "storeClient" || 
             Constants.appOwnership === "expo" ||
             (typeof __DEV__ !== 'undefined' && __DEV__ && Constants.executionEnvironment !== "standalone");
    } catch (error) {
      // If Constants is not available, assume it's Expo Go
      return true;
    }
  };

  // Generate dummy payment data for Expo Go
  const generateDummyPaymentData = (orderId) => {
    return {
      razorpay_order_id: orderId,
      razorpay_payment_id: `pay_dummy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      razorpay_signature: `dummy_signature_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`,
    };
  };

  const handlePayment = async (option) => {
    console.log("handlePayment", option);

    // Check if running in Expo Go - bypass Razorpay SDK
    if (isExpoGo()) {
      console.log("Running in Expo Go - Using dummy payment data");
      
      // Show toast notification about dummy transaction
      toast.hideAll();
      toast.show("Using dummy transaction (Expo Go - Razorpay not available)", {
        type: "info",
        placement: "top",
        duration: 3000,
        offset: 30,
        animationType: "slide-in",
      });
      
      // Generate dummy payment data
      const dummyData = generateDummyPaymentData(option.order_id);
      console.log("Dummy payment data:", dummyData);
      
      // Small delay to simulate payment processing
      setTimeout(async () => {
        // Verify the dummy transaction
        await handleVerifyRazorpayOrder(dummyData);
      }, 1000);
      return;
    }

    // Original Razorpay flow for standalone builds
    const options = {
      description: option.description,
      order_id: option.order_id,
      image: "",
      currency: "INR",
      key: option?.key,
      amount: option?.amount,
      name: option.prefill.name,
      prefill: {
        contact: option.prefill.contact,
        email: option.prefill.email,
        name: option.prefill.name,
      },
      theme: {
        color: option.theme.color,
      },
    };

    setTimeout(async () => {
      try {
        // Check if RazorpayCheckout is available (might not be in Expo Go)
        if (!RazorpayCheckout || typeof RazorpayCheckout.open !== 'function') {
          throw new Error("Razorpay SDK not available");
        }
        
        const data = await RazorpayCheckout.open(options);
        handleVerifyRazorpayOrder(data);
      } catch (error) {
        console.log("Error in Razorpay:", error);
        
        // If Razorpay SDK is not available, fall back to dummy transaction
        if (error.message === "Razorpay SDK not available" || 
            error.toString().includes("Native module") ||
            error.toString().includes("not found")) {
          console.log("Razorpay SDK not available - Using dummy transaction");
          
          toast.hideAll();
          toast.show("Razorpay SDK not available - Using dummy transaction", {
            type: "info",
            placement: "top",
            duration: 3000,
            offset: 30,
            animationType: "slide-in",
          });
          
          // Generate dummy payment data
          const dummyData = generateDummyPaymentData(options.order_id);
          console.log("Dummy payment data:", dummyData);
          
          // Verify the dummy transaction
          setTimeout(async () => {
            await handleVerifyRazorpayOrder(dummyData);
          }, 500);
        } else {
          // User canceled or other error
          toast.hideAll();
          toast.show("Payment canceled. Let us know if you need help!", {
            type: "warning",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });
          setLoading(false);
        }
      }
    }, 1000);
  };

  const handleVerifyRazorpayOrder = async (data) => {
    try {
      setLoading(true);
      const res = await Verify_Razorpay_Order(data, token);
      if (res.status === 200) {
        const result = res.data;
        toast.hideAll();
        toast.show(result.message || "Payment successful", {
          type: "success",
          placement: "top",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });

        // Refresh wallet balance after successful payment
        await fetchWalletBalance();

        setTimeout(() => {
          navigation.navigate("Packages");
        }, 800);
      }
    } catch (err) {
      // console.log("error", err.response?.data);
      if (err) {
        if (err.response) {
          if (err.response.status === 400) {
            console.log("Error With 400.");
            toast.hideAll();
            toast.show(err.response.data?.message || "Payment verification failed", {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          } else if (err.response.status === 422) {
            // console.log("Error With 422.");
            toast.hideAll();
            toast.show(err.response.data?.message || "Oops! Something went wrong—please try again", {
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
            toast.hideAll();
            toast.show("Authentication failed. Please login again.", {
              type: "warning",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
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
    // Check wallet balance if wallet payment is selected
    if (paymentType === "wallet" && !isWalletBalanceSufficient()) {
      toast.hideAll();
      toast.show(getInsufficientBalanceMessage(), {
        type: "danger",
        placement: "top",
        duration: 6000,
        offset: 30,
        animationType: "slide-in",
      });
      return;
    }

    try {
      setLoading(true);

      // Create order with payment type
      const res = await Create_Razorpay_Order(packageId, token, paymentType);

      if (res.status === 200) {
        // Wallet payment - direct success
        if (paymentType === "wallet") {
          toast.hideAll();
          toast.show(res.data.message || "Package purchased successfully", {
            type: "success",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });

          // Refresh wallet balance
          await fetchWalletBalance();

          setTimeout(() => {
            navigation.navigate("Packages");
          }, 800);
          return;
        }

        // Razorpay payment - continue with Razorpay checkout flow
        if (res.data?.data) {
          const razorpayData = res.data.data;
          console.log("Order created successfully:", razorpayData.order_id);

          // Set loading to false before opening Razorpay checkout
          setLoading(false);

          // Open Razorpay checkout
          handlePayment(razorpayData);
        } else {
          // If no order_id returned, treat as wallet payment success
          toast.hideAll();
          toast.show(res.data.message || "Package purchased successfully", {
            type: "success",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });

          await fetchWalletBalance();

          setTimeout(() => {
            navigation.navigate("Packages");
          }, 800);
        }
      }
    } catch (err) {
      console.log("Error in payment flow:", err.response?.data || err.message);
      setLoading(false);

      if (err.response) {
        const status = err.response.status;
        const errorMessage = err.response.data?.error || err.response.data?.message || "Payment failed";

        if (status === 400) {
          toast.hideAll();
          toast.show(errorMessage, {
            type: "danger",
            placement: "top",
            duration: 5000,
            offset: 30,
            animationType: "slide-in",
          });
        } else if (status === 422) {
          toast.hideAll();
          toast.show(errorMessage, {
            type: "warning",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });
        } else if (status === 401) {
          toast.hideAll();
          toast.show("Authentication failed. Please login again.", {
            type: "warning",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });
        } else if (status === 500) {
          Alert.alert(
            "Internal Server Error",
            "Please Check your Internet Connection"
          );
        } else {
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
          Alert.alert(
            "No Network Found",
            "Please Check your Internet Connection"
          );
        }
      } else {
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
            editable={false}
            className="font-popmedium font-normal text-[14px] leading-[21px] text-bigText"
          />
          <Text className="font-popmedium font-normal text-[17px] leading-[24px] text-bigText">
            INR
          </Text>
        </View>
      </View>

      {/* Payment Type Selection */}
      <View className="w-[88%] mx-auto my-4">
        <Text className="font-popmedium font-semibold text-[16px] leading-[24px] text-bigText mb-3">
          Select Payment Method
        </Text>

        {/* Wallet Payment Option */}
        <Pressable
          onPress={() => setPaymentType("wallet")}
          className={`mb-3 p-4 rounded-lg border-2 ${
            paymentType === "wallet"
              ? "border-[#4CAF50] bg-green-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View
                className={`w-5 h-5 rounded-full border-2 mr-3 ${
                  paymentType === "wallet"
                    ? "border-[#4CAF50] bg-[#4CAF50]"
                    : "border-gray-400"
                }`}
              >
                {paymentType === "wallet" && (
                  <View className="w-full h-full rounded-full bg-[#4CAF50]" />
                )}
              </View>
              <View className="flex-1">
                <Text className="font-popmedium font-semibold text-[16px] text-bigText">
                  Pay with Wallet
                </Text>
                {loadingWallet ? (
                  <Text className="font-popmedium text-[12px] text-smallText mt-1">
                    Loading balance...
                  </Text>
                ) : (
                  <Text className="font-popmedium text-[12px] text-smallText mt-1">
                    Available: {getWalletBalanceDisplay()}
                  </Text>
                )}
              </View>
            </View>
            <Ionicons name="wallet-outline" size={24} color="#4CAF50" />
          </View>

          {/* Insufficient Balance Warning */}
          {paymentType === "wallet" && !isWalletBalanceSufficient() && (
            <View className="mt-3 p-2 bg-red-50 rounded border border-red-200">
              <Text className="font-popmedium text-[12px] text-red-600">
                {getInsufficientBalanceMessage()}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Razorpay Payment Option */}
        <Pressable
          onPress={() => setPaymentType("razorpay")}
          className={`p-4 rounded-lg border-2 ${
            paymentType === "razorpay"
              ? "border-[#3399cc] bg-blue-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <View
                className={`w-5 h-5 rounded-full border-2 mr-3 ${
                  paymentType === "razorpay"
                    ? "border-[#3399cc] bg-[#3399cc]"
                    : "border-gray-400"
                }`}
              >
                {paymentType === "razorpay" && (
                  <View className="w-full h-full rounded-full bg-[#3399cc]" />
                )}
              </View>
              <Text className="font-popmedium font-semibold text-[16px] text-bigText">
                Pay with Razorpay
              </Text>
            </View>
            <FontAwesome name="credit-card" size={24} color="#3399cc" />
          </View>
        </Pressable>
      </View>

      <View className="w-[90%] mx-auto mt-[45px]">
        <PrimaryButton
          onPress={handleCreateRazorpayOrder}
          disabled={paymentType === "wallet" && !isWalletBalanceSufficient()}
          style={{
            opacity: paymentType === "wallet" && !isWalletBalanceSufficient() ? 0.5 : 1,
          }}
        >
          {paymentType === "wallet" && !isWalletBalanceSufficient()
            ? "Insufficient Balance"
            : "Confirm Payment"}
        </PrimaryButton>
      </View>
    </>
  );
};

export default CreateRazorpay;

const styles = StyleSheet.create({});
