import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import CustomStatusBar from "../../custom_screens/CustomStatusBar";
import NavBack from "../../custom_screens/NavBack";
import Loader from "../../custom_screens/Loader";
import PrimaryButton from "../../custom_screens/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import {
  Send_ComboWalletWithdrawRequest,
} from "../../../Network/ApiCalling";

const ComboWalletWithdraw = ({ route }) => {
  const navigation = useNavigation();
  const toast = useToast();
  const token = useSelector((state) => state.login.token);

  const {
    comboWallet,
    availableBalance,
    eligibleForWithdrawal,
  } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toFixed(2)}`;
  };

  const validateAmount = () => {
    const amountValue = parseFloat(amount || 0);
    // Use available balance (total - pending withdrawals) for validation
    const availableBal = parseFloat(availableBalance || comboWallet || 0);

    if (!amount || amountValue <= 0) {
      return "Amount must be greater than 0";
    }

    // Check if amount is a valid integer (minimum 1)
    if (!Number.isInteger(amountValue) || amountValue < 1) {
      return "Amount must be a whole number and at least ₹1";
    }

    if (amountValue > availableBal) {
      return `Amount cannot exceed available balance of ${formatCurrency(
        availableBal
      )}`;
    }

    if (!eligibleForWithdrawal) {
      return "You need 4 direct referrals with combo packages to withdraw";
    }

    return null;
  };

  const handleWithdrawRequest = async () => {
    const validationError = validateAmount();
    if (validationError) {
      toast.hideAll();
      toast.show(validationError, {
        type: "danger",
        placement: "top",
        duration: 4000,
        offset: 30,
        animationType: "slide-in",
      });
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      "Confirm Withdrawal",
      `Are you sure you want to withdraw ${formatCurrency(
        amount
      )} from your combo wallet?\n\nNote: Withdrawal requests are processed within 30 working days.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: async () => {
            try {
              setLoading(true);
              const res = await Send_ComboWalletWithdrawRequest(amount, token);

              if (res.status === 200) {
                toast.hideAll();
                toast.show(res.data.message || "Withdrawal request submitted successfully", {
                  type: "success",
                  placement: "top",
                  duration: 4000,
                  offset: 30,
                  animationType: "slide-in",
                });

                // Navigate back after a short delay
                setTimeout(() => {
                  navigation.goBack();
                }, 1000);
              }
            } catch (err) {
              console.log("Error submitting withdrawal request:", err);
              if (err.response) {
                const status = err.response.status;
                const errorMessage =
                  err.response.data?.message ||
                  err.response.data?.error ||
                  "Withdrawal request failed";

                if (status === 400) {
                  toast.hideAll();
                  toast.show(errorMessage, {
                    type: "danger",
                    placement: "top",
                    duration: 4000,
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
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const validationError = amount ? validateAmount() : null;

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <NavBack>Combo Wallet Withdrawal</NavBack>

      {/* Available Balance Display */}
      {comboWallet && (
        <View className="w-[88%] mx-auto my-3 bg-orange-50 p-4 rounded-lg border border-orange-200">
          <Text className="font-popmedium font-semibold text-[14px] leading-[20px] text-bigText mb-1">
            Total Combo Wallet Balance:
          </Text>
          <Text className="font-popmedium font-bold text-[18px] leading-[24px] text-[#FF9800]">
            {formatCurrency(comboWallet)}
          </Text>
          <Text className="font-popmedium font-semibold text-[14px] leading-[20px] text-bigText mt-2 mb-1">
            Available Balance:
          </Text>
          <Text className="font-popmedium font-bold text-[18px] leading-[24px] text-[#4CAF50]">
            {formatCurrency(availableBalance || comboWallet)}
          </Text>
          {!eligibleForWithdrawal && (
            <Text className="font-popmedium text-[12px] text-red-600 mt-2">
              ⚠ You need 4 direct referrals with combo packages to withdraw
            </Text>
          )}
        </View>
      )}

      {/* Amount Input */}
      <View className="w-[88%] mx-auto my-3">
        <Text className="font-popmedium font-normal text-[16px] leading-[24px] text-bigText mt-6">
          Withdrawal Amount
        </Text>
        <View className="bg-[#EDFCFF] rounded-lg flex flex-row justify-between items-center px-3 py-3 mt-2">
          <TextInput
            placeholder="Enter amount"
            value={amount}
            keyboardType="number-pad"
            maxLength={10}
            onChangeText={(text) => {
              const formattedText = text
                .replace(/[^0-9.]/g, "")
                .replace(/(\..*?)\..*/g, "$1");
              setAmount(formattedText);
            }}
            className="font-popmedium font-normal text-[14px] leading-[21px] w-[90%] text-bigText"
          />
          <Text className="font-popmedium font-normal text-[17px] leading-[24px] text-bigText">
            INR
          </Text>
        </View>

        {/* Validation Error Display */}
        {validationError && (
          <View className="mt-2 p-2 bg-red-50 rounded border border-red-200">
            <Text className="font-popmedium text-[12px] text-red-600">
              {validationError}
            </Text>
          </View>
        )}

        {/* Info Section */}
        <View className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Text className="font-popmedium font-semibold text-[13px] text-bigText mb-2">
            Withdrawal Information:
          </Text>
          <Text className="font-popmedium text-[12px] text-smallText leading-[18px]">
            • Minimum withdrawal amount: ₹1{"\n"}
            • Withdrawal requests are processed within 30 working days{"\n"}
            • You must have 4 direct referrals with combo packages to withdraw{"\n"}
            • Combo wallet can only be withdrawn, not used for purchases{"\n"}
            • Available balance = Total - Pending withdrawals
          </Text>
        </View>
      </View>

      {/* Submit Button */}
      <View className="w-[65%] mx-auto my-6">
        <PrimaryButton
          onPress={handleWithdrawRequest}
          disabled={!amount || !!validationError || !eligibleForWithdrawal}
          style={{
            opacity:
              !amount || !!validationError || !eligibleForWithdrawal ? 0.5 : 1,
          }}
        >
          Submit Withdrawal Request
        </PrimaryButton>
      </View>
    </>
  );
};

export default ComboWalletWithdraw;

const styles = StyleSheet.create({});


