import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import * as MailComposer from "expo-mail-composer";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import {
  pickImage,
  takePhoto,
} from "../../utils/DeviceHelpers/DeveiceHelperImage";

import CustomStatusBar from "../custom_screens/CustomStatusBar";
import Loader from "../custom_screens/Loader";
import PrimaryShare from "../custom_screens/PrimaryShare";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage_Calls from "../../utils/AsyncStorage_Calls";
import { setKYCStatus, setKYCVerified } from "../redux/action/KYCverify";
import { useDispatch, useSelector } from "react-redux";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useToast } from "react-native-toast-notifications";

const ShareMail = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const toast = useToast();

  const { email_number } = useSelector((state) => state.settingData);

  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [PressedItem, setPressItem] = useState("");
  const [image, setImage] = useState({
    pan_card: null,
    aadhar_card: null,
    //aadhar_card_front:null,
    aadhar_card_back: null,
    bank_details: null,
    transaction_details: null,
  });

  const email = email_number || "info@allons-z.com";

  // const copyToClipboard = async () => {
  //   await Clipboard.setStringAsync("info@allons-z.com");
  // };

  const handleCamera = async () => {
    try {
      const result = await takePhoto();
      // console.log("edhi ra acces photo,:::", result);
      if (result) {
        const selectedImage = result;
        setImage((prev) => ({ ...prev, [PressedItem]: selectedImage })); // Set the image preview (if needed)
      }
    } catch (error) {
      console.log("Access Permission", error);
    } finally {
      setModalVisible(false);
    }
  };

  const handleGallery = async () => {
    try {
      setModalVisible(false);
      const result = await pickImage();
      // console.log("edhi ra image,:::", result);
      if (result) {
        const selectedImage = result;
        // console.log("selectedImage", selectedImage);
        setImage((prev) => ({ ...prev, [PressedItem]: selectedImage })); // Set the image preview (if needed)
      }
    } catch (error) {
      console.log("Access Permission", error);
    } finally {
      setModalVisible(false);
    }
  };

  // useEffect(() => {
  //   console.log(image);
  // });

  useEffect(() => {
    if (image.aadhar_card) {
      toast.hideAll();
      toast.show("Could you please upload the back side of your Aadhar card?", {
        type: "warning",
        placement: "top",
        duration: 4000,
        offset: 30,
        style: { paddingHorizontal: 9 },
        animationType: "slide-in",
      });
    }
  }, [image.aadhar_card]);

  const redirectToMail = async () => {
    if (!image.pan_card || !image.aadhar_card || !image.bank_details) {
      Alert.alert(
        "Missing Documents",
        "Please select all the documents (Pan Card, Aadhar Card and Bank Details) and send them to the email ID below"
      );
      return;
    }

    const emailBody = "Please find the selected documents attached.";

    const attachments = [];
    const ArraySting = [];

    const addAttachment = (fileUri, mimeType, filename) => {
      if (fileUri) {
        attachments.push({
          uri: fileUri,
          mimeType: mimeType,
          filename: filename,
        });
      }
    };

    if (image.pan_card) {
      const panCardUri = image.pan_card.uri;
      const panCardType = image.pan_card.mimeType;
      const panCardFilename = image.pan_card.fileName;
      addAttachment(panCardUri, panCardType, panCardFilename);
      ArraySting.push(panCardUri);
    }

    // Add Aadhar Card if it exists and is a PNG/JPG
    if (image.aadhar_card) {
      const aadharCardUri = image.aadhar_card.uri;
      const aadharCardType = image.aadhar_card.mimeType;
      const aadharCardFilename = image.aadhar_card.fileName;
      addAttachment(aadharCardUri, aadharCardType, aadharCardFilename);
      ArraySting.push(aadharCardUri);
    }

    // Add Aadhar Card back if it exists and is a PNG/JPG
    if (image.aadhar_card_back) {
      const aadharCardBackUri = image.aadhar_card_back.uri;
      const aadharCardBackType = image.aadhar_card_back.mimeType;
      const aadharCardBackFilename = image.aadhar_card_back.fileName;
      addAttachment(
        aadharCardBackUri,
        aadharCardBackType,
        aadharCardBackFilename
      );
      ArraySting.push(aadharCardBackUri);
    }

    // Add Bank Details if it exists and is a PNG/JPG
    if (image.bank_details) {
      const bankUri = image.bank_details.uri;
      const bankType = image.bank_details.mimeType;
      const bankFilename = image.bank_details.fileName;
      addAttachment(bankUri, bankType, bankFilename);
      ArraySting.push(bankUri);
    }

    // Add Transaction Details if it exists and is a PNG/JPG
    if (image.transaction_details) {
      const transactionUri = image.transaction_details.uri;
      const transactionType = image.transaction_details.mimeType;
      const transactionFilename = image.transaction_details.fileName;
      addAttachment(transactionUri, transactionType, transactionFilename);
      ArraySting.push(transactionUri);
    }

    try {
      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert("Error", "Mail Composer is not available on this device.");
        return;
      }
      // Compose the email with the selected attachments
      const result = await MailComposer.composeAsync({
        recipients: [email],
        subject: "Selected Documents",
        body: emailBody,
        attachments: ArraySting,
      });

      if (result.status === MailComposer.MailComposerStatus.SENT) {
        // Alert.alert("Success", "Email sent successfully!");
        navigation.navigate("SetUpSucces", {
          previousScreen: "ShareDocumentScreen",
        });

        //4638 1689 3060
      } else {
        Alert.alert("Failed", "Failed to send email.");
      }
    } catch (error) {
      // console.error("MailComposer Error:", error);
      Alert.alert("Error", "Unable to send email.");
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
      <View
        className="justify-center items-center w-[90%] mx-auto"
        style={{ flex: 0.9 }}
      >
        <Text className="font-montmedium font-semibold text-[28px] leading-[34px] tracking-wider text-bigText text-center w-[92%]">
          Please share these details to below mail id
        </Text>
        <View>
          <PrimaryShare
            present={image.pan_card}
            onPress={() => {
              setModalVisible(true);
              setPressItem("pan_card");
            }}
          >
            pan card
          </PrimaryShare>
          {!image.aadhar_card ? (
            <PrimaryShare
              present={image.aadhar_card}
              onPress={() => {
                setModalVisible(true);
                setPressItem("aadhar_card");
              }}
            >
              aadhar card
            </PrimaryShare>
          ) : (
            <PrimaryShare
              present={image.aadhar_card_back}
              onPress={() => {
                setModalVisible(true);
                setPressItem("aadhar_card_back");
              }}
            >
              Aadhar card back.
            </PrimaryShare>
          )}
          <PrimaryShare
            present={image.bank_details}
            onPress={() => {
              setModalVisible(true);
              setPressItem("bank_details");
            }}
          >
            bank details
          </PrimaryShare>
          <PrimaryShare
            present={image.transaction_details}
            onPress={() => {
              setModalVisible(true);
              setPressItem("transaction_details");
            }}
          >
            others Documents
          </PrimaryShare>
        </View>
        <View className="flex flex-row justify-center items-center my-4">
          <TouchableOpacity
            onPress={redirectToMail}
            className="flex flex-row items-center"
          >
            <MaterialIcons name="content-copy" size={20} color="#44689C" />
            <Text className="text-primary underline font-bold text-[18px] ml-1">
              {email}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="w-[80%] mx-auto">
          <Text className="text-center font-montmedium font-medium text-[12px] leading-[14px] text-smallText">
            After verifing your proff you will be directed to the Home Page !
          </Text>
        </View>

        <View className="flex flex-row flex-wrap gap-2 mt-2">
          {image.pan_card && (
            <View className="relative">
              <Image
                source={{ uri: image.pan_card.uri }}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
              <View className="absolute bottom-[2px] w-full">
                <Pressable
                  onPress={() =>
                    setImage((prev) => ({ ...prev, pan_card: null }))
                  }
                >
                  <Text className="border-[0.5px] bg-[#b8b8b8ee] font-medium text-center mt-[2px] w-[80%] mx-auto rounded">
                    Remove
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
          {image.aadhar_card && (
            <View className="relative">
              <Image
                source={{ uri: image.aadhar_card.uri }}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
              <View className="absolute bottom-[2px] w-full">
                <Pressable
                  onPress={() =>
                    setImage((prev) => ({ ...prev, aadhar_card: null }))
                  }
                >
                  <Text className="border-[0.5px] bg-[#b8b8b8ee] font-medium text-center mt-[2px] w-[80%] mx-auto rounded">
                    Remove
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
          {image.aadhar_card_back && (
            <View className="relative">
              <Image
                source={{ uri: image.aadhar_card_back.uri }}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
              <View className="absolute bottom-[2px] w-full">
                <Pressable
                  onPress={() =>
                    setImage((prev) => ({ ...prev, aadhar_card_back: null }))
                  }
                >
                  <Text className="border-[0.5px] bg-[#b8b8b8ee] font-medium text-center mt-[2px] w-[80%] mx-auto rounded">
                    Remove
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
          {image.bank_details && (
            <View className="relative">
              <Image
                source={{ uri: image.bank_details.uri }}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
              <View className="absolute bottom-[2px] w-full">
                <Pressable
                  onPress={() =>
                    setImage((prev) => ({ ...prev, bank_details: null }))
                  }
                >
                  <Text className="border-[0.5px] bg-[#b8b8b8ee] font-medium text-center mt-[2px] w-[80%] mx-auto rounded">
                    Remove
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
          {image.transaction_details && (
            <View className="relative">
              <Image
                source={{ uri: image.transaction_details.uri }}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
              <View className="absolute bottom-[2px] w-full">
                <Pressable
                  onPress={() =>
                    setImage((prev) => ({ ...prev, transaction_details: null }))
                  }
                >
                  <Text className="border-[0.5px] bg-[#b8b8b8ee] font-medium text-center mt-[2px] w-[80%] mx-auto rounded">
                    Remove
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>
      {/* <View className="flex items-end" style={{ flex: 0.1 }}>
        <Pressable
          onPress={() => {
            dispatch(setKYCVerified(true));
            setTimeout(() => {
              navigation.navigate("Home");
            }, 800);
          }}
        >
          <Text className="pr-5 underline text-[#44699c] text-[16px] lowercase">
            {`Skip>>`}
          </Text>
        </Pressable>
      </View> */}

      {/* model */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        // onRequestClose={() => {
        //   setModalVisible(!modalVisible);
        // }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <View className="flex-1 justify-center items-center bg-[#0000005e]">
            <View className="bg-white w-[80%] rounded p-2">
              <View className="flex flex-row justify-center items-center">
                <Text className="text-[#44689C] font-montmedium text-[18px] font-semibold">
                  Choose an Option
                </Text>
              </View>
              <View className="flex flex-row justify-evenly my-5">
                <Pressable
                  onPress={() => {
                    // console.log("clicked camera");
                    handleCamera();
                  }}
                >
                  <View className="bg-[#44699c] rounded items-center p-2">
                    <SimpleLineIcons name="camera" size={24} color="white" />
                    <Text className="text-white font-montmedium text-[14px] leading-[16px] mt-1">
                      CAMERA
                    </Text>
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => {
                    handleGallery();
                    // console.log("clicked gallery");
                  }}
                >
                  <View className="bg-[#44699c] rounded items-center p-2">
                    <Ionicons name="images-outline" size={25} color="white" />
                    <Text className="text-white font-montmedium text-[14px] leading-[16px] mt-1">
                      GALLERY
                    </Text>
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default ShareMail;

const styles = StyleSheet.create({});
