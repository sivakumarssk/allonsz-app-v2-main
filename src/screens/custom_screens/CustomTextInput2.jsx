import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  Pressable,
} from "react-native";
import { TouchableOpacity } from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { formatToReadableDateDDMMYYYY } from "../../utils/TimeConvert";

const CustomTextInput2 = ({
  label,
  rightLabelBtn,
  style,
  labelStyle,
  value,
  placeholder,
  autoComplete,
  containerStyle,
  keyboardType,
  autoCapitalize,
  outlined,
  onBlur,
  asterisksymbol,
  leftIcon,
  rightIcon,
  numLines,
  boxWidth,
  onChangeText,
  borderColor,
  secure,
  validate,
  editable,
  errorMessage,
  errorColor = "red",
  bgColor,
  maxLength,

  minimumDate,
  maximumDate,
  disabled = false,
}) => {
  const containerBorder = outlined ? styles.outlined : styles.standard;
  const [date, setDate] = useState(value); // Initialize date state with the provided value
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("date");

  const [DateX, setDateX] = useState();
  const [MonthX, setMonthX] = useState();
  const [YearX, setYearX] = useState();

  useEffect(() => {
    // console.log("c", value);
    if (value) {
      // console.log("kkkk", date instanceof Date);
      if (date instanceof Date) {
      } else {
        const parseDate = (date) => {
          const [day, month, year] = date.split(/[-/]/).map(Number);
          return new Date(year, month - 1, day); // month is 0-based
        };

        setDateX(parseDate(value));
      }
    }
  }, [value]);

  const backgroundColor = bgColor || "white";
  // const containerBorder = outlined ? styles.outlined : styles.standard;
  const [errorData, setErrorData] = useState();
  const [borderColorDisplay, setBorderColor] = useState(borderColor);

  useEffect(() => {
    setBorderColor(borderColorDisplay);
    if (errorMessage) {
      setBorderColor("red");
    } else {
      setBorderColor(borderColor);
    }
  }, [borderColorDisplay, errorMessage]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    // setShow(Platform.OS === 'ios');
    if (Platform.OS === "ios") {
    } else {
      setShow(false);
    }
    setDate(currentDate);
    onChangeText(formatToReadableDateDDMMYYYY(currentDate));
  };

  return (
    <View style={[{ padding: 0, width: boxWidth }, style, styles.boxHeight]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          {label ? (
            <Text style={[styles.label, labelStyle]}>
              {label}{" "}
              {asterisksymbol ? <Text style={{ color: "red" }}>*</Text> : ""}
            </Text>
          ) : (
            ""
          )}
        </View>
        {rightLabelBtn ? (
          <Pressable
            onPress={() => {
              console.log("hello");
            }}
          >
            {label ? (
              <Text
                style={[
                  styles.label,
                  labelStyle,
                  { fontSize: 10, textDecorationLine: "underline" },
                ]}
              >
                {rightLabelBtn}{" "}
              </Text>
            ) : (
              ""
            )}
          </Pressable>
        ) : (
          ""
        )}
      </View>

      <TouchableOpacity
        onPress={() => {
          setShow(!show);
        }}
        style={[
          styles.container,
          containerBorder,
          { borderColor: borderColor },
          { backgroundColor: backgroundColor },
        ]}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          {Platform.OS == "ios" ? (
            <DateTimePicker
              style={{}}
              value={DateX || new Date()} // Pass date or current date if not provided
              mode={mode}
              // display={"spinner"}
              display={"compact"}
              is24Hour={true}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              onChange={onChange}
            />
          ) : (
            <>
              {show ? (
                <DateTimePicker
                  style={{}}
                  value={DateX || new Date()} // Pass date or current date if not provided
                  mode={mode}
                  // display={"spinner"}
                  display={"compact"}
                  is24Hour={true}
                  minimumDate={minimumDate}
                  maximumDate={maximumDate}
                  onChange={onChange}
                />
              ) : (
                <TextInput
                  // placeholder={placeholder ? placeholder : label ? Enter ${label} : ''}
                  value={value}
                  onChangeText={(e) => {
                    onChangeText(e); // Pass the formatted text back
                  }}
                  ellipsizeMode="tail" // Adds ellipsis at the end
                  editable={false}
                  style={{ flex: 1, height: "80%", paddingStart: 5 }}
                />
              )}
            </>
          )}
        </View>
        <View style={{ paddingLeft: 5 }}>{rightIcon}</View>
      </TouchableOpacity>
      <Text style={{ color: errorColor, marginLeft: 15 }}>{errorMessage}</Text>
    </View>
  );
};

export default CustomTextInput2;
const styles = StyleSheet.create({
  label: {
    // fontWeight: '500',
    fontWeight: "400",

    textTransform: "none",
    color: "#474464",
    marginBottom: 5,
    // fontSize:22
  },
  container: {
    height: 40,
    // height:${numLines > 1 ? (55+10*numLines) : 55},
    // padding: 10,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,

    // ...Platform.select({
    //     ios: {
    //         shadowColor: 'black',
    //         shadowOffset: { width: 0, height: 2 },
    //         shadowOpacity: 0.2,
    //         shadowRadius: 4,
    //     },
    //     android: {
    //         elevation: 2,
    //     },
    // }),
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
    // borderBottomColor: 'darkgrey',
    borderColor: "#C6C6C6",
    borderWidth: 1,
  },
});
