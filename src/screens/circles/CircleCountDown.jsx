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
import { Get_AllCircles, Get_Timer } from "../../Network/ApiCalling";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import NavReferral from "../custom_screens/NavReferral";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import Loader from "../custom_screens/Loader";
import { useToast } from "react-native-toast-notifications";
import { calculateRemainingTime } from "../../utils/TimeConvert";
import CounTime from "../custom_screens/CounTime";
import NavBack from "../custom_screens/NavBack";

const CircleCountDown = () => {
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
      const res = await Get_Timer(token);
      if (res.status === 200) {
        const result = res.data.timers;
        // console.log("result", res.data.timers);
        setCircles(res.data.timers);
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

      <NavBack>My Circle Timers</NavBack>

      <View className="w-[95%] mx-auto mt-3">
        <FlatList
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={circles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            const remaining = calculateRemainingTime(item.purchased_at);
            return (
              <TouchableOpacity
                className={`flex flex-row justify-between items-center px-4 py-3 w-full rounded ${
                  index % 2 !== 0 ? "bg-[#cccccc26]" : "bg-[#acacac2f]"
                }`}
                onPress={() => {
                  navigation.navigate("SelectedCircles", {
                    memberDetails: item.circle.members,
                    circlesName: item.circle.name,
                    packageId: item.package_id,
                    // circleCode: item.name,
                  });
                }}
              >
                <View className="flex flex-row items-center w-[73%]">
                  <View className="">
                    <Text className="text-bigText font-montmedium font-semibold text-[17px] leading-[22px]">
                      {item.circle.name}
                    </Text>

                    <CounTime
                      initialName={item.circle.name}
                      initialDays={remaining.Days}
                      initialHours={remaining.Hours}
                      initialMinutes={remaining.Minutes}
                      initialSeconds={remaining.Seconds}
                    />
                  </View>
                </View>
                <View className="mr-1 py-[5px] flex-col items-center bg-[#44699c] w-[90px] rounded">
                  <View>
                    <Text className="text-white">View Circle</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{}}
        />
      </View>
    </>
  );
};

export default CircleCountDown;

const styles = StyleSheet.create({});
