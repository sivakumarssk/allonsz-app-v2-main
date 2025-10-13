import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Get_AllCircles, Get_AllPastCircles } from "../../Network/ApiCalling";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import NavReferral from "../custom_screens/NavReferral";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import Loader from "../custom_screens/Loader";
import { useToast } from "react-native-toast-notifications";
import { convertDateTimeFormat } from "../../utils/TimeConvert";

const PastCircles = () => {
  const navigation = useNavigation();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [circles, setCircles] = useState([]);

  const token = useSelector((state) => state.login.token);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getCircles();
    });

    return unsubscribe; // Cleanup listener on unmount
  }, [navigation]);

  const getCircles = async () => {
    try {
      setLoading(true);
      const res = await Get_AllPastCircles(token);
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

      <NavReferral>Previous Circles</NavReferral>

      <SafeAreaView style={{ flex: 1 }}>
        <View className="w-[95%] mx-auto" style={{ flex: 1 }}>
          {circles.length === 0 ? (
            <View
              className="flex justify-center items-center"
              style={{ flex: 0.82 }}
            >
              <Text className="font-montmedium text-[#272727c5] text-[18px] text-center font-normal">
                Looks like a fresh start! No past circles recorded.
              </Text>
            </View>
          ) : (
            <FlatList
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={circles}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View
                  className={`flex justify-between items-center px-2 py-5 w-full rounded ${
                    index % 2 !== 0 ? "bg-[#cccccc26]" : "bg-[#acacac2f]"
                  }`}
                >
                  <View className="flex flex-col w-[90%]">
                    <View className="flex flex-row justify-between items-center w-full bg-re d-500">
                      <Text className="text-bigText font-montmedium font-semibold text-[17px] leading-[22px]">
                        {item.package.name}
                      </Text>
                      <View className="flex flex-col justify-end items-end">
                        <Text className="text-bigText font-montmedium font-semibold text-[12px] leading-[22px]">
                          circle code : #{item.name}
                        </Text>
                        <Text className="text-red-500 font-montmedium font-semibold text-[13px] leading-[22px]">
                          completed at :{" "}
                          {convertDateTimeFormat(item.updated_at)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
              contentContainerStyle={{}}
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default PastCircles;

const styles = StyleSheet.create({});
