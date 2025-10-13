import React, { useEffect, useState } from "react";
import { StyleSheet, Platform, Text, View, Animated } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "@expo/vector-icons/Octicons";

const DropDown = ({
  label,
  star,
  data,
  onChange,
  value,
  labelText,
  placeholder = "Select",
  onBlur,
  error,
  search,
  searchPlaceHolder,
  defaultValueByIndex,
}) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity is 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade-in effect
      duration: 500, // Animation duration
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View>
      <Text
        className={`font-semibold mb-2 text-formText ${
          Platform.OS === "android" ? "text-[18px]" : "text-[22px]"
        }`}
      >
        {label} {star && <Text className="text-red-400 text-[17px]">*</Text>}
      </Text>

      <SelectDropdown
        data={data}
        defaultButtonText={value || "Select your country"}
        defaultValueByIndex={defaultValueByIndex} //default selected index
        onSelect={(selectedItem) => {
          onChange(selectedItem);
        }}
        renderButton={(selectedItem, isOpened) => {
          const label =
            (selectedItem && selectedItem?.[labelText]) || placeholder;
          // console.log("label", label);
          return (
            <View
              style={[
                { borderColor: error ? "red" : "#6f6f6fc1" },
                styles.dropdownButtonStyle,
              ]}
            >
              <Text
                // style={styles.dropdownButtonTxtStyle}
                className="px-[6px] font-montmedium font-normal leading-[18px] text-formText"
                style={{ flex: 1 }}
              >
                {label}
              </Text>
              <Icon
                name={isOpened ? "chevron-up" : "chevron-down"}
                style={{ fontSize: 20 }}
              />
            </View>
          );
        }}
        //for below drop down
        renderItem={(item, index, isSelected) => {
          return (
            <Animated.View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && { backgroundColor: "#D2D9DF" }),
                opacity: fadeAnim, // Apply fade animation
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0], // Adds slide-up effect during fade-in
                    }),
                  },
                ],
              }}
            >
              {/* <Icon name={item.icon} style={styles.dropdownItemIconStyle} /> */}
              {/* //dropdowntext */}
              <Text style={styles.dropdownItemTxtStyle}>
                {item?.[labelText] || "Unknown"}
              </Text>
            </Animated.View>
          );
        }}
        onBlur={onBlur}
        // showsVerticalScrollIndicator={true}
        dropdownStyle={styles.dropdownMenuStyle}
        search={search}
        searchInputStyle={styles.searchInputFeild}
        searchPlaceHolder={searchPlaceHolder}
        renderSearchInputRightIcon={() => (
          <>
            <Octicons name="search" size={24} color="black" />
          </>
        )}
      />
      <View className="h-[20px]">
        {error && <Text className="text-red-600 text-[13px]">{error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.9,
    borderRadius: 5,
    width: "100%",
    height: 43,
    paddingHorizontal: 2,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "400",
    color: "gray",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "white",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    maxHeight: 200,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 17,
    paddingLeft: 5,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  searchInputFeild: {
    borderColor: "black",
    borderWidth: 0.5,
    // backgroundColor: "green",
  },
});

export default DropDown;
