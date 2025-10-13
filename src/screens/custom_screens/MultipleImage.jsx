import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Entypo from "@expo/vector-icons/Entypo";
import {
  Pressable,
  Platform,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import PrimaryButton from "./PrimaryButton";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import { Upload_Trip_Pic } from "../../Network/ApiCalling";
import { useToast } from "react-native-toast-notifications";

const MultipleImage = ({ tripID, setModalVisible }) => {
  const [images, setImages] = useState([]);

  // console.log("images", tripID);

  const toast = useToast();

  const imagesPick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Media permission is required  to upload image");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      // mediaTypes: ImagePicker.MediaTypeOptions.Images,
      mediaTypes: ["images"],
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const newImages = result.assets;
      if (images.length + newImages.length > 5) {
        Alert.alert("You can only upload up to 5 images");
      } else {
        setImages([...images, ...newImages]);
      }
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    // console.log(images,'jbjhbjb');
  };

  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.login.token);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await Upload_Trip_Pic(tripID, images, token);

      if (res.status === 200) {
        // console.log("All trips$$$", res.data.message);
        setModalVisible(false);
        toast.hideAll();
        toast.show(
          "📸✨ From the gallery to the world—photo added successfully!🎉",
          {
            type: "success",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
          }
        );
      }
    } catch (err) {
      // console.log("fjkbs", err);
      if (err) {
        if (err.response) {
          if (err.response.status === 422) {
            // console.log("Error With 422.", err.response.data.error);
            toast.hideAll();
            toast.show(err.response.data.error, {
              type: "danger",
              placement: "top",
              duration: 4000,
              offset: 30,
              animationType: "slide-in",
            });
          } else if (err.response.status === 301) {
            console.log("Error With 301");
          } else if (err.response.status === 401) {
            console.log("Error With 401");
          } else if (err.response.status === 404) {
            console.log("Error With 404");
          } else if (err.response.status === 500) {
            // console.log("Internal Server Error");
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

      <Pressable onPress={imagesPick}>
        <View className="flex flex-row justify-center items-center border-black border-[0.5px] rounded w-[90%] mx-auto mt-6 mb-3">
          <Text
            className={`underline font-semibold ${
              Platform.OS === "android" ? "text-[16px]" : "text-[18px]"
            }`}
          >
            Upload
          </Text>
          <View className="my-3 pt-[3px] pl-2">
            <Text
              className={`text-formText font-montmedium ${
                Platform.OS === "android" ? "text-[14px]" : "text-[16px]"
              }`}
            >
              Only jpg & png format
            </Text>
          </View>
        </View>
      </Pressable>

      <View className="flex flex-row flex-wrap gap-2 w-[95%] mx-auto">
        {images.map((each, index) => (
          <View
            key={index}
            className="flex flex-row justify-between items-center p-2 rounded bg-[#C7F1FF33]"
          >
            <View className="max-w-[100px] h-[15px] overflow-hidden">
              <Text className="font-semibold font-montmedium text-[12px]">
                {each.fileName || `Image ${index + 1}`}
              </Text>
            </View>

            <Pressable onPress={() => handleDeleteImage(index)}>
              <Entypo name="cross" size={20} color="black" />
            </Pressable>
          </View>
        ))}
      </View>
      <View className="w-[90%] mx-auto my-5">
        <PrimaryButton onPress={() => handleSubmit()}>Submit</PrimaryButton>
      </View>
    </>
  );
};

export default MultipleImage;

const styles = StyleSheet.create({});
