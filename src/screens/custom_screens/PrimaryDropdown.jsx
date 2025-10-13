import React, { memo, useState } from "react";
import { StyleSheet, Platform, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const PrimaryDropdown = ({
  itemsList,
  label,
  star,
  value,
  valueField,
  labelField,
  onChange,
  onBlur,
}) => {
  // const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  return (
    <>
      <View className="my-3">
        <Text
          className={`font-semibold mb-2 text-formText ${
            Platform.OS === "android" ? "text-[18px]" : "text-[22px]"
          }`}
        >
          {label} {star && <Text className="text-red-400 text-[17px]">*</Text>}
        </Text>
        <Dropdown
          className="h-[45px] flex-row items-center border-[1px] border-formText rounded-[5px] px-[6px] "
          // style={[isFocus && { borderColor: "blue" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          data={itemsList}
          maxHeight={250}
          placeholder={!isFocus ? "Select item" : "choose item"}
          value={value}
          labelField={labelField}
          valueField={valueField}
          onFocus={() => setIsFocus(true)}
          onBlur={() => {
            setIsFocus(false);
            onBlur && onBlur();
          }}
          onChange={(item) => {
            // setValue(item.value);
            onChange(item);
            // onChange(item);
            setIsFocus(false);
          }}
          //   search
          //   inputSearchStyle={styles.inputSearchStyle}
          //   searchPlaceholder="Search..."
        />
      </View>
    </>
  );
};
export default PrimaryDropdown;

const styles = StyleSheet.create({
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    color: "#7D848D",
    fontFamily: "Montserrat-Medium",
    lineHeight: 18,
    fontSize: 14,
    fontWeight: 400,
  },
  selectedTextStyle: {
    color: "#7D848D",
    fontFamily: "Montserrat-Medium",
    lineHeight: 18,
    fontSize: 14,
    fontWeight: 400,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
