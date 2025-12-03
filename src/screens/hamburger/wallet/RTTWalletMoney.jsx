import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import CustomStatusBar from "../../custom_screens/CustomStatusBar";
import NavBack from "../../custom_screens/NavBack";
import PrimaryButton from "../../custom_screens/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import {
  get_withdraw_history,
  Send_withdraw_request,
} from "../../../Network/ApiCalling";
import { useSelector } from "react-redux";
import Loader from "../../custom_screens/Loader";
import { useToast } from "react-native-toast-notifications";
import {
  convertDateTimeFormat,
  getRemainingDays,
} from "../../../utils/TimeConvert";

const RTTWalletMoney = ({ route }) => {
  const navigation = useNavigation();
  const toast = useToast();

  const token = useSelector((state) => state.login.token);
  const { withdrawableAmount } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [requested_amount, setRequestedAmount] = useState("");
  const [History, setHistory] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      handleWithdrawHistory(); // Call the function when screen comes into focus
    });

    return unsubscribe; // Cleanup listener on unmount
  }, [navigation, token]); // Add dependencies as needed

  const handleWithdrawHistory = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      const res = await get_withdraw_history(token);
      if (res.status === 200) {
        setHistory(res.data.withdraws);
      }
    } catch (err) {
      // console.log("error######&^*11", err);
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
      setRefreshing(false);
    }
  };

  const handleWithdrawRequest = async () => {
    // console.log("cliked buttonm");
    try {
      setLoading(true);
      const res = await Send_withdraw_request(requested_amount, token);
      // console.log(">>>#####>", res);
      if (res.status === 200) {
        toast.hideAll();
        toast.show(res.data.message, {
          type: "success",
          placement: "top",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });

        navigation.navigate("RTTSucces");
        setRequestedAmount("");
      }
    } catch (err) {
      if (err) {
        if (err.response) {
          setRequestedAmount("");
          if (err.response.status === 400) {
            console.log("Error With 400.");
          } else if (err.response.status === 422) {
            // console.log("Error With 422.", err.response.data);
            toast.hideAll();
            toast.show(err.response.data.error, {
              type: "danger",
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
            // console.log("Internal Server Error");
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleWithdrawHistory(true);
  }, []);

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <NavBack>Back</NavBack>
      {withdrawableAmount && (
        <View className="w-[88%] mx-auto my-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <Text className="font-popmedium font-semibold text-[14px] leading-[20px] text-bigText mb-1">
            Available Withdrawable Amount:
          </Text>
          <Text className="font-popmedium font-bold text-[18px] leading-[24px] text-[#4CAF50]">
            ₹{parseFloat(withdrawableAmount || 0).toFixed(2)}
          </Text>
        </View>
      )}
      <View className="w-[88%] mx-auto my-3">
        <Text className="font-popmedium font-normal text-[16px] leading-[24px] text-bigText mt-6">
          Amount
        </Text>
        <View className="bg-[#EDFCFF] rounded-lg flex flex-row justify-between items-center px-3 py-3 mt-2">
          <TextInput
            placeholder="Enter amount"
            value={requested_amount}
            keyboardType="number-pad"
            maxLength={6}
            onChangeText={(text) => {
              const formattedText = text
                .replace(/[^0-9.]/g, "")
                .replace(/(\..*?)\..*/g, "$1");
              setRequestedAmount(formattedText);
            }}
            className="font-popmedium font-normal text-[14px] leading-[21px] w-[90%] text-bigText"
          />
          <Text className="font-popmedium font-normal text-[17px] leading-[24px] text-bigText">
            INR
          </Text>
        </View>
      </View>

      <View className="w-[65%] mx-auto my-6">
        <PrimaryButton
          onPress={() => {
            // navigation.navigate("RTTSucces");
            if (requested_amount !== "") {
              handleWithdrawRequest();
            } else {
              toast.hideAll();
              toast.show("You must fill in all the fields to continue.", {
                type: "danger",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
              });
            }
          }}
        >
          Send Request
        </PrimaryButton>
      </View>
      {/* </View> */}

      <View className="w-[90%] mx-auto" style={{ flex: 1 }}>
        <Text className="font-montmedium font-semibold leading-[22px] text-[16px] tracking-wider text-smallText my-2">
          Withdrawal & Payment Requests
        </Text>

        <FlatList
          data={History}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          renderItem={({ item, index }) => {
            const { amount, transfer_details, status, created_at, rejection_reason } = item;

            // Helper function to capitalize first letter
            const capitalizeFirst = (str) => {
              if (!str) return "";
              return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            };

            // Normalize status to lowercase for comparison (API returns lowercase)
            const statusLower = status?.toLowerCase() || "";
            const displayStatus = capitalizeFirst(status);

            return (
              <View
                key={index}
                className="bg-white p-4 mb-4 rounded-lg shadow-md"
              >
                <Text className="text-base font-semibold text-gray-800 mb-4">
                  Withdrawal requested at{" "}
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(created_at))}{" "}
                  at{" "}
                  {new Date(created_at).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Text>

                <View className="flex-row mb-2">
                  <Text className="font-medium text-sm text-gray-600 w-1/2">
                    Amount:
                  </Text>
                  <Text className="text-sm text-gray-800 flex-1">{amount}</Text>
                </View>

                {statusLower === "accepted" && (
                  <View className="flex-row mb-2">
                    <Text className="font-medium text-sm text-gray-600 w-1/2">
                      Transfer Details:
                    </Text>
                    <Text className="text-sm text-gray-800 flex-1">
                      {transfer_details || "N/A"}
                    </Text>
                  </View>
                )}

                <View className="flex-row mb-2">
                  <Text className="font-medium text-sm text-gray-600 w-1/2">
                    Status:
                  </Text>
                  <Text
                    className={`font-semibold text-sm ${
                      statusLower === "pending"
                        ? "text-orange-500"
                        : statusLower === "rejected"
                        ? "text-red-500"
                        : "text-green-500"
                    } flex-1`}
                  >
                    {displayStatus}
                  </Text>
                </View>

                {statusLower === "rejected" && rejection_reason && (
                  <View className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                    <Text className="font-medium text-sm text-red-800 mb-1">
                      Rejection Reason:
                    </Text>
                    <Text className="text-sm text-red-700">
                      {rejection_reason}
                    </Text>
                  </View>
                )}

                {statusLower === "pending" ? (
                  <View className="">
                    <Text className="text-xs text-red-400 italic">
                      Please note: The withdrawal will be settled within{" "}
                      {getRemainingDays(created_at)} working days.
                    </Text>
                    {getRemainingDays(created_at) <= 0 && (
                      <Text
                        className="text-xs text-blue-500 underline py-1 italic"
                        onPress={() => navigation.navigate("Support")}
                      >
                        If it is still not settled, please contact{" "}
                        <Text className="font-bold">Support</Text>.
                      </Text>
                    )}
                  </View>
                ) : (
                  ""
                )}
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
        />
      </View>
    </>
  );
};

export default RTTWalletMoney;

const styles = StyleSheet.create({});
