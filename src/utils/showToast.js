import Toast from "react-native-toast-message";

export const showToast = (type, text, text2) => {
  Toast.hide();
  Toast.show({
    type: type,
    text1: text,
    text2: text2,
    position: "top",
    topOffset: 20,
    visibilityTime: 3500,
    autoHide: true,
  });
};
