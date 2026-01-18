import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import CustomStatusBar from "../../custom_screens/CustomStatusBar";
import NavBack from "../../custom_screens/NavBack";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import PrimaryButton from "../../custom_screens/PrimaryButton";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { get_ProfileDetails, get_transaction_history } from "../../../Network/ApiCalling";
import Loader from "../../custom_screens/Loader";
import { useToast } from "react-native-toast-notifications";
import { FlatList } from "react-native";

const TripWallet = ({ route }) => {
  const navigation = useNavigation();
  const toast = useToast();
  const token = useSelector((state) => state.login.token);

  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [walletBreakdown, setWalletBreakdown] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const res = await get_ProfileDetails(token);
      if (res.status === 200) {
        setProfileData(res.data.user);
        setWalletBreakdown(res.data.wallet_breakdown);
      }
    } catch (err) {
      console.log("Error fetching profile:", err);
      toast.show("Failed to load wallet data", {
        type: "warning",
        placement: "top",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoadingTransactions(true);
      const res = await get_transaction_history(token);
      if (res.status === 200) {
        setTransactions(res.data.transactions || []);
      }
    } catch (err) {
      console.log("Error fetching transactions:", err);
      toast.show("Failed to load transactions", {
        type: "warning",
        placement: "top",
        duration: 3000,
      });
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleViewDetails = () => {
    setShowDetails(true);
    fetchTransactions();
  };

  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount || 0).toFixed(2)}`;
  };
  return (
    <>
      <Loader visible={loading} />
      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <NavBack>Trip Wallet</NavBack>

      <View className="bg-[#ffffff83] rounded-xl w-[80%] mx-auto mt-9">
        <View className="relative mt-4">
          <Image
            source={require("../../../styles/images/hamburgerMenu/Frame.png")}
            className="w-full h-auto"
            resizeMode="contain"
          />
          <View className="absolute inset-0 p-9 w-full">
            <Text className="text-[#fff] font-bold font-montmedium text-[24px] leading-[26px] mt-2">
              Wallet Money
            </Text>
            <View className="flex flex-row mt-3">
              <FontAwesome name="rupee" size={23} color="white" />
              <Text className="text-[#fff] font-bold font-montmedium text-[25px] leading-[25px] ml-2">
                {walletBreakdown?.total_amount || "0.00"}
              </Text>
            </View>
            <Text className="text-[#fff] font-bold font-montmedium text-[18px] leading-[25px] my-3">
              Duration: 15 Working Days
            </Text>
            <Pressable onPress={handleViewDetails}>
              <View className="bg-smallText rounded-lg w-[60%] mx-auto mt-6">
                <Text className="text-[#fff] font-semibold font-montmedium text-[16px] leading-[24px] tracking-widest text-center p-2">
                  View Details
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        <View className="w-[90%] mx-auto mt-5 mb-3">
          <Text className="font-montmedium font-semibold text-[18px] leading-[24px] tracking-widest text-primary mb-2">
            Trip Wallet
          </Text>
          <Text className="font-montmedium font-normal text-[15px] leading-[20px] tracking-widest text-smallText">
            If you want to withdraw money send request
          </Text>
        </View>
      </View>

      <View className="w-[80%] mx-auto my-9">
        <PrimaryButton
          onPress={() => {
            navigation.navigate("RTTWalletMoney", {
              withdrawableAmount: walletBreakdown?.withdrawable_amount || "0.00",
            });
          }}
        >
          Request to transfer wallet money
        </PrimaryButton>
      </View>

      {/* View Details Modal */}
      <Modal
        visible={showDetails}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDetails(false)}
      >
        <View className="flex-1 bg-black/50">
          <View className="flex-1 bg-white mt-20 rounded-t-3xl">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="font-montmedium font-bold text-[20px] text-bigText">
                Wallet Details
              </Text>
              <Pressable onPress={() => setShowDetails(false)}>
                <Text className="font-montmedium text-[18px] text-primary">
                  Close
                </Text>
              </Pressable>
            </View>

            <ScrollView className="flex-1">
              {/* Wallet Breakdown */}
              <View className="p-4">
                <Text className="font-montmedium font-semibold text-[18px] text-bigText mb-3">
                  Wallet Breakdown
                </Text>
                <View className="bg-gray-50 rounded-lg p-4 mb-4">
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="font-montmedium text-[16px] text-smallText">
                      Total Amount:
                    </Text>
                    <Text className="font-montmedium font-bold text-[16px] text-bigText">
                      {formatCurrency(walletBreakdown?.total_amount)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="font-montmedium text-[16px] text-smallText">
                      Withdrawable Amount:
                    </Text>
                    <Text className="font-montmedium font-bold text-[16px] text-[#4CAF50]">
                      {formatCurrency(walletBreakdown?.withdrawable_amount)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="font-montmedium text-[16px] text-smallText">
                      Non-Withdrawable Amount:
                    </Text>
                    <Text className="font-montmedium font-bold text-[16px] text-[#FF9800]">
                      {formatCurrency(walletBreakdown?.non_withdrawable_amount)}
                    </Text>
                  </View>
                  {walletBreakdown?.combo_wallet !== undefined && (
                    <View className="flex-row justify-between items-center border-t border-gray-200 pt-3 mt-1">
                      <Text className="font-montmedium text-[16px] text-smallText">
                        Combo Wallet:
                      </Text>
                      <Text className="font-montmedium font-bold text-[16px] text-[#FF9800]">
                        {formatCurrency(walletBreakdown?.combo_wallet)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Wallet Transactions */}
              <View className="p-4">
                <Text className="font-montmedium font-semibold text-[18px] text-bigText mb-3">
                  Wallet Transactions
                </Text>
                {loadingTransactions ? (
                  <Text className="text-center text-smallText py-4">
                    Loading transactions...
                  </Text>
                ) : transactions.length === 0 ? (
                  <Text className="text-center text-smallText py-4">
                    No transactions found
                  </Text>
                ) : (
                  <FlatList
                    data={transactions}
                    keyExtractor={(item, index) =>
                      item.id?.toString() || index.toString()
                    }
                    renderItem={({ item }) => {
                      const isDebit = item.type !== "Credit";
                      return (
                        <View className="bg-white rounded-lg p-4 mb-3 shadow">
                          <View className="flex-row justify-between items-center mb-2">
                            <Text className="font-montmedium font-semibold text-[16px] text-bigText">
                              {item.description || item.type || "Transaction"}
                            </Text>
                            <Text
                              className={`font-montmedium font-bold text-[16px] ${
                                isDebit ? "text-red-500" : "text-[#4CAF50]"
                              }`}
                            >
                              {isDebit ? "-" : "+"}
                              {formatCurrency(item.amount)}
                            </Text>
                          </View>
                          <Text className="font-montmedium text-[12px] text-smallText mb-1">
                            {new Date(item.created_at).toLocaleDateString()}{" "}
                            {new Date(item.created_at).toLocaleTimeString()}
                          </Text>
                          <View className="flex-row justify-between items-center">
                            <Text className="font-montmedium text-[12px] text-smallText">
                              Type: {item.type || "N/A"}
                            </Text>
                            <Text className="font-montmedium text-[12px] text-smallText">
                              Balance: {formatCurrency(item.balance)}
                            </Text>
                          </View>
                        </View>
                      );
                    }}
                    scrollEnabled={false}
                  />
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default TripWallet;

const styles = StyleSheet.create({});
