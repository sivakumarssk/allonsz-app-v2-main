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
import {
  isComboCircle,
  formatComboCircleName,
} from "../../utils/CircleHelpers";

const CircleScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [circles, setCircles] = useState([]);
  const [regularCircles, setRegularCircles] = useState([]);
  const [comboCirclesByPackage, setComboCirclesByPackage] = useState({});

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
        const regularCircles = res.data.circles || [];
        const comboCirclesFromAPI = res.data.combo_circles || [];
        
        console.log("Regular circles:", regularCircles);
        console.log("Combo circles from API:", comboCirclesFromAPI);
        
        // Check if colors are coming from backend for combo circles
        if (comboCirclesFromAPI.length > 0) {
          console.log("Checking colors in combo circles:");
          comboCirclesFromAPI.forEach((circle, index) => {
            console.log(`Combo Circle ${index + 1} (ID: ${circle.id}):`);
            console.log("  - Members count:", circle.members?.length);
            if (circle.members && circle.members.length > 0) {
              console.log("  - First member:", circle.members[0]);
              console.log("  - First member color:", circle.members[0]?.color);
              console.log("  - All member colors:", circle.members.map(m => ({ position: m.position, color: m.color })));
            }
          });
        }
        
        // Group combo circles by package_id
        const comboByPackage = {};
        if (comboCirclesFromAPI.length > 0) {
          comboCirclesFromAPI.forEach((circle) => {
            const packageId = circle.package_id;
            if (!comboByPackage[packageId]) {
              comboByPackage[packageId] = [];
            }
            comboByPackage[packageId].push(circle);
          });
          setComboCirclesByPackage(comboByPackage);
        }

        // Create display list: regular circles + one entry per combo package
        const displayList = [...regularCircles];
        
        // Add combo packages (one entry per package, representing all circles)
        Object.keys(comboByPackage).forEach((packageId) => {
          const packageCircles = comboByPackage[packageId];
          if (packageCircles.length > 0) {
            // Use the first circle as representative, but mark it as combo package
            const representativeCircle = {
              ...packageCircles[0],
              isComboPackage: true,
              allComboCircles: packageCircles, // Store all circles for this package
            };
            displayList.push(representativeCircle);
          }
        });

        setCircles(displayList);
        setRegularCircles(regularCircles);
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
      <View className="flex-1 w-[95%] mx-auto">
        <Text className="font-montmedium font-semibold text-center leading-[22px] text-[13px] text-smallText">
          You've unlocked your packages! Start enjoying the benefits today. 💼
        </Text>

        <FlatList
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={circles}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            // Format circle name for combo circles
            const circleName = isComboCircle(item)
              ? formatComboCircleName(item)
              : item.package?.name || item.name;
            const displayName = isComboCircle(item)
              ? formatComboCircleName(item)
              : item.package?.name || item.name;

            return (
              <TouchableOpacity
                className={`flex flex-row justify-between items-center px-2 py-5 w-full rounded ${
                  index % 2 !== 0 ? "bg-[#cccccc26]" : "bg-[#acacac2f]"
                }`}
                onPress={() => {
                  // Navigate to ComboCircles for combo packages, SelectedCircles for regular
                  if (item.isComboPackage && item.allComboCircles) {
                    // This is a combo package - show all circles for this package
                    navigation.navigate("ComboCircles", {
                      comboCircles: item.allComboCircles,
                      packageId: item.package_id,
                      packageName: item.package?.name,
                    });
                  } else if (isComboCircle(item)) {
                    // Single combo circle - get all circles for this package
                    const packageId = item.package_id;
                    const packageCircles = comboCirclesByPackage[packageId] || [item];
                    navigation.navigate("ComboCircles", {
                      comboCircles: packageCircles,
                      packageId: packageId,
                      packageName: item.package?.name,
                    });
                  } else {
                    // Regular circle
                    navigation.navigate("SelectedCircles", {
                      memberDetails: item.members,
                      circlesName: item.package?.name || displayName,
                      packageId: item.package?.id,
                      circleCode: item.name,
                      circle: item, // Pass full circle object for 5-member circle logic
                    });
                  }
                }}
              >
                <View className="flex flex-row items-center w-[73%]">
                  <View className="">
                    {/* Show package name prominently */}
                    <Text className="text-bigText font-montmedium font-semibold text-[17px] leading-[22px]">
                      {item.package?.name || displayName}
                    </Text>
                    
                    {/* Show circle code/name below package name */}
                    <Text className="text-smallText font-montmedium text-[12px] mt-1">
                      Circle: {item.name}
                    </Text>

                    {isComboCircle(item) && (
                      <Text className="text-[11px] text-[#FF9800] font-montmedium mt-1">
                        Combo Package
                      </Text>
                    )}

                    <View className="flex-row justify-center gap-1 mt-1">
                      <Text className="text-[13px]">
                        max_downlines:
                        {item.package?.max_downlines || "N/A"}
                      </Text>
                      <Text className="text-[13px]">
                        total_members:
                        {item.package?.total_members || "N/A"}
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
            );
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View className="flex items-center justify-center py-8">
              <Text className="text-gray-500 text-base font-montmedium">
                No circles found for this section
              </Text>
            </View>
          }
        />
      </View>
    </>
  );
};

export default CircleScreen;

const styles = StyleSheet.create({});
