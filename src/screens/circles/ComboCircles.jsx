import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import CustomStatusBar from "../custom_screens/CustomStatusBar";
import NavBack from "../custom_screens/NavBack";
import { useNavigation } from "@react-navigation/native";
import {
  formatComboCircleName,
} from "../../utils/CircleHelpers";

const ComboCircles = ({ route }) => {
  const navigation = useNavigation();
  const { comboCircles, packageId, packageName } = route.params || {};

  // comboCircles can be either an array or an object with sections
  // Handle both cases
  const allComboCircles = Array.isArray(comboCircles)
    ? comboCircles
    : comboCircles
    ? Object.values(comboCircles).flat().filter(Boolean)
    : [];

  const handleCircleSelect = (circle) => {
    // For combo circles, use formatComboCircleName to show section-specific name
    // (e.g., "5-Member Circle 1" or custom section_name) instead of package name
    const displayName = formatComboCircleName(circle);
    
    // Navigate to SelectedCircles as a separate screen
    navigation.navigate("SelectedCircles", {
      memberDetails: circle.members,
      circlesName: displayName,
      packageId: circle.package_id,
      circleCode: circle.circle_code || circle.name,
      circle: circle,
      allComboCircles: allComboCircles, // Pass all combo circles to build color array
    });
  };

  return (
    <>
      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <NavBack>
        {packageName ? `Combo: ${packageName}` : "Combo Circles"}
      </NavBack>

      <View className="flex-1 w-[95%] mx-auto">
        {/* Package Name */}
        {packageName && (
          <View className="mt-4 mb-2">
            <Text className="font-montmedium font-semibold text-[18px] text-bigText">
              {packageName}
            </Text>
          </View>
        )}

        {/* All Combo Circles List */}
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {allComboCircles.length === 0 ? (
            <View className="flex items-center justify-center py-8">
              <Text className="text-gray-500 text-base font-montmedium">
                No combo circles found
              </Text>
            </View>
          ) : (
            allComboCircles.map((circle, index) => {
              const circleDisplayName = formatComboCircleName(circle);
              return (
                <TouchableOpacity
                  key={circle.id || index}
                  className={`flex flex-row justify-between items-center px-2 py-5 w-full rounded mb-2 ${
                    index % 2 !== 0 ? "bg-[#cccccc26]" : "bg-[#acacac2f]"
                  }`}
                  onPress={() => handleCircleSelect(circle)}
                >
                  <View className="flex flex-row items-center w-[73%]">
                    <View className="">
                      <Text className="text-bigText font-montmedium font-semibold text-[17px] leading-[22px]">
                        {circleDisplayName}
                      </Text>
                      <Text className="text-smallText font-montmedium text-[12px] mt-1">
                        Circle Code: {circle.circle_code || circle.name}
                      </Text>
                      {circle.cycle && (
                        <Text className="text-smallText font-montmedium text-[11px] mt-1">
                          Cycle: {circle.cycle}
                        </Text>
                      )}
                      <View className="flex-row justify-center gap-1 mt-1">
                        <Text className="text-[13px]">
                          Status: {circle.status || "Active"}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="mr-1 py-[5px] flex-col items-center bg-[#44699c] w-[90px] rounded">
                    <View>
                      <Text className="text-white text-center">View</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default ComboCircles;

const styles = StyleSheet.create({});
