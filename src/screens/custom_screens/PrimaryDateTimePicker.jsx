import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Platform,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatToReadableDateDDMMYYYY } from "../../utils/TimeConvert";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const PrimaryDateTimePicker = ({
  label,
  placeholder,
  value,
  onBlur,
  onChangeText,
  keyboardType = "default",
  maxLength,
  star,
  inputMode,
  readOnly = false,
  error,
  autoCapitalize = "none",
  extrastyles,
  mode,
  minimumDate,
  maximumDate,
}) => {
  const [date, setDate] = useState(value ? new Date(value) : null); // Initialize date state with the provided value
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (value) {
      setDate(new Date(value));
    }
  }, [value]);

  const onChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShow(false);
      return;
    }

    const currentDate = selectedDate || date; // Use selected date or current date
    setDate(currentDate);

    console.log("currentDate", currentDate);

    // Pass the `Date` object to `onChangeText`
    if (onChangeText) {
      onChangeText(currentDate); // Pass the Date object, not a formatted string
    }

    if (Platform.OS !== "ios") {
      setShow(false); // For Android, close the picker after selection
    }
  };

  return (
    <View className={`my-[6px] ${extrastyles}`}>
      <Text
        className={`font-semibold mb-2 text-formText ${
          Platform.OS === "android" ? "text-[18px]" : "text-[22px]"
        }`}
      >
        {label} {star && <Text className="text-red-400 text-[17px]">*</Text>}
      </Text>
      <View
        className={`flex-row items-center border-[1px] focus:border-black rounded-[5px] h-[40px] ${
          error ? "border-[#ff3838]" : "border-[#6f6f6fc1]"
        }`}
      >
        {Platform.OS === "ios" ? (
          <DateTimePicker
            value={date || new Date()}
            mode={mode}
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
                value={date || new Date()} // Pass date or current date if not provided
                mode={mode}
                display={"compact"}
                is24Hour={true}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                onChange={onChange}
              />
            ) : (
              <TextInput
                value={
                  date
                    ? formatToReadableDateDDMMYYYY(date) // Display formatted date if available
                    : placeholder // Otherwise, show the placeholder
                }
                editable={!readOnly}
                keyboardType={keyboardType}
                maxLength={maxLength}
                onBlur={onBlur}
                autoCapitalize={autoCapitalize}
                inputMode={inputMode}
                className={`px-[6px] font-montmedium leading-[18px] text-formText no-underline w-[92%] ${
                  Platform.OS === "android" ? "text-[14px]" : "text-[16px]"
                }`}
                onFocus={() => setShow(true)}
              />
            )}
          </>
        )}
        <MaterialIcons name="date-range" size={20} color="black" />
      </View>
      {error && (
        <Text className="text-red-400 text-[14px] mt-[2px]">{error}</Text>
      )}
    </View>
  );
};

export default PrimaryDateTimePicker;
