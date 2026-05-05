import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomStatusBar from "../../custom_screens/CustomStatusBar";
import NavBack from "../../custom_screens/NavBack";
import { Get_Packages } from "../../../Network/ApiCalling";
import { useSelector } from "react-redux";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";
import Loader from "../../custom_screens/Loader";

const Packages = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [packDetails, setPackDetails] = useState(null);
  const [directDownlinersCount, setDirectDownlinersCount] = useState(0);

  const token = useSelector((state) => state.login.token);

  const getPackages = async () => {
    try {
      setLoading(true);
      const res = await Get_Packages(token);
      if (res.status === 200) {
        const result = res.data.packages;
        // Store direct downliners count from API response
        const downlinersCount = res.data.direct_downliners_count ?? 0;
        setDirectDownlinersCount(downlinersCount);

        // Sort packages: combo packages first, then other packages
        const sortedPackages = [...result].sort((a, b) => {
          const aIsCombo = a.is_combo == 1 || a.is_combo === true;
          const bIsCombo = b.is_combo == 1 || b.is_combo === true;
          if (aIsCombo && !bIsCombo) return -1;
          if (!aIsCombo && bIsCombo) return 1;
          return 0;
        });

        setPackDetails(sortedPackages);
      }
    } catch (err) {
      if (err) {
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
      }
    } finally {
      setLoading(false);
    }
  };

  // Refresh packages whenever screen comes into focus (downliner count may have changed)
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getPackages();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
      />
      <NavBack>Packages</NavBack>

      {/* Direct downliner counter */}
      <View className="w-[95%] mx-auto mt-3 mb-1 flex-row items-center gap-2 bg-[#f0f4ff] rounded-lg px-3 py-2">
        <Ionicons name="people-outline" size={18} color="#44699c" />
        <Text className="font-montmedium text-[13px] text-[#44699c]">
          Direct referrals:{" "}
          <Text className="font-semibold">{directDownlinersCount}/4</Text>
        </Text>
        {directDownlinersCount < 4 && (
          <Text className="font-montmedium text-[11px] text-[#888] ml-1">
            — Refer {4 - directDownlinersCount} more to unlock upgrades
          </Text>
        )}
      </View>

      <View className="flex-1 w-[95%] mx-auto mt-2">
        <FlatList
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={packDetails || []}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          renderItem={({ item, index }) => {
            const isLocked = item.is_upgrade == 1 && directDownlinersCount < 4;

            return (
              <TouchableOpacity
                className={`flex flex-row justify-between items-center px-2 py-5 w-full rounded mb-1 ${
                  isLocked
                    ? "bg-[#e8e8e8]"
                    : index % 2 !== 0
                    ? "bg-[#cccccc26]"
                    : "bg-[#acacac2f]"
                }`}
                onPress={() => {
                  if (isLocked) {
                    toast.hideAll();
                    toast.show(
                      `Refer ${4 - directDownlinersCount} more member${
                        4 - directDownlinersCount === 1 ? "" : "s"
                      } to unlock this upgrade`,
                      {
                        type: "warning",
                        placement: "top",
                        duration: 4000,
                        offset: 30,
                        animationType: "slide-in",
                      }
                    );
                    return;
                  }
                  const packagePrice = item.price || item.total || 0;
                  navigation.navigate("CreateRazorpay", {
                    packageId: item.id,
                    packagePrice: packagePrice,
                  });
                }}
              >
                <View className="flex flex-row items-center flex-1">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 flex-wrap">
                      <Text
                        className={`font-montmedium font-semibold text-[16px] leading-[22px] ${
                          isLocked ? "text-[#aaa]" : "text-bigText"
                        }`}
                      >
                        {item.name}
                      </Text>
                      {(item.is_combo == 1 || item.is_combo === true) && (
                        <View className="bg-[#FF9800] px-2 py-1 rounded">
                          <Text className="text-white text-[10px] font-montmedium font-semibold">
                            COMBO
                          </Text>
                        </View>
                      )}
                      {isLocked && (
                        <View className="bg-[#999] px-2 py-1 rounded flex-row items-center gap-1">
                          <Ionicons name="lock-closed" size={10} color="white" />
                          <Text className="text-white text-[10px] font-montmedium font-semibold">
                            LOCKED
                          </Text>
                        </View>
                      )}
                    </View>
                    {isLocked && (
                      <Text className="font-montmedium text-[11px] text-[#999] mt-1">
                        Refer 4 members to unlock upgrade
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  className={`mr-1 flex-col items-center w-[28%] rounded ${
                    isLocked ? "bg-[#aaa]" : "bg-[#44699c]"
                  }`}
                >
                  {isLocked ? (
                    <View className="py-3 flex-row items-center gap-1">
                      <Ionicons name="lock-closed" size={16} color="white" />
                      <Text className="text-white font-montmedium text-[13px]">
                        Locked
                      </Text>
                    </View>
                  ) : (
                    <>
                      <View>
                        <Text className="text-white">Purchase</Text>
                      </View>
                      <View className="flex-row items-center">
                        <MaterialIcons
                          name="currency-rupee"
                          size={14}
                          color="white"
                        />
                        <Text className="text-[16px] font-montmedium font-semibold text-white ml-[2px]">
                          {item.price || item.total || 0}
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </>
  );
};

export default Packages;

const styles = StyleSheet.create({});
