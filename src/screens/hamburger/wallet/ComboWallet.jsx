import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import CustomStatusBar from "../../custom_screens/CustomStatusBar";
import NavBack from "../../custom_screens/NavBack";
import Loader from "../../custom_screens/Loader";
import PrimaryButton from "../../custom_screens/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useToast } from "react-native-toast-notifications";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import {
  get_ProfileDetails,
  Get_ComboWalletTransactions,
  get_withdraw_history,
} from "../../../Network/ApiCalling";

const ComboWallet = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const token = useSelector((state) => state.login.token);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [comboWallet, setComboWallet] = useState("0.00");
  const [availableBalance, setAvailableBalance] = useState("0.00");
  const [pendingWithdrawals, setPendingWithdrawals] = useState(0);
  const [eligibleForWithdrawal, setEligibleForWithdrawal] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchComboWalletData();
    });

    return unsubscribe;
  }, [navigation, token]);

  const fetchComboWalletData = async (isRefreshing = false) => {
    try {
      if (!isRefreshing) {
        setLoading(true);
      }

      // Fetch profile to get combo wallet balance
      const profileRes = await get_ProfileDetails(token);
      let comboWalletBalance = "0.00";
      if (profileRes.status === 200) {
        // Get combo wallet from wallet_breakdown or user object
        comboWalletBalance = parseFloat(
          profileRes.data.wallet_breakdown?.combo_wallet ||
            profileRes.data.user?.combo_wallet ||
            0
        ).toFixed(2);
        setComboWallet(comboWalletBalance);
        setEligibleForWithdrawal(
          profileRes.data.user?.combo_wallet_eligible_for_withdrawal || false
        );
      }

      // Fetch withdrawal history to calculate pending withdrawals
      const withdrawHistoryRes = await get_withdraw_history(token);
      if (withdrawHistoryRes.status === 200) {
        const withdrawals = withdrawHistoryRes.data.withdraws || [];
        // Calculate pending combo wallet withdrawals
        const pendingComboWithdrawals = withdrawals
          .filter(
            (w) =>
              w.wallet_type === "combo" &&
              w.status?.toLowerCase() === "pending"
          )
          .reduce((sum, w) => sum + parseFloat(w.amount || 0), 0);
        setPendingWithdrawals(pendingComboWithdrawals);

        // Calculate available balance (total - pending)
        const totalComboWallet = parseFloat(comboWalletBalance || 0);
        const available = Math.max(0, totalComboWallet - pendingComboWithdrawals);
        setAvailableBalance(available.toFixed(2));
      } else {
        // If withdrawal history fails, set available balance to combo wallet balance
        setAvailableBalance(comboWalletBalance);
        setPendingWithdrawals(0);
      }

      // Fetch combo wallet transactions
      const transactionsRes = await Get_ComboWalletTransactions(token);
      if (transactionsRes.status === 200) {
        setTransactions(transactionsRes.data.transactions || []);
      }
    } catch (err) {
      console.log("Error fetching combo wallet data:", err);
      if (err.response) {
        if (err.response.status === 400) {
          console.log("Error With 400.");
        } else if (err.response.status === 422) {
          toast.hideAll();
          toast.show("Oops! Something went wrong—please try again", {
            type: "warning",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });
        } else if (err.response.status === 500) {
          toast.hideAll();
          toast.show("Internal server error. Please try again later.", {
            type: "danger",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          });
        }
      } else {
        toast.hideAll();
        toast.show("Failed to load combo wallet data", {
          type: "warning",
          placement: "top",
          duration: 4000,
          offset: 30,
          animationType: "slide-in",
        });
      }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchComboWalletData(true);
  }, []);

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const canWithdraw =
    eligibleForWithdrawal && parseFloat(availableBalance || 0) > 0;

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <NavBack>Combo Wallet</NavBack>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Combo Wallet Balance Card */}
        <View className="bg-[#ffffff83] rounded-xl w-[80%] mx-auto mt-9 mb-4">
          <View className="relative mt-4">
            <View className="p-6">
              <View className="flex flex-row items-center mb-3">
                <MaterialIcons name="wallet" size={28} color="#FF9800" />
                <Text className="text-[#fff] font-bold font-montmedium text-[20px] leading-[26px] ml-3">
                  Combo Wallet Balance
                </Text>
              </View>
              <View className="flex flex-row items-center mt-3">
                <MaterialIcons name="currency-rupee" size={30} color="white" />
                <Text className="text-[#fff] font-bold font-montmedium text-[32px] leading-[32px] ml-2">
                  {comboWallet}
                </Text>
              </View>
              
              {/* Available Balance */}
              <View className="mt-3">
                <Text className="text-[#fff] font-medium font-montmedium text-[14px] leading-[20px]">
                  Available: {formatCurrency(availableBalance)}
                </Text>
                {pendingWithdrawals > 0 && (
                  <Text className="text-[#fff] font-medium font-montmedium text-[12px] leading-[18px] mt-1 opacity-80">
                    Pending: {formatCurrency(pendingWithdrawals)}
                  </Text>
                )}
              </View>

              {/* Eligibility Status */}
              <View
                className={`mt-4 p-3 rounded-lg ${
                  eligibleForWithdrawal
                    ? "bg-green-500/30 border border-green-400"
                    : "bg-yellow-500/30 border border-yellow-400"
                }`}
              >
                <Text className="text-[#fff] font-semibold font-montmedium text-[14px] leading-[20px]">
                  {eligibleForWithdrawal
                    ? "✓ Eligible for withdrawal (4+ direct downlines)"
                    : "⚠ Not eligible for withdrawal (Need 4 direct downlines)"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Info Section */}
        <View className="w-[88%] mx-auto my-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
          <Text className="font-montmedium font-semibold text-[16px] leading-[22px] text-bigText mb-2">
            About Combo Wallet
          </Text>
          <Text className="font-montmedium font-normal text-[13px] leading-[18px] text-smallText">
            Combo wallet rewards are earned from combo package circles. These
            funds can only be withdrawn and cannot be used for package purchases
            or upgrades. Withdrawal eligibility requires 4+ direct downlines.
          </Text>
        </View>

        {/* Withdrawal Button */}
        <View className="w-[80%] mx-auto my-6">
          <PrimaryButton
            onPress={() => {
              if (canWithdraw) {
                navigation.navigate("ComboWalletWithdraw", {
                  comboWallet: comboWallet,
                  availableBalance: availableBalance,
                  eligibleForWithdrawal: eligibleForWithdrawal,
                });
              } else {
                toast.hideAll();
                toast.show(
                  !eligibleForWithdrawal
                    ? "You need 4+ direct downlines to withdraw from combo wallet"
                    : "Combo wallet balance is zero",
                  {
                    type: "warning",
                    placement: "top",
                    duration: 4000,
                    offset: 30,
                    animationType: "slide-in",
                  }
                );
              }
            }}
            disabled={!canWithdraw}
            style={{
              opacity: canWithdraw ? 1 : 0.5,
            }}
          >
            Request Withdrawal
          </PrimaryButton>
        </View>

        {/* Transaction History */}
        <View className="w-[90%] mx-auto mb-6">
          <Text className="font-montmedium font-semibold leading-[22px] text-[16px] tracking-wider text-smallText my-2">
            Transaction History
          </Text>

          {transactions.length === 0 ? (
            <View className="flex items-center justify-center py-8">
              <Text className="text-gray-500 text-base font-montmedium">
                No transactions found
              </Text>
            </View>
          ) : (
            <FlatList
              data={transactions}
              scrollEnabled={false}
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              }
              renderItem={({ item }) => {
                const isDebit = item.type !== "Credit";
                return (
                  <View
                    className="p-4 mb-4 rounded-lg shadow-md flex flex-row justify-between items-center w-full"
                    style={{
                      backgroundColor: isDebit ? "#FEF2F2" : "#F0FDF4",
                      borderLeftWidth: 4,
                      borderLeftColor: isDebit ? "#EF4444" : "#22C55E",
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 3,
                      elevation: 3,
                    }}
                  >
                    <View className="w-[15%]">
                      {isDebit ? (
                        <View className="w-[40px] h-[40px] bg-red-200 rounded-xl flex justify-center items-center">
                          <MaterialCommunityIcons
                            name="arrow-top-right"
                            size={24}
                            color="#DC2626"
                          />
                        </View>
                      ) : (
                        <View className="w-[40px] h-[40px] bg-green-200 rounded-xl flex justify-center items-center">
                          <MaterialCommunityIcons
                            name="arrow-bottom-left"
                            size={24}
                            color="#16A34A"
                          />
                        </View>
                      )}
                    </View>
                    <View className="w-[83%]">
                      <View className="flex flex-row justify-between items-center mb-1">
                        <View
                          className="px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: isDebit ? "#FEE2E2" : "#DCFCE7",
                          }}
                        >
                          <Text
                            className="font-bold font-montmedium text-[10px]"
                            style={{
                              color: isDebit ? "#DC2626" : "#16A34A",
                            }}
                          >
                            {isDebit ? "DEBIT" : "CREDIT"}
                          </Text>
                        </View>
                        <View>
                          <Text className="font-semibold font-montmedium text-[11px] text-gray-600">
                            {formatDate(item.created_at)} at{" "}
                            {formatTime(item.created_at)}
                          </Text>
                        </View>
                      </View>

                      <View className="flex flex-row justify-between items-center mb-1">
                        <Text className="font-normal font-montmedium text-[12px] text-gray-700">
                          Amount:
                        </Text>
                        <View className="flex flex-row items-center">
                          {isDebit ? (
                            <FontAwesome5 name="minus" size={13} color="#DC2626" />
                          ) : (
                            <FontAwesome6 name="plus" size={15} color="#16A34A" />
                          )}
                          <MaterialIcons
                            name="currency-rupee"
                            size={18}
                            color={isDebit ? "#DC2626" : "#16A34A"}
                          />
                          <Text
                            className="text-base text-[18px] font-bold font-montmedium"
                            style={{
                              color: isDebit ? "#DC2626" : "#16A34A",
                            }}
                          >
                            {formatCurrency(item.amount)}
                          </Text>
                        </View>
                      </View>

                      {item.reason && (
                        <View className="flex flex-row justify-between items-center mb-1">
                          <Text className="font-normal font-montmedium text-[12px] text-gray-700">
                            Reason:
                          </Text>
                          <Text className="text-gray-700 font-semibold font-montmedium text-[12px]">
                            {item.reason}
                          </Text>
                        </View>
                      )}

                      <View className="flex flex-row justify-between items-center">
                        <Text className="font-normal font-montmedium text-[12px] text-gray-700">
                          Balance:
                        </Text>
                        <Text className="text-gray-700 font-semibold font-montmedium text-[12px]">
                          {formatCurrency(item.balance)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              }}
              contentContainerStyle={{ paddingBottom: 30 }}
            />
          )}
        </View>
      </ScrollView>
    </>
  );
};

export default ComboWallet;

const styles = StyleSheet.create({});

