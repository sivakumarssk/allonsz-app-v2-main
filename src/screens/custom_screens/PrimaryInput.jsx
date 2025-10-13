import React from "react";
import {
  StyleSheet,
  Platform,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Ionicons from "@expo/vector-icons/Ionicons";

const PrimaryInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  onFocus,
  keyboardType = "default",
  // setIsFocus,
  maxLength,
  star,
  inputMode,
  readOnly = false,
  error,
  autoCapitalize = "none",
  extrastyles,
  isSecure,
  passwordIcons,
  onPressIcon,
  contextMenuHidden,
  selectTextOnFocus,
  onKeyPress,
}) => {
  return (
    <View className={`my-[6px] ${extrastyles}`}>
      <Text
        className={`font-semibold mb-2 text-formText ${
          Platform.OS === "android" ? "text-[18px]" : "text-[18px]"
        }`}
      >
        {label} {star && <Text className="text-red-400 text-[17px]">*</Text>}
      </Text>
      <View
        className={`flex-row items-center border-[1px] focus:border-black rounded-[5px] ${
          error ? "border-[#ff3838]" : "border-[#6f6f6fc1]"
        }`}
      >
        <TextInput
          className={`px-[6px] font-montmedium leading-[18px] text-formText no-underline w-[92%] py-[10px] ${
            Platform.OS === "android" ? "text-[14px]" : "text-[16px]"
          }`}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          keyboardType={keyboardType}
          maxLength={maxLength}
          inputMode={inputMode}
          autoCapitalize={autoCapitalize}
          readOnly={readOnly}
          onKeyPress={onKeyPress}
          onFocus={onFocus}
          secureTextEntry={isSecure}
          contextMenuHidden={contextMenuHidden} //false-->can copy, cut, and paste. true-->can't
          selectTextOnFocus={selectTextOnFocus} //true-->Text gets selected when input is focused. false-> can't

          // onBlur={setIsFocus ? () => setIsFocus(true) : onBlur}
          // onFocus={setIsFocus ? () => setIsFocus(true) : ""}
          // onSubmitEditing={setIsFocus ? () => setIsFocus(true) : ""} //allows you to define an action when the user finishes typing and presses "Enter" or "Done."
        />
        {passwordIcons && (
          <TouchableOpacity onPress={onPressIcon}>
            {isSecure ? (
              <Ionicons
                name="eye-off"
                size={21}
                color={error ? "red" : "black"}
              />
            ) : (
              <FontAwesome5
                name="eye"
                size={17}
                color={error ? "red" : "black"}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
      <View className="min-h-[20px]">
        {error && <Text className="text-red-600 text-[13px]">{error}</Text>}
      </View>
    </View>
  );
};

export default PrimaryInput;

const styles = StyleSheet.create({});
