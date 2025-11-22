import { View, Text, Alert, FlatList, RefreshControl } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Loader from "../custom_screens/Loader";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import { get_transaction_history } from "../../Network/ApiCalling";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";
import { useSelector } from "react-redux";
import NavBack from "../custom_screens/NavBack";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const MoneyTransactions = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [History, setHistory] = useState([]);

  const navigation = useNavigation();
  const toast = useToast();

  const token = useSelector((state) => state.login.token);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      handleTransactionHistory(); // Call the function when screen comes into focus
    });

    return unsubscribe; // Cleanup listener on unmount
  }, [navigation, token]); // Add dependencies as needed

  const handleTransactionHistory = async (isRefreshing = false) => {
    // console.log("cliked buttonm in useEffect");
    try {
      if (!isRefreshing) {
        setLoading(true);
      }
      const res = await get_transaction_history(token);
      //   console.log(">>>#####>in useEffe", res.data.transactions);
      if (res.status === 200) {
        setHistory(res.data.transactions);
      }
    } catch (err) {
      //   console.log("error######&^*11", err);
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
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleTransactionHistory(true);
  }, []);

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <NavBack>All Transactions</NavBack>

      {History.length === 0 && (
        <View className="flex items-center justify-center mt-4">
          <Text className="text-gray-500 text-base">
            No transactions done yet.
          </Text>
        </View>
      )}

      <View className="w-[94%] mx-auto mt-2">
        <FlatList
          data={History}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          renderItem={({ item }) => {
            const isDebit = item.type !== "Credit";
            return (
              <View
                className="p-4 mb-4 rounded-lg shadow-md flex flex-row justify-between items-center w-full"
                style={{
                  backgroundColor: isDebit ? '#FEF2F2' : '#F0FDF4',
                  borderLeftWidth: 4,
                  borderLeftColor: isDebit ? '#EF4444' : '#22C55E',
                  shadowColor: '#000',
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
                        backgroundColor: isDebit ? '#FEE2E2' : '#DCFCE7'
                      }}
                    >
                      <Text
                        className="font-bold font-montmedium text-[10px]"
                        style={{
                          color: isDebit ? '#DC2626' : '#16A34A'
                        }}
                      >
                        {isDebit ? 'DEBIT' : 'CREDIT'}
                      </Text>
                    </View>
                    <View>
                      <Text className="font-semibold font-montmedium text-[11px] text-gray-600">
                        {new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }).format(new Date(item.created_at))}{" "}
                        at{" "}
                        {new Date(item.created_at).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </Text>
                    </View>
                  </View>

                  <View className="flex flex-row justify-between items-center">
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
                          color: isDebit ? '#DC2626' : '#16A34A'
                        }}
                      >
                        {item.amount}
                      </Text>
                    </View>
                  </View>

                  <View className="flex flex-row justify-between items-center">
                    <View>
                      <Text className="font-normal font-montmedium text-[12px]">
                        Product:
                      </Text>
                    </View>
                    <View>
                      <Text className="text-gray-700 font-semibold font-montmedium text-[12px]">
                        {item.reason}
                      </Text>
                    </View>
                  </View>

                  <View className="flex flex-row justify-between items-center">
                    <View>
                      <Text className="font-normal font-montmedium text-[12px]">
                        Wallet Balance:
                      </Text>
                    </View>
                    <View>
                      <Text className="text-gray-700 font-semibold font-montmedium text-[12px]">
                        {item.balance}
                      </Text>
                    </View>
                  </View>
                </View>
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

export default MoneyTransactions;
