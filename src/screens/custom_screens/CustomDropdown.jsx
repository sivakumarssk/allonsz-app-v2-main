import React, { useState } from "react";
import { StyleSheet, Text, View, Image, Platform } from "react-native";

import { Feather, FontAwesome } from "@expo/vector-icons";

import SelectDropdown from "react-native-select-dropdown";
import AddIcon from "../../../assets/SVG/AddIcon";

const CustomDropdown = ({
  label,
  style,
  labelStyle,
  value,
  placeholder = "Select",
  onChange,
  outlined,
  onBlur,
  asterisksymbol,
  leftIcon,
  rightIcon,
  numLines,
  boxWidth,

  borderColor,
  secure,
  validate,
  editable,
  errorMessage,
  errorColor = "red",
  bgColor,
  maxLength,
  items,
  selectedValue,
  DropDownData,
  DropDownHeigth,
}) => {
  const backgroundColor = bgColor || "white";
  const containerBorder = styles.outlined;

  return (
    // <View style={[{ padding: 0, width: boxWidth, }, style, styles.boxHeight]}>
    <View style={[{ padding: 0, width: boxWidth }, style, styles.boxHeight]}>
      {label ? <Text style={styles.label}>{label}</Text> : ""}

      <SelectDropdown
        data={DropDownData}
        onSelect={(selectedItem, index) => {
          onChange(selectedItem);
          // console.log(selectedItem.name);
          // console.log("selected item", selectedItem, index);
        }}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View
              style={[
                styles.container,
                styles.DropContainer,
                containerBorder,
                { borderColor: borderColor },
                { backgroundColor: backgroundColor },
              ]}
            >
              {selectedItem ? (
                selectedItem.images ? (
                  <Image
                    source={selectedItem.images}
                    style={{ width: 40, height: 35, resizeMode: "center" }}
                  />
                ) : (
                  ""
                )
              ) : (
                // <View style={{ width: 35, height: 35 }}></View>
                ""
              )}

              <Text style={styles.dropdownButtonTxtStyle}>
                {(selectedItem && selectedItem.name) || placeholder}
              </Text>
              {/* <Feather name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} /> */}

              <FontAwesome
                name={isOpened ? "caret-up" : "caret-down"}
                style={styles.dropdownButtonArrowStyle}
              />
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(isSelected && { backgroundColor: "#FF6757" }),
              }}
            >
              {/* <Icon name={item.icon} style={styles.dropdownItemIconStyle} /> */}
              {item.images ? (
                <Image
                  source={item.images}
                  style={{ width: 40, height: 35, resizeMode: "center" }}
                />
              ) : (
                <View style={{ height: 35 }}></View>
              )}
              <Text
                style={[styles.dropdownItemTxtStyle, { textAlign: "left" }]}
              >
                {item.name}
              </Text>
              {/* <Image source={isSelected ? require('./selected.png') : require('./unselected.png')} style={{ width: 25, height: 25 }} /> */}
              {item.name == "Create new Wish List" ? (
                <AddIcon />
              ) : (
                // <Image source={isSelected ? require('./selected.png') : require('./unselected.png')} style={{ width: 25, height: 25 }} />
                ""
              )}
            </View>
          );
        }}
        // showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />
      <Text style={{ color: errorColor, marginLeft: 15, fontSize: 12 }}>
        {errorMessage}
      </Text>
    </View>
  );
};

export default CustomDropdown;

const styles = StyleSheet.create({
  label: {
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "none",
    fontFamily: "BalooTamma2-Bold",
  },
  container: {
    padding: 10,

    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,

    ...Platform.select({
      ios: {
        // height: 55
      },
      android: {
        // height:80
        paddingVertical: 12,
      },
    }),

    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  DropContainer: {
    flexDirection: "row",
    // justifyContent: 'space-between',
    alignItems: "center",
    paddingHorizontal: 10,
    // paddingVertical:10
    // backgroundColor: '#E9ECEF',
  },
  dropdownButtonTxtStyle: {
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 21,
    // color: '#474464',
    // fontFamily: 'Poppins-Regular',
    // fontFamily: 'BalooTamma2-Bold',
    flex: 1,
    marginHorizontal: 10,
  },
  dropdownButtonArrowStyle: {
    fontSize: 25,
    // color:'#474464',
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    // justifyContent: 'center',
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    // color: '#151E26',
    marginHorizontal: 10,
  },
  dropdownMenuStyle: {
    // backgroundColor: '#E9ECEF',
    borderRadius: 8,
    // height: 300,

    ...Platform.select({
      ios: {},
      android: {
        marginTop: -30,
      },
    }),
  },
  boxHeight: {
    // marginTop:5,
    ...Platform.select({
      ios: {
        // height:80,
        marginVertical: 5,
      },
      android: {
        // height:80
      },
    }),
  },
  outlined: {
    // borderBottomColor: '#48484A',
    borderColor: "#48484A",
    borderWidth: 0.9,
    borderCurve: 50,
  },
});
