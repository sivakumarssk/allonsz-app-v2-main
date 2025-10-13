import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Get_AllCircles } from "../../Network/ApiCalling";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import NavReferral from "../custom_screens/NavReferral";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import Loader from "../custom_screens/Loader";
import { useToast } from "react-native-toast-notifications";

const CircleScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [circles, setCircles] = useState([]);

  const token = useSelector((state) => state.login.token);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getCircles(); // Call the function when screen comes into focus
    });

    return unsubscribe; // Cleanup listener on unmount
  }, [navigation]);

  const getCircles = async () => {
    try {
      setLoading(true);
      const res = await Get_AllCircles(token);
      if (res.status === 200) {
        const result = res.data.circles;
        console.log("result", res.data.circles);
        setCircles(res.data.circles);
      }
    } catch (err) {
      console.log("error", err.response.data);
      if (err) {
        if (err.response) {
          if (err.response.status === 400) {
            console.log("Error With 400.");
          } else if (err.response.status === 422) {
            console.log("Error With 422.");
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
            "Oops! Something went wrong at server side—please try again",
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

  return (
    <>
      <Loader visible={loading} />

      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <NavReferral>Referal Circles</NavReferral>
      <View className="w-[95%] mx-auto">
        <Text className="font-montmedium font-semibold text-center leading-[22px] text-[13px] text-smallText">
          You’ve unlocked your packages! Start enjoying the benefits today. 💼
        </Text>

        {/* {circles.map((item, index) => {
          return <Text key={index}>{item.name}</Text>;
        })} */}
        <FlatList
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={circles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              className={`flex flex-row justify-between items-center px-2 py-5 w-full rounded ${
                index % 2 !== 0 ? "bg-[#cccccc26]" : "bg-[#acacac2f]"
              }`}
              onPress={() => {
                // navigation.navigate("CreateRazorpay", {
                //   packageId: item.id,
                //   packagePrice: item.price,
                // });
                navigation.navigate("SelectedCircles", {
                  memberDetails: item.members,
                  circlesName: item.package.name,
                  packageId: item.package.id,
                  circleCode: item.name,
                });
              }}
            >
              <View className="flex flex-row items-center w-[73%]">
                <View className="">
                  <Text className="text-bigText font-montmedium font-semibold text-[17px] leading-[22px]">
                    {/* {item.name} */}
                    {item.package.name}
                  </Text>

                  <View className="flex-row justify-center gap-1">
                    <Text className="text-[13px]">
                      max_downlines:{item.package.max_downlines}
                    </Text>
                    <Text className="text-[13px]">
                      total_members:{item.package.total_members}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="mr-1 py-[5px] flex-col items-center bg-[#44699c] w-[90px] rounded">
                <View>
                  <Text className="text-white">View Circle</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{}}
        />
      </View>
    </>
  );
};

export default CircleScreen;

const styles = StyleSheet.create({});
