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
import { useNavigation } from "@react-navigation/native";
import { useToast } from "react-native-toast-notifications";
import Loader from "../../custom_screens/Loader";

const Packages = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const [packDetails, setPackDetails] = useState(null);

  const token = useSelector((state) => state.login.token);

  useEffect(() => {
    const getPackages = async () => {
      try {
        setLoading(true);
        const res = await Get_Packages(token);
        if (res.status === 200) {
          const result = res.data.packages;
          // console.log("result", result);
          setPackDetails(result);
        }
      } catch (err) {
        // console.log("error", err.response.data);
        if (err) {
          if (err.response) {
            const status = err.response.status;
            const message = err.response.data.error;

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

    getPackages();
  }, []);

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />
      <NavBack>Packages</NavBack>

      <View className="flex-1 w-[95%] mx-auto mt-4">
        {/* <Text className="text-center font-montmedium mt-5">
          Unlock the benefits—purchase now!
        </Text> */}
        <FlatList
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={packDetails}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              className={`flex flex-row justify-between items-center px-2 py-5 w-full rounded ${
                index % 2 !== 0 ? "bg-[#cccccc26]" : "bg-[#acacac2f]"
              }`}
              onPress={() => {
                navigation.navigate("CreateRazorpay", {
                  packageId: item.id,
                  packagePrice: item.price,
                });
              }}
            >
              <View className="flex flex-row items-center">
                <View>
                  <Text className="text-bigText font-montmedium font-semibold text-[16px] leading-[22px]">
                    {item.name}
                  </Text>

                  <View className="flex-row justify-center gap-1">
                    <Text className="text-[12px]">
                      max_downlines:{item.max_downlines}
                    </Text>
                    <Text className="text-[12px]">
                      total_members:{item.total_members}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="mr-1 flex-col items-center bg-[#44699c] w-[28%] rounded">
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
                    {item.price}
                  </Text>
                </View>
                {/* <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  color="black"
                /> */}
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </>
  );
};

export default Packages;

const styles = StyleSheet.create({});
