import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import { Alert } from "react-native";

export const pickImage = async () => {
  const { status: existingStatus } =
    await ImagePicker.getMediaLibraryPermissionsAsync();

  if (existingStatus !== "granted") {
    // Request permissions if not already granted
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      // Alert the user and provide settings redirection
      Alert.alert(
        "Permission Required",
        "Media permission is required to upload an image. Please enable it in your app settings.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Go to Settings",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
      return null;
    }
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    // mediaTypes: ImagePicker.MediaTypeOptions.Images,
    mediaTypes: ["images"],
    allowsEditing: true,
    // aspect: [4, 5],
    quality: 1,
  });

  // console.log("Image Picker Result:", result);

  if (!result.canceled) {
    // console.log("Selected Asset:", result.assets);
    return result.assets[0]; // Assuming assets array exists
  } else {
    console.log("Image picking was canceled.");
    return null;
  }
};

export const takePhoto = async () => {
  // Request camera permissions
  const { status: cameraStatus } =
    await ImagePicker.requestCameraPermissionsAsync();
  if (cameraStatus !== "granted") {
    Alert.alert("Camera permission is required to take photos");
    return;
  }

  // Launch the camera
  const result = await ImagePicker.launchCameraAsync({
    // mediaTypes: ImagePicker.MediaTypeOptions.Images,
    mediaTypes: ["images"],
    allowsEditing: true,
    // aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0];
  }
};
