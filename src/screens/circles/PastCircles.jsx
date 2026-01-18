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
import { isComboCircle } from "../../utils/CircleHelpers";

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
        // Get regular completed circles
        const regularCompletedCircles = res.data.circles || [];
        
        // Get combo completed circles (if API returns them)
        const comboCompletedCircles = res.data.combo_circles || [];
        
        // Merge both arrays to show all completed circles
        const allCompletedCircles = [...regularCompletedCircles, ...comboCompletedCircles];
        
        // Sort by completion date (most recent first)
        allCompletedCircles.sort((a, b) => {
          const dateA = new Date(a.updated_at || a.completed_at || 0);
          const dateB = new Date(b.updated_at || b.completed_at || 0);
          return dateB - dateA; // Descending order (newest first)
        });
        
        console.log("Completed circles (regular + combo):", allCompletedCircles);
        setCircles(allCompletedCircles);
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
                <TouchableOpacity
                  className={`flex flex-row justify-between items-center px-2 py-5 w-full rounded ${
                    index % 2 !== 0 ? "bg-[#cccccc26]" : "bg-[#acacac2f]"
                  }`}
                  onPress={() => {
                    // Navigate to view the completed circle
                    // For combo circles, we can still navigate to SelectedCircles to view the circle visualization
                    // The SelectedCircles component will handle combo circles appropriately
                    navigation.navigate("SelectedCircles", {
                      memberDetails: item.members || [],
                      circlesName: item.package?.name || item.name || "Completed Circle",
                      packageId: item.package_id || item.package?.id,
                      circleCode: item.name,
                      circle: item, // Pass full circle object for proper rendering
                    });
                  }}
                >
                  <View className="flex flex-col w-[73%]">
                    <View className="flex flex-row justify-between items-center w-full">
                      <View className="flex-1">
                        <Text className="text-bigText font-montmedium font-semibold text-[17px] leading-[22px]">
                          {item.package?.name || "N/A"}
                        </Text>
                        {/* Show combo indicator if it's a combo circle */}
                        {(item.section || item.package?.is_combo == 1) && (
                          <View className="bg-[#FF9800] px-2 py-1 rounded mt-1 self-start">
                            <Text className="text-white text-[10px] font-montmedium font-semibold">
                              COMBO
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View className="mt-2">
                      <Text className="text-bigText font-montmedium font-semibold text-[12px] leading-[22px]">
                        Circle Code: {item.name}
                      </Text>
                      {/* Show section and cycle for combo circles */}
                      {item.section && (
                        <Text className="text-bigText font-montmedium text-[11px] leading-[18px] text-gray-600 mt-1">
                          {item.section === "five_a" ? "5-Member 1" : 
                           item.section === "five_b" ? "5-Member 2" : 
                           item.section === "twentyone" ? "21-Member" : item.section}
                          {item.cycle && ` - Cycle ${item.cycle}`}
                        </Text>
                      )}
                      <Text className="text-red-500 font-montmedium font-semibold text-[13px] leading-[22px] mt-1">
                        Completed: {convertDateTimeFormat(item.updated_at || item.completed_at)}
                      </Text>
                    </View>
                  </View>
                  <View className="mr-1 py-[5px] flex-col items-center bg-[#44699c] w-[90px] rounded">
                    <View>
                      <Text className="text-white text-center">View Circle</Text>
                    </View>
                  </View>
                </TouchableOpacity>
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
