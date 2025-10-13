import * as MailComposer from "expo-mail-composer";
import React from "react";
import { Alert, Image, Linking, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Fontisto from "@expo/vector-icons/Fontisto";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import CustomStatusBar from "../../custom_screens/CustomStatusBar";
import NavBack from "../../custom_screens/NavBack";
import Octicons from "@expo/vector-icons/Octicons";
import { useSelector } from "react-redux";

const Support = () => {
  const navigation = useNavigation();
  const { email_number, whatsapp_number, call_number } = useSelector(
    (state) => state.settingData
  );

  console.log("whatsapp_number", email_number);

  const email = email_number || "info@allons-z.com";

  const handleSendMail = async () => {
    // console.log("hello");
    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Error", "Mail Composer is not available on this device.");
        return;
      }
      const result = await MailComposer.composeAsync({
        recipients: [email],
      });
    } catch (error) {
      // console.error("MailComposer Error:", error);
      Alert.alert("Error", "Unable to send email.");
    }
  };

  const phoneNumber = whatsapp_number || "+91 9440228963";

  const handleWhatsAppChat = async () => {
    const message = "Hello, I would like to get in touch.";
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    // window.open(url, "_blank");

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "WhatsApp is not installed on this device.");
      }
    } catch (error) {
      // console.error("WhatsApp Error:", error);
      Alert.alert("Error", "Unable to open WhatsApp chat.");
    }
  };

  return (
    <>
      <CustomStatusBar
        barStyle="dark-content"
        backgroundColor="#f2f2f2"
        // translucent
      />

      <NavBack>Support</NavBack>

      <View className="w-[88%] mx-auto mt-4">
        <TouchableOpacity
          className="flex flex-row justify-between items-center my-[14px] w-full"
          onPress={handleSendMail}
        >
          <View className="flex flex-row items-center">
            <View className="mr-3">
              <Fontisto name="email" size={24} color="black" />
            </View>
            <Text className="text-bigText font-montmedium font-semibold text-[16px] leading-[22px]">
              Send Mail
            </Text>
          </View>
          <View className="mr-1">
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>
        </TouchableOpacity>
        {/*  */}
        <TouchableOpacity
          className="flex flex-row justify-between items-center my-[14px] w-full"
          onPress={handleWhatsAppChat}
        >
          <View className="flex flex-row items-center">
            <View className="mr-3">
              <FontAwesome6 name="whatsapp" size={24} color="black" />
            </View>
            <Text className="text-bigText font-montmedium font-semibold text-[16px] leading-[22px]">
              Chat in whatsapp
            </Text>
          </View>
          <View className="mr-1">
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>
        </TouchableOpacity>
        {/*  */}
        {/* <TouchableOpacity
          className="flex flex-row justify-between items-center my-[14px] w-full"
          onPress={() => {
            navigation.navigate("RTCRefferealCode");
          }}
        >
          <View className="flex flex-row items-center">
            <Text className="text-bigText font-montmedium font-semibold text-[16px] leading-[22px]">
              Request to change reffereal Code
            </Text>
          </View>
          <View className="mr-1">
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>
        </TouchableOpacity> */}
        {/*  */}
        <TouchableOpacity
          className="flex flex-row justify-between items-center my-[14px] w-full"
          onPress={() => {
            navigation.navigate("AboutApp");
          }}
        >
          <View className="flex flex-row items-center">
            <View className="mr-3">
              <Octicons name="device-mobile" size={24} color="black" />
            </View>
            <Text className="text-bigText font-montmedium font-semibold text-[16px] leading-[22px]">
              About App
            </Text>
          </View>
          <View className="mr-1">
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Support;

const styles = StyleSheet.create({});
